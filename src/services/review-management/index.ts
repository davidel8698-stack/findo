// Review management service exports
export * from './reply-generator';
export * from './approval-flow';

import { db } from '../../db/index';
import { eq } from 'drizzle-orm';
import { processedReviews, reviewPollState, googleConnections, tenants, type GoogleConnection } from '../../db/schema/index';
import { listReviews, postReviewReply, type Review } from '../google/reviews';
import { classifyReviewSentiment, generateReviewReply } from './reply-generator';
import { checkAndSendApproval } from './approval-flow';
import { activityService } from '../activity';

/**
 * Detect new reviews for a tenant since last poll.
 *
 * Compares reviews from Google API against:
 * - lastPollAt timestamp (only reviews updated since last check)
 * - processedReviews table (skip already-processed reviews)
 * - Existing replies (skip reviews that already have replies)
 *
 * @param tenantId - The tenant UUID
 * @param googleConnection - The active Google connection with accountId and locationId
 * @returns Array of new, unprocessed, unreplied reviews
 */
export async function detectNewReviews(
  tenantId: string,
  googleConnection: GoogleConnection
): Promise<Review[]> {
  if (!googleConnection.locationId) {
    console.log(`[review-management] No locationId for tenant ${tenantId}, skipping`);
    return [];
  }

  // Get last poll timestamp (or default to 24h ago)
  const pollState = await db.query.reviewPollState.findFirst({
    where: eq(reviewPollState.tenantId, tenantId),
  });

  const defaultLastPoll = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const lastPollAt = pollState?.lastPollAt ?? defaultLastPoll;

  // Fetch recent reviews from Google API
  const { reviews } = await listReviews(
    tenantId,
    googleConnection.accountId,
    googleConnection.locationId,
    { orderBy: 'updateTime desc', pageSize: 50 }
  );

  // Get already processed review IDs for this tenant
  const existingReviews = await db.query.processedReviews.findMany({
    where: eq(processedReviews.tenantId, tenantId),
    columns: { reviewId: true },
  });
  const processedIds = new Set(existingReviews.map(r => r.reviewId));

  // Filter to new reviews
  const newReviews = reviews.filter(review => {
    // Skip if already processed
    if (processedIds.has(review.reviewId)) {
      return false;
    }

    // Skip if updated before last poll
    const updateTime = new Date(review.updateTime);
    if (updateTime <= lastPollAt) {
      return false;
    }

    // Skip if already has a reply (someone replied manually)
    if (review.reply) {
      return false;
    }

    return true;
  });

  // Update poll state
  const now = new Date();
  await db
    .insert(reviewPollState)
    .values({ tenantId, lastPollAt: now })
    .onConflictDoUpdate({
      target: reviewPollState.tenantId,
      set: { lastPollAt: now },
    });

  return newReviews;
}

/**
 * Process a single new review.
 *
 * For positive reviews (4-5 stars, or positive 3-stars):
 * - Generate AI reply
 * - Post reply to Google immediately
 * - Record in processedReviews as 'auto_replied'
 * - Create activity event
 *
 * For negative reviews (1-2 stars, or negative 3-stars):
 * - Generate AI draft reply
 * - Record in processedReviews as 'pending_approval'
 * - Return review ID for approval flow (next plan)
 *
 * @param tenantId - The tenant UUID
 * @param googleConnectionId - The Google connection UUID
 * @param review - The review from Google API
 * @returns The processed review ID, or null on error
 */
