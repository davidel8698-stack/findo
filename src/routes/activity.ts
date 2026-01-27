import { Hono } from 'hono';
import { stream } from 'hono/streaming';
import { activityService } from '../services/activity';
import { subscribeToActivityFeed } from '../queue/workers/activity.worker';

export const activityRoutes = new Hono();

/**
 * Get activity feed for authenticated tenant.
 * GET /api/activity
 *
 * Query params:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - eventType: string (optional filter)
 * - since: ISO date string (optional)
 */
activityRoutes.get('/', async (c) => {
  const tenant = c.get('tenant');
  const { limit, offset, eventType, since } = c.req.query();

  const events = await activityService.getFeed(tenant.tenantId, {
    limit: limit ? parseInt(limit, 10) : 50,
    offset: offset ? parseInt(offset, 10) : 0,
    eventType: eventType || undefined,
    since: since ? new Date(since) : undefined,
  });

  return c.json({
    events,
    pagination: {
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
      count: events.length,
    },
  });
});

/**
 * Get recent activity (last N events).
 * GET /api/activity/recent
 */
activityRoutes.get('/recent', async (c) => {
  const tenant = c.get('tenant');
  const { count } = c.req.query();

  const events = await activityService.getRecent(
    tenant.tenantId,
    count ? parseInt(count, 10) : 10
  );

  return c.json({ events });
});

/**
 * Server-Sent Events stream for real-time activity updates.
 * GET /api/activity/stream
 *
 * Use with EventSource in browser:
 *   const es = new EventSource('/api/activity/stream', {
 *     headers: { 'X-Tenant-ID': tenantId }
 *   });
 *   es.onmessage = (e) => console.log(JSON.parse(e.data));
 */
activityRoutes.get('/stream', async (c) => {
  const tenant = c.get('tenant');

  // Set SSE headers
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');

  return stream(c, async (stream) => {
    // Send initial connection message
    await stream.write(`data: ${JSON.stringify({ type: 'connected', tenantId: tenant.tenantId })}\n\n`);

    // Subscribe to activity feed
    const unsubscribe = await subscribeToActivityFeed(tenant.tenantId, async (event) => {
      try {
        await stream.write(`data: ${JSON.stringify(event)}\n\n`);
      } catch (error) {
        // Client disconnected
        console.log(`[activity] Client disconnected for tenant ${tenant.tenantId}`);
      }
    });

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(async () => {
      try {
        await stream.write(`: heartbeat\n\n`);
      } catch {
        // Client disconnected, cleanup will happen
      }
    }, 30000); // Every 30 seconds

    // Cleanup on disconnect
    stream.onAbort(() => {
      console.log(`[activity] Stream aborted for tenant ${tenant.tenantId}`);
      clearInterval(heartbeat);
      unsubscribe();
    });
  });
});
