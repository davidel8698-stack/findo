/**
 * Owner approval flow for negative reviews.
 *
 * Per CONTEXT.md:
 * - Alert includes full review text, star rating, and suggested draft reply
 * - Owner can respond via WhatsApp ("אשר" to approve, or type edited version)
 * - Uses interactive buttons when within 24-hour session window
 * - Falls back to text instructions when session expired
 */

import { db } from '../../db/index';
import { processedReviews, tenants, whatsappConversations } from '../../db/schema/index';
import { eq, and } from 'drizzle-orm';
import { createWhatsAppClient } from '../whatsapp';
import {
  sendTextMessage,
  sendInteractiveButtons,
  isWindowOpen,
  type InteractiveButton,
} from '../whatsapp/messages';
import { shouldNotify, NotificationType } from '../notification-gate';

/**
 * Get the owner's conversation window expiration.
 *
 * @param tenantId - Tenant UUID
 * @param ownerPhone - Owner's phone number
 * @returns Window expiration timestamp or null if no conversation exists
 */
async function getOwnerConversationWindow(
  tenantId: string,
  ownerPhone: string
): Promise<Date | null> {
  const conversation = await db.query.whatsappConversations.findFirst({
    where: and(
      eq(whatsappConversations.tenantId, tenantId),
      eq(whatsappConversations.customerPhone, ownerPhone)
    ),
  });

  return conversation?.windowExpiresAt ?? null;
}

/**
 * Build Hebrew notification message for owner.
 *
 * @param starRating - Review star rating (1-5)
 * @param reviewerName - Name of the reviewer
 * @param comment - Review comment (may be empty)
 * @param draftReply - AI-generated draft reply
 * @returns Formatted Hebrew notification message
 */
function buildApprovalMessage(
  starRating: number,
  reviewerName: string,
  comment: string | null,
  draftReply: string
): string {
  const lines: string[] = [];

  // Header with star rating
  lines.push(`ביקורת חדשה (${starRating} כוכבים)`);
  lines.push('');

  // Reviewer and comment
  const commentText = comment || 'ללא טקסט';
  lines.push(`${reviewerName}: "${commentText}"`);
  lines.push('');

  // Suggested draft reply
  lines.push('תשובה מוצעת:');
  lines.push(`"${draftReply}"`);

  return lines.join('\n');
}

/**
 * Send approval request notification to business owner.
 *
 * Sends review details and draft reply to owner via WhatsApp.
 * Uses interactive buttons if within 24-hour session window,
 * otherwise falls back to text instructions.
 *
 * Checks notification preferences:
 * - NEGATIVE_REVIEW always returns true (critical for approval flow)
 * - NEW_REVIEW for positive reviews (can be disabled)
 *
 * @param tenantId - Tenant UUID
 * @param processedReviewId - Processed review UUID
 * @param isNegative - Whether this is a negative review (requires approval)
 * @returns true if notification sent successfully, false otherwise
 */
export async function sendApprovalRequest(
  tenantId: string,
  processedReviewId: string,
  isNegative: boolean = true
): Promise<boolean> {
  // Load processed review
  const review = await db.query.processedReviews.findFirst({
    where: eq(processedReviews.id, processedReviewId),
  });

  if (!review) {
    console.warn(`[approval-flow] Processed review ${processedReviewId} not found`);
    return false;
  }

  // Check notification preferences
  // NEGATIVE_REVIEW always returns true (shouldNotify handles this)
  const notificationType = isNegative
    ? NotificationType.NEGATIVE_REVIEW
    : NotificationType.NEW_REVIEW;

  const shouldSend = await shouldNotify(tenantId, notificationType);
  if (!shouldSend) {
    console.log(`[approval-flow] Skipping review notification (preference disabled)`);
    return false;
  }

  // Get tenant for owner phone
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant) {
    console.warn(`[approval-flow] Tenant ${tenantId} not found`);
    return false;
  }

  const ownerPhone = tenant.ownerPhone;
  if (!ownerPhone) {
    console.log(`[approval-flow] No owner phone configured for tenant ${tenantId}, skipping notification`);
    return false;
  }

  // Create WhatsApp client
  const client = await createWhatsAppClient(tenantId);
  if (!client) {
    console.warn(`[approval-flow] No WhatsApp client for tenant ${tenantId}`);
    return false;
  }

  // Build notification message
  const bodyText = buildApprovalMessage(
    review.starRating,
    review.reviewerName,
    review.comment,
    review.draftReply || 'תודה על הביקורת. אנו לוקחים את המשוב שלך ברצינות.'
  );

  try {
    let messageId: string;

    // Check if owner's conversation window is open
    const windowExpiresAt = await getOwnerConversationWindow(tenantId, ownerPhone);

    if (isWindowOpen(windowExpiresAt)) {
      // Send interactive buttons
      const buttons: InteractiveButton[] = [
        { id: `approve_${review.id}`, title: 'אשר ושלח' },
        { id: `edit_${review.id}`, title: 'רוצה לערוך' },
      ];

      const result = await sendInteractiveButtons(
        client,
        ownerPhone,
        bodyText,
        buttons
      );
      messageId = result.messageId;
    } else {
      // Window closed - send text with instructions
      const textWithInstructions = `${bodyText}\n\nהשב 'אשר' לאישור, או כתוב את התשובה שלך`;
      const result = await sendTextMessage(client, ownerPhone, textWithInstructions);
      messageId = result.messageId;
    }

    // Update processed review with approval tracking
    await db
      .update(processedReviews)
      .set({
        approvalMessageId: messageId,
        approvalSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(processedReviews.id, processedReviewId));

    console.log(`[approval-flow] Sent approval request for review ${processedReviewId} to owner`);
    return true;
  } catch (error) {
    console.error(`[approval-flow] Failed to send approval request for review ${processedReviewId}:`, error);
    return false;
  }
}

/**
 * Check if review needs approval and send notification.
 *
 * Called from processNewReview when a negative review is detected.
 * This is the main integration point between polling and approval flow.
 *
 * @param tenantId - Tenant UUID
 * @param processedReviewId - Processed review UUID
 * @returns true if approval request sent, false otherwise
 */
export async function checkAndSendApproval(
  tenantId: string,
  processedReviewId: string
): Promise<boolean> {
  return sendApprovalRequest(tenantId, processedReviewId);
}
