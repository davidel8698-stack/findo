import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import {
  getAuthUrl,
  handleCallback,
  getGoogleConnection,
  disconnectGoogle,
} from '../../services/google/oauth';

// Note: tenant context middleware is applied at the /api level in index.ts
export const googleRoutes = new Hono();

// OAuth callback query schema
const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().min(1, 'State parameter is required'),
});

/**
 * GET /api/google/auth
 *
 * Returns the Google OAuth authorization URL for the tenant.
 * Frontend should redirect user to this URL to start OAuth flow.
 */
googleRoutes.get('/auth', async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;
  if (!tenantId) {
    return c.json({ error: 'Tenant context required' }, 401);
  }

  try {
    const authUrl = getAuthUrl(tenantId);
    return c.json({ authUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    // If env vars missing, return helpful error
    if (message.includes('must be configured')) {
      return c.json(
        {
          error: 'Google OAuth not configured',
          details: process.env.NODE_ENV === 'development' ? message : undefined,
        },
        500
      );
    }
    return c.json({ error: message }, 500);
  }
});

/**
 * GET /api/google/callback
 *
 * Handles OAuth callback from Google.
 * Exchanges code for tokens and creates connection.
 *
 * Note: This endpoint receives the OAuth redirect from Google.
 * The state parameter contains the tenantId for validation.
 */
googleRoutes.get(
  '/callback',
  zValidator('query', oauthCallbackSchema),
  async (c) => {
    const { code, state } = c.req.valid('query');

    // State contains tenantId
    const tenantId = state;

    // Validate tenant context matches state
    const tenant = c.get('tenant');
    if (tenant?.tenantId && tenant.tenantId !== tenantId) {
      return c.json({ error: 'State mismatch - tenant ID does not match' }, 400);
    }

    const result = await handleCallback(code, tenantId);

    if (!result.success) {
      // For OAuth callback, redirect to error page with message
      const errorUrl = new URL(process.env.GOOGLE_REDIRECT_SUCCESS_URI || '/setup/google');
      errorUrl.searchParams.set('error', result.error || 'Unknown error');
      return c.redirect(errorUrl.toString());
    }

    // Redirect to success page
    const successUrl = new URL(process.env.GOOGLE_REDIRECT_SUCCESS_URI || '/setup/google');
    successUrl.searchParams.set('success', 'true');
    return c.redirect(successUrl.toString());
  }
);

/**
 * GET /api/google/status
 *
 * Returns current Google connection status for tenant.
 */
googleRoutes.get('/status', async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;
  if (!tenantId) {
    return c.json({ error: 'Tenant context required' }, 401);
  }

  const status = await getGoogleConnection(tenantId);
  return c.json(status);
});

/**
 * POST /api/google/disconnect
 *
 * Disconnects Google for tenant.
 */
googleRoutes.post('/disconnect', async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;
  if (!tenantId) {
    return c.json({ error: 'Tenant context required' }, 401);
  }

  await disconnectGoogle(tenantId);
  return c.json({ success: true, message: 'Google disconnected' });
});
