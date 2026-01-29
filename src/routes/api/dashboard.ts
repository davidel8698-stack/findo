import { Hono } from 'hono';
import { tenantContext } from '../../middleware/tenant-context';
import { getStatsForPeriod, type TimePeriod, type DashboardStats } from '../../services/dashboard/stats-aggregator';
import { getHealthStatus, type HealthStatus } from '../../services/dashboard/health-checker';
import type { TenantContext } from '../../types/tenant-context';

// Extend Hono Variables for tenant context
type Variables = {
  tenant: TenantContext;
};

/**
 * Dashboard API Routes
 *
 * Provides stats and health data for the main dashboard.
 * Per CONTEXT.md: "Health status on top" and "Switchable time periods - Today / This Week / This Month"
 */
const app = new Hono<{ Variables: Variables }>();

// Apply tenant context middleware to all routes
app.use('*', tenantContext);

/**
 * GET /api/dashboard/stats
 *
 * Returns aggregated stats for the dashboard cards.
 *
 * Query params:
 * - period: 'today' | 'week' | 'month' (default: 'today')
 *
 * Returns:
 * - stats: DashboardStats object with counts and rating
 *
 * Per DASH-01: "Main screen shows daily stats (calls received, unanswered, WhatsApp sent, new reviews, current rating)"
 */
app.get('/stats', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  // Get period from query string, validate and default to 'today'
  const periodParam = c.req.query('period') || 'today';

  // Validate period value
  const validPeriods: TimePeriod[] = ['today', 'week', 'month'];
  if (!validPeriods.includes(periodParam as TimePeriod)) {
    return c.json({
      error: `Invalid period value. Must be one of: ${validPeriods.join(', ')}`
    }, 400);
  }

  const period = periodParam as TimePeriod;

  try {
    const stats: DashboardStats = await getStatsForPeriod(tenant.tenantId, period);

    return c.json({ stats });
  } catch (error) {
    console.error('[dashboard/stats] Error fetching stats:', error);
    return c.json({
      error: 'Failed to fetch dashboard stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

/**
 * GET /api/dashboard/health
 *
 * Returns system health status for the dashboard indicator.
 *
 * No params required.
 *
 * Returns:
 * - health: HealthStatus object with overall status and component breakdown
 *
 * Per CONTEXT.md: "Traffic light (green/yellow/red) PLUS component breakdown (WhatsApp checkmark, Google checkmark, Reviews warning)"
 */
app.get('/health', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  try {
    const health: HealthStatus = await getHealthStatus(tenant.tenantId);

    return c.json({ health });
  } catch (error) {
    console.error('[dashboard/health] Error fetching health status:', error);
    return c.json({
      error: 'Failed to fetch health status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export const dashboardApiRoutes = app;
