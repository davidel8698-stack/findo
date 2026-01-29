import { createAuthenticatedClient } from './oauth';

/**
 * Performance metrics from Google Business Profile.
 * Used for visibility tracking (GBPO-02) and content metrics (GBPO-03).
 */
export interface PerformanceMetrics {
  // Time period
  startDate: string; // YYYY-MM-DD
  endDate: string;

  // Visibility metrics (GBPO-02)
  impressions: number;      // Business profile views (desktop + mobile)
  searches: number;         // Discovery searches
  actions: number;          // Total actions (calls + directions + website)

  // Action breakdown (optional detail)
  phoneCalls?: number;
  directionRequests?: number;
  websiteClicks?: number;
}

/**
 * Media metrics for content tracking (GBPO-03).
 */
export interface MediaMetrics {
  totalMediaCount: number;
  totalViews: number;
  photoCount: number;
  videoCount: number;
}

/**
 * Date range format for GBP Performance API.
 */
export interface DateRange {
  startDate: { year: number; month: number; day: number };
  endDate: { year: number; month: number; day: number };
}

// GBP Business Performance API base URL
const PERFORMANCE_API_BASE = 'https://businessprofileperformance.googleapis.com/v1';

// GBP My Business API v4 base URL (for media)
const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

// API response types
interface DailyMetricTimeSeries {
  dailyMetric?: string;
  timeSeries?: {
    datedValues?: Array<{
      date?: { year?: number; month?: number; day?: number };
      value?: string;
    }>;
  };
}

interface MultiDailyMetricsResponse {
  multiDailyMetricTimeSeries?: DailyMetricTimeSeries[];
}

interface MediaItem {
  name?: string;
  mediaFormat?: string; // PHOTO, VIDEO
  insights?: {
    viewCount?: string;
  };
}

interface ListMediaResponse {
  mediaItems?: MediaItem[];
  nextPageToken?: string;
}

/**
 * Get performance metrics for a location over a date range.
 *
 * Fetches visibility metrics from the Business Profile Performance API:
 * - Impressions (desktop + mobile profile views)
 * - Direction requests
 * - Phone calls (call clicks)
 * - Website clicks
 *
 * @param tenantId - Tenant UUID
 * @param locationName - Full location resource name (e.g., "locations/123456")
 * @param dateRange - Start and end dates
 * @returns Aggregated performance metrics or null on error
 */
export async function getPerformanceMetrics(
  tenantId: string,
  locationName: string,
  dateRange: DateRange
): Promise<PerformanceMetrics | null> {
  try {
    const client = await createAuthenticatedClient(tenantId);

    if (!client) {
      console.warn(`[google/performance] No valid credentials for tenant ${tenantId}`);
      return null;
    }

    // Build query parameters for the Performance API
    const params = new URLSearchParams();
    params.set('dailyRange.start_date.year', String(dateRange.startDate.year));
    params.set('dailyRange.start_date.month', String(dateRange.startDate.month));
    params.set('dailyRange.start_date.day', String(dateRange.startDate.day));
    params.set('dailyRange.end_date.year', String(dateRange.endDate.year));
    params.set('dailyRange.end_date.month', String(dateRange.endDate.month));
    params.set('dailyRange.end_date.day', String(dateRange.endDate.day));
    params.set('dailyMetrics', [
      'BUSINESS_IMPRESSIONS_DESKTOP',
      'BUSINESS_IMPRESSIONS_MOBILE',
      'BUSINESS_DIRECTION_REQUESTS',
      'CALL_CLICKS',
      'WEBSITE_CLICKS',
    ].join(','));

    const url = `${PERFORMANCE_API_BASE}/${locationName}:fetchMultiDailyMetricsTimeSeries?${params}`;

    const response = await client.request<MultiDailyMetricsResponse>({ url });

    // Aggregate daily values into totals
    let impressionsDesktop = 0;
    let impressionsMobile = 0;
    let directionRequests = 0;
    let phoneCalls = 0;
    let websiteClicks = 0;

    for (const series of response.data.multiDailyMetricTimeSeries || []) {
      const total = sumTimeSeries(series.timeSeries?.datedValues);

      switch (series.dailyMetric) {
        case 'BUSINESS_IMPRESSIONS_DESKTOP':
          impressionsDesktop = total;
          break;
        case 'BUSINESS_IMPRESSIONS_MOBILE':
          impressionsMobile = total;
          break;
        case 'BUSINESS_DIRECTION_REQUESTS':
          directionRequests = total;
          break;
        case 'CALL_CLICKS':
          phoneCalls = total;
          break;
        case 'WEBSITE_CLICKS':
          websiteClicks = total;
          break;
      }
    }

    const impressions = impressionsDesktop + impressionsMobile;
    const actions = phoneCalls + directionRequests + websiteClicks;

    return {
      startDate: formatDate(dateRange.startDate),
      endDate: formatDate(dateRange.endDate),
      impressions,
      searches: impressions, // Searches approximated by impressions (discovery metric)
      actions,
      phoneCalls,
      directionRequests,
      websiteClicks,
    };
  } catch (error: any) {
    console.error(`[google/performance] Failed to get metrics for tenant ${tenantId}:`, error.message);
    return null;
  }
}

