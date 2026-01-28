import { Queue, QueueOptions } from 'bullmq';
import { createRedisConnection } from '../lib/redis';

// Default queue options
const defaultQueueOptions: Partial<QueueOptions> = {
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000, // Start with 1 second, then 2s, 4s, 8s, 16s
    },
    removeOnComplete: {
      age: 24 * 60 * 60, // Keep completed jobs for 24 hours
      count: 1000, // Keep last 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60, // Keep failed jobs for 7 days
    },
  },
};

/**
 * Webhook processing queue.
 * Handles incoming webhooks from external services (Voicenter, Greeninvoice, WhatsApp, etc.)
 */
export const webhookQueue = new Queue('webhooks', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

/**
 * Scheduled jobs queue.
 * Handles recurring jobs (hourly review check, daily digest, weekly photo request, etc.)
 */
export const scheduledQueue = new Queue('scheduled', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

/**
 * Notification queue.
 * Handles outbound notifications (WhatsApp, SMS, email to business owners).
 */
export const notificationQueue = new Queue('notifications', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

/**
 * Activity feed queue.
 * Handles real-time activity feed updates (publish to SSE).
 */
export const activityQueue = new Queue('activity', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
  defaultJobOptions: {
    ...defaultQueueOptions.defaultJobOptions,
    attempts: 3, // Fewer retries for activity events (less critical)
    removeOnComplete: {
      age: 60 * 60, // Only keep 1 hour (processed quickly)
      count: 500,
    },
  },
});

/**
 * Lead outreach queue.
 * Handles delayed outreach to missed call callers (2-minute delay).
 * Sends initial WhatsApp message to start lead capture flow.
 */
export const leadOutreachQueue = new Queue('lead-outreach', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

/**
 * Lead reminder queue.
 * Handles follow-up reminders for unresponsive leads.
 * Reminder 1: 2 hours after initial message
 * Reminder 2: 24 hours after initial message
 */
export const leadReminderQueue = new Queue('lead-reminders', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

/**
 * Review request queue for sending review request WhatsApp messages.
 * Jobs are delayed 24 hours from invoice detection (REVW-04).
 */
export const reviewRequestQueue = new Queue<ReviewRequestJobData>('review-requests', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

// Job type definitions for type safety
export interface WebhookJobData {
  source: 'voicenter' | 'greeninvoice' | 'icount' | 'whatsapp' | 'google' | 'test';
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
  tenantId?: string; // May need to be resolved from payload
  receivedAt: string; // ISO timestamp
}

export interface ScheduledJobData {
  jobType: 'review-check' | 'review-reminder' | 'invoice-poll' | 'photo-request' | 'daily-digest' | 'token-refresh' | 'test';
  tenantId?: string; // Optional for tenant-specific jobs
  params?: Record<string, unknown>;
}

export interface NotificationJobData {
  tenantId: string;
  channel: 'whatsapp' | 'sms' | 'email';
  recipientId: string; // Phone number or email
  templateId: string;
  params: Record<string, unknown>;
}

export interface ActivityJobData {
  tenantId: string;
  eventType: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  source: string;
  sourceId?: string;
}

/**
 * Lead outreach job data.
 * Triggered by Voicenter CDR worker after missed call detected.
 */
export interface LeadOutreachJobData {
  tenantId: string;
  missedCallId: string;
  callerPhone: string;
}

/**
 * Lead reminder job data.
 * Scheduled by lead outreach worker for follow-up reminders.
 */
export interface LeadReminderJobData {
  leadId: string;
  leadConversationId: string;
  reminderNumber: 1 | 2; // 1 = 2h reminder, 2 = 24h reminder
}

/**
 * Review request job data.
 * Created by invoice poll worker for each detected invoice.
 */
export interface ReviewRequestJobData {
  reviewRequestId: string;
}
