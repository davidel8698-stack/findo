import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { activityQueue, type WebhookJobData, type ActivityJobData } from '../queues';

/**
 * Process webhook jobs.
 * Routes to appropriate handler based on source.
 */
async function processWebhook(job: Job<WebhookJobData>): Promise<void> {
  const { source, eventId, eventType, payload, tenantId, receivedAt } = job.data;

  console.log(`[webhook] Processing ${source}:${eventType} (${eventId})`);

  // Route to appropriate handler
  switch (source) {
    case 'test':
      await handleTestWebhook(job.data);
      break;

    case 'voicenter':
      // TODO: Implement in Phase 3
      console.log(`[webhook] Voicenter webhook received: ${eventType}`);
      break;

    case 'whatsapp':
      // TODO: Implement in Phase 2
      console.log(`[webhook] WhatsApp webhook received: ${eventType}`);
      break;

    case 'google':
      // TODO: Implement in Phase 4
      console.log(`[webhook] Google webhook received: ${eventType}`);
      break;

    case 'greeninvoice':
    case 'icount':
      // TODO: Implement in Phase 6
      console.log(`[webhook] Accounting webhook received: ${source}:${eventType}`);
      break;

    default:
      console.warn(`[webhook] Unknown source: ${source}`);
  }
}

/**
 * Handle test webhook (for Phase 1 verification).
 * Note: Full implementation with database operations will be added when
 * tenant-context middleware and activity_events schema are created.
 */
async function handleTestWebhook(data: WebhookJobData): Promise<void> {
  const { eventId, payload, tenantId } = data;

  if (!tenantId) {
    throw new Error('Test webhook requires tenantId');
  }

  // Log the test webhook processing
  console.log(`[webhook] Processing test webhook for tenant ${tenantId}`);

  // Enqueue activity feed update
  // TODO: Add database activity event creation when activity_events schema exists
  await activityQueue.add('test-activity', {
    tenantId,
    eventType: 'webhook.test',
    title: 'Test webhook processed',
    description: `Test webhook ${eventId} processed successfully`,
    metadata: payload,
    source: 'webhook',
    sourceId: eventId,
  } satisfies ActivityJobData);

  console.log(`[webhook] Test webhook processed: ${eventId}`);
}

/**
 * Start the webhook worker.
 */
export function startWebhookWorker(): Worker<WebhookJobData> {
  const worker = new Worker<WebhookJobData>(
    'webhooks',
    processWebhook,
    {
      connection: createRedisConnection(),
      concurrency: 5, // Process up to 5 jobs concurrently
    }
  );

  worker.on('completed', (job) => {
    console.log(`[webhook] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[webhook] Job ${job?.id} failed:`, err.message);
  });

  console.log('[webhook] Worker started');
  return worker;
}
