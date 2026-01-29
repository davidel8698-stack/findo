import { db } from '../../db/index';
import { missedCalls, leads, whatsappMessages, processedReviews, tenants, metricSnapshots } from '../../db/schema/index';
import { eq, and, gte, lte, count, desc, sql } from 'drizzle-orm';

/**
 * Time period for stats aggregation.
 * Per CONTEXT.md: "Switchable time periods - Tabs or dropdown: Today / This Week / This Month"
 */
export type TimePeriod = 'today' | 'week' | 'month';

/**
 * Dashboard stats returned by getStatsForPeriod.
 * Per DASH-01: "Main screen shows daily stats (calls received, unanswered, WhatsApp sent, new reviews, current rating)"
 */
export interface DashboardStats {
  period: TimePeriod;
  missedCalls: number;
  whatsappSent: number;
  newReviews: number;
  currentRating: number | null;
  qualifiedLeads: number;
}

/**
 * Get date range for a time period in the specified timezone.
 *
 * @param period - Time period to get range for
 * @param timezone - IANA timezone (default: Asia/Jerusalem)
 * @returns Start and end dates for the period
 */
export function getDateRange(period: TimePeriod, timezone: string = 'Asia/Jerusalem'): { start: Date; end: Date } {
  // Get current time in the target timezone
  const now = new Date();

  // Create formatter to get timezone offset
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '0';

  const year = parseInt(getPart('year'), 10);
  const month = parseInt(getPart('month'), 10) - 1; // JavaScript months are 0-indexed
  const day = parseInt(getPart('day'), 10);
  const hour = parseInt(getPart('hour'), 10);
  const minute = parseInt(getPart('minute'), 10);
  const second = parseInt(getPart('second'), 10);

  // Current time in target timezone (as local Date object)
  const tzNow = new Date(year, month, day, hour, minute, second);

  let start: Date;
  const end = now; // End is always now (current moment)

  switch (period) {
    case 'today':
      // Midnight today in target timezone
      start = new Date(year, month, day, 0, 0, 0);
      break;

    case 'week':
      // Sunday midnight in target timezone (Israeli week starts Sunday)
      const dayOfWeek = tzNow.getDay(); // 0 = Sunday
      start = new Date(year, month, day - dayOfWeek, 0, 0, 0);
      break;

    case 'month':
      // 1st of month midnight in target timezone
      start = new Date(year, month, 1, 0, 0, 0);
      break;
  }

  // Convert start from timezone-local back to UTC for database queries
  // We need to account for the timezone offset
  const tzOffset = getTimezoneOffset(timezone, start);
  const startUTC = new Date(start.getTime() + tzOffset);

  return { start: startUTC, end };
}

/**
 * Get timezone offset in milliseconds for a date.
 */
function getTimezoneOffset(timezone: string, date: Date): number {
  // Get the UTC time
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  // Get the time in target timezone
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));

  return utcDate.getTime() - tzDate.getTime();
}

/**
 * Get aggregated stats for a tenant over a time period.
 *
 * Per CONTEXT.md: Stats cards show "calls received, WhatsApp sent, new reviews, current rating"
 * Per RESEARCH.md: Use Promise.all for parallel queries
 *
 * @param tenantId - Tenant UUID
 * @param period - Time period (today, week, month)
 * @returns Dashboard stats for the period
 */
export async function getStatsForPeriod(tenantId: string, period: TimePeriod): Promise<DashboardStats> {
  // Get tenant timezone for accurate date ranges
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: { timezone: true },
  });

  const timezone = tenant?.timezone || 'Asia/Jerusalem';
  const { start, end } = getDateRange(period, timezone);

  // Run all queries in parallel for performance
  const [
    missedCallsResult,
    whatsappSentResult,
    newReviewsResult,
    ratingResult,
    qualifiedLeadsResult,
  ] = await Promise.all([
    // Count missed calls in period
    db
      .select({ count: count() })
      .from(missedCalls)
      .where(and(
        eq(missedCalls.tenantId, tenantId),
        gte(missedCalls.calledAt, start),
        lte(missedCalls.calledAt, end)
      )),

    // Count WhatsApp messages sent in period (outbound only)
    db
      .select({ count: count() })
      .from(whatsappMessages)
      .where(and(
        eq(whatsappMessages.tenantId, tenantId),
        eq(whatsappMessages.direction, 'outbound'),
        gte(whatsappMessages.createdAt, start),
        lte(whatsappMessages.createdAt, end)
      )),

    // Count new reviews in period (by detectedAt)
    db
      .select({ count: count() })
      .from(processedReviews)
      .where(and(
        eq(processedReviews.tenantId, tenantId),
        gte(processedReviews.detectedAt, start),
        lte(processedReviews.detectedAt, end)
      )),

    // Get current average rating from most recent metric snapshot, or calculate from reviews
    db
      .select({ averageRating: metricSnapshots.averageRating })
      .from(metricSnapshots)
      .where(eq(metricSnapshots.tenantId, tenantId))
      .orderBy(desc(metricSnapshots.snapshotDate))
      .limit(1),

    // Count qualified leads in period (by qualifiedAt)
    db
      .select({ count: count() })
      .from(leads)
      .where(and(
        eq(leads.tenantId, tenantId),
        gte(leads.qualifiedAt, start),
        lte(leads.qualifiedAt, end)
      )),
  ]);

  // Extract counts from results
  const missedCallsCount = missedCallsResult[0]?.count || 0;
  const whatsappSentCount = whatsappSentResult[0]?.count || 0;
  const newReviewsCount = newReviewsResult[0]?.count || 0;
  const qualifiedLeadsCount = qualifiedLeadsResult[0]?.count || 0;

  // Get rating - prefer metric snapshot, fallback to calculating from reviews
  let currentRating: number | null = null;

  if (ratingResult[0]?.averageRating) {
    currentRating = Number(ratingResult[0].averageRating);
  } else {
    // Calculate from reviews if no snapshot exists
    const avgResult = await db
      .select({
        avg: sql<string>`ROUND(AVG(${processedReviews.starRating})::numeric, 2)`
      })
      .from(processedReviews)
      .where(eq(processedReviews.tenantId, tenantId));

    if (avgResult[0]?.avg) {
      currentRating = parseFloat(avgResult[0].avg);
    }
  }

  return {
    period,
    missedCalls: missedCallsCount,
    whatsappSent: whatsappSentCount,
    newReviews: newReviewsCount,
    currentRating,
    qualifiedLeads: qualifiedLeadsCount,
  };
}
