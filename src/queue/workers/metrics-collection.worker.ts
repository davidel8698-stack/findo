import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { collectMetricsForAllTenants } from '../../services/optimization';
import { type ScheduledJobData } from '../queues';

/**
 * Metrics Collection Worker
 *
 * Processes 'metrics-collection' jobs from the scheduled queue.
 * Runs weekly on Monday 2:00 AM Israel time.
 *
 * Collects GBP metrics for all active tenants:
 * - Review metrics (total, count, rating, response rate)
 * - Visibility metrics (impressions, searches, actions)
 * - Content metrics (image count, views)
 * - Review request metrics (sent, completed, conversion rate)
 *
 * Updates baselines after collection for each tenant.
 */

const QUEUE_NAME = 'scheduled';

export const metricsCollectionWorker = new Worker<ScheduledJobData>(
  QUEUE_NAME,
  async (job: Job<ScheduledJobData>) => {
    // Only process metrics-collection jobs
    if (job.name !== 'metrics-collection') return;

    console.log('[metrics-collection] Starting weekly metrics collection...');

    const result = await collectMetricsForAllTenants();

    console.log(`[metrics-collection] Complete: ${result.processed} processed, ${result.skipped} skipped, ${result.errors} errors`);

    return result;
  },
  {
    connection: createRedisConnection(),
    concurrency: 1, // Single instance - runs weekly, no need for parallel
  }
);

metricsCollectionWorker.on('completed', (job) => {
  if (job.name === 'metrics-collection') {
    console.log(`[metrics-collection] Job ${job.id} completed`);
  }
});

metricsCollectionWorker.on('failed', (job, err) => {
  if (job?.name === 'metrics-collection') {
    console.error(`[metrics-collection] Job ${job.id} failed:`, err.message);
  }
});

console.log('[metrics-collection] Worker started');
