import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import type { ScheduledJobData } from '../queues';

/**
 * Process scheduled test jobs.
 * Used for Phase 1 verification of scheduler functionality.
 */
async function processScheduledJob(job: Job<ScheduledJobData>): Promise<void> {
  const { jobType, tenantId, params } = job.data;

  console.log(`[scheduled] Processing ${jobType} job${tenantId ? ` for tenant ${tenantId}` : ''}`);

  switch (jobType) {
    case 'test':
      // Just log for verification
      console.log(`[scheduled] Test job executed at ${new Date().toISOString()}`);
      console.log(`[scheduled] Job params:`, params);
      break;

    case 'review-check':
      // TODO: Implement in Phase 5
      console.log(`[scheduled] Review check job placeholder`);
      break;

    case 'photo-request':
      // TODO: Implement in Phase 7
      console.log(`[scheduled] Photo request job placeholder`);
      break;

    case 'daily-digest':
      // TODO: Implement in Phase 9
      console.log(`[scheduled] Daily digest job placeholder`);
      break;

    case 'token-refresh':
      // TODO: Implement proactive token refresh
      console.log(`[scheduled] Token refresh job placeholder`);
      break;

    default:
      console.warn(`[scheduled] Unknown job type: ${jobType}`);
  }
}

/**
 * Start the scheduled jobs worker.
 */
export function startScheduledWorker(): Worker<ScheduledJobData> {
  const worker = new Worker<ScheduledJobData>(
    'scheduled',
    processScheduledJob,
    {
      connection: createRedisConnection(),
      concurrency: 3, // Lower concurrency for scheduled jobs
    }
  );

  worker.on('completed', (job) => {
    console.log(`[scheduled] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[scheduled] Job ${job?.id} failed:`, err.message);
  });

  console.log('[scheduled] Worker started');
  return worker;
}
