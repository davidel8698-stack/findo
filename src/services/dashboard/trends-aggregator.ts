/**
 * Trends Data Aggregator
 *
 * Aggregates historical metric data for reports graphs.
 * Per DASH-06: "View weekly/monthly reports and performance trends with clear graphs"
 *
 * Data sources:
 * - metricSnapshots: Reviews, rating, review requests sent
 * - leads: Qualified lead counts
 * - whatsappMessages: WhatsApp message counts
 */

import { db } from '../../db/index';
import { metricSnapshots } from '../../db/schema/optimization';
import { leads } from '../../db/schema/leads';
import { whatsappMessages } from '../../db/schema/whatsapp';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';

/**
 * Trends data for chart rendering.
 * All arrays have same length and correspond to labels index.
 */
export interface TrendsData {
  labels: string[];           // Date labels for x-axis
  reviews: number[];          // Review counts per period
  leads: number[];            // Qualified lead counts per period
  whatsappSent: number[];     // WhatsApp message counts per period
  rating: (number | null)[];  // Average ratings (null if no data)
}

export type TrendsPeriod = 'weekly' | 'monthly';

// Hebrew month names for monthly labels
const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

/**
 * Get trends data for reports graphs.
 *
 * @param tenantId - Tenant UUID
 * @param period - 'weekly' (last 8 weeks) or 'monthly' (last 6 months)
 * @returns TrendsData with labels and metric arrays in chronological order
 */
export async function getTrendsData(tenantId: string, period: TrendsPeriod): Promise<TrendsData> {
  const now = new Date();

  if (period === 'weekly') {
    return getWeeklyTrends(tenantId, now);
  } else {
    return getMonthlyTrends(tenantId, now);
  }
}

/**
 * Get weekly trends for last 8 weeks.
 */
async function getWeeklyTrends(tenantId: string, now: Date): Promise<TrendsData> {
  // Calculate date range - last 8 weeks
  const endDate = new Date(now);
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 56); // 8 weeks = 56 days

  // Query metric snapshots for weekly data
  const snapshots = await db
    .select()
    .from(metricSnapshots)
    .where(
      and(
        eq(metricSnapshots.tenantId, tenantId),
        eq(metricSnapshots.period, 'week'),
        gte(metricSnapshots.snapshotDate, startDate.toISOString().split('T')[0]),
        lte(metricSnapshots.snapshotDate, endDate.toISOString().split('T')[0])
      )
    )
    .orderBy(desc(metricSnapshots.snapshotDate))
    .limit(8);

  // Query leads grouped by week
  const leadsResult = await db
    .select({
      week: sql<string>`date_trunc('week', ${leads.qualifiedAt})::date`,
      count: sql<number>`count(*)::int`,
    })
    .from(leads)
    .where(
      and(
        eq(leads.tenantId, tenantId),
        sql`${leads.qualifiedAt} IS NOT NULL`,
        gte(leads.qualifiedAt, startDate),
        lte(leads.qualifiedAt, endDate)
      )
    )
    .groupBy(sql`date_trunc('week', ${leads.qualifiedAt})::date`);

  // Query WhatsApp messages grouped by week
  const messagesResult = await db
    .select({
      week: sql<string>`date_trunc('week', ${whatsappMessages.createdAt})::date`,
      count: sql<number>`count(*)::int`,
    })
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.tenantId, tenantId),
        eq(whatsappMessages.direction, 'outbound'),
        gte(whatsappMessages.createdAt, startDate),
        lte(whatsappMessages.createdAt, endDate)
      )
    )
    .groupBy(sql`date_trunc('week', ${whatsappMessages.createdAt})::date`);

  // Build lookup maps for leads and messages
  const leadsMap = new Map<string, number>();
  for (const row of leadsResult) {
    if (row.week) {
      leadsMap.set(row.week, row.count);
    }
  }

  const messagesMap = new Map<string, number>();
  for (const row of messagesResult) {
    if (row.week) {
      messagesMap.set(row.week, row.count);
    }
  }

  // Generate labels and data arrays
  // Reverse to get chronological order (oldest first)
  const reversedSnapshots = [...snapshots].reverse();

  const labels: string[] = [];
  const reviews: number[] = [];
  const rating: (number | null)[] = [];
  const leadsArr: number[] = [];
  const whatsappSent: number[] = [];

  for (const snapshot of reversedSnapshots) {
    // Generate week label: "שבוע DD/MM"
    const date = new Date(snapshot.snapshotDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    labels.push(`שבוע ${day}/${month}`);

    // Reviews from snapshot
    reviews.push(snapshot.reviewCount);

    // Rating from snapshot (nullable)
    rating.push(snapshot.averageRating ? parseFloat(snapshot.averageRating) : null);

    // Leads from lookup
    const weekKey = snapshot.snapshotDate;
    leadsArr.push(leadsMap.get(weekKey) || 0);

    // WhatsApp from lookup
    whatsappSent.push(messagesMap.get(weekKey) || 0);
  }

  // If no snapshots, generate empty weeks
  if (labels.length === 0) {
    for (let i = 7; i >= 0; i--) {
      const weekDate = new Date(now);
      weekDate.setDate(weekDate.getDate() - i * 7);
      const day = weekDate.getDate();
      const month = weekDate.getMonth() + 1;
      labels.push(`שבוע ${day}/${month}`);
      reviews.push(0);
      rating.push(null);
      leadsArr.push(0);
      whatsappSent.push(0);
    }
  }

  return {
    labels,
    reviews,
    leads: leadsArr,
    whatsappSent,
    rating,
  };
}

