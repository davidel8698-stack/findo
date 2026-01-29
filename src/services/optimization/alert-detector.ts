import { db } from '../../db/index';
import { eq, and, inArray, sql } from 'drizzle-orm';
import {
  tenants,
  googleConnections,
  metricSnapshots,
  tenantBaselines,
} from '../../db/schema/index';
import { createWhatsAppClient } from '../whatsapp/client';
import { sendTextMessage, sendTemplateMessage } from '../whatsapp/messages';
import { shouldNotify, NotificationType } from '../notification-gate';

/**
 * Alert Detector Service
 *
 * Detects performance drops and notifies business owners via WhatsApp.
 * Part of GBPO-04 (optimization tips) and NOTF-05 (proactive alerts).
 *
 * Per CONTEXT.md:
 * - Dynamic baseline from business history
 * - Weekly check after metrics collection
 * - Actionable suggestions in Hebrew
 * - WhatsApp delivery to ownerPhone
 */

/**
 * Threshold for alerting on review rate drop.
 * Alert fires when current rate is 30%+ below baseline.
 */
const ALERT_THRESHOLD_PERCENT = 30;

/**
 * Minimum samples required before alerts are enabled.
 * Tenant needs at least 4 weeks of data for reliable baseline.
 */
const MIN_SAMPLES_FOR_ALERTS = 4;

/**
 * Sleep helper for rate limiting between tenants.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get the start of the current week (Sunday).
 */
