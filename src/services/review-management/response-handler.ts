/**
 * Owner response handling for review approval workflow.
 *
 * Processes owner's approval or edit of negative review responses.
 * Handles both interactive button clicks and text message responses.
 *
 * Per CONTEXT.md:
 * - Owner can respond via WhatsApp ("אשר" to approve, or type edited version)
 * - 48h reminder if owner doesn't respond
 * - If still no response after reminder, system auto-posts the draft
 */

import { db } from '../../db/index';
import { processedReviews, googleConnections, tenants } from '../../db/schema/index';
import { eq, and, desc, inArray, like } from 'drizzle-orm';
import { postReviewReply } from '../google/reviews';
import { createWhatsAppClient } from '../whatsapp';
import { sendTextMessage } from '../whatsapp/messages';
import { activityService } from '../activity';

/**
 * Handle owner's response to a review approval request.
 *
 * Detects and processes:
 * - Button click: approve_{id} -> approve draft
 * - Button click: edit_{id} -> request edited reply
 * - Text "אשר" -> approve latest pending review
 * - Text response when edit pending -> submit edited reply
 *
 * @param tenantId - Tenant UUID
 * @param messageFrom - Owner's phone number
 * @param messageText - Message text content
 * @param buttonId - Optional button callback ID from interactive message
 * @returns true if handled as review response, false otherwise
 */
export async function handleOwnerReviewResponse(
  tenantId: string,
  messageFrom: string,
  messageText: string,
  buttonId?: string
): Promise<boolean> {
  // Handle button clicks
  if (buttonId) {
    if (buttonId.startsWith('approve_')) {
      const reviewId = buttonId.replace('approve_', '');
      await approveReviewReply(tenantId, reviewId);
      return true;
    }

    if (buttonId.startsWith('edit_')) {
      const reviewId = buttonId.replace('edit_', '');
      await requestEditedReply(tenantId, reviewId);
      return true;
    }
  }

  // Handle text "אשר" (approve in Hebrew)
  const normalizedText = messageText.trim();
  if (normalizedText === 'אשר') {
    const pendingReview = await getLatestPendingApproval(tenantId);
    if (pendingReview) {
      await approveReviewReply(tenantId, pendingReview.id);
      return true;
    }
    // No pending review to approve - not a review response
    return false;
  }

  // Check if owner has a pending edit request
  const pendingEditReviewId = await getPendingEditForOwner(tenantId);
  if (pendingEditReviewId && normalizedText.length > 0) {
    await submitEditedReply(tenantId, pendingEditReviewId, normalizedText);
    return true;
  }

  // Not a review response
  return false;
}

/**
 * Approve and post the draft reply to Google.
 *
 * @param tenantId - Tenant UUID
 * @param processedReviewId - Processed review UUID (from our database)
 */
