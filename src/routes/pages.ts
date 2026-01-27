import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { renderWhatsAppConnectPage } from '../views/index';
import { tenantContext } from '../middleware/tenant-context';

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