/**
 * Get monthly trends for last 6 months.
 */
async function getMonthlyTrends(tenantId: string, now: Date): Promise<TrendsData> {
  // Calculate date range - last 6 months
  const endDate = new Date(now);
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 6);

  // Query metric snapshots for monthly data
  const snapshots = await db
    .select()
    .from(metricSnapshots)
    .where(
      and(
        eq(metricSnapshots.tenantId, tenantId),
        eq(metricSnapshots.period, 'month'),
        gte(metricSnapshots.snapshotDate, startDate.toISOString().split('T')[0]),
        lte(metricSnapshots.snapshotDate, endDate.toISOString().split('T')[0])
      )
    )
    .orderBy(desc(metricSnapshots.snapshotDate))
    .limit(6);

  // Query leads grouped by month
  const leadsResult = await db
    .select({
      month: sql<string>`date_trunc('month', ${leads.qualifiedAt})::date`,
      count: sql<number>`count(*)::int`,
    })
    .from(leads)
    .where(
      and(
        eq(leads.tenantId, tenantId),
        sql`${leads.qualifiedAt} IS NOT NULL`,
        gte(leads.qualifiedAt, startDate),
        lte(leads.qualifiedAt, endDate)
      )
    )
    .groupBy(sql`date_trunc('month', ${leads.qualifiedAt})::date`);

  // Query WhatsApp messages grouped by month
  const messagesResult = await db
    .select({
      month: sql<string>`date_trunc('month', ${whatsappMessages.createdAt})::date`,
      count: sql<number>`count(*)::int`,
    })
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.tenantId, tenantId),
        eq(whatsappMessages.direction, 'outbound'),
        gte(whatsappMessages.createdAt, startDate),
        lte(whatsappMessages.createdAt, endDate)
      )
    )
    .groupBy(sql`date_trunc('month', ${whatsappMessages.createdAt})::date`);

  // Build lookup maps
  const leadsMap = new Map<string, number>();
  for (const row of leadsResult) {
    if (row.month) {
      leadsMap.set(row.month, row.count);
    }
  }

  const messagesMap = new Map<string, number>();
  for (const row of messagesResult) {
    if (row.month) {
      messagesMap.set(row.month, row.count);
    }
  }

  // Generate labels and data arrays (chronological order)
  const reversedSnapshots = [...snapshots].reverse();

  const labels: string[] = [];
  const reviews: number[] = [];
  const rating: (number | null)[] = [];
  const leadsArr: number[] = [];
  const whatsappSent: number[] = [];

  for (const snapshot of reversedSnapshots) {
    // Generate month label in Hebrew
    const date = new Date(snapshot.snapshotDate);
    const monthIndex = date.getMonth();
    labels.push(HEBREW_MONTHS[monthIndex]);

    // Reviews from snapshot
    reviews.push(snapshot.reviewCount);

    // Rating from snapshot
    rating.push(snapshot.averageRating ? parseFloat(snapshot.averageRating) : null);

    // Leads from lookup
    const monthKey = snapshot.snapshotDate;
    leadsArr.push(leadsMap.get(monthKey) || 0);

    // WhatsApp from lookup
    whatsappSent.push(messagesMap.get(monthKey) || 0);
  }

  // If no snapshots, generate empty months
  if (labels.length === 0) {
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now);
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthIndex = monthDate.getMonth();
      labels.push(HEBREW_MONTHS[monthIndex]);
      reviews.push(0);
      rating.push(null);
      leadsArr.push(0);
      whatsappSent.push(0);
    }
  }

  return {
    labels,
    reviews,
    leads: leadsArr,
    whatsappSent,
    rating,
  };
}
