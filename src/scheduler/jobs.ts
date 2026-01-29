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

  // Review check - hourly at minute :00 (Phase 5)
  await scheduledQueue.add(
    'review-check',
    {
      jobType: 'review-check',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 * * * *', // Every hour at minute :00
      },
      jobId: 'review-check-hourly',
    }
  );
  console.log('[scheduler] Scheduled review check (hourly at :00)');

  /**
   * Invoice Poll Job
   *
   * Runs every hour at minute 15 (offset from review-check at :00).
   * Polls Greeninvoice and iCount for new invoices.
   * Schedules 24-hour delayed review request jobs.
   *
   * Per REVW-04: Wait 24 hours after service before requesting review.
   */
  await scheduledQueue.add(
    'invoice-poll',
    {
      jobType: 'invoice-poll',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '15 * * * *', // Every hour at minute :15
      },
      jobId: 'invoice-poll-hourly',
    }
  );
  console.log('[scheduler] Registered: invoice-poll (hourly at :15)');

  /**
   * Review Reminder Job
   *
   * Runs every hour at minute 30 (offset from review-check at :00).
   * Checks for pending approvals older than 48h and sends reminders.
   * Auto-posts drafts for reviews reminded 48h+ ago.
   *
   * Per CONTEXT.md: 48h reminder if owner doesn't respond,
   * auto-post draft if still no response 48h after reminder.
   */
  await scheduledQueue.add(
    'review-reminder',
    {
      jobType: 'review-reminder',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '30 * * * *', // Every hour at minute 30 (offset from review-check at :00)
      },
      jobId: 'review-reminder-hourly',
    }
  );
  console.log('[scheduler] Registered: review-reminder (hourly)');

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

  /**
   * Photo Request Job
   *
   * Runs weekly on Thursday at 10:00 AM Israel time.
   * Sends WhatsApp messages to business owners asking for 1-2 photos.
   *
   * Per CONTEXT.md: Thursday is end of Israeli work week - good time to
   * ask about photos from the week.
   */
  await scheduledQueue.add(
    'photo-request',
    {
      jobType: 'photo-request',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 10 * * 4', // Thursday 10:00 AM
        tz: 'Asia/Jerusalem',
      },
      jobId: 'photo-request-weekly',
    }
  );
  console.log('[scheduler] Registered: photo-request (Thursday 10:00 AM Israel)');

  /**
   * Photo Reminder Job
   *
   * Runs weekly on Saturday at 10:00 AM Israel time.
   * Sends reminder to owners who haven't responded to photo request.
   *
   * Per CONTEXT.md: One reminder after 2 days if no response,
   * then skip until next week.
   */
  await scheduledQueue.add(
    'photo-reminder',
    {
      jobType: 'photo-reminder',
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 10 * * 6', // Saturday 10:00 AM
        tz: 'Asia/Jerusalem',
      },
      jobId: 'photo-reminder-weekly',
    }
  );
  console.log('[scheduler] Registered: photo-reminder (Saturday 10:00 AM Israel)');

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

  /**
   * WhatsApp Token Validation Job
   *
   * Runs daily at 3:00 AM Israel time.
   * Checks all active WhatsApp connections for token validity.
   * Marks invalid tokens and notifies owners via dashboard activity.
   *
   * Per CONTEXT.md: Daily validation - check token validity every 24 hours proactively.
   */
  await scheduledQueue.add(
    'whatsapp-token-validation',
    {
      jobType: 'token-refresh',
      params: { provider: 'whatsapp', mode: 'daily-validation' },
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '0 3 * * *', // 3:00 AM daily
        tz: 'Asia/Jerusalem',
      },
      jobId: 'whatsapp-token-validation',
    }
  );
  console.log('[scheduler] Registered: whatsapp-token-validation (daily at 3:00 AM)');

  /**
   * Google Token Refresh Job (Proactive)
   *
   * Runs every 5 minutes.
   * Refreshes Google access tokens that are expiring within 10 minutes.
   * Ensures continuous API access without interruption.
   *
   * Per RESEARCH.md: Google access tokens expire after ~1 hour.
   * Proactive refresh ensures 24/7 autonomous operation.
   */
  await scheduledQueue.add(
    'google-token-refresh',
    {
      jobType: 'token-refresh',
      params: { provider: 'google', mode: 'proactive' },
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '*/5 * * * *', // Every 5 minutes
        tz: 'Asia/Jerusalem',
      },
      jobId: 'google-token-refresh',
    }
  );
  console.log('[scheduler] Registered: google-token-refresh (every 5 minutes)');

  /**
   * Google Token Validation Job (Daily)
   *
   * Runs daily at 3:30 AM Israel time (30 min after WhatsApp validation).
   * Validates all active Google connections against GBP API.
   * Marks invalid tokens and notifies owners via dashboard activity.
   *
   * Per RESEARCH.md: ~1%/month unexplained token revocations.
   * Daily validation catches revoked tokens proactively.
   */
  await scheduledQueue.add(
    'google-token-validation',
    {
      jobType: 'token-refresh',
      params: { provider: 'google', mode: 'daily-validation' },
    } satisfies ScheduledJobData,
    {
      repeat: {
        pattern: '30 3 * * *', // 3:30 AM daily (offset from WhatsApp at 3:00 AM)
        tz: 'Asia/Jerusalem',
      },
      jobId: 'google-token-validation',
    }
  );
  console.log('[scheduler] Registered: google-token-validation (daily at 3:30 AM)');
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
