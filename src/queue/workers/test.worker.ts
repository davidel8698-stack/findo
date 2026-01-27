import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import type { ScheduledJobData } from '../queues';
import { validateWhatsAppTokens } from '../../services/whatsapp/validation';

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
      // Check if this is the daily WhatsApp validation job
      if (params?.provider === 'whatsapp' && params?.mode === 'daily-validation') {
        console.log(`[scheduled] Running daily WhatsApp token validation`);
        const results = await validateWhatsAppTokens();
        console.log(`[scheduled] WhatsApp token validation complete: ${results.valid}/${results.total} valid, ${results.invalid} invalid`);
        if (results.invalid > 0) {
          console.warn(`[scheduled] Invalid tokens found for tenants:`, results.errors.map(e => e.tenantId).join(', '));
        }
      } else {
        // General token refresh placeholder (for future Google tokens, etc.)
        console.log(`[scheduled] Token refresh job placeholder (provider: ${params?.provider || 'all'})`);
      }
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
