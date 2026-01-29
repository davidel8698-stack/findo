import { Hono } from 'hono';
import { tenantContext } from '../../middleware/tenant-context';
import { getStatsForPeriod, type TimePeriod, type DashboardStats } from '../../services/dashboard/stats-aggregator';
import { getHealthStatus, type HealthStatus } from '../../services/dashboard/health-checker';
import { groupActivityEvents, filterByType, type ActivityFilter, type ActivityGroup } from '../../services/dashboard/activity-grouper';
import { activityService } from '../../services/activity';
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

/**
 * GET /api/dashboard/activity
 *
 * Returns grouped activity events for the activity feed.
 *
 * Query params:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - filter: 'all' | 'leads' | 'reviews' | 'content' (default 'all')
 *
 * Returns:
 * - groups: ActivityGroup[] with grouped events
 * - hasMore: boolean indicating if more events exist
 *
 * Per CONTEXT.md: "Smart grouping - Group related events"
 */
app.get('/activity', async (c) => {
  const tenant = c.get('tenant');

  if (!tenant) {
    return c.json({ error: 'Unauthorized - tenant context required' }, 401);
  }

  // Parse query parameters
  const limitParam = c.req.query('limit');
  const offsetParam = c.req.query('offset');
  const filterParam = c.req.query('filter') || 'all';

  const limit = limitParam ? parseInt(limitParam, 10) : 50;
  const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

  // Validate filter value
  const validFilters: ActivityFilter[] = ['all', 'leads', 'reviews', 'content'];
  if (!validFilters.includes(filterParam as ActivityFilter)) {
    return c.json({
      error: `Invalid filter value. Must be one of: ${validFilters.join(', ')}`
    }, 400);
  }

  const filter = filterParam as ActivityFilter;

  try {
    // Fetch raw activity events
    // Fetch more than requested to account for grouping
    const events = await activityService.getFeed(tenant.tenantId, {
      limit: limit * 2, // Fetch extra to handle grouping
      offset,
    });

    // Group events by sourceId
    const allGroups = groupActivityEvents(events);

    // Apply filter
    const filteredGroups = filterByType(allGroups, filter);

    // Paginate groups
    const paginatedGroups = filteredGroups.slice(0, limit);

    // Check if more exist
    const hasMore = filteredGroups.length > limit || events.length === limit * 2;

    return c.json({
      groups: paginatedGroups,
      hasMore,
    });
  } catch (error) {
    console.error('[dashboard/activity] Error fetching activity:', error);
    return c.json({
      error: 'Failed to fetch activity feed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export const dashboardApiRoutes = app;
