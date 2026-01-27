import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import type { ScheduledJobData } from '../queues';
import { validateWhatsAppTokens } from '../../services/whatsapp/validation';
import { refreshExpiringGoogleTokens, validateAllGoogleTokens } from '../../services/google/token-refresh';

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
      // WhatsApp token validation
      if (params?.provider === 'whatsapp' && params?.mode === 'daily-validation') {
        console.log(`[scheduled] Running daily WhatsApp token validation`);
        const waResults = await validateWhatsAppTokens();
        console.log(`[scheduled] WhatsApp token validation complete: ${waResults.valid}/${waResults.total} valid, ${waResults.invalid} invalid`);
        if (waResults.invalid > 0) {
          console.warn(`[scheduled] Invalid tokens found for tenants:`, waResults.errors.map(e => e.tenantId).join(', '));
        }
      }
      // Google proactive token refresh (every 5 minutes)
      else if (params?.provider === 'google' && params?.mode === 'proactive') {
        console.log(`[scheduled] Running proactive Google token refresh`);
        const refreshResults = await refreshExpiringGoogleTokens();
        console.log(`[scheduled] Google token refresh complete: ${refreshResults.checked} checked, ${refreshResults.refreshed} refreshed, ${refreshResults.failed} failed`);
      }
      // Google daily token validation
      else if (params?.provider === 'google' && params?.mode === 'daily-validation') {
        console.log(`[scheduled] Running daily Google token validation`);
        const googleResults = await validateAllGoogleTokens();
        console.log(`[scheduled] Google token validation complete: ${googleResults.valid}/${googleResults.checked} valid, ${googleResults.invalid} invalid`);
        if (googleResults.invalid > 0) {
          console.warn(`[scheduled] Invalid Google tokens found for tenants:`, googleResults.errors.map(e => e.tenantId).join(', '));
        }
      }
      // General token refresh placeholder (for future providers)
      else {
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
