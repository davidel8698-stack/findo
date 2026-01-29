/**
 * Photo Upload Worker
 *
 * Processes photo upload jobs:
 * 1. Upload photo buffer to R2 storage (public URL)
 * 2. Upload to GBP via sourceUrl
 * 3. Notify owner of success
 *
 * Per CONTEXT.md: Upload within 24 hours, confirm with link.
 */

import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { uploadToR2, isR2Configured } from '../../services/storage/r2';
import { uploadPhotoFromUrl, type PhotoCategory } from '../../services/google/media';
import { createWhatsAppClient, sendTextMessage } from '../../services/whatsapp';
import { db } from '../../db';
import { gbpPhotos, photoRequests, tenants, googleConnections } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

interface PhotoUploadJob {
  tenantId: string;
  mediaId: string;
  category: PhotoCategory;
  buffer: string; // Base64 encoded
  photoRequestId?: string;
}

async function processPhotoUpload(job: Job<PhotoUploadJob>): Promise<void> {
  if (job.name !== 'photo-upload') return;

  const { tenantId, mediaId, category, buffer, photoRequestId } = job.data;
  console.log(`[photo-upload] Processing upload for tenant ${tenantId}`);

  // Check R2 configuration
  if (!isR2Configured()) {
    throw new Error('R2 storage not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL');
  }

  try {
    // Get tenant and Google connection
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);

    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const [googleConn] = await db
      .select()
      .from(googleConnections)
      .where(and(
        eq(googleConnections.tenantId, tenantId),
        eq(googleConnections.status, 'active')
      ))
      .limit(1);

    if (!googleConn) {
      throw new Error(`No active Google connection for tenant ${tenantId}`);
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(buffer, 'base64');

    // Upload to R2 storage
    const filename = `${mediaId}.jpg`;
    const { publicUrl } = await uploadToR2(tenantId, filename, imageBuffer);
    console.log(`[photo-upload] Uploaded to R2: ${publicUrl}`);

    // Upload to GBP
    const gbpPhoto = await uploadPhotoFromUrl(
      tenantId,
      googleConn.accountId,
      googleConn.locationId || '',
      publicUrl,
      category
    );

    console.log(`[photo-upload] Uploaded to GBP: ${gbpPhoto.mediaItemId}`);

    // Record in database
    await db.insert(gbpPhotos).values({
      id: crypto.randomUUID(),
      tenantId,
      photoRequestId: photoRequestId || null,
      mediaItemId: gbpPhoto.mediaItemId,
      category,
      sourceUrl: publicUrl,
      status: 'processing', // GBP takes 24-48h to process
      uploadedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update photo request if linked
    if (photoRequestId) {
      const [request] = await db
        .select()
        .from(photoRequests)
        .where(eq(photoRequests.id, photoRequestId))
        .limit(1);

      if (request) {
        await db
          .update(photoRequests)
          .set({
            status: 'uploaded',
            uploadedAt: new Date(),
            gbpMediaIds: [...(request.gbpMediaIds || []), gbpPhoto.mediaItemId],
            updatedAt: new Date(),
          })
          .where(eq(photoRequests.id, photoRequestId));
      }
    }

    // Notify owner
    if (tenant.ownerPhone) {
      const client = await createWhatsAppClient(tenantId);
      if (client) {
        await sendTextMessage(
          client,
          tenant.ownerPhone,
          `התמונה עלתה בהצלחה!\n\n` +
          `חשוב לדעת: גוגל מעבד את התמונות לפני הצגתן בפרופיל.\n` +
          `התמונה תופיע בפרופיל העסקי שלך תוך 24-48 שעות.\n` +
          `תודה שאתה שומר על הפרופיל מעודכן!`
        );
      }
    }

  } catch (error) {
    console.error(`[photo-upload] Error:`, error);

    // Notify owner of failure
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);

    if (tenant?.ownerPhone) {
      try {
        const client = await createWhatsAppClient(tenantId);
        if (client) {
          await sendTextMessage(
            client,
            tenant.ownerPhone,
            'לא הצלחנו להעלות את התמונה לגוגל. נסה שוב מאוחר יותר או פנה לתמיכה.'
          );
        }
      } catch (notifyError) {
        console.error(`[photo-upload] Failed to notify owner of error:`, notifyError);
      }
    }

    throw error; // Re-throw for retry
  }
}

/**
 * Start the photo upload worker.
 */
export function startPhotoUploadWorker(): Worker<PhotoUploadJob> {
  const worker = new Worker<PhotoUploadJob>(
    'notifications',
    processPhotoUpload,
    {
      connection: createRedisConnection(),
      concurrency: 3,
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'photo-upload') {
      console.log(`[photo-upload] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'photo-upload') {
      console.error(`[photo-upload] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[photo-upload] Worker started');
  return worker;
}

// Also export the worker instance for direct import
export const photoUploadWorker = {
  start: startPhotoUploadWorker,
};
