import { db } from '../../db/index';
import {
  optimizationConfig,
  notificationPreferences,
  chatbotConfig,
  defaultChatbotQuestions,
  type ChatbotQuestion,
  type OptimizationConfig,
  type NotificationPreferences,
  type ChatbotConfig,
} from '../../db/schema/index';
import { eq } from 'drizzle-orm';

/**
 * Settings Service
 *
 * CRUD operations for tenant settings: timing, notifications, and chatbot.
 * Per CONTEXT.md: "Findo defaults are optimized, but owner can access settings to change individual timings"
 *
 * Creates defaults on first access using Drizzle upsert pattern.
 */

/**
 * Timing settings structure for API responses
 */
export interface TimingSettings {
  reviewRequestDelayHours: number;
  reviewReminderDelayDays: number;
}

/**
 * Notification preferences structure for API responses
 */
export interface NotificationPrefs {
  notifyNewLead: boolean;
  notifyLeadQualified: boolean;
  notifyLeadUnresponsive: boolean;
  notifyNewReview: boolean;
  notifyNegativeReview: boolean;
  notifyReviewPosted: boolean;
  notifyPhotoRequest: boolean;
  notifyPostApproval: boolean;
  notifySystemAlert: boolean;
  notifyWeeklyReport: boolean;
}

/**
 * Combined settings response
 */
export interface AllSettings {
  timing: TimingSettings;
  notifications: NotificationPrefs;
  chatbot: ChatbotQuestion[];
}

/**
 * Default timing settings
 * Per optimization.ts defaults: 24h delay, 3 day reminder
 */
const DEFAULT_TIMING: TimingSettings = {
  reviewRequestDelayHours: 24,
  reviewReminderDelayDays: 3,
};

/**
 * Default notification preferences
 * All true except notifyReviewPosted (less important)
 */
const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  notifyNewLead: true,
  notifyLeadQualified: true,
  notifyLeadUnresponsive: true,
  notifyNewReview: true,
  notifyNegativeReview: true,
  notifyReviewPosted: false,
  notifyPhotoRequest: true,
  notifyPostApproval: true,
  notifySystemAlert: true,
  notifyWeeklyReport: true,
};

/**
 * Get all settings for a tenant.
 * Creates defaults if not exist.
 *
 * @param tenantId - Tenant UUID
 * @returns Combined settings object
 */
export async function getSettings(tenantId: string): Promise<AllSettings> {
  // Fetch all settings in parallel
  const [timingResult, notificationResult, chatbotResult] = await Promise.all([
    db.query.optimizationConfig.findFirst({
      where: eq(optimizationConfig.tenantId, tenantId),
    }),
    db.query.notificationPreferences.findFirst({
      where: eq(notificationPreferences.tenantId, tenantId),
    }),
    db.query.chatbotConfig.findFirst({
      where: eq(chatbotConfig.tenantId, tenantId),
    }),
  ]);

  // Build response with defaults for missing settings
  const timing: TimingSettings = timingResult
    ? {
        reviewRequestDelayHours: timingResult.reviewRequestDelayHours,
        reviewReminderDelayDays: timingResult.reviewReminderDelayDays,
      }
    : DEFAULT_TIMING;

  const notifications: NotificationPrefs = notificationResult
    ? {
        notifyNewLead: notificationResult.notifyNewLead,
        notifyLeadQualified: notificationResult.notifyLeadQualified,
        notifyLeadUnresponsive: notificationResult.notifyLeadUnresponsive,
        notifyNewReview: notificationResult.notifyNewReview,
        notifyNegativeReview: notificationResult.notifyNegativeReview,
        notifyReviewPosted: notificationResult.notifyReviewPosted,
        notifyPhotoRequest: notificationResult.notifyPhotoRequest,
        notifyPostApproval: notificationResult.notifyPostApproval,
        notifySystemAlert: notificationResult.notifySystemAlert,
        notifyWeeklyReport: notificationResult.notifyWeeklyReport,
      }
    : DEFAULT_NOTIFICATIONS;

  const chatbot: ChatbotQuestion[] = chatbotResult?.questions || defaultChatbotQuestions;

  return {
    timing,
    notifications,
    chatbot,
  };
}

