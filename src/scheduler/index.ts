import { scheduleTestJobs, scheduleRecurringJobs, listScheduledJobs } from './jobs';

/**
 * Initialize the job scheduler.
 * Sets up all recurring jobs on application startup.
 *
 * @param includeTestJobs - Whether to include test jobs (Phase 1 verification)
 */
export async function initializeScheduler(includeTestJobs: boolean = false): Promise<void> {
  console.log('[scheduler] Initializing scheduler...');

  // Schedule production recurring jobs
  await scheduleRecurringJobs();

  // Optionally schedule test jobs for verification
  if (includeTestJobs) {
    await scheduleTestJobs();
  }

  // List all scheduled jobs
  await listScheduledJobs();

  console.log('[scheduler] Scheduler initialized');
}

export { scheduleTestJobs, scheduleRecurringJobs, listScheduledJobs, removeTestJobs } from './jobs';
