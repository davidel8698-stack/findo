import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { webhookRoutes } from './routes/webhooks';
import { healthRoutes } from './routes/health';
import { activityRoutes } from './routes/activity';
import { whatsappCallbackRoutes } from './routes/whatsapp/index';
import { googleRoutes } from './routes/google/index';
import { reviewRequestRoutes } from './routes/review-requests';
import { dashboardApiRoutes } from './routes/api/dashboard';
import { settingsRoutes } from './routes/api/settings';
import { pagesRoutes } from './routes/pages';
import { tenantContext } from './middleware/tenant-context';
import { startWebhookWorker } from './queue/workers/webhook.worker';
import { startScheduledWorker } from './queue/workers/test.worker';
import { startActivityWorker } from './queue/workers/activity.worker';
import { startWhatsAppMessageWorker } from './queue/workers/whatsapp-message.worker';
import { startWhatsAppStatusWorker } from './queue/workers/whatsapp-status.worker';
import { startLeadOutreachWorker } from './queue/workers/lead-outreach.worker';
import { startLeadReminderWorker } from './queue/workers/lead-reminder.worker';
import { startVoicenterCDRWorker } from './queue/workers/voicenter-cdr.worker';
import { startPhotoRequestWorker } from './queue/workers/photo-request.worker';
import { startPhotoUploadWorker } from './queue/workers/photo-upload.worker';
import { startMonthlyPostWorker } from './queue/workers/monthly-post.worker';
import { startPostApprovalWorker } from './queue/workers/post-approval.worker';
import { holidayCheckWorker } from './queue/workers/holiday-check.worker';
import { startReviewPollWorker } from './queue/workers/review-poll.worker';
import { startReviewReminderWorker } from './queue/workers/review-reminder.worker';
import { startInvoicePollWorker } from './queue/workers/invoice-poll.worker';
import { startReviewRequestWorker } from './queue/workers/review-request.worker';
import { metricsCollectionWorker } from './queue/workers/metrics-collection.worker';
import { autoTuningWorker } from './queue/workers/auto-tuning.worker';
import { progressiveProfileWorker } from './queue/workers/progressive-profile.worker';
import { scheduleProgressiveProfilingJob } from './queue/jobs/progressive-profile.job';
import { initializeScheduler } from './scheduler/index';
import { closeRedisConnections, warmUpConnections } from './lib/redis';

// Create main app
const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'X-Tenant-ID', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 86400,
}));

// Health routes (no auth required)
app.route('/health', healthRoutes);

// Webhook routes (no tenant auth - they bring their own auth)
app.route('/webhook', webhookRoutes);

// Pages routes (HTML views with static file serving)
// Tenant context is applied per-route as needed
app.route('/', pagesRoutes);

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

// Google routes (OAuth flow, status, disconnect)
api.route('/google', googleRoutes);

// Review requests routes (manual trigger, list)
api.route('/review-requests', reviewRequestRoutes);

// Dashboard routes (stats, health)
api.route('/dashboard', dashboardApiRoutes);

