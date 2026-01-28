import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { googleConnections } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { detectNewReviews, processNewReview } from '../../services/review-management';
import { checkReviewCompletion } from '../../services/review-request/completion';
import { type ScheduledJobData } from '../queues';

/**
 * Sleep helper for rate limiting.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process hourly review-check scheduled job.
 *
 * For each tenant with an active Google connection:
 * - Detect new reviews since last poll
 * - Process each new review (auto-reply for positive, pending for negative)
 * - Rate limit with 100ms delay between tenants
 */
async function processReviewCheck(): Promise<void> {
  console.log('[review-poll] Starting hourly review check');

  // Get all active Google connections with locationId
  const connections = await db.query.googleConnections.findMany({
    where: eq(googleConnections.status, 'active'),
  });

  const tenantsWithLocation = connections.filter(c => c.locationId);
  console.log(`[review-poll] Checking ${tenantsWithLocation.length} tenants (${connections.length - tenantsWithLocation.length} skipped - no location)`);

  for (const connection of tenantsWithLocation) {
    try {
      // Detect new reviews for this tenant
      const newReviews = await detectNewReviews(connection.tenantId, connection);

      // Process each new review and collect IDs
      const newReviewIds: string[] = [];
      for (const review of newReviews) {
        const reviewId = await processNewReview(
          connection.tenantId,
          connection.id,
          review
        );
        if (reviewId) {
          newReviewIds.push(reviewId);
        }
      }

      if (newReviews.length > 0) {
        console.log(`[review-poll] Processed ${newReviewIds.length}/${newReviews.length} new reviews for tenant ${connection.tenantId}`);
      }

      // Check if any pending review requests were completed by these new reviews
      if (newReviewIds.length > 0) {
        const completedCount = await checkReviewCompletion(connection.tenantId, newReviewIds);
        if (completedCount > 0) {
          console.log(
            `[review-poll] Marked ${completedCount} review requests as completed for tenant ${connection.tenantId}`
          );
        }
      }

      // Rate limit protection - 100ms delay between tenants
      await sleep(100);
    } catch (error) {
      console.error(`[review-poll] Error for tenant ${connection.tenantId}:`, error);
      // Continue with other tenants - don't fail entire job
    }
  }

  console.log('[review-poll] Completed hourly review check');
}

/**
 * Start the review poll worker.
 *
 * Listens on 'scheduled' queue and filters to 'review-check' jobs.
 * Processes the existing scheduled job registered in scheduler/jobs.ts.
 *
 * @returns The worker instance (for cleanup on shutdown)
 */
export function startReviewPollWorker(): Worker<ScheduledJobData> {
  const worker = new Worker<ScheduledJobData>(
    'scheduled',
    async (job: Job<ScheduledJobData>) => {
      // Only process review-check jobs
      if (job.name !== 'review-check') {
        return;
      }

      await processReviewCheck();
    },
    {
      connection: createRedisConnection(),
      concurrency: 1, // Single worker to respect Google API rate limits
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'review-check') {
      console.log(`[review-poll] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'review-check') {
      console.error(`[review-poll] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[review-poll] Worker started');
  return worker;
}
