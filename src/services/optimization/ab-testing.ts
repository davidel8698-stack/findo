import { db } from '../../db/index';
import {
  abTestVariants,
  abTestAssignments,
  type AbTestVariant,
} from '../../db/schema/index';
import { eq, and, sql, inArray, ne } from 'drizzle-orm';

/**
 * Test types matching schema ab_test_type enum.
 */
export type TestType =
  | 'review_request_message'
  | 'review_request_timing'
  | 'review_reminder_message'
  | 'photo_request_message'
  | 'post_request_message';

/**
 * Threshold for declaring a winner.
 * Per CONTEXT.md: 20%+ better with 10+ samples.
 */
const WINNER_THRESHOLD_PERCENT = 20;
const MIN_SAMPLES_FOR_WINNER = 10;

/**
 * Get or assign a variant for a tenant for a specific test type.
 * If no assignment exists, randomly assigns from active variants.
 *
 * @param tenantId - Tenant ID
 * @param testType - Type of A/B test
 * @returns Assigned variant or null if no variants defined
 */
export async function getActiveVariant(
  tenantId: string,
  testType: TestType
): Promise<AbTestVariant | null> {
  // Check existing active assignment
  const existing = await db
    .select({
      assignment: abTestAssignments,
      variant: abTestVariants,
    })
    .from(abTestAssignments)
    .innerJoin(abTestVariants, eq(abTestVariants.id, abTestAssignments.variantId))
    .where(and(
      eq(abTestAssignments.tenantId, tenantId),
      eq(abTestAssignments.isActive, true),
      eq(abTestVariants.testType, testType)
    ))
    .limit(1);

  if (existing.length > 0) {
    return existing[0].variant;
  }

  // No active assignment - assign one
  return await assignVariant(tenantId, testType);
}

/**
 * Assign a variant to a tenant.
 * Prefers global winners, otherwise random assignment.
 *
 * @param tenantId - Tenant ID
 * @param testType - Type of A/B test
 * @returns Assigned variant or null if no variants defined
 */
export async function assignVariant(
  tenantId: string,
  testType: TestType
): Promise<AbTestVariant | null> {
  // Get all variants for this test type
  const variants = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.testType, testType));

  if (variants.length === 0) {
    return null; // No variants defined for this test
  }

  // Check for global winner first
  const globalWinner = variants.find(v => v.isGlobalWinner);
  if (globalWinner) {
    await createAssignment(tenantId, globalWinner.id);
    return globalWinner;
  }

  // Random assignment among available variants
  const randomIndex = Math.floor(Math.random() * variants.length);
  const selectedVariant = variants[randomIndex];

  await createAssignment(tenantId, selectedVariant.id);
  return selectedVariant;
}

/**
 * Create an assignment record for a tenant-variant pair.
 */
async function createAssignment(tenantId: string, variantId: string): Promise<void> {
  await db.insert(abTestAssignments).values({
    tenantId,
    variantId,
    assignedAt: new Date(),
    samplesCollected: 0,
    successCount: 0,
    isActive: true,
  }).onConflictDoNothing(); // Ignore if already exists
}

/**
 * Record an outcome for a test.
 *
 * @param tenantId - Tenant ID
 * @param testType - Type of test
 * @param success - Whether the outcome was successful (e.g., review received after request)
 */