// Settings routes (timing, notifications, chatbot)
api.route('/settings', settingsRoutes);

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
let whatsappMessageWorker: ReturnType<typeof startWhatsAppMessageWorker> | null = null;
let whatsappStatusWorker: ReturnType<typeof startWhatsAppStatusWorker> | null = null;
let leadOutreachWorker: ReturnType<typeof startLeadOutreachWorker> | null = null;
let leadReminderWorker: ReturnType<typeof startLeadReminderWorker> | null = null;
let voicenterCDRWorker: ReturnType<typeof startVoicenterCDRWorker> | null = null;
let photoRequestWorker: ReturnType<typeof startPhotoRequestWorker> | null = null;
let photoUploadWorker: ReturnType<typeof startPhotoUploadWorker> | null = null;
let monthlyPostWorker: ReturnType<typeof startMonthlyPostWorker> | null = null;
let postApprovalWorker: ReturnType<typeof startPostApprovalWorker> | null = null;
let reviewPollWorker: ReturnType<typeof startReviewPollWorker> | null = null;
let reviewReminderWorker: ReturnType<typeof startReviewReminderWorker> | null = null;
let invoicePollWorker: ReturnType<typeof startInvoicePollWorker> | null = null;
let reviewRequestWorker: ReturnType<typeof startReviewRequestWorker> | null = null;
// holidayCheckWorker, metricsCollectionWorker, autoTuningWorker, progressiveProfileWorker are already instantiated at import time (not lazy-started)

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
  if (whatsappMessageWorker) {
    await whatsappMessageWorker.close();
    console.log('[server] WhatsApp message worker stopped');
  }
  if (whatsappStatusWorker) {
    await whatsappStatusWorker.close();
    console.log('[server] WhatsApp status worker stopped');
  }
  if (leadOutreachWorker) {
    await leadOutreachWorker.close();
    console.log('[server] Lead outreach worker stopped');
  }
  if (leadReminderWorker) {
    await leadReminderWorker.close();
    console.log('[server] Lead reminder worker stopped');
  }
  if (voicenterCDRWorker) {
    await voicenterCDRWorker.close();
    console.log('[server] Voicenter CDR worker stopped');
  }
  if (photoRequestWorker) {
    await photoRequestWorker.close();
    console.log('[server] Photo request worker stopped');
  }
  if (photoUploadWorker) {
    await photoUploadWorker.close();
    console.log('[server] Photo upload worker stopped');
  }
  if (monthlyPostWorker) {
    await monthlyPostWorker.close();
    console.log('[server] Monthly post worker stopped');
  }
  if (postApprovalWorker) {
    await postApprovalWorker.notificationWorker.close();
    await postApprovalWorker.scheduledWorker.close();
    console.log('[server] Post approval workers stopped');
  }
  if (reviewPollWorker) {
    await reviewPollWorker.close();
    console.log('[server] Review poll worker stopped');
  }
  if (reviewReminderWorker) {
    await reviewReminderWorker.close();
    console.log('[server] Review reminder worker stopped');
  }
  if (invoicePollWorker) {
    await invoicePollWorker.close();
    console.log('[server] Invoice poll worker stopped');
  }
  if (reviewRequestWorker) {
    await reviewRequestWorker.close();
    console.log('[server] Review request worker stopped');
  }
  // holidayCheckWorker, metricsCollectionWorker, autoTuningWorker, progressiveProfileWorker cleanup
  await holidayCheckWorker.close();
  console.log('[server] Holiday check worker stopped');
  await metricsCollectionWorker.close();
  console.log('[server] Metrics collection worker stopped');
  await autoTuningWorker.close();
  console.log('[server] Auto-tuning worker stopped');
  await progressiveProfileWorker.close();
  console.log('[server] Progressive profile worker stopped');

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
  whatsappMessageWorker = startWhatsAppMessageWorker();
  whatsappStatusWorker = startWhatsAppStatusWorker();
  leadOutreachWorker = startLeadOutreachWorker();
  leadReminderWorker = startLeadReminderWorker();
  voicenterCDRWorker = startVoicenterCDRWorker();
  photoRequestWorker = startPhotoRequestWorker();
  photoUploadWorker = startPhotoUploadWorker();
  monthlyPostWorker = startMonthlyPostWorker();
  postApprovalWorker = startPostApprovalWorker();
  reviewPollWorker = startReviewPollWorker();
  reviewReminderWorker = startReviewReminderWorker();
  invoicePollWorker = startInvoicePollWorker();
  reviewRequestWorker = startReviewRequestWorker();
  // holidayCheckWorker, metricsCollectionWorker, autoTuningWorker, progressiveProfileWorker already started at import time

  // Schedule progressive profiling job (SETUP-06)
  await scheduleProgressiveProfilingJob();
  console.log('[startup] Progressive profiling job scheduled');

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
