import { db } from '../../db/index';
import { eq, and, gte, lte, inArray, isNotNull, sql } from 'drizzle-orm';
import {
  tenants,
  googleConnections,
  processedReviews,
  reviewRequests,
  metricSnapshots,
  tenantBaselines,
} from '../../db/schema/index';
import {
  getPerformanceMetrics,
  getMediaMetrics,
  dateRangeForWeek,
} from '../google/performance';

/**
 * Sleep helper for rate limiting between tenants.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get the start of the previous week (Sunday).
 * If today is Monday, returns the Sunday before last week.
 * We collect metrics for the completed week, not the current one.
 */
function getPreviousWeekStart(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday

  // Calculate days to subtract to get to last Sunday
  // If today is Sunday (0), go back 7 days
  // If today is Monday (1), go back 8 days
  // etc.
  const daysToSubtract = dayOfWeek + 7;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - daysToSubtract);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
}

/**
 * Get the end of a week (Saturday) from a week start date.
 */
function getWeekEnd(weekStart: Date): Date {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Collect and store metrics for a single tenant.
 *
 * Aggregates review, visibility, content, and review request metrics
 * for the specified time period and stores in metricSnapshots table.
 *
 * @param tenantId - Tenant UUID
 * @param weekStartDate - Start of the week (Sunday)
 * @param period - 'week' or 'month' aggregation period
 */
export async function collectMetricsForTenant(
  tenantId: string,
  weekStartDate: Date,
  period: 'week' | 'month' = 'week'
): Promise<void> {
  // Get tenant's Google connection
  const connection = await db.query.googleConnections.findFirst({
    where: and(
      eq(googleConnections.tenantId, tenantId),
      eq(googleConnections.status, 'active')
    ),
  });

  if (!connection) {
    console.log(`[metrics-collector] Tenant ${tenantId}: No active Google connection, skipping`);
    return;
  }

  const weekEnd = getWeekEnd(weekStartDate);
  const weekStartStr = weekStartDate.toISOString().split('T')[0]; // YYYY-MM-DD for snapshot

  // === Review Metrics (GBPO-01) ===

  // Total reviews (all time)
  const allReviews = await db.query.processedReviews.findMany({
    where: eq(processedReviews.tenantId, tenantId),
    columns: { starRating: true, postedReply: true },
  });

  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0
    ? allReviews.reduce((sum, r) => sum + r.starRating, 0) / totalReviews
    : null;

  // Reviews in this period
  const periodReviews = await db.query.processedReviews.findMany({
    where: and(
      eq(processedReviews.tenantId, tenantId),
      gte(processedReviews.reviewCreateTime, weekStartDate),
      lte(processedReviews.reviewCreateTime, weekEnd)
    ),
    columns: { postedReply: true },
  });

  const reviewCount = periodReviews.length;
  const reviewsWithReply = periodReviews.filter(r => r.postedReply !== null).length;
  const responsePercentage = reviewCount > 0
    ? (reviewsWithReply / reviewCount) * 100
    : null;

  // === Visibility Metrics (GBPO-02) ===

  let impressions: number | null = null;
  let searches: number | null = null;
  let actions: number | null = null;

  if (connection.locationId) {
    const dateRange = dateRangeForWeek(weekStartDate);
    const locationName = `locations/${connection.locationId}`;

    const perfMetrics = await getPerformanceMetrics(
      tenantId,
      locationName,
      dateRange
    );

    if (perfMetrics) {
      impressions = perfMetrics.impressions;
      searches = perfMetrics.searches;
      actions = perfMetrics.actions;
    }
  }

  // === Content Metrics (GBPO-03) ===

  let imageCount = 0;
  let imageViews: number | null = null;

  if (connection.locationId) {
    const mediaMetrics = await getMediaMetrics(
      tenantId,
      connection.accountId,
      connection.locationId
    );

    if (mediaMetrics) {
      imageCount = mediaMetrics.photoCount;
      imageViews = mediaMetrics.totalViews || null;
    }
  }

  // === Review Request Metrics ===

  const periodRequests = await db.query.reviewRequests.findMany({
    where: and(
      eq(reviewRequests.tenantId, tenantId),
      gte(reviewRequests.invoiceDetectedAt, weekStartDate),
      lte(reviewRequests.invoiceDetectedAt, weekEnd)
    ),
    columns: { status: true },
  });

  const reviewRequestsSent = periodRequests.filter(
    r => r.status !== 'pending' && r.status !== 'skipped'
  ).length;
  const reviewRequestsCompleted = periodRequests.filter(
    r => r.status === 'completed'
  ).length;
  const reviewRequestConversionRate = reviewRequestsSent > 0
    ? (reviewRequestsCompleted / reviewRequestsSent) * 100
    : null;

  // === Store Snapshot (upsert) ===

  await db
    .insert(metricSnapshots)
    .values({
      tenantId,
      snapshotDate: weekStartStr,
      period,
      // Review metrics
      totalReviews,
      averageRating: averageRating?.toFixed(2) ?? null,
      reviewCount,
      responsePercentage: responsePercentage?.toFixed(2) ?? null,
      // Visibility metrics
      impressions,
      searches,
      actions,
      // Content metrics
      imageCount,
      imageViews,
      // Review request metrics
      reviewRequestsSent,
      reviewRequestsCompleted,
      reviewRequestConversionRate: reviewRequestConversionRate?.toFixed(2) ?? null,
    })
    .onConflictDoUpdate({
      target: [metricSnapshots.tenantId, metricSnapshots.snapshotDate, metricSnapshots.period],
      set: {
        totalReviews,
        averageRating: averageRating?.toFixed(2) ?? null,
        reviewCount,
        responsePercentage: responsePercentage?.toFixed(2) ?? null,
        impressions,
        searches,
        actions,
        imageCount,
        imageViews,
        reviewRequestsSent,
        reviewRequestsCompleted,
        reviewRequestConversionRate: reviewRequestConversionRate?.toFixed(2) ?? null,
        updatedAt: new Date(),
      },
    });

  console.log(`[metrics-collector] Tenant ${tenantId}: Snapshot stored for ${weekStartStr}`);
}

/**
 * Calculate and update baseline metrics for a tenant.
 *
 * Per CONTEXT.md "dynamic baseline":
 * - Uses last 8 weeks of data
 * - Requires at least 4 weeks to set baseline
 * - Calculates moving average for review rate, response rate, conversion rate
 *
 * @param tenantId - Tenant UUID
 */
export async function calculateBaseline(tenantId: string): Promise<void> {
  // Query last 8 weeks of snapshots
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56); // 8 weeks * 7 days

  const snapshots = await db.query.metricSnapshots.findMany({
    where: and(
      eq(metricSnapshots.tenantId, tenantId),
      eq(metricSnapshots.period, 'week'),
      gte(metricSnapshots.snapshotDate, eightWeeksAgo.toISOString().split('T')[0])
    ),
    orderBy: (ms, { desc }) => [desc(ms.snapshotDate)],
    limit: 8,
  });

  // Need at least 4 weeks of data
  if (snapshots.length < 4) {
    console.log(`[metrics-collector] Tenant ${tenantId}: Only ${snapshots.length} weeks of data, need 4+ for baseline`);
    return;
  }

  // Calculate moving averages
  const reviewCounts = snapshots.map(s => s.reviewCount);
  const responseRates = snapshots
    .map(s => s.responsePercentage ? parseFloat(s.responsePercentage) : null)
    .filter((r): r is number => r !== null);
  const conversionRates = snapshots
    .map(s => s.reviewRequestConversionRate ? parseFloat(s.reviewRequestConversionRate) : null)
    .filter((r): r is number => r !== null);

  const baselineReviewRate = reviewCounts.reduce((a, b) => a + b, 0) / reviewCounts.length;
  const baselineResponseRate = responseRates.length > 0
    ? responseRates.reduce((a, b) => a + b, 0) / responseRates.length
    : null;
  const baselineConversionRate = conversionRates.length > 0
    ? conversionRates.reduce((a, b) => a + b, 0) / conversionRates.length
    : null;

  // Upsert baseline
  await db
    .insert(tenantBaselines)
    .values({
      tenantId,
      baselineReviewRate: baselineReviewRate.toFixed(2),
      baselineResponseRate: baselineResponseRate?.toFixed(2) ?? null,
      baselineConversionRate: baselineConversionRate?.toFixed(2) ?? null,
      samplesCount: snapshots.length,
      calculatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: tenantBaselines.tenantId,
      set: {
        baselineReviewRate: baselineReviewRate.toFixed(2),
        baselineResponseRate: baselineResponseRate?.toFixed(2) ?? null,
        baselineConversionRate: baselineConversionRate?.toFixed(2) ?? null,
        samplesCount: snapshots.length,
        calculatedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  console.log(`[metrics-collector] Tenant ${tenantId}: Baseline updated (${snapshots.length} weeks of data)`);
}

/**
 * Collect metrics for all active tenants.
 *
 * Queries all tenants with:
 * - status 'active' or 'trial'
 * - googleConnections.status = 'active'
 *
 * For each tenant, collects metrics and updates baseline.
 * Rate limited with 100ms delay between tenants.
 *
 * @returns Counts of processed, skipped, and errored tenants
 */
export async function collectMetricsForAllTenants(): Promise<{
  processed: number;
  skipped: number;
  errors: number;
}> {
  const weekStart = getPreviousWeekStart();

  console.log(`[metrics-collector] Collecting metrics for week starting ${weekStart.toISOString().split('T')[0]}`);

  // Get all tenants with active Google connections and active/trial status
  const eligibleTenants = await db
    .select({
      tenantId: tenants.id,
    })
    .from(tenants)
    .innerJoin(googleConnections, eq(tenants.id, googleConnections.tenantId))
    .where(
      and(
        inArray(tenants.status, ['active', 'trial']),
        eq(googleConnections.status, 'active'),
        sql`${tenants.deletedAt} IS NULL`
      )
    );

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const { tenantId } of eligibleTenants) {
    try {
      await collectMetricsForTenant(tenantId, weekStart);
      await calculateBaseline(tenantId);
      processed++;

      // Rate limit protection - 100ms delay between tenants
      await sleep(100);
    } catch (error: any) {
      console.error(`[metrics-collector] Error for tenant ${tenantId}:`, error.message);
      errors++;
    }
  }

  // Count skipped (tenants without active Google connection or wrong status)
  const totalTenants = await db
    .select({ count: sql<number>`count(*)` })
    .from(tenants)
    .where(sql`${tenants.deletedAt} IS NULL`);

  skipped = (totalTenants[0]?.count || 0) - eligibleTenants.length;

  return { processed, skipped, errors };
}
