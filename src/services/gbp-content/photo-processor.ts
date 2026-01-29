/**
 * Photo Processor Service
 *
 * Orchestrates the photo collection flow:
 * 1. Download photo from WhatsApp immediately (URL expires in 5 min!)
 * 2. Validate image quality
 * 3. Ask owner to confirm category
 * 4. Queue for upload to GBP
 *
 * Per CONTEXT.md: Basic quality checks, ask for category, upload within 24h.
 */

import { downloadWhatsAppMedia } from '../media/whatsapp-download';
import { validateImage, prepareImageForUpload, type ImageValidationResult } from '../media/image-validator';
import { createWhatsAppClient, sendTextMessage } from '../whatsapp';
import { notificationQueue } from '../../queue';
import { db } from '../../db';
import { photoRequests } from '../../db/schema';
import { eq, and, or } from 'drizzle-orm';
import type { PhotoCategory } from '../google/media';

// Simple category mapping for user-friendly Hebrew prompts
const CATEGORY_MAP: Record<string, PhotoCategory> = {
  'חנות': 'INTERIOR',
  'בית עסק': 'INTERIOR',
  'פנים': 'INTERIOR',
  'חוץ': 'EXTERIOR',
  'מבחוץ': 'EXTERIOR',
  'מוצר': 'PRODUCT',
  'מוצרים': 'PRODUCT',
  'צוות': 'TEAMS',
  'עובדים': 'TEAMS',
  'אוכל': 'FOOD_AND_DRINK',
  'מנה': 'FOOD_AND_DRINK',
  'תפריט': 'MENU',
  'עבודה': 'AT_WORK',
  'כללי': 'ADDITIONAL',
  'אחר': 'ADDITIONAL',
};

export interface ProcessedPhoto {
  mediaId: string;
  buffer: Buffer;
  validation: ImageValidationResult;
  tenantId: string;
  photoRequestId?: string;
}

// Temporary storage for photos pending category confirmation
// In production, use Redis or similar with TTL
const pendingPhotos = new Map<string, ProcessedPhoto>();

/**
 * Get ISO week number.
 * Used to match photos to weekly photo requests.
 */
export function getISOWeek(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week, year: d.getUTCFullYear() };
}

/**
 * Process a photo received from WhatsApp.
 *
 * Downloads immediately (critical - URL expires in 5 min!),
 * validates quality, and responds to owner.
 *
 * @param tenantId - Tenant UUID
 * @param mediaId - WhatsApp media ID
 * @param accessToken - WhatsApp access token
 * @param ownerPhone - Owner's phone number
 * @returns Processing result
 */
