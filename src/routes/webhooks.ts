import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { webhookQueue, type WebhookJobData } from '../queue/index';
import { getRedis } from '../lib/redis';
import { activityService } from '../services/activity';

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
 * WhatsApp webhook endpoint (placeholder for Phase 2).
 * GET /webhook/whatsapp - Verification
 * POST /webhook/whatsapp - Events
 */
webhookRoutes.get('/whatsapp', async (c) => {
  // TODO: Implement Meta webhook verification in Phase 2
  return c.json({ error: 'Not implemented' }, 501);
});

webhookRoutes.post('/whatsapp', async (c) => {
  // TODO: Implement in Phase 2
  return c.json({ error: 'Not implemented' }, 501);
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
