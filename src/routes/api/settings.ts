import { Hono } from 'hono';
import { tenantContext } from '../../middleware/tenant-context';
import {
  getSettings,
  updateTimingSettings,
  updateNotificationPrefs,
  updateChatbotConfig,
  resetToDefaults,
  type TimingSettings,
  type NotificationPrefs,
  type AllSettings,
} from '../../services/dashboard/settings-service';
import type { ChatbotQuestion } from '../../db/schema/index';
import type { TenantContext } from '../../types/tenant-context';

// Extend Hono Variables for tenant context
type Variables = {
  tenant: TenantContext;
};

/**
 * Settings API Routes
 *
 * CRUD endpoints for tenant settings: timing, notifications, and chatbot.
 * Per CONTEXT.md: "Findo defaults are optimized, but owner can access settings to change individual timings"
 */
const app = new Hono<{ Variables: Variables }>();

// Apply tenant context middleware to all routes
app.use('*', tenantContext);

/**
 * GET /api/settings
 *
 * Returns all settings for the tenant.
 *
 * Response:
 * - settings: { timing, notifications, chatbot }
 */
app.get('/', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const settings: AllSettings = await getSettings(tenant.tenantId);
    return c.json({ settings });
  } catch (error) {
    console.error('[settings] Error fetching settings:', error);
    return c.json(
      {
        error: 'Failed to fetch settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * PUT /api/settings/timing
 *
 * Updates timing settings for the tenant.
 *
 * Body:
 * - reviewRequestDelayHours?: number (12-72)
 * - reviewReminderDelayDays?: number (1-7)
 *
 * Response:
 * - timing: updated timing settings
 */
app.put('/timing', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const body = await c.req.json<Partial<TimingSettings>>();

    // Validate numeric types
    if (body.reviewRequestDelayHours !== undefined && typeof body.reviewRequestDelayHours !== 'number') {
      return c.json({ error: 'reviewRequestDelayHours must be a number' }, 400);
    }
    if (body.reviewReminderDelayDays !== undefined && typeof body.reviewReminderDelayDays !== 'number') {
      return c.json({ error: 'reviewReminderDelayDays must be a number' }, 400);
    }

    const timing = await updateTimingSettings(tenant.tenantId, body);
    return c.json({ timing });
  } catch (error) {
    console.error('[settings/timing] Error updating timing settings:', error);

    if (error instanceof Error && error.message.includes('must be between')) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(
      {
        error: 'Failed to update timing settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * PUT /api/settings/notifications
 *
 * Updates notification preferences for the tenant.
 *
 * Body: Partial<NotificationPrefs> - any notification flags to update
 *
 * Response:
 * - notifications: updated notification preferences
 */
app.put('/notifications', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const body = await c.req.json<Partial<NotificationPrefs>>();

    const notifications = await updateNotificationPrefs(tenant.tenantId, body);
    return c.json({ notifications });
  } catch (error) {
    console.error('[settings/notifications] Error updating notification prefs:', error);

    if (error instanceof Error && error.message.includes('must be a boolean')) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(
      {
        error: 'Failed to update notification preferences',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * PUT /api/settings/chatbot
 *
 * Updates chatbot configuration for the tenant.
 *
 * Body:
 * - questions: ChatbotQuestion[] - full array of questions
 *
 * Response:
 * - chatbot: updated chatbot questions
 */
app.put('/chatbot', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const body = await c.req.json<{ questions: ChatbotQuestion[] }>();

    if (!body.questions) {
      return c.json({ error: 'questions field is required' }, 400);
    }

    const chatbot = await updateChatbotConfig(tenant.tenantId, body.questions);
    return c.json({ chatbot });
  } catch (error) {
    console.error('[settings/chatbot] Error updating chatbot config:', error);

    if (error instanceof Error) {
      // Validation errors are user-facing
      if (
        error.message.includes('must be') ||
        error.message.includes('is required') ||
        error.message.includes('At least one')
      ) {
        return c.json({ error: error.message }, 400);
      }
    }

    return c.json(
      {
        error: 'Failed to update chatbot configuration',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * POST /api/settings/reset
 *
 * Resets settings to defaults.
 *
 * Body:
 * - section: 'timing' | 'notifications' | 'chatbot' | 'all' (default: 'all')
 *
 * Response:
 * - settings: all settings after reset
 */
app.post('/reset', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const body = await c.req.json<{ section?: 'timing' | 'notifications' | 'chatbot' | 'all' }>();

    const validSections = ['timing', 'notifications', 'chatbot', 'all'];
    const section = body.section || 'all';

    if (!validSections.includes(section)) {
      return c.json(
        {
          error: `Invalid section. Must be one of: ${validSections.join(', ')}`,
        },
        400
      );
    }

    const settings = await resetToDefaults(tenant.tenantId, section);
    return c.json({ settings });
  } catch (error) {
    console.error('[settings/reset] Error resetting settings:', error);
    return c.json(
      {
        error: 'Failed to reset settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export const settingsRoutes = app;
