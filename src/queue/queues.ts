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
  jobType: 'review-check' | 'photo-request' | 'daily-digest' | 'token-refresh' | 'test';
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