/**
 * Update timing settings for a tenant.
 * Uses upsert pattern with onConflictDoUpdate.
 *
 * Validates ranges:
 * - reviewRequestDelayHours: 12-72 hours
 * - reviewReminderDelayDays: 1-7 days
 *
 * @param tenantId - Tenant UUID
 * @param settings - Partial timing settings to update
 * @returns Updated timing settings
 * @throws Error if validation fails
 */
export async function updateTimingSettings(
  tenantId: string,
  settings: Partial<TimingSettings>
): Promise<TimingSettings> {
  // Get current settings for merge
  const current = await db.query.optimizationConfig.findFirst({
    where: eq(optimizationConfig.tenantId, tenantId),
  });

  // Merge with defaults and new settings
  const merged: TimingSettings = {
    reviewRequestDelayHours:
      settings.reviewRequestDelayHours ??
      current?.reviewRequestDelayHours ??
      DEFAULT_TIMING.reviewRequestDelayHours,
    reviewReminderDelayDays:
      settings.reviewReminderDelayDays ??
      current?.reviewReminderDelayDays ??
      DEFAULT_TIMING.reviewReminderDelayDays,
  };

  // Validate ranges
  if (merged.reviewRequestDelayHours < 12 || merged.reviewRequestDelayHours > 72) {
    throw new Error('reviewRequestDelayHours must be between 12 and 72 hours');
  }
  if (merged.reviewReminderDelayDays < 1 || merged.reviewReminderDelayDays > 7) {
    throw new Error('reviewReminderDelayDays must be between 1 and 7 days');
  }

  // Upsert
  const now = new Date();
  await db
    .insert(optimizationConfig)
    .values({
      tenantId,
      reviewRequestDelayHours: merged.reviewRequestDelayHours,
      reviewReminderDelayDays: merged.reviewReminderDelayDays,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: optimizationConfig.tenantId,
      set: {
        reviewRequestDelayHours: merged.reviewRequestDelayHours,
        reviewReminderDelayDays: merged.reviewReminderDelayDays,
        updatedAt: now,
      },
    });

  return merged;
}

/**
 * Update notification preferences for a tenant.
 * Accepts partial update (only provided fields).
 * Validates all fields are boolean.
 *
 * @param tenantId - Tenant UUID
 * @param prefs - Partial notification preferences to update
 * @returns Updated notification preferences
 * @throws Error if validation fails
 */
export async function updateNotificationPrefs(
  tenantId: string,
  prefs: Partial<NotificationPrefs>
): Promise<NotificationPrefs> {
  // Validate all provided fields are boolean
  const booleanFields = [
    'notifyNewLead',
    'notifyLeadQualified',
    'notifyLeadUnresponsive',
    'notifyNewReview',
    'notifyNegativeReview',
    'notifyReviewPosted',
    'notifyPhotoRequest',
    'notifyPostApproval',
    'notifySystemAlert',
    'notifyWeeklyReport',
  ] as const;

  for (const field of booleanFields) {
    if (prefs[field] !== undefined && typeof prefs[field] !== 'boolean') {
      throw new Error(`${field} must be a boolean`);
    }
  }

  // Get current settings for merge
  const current = await db.query.notificationPreferences.findFirst({
    where: eq(notificationPreferences.tenantId, tenantId),
  });

  // Merge with defaults and new prefs
  const merged: NotificationPrefs = {
    notifyNewLead: prefs.notifyNewLead ?? current?.notifyNewLead ?? DEFAULT_NOTIFICATIONS.notifyNewLead,
    notifyLeadQualified:
      prefs.notifyLeadQualified ?? current?.notifyLeadQualified ?? DEFAULT_NOTIFICATIONS.notifyLeadQualified,
    notifyLeadUnresponsive:
      prefs.notifyLeadUnresponsive ?? current?.notifyLeadUnresponsive ?? DEFAULT_NOTIFICATIONS.notifyLeadUnresponsive,
    notifyNewReview: prefs.notifyNewReview ?? current?.notifyNewReview ?? DEFAULT_NOTIFICATIONS.notifyNewReview,
    notifyNegativeReview:
      prefs.notifyNegativeReview ?? current?.notifyNegativeReview ?? DEFAULT_NOTIFICATIONS.notifyNegativeReview,
    notifyReviewPosted:
      prefs.notifyReviewPosted ?? current?.notifyReviewPosted ?? DEFAULT_NOTIFICATIONS.notifyReviewPosted,
    notifyPhotoRequest:
      prefs.notifyPhotoRequest ?? current?.notifyPhotoRequest ?? DEFAULT_NOTIFICATIONS.notifyPhotoRequest,
    notifyPostApproval:
      prefs.notifyPostApproval ?? current?.notifyPostApproval ?? DEFAULT_NOTIFICATIONS.notifyPostApproval,
    notifySystemAlert: prefs.notifySystemAlert ?? current?.notifySystemAlert ?? DEFAULT_NOTIFICATIONS.notifySystemAlert,
    notifyWeeklyReport:
      prefs.notifyWeeklyReport ?? current?.notifyWeeklyReport ?? DEFAULT_NOTIFICATIONS.notifyWeeklyReport,
  };

  // Upsert
  const now = new Date();
  await db
    .insert(notificationPreferences)
    .values({
      tenantId,
      ...merged,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: notificationPreferences.tenantId,
      set: {
        ...merged,
        updatedAt: now,
      },
    });

  return merged;
}

