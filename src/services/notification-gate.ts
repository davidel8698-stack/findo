/**
 * Notification Gate Service
 *
 * Checks tenant notification preferences before sending WhatsApp notifications.
 * Per CONTEXT.md: "Granular notification preferences - Choose exactly which events trigger WhatsApp notifications"
 *
 * Features:
 * - NotificationType enum covering all notification types
 * - shouldNotify() checks preferences before any notification
 * - NEGATIVE_REVIEW always returns true (owner must approve)
 * - Brief caching (1 minute) to avoid repeated DB queries
 */

import { db } from '../db/index';
import { notificationPreferences, type NotificationPreferences } from '../db/schema/notification-preferences';
import { eq } from 'drizzle-orm';

/**
 * All notification types in the system.
 * Maps to columns in notification_preferences table.
 */
export enum NotificationType {
  NEW_LEAD = 'newLead',
  LEAD_QUALIFIED = 'leadQualified',
  LEAD_UNRESPONSIVE = 'leadUnresponsive',
  NEW_REVIEW = 'newReview',
  NEGATIVE_REVIEW = 'negativeReview',
  REVIEW_POSTED = 'reviewPosted',
  PHOTO_REQUEST = 'photoRequest',
  POST_APPROVAL = 'postApproval',
  SYSTEM_ALERT = 'systemAlert',
  WEEKLY_REPORT = 'weeklyReport',
}

/**
 * Cache entry for notification preferences.
 */
interface PrefsCacheEntry {
  prefs: NotificationPreferences;
  expiresAt: number;
}

/**
 * In-memory cache for notification preferences.
 * TTL: 1 minute to avoid repeated DB queries during burst notifications.
 */
const prefsCache = new Map<string, PrefsCacheEntry>();

/**
 * Cache TTL in milliseconds (1 minute).
 */
const CACHE_TTL_MS = 60 * 1000;

/**
 * Map NotificationType to preference column name.
 */
function getPreferenceColumn(type: NotificationType): keyof NotificationPreferences {
  switch (type) {
    case NotificationType.NEW_LEAD:
      return 'notifyNewLead';
    case NotificationType.LEAD_QUALIFIED:
      return 'notifyLeadQualified';
    case NotificationType.LEAD_UNRESPONSIVE:
      return 'notifyLeadUnresponsive';
    case NotificationType.NEW_REVIEW:
      return 'notifyNewReview';
    case NotificationType.NEGATIVE_REVIEW:
      return 'notifyNegativeReview';
    case NotificationType.REVIEW_POSTED:
      return 'notifyReviewPosted';
    case NotificationType.PHOTO_REQUEST:
      return 'notifyPhotoRequest';
    case NotificationType.POST_APPROVAL:
      return 'notifyPostApproval';
    case NotificationType.SYSTEM_ALERT:
      return 'notifySystemAlert';
    case NotificationType.WEEKLY_REPORT:
      return 'notifyWeeklyReport';
    default:
      // Should never happen with TypeScript enum
      return 'notifyNewLead';
  }
}

/**
 * Get notification preferences for a tenant.
 * Creates default record if none exists.
 * Uses brief caching to avoid repeated DB queries.
 *
 * @param tenantId - Tenant UUID
 * @returns NotificationPreferences record
 */
export async function getNotificationPreferences(tenantId: string): Promise<NotificationPreferences> {
  // Check cache first
  const cached = prefsCache.get(tenantId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.prefs;
  }

  // Query database
  let prefs = await db.query.notificationPreferences.findFirst({
    where: eq(notificationPreferences.tenantId, tenantId),
  });

  // Create default record if none exists
  if (!prefs) {
    const [created] = await db
      .insert(notificationPreferences)
      .values({ tenantId })
      .returning();
    prefs = created;
    console.log(`[notification-gate] Created default preferences for tenant ${tenantId}`);
  }

  // Cache the result
  prefsCache.set(tenantId, {
    prefs,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return prefs;
}

/**
 * Check if a notification should be sent based on tenant preferences.
 *
 * Special case: NEGATIVE_REVIEW always returns true.
 * Per CONTEXT.md: owner must approve negative review responses.
 *
 * @param tenantId - Tenant UUID
 * @param type - Notification type to check
 * @returns true if notification should be sent, false otherwise
 */
export async function shouldNotify(tenantId: string, type: NotificationType): Promise<boolean> {
  // Special case: Negative review notifications always send
  // Per CONTEXT.md: owner must approve negative review responses
  if (type === NotificationType.NEGATIVE_REVIEW) {
    return true;
  }

  const prefs = await getNotificationPreferences(tenantId);
  const column = getPreferenceColumn(type);
  const shouldSend = prefs[column] as boolean;

  if (!shouldSend) {
    console.log(`[notification-gate] Blocked ${type} for tenant ${tenantId} (preference disabled)`);
  }

  return shouldSend;
}

/**
 * Clear cached preferences for a tenant.
 * Call this when preferences are updated.
 *
 * @param tenantId - Tenant UUID
 */
export function clearPreferencesCache(tenantId: string): void {
  prefsCache.delete(tenantId);
}

/**
 * Clear all cached preferences.
 * Useful for testing or when bulk-updating preferences.
 */
export function clearAllPreferencesCache(): void {
  prefsCache.clear();
}