export async function recordOutcome(
  tenantId: string,
  testType: TestType,
  success: boolean
): Promise<void> {
  // Get active assignment
  const [assignment] = await db
    .select({
      assignment: abTestAssignments,
      variant: abTestVariants,
    })
    .from(abTestAssignments)
    .innerJoin(abTestVariants, eq(abTestVariants.id, abTestAssignments.variantId))
    .where(and(
      eq(abTestAssignments.tenantId, tenantId),
      eq(abTestAssignments.isActive, true),
      eq(abTestVariants.testType, testType)
    ))
    .limit(1);

  if (!assignment) {
    console.log(`[ab-testing] No active assignment for tenant ${tenantId}, test ${testType}`);
    return;
  }

  const newSamples = assignment.assignment.samplesCollected + 1;
  const newSuccess = assignment.assignment.successCount + (success ? 1 : 0);
  const conversionRate = (newSuccess / newSamples) * 100;

  await db
    .update(abTestAssignments)
    .set({
      samplesCollected: newSamples,
      successCount: newSuccess,
      conversionRate: conversionRate.toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(abTestAssignments.id, assignment.assignment.id));

  console.log(`[ab-testing] Recorded outcome for tenant ${tenantId}: variant ${assignment.variant.variantName}, success=${success}, rate=${conversionRate.toFixed(1)}%`);
}

/**
 * Check if any variant should be declared a winner for a test type.
 * Per CONTEXT.md: 20%+ better than control with 10+ samples.
 *
 * @param testType - Type of test to check
 * @returns Winning variant or null if no winner yet
 */
export async function checkForWinner(testType: TestType): Promise<AbTestVariant | null> {
  // Aggregate stats by variant
  const variantStats = await db
    .select({
      variantId: abTestAssignments.variantId,
      totalSamples: sql<number>`COALESCE(SUM(${abTestAssignments.samplesCollected}), 0)::int`,
      totalSuccess: sql<number>`COALESCE(SUM(${abTestAssignments.successCount}), 0)::int`,
    })
    .from(abTestAssignments)
    .innerJoin(abTestVariants, eq(abTestVariants.id, abTestAssignments.variantId))
    .where(and(
      eq(abTestVariants.testType, testType),
      eq(abTestAssignments.isActive, true)
    ))
    .groupBy(abTestAssignments.variantId);

  // Get variants with enough samples
  const qualifiedVariants = variantStats.filter(v => v.totalSamples >= MIN_SAMPLES_FOR_WINNER);

  if (qualifiedVariants.length < 2) {
    return null; // Need at least 2 variants with enough samples to compare
  }

  // Find control variant
  const allVariants = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.testType, testType));

  const controlVariant = allVariants.find(v => v.isControl);
  if (!controlVariant) {
    return null; // No control to compare against
  }

  const controlStats = variantStats.find(v => v.variantId === controlVariant.id);
  if (!controlStats || controlStats.totalSamples < MIN_SAMPLES_FOR_WINNER) {
    return null; // Control doesn't have enough samples
  }

  const controlRate = controlStats.totalSuccess / controlStats.totalSamples;

  // Check each variant against control
  for (const stats of qualifiedVariants) {
    if (stats.variantId === controlVariant.id) continue;

    const variantRate = stats.totalSuccess / stats.totalSamples;
    const improvement = controlRate > 0
      ? ((variantRate - controlRate) / controlRate) * 100
      : variantRate > 0 ? 100 : 0; // If control is 0, any success is 100% improvement

    if (improvement >= WINNER_THRESHOLD_PERCENT) {
      // Found a winner!
      const winner = allVariants.find(v => v.id === stats.variantId);
      if (winner) {
        console.log(`[ab-testing] Winner found: ${winner.variantName} (${improvement.toFixed(1)}% better than control)`);
        return winner;
      }
    }
  }

  return null;
}

/**
 * Promote a variant to global winner.
 * All new tenants will be assigned this variant.
 *
 * @param variantId - ID of variant to promote
 */
export async function promoteToGlobalWinner(variantId: string): Promise<void> {
  const [variant] = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.id, variantId))
    .limit(1);

  if (!variant) {
    throw new Error(`Variant ${variantId} not found`);
  }

  // Clear any existing global winner for this test type
  await db
    .update(abTestVariants)
    .set({
      isGlobalWinner: false,
      updatedAt: new Date(),
    })
    .where(and(
      eq(abTestVariants.testType, variant.testType),
      eq(abTestVariants.isGlobalWinner, true)
    ));

  // Set new winner
  await db
    .update(abTestVariants)
    .set({
      isGlobalWinner: true,
      globalWinnerAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(abTestVariants.id, variantId));

  console.log(`[ab-testing] Promoted ${variant.variantName} to global winner for ${variant.testType}`);
}

