import { db } from '../../db/index';
import { reviewRequests, processedReviews } from '../../db/schema/index';
import { eq, and, inArray } from 'drizzle-orm';
import { reviewRequestQueue } from '../../queue/queues';

/**
 * Check if any pending review requests were completed by new reviews.
 *
 * Strategy: Match reviews to requests by phone number (last 4 digits in reviewer name)
 * or by detecting any new review within 48h of a pending request.
 *
 * This runs during the existing review-poll worker after new reviews are detected.
 *
 * @param tenantId - Tenant to check
 * @param newReviewIds - IDs of newly detected reviews (processedReviews.id UUIDs)
 * @returns Number of review requests marked as completed
 */
export async function checkReviewCompletion(
  tenantId: string,
  newReviewIds: string[]
): Promise<number> {
  if (newReviewIds.length === 0) return 0;

  // Get pending review requests (status = 'pending' or 'requested' or 'reminded')
  const pendingRequests = await db.query.reviewRequests.findMany({
    where: and(
      eq(reviewRequests.tenantId, tenantId),
      inArray(reviewRequests.status, ['pending', 'requested', 'reminded'])
    ),
  });

  if (pendingRequests.length === 0) return 0;

  // Get the new reviews
  const newReviews = await db.query.processedReviews.findMany({
    where: and(
      eq(processedReviews.tenantId, tenantId),
      inArray(processedReviews.id, newReviewIds)
    ),
  });

  let completedCount = 0;
  // Copy array to allow modification during iteration
  const remainingRequests = [...pendingRequests];

  for (const review of newReviews) {
    // Try to match review to a pending request
    const matchedRequest = findMatchingRequest(review, remainingRequests);

    if (matchedRequest) {
      // Mark request as completed
      await db.update(reviewRequests)
        .set({
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(reviewRequests.id, matchedRequest.id));

      // Cancel scheduled reminder job if exists
      try {
        const reminderJobId = `review-reminder-${matchedRequest.id}`;
        const job = await reviewRequestQueue.getJob(reminderJobId);
        if (job) {
          await job.remove();
          console.log(
            `[review-completion] Cancelled reminder for ${matchedRequest.id}`
          );
        }
      } catch (error) {
        // Job may not exist or already completed
        console.warn(`[review-completion] Could not cancel reminder:`, error);
      }

      console.log(
        `[review-completion] Marked request ${matchedRequest.id} as completed`
      );
      completedCount++;

      // Remove from remaining list to avoid double-matching
      const index = remainingRequests.indexOf(matchedRequest);
      if (index > -1) remainingRequests.splice(index, 1);
    }
  }

  return completedCount;
}

/**
 * Find a pending request that matches the review.
 *
 * Matching strategies:
 * 1. Phone number last 4 digits in reviewer name (some customers include phone)
 * 2. Review timestamp within 48h after request was sent (time-based correlation)
 * 3. Reviewer name matches customer name (fuzzy)
 *
 * @param review - The new review from processedReviews table
 * @param pendingRequests - List of pending requests
 * @returns Matched request or null
 */
function findMatchingRequest(
  review: typeof processedReviews.$inferSelect,
  pendingRequests: (typeof reviewRequests.$inferSelect)[]
): (typeof reviewRequests.$inferSelect) | null {
  const reviewerName = review.reviewerName?.toLowerCase() || '';
  const reviewTime = review.reviewCreateTime ?? new Date();

  for (const request of pendingRequests) {
    // Strategy 1: Check for phone digits in reviewer name
    if (request.customerPhone) {
      const lastFourDigits = request.customerPhone.replace(/\D/g, '').slice(-4);
      if (lastFourDigits && reviewerName.includes(lastFourDigits)) {
        return request;
      }
    }

    // Strategy 2: Time-based correlation
    // Review within 48h of request being sent = likely match
    if (request.requestedAt) {
      const requestTime = new Date(request.requestedAt);
      const hoursSinceRequest = (reviewTime.getTime() - requestTime.getTime()) / (1000 * 60 * 60);

      // Review came within 48 hours after request was sent
      if (hoursSinceRequest >= 0 && hoursSinceRequest <= 48) {
        return request;
      }
    }

    // Strategy 3: Name matching (fuzzy)
    if (request.customerName) {
      const customerName = request.customerName.toLowerCase();
      // Check if reviewer name contains customer first name
      const firstName = customerName.split(' ')[0];
      if (firstName.length >= 2 && reviewerName.includes(firstName)) {
        return request;
      }
    }
  }

  return null;
}
