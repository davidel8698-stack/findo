/**
 * Progressive profiling service.
 *
 * Manages the collection of additional business information
 * post-setup via WhatsApp questions. Tracks answered questions,
 * handles ignore counting, and stores answers in tenant profile.
 */

import { db } from '../../db/index';
import { tenants, setupProgress } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { getQuestionForWeek, type ProgressiveQuestion } from './questions';

/**
 * Profile data stored in setupProgress.stepData.
 * Contains answers from progressive profiling questions.
 */
export interface ProfileData {
  /** Main services offered by the business */
  services?: string;
  /** Unique value proposition */
  uniqueValue?: string;
  /** Amenities (parking, accessibility) */
  amenities?: string;
  /** Special closure times */
  specialClosures?: string;
}

/**
 * Profiling state stored in setupProgress.stepData.
 */
interface ProfilingState {
  /** Profile answers */
  profile?: ProfileData;
  /** Count of consecutive ignored questions */
  profilingIgnoreCount?: number;
  /** Timestamp when last question was sent */
  lastQuestionSentAt?: string;
  /** Field of the last question sent (to track pending) */
  lastQuestionField?: string;
}

/**
 * Calculate weeks since tenant setup was completed.
 *
 * @param tenantId - Tenant UUID
 * @returns Number of full weeks since setup, or 0 if not completed
 */
export async function getWeeksSinceSetup(tenantId: string): Promise<number> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress?.completedAt) {
    return 0;
  }

  const now = new Date();
  const completedAt = new Date(progress.completedAt);
  const diffMs = now.getTime() - completedAt.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));

  // Return 1-based week number (week 1 = first week after setup)
  return diffWeeks + 1;
}

/**
 * Check if a specific profile field has been answered.
 *
 * @param tenantId - Tenant UUID
 * @param field - Field name to check
 * @returns true if field has been answered
 */
export async function hasAnswered(tenantId: string, field: string): Promise<boolean> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress?.stepData) {
    return false;
  }

  const stepData = progress.stepData as ProfilingState;
  const profile = stepData.profile || {};

  return !!(profile as Record<string, unknown>)[field];
}

/**
 * Get consecutive ignore count for a tenant.
 *
 * @param tenantId - Tenant UUID
 * @returns Number of consecutive ignored questions (0-2)
 */
export async function getIgnoreCount(tenantId: string): Promise<number> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress?.stepData) {
    return 0;
  }

  const stepData = progress.stepData as ProfilingState;
  return stepData.profilingIgnoreCount || 0;
}

/**
 * Increment ignore count when a question is ignored.
 * Called by the weekly job when checking for unanswered questions.
 *
 * @param tenantId - Tenant UUID
 */
export async function incrementIgnoreCount(tenantId: string): Promise<void> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress) return;

  const stepData = (progress.stepData as ProfilingState) || {};
  const currentCount = stepData.profilingIgnoreCount || 0;

  await db
    .update(setupProgress)
    .set({
      stepData: {
        ...stepData,
        profilingIgnoreCount: currentCount + 1,
      },
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));
}

/**
 * Reset ignore count when an answer is received.
 *
 * @param tenantId - Tenant UUID
 */
export async function resetIgnoreCount(tenantId: string): Promise<void> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress) return;

  const stepData = (progress.stepData as ProfilingState) || {};

  await db
    .update(setupProgress)
    .set({
      stepData: {
        ...stepData,
        profilingIgnoreCount: 0,
        lastQuestionField: undefined, // Clear pending question
      },
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));
}

/**
 * Store an answer to a profiling question.
 *
 * @param tenantId - Tenant UUID
 * @param field - Field name (e.g., 'services', 'uniqueValue')
 * @param value - Answer value
 */
export async function storeAnswer(
  tenantId: string,
  field: string,
  value: string
): Promise<void> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress) return;

  const stepData = (progress.stepData as ProfilingState) || {};
  const profile = stepData.profile || {};

  await db
    .update(setupProgress)
    .set({
      stepData: {
        ...stepData,
        profile: {
          ...profile,
          [field]: value,
        },
        profilingIgnoreCount: 0, // Reset on answer
        lastQuestionField: undefined, // Clear pending
      },
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));

  console.log(`[progressive-profile] Stored answer for ${field} (tenant: ${tenantId})`);
}

/**
 * Get the next unanswered question for a tenant based on current week.
 *
 * @param tenantId - Tenant UUID
 * @returns Next question to ask, or undefined if none available
 */
export async function getNextQuestion(
  tenantId: string
): Promise<ProgressiveQuestion | undefined> {
  const weeksSinceSetup = await getWeeksSinceSetup(tenantId);

  // Only ask questions during weeks 1-4
  if (weeksSinceSetup < 1 || weeksSinceSetup > 4) {
    return undefined;
  }

  // Check if this week's question has been answered
  const question = getQuestionForWeek(weeksSinceSetup);
  if (!question) {
    return undefined;
  }

  const answered = await hasAnswered(tenantId, question.field);
  if (answered) {
    return undefined;
  }

  return question;
}

/**
 * Record that a question was sent to a tenant.
 * Used for tracking pending questions for response handling.
 *
 * @param tenantId - Tenant UUID
 * @param field - Field name of the question sent
 */
export async function recordQuestionSent(
  tenantId: string,
  field: string
): Promise<void> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress) return;

  const stepData = (progress.stepData as ProfilingState) || {};

  await db
    .update(setupProgress)
    .set({
      stepData: {
        ...stepData,
        lastQuestionSentAt: new Date().toISOString(),
        lastQuestionField: field,
      },
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));
}

/**
 * Get the pending profile question for a tenant.
 * Returns the last question sent if within 7 days.
 *
 * @param tenantId - Tenant UUID
 * @returns Pending question info, or null if none
 */
export async function getPendingProfileQuestion(
  tenantId: string
): Promise<{ field: string } | null> {
  const progress = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress?.stepData) {
    return null;
  }

  const stepData = progress.stepData as ProfilingState;

  if (!stepData.lastQuestionField || !stepData.lastQuestionSentAt) {
    return null;
  }

  // Check if question was sent within 7 days
  const sentAt = new Date(stepData.lastQuestionSentAt);
  const now = new Date();
  const diffDays = (now.getTime() - sentAt.getTime()) / (24 * 60 * 60 * 1000);

  if (diffDays > 7) {
    return null;
  }

  return { field: stepData.lastQuestionField };
}
