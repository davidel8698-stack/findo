import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { webhookRoutes } from './routes/webhooks';
import { healthRoutes } from './routes/health';
import { activityRoutes } from './routes/activity';
import { whatsappCallbackRoutes } from './routes/whatsapp/index';
import { tenantContext } from './middleware/tenant-context';
import { startWebhookWorker } from './queue/workers/webhook.worker';
import { startScheduledWorker } from './queue/workers/test.worker';
import { startActivityWorker } from './queue/workers/activity.worker';
import { initializeScheduler } from './scheduler/index';
import { closeRedisConnections, warmUpConnections } from './lib/redis';

// Create main app
const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', cors());

// Health routes (no auth required)
app.route('/health', healthRoutes);

// Webhook routes (no tenant auth - they bring their own auth)
app.route('/webhook', webhookRoutes);

// API routes (require tenant context)
const api = new Hono();
api.use('*', tenantContext);

// Example protected endpoint for testing
api.get('/me', (c) => {
  const tenant = c.get('tenant');
  return c.json({
    tenantId: tenant.tenantId,
    businessName: tenant.tenant?.businessName,
    status: tenant.tenant?.status,
  });
});

// Activity feed routes (REST + SSE)
api.route('/activity', activityRoutes);

// WhatsApp routes (Embedded Signup callback, status, disconnect)
api.route('/whatsapp', whatsappCallbackRoutes);

// Mount API under /api
app.route('/api', api);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: 'Findo API',
    version: '0.1.0',
    status: 'running',
  });
});

// Start server and workers
const port = parseInt(process.env.PORT || '3000', 10);

// Track workers for cleanup
let webhookWorker: ReturnType<typeof startWebhookWorker> | null = null;
let scheduledWorker: ReturnType<typeof startScheduledWorker> | null = null;
let activityWorker: ReturnType<typeof startActivityWorker> | null = null;

// Graceful shutdown
async function shutdown() {
  console.log('\n[server] Shutting down...');

  // Stop workers
  if (webhookWorker) {
    await webhookWorker.close();
    console.log('[server] Webhook worker stopped');
  }
  if (scheduledWorker) {
    await scheduledWorker.close();
    console.log('[server] Scheduled worker stopped');
  }
  if (activityWorker) {
    await activityWorker.close();
    console.log('[server] Activity worker stopped');
  }

  // Close Redis connections
  await closeRedisConnections();
  console.log('[server] Redis connections closed');

  process.exit(0);
}

// Register shutdown handlers
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start everything
async function start() {
  console.log('[server] Starting Findo...');

  // Warm up Redis connections BEFORE accepting requests
  console.log('[server] Warming up Redis connections...');
  await warmUpConnections();

  // Start workers
  webhookWorker = startWebhookWorker();
  scheduledWorker = startScheduledWorker();
  activityWorker = startActivityWorker();

  // Initialize scheduler (include test jobs in development)
  const includeTestJobs = process.env.NODE_ENV !== 'production';
  await initializeScheduler(includeTestJobs);

  // Start HTTP server
  serve({
    fetch: app.fetch,
    port,
  });

  console.log(`[server] Findo API running on http://localhost:${port}`);
  console.log('[server] Ready to accept requests');
}

start().catch((error) => {
  console.error('[server] Failed to start:', error);
  process.exit(1);
});