/**
 * Update chatbot configuration for a tenant.
 * Validates question structure and requires at least one required question.
 *
 * @param tenantId - Tenant UUID
 * @param questions - Full array of chatbot questions
 * @returns Updated chatbot questions
 * @throws Error if validation fails
 */
export async function updateChatbotConfig(
  tenantId: string,
  questions: ChatbotQuestion[]
): Promise<ChatbotQuestion[]> {
  // Validate question structure
  if (!Array.isArray(questions)) {
    throw new Error('questions must be an array');
  }

  // Validate each question
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (!q.id || typeof q.id !== 'string') {
      throw new Error(`Question ${i + 1}: id is required and must be a string`);
    }
    if (!q.text || typeof q.text !== 'string') {
      throw new Error(`Question ${i + 1}: text is required and must be a string`);
    }
    if (!['text', 'phone', 'choice'].includes(q.expectedType)) {
      throw new Error(`Question ${i + 1}: expectedType must be 'text', 'phone', or 'choice'`);
    }
    if (typeof q.order !== 'number') {
      throw new Error(`Question ${i + 1}: order is required and must be a number`);
    }
    if (typeof q.isRequired !== 'boolean') {
      throw new Error(`Question ${i + 1}: isRequired must be a boolean`);
    }
    if (typeof q.isActive !== 'boolean') {
      throw new Error(`Question ${i + 1}: isActive must be a boolean`);
    }
  }

  // Ensure at least one required question exists
  const hasRequired = questions.some((q) => q.isRequired && q.isActive);
  if (!hasRequired) {
    throw new Error('At least one active required question must exist');
  }

  // Upsert
  const now = new Date();
  await db
    .insert(chatbotConfig)
    .values({
      tenantId,
      questions,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: chatbotConfig.tenantId,
      set: {
        questions,
        updatedAt: now,
      },
    });

  return questions;
}

/**
 * Reset settings to defaults for a tenant.
 * Useful for "reset to defaults" button in UI.
 *
 * @param tenantId - Tenant UUID
 * @param section - Which section to reset ('timing' | 'notifications' | 'chatbot' | 'all')
 * @returns Updated settings after reset
 */
export async function resetToDefaults(
  tenantId: string,
  section: 'timing' | 'notifications' | 'chatbot' | 'all' = 'all'
): Promise<AllSettings> {
  const now = new Date();

  if (section === 'timing' || section === 'all') {
    await db
      .insert(optimizationConfig)
      .values({
        tenantId,
        ...DEFAULT_TIMING,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: optimizationConfig.tenantId,
        set: {
          ...DEFAULT_TIMING,
          updatedAt: now,
        },
      });
  }

  if (section === 'notifications' || section === 'all') {
    await db
      .insert(notificationPreferences)
      .values({
        tenantId,
        ...DEFAULT_NOTIFICATIONS,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: notificationPreferences.tenantId,
        set: {
          ...DEFAULT_NOTIFICATIONS,
          updatedAt: now,
        },
      });
  }

  if (section === 'chatbot' || section === 'all') {
    await db
      .insert(chatbotConfig)
      .values({
        tenantId,
        questions: defaultChatbotQuestions,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: chatbotConfig.tenantId,
        set: {
          questions: defaultChatbotQuestions,
          updatedAt: now,
        },
      });
  }

  return getSettings(tenantId);
}