export async function approveReviewReply(
  tenantId: string,
  processedReviewId: string
): Promise<void> {
  // Load the processed review
  const review = await db.query.processedReviews.findFirst({
    where: and(
      eq(processedReviews.id, processedReviewId),
      eq(processedReviews.tenantId, tenantId)
    ),
  });

  if (!review) {
    console.warn(`[response-handler] Review ${processedReviewId} not found for tenant ${tenantId}`);
    return;
  }

  if (!review.draftReply) {
    console.warn(`[response-handler] Review ${processedReviewId} has no draft reply`);
    return;
  }

  // Get Google connection for posting
  const connection = await db.query.googleConnections.findFirst({
    where: eq(googleConnections.id, review.googleConnectionId),
  });

  if (!connection || !connection.locationId) {
    console.error(`[response-handler] Google connection not found for review ${processedReviewId}`);
    return;
  }

  try {
    // Update status to approved before posting
    await db
      .update(processedReviews)
      .set({
        status: 'approved',
        updatedAt: new Date(),
      })
      .where(eq(processedReviews.id, processedReviewId));

    // Post reply to Google
    const postedReply = await postReviewReply(
      tenantId,
      connection.accountId,
      connection.locationId,
      review.reviewId,
      review.draftReply
    );

    // Update to replied status
    await db
      .update(processedReviews)
      .set({
        status: 'replied',
        postedReply: postedReply.comment,
        repliedAt: new Date(postedReply.updateTime),
        updatedAt: new Date(),
      })
      .where(eq(processedReviews.id, processedReviewId));

    // Send confirmation to owner
    await sendOwnerConfirmation(tenantId, 'התשובה פורסמה בהצלחה!');

    // Create activity event
    await activityService.createAndPublish(tenantId, {
      eventType: 'review.replied',
      title: `תשובה לביקורת ${review.starRating} כוכבים פורסמה`,
      description: `${review.reviewerName}: תשובה אושרה ופורסמה`,
      source: 'review-management',
      sourceId: processedReviewId,
      metadata: {
        reviewId: review.reviewId,
        starRating: review.starRating,
        replyType: 'approved',
      },
    });

    console.log(`[response-handler] Approved and posted reply for review ${review.reviewId}`);
  } catch (error) {
    console.error(`[response-handler] Failed to post approved reply for review ${processedReviewId}:`, error);
    // Revert status on failure
    await db
      .update(processedReviews)
      .set({
        status: 'pending_approval',
        updatedAt: new Date(),
      })
      .where(eq(processedReviews.id, processedReviewId));

    await sendOwnerConfirmation(tenantId, 'שגיאה בפרסום התשובה. אנא נסה שוב.');
  }
}

/**
 * Request an edited reply from the owner.
 * Sets status to 'edited' and sends prompt for custom text.
 *
 * @param tenantId - Tenant UUID
 * @param processedReviewId - Processed review UUID
 */
export async function requestEditedReply(
  tenantId: string,
  processedReviewId: string
): Promise<void> {
  // Load the review
  const review = await db.query.processedReviews.findFirst({
    where: and(
      eq(processedReviews.id, processedReviewId),
      eq(processedReviews.tenantId, tenantId)
    ),
  });

  if (!review) {
    console.warn(`[response-handler] Review ${processedReviewId} not found for tenant ${tenantId}`);
    return;
  }

  // Update status and mark as awaiting edit
  await db
    .update(processedReviews)
    .set({
      status: 'edited',
      ownerResponse: `AWAITING_EDIT:${processedReviewId}`,
      updatedAt: new Date(),
    })
    .where(eq(processedReviews.id, processedReviewId));

  // Prompt owner for custom reply
  await sendOwnerConfirmation(tenantId, 'אנא כתוב/י את התשובה שברצונך לפרסם:');

  console.log(`[response-handler] Requested edit for review ${processedReviewId}`);
}

/**
 * Submit the owner's edited reply and post to Google.
 *
 * @param tenantId - Tenant UUID
 * @param processedReviewId - Processed review UUID
 * @param editedText - Owner's custom reply text
 */
