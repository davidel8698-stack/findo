import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { processEmbeddedSignup, getConnectionStatus, disconnectWhatsApp } from '../../services/whatsapp/embedded-signup';

// Note: tenant context middleware is applied at the /api level in index.ts
export const whatsappCallbackRoutes = new Hono();

// Embedded Signup callback payload schema
const embeddedSignupSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  wabaId: z.string().min(1, 'WABA ID is required'),
  phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
  displayPhoneNumber: z.string().optional(),
  businessName: z.string().optional(),
});

/**
 * POST /api/whatsapp/callback
 *
 * Receives Embedded Signup completion data from frontend.
 * Exchanges code for token and stores credentials.
 */
whatsappCallbackRoutes.post(
  '/callback',
  zValidator('json', embeddedSignupSchema),
  async (c) => {
    const tenant = c.get('tenant');
    const tenantId = tenant?.tenantId;
    if (!tenantId) {
      return c.json({ error: 'Tenant context required' }, 401);
    }

    const data = c.req.valid('json');

    const result = await processEmbeddedSignup(tenantId, data);

    if (!result.success) {
      return c.json(
        {
          error: result.error,
          details: process.env.NODE_ENV === 'development' ? result.errorDetails : undefined,
        },
        400
      );
    }

    return c.json({
      success: true,
      connectionId: result.connectionId,
      message: 'WhatsApp connected successfully',
    });
  }
);

/**
 * GET /api/whatsapp/status
 *
 * Returns current WhatsApp connection status for tenant.
 */
whatsappCallbackRoutes.get('/status', async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;
  if (!tenantId) {
    return c.json({ error: 'Tenant context required' }, 401);
  }

  const status = await getConnectionStatus(tenantId);
  return c.json(status);
});

/**
 * POST /api/whatsapp/disconnect
 *
 * Disconnects WhatsApp for tenant.
 */
whatsappCallbackRoutes.post('/disconnect', async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant?.tenantId;
  if (!tenantId) {
    return c.json({ error: 'Tenant context required' }, 401);
  }

  await disconnectWhatsApp(tenantId);
  return c.json({ success: true, message: 'WhatsApp disconnected' });
});