export async function processReceivedPhoto(
  tenantId: string,
  mediaId: string,
  accessToken: string,
  ownerPhone: string
): Promise<{ success: boolean; message: string }> {
  console.log(`[photo-processor] Processing photo ${mediaId} for tenant ${tenantId}`);

  try {
    // Step 1: Download immediately (URL expires in 5 minutes!)
    const downloaded = await downloadWhatsAppMedia(mediaId, accessToken);
    console.log(`[photo-processor] Downloaded ${downloaded.fileSize} bytes`);

    // Step 2: Validate image quality
    const validation = await validateImage(downloaded.buffer);

    if (!validation.valid) {
      // Send friendly rejection message in Hebrew
      const client = await createWhatsAppClient(tenantId);
      if (client) {
        await sendTextMessage(client, ownerPhone, validation.reason || 'התמונה לא מתאימה');
      }
      return { success: false, message: validation.reason || 'Validation failed' };
    }

    // Step 3: Find active photo request for this week
    const { week, year } = getISOWeek(new Date());
    const [activeRequest] = await db
      .select()
      .from(photoRequests)
      .where(
        and(
          eq(photoRequests.tenantId, tenantId),
          eq(photoRequests.week, week),
          eq(photoRequests.year, year),
          or(eq(photoRequests.status, 'sent'), eq(photoRequests.status, 'received'))
        )
      )
      .limit(1);

    // Step 4: Prepare image for upload
    const preparedBuffer = await prepareImageForUpload(downloaded.buffer);

    // Step 5: Store pending photo and ask for category
    const pendingKey = `${tenantId}:${mediaId}`;
    pendingPhotos.set(pendingKey, {
      mediaId,
      buffer: preparedBuffer,
      validation,
      tenantId,
      photoRequestId: activeRequest?.id,
    });

    // Ask for category in Hebrew
    const client = await createWhatsAppClient(tenantId);
    if (client) {
      await sendTextMessage(
        client,
        ownerPhone,
        `תמונה מצוינת! זה נראה כמו:\n` +
        `1. חנות/בית עסק\n` +
        `2. מוצר\n` +
        `3. צוות\n` +
        `4. אוכל\n` +
        `5. אחר\n\n` +
        `שלח את המספר או תאר במילים`
      );
    }

    // Update photo request status
    if (activeRequest) {
      await db
        .update(photoRequests)
        .set({
          status: 'received',
          receivedAt: new Date(),
          mediaIds: [...(activeRequest.mediaIds || []), mediaId],
          updatedAt: new Date(),
        })
        .where(eq(photoRequests.id, activeRequest.id));
    }

    return { success: true, message: 'Photo received, waiting for category' };
  } catch (error) {
    console.error(`[photo-processor] Error processing photo:`, error);
    const client = await createWhatsAppClient(tenantId);
    if (client) {
      await sendTextMessage(
        client,
        ownerPhone,
        'לא הצלחנו לעבד את התמונה. נא לנסות שוב'
      );
    }
    return { success: false, message: String(error) };
  }
}

/**
 * Handle category selection from owner.
 *
 * @param tenantId - Tenant UUID
 * @param mediaId - WhatsApp media ID of pending photo
 * @param categoryText - Category text from owner
 * @param ownerPhone - Owner's phone number
 * @returns Whether category was recognized and upload queued
 */
export async function handleCategorySelection(
  tenantId: string,
  mediaId: string,
  categoryText: string,
  ownerPhone: string
): Promise<boolean> {
  const pendingKey = `${tenantId}:${mediaId}`;
  const pendingPhoto = pendingPhotos.get(pendingKey);

  if (!pendingPhoto) {
    console.log(`[photo-processor] No pending photo for ${pendingKey}`);
    return false;
  }

  // Parse category
  const category = parseCategory(categoryText);

  // Queue for upload
  await notificationQueue.add(
    'photo-upload',
    {
      tenantId,
      mediaId,
      category,
      buffer: pendingPhoto.buffer.toString('base64'),
      photoRequestId: pendingPhoto.photoRequestId,
    },
    {
      delay: 0, // Upload immediately, but batched via worker
      attempts: 3,
      backoff: { type: 'exponential', delay: 60000 },
    }
  );

  // Clean up pending
  pendingPhotos.delete(pendingKey);

  // Confirm to owner
  const client = await createWhatsAppClient(tenantId);
  if (client) {
    await sendTextMessage(
      client,
      ownerPhone,
      'מעולה! התמונה בתהליך העלאה לגוגל. נעדכן אותך כשזה יסתיים.'
    );
  }

  return true;
}

/**
 * Check if there's a pending photo for this tenant.
 * Used to detect category response context.
 */
export function hasPendingPhoto(tenantId: string): string | null {
  for (const [key, photo] of pendingPhotos.entries()) {
    if (photo.tenantId === tenantId) {
      return photo.mediaId;
    }
  }
  return null;
}

/**
 * Parse category from user text input.
 */
function parseCategory(text: string): PhotoCategory {
  const normalized = text.trim().toLowerCase();

  // Check for number selection
  const numberMap: Record<string, PhotoCategory> = {
    '1': 'INTERIOR',
    '2': 'PRODUCT',
    '3': 'TEAMS',
    '4': 'FOOD_AND_DRINK',
    '5': 'ADDITIONAL',
  };
  if (numberMap[normalized]) {
    return numberMap[normalized];
  }

  // Check for text match
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  // Default to ADDITIONAL
  return 'ADDITIONAL';
}
