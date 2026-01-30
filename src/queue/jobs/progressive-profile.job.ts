/**
 * Progressive profiling job scheduler.
 *
 * Schedules a weekly job to send profiling questions to active tenants.
 * Runs Monday at 10:00 AM Israel time (after morning rush per CONTEXT.md).
 */

import { scheduledQueue } from '../queues';

/** Job name for progressive profile check */
export const PROGRESSIVE_PROFILE_JOB = 'progressive-profile-check';

/**
 * Schedule the weekly progressive profiling job.
 *
 * Runs Monday at 10:00 AM Israel time:
 * - Checks all active tenants with completed setup
 * - Sends one profiling question per tenant (if applicable)
 * - Respects ignore count (stops after 2 ignored)
 */
export async function scheduleProgressiveProfilingJob(): Promise<void> {
  // Remove any existing job to avoid duplicates
  const existingJobs = await scheduledQueue.getRepeatableJobs();
  for (const job of existingJobs) {
    if (job.name === PROGRESSIVE_PROFILE_JOB) {
      await scheduledQueue.removeRepeatableByKey(job.key);
    }
  }

  // Schedule weekly check on Monday at 10:00 AM Israel time
  await scheduledQueue.add(
    PROGRESSIVE_PROFILE_JOB,
    {
      jobType: 'progressive-profile-check',
    },
    {
      repeat: {
        pattern: '0 10 * * 1', // Monday 10:00 AM
        tz: 'Asia/Jerusalem',
      },
      removeOnComplete: true,
    }
  );

  console.log('[progressive-profile] Scheduled weekly job: Monday 10:00 AM Israel time');
}