export async function submitEditedReply(
  tenantId: string,
  processedReviewId: string,
  editedText: string
): Promise<void> {
  // Validate byte length (Google limit is 4096 bytes)
  const replyBytes = Buffer.byteLength(editedText, 'utf8');
  if (replyBytes > 4096) {
    await sendOwnerConfirmation(
      tenantId,
      `התשובה ארוכה מדי (${replyBytes} בתים). המקסימום הוא 4096 בתים. אנא קצר/י את התשובה.`
    );
    return;
  }

  // Load the review
  const review = await db.query.processedReviews.findFirst({
    where: and(
      eq(processedReviews.id, processedReviewId),
      eq(processedReviews.tenantId, tenantId)
    ),
  });

  if (!review) {
    console.warn(`[response-handler] Review ${processedReviewId} not found for tenant ${tenantId}`);
    return;
  }

  // Get Google connection for posting
  const connection = await db.query.googleConnections.findFirst({
    where: eq(googleConnections.id, review.googleConnectionId),
  });

  if (!connection || !connection.locationId) {
    console.error(`[response-handler] Google connection not found for review ${processedReviewId}`);
    return;
  }

  try {
    // Post edited reply to Google
    const postedReply = await postReviewReply(
      tenantId,
      connection.accountId,
      connection.locationId,
      review.reviewId,
      editedText
    );

    // Update to replied status
    await db
      .update(processedReviews)
      .set({
        status: 'replied',
        postedReply: postedReply.comment,
        ownerResponse: editedText,
        repliedAt: new Date(postedReply.updateTime),
        updatedAt: new Date(),
      })
      .where(eq(processedReviews.id, processedReviewId));

    // Send confirmation to owner
    await sendOwnerConfirmation(tenantId, 'התשובה פורסמה בהצלחה!');

    // Create activity event
    await activityService.createAndPublish(tenantId, {
      eventType: 'review.replied',
      title: `תשובה לביקורת ${review.starRating} כוכבים פורסמה`,
      description: `${review.reviewerName}: תשובה ערוכה פורסמה`,
      source: 'review-management',
      sourceId: processedReviewId,
      metadata: {
        reviewId: review.reviewId,
        starRating: review.starRating,
        replyType: 'edited',
      },
    });

    console.log(`[response-handler] Posted edited reply for review ${review.reviewId}`);
  } catch (error) {
    console.error(`[response-handler] Failed to post edited reply for review ${processedReviewId}:`, error);
    await sendOwnerConfirmation(tenantId, 'שגיאה בפרסום התשובה. אנא נסה שוב.');
  }
}

/**
 * Get review ID for pending edit request.
 *
 * Finds processedReview where status='edited' and ownerResponse starts with 'AWAITING_EDIT:'.
 * Matches by tenantId and most recent approvalSentAt.
 *
 * @param tenantId - Tenant UUID
 * @returns Processed review ID or null if none pending
 */
async function getPendingEditForOwner(tenantId: string): Promise<string | null> {
  const pendingEdit = await db.query.processedReviews.findFirst({
    where: and(
      eq(processedReviews.tenantId, tenantId),
      eq(processedReviews.status, 'edited'),
      like(processedReviews.ownerResponse, 'AWAITING_EDIT:%')
    ),
    orderBy: [desc(processedReviews.approvalSentAt)],
  });

  if (!pendingEdit) {
    return null;
  }

  // Extract review ID from ownerResponse (format: AWAITING_EDIT:{id})
  const match = pendingEdit.ownerResponse?.match(/^AWAITING_EDIT:(.+)$/);
  return match ? match[1] : pendingEdit.id;
}

/**
 * Get the latest pending approval for a tenant.
 *
 * Finds processedReview where status is 'pending_approval' or 'reminded',
 * ordered by approvalSentAt desc.
 *
 * @param tenantId - Tenant UUID
 * @returns Processed review record or null
 */
async function getLatestPendingApproval(
  tenantId: string
): Promise<typeof processedReviews.$inferSelect | null> {
  const pending = await db.query.processedReviews.findFirst({
    where: and(
      eq(processedReviews.tenantId, tenantId),
      inArray(processedReviews.status, ['pending_approval', 'reminded'])
    ),
    orderBy: [desc(processedReviews.approvalSentAt)],
  });

  return pending ?? null;
}

/**
 * Send confirmation message to tenant owner.
 *
 * @param tenantId - Tenant UUID
 * @param message - Hebrew confirmation message
 */
async function sendOwnerConfirmation(tenantId: string, message: string): Promise<void> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant?.ownerPhone) {
    console.log(`[response-handler] No owner phone for tenant ${tenantId}`);
    return;
  }

  try {
    const client = await createWhatsAppClient(tenantId);
    if (client) {
      await sendTextMessage(client, tenant.ownerPhone, message);
    }
  } catch (error) {
    console.error(`[response-handler] Failed to send confirmation to owner:`, error);
    // Non-critical, don't throw
  }
}
