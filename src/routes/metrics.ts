import { Hono } from 'hono';
import { db } from '../db';
import { metricSnapshots, tenantBaselines } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Metrics API Routes
 *
 * Provides metrics data for the dashboard.
 * Returns current metrics, trends, baseline comparison, and history.
 */
const app = new Hono();

/**
 * GET /api/metrics
 *
 * Query params:
 * - tenantId: UUID (required)
 * - period: 'week' | 'month' (default: 'week')
 *
 * Returns:
 * - period: Current period selection
 * - current: Latest metrics snapshot
 * - trends: Trend direction compared to previous period
 * - baseline: Tenant baseline for comparison
 * - history: Last 8 snapshots for charts
 */
app.get('/', async (c) => {
  const tenantId = c.req.query('tenantId');
  const period = (c.req.query('period') || 'week') as 'week' | 'month';

  if (!tenantId) {
    return c.json({ error: 'tenantId required' }, 400);
  }

  // Get last 8 snapshots for trend calculation
  const snapshots = await db
    .select()
    .from(metricSnapshots)
    .where(and(
      eq(metricSnapshots.tenantId, tenantId),
      eq(metricSnapshots.period, period)
    ))
    .orderBy(desc(metricSnapshots.snapshotDate))
    .limit(8);

  // Get baseline
  const [baseline] = await db
    .select()
    .from(tenantBaselines)
    .where(eq(tenantBaselines.tenantId, tenantId))
    .limit(1);

  // Current = most recent, previous = second most recent (for trend)
  const current = snapshots[0] || null;
  const previous = snapshots[1] || null;

  /**
   * Calculate trend direction based on percentage change.
   * - 'up': > 5% improvement
   * - 'down': > 5% decline
   * - 'flat': within 5% range or insufficient data
   */
  const calculateTrend = (curr: number | null, prev: number | null): 'up' | 'down' | 'flat' => {
    if (curr === null || prev === null || prev === 0) return 'flat';
    const change = ((curr - prev) / prev) * 100;
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'flat';
  };

  const response = {
    period,
    current: current ? {
      snapshotDate: current.snapshotDate,
      // Review metrics (GBPO-01)
      totalReviews: current.totalReviews,
      averageRating: current.averageRating,
      reviewCount: current.reviewCount,
      responsePercentage: current.responsePercentage,
      // Visibility (GBPO-02)
      impressions: current.impressions,
      searches: current.searches,
      actions: current.actions,
      // Content (GBPO-03)
      imageCount: current.imageCount,
      imageViews: current.imageViews,
      // Review requests
      reviewRequestsSent: current.reviewRequestsSent,
      reviewRequestsCompleted: current.reviewRequestsCompleted,
      conversionRate: current.reviewRequestConversionRate,
    } : null,
    trends: current && previous ? {
      reviewCount: calculateTrend(current.reviewCount, previous.reviewCount),
      impressions: calculateTrend(current.impressions, previous.impressions),
      actions: calculateTrend(current.actions, previous.actions),
      imageCount: calculateTrend(current.imageCount, previous.imageCount),
      conversionRate: calculateTrend(
        Number(current.reviewRequestConversionRate),
        Number(previous.reviewRequestConversionRate)
      ),
    } : null,
    baseline: baseline ? {
      reviewRate: baseline.baselineReviewRate,
      responseRate: baseline.baselineResponseRate,
      conversionRate: baseline.baselineConversionRate,
    } : null,
    history: snapshots.map(s => ({
      date: s.snapshotDate,
      reviewCount: s.reviewCount,
      impressions: s.impressions,
      actions: s.actions,
    })),
  };

  return c.json(response);
});

export const metricsRoutes = app;
