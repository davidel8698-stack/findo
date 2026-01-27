import { scheduledQueue, type ScheduledJobData } from '../queue/index';

/**
 * Schedule test jobs for Phase 1 verification.
 * Creates hourly, daily, and weekly test jobs.
 */
export async function scheduleTestJobs(): Promise<void> {
  console.log('[scheduler] Scheduling test jobs...');

  // Hourly test job - runs every hour at minute 0
  await scheduledQueue.add(
    'test-hourly',
    {
      jobType: 'test',
      params: { frequency: 'hourly' },
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 * * * *', // Every hour at minute 0
      },
      jobId: 'test-hourly', // Prevent duplicates
    }
  );
  console.log('[scheduler] Scheduled hourly test job');

  // Daily test job - runs every day at 10:00 AM Israel time
  await scheduledQueue.add(
    'test-daily',
    {
      jobType: 'test',
      params: { frequency: 'daily' },
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 10 * * *', // 10:00 AM every day
        tz: 'Asia/Jerusalem',
      },
      jobId: 'test-daily',
    }
  );
  console.log('[scheduler] Scheduled daily test job (10:00 AM Israel)');

  // Weekly test job - runs every Sunday at 10:00 AM Israel time
  await scheduledQueue.add(
    'test-weekly',
    {
      jobType: 'test',
      params: { frequency: 'weekly' },
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 10 * * 0', // 10:00 AM every Sunday
        tz: 'Asia/Jerusalem',
      },
      jobId: 'test-weekly',
    }
  );
  console.log('[scheduler] Scheduled weekly test job (Sunday 10:00 AM Israel)');
}

/**
 * Schedule production recurring jobs.
 * These are placeholders - will be implemented in later phases.
 */
export async function scheduleRecurringJobs(): Promise<void> {
  console.log('[scheduler] Scheduling recurring jobs...');

  // Review check - hourly (Phase 5)
  await scheduledQueue.add(
    'review-check',
    {
      jobType: 'review-check',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 * * * *', // Every hour
      },
      jobId: 'review-check-hourly',
    }
  );
  console.log('[scheduler] Scheduled review check (hourly)');

  // Token refresh check - every 30 minutes
  await scheduledQueue.add(
    'token-refresh',
    {
      jobType: 'token-refresh',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '*/30 * * * *', // Every 30 minutes
      },
      jobId: 'token-refresh',
    }
  );
  console.log('[scheduler] Scheduled token refresh check (every 30 min)');

  // Photo request - weekly on Sunday 10:00 AM Israel (Phase 7)
  await scheduledQueue.add(
    'photo-request',
    {
      jobType: 'photo-request',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 10 * * 0', // Sunday 10:00 AM
        tz: 'Asia/Jerusalem',
      },
      jobId: 'photo-request-weekly',
    }
  );
  console.log('[scheduler] Scheduled photo request (Sunday 10:00 AM Israel)');

  // Daily digest - every day at 10:00 AM Israel (Phase 9)
  await scheduledQueue.add(
    'daily-digest',
    {
      jobType: 'daily-digest',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 10 * * *', // 10:00 AM every day
        tz: 'Asia/Jerusalem',
      },
      jobId: 'daily-digest',
    }
  );
  console.log('[scheduler] Scheduled daily digest (10:00 AM Israel)');
}

/**
 * Remove all scheduled test jobs.
 */
export async function removeTestJobs(): Promise<void> {
  const repeatableJobs = await scheduledQueue.getRepeatableJobs();
  for (const job of repeatableJobs) {
    if (job.name.startsWith('test-')) {
      await scheduledQueue.removeRepeatableByKey(job.key);
      console.log(`[scheduler] Removed ${job.name}`);
    }
  }
}

/**
 * List all scheduled repeatable jobs.
 */
export async function listScheduledJobs(): Promise<void> {
  const repeatableJobs = await scheduledQueue.getRepeatableJobs();
  console.log('[scheduler] Scheduled jobs:');
  for (const job of repeatableJobs) {
    const nextRun = job.next ? new Date(job.next).toISOString() : 'unknown';
    console.log(`  - ${job.name}: ${job.pattern} (next: ${nextRun})`);
  }
}
