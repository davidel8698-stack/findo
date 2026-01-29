import { db } from '../../db/index';
import { eq, and, inArray, sql, gte, desc } from 'drizzle-orm';
import {
  tenants,
  googleConnections,
  metricSnapshots,
  optimizationConfig,
  abTestVariants,
} from '../../db/schema/index';
import { createWhatsAppClient } from '../whatsapp/client';
import { sendTextMessage } from '../whatsapp/messages';
import {
  checkForWinner,
  promoteToGlobalWinner,
  migrateToWinner,
  type TestType,
} from './ab-testing';

/**
 * Auto-Tuner Service
 *
 * Autonomous optimization engine per CONTEXT.md:
 * - Aggressive autonomy
 * - Full operational scope (all processes)
 * - Weekly summary notifications
 * - Soft limits with override
 * - Auto-rollback on harm
 *
 * Runs weekly on Monday 3:00 AM (after metrics collection at 2:00 AM).
 */

/**
 * Sleep helper for rate limiting between tenants.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * All test types for winner checking.
 */
const ALL_TEST_TYPES: TestType[] = [
  'review_request_message',
  'review_request_timing',
  'review_reminder_message',
  'photo_request_message',
  'post_request_message',
];

/**
 * Tuning action record for summary.
 */
export interface TuningAction {
  type: 'winner_promoted' | 'timing_adjusted' | 'regression_detected';
  tenantId?: string;
  testType?: TestType;
  variantName?: string;
  details: string;
  tenantsAffected?: number;
}

/**
 * Main entry point for auto-tuning.
 * Runs all optimization checks and returns summary of actions.
 *
 * Per CONTEXT.md:
 * 1. Check A/B test winners across all test types
 * 2. Promote winners and migrate existing tenants
 * 3. Check for regressions (auto-rollback monitoring)
 * 4. Tune per-tenant review request timing based on conversion rates
 */
export async function runAutoTuning(): Promise<TuningAction[]> {
  console.log('[auto-tuner] Starting weekly auto-tuning...');

  const actions: TuningAction[] = [];

  // Step 1: Check for A/B test winners across all test types
  for (const testType of ALL_TEST_TYPES) {
    try {
      const winner = await checkForWinner(testType);

      if (winner && !winner.isGlobalWinner) {
        console.log(`[auto-tuner] Found new winner for ${testType}: ${winner.variantName}`);

        // Promote to global winner
        await promoteToGlobalWinner(winner.id);

        // Migrate existing tenants to winner
        const migratedCount = await migrateToWinner(winner.id);

        actions.push({
          type: 'winner_promoted',
          testType,
          variantName: winner.variantName,
          details: `Promoted ${winner.variantName} as global winner (20%+ improvement)`,
          tenantsAffected: migratedCount,
        });
      }
    } catch (error: any) {
      console.error(`[auto-tuner] Error checking winner for ${testType}:`, error.message);
    }
  }

  // Step 2: Check for regressions in recently promoted winners
  const regressions = await checkForRegressions();
  actions.push(...regressions);

  // Step 3: Tune per-tenant review request timing
  const timingActions = await tuneAllTenantsReviewRequestTiming();
  actions.push(...timingActions);

  // Step 4: Update tuning timestamp for all tenants
  await db
    .update(optimizationConfig)
    .set({
      lastTuningRun: new Date(),
      lastTuningAction: JSON.stringify(actions.slice(0, 10)), // Store recent actions
      updatedAt: new Date(),
    });

  console.log(`[auto-tuner] Completed with ${actions.length} actions`);
  return actions;
}

/**
 * Check for performance regressions after recent winner promotions.
 * Monitors conversion rates for recently promoted variants.
 *
 * Auto-rollback monitoring: if adopted changes harm metrics significantly,
 * this would flag for investigation (full rollback not implemented yet).
 */
export async function checkForRegressions(): Promise<TuningAction[]> {
  const actions: TuningAction[] = [];

  // Get variants promoted in last 4 weeks
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const recentWinners = await db
    .select()
    .from(abTestVariants)
    .where(and(
      eq(abTestVariants.isGlobalWinner, true),
      gte(abTestVariants.globalWinnerAt!, fourWeeksAgo)
    ));

  for (const winner of recentWinners) {
    // Check if conversion rate has dropped significantly since promotion
    // This is a simplified check - in production would compare pre/post rates

    // For now, just log that we're monitoring
    console.log(`[auto-tuner] Monitoring ${winner.variantName} for regressions`);
  }

  return actions;
}