/**
 * Get media metrics for a location.
 *
 * Counts photos and videos, and sums view counts if available.
 * Note: Media views may not be available via API in all cases.
 *
 * @param tenantId - Tenant UUID
 * @param accountId - Google Business Profile account ID
 * @param locationId - Location ID within the account
 * @returns Media metrics or null on error
 */
export async function getMediaMetrics(
  tenantId: string,
  accountId: string,
  locationId: string
): Promise<MediaMetrics | null> {
  try {
    const client = await createAuthenticatedClient(tenantId);

    if (!client) {
      console.warn(`[google/performance] No valid credentials for tenant ${tenantId}`);
      return null;
    }

    let photoCount = 0;
    let videoCount = 0;
    let totalViews = 0;
    let pageToken: string | undefined;

    // Paginate through all media items
    do {
      const params = new URLSearchParams();
      params.set('pageSize', '100');
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/media?${params}`;

      const response = await client.request<ListMediaResponse>({ url });

      for (const item of response.data.mediaItems || []) {
        if (item.mediaFormat === 'PHOTO') {
          photoCount++;
        } else if (item.mediaFormat === 'VIDEO') {
          videoCount++;
        }

        // Sum view counts if available
        if (item.insights?.viewCount) {
          totalViews += parseInt(item.insights.viewCount, 10) || 0;
        }
      }

      pageToken = response.data.nextPageToken;
    } while (pageToken);

    return {
      totalMediaCount: photoCount + videoCount,
      totalViews,
      photoCount,
      videoCount,
    };
  } catch (error: any) {
    console.error(`[google/performance] Failed to get media metrics for tenant ${tenantId}:`, error.message);
    return null;
  }
}

/**
 * Create a DateRange for a week starting on the given date.
 *
 * @param weekStartDate - Start of the week (typically Sunday)
 * @returns DateRange spanning 7 days
 */
export function dateRangeForWeek(weekStartDate: Date): DateRange {
  const start = new Date(weekStartDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6); // End on Saturday

  return {
    startDate: {
      year: start.getFullYear(),
      month: start.getMonth() + 1, // JavaScript months are 0-indexed
      day: start.getDate(),
    },
    endDate: {
      year: end.getFullYear(),
      month: end.getMonth() + 1,
      day: end.getDate(),
    },
  };
}

/**
 * Create a DateRange for a full month.
 *
 * @param year - Year (e.g., 2026)
 * @param month - Month (1-12)
 * @returns DateRange from 1st to last day of month
 */
export function dateRangeForMonth(year: number, month: number): DateRange {
  // Last day of month: set to next month day 0
  const lastDay = new Date(year, month, 0).getDate();

  return {
    startDate: {
      year,
      month,
      day: 1,
    },
    endDate: {
      year,
      month,
      day: lastDay,
    },
  };
}

/**
 * Sum values in a time series.
 */
function sumTimeSeries(
  datedValues?: Array<{ date?: { year?: number; month?: number; day?: number }; value?: string }>
): number {
  if (!datedValues) return 0;

  return datedValues.reduce((sum, entry) => {
    const value = parseInt(entry.value || '0', 10);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
}

/**
 * Format a date object to YYYY-MM-DD string.
 */
function formatDate(date: { year: number; month: number; day: number }): string {
  const year = date.year;
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