/**
 * Seed initial variants for a test type.
 * Call this during deployment to set up test infrastructure.
 *
 * @param testType - Type of test to seed
 * @param variants - Array of variant definitions
 */
export async function seedVariants(
  testType: TestType,
  variants: Array<{ name: string; content: object; isControl?: boolean }>
): Promise<void> {
  for (const v of variants) {
    await db.insert(abTestVariants).values({
      testType,
      variantName: v.name,
      variantContent: JSON.stringify(v.content),
      isControl: v.isControl ?? false,
      isGlobalWinner: false,
    }).onConflictDoNothing();
  }
  console.log(`[ab-testing] Seeded ${variants.length} variants for ${testType}`);
}

/**
 * Migrate all existing tenant assignments to the winning variant.
 * Called after promoteToGlobalWinner to ensure all tenants benefit.
 * Per GBPO-06: "auto-adopt winners globally" means ALL tenants, not just new ones.
 *
 * @param variantId - ID of the winning variant to migrate to
 * @returns Number of tenants migrated
 */
export async function migrateToWinner(variantId: string): Promise<number> {
  // Get winner variant info
  const [winner] = await db
    .select()
    .from(abTestVariants)
    .where(eq(abTestVariants.id, variantId))
    .limit(1);

  if (!winner) {
    throw new Error(`Variant ${variantId} not found`);
  }

  // Get all other variants for this test type (losers)
  const loserVariants = await db
    .select({ id: abTestVariants.id })
    .from(abTestVariants)
    .where(and(
      eq(abTestVariants.testType, winner.testType),
      ne(abTestVariants.id, variantId)
    ));

  if (loserVariants.length === 0) {
    console.log(`[ab-testing] No other variants to migrate from for ${winner.testType}`);
    return 0;
  }

  const loserIds = loserVariants.map(v => v.id);

  // Get all active assignments to losing variants
  const affectedAssignments = await db
    .select({
      id: abTestAssignments.id,
      tenantId: abTestAssignments.tenantId,
    })
    .from(abTestAssignments)
    .where(and(
      inArray(abTestAssignments.variantId, loserIds),
      eq(abTestAssignments.isActive, true)
    ));

  if (affectedAssignments.length === 0) {
    console.log(`[ab-testing] No active assignments on losing variants for ${winner.testType}`);
    return 0;
  }

  // Deactivate all assignments to losing variants
  await db
    .update(abTestAssignments)
    .set({
      isActive: false,
      deactivatedAt: new Date(),
      deactivationReason: `Migrated to winner: ${winner.variantName}`,
      updatedAt: new Date(),
    })
    .where(and(
      inArray(abTestAssignments.variantId, loserIds),
      eq(abTestAssignments.isActive, true)
    ));

  // Create new assignments to winner for affected tenants
  let migratedCount = 0;
  for (const assignment of affectedAssignments) {
    // Check if tenant already has an assignment to the winner
    const existingWinnerAssignment = await db
      .select({ id: abTestAssignments.id })
      .from(abTestAssignments)
      .where(and(
        eq(abTestAssignments.tenantId, assignment.tenantId),
        eq(abTestAssignments.variantId, variantId),
        eq(abTestAssignments.isActive, true)
      ))
      .limit(1);

    if (existingWinnerAssignment.length === 0) {
      await db.insert(abTestAssignments).values({
        tenantId: assignment.tenantId,
        variantId,
        assignedAt: new Date(),
        samplesCollected: 0,
        successCount: 0,
        isActive: true,
      }).onConflictDoNothing();

      migratedCount++;
    }
  }

  console.log(`[ab-testing] Migrated ${migratedCount} tenants to winner ${winner.variantName}`);
  return migratedCount;
}