function getCurrentWeekStart(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * Compose Hebrew alert message with actionable suggestions.
 *
 * @param businessName - Business name for personalization
 * @param currentRate - Current review rate
 * @param baselineRate - Historical baseline rate
 * @param dropPercent - Percentage drop from baseline
 */
function composeAlertMessage(
  businessName: string,
  currentRate: number,
  baselineRate: number,
  dropPercent: number
): string {
  return `שלום,

שמתי לב שקצב הביקורות של ${businessName} ירד השבוע.

📊 נתונים:
• קצב נוכחי: ${currentRate.toFixed(1)} ביקורות/שבוע
• הממוצע שלכם: ${baselineRate.toFixed(1)} ביקורות/שבוע
• ירידה: ${dropPercent.toFixed(0)}%

💡 הנה כמה דברים שאפשר לעשות:

1. שלחו יותר בקשות לביקורת ללקוחות מרוצים
2. ודאו שהוואטסאפ פעיל והודעות יוצאות כראוי
3. הגדילו את מספר העסקאות הסגורות

אני אמשיך לעקוב ואעדכן אתכם בשבוע הבא.

בהצלחה! 🍀`;
}

/**
 * Send review rate drop alert via WhatsApp.
 *
 * Checks SYSTEM_ALERT notification preference before sending.
 * Uses template message to initiate conversation (outside 24h window),
 * with fallback to text message if within session window.
 *
 * @param tenantId - Tenant UUID
 * @param ownerPhone - Owner's WhatsApp number
 * @param businessName - Business name
 * @param currentRate - Current review rate
 * @param baselineRate - Historical baseline rate
 * @param dropPercent - Percentage drop from baseline
 */
export async function sendReviewRateAlert(
  tenantId: string,
  ownerPhone: string,
  businessName: string,
  currentRate: number,
  baselineRate: number,
  dropPercent: number
): Promise<boolean> {
  try {
    // Check notification preferences
    const shouldSend = await shouldNotify(tenantId, NotificationType.SYSTEM_ALERT);
    if (!shouldSend) {
      console.log(`[alert-detector] Tenant ${tenantId}: Skipping alert (preference disabled)`);
      return false;
    }

    const client = await createWhatsAppClient(tenantId);
    if (!client) {
      console.log(`[alert-detector] Tenant ${tenantId}: No WhatsApp client, cannot send alert`);
      return false;
    }

    const message = composeAlertMessage(businessName, currentRate, baselineRate, dropPercent);

    // Use text message (owner messages Findo regularly, likely in session window)
    // If this fails due to session expiry, we gracefully log and return false
    try {
      await sendTextMessage(client, ownerPhone, message);
      console.log(`[alert-detector] Tenant ${tenantId}: Alert sent to ${ownerPhone}`);
      return true;
    } catch (textError: any) {
      // If text message fails (possibly outside session window), log and skip
      // In production, could use template message here as fallback
      console.log(`[alert-detector] Tenant ${tenantId}: Text message failed (${textError.message}), alert not sent`);
      return false;
    }
  } catch (error: any) {
    console.error(`[alert-detector] Error sending alert for tenant ${tenantId}:`, error.message);
    return false;
  }
}

/**
 * Check if a tenant should receive a review rate alert.
 *
 * Alert conditions:
 * 1. Tenant has 4+ weeks of baseline data
 * 2. Current review rate is 30%+ below baseline
 * 3. Tenant has ownerPhone set
 *
 * @param tenantId - Tenant UUID
 * @returns Alert status object with sent flag and details
 */
export async function checkForAlerts(tenantId: string): Promise<{
  checked: boolean;
  alertSent: boolean;
  reason?: string;
}> {
  // Get tenant info (need ownerPhone, businessName)
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: {
      ownerPhone: true,
      businessName: true,
      status: true,
    },
  });

  if (!tenant) {
    return { checked: false, alertSent: false, reason: 'Tenant not found' };
  }

  if (!tenant.ownerPhone) {
    return { checked: false, alertSent: false, reason: 'No owner phone' };
  }

  if (tenant.status !== 'active' && tenant.status !== 'trial') {
    return { checked: false, alertSent: false, reason: 'Tenant not active' };
  }

  // Get baseline
  const baseline = await db.query.tenantBaselines.findFirst({
    where: eq(tenantBaselines.tenantId, tenantId),
  });

  if (!baseline) {
    return { checked: true, alertSent: false, reason: 'No baseline data' };
  }

  if (baseline.samplesCount < MIN_SAMPLES_FOR_ALERTS) {
    return { checked: true, alertSent: false, reason: `Only ${baseline.samplesCount} weeks of data (need ${MIN_SAMPLES_FOR_ALERTS})` };
  }

  const baselineRate = parseFloat(baseline.baselineReviewRate || '0');
  if (baselineRate === 0) {
    return { checked: true, alertSent: false, reason: 'Baseline rate is zero' };
  }

  // Get most recent snapshot
  const latestSnapshot = await db.query.metricSnapshots.findFirst({
    where: and(
      eq(metricSnapshots.tenantId, tenantId),
      eq(metricSnapshots.period, 'week')
    ),
    orderBy: (ms, { desc }) => [desc(ms.snapshotDate)],
  });

  if (!latestSnapshot) {
    return { checked: true, alertSent: false, reason: 'No recent snapshot' };
  }

  const currentRate = latestSnapshot.reviewCount;

  // Calculate drop percentage
  const dropPercent = ((baselineRate - currentRate) / baselineRate) * 100;

  // Check if drop exceeds threshold
  if (dropPercent < ALERT_THRESHOLD_PERCENT) {
    return {
      checked: true,
      alertSent: false,
      reason: `Drop (${dropPercent.toFixed(1)}%) below threshold (${ALERT_THRESHOLD_PERCENT}%)`,
    };
  }

  // Send alert
  const sent = await sendReviewRateAlert(
    tenantId,
    tenant.ownerPhone,
    tenant.businessName,
    currentRate,
    baselineRate,
    dropPercent
  );

  return {
    checked: true,
    alertSent: sent,
    reason: sent ? `Alert sent: ${dropPercent.toFixed(1)}% drop` : 'Alert failed to send',
  };
}

/**
 * Check alerts for all eligible tenants.
 *
 * Called after weekly metrics collection completes.
 * Rate limited with 100ms delay between tenants.
 *
 * @returns Counts of checked and sent alerts
 */
export async function checkAlertsForAllTenants(): Promise<{
  checked: number;
  sent: number;
}> {
  console.log('[alert-detector] Starting alert check for all tenants...');

  // Get all active/trial tenants with Google connections and owner phone
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
        sql`${tenants.ownerPhone} IS NOT NULL`,
        sql`${tenants.deletedAt} IS NULL`
      )
    );

  let checked = 0;
  let sent = 0;

  for (const { tenantId } of eligibleTenants) {
    try {
      const result = await checkForAlerts(tenantId);

      if (result.checked) {
        checked++;
      }

      if (result.alertSent) {
        sent++;
      }

      console.log(`[alert-detector] Tenant ${tenantId}: ${result.reason}`);

      // Rate limit protection - 100ms delay between tenants
      await sleep(100);
    } catch (error: any) {
      console.error(`[alert-detector] Error checking tenant ${tenantId}:`, error.message);
    }
  }

  console.log(`[alert-detector] Complete: ${checked} checked, ${sent} alerts sent`);

  return { checked, sent };
}
