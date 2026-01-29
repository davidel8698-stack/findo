import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { runAutoTuning, sendAllWeeklySummaries } from '../../services/optimization/auto-tuner';
import { type ScheduledJobData } from '../queues';

/**
 * Auto-Tuning Worker
 *
 * Processes 'auto-tuning' jobs from the scheduled queue.
 * Runs weekly on Monday 3:00 AM Israel time (after metrics collection at 2:00 AM).
 *
 * Per CONTEXT.md autonomous optimization:
 * 1. Check A/B test winners across all test types
 * 2. Promote winners and migrate existing tenants
 * 3. Tune per-tenant review request timing based on conversion rates
 * 4. Send weekly summaries to affected owners
 */

const QUEUE_NAME = 'scheduled';

export const autoTuningWorker = new Worker<ScheduledJobData>(
  QUEUE_NAME,
  async (job: Job<ScheduledJobData>) => {
    // Only process auto-tuning jobs
    if (job.name !== 'auto-tuning') return;

    console.log('[auto-tuning] Starting weekly auto-tuning job...');

    // Step 1: Run auto-tuning (winner checks, timing adjustments)
    const actions = await runAutoTuning();

    console.log(`[auto-tuning] Tuning complete: ${actions.length} actions taken`);

    // Step 2: Send weekly summaries to affected owners
    const summaryResult = await sendAllWeeklySummaries(actions);

    console.log(`[auto-tuning] Summaries: ${summaryResult.sent} sent, ${summaryResult.failed} failed`);

    return {
      actions: actions.length,
      summaries: summaryResult,
    };
  },
  {
    connection: createRedisConnection(),
    concurrency: 1, // Single instance - runs weekly, no need for parallel
  }
);

autoTuningWorker.on('completed', (job) => {
  if (job.name === 'auto-tuning') {
    console.log(`[auto-tuning] Job ${job.id} completed`);
  }
});

autoTuningWorker.on('failed', (job, err) => {
  if (job?.name === 'auto-tuning') {
    console.error(`[auto-tuning] Job ${job.id} failed:`, err.message);
  }
});

console.log('[auto-tuning] Worker started');