/**
 * Tune review request timing for a single tenant based on conversion rates.
 *
 * Per CONTEXT.md optimization rules:
 * - If conversion < 10% and delay > 12h: shorten delay by 4h (more timely = better engagement)
 * - If conversion > 30% and delay < 48h: extend delay by 4h (no need to be aggressive)
 *
 * @param tenantId - Tenant UUID
 */
export async function tuneReviewRequestTiming(tenantId: string): Promise<TuningAction | null> {
  // Get current config
  const config = await db.query.optimizationConfig.findFirst({
    where: eq(optimizationConfig.tenantId, tenantId),
  });

  if (!config) {
    // No config yet - skip tuning
    return null;
  }

  // Get recent conversion rate from snapshots (last 4 weeks)
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const recentSnapshots = await db
    .select({
      conversionRate: metricSnapshots.reviewRequestConversionRate,
    })
    .from(metricSnapshots)
    .where(and(
      eq(metricSnapshots.tenantId, tenantId),
      eq(metricSnapshots.period, 'week'),
      gte(metricSnapshots.snapshotDate, fourWeeksAgo.toISOString().split('T')[0])
    ))
    .orderBy(desc(metricSnapshots.snapshotDate))
    .limit(4);

  if (recentSnapshots.length < 2) {
    // Not enough data
    return null;
  }

  // Calculate average conversion rate
  const rates = recentSnapshots
    .map(s => s.conversionRate ? parseFloat(s.conversionRate) : null)
    .filter((r): r is number => r !== null);

  if (rates.length === 0) {
    return null;
  }

  const avgConversion = rates.reduce((a, b) => a + b, 0) / rates.length;
  const currentDelay = config.reviewRequestDelayHours;

  // Apply tuning rules
  let newDelay = currentDelay;
  let reason = '';

  if (avgConversion < 10 && currentDelay > 12) {
    // Low conversion with long delay - shorten
    newDelay = Math.max(12, currentDelay - 4);
    reason = `Low conversion (${avgConversion.toFixed(1)}%) - shortened delay`;
  } else if (avgConversion > 30 && currentDelay < 48) {
    // High conversion with short delay - extend (no need to be aggressive)
    newDelay = Math.min(48, currentDelay + 4);
    reason = `High conversion (${avgConversion.toFixed(1)}%) - extended delay`;
  }

  if (newDelay !== currentDelay) {
    await db
      .update(optimizationConfig)
      .set({
        reviewRequestDelayHours: newDelay,
        updatedAt: new Date(),
      })
      .where(eq(optimizationConfig.tenantId, tenantId));

    console.log(`[auto-tuner] Tenant ${tenantId}: Adjusted delay ${currentDelay}h -> ${newDelay}h`);

    return {
      type: 'timing_adjusted',
      tenantId,
      details: `${reason} (${currentDelay}h -> ${newDelay}h)`,
    };
  }

  return null;
}

/**
 * Tune review request timing for all eligible tenants.
 */
async function tuneAllTenantsReviewRequestTiming(): Promise<TuningAction[]> {
  const actions: TuningAction[] = [];

  // Get all tenants with optimization config
  const configs = await db
    .select({ tenantId: optimizationConfig.tenantId })
    .from(optimizationConfig);

  for (const { tenantId } of configs) {
    try {
      const action = await tuneReviewRequestTiming(tenantId);
      if (action) {
        actions.push(action);
      }

      // Rate limit
      await sleep(100);
    } catch (error: any) {
      console.error(`[auto-tuner] Error tuning tenant ${tenantId}:`, error.message);
    }
  }

  return actions;
}

/**
 * Compose Hebrew weekly summary message for owner.
 *
 * @param businessName - Business name for personalization
 * @param actions - Tuning actions that affected this tenant
 */
