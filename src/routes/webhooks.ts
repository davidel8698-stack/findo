import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { webhookQueue, type WebhookJobData } from '../queue/index';
import { getRedis } from '../lib/redis';
import { activityService } from '../services/activity';
import {
  verifyWebhookSignature,
  parseWebhookPayload,
  type WhatsAppWebhookPayload,
} from '../services/whatsapp/webhooks';

export const webhookRoutes = new Hono();

// Generic webhook payload schema
const webhookPayloadSchema = z.object({}).passthrough();

/**
 * Test webhook endpoint for Phase 1 verification.
 * POST /webhook/test
 *
 * Accepts any JSON payload, enqueues for async processing.
 * Must respond within 500ms.
 */
webhookRoutes.post(
  '/test',
  zValidator('json', webhookPayloadSchema),
  async (c) => {
    const startTime = Date.now();
    const payload = c.req.valid('json');

    // Extract or generate event ID (for idempotency)
    const eventId = (payload.event_id as string) || nanoid();

    // Get tenant ID from header (required for test webhook)
    const tenantId = c.req.header('X-Tenant-ID');
    if (!tenantId) {
      return c.json({ error: 'X-Tenant-ID header required' }, 400);
    }

    // Check idempotency (prevent duplicate processing)
    const redis = getRedis();
    const idempotencyKey = `webhook:idempotency:test:${eventId}`;
    const alreadyProcessed = await redis.get(idempotencyKey);

    if (alreadyProcessed) {
      return c.json({
        status: 'already_processed',
        event_id: eventId,
      }, 200);
    }

    // Set idempotency key (24 hour TTL)
    await redis.set(idempotencyKey, '1', 'EX', 86400);

    // Enqueue for async processing
    await webhookQueue.add(
      'test-webhook',
      {
        source: 'test',
        eventId,
        eventType: 'test.received',
        payload,
        tenantId,
        receivedAt: new Date().toISOString(),
      } satisfies WebhookJobData,
      {
        jobId: eventId, // Use event ID for deduplication
      }
    );

    // Publish activity event for real-time feed
    await activityService.createAndPublish(tenantId, {
      eventType: 'webhook.received',
      title: 'Webhook received',
      description: `Test webhook ${eventId} queued for processing`,
      source: 'webhook',
      sourceId: eventId,
      metadata: { source: 'test', eventType: 'test.received' },
    });

    const processingTime = Date.now() - startTime;
    console.log(`[webhook] Test webhook enqueued in ${processingTime}ms`);

    return c.json({
      status: 'accepted',
      event_id: eventId,
      processing_time_ms: processingTime,
    }, 200);
  }
);

/**
 * Voicenter webhook endpoint (placeholder for Phase 3).
 * POST /webhook/voicenter
 */
webhookRoutes.post('/voicenter', async (c) => {
  // TODO: Implement in Phase 3
  return c.json({ error: 'Not implemented' }, 501);
});

/**
 * WhatsApp webhook verification (GET).
 * Meta sends this request to verify webhook URL during setup.
 *
 * Must return hub.challenge value to confirm ownership.
 */
webhookRoutes.get('/whatsapp', async (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (!expectedToken) {
    console.error('[whatsapp] WHATSAPP_WEBHOOK_VERIFY_TOKEN not configured');
    return c.text('Server misconfigured', 500);
  }

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[whatsapp] Webhook verification successful');
    // Must return the challenge as plain text, not JSON
    return c.text(challenge || '', 200);
  }

  console.warn('[whatsapp] Webhook verification failed', {
    mode,
    tokenMatch: token === expectedToken,
  });
  return c.text('Forbidden', 403);
});

/**
 * WhatsApp webhook receiver (POST).
 * Receives incoming messages and status updates from Meta.
 *
 * CRITICAL: Must respond within 500ms. All processing is async via queue.
 */
webhookRoutes.post('/whatsapp', async (c) => {
  const startTime = Date.now();

  // IMPORTANT: Get raw body BEFORE any parsing for signature verification
  const rawBody = await c.req.text();
  const signature = c.req.header('X-Hub-Signature-256');

  // Verify signature
  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    console.warn('[whatsapp] Webhook signature verification failed');
    return c.text('Invalid signature', 401);
  }

  // Parse the payload after verification
  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error('[whatsapp] Failed to parse webhook payload:', error);
    return c.text('Invalid JSON', 400);
  }

  // Extract structured data
  const { wabaId, phoneNumberId, messages, statuses } =
    parseWebhookPayload(payload);

  // Generate event ID for idempotency
  const eventId = `wa_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Queue messages for processing
  if (messages.length > 0) {
    // Check idempotency for first message (batch dedup)
    const redis = getRedis();
    const idempotencyKey = `webhook:idempotency:whatsapp:${messages[0].waMessageId}`;
    const alreadyProcessed = await redis.get(idempotencyKey);

    if (!alreadyProcessed) {
      await redis.set(idempotencyKey, '1', 'EX', 86400); // 24 hour TTL

      await webhookQueue.add(
        'whatsapp-messages',
        {
          source: 'whatsapp',
          eventId,
          eventType: 'messages.received',
          payload: {
            wabaId,
            phoneNumberId,
            messages,
          },
          receivedAt: new Date().toISOString(),
        },
        {
          jobId: `msg_${messages[0].waMessageId}`,
        }
      );

      console.log(
        `[whatsapp] Queued ${messages.length} message(s) for processing`
      );
    }
  }

  // Queue status updates separately (batch processing)
  if (statuses.length > 0) {
    // Status updates can be batched, use timestamp-based dedup
    await webhookQueue.add(
      'whatsapp-statuses',
      {
        source: 'whatsapp',
        eventId: `status_${eventId}`,
        eventType: 'statuses.received',
        payload: {
          wabaId,
          phoneNumberId,
          statuses,
        },
        receivedAt: new Date().toISOString(),
      }
      // Don't deduplicate status updates (they're idempotent by design)
    );

    console.log(
      `[whatsapp] Queued ${statuses.length} status update(s) for processing`
    );
  }

  const processingTime = Date.now() - startTime;
  console.log(`[whatsapp] Webhook processed in ${processingTime}ms`);

  // Always return 200 OK to acknowledge receipt
  // Meta will retry if we don't respond quickly enough
  return c.text('OK', 200);
});

/**
 * Accounting webhook endpoints (placeholder for Phase 6).
 */
webhookRoutes.post('/greeninvoice', async (c) => {
  return c.json({ error: 'Not implemented' }, 501);
});

webhookRoutes.post('/icount', async (c) => {
  return c.json({ error: 'Not implemented' }, 501);
});
