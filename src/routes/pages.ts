import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { renderWhatsAppConnectPage, renderGoogleConnectPage, renderReviewRequestsPage, renderMetricsDashboard } from '../views/index';
import { metricsRoutes } from './metrics';
import { tenantContext } from '../middleware/tenant-context';
import { getGoogleConnection } from '../services/google/oauth';
import { db } from '../db/index';

/**
 * Pages Router
 *
 * Serves HTML pages for the application.
 * Uses server-side rendering with Hono.
 */
export const pagesRoutes = new Hono();

/**
 * Static file serving for /js/* files from public directory.
 */
pagesRoutes.use('/js/*', serveStatic({ root: './public' }));

/**
 * Metrics API Routes
 *
 * Mount metrics API at /api/metrics
 */
pagesRoutes.route('/api/metrics', metricsRoutes);

/**
 * Metrics Dashboard
 *
 * GET /dashboard/metrics
 *
 * Renders the GBP performance metrics dashboard.
 * Requires tenantId query parameter (will use auth session in production).
 */
pagesRoutes.get('/dashboard/metrics', (c) => {
  // In production, get tenantId from auth session
  const tenantId = c.req.query('tenantId');
  if (!tenantId) {
    return c.text('tenantId required', 400);
  }
  return c.html(renderMetricsDashboard(tenantId));
});

/**
 * WhatsApp Connection Page
 *
 * GET /connect/whatsapp
 *
 * Renders the WhatsApp Embedded Signup UI.
 * Requires tenant context (X-Tenant-ID header or future auth).
 */
pagesRoutes.get('/connect/whatsapp', tenantContext, async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;

  if (!tenantId) {
    return c.text('Tenant context required', 401);
  }

  // Get Meta configuration from environment
  const appId = process.env.META_APP_ID || '';
  const configId = process.env.META_CONFIG_ID || '';

  if (!appId || !configId) {
    console.warn('[pages] META_APP_ID or META_CONFIG_ID not configured');
    // Still render the page, but signup will fail with a user-friendly error
  }

  // Render the WhatsApp connection page
  const html = renderWhatsAppConnectPage({
    appId,
    configId,
    tenantId,
  });

  return c.html(html);
});

/**
 * Google Connection Page
 *
 * GET /connect/google
 *
 * Renders the Google Business Profile connection UI.
 * Handles success/error states from OAuth callback redirect.
 * Requires tenant context (X-Tenant-ID header or future auth).
 */
pagesRoutes.get('/connect/google', tenantContext, async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;

  if (!tenantId) {
    return c.text('Tenant context required', 401);
  }

  // Parse query parameters for OAuth callback states
  const success = c.req.query('success');
  const error = c.req.query('error');

  let state: 'initial' | 'success' | 'error' = 'initial';
  let businessName: string | undefined;
  let errorMessage: string | undefined;

  if (success === 'true') {
    // OAuth completed successfully - fetch connection details
    state = 'success';
    try {
      const connection = await getGoogleConnection(tenantId);
      if (connection.connected && connection.accountName) {
        businessName = connection.accountName;
      }
    } catch (err) {
      console.warn('[pages] Failed to fetch Google connection details:', err);
      // Still show success, just without business name
      businessName = 'העסק שלך';
    }
  } else if (error) {
    state = 'error';
    // Decode and translate common error messages
    errorMessage = decodeGoogleError(error);
  }

  // Render the Google connection page
  const html = renderGoogleConnectPage({
    tenantId,
    state,
    businessName,
    errorMessage,
  });

  return c.html(html);
});

/**
 * Review Requests Dashboard
 *
 * GET /review-requests
 *
 * Renders the review requests dashboard with manual trigger form.
 * Requires tenant context (X-Tenant-ID header or future auth).
 */
pagesRoutes.get('/review-requests', tenantContext, async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;

  if (!tenantId) {
    return c.text('Tenant context required', 401);
  }

  // Fetch recent review requests for this tenant
  const requests = await db.query.reviewRequests.findMany({
    where: (t, { eq }) => eq(t.tenantId, tenantId),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    limit: 50,
  });

  // Render the review requests dashboard
  const html = renderReviewRequestsPage(requests);

  return c.html(html);
});

/**
 * Decode Google OAuth error to Hebrew user message.
 */
function decodeGoogleError(error: string): string {
  const errorMap: Record<string, string> = {
    'access_denied': 'הגישה נדחתה. אנא אשרו את ההרשאות הנדרשות.',
    'invalid_scope': 'ההרשאות הנדרשות לא אושרו.',
    'server_error': 'שגיאה בשרת Google. אנא נסו שוב מאוחר יותר.',
    'temporarily_unavailable': 'השירות לא זמין כרגע. אנא נסו שוב מאוחר יותר.',
    'No GBP accounts found': 'לא נמצאו פרופילים עסקיים בחשבון Google שלכם.',
    'Google OAuth not configured': 'חיבור Google לא מוגדר במערכת. אנא פנו לתמיכה.',
  };

  // Check for exact match first
  if (errorMap[error]) {
    return errorMap[error];
  }

  // Check for partial match
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return the original error if no translation found
  return error;
}
