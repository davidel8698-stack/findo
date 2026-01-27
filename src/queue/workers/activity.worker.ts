import { Worker, Job } from 'bullmq';
import { createRedisConnection, getRedis } from '../../lib/redis';
import type { ActivityJobData } from '../queues';

// Channel name for activity feed pub/sub
const ACTIVITY_CHANNEL_PREFIX = 'activity:tenant:';

/**
 * Process activity feed events.
 * Publishes to Redis pub/sub for real-time dashboard updates.
 */
async function processActivity(job: Job<ActivityJobData>): Promise<void> {
  const { tenantId, eventType, title, description, metadata, source, sourceId } = job.data;

  console.log(`[activity] Publishing event: ${eventType} for tenant ${tenantId}`);

  // Create event payload for pub/sub
  const event = {
    id: job.id,
    tenantId,
    eventType,
    title,
    description,
    metadata,
    source,
    sourceId,
    publishedAt: new Date().toISOString(),
  };

  // Publish to tenant-specific channel
  const redis = getRedis();
  const channel = `${ACTIVITY_CHANNEL_PREFIX}${tenantId}`;

  await redis.publish(channel, JSON.stringify(event));

  console.log(`[activity] Published to ${channel}`);
}

/**
 * Start the activity feed worker.
 */
export function startActivityWorker(): Worker<ActivityJobData> {
  const worker = new Worker<ActivityJobData>(
    'activity',
    processActivity,
    {
      connection: createRedisConnection(),
      concurrency: 10, // High concurrency for fast feed updates
    }
  );

  worker.on('completed', (job) => {
    console.log(`[activity] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[activity] Job ${job?.id} failed:`, err.message);
  });

  console.log('[activity] Worker started');
  return worker;
}

/**
 * Subscribe to activity feed for a tenant (for SSE endpoint).
 * Returns cleanup function.
 */
export async function subscribeToActivityFeed(
  tenantId: string,
  onMessage: (event: Record<string, unknown>) => void
): Promise<() => Promise<void>> {
  const redis = createRedisConnection(); // Dedicated connection for subscription
  const channel = `${ACTIVITY_CHANNEL_PREFIX}${tenantId}`;

  await redis.subscribe(channel);

  redis.on('message', (ch, message) => {
    if (ch === channel) {
      try {
        const event = JSON.parse(message);
        onMessage(event);
      } catch (error) {
        console.error('[activity] Failed to parse message:', error);
      }
    }
  });

  console.log(`[activity] Subscribed to ${channel}`);

  // Return cleanup function
  return async () => {
    await redis.unsubscribe(channel);
    await redis.quit();
    console.log(`[activity] Unsubscribed from ${channel}`);
  };
}