export async function processNewReview(
  tenantId: string,
  googleConnectionId: string,
  review: Review
): Promise<string | null> {
  try {
    // Get connection details for posting reply
    const connection = await db.query.googleConnections.findFirst({
      where: eq(googleConnections.id, googleConnectionId),
    });

    if (!connection || !connection.locationId) {
      console.error(`[review-management] Connection ${googleConnectionId} not found or missing locationId`);
      return null;
    }

    // Get tenant for business name
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
      columns: { businessName: true },
    });
    const businessName = tenant?.businessName ?? 'העסק';

    // Classify sentiment (handles 3-star edge case)
    const isPositive = await classifyReviewSentiment(review.comment, review.starRating);

    // Generate AI reply
    const replyResult = await generateReviewReply(
      {
        reviewerName: review.reviewerName,
        comment: review.comment,
        starRating: review.starRating,
      },
      businessName,
      isPositive
    );

    // Insert into processedReviews with initial status
    const [processedReview] = await db.insert(processedReviews).values({
      tenantId,
      googleConnectionId,
      reviewId: review.reviewId,
      reviewName: review.name,
      reviewerName: review.reviewerName,
      starRating: review.starRating,
      comment: review.comment,
      reviewCreateTime: new Date(review.createTime),
      reviewUpdateTime: new Date(review.updateTime),
      status: 'detected',
      isPositive: isPositive ? 1 : 0,
      draftReply: replyResult.replyText,
      draftTone: replyResult.tone,
    }).returning();

    if (isPositive) {
      // Auto-reply for positive reviews
      try {
        const postedReply = await postReviewReply(
          tenantId,
          connection.accountId,
          connection.locationId,
          review.reviewId,
          replyResult.replyText
        );

        // Update status to auto_replied
        await db.update(processedReviews)
          .set({
            status: 'auto_replied',
            postedReply: postedReply.comment,
            repliedAt: new Date(postedReply.updateTime),
            updatedAt: new Date(),
          })
          .where(eq(processedReviews.id, processedReview.id));

        // Create activity event
        await activityService.createAndPublish(tenantId, {
          eventType: 'review.auto_replied',
          title: `תשובה אוטומטית לביקורת ${review.starRating} כוכבים`,
          description: `${review.reviewerName}: "${review.comment?.slice(0, 100) ?? '(ללא טקסט)'}"`,
          source: 'review-management',
          sourceId: processedReview.id,
          metadata: {
            reviewId: review.reviewId,
            starRating: review.starRating,
            tone: replyResult.tone,
          },
        });

        console.log(`[review-management] Auto-replied to positive review ${review.reviewId}`);
      } catch (replyError) {
        console.error(`[review-management] Failed to post reply for review ${review.reviewId}:`, replyError);
        // Still return the processed review ID - the draft is saved
      }
    } else {
      // Negative review - mark as pending approval
      await db.update(processedReviews)
        .set({
          status: 'pending_approval',
          updatedAt: new Date(),
        })
        .where(eq(processedReviews.id, processedReview.id));

      // Send approval request to owner
      await checkAndSendApproval(tenantId, processedReview.id);

      // Create activity event for audit trail
      await activityService.createAndPublish(tenantId, {
        eventType: 'review.approval_requested',
        title: `ביקורת ${review.starRating} כוכבים - ממתין לאישור`,
        description: `${review.reviewerName}: "${review.comment?.slice(0, 100) ?? '(ללא טקסט)'}"`,
        source: 'review-management',
        sourceId: processedReview.id,
        metadata: {
          reviewId: review.reviewId,
          starRating: review.starRating,
          tone: replyResult.tone,
        },
      });

      console.log(`[review-management] Negative review ${review.reviewId} pending approval, notification sent`);
    }

    return processedReview.id;
  } catch (error) {
    console.error(`[review-management] Error processing review ${review.reviewId}:`, error);
    return null;
  }
}

/**
 * Get Google connection details for a tenant.
 * Helper function for workers that need accountId/locationId.
 *
 * @param tenantId - The tenant UUID
 * @returns The active Google connection or null
 */
export async function getGoogleConnectionForTenant(
  tenantId: string
): Promise<GoogleConnection | null> {
  const connection = await db.query.googleConnections.findFirst({
    where: eq(googleConnections.tenantId, tenantId),
  });

  return connection ?? null;
}