export function composeWeeklySummaryMessage(
  businessName: string,
  actions: TuningAction[]
): string {
  if (actions.length === 0) {
    return `שלום,

סיכום אופטימיזציה שבועי עבור ${businessName}:

✅ הכל עובד כמצופה - אין שינויים השבוע.

אני ממשיך לעקוב ולבצע אופטימיזציות אוטומטיות כשצריך.

שבוע טוב! 🍀`;
  }

  const actionLines = actions.map(a => {
    if (a.type === 'winner_promoted') {
      return `🏆 גרסה מנצחת: ${a.variantName} (${a.testType?.replace(/_/g, ' ')})`;
    } else if (a.type === 'timing_adjusted') {
      return `⏱️ עדכון תזמון: ${a.details}`;
    } else if (a.type === 'regression_detected') {
      return `⚠️ נמצאה ירידה בביצועים - בבדיקה`;
    }
    return `📝 ${a.details}`;
  }).join('\n');

  return `שלום,

סיכום אופטימיזציה שבועי עבור ${businessName}:

${actionLines}

כל השינויים בוצעו אוטומטית כדי לשפר את הביצועים שלך.

שאלות? פשוט תגיב להודעה הזו.

שבוע טוב! 🍀`;
}

/**
 * Send weekly summary to a single tenant's owner.
 *
 * @param tenantId - Tenant UUID
 * @param actions - Tuning actions that affected this tenant
 */
export async function sendWeeklySummary(
  tenantId: string,
  actions: TuningAction[]
): Promise<boolean> {
  try {
    // Get tenant info
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
      columns: {
        ownerPhone: true,
        businessName: true,
        status: true,
      },
    });

    if (!tenant) {
      console.log(`[auto-tuner] Tenant ${tenantId} not found, skipping summary`);
      return false;
    }

    if (!tenant.ownerPhone) {
      console.log(`[auto-tuner] Tenant ${tenantId} has no owner phone, skipping summary`);
      return false;
    }

    if (tenant.status !== 'active' && tenant.status !== 'trial') {
      console.log(`[auto-tuner] Tenant ${tenantId} not active, skipping summary`);
      return false;
    }

    const client = await createWhatsAppClient(tenantId);
    if (!client) {
      console.log(`[auto-tuner] No WhatsApp client for tenant ${tenantId}, skipping summary`);
      return false;
    }

    const message = composeWeeklySummaryMessage(tenant.businessName, actions);

    // Try text message (owner likely in session window)
    try {
      await sendTextMessage(client, tenant.ownerPhone, message);
      console.log(`[auto-tuner] Sent weekly summary to tenant ${tenantId}`);
      return true;
    } catch (textError: any) {
      console.log(`[auto-tuner] Text message failed for ${tenantId} (${textError.message}), summary not sent`);
      return false;
    }
  } catch (error: any) {
    console.error(`[auto-tuner] Error sending summary to tenant ${tenantId}:`, error.message);
    return false;
  }
}

/**
 * Send weekly summaries to all affected tenants.
 * Groups actions by tenant and sends personalized summaries.
 *
 * @param actions - All tuning actions from this run
 */
export async function sendAllWeeklySummaries(actions: TuningAction[]): Promise<{
  sent: number;
  failed: number;
}> {
  console.log('[auto-tuner] Sending weekly summaries...');

  // Group actions by tenant
  const tenantActions = new Map<string, TuningAction[]>();

  // Add tenant-specific actions
  for (const action of actions) {
    if (action.tenantId) {
      if (!tenantActions.has(action.tenantId)) {
        tenantActions.set(action.tenantId, []);
      }
      tenantActions.get(action.tenantId)!.push(action);
    }
  }

  // Add global actions (winner promotions) to all active tenants
  const globalActions = actions.filter(a => a.type === 'winner_promoted');

  if (globalActions.length > 0) {
    // Get all active/trial tenants with Google and WhatsApp
    const eligibleTenants = await db
      .select({ tenantId: tenants.id })
      .from(tenants)
      .innerJoin(googleConnections, eq(tenants.id, googleConnections.tenantId))
      .where(and(
        inArray(tenants.status, ['active', 'trial']),
        eq(googleConnections.status, 'active'),
        sql`${tenants.ownerPhone} IS NOT NULL`,
        sql`${tenants.deletedAt} IS NULL`
      ));

    for (const { tenantId } of eligibleTenants) {
      if (!tenantActions.has(tenantId)) {
        tenantActions.set(tenantId, []);
      }
      tenantActions.get(tenantId)!.push(...globalActions);
    }
  }

  // Send summaries
  let sent = 0;
  let failed = 0;

  for (const [tenantId, tenantActionList] of tenantActions) {
    try {
      const success = await sendWeeklySummary(tenantId, tenantActionList);
      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Rate limit
      await sleep(100);
    } catch (error: any) {
      console.error(`[auto-tuner] Error sending summary to ${tenantId}:`, error.message);
      failed++;
    }
  }

  console.log(`[auto-tuner] Summaries: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}
