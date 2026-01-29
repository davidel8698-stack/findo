import { pgTable, uuid, varchar, text, timestamp, integer, boolean, decimal, date, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

/**
 * Metric snapshot period enum - aggregation period for metrics.
 */
export const metricPeriodEnum = pgEnum('metric_period', [
  'week',   // Weekly aggregation (Sunday to Saturday)
  'month',  // Monthly aggregation
]);

/**
 * A/B test type enum - types of tests that can be run.
 * Based on GBPO-05 optimization areas.
 */
export const abTestTypeEnum = pgEnum('ab_test_type', [
  'review_request_message',   // Review request message variants
  'review_request_timing',    // Delay timing variants (24h, 48h, etc.)
  'review_reminder_message',  // Reminder message variants
  'photo_request_message',    // Photo request message variants
  'post_request_message',     // Post request message variants
]);

/**
 * Metric Snapshots Table
 *
 * Weekly metric aggregation for performance tracking and A/B test evaluation.
 * Captures all key metrics per GBPO-01/02/03 requirements.
 *
 * Per CONTEXT.md: Continuous optimization based on baseline comparison.
 */
export const metricSnapshots = pgTable('metric_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Time period
  snapshotDate: date('snapshot_date').notNull(), // Week start date (always Sunday)
  period: metricPeriodEnum('period').notNull(),

  // Review metrics (GBPO-01)
  totalReviews: integer('total_reviews').notNull().default(0),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }), // 0.00 - 5.00
  reviewCount: integer('review_count').notNull().default(0), // Reviews in this period
  responsePercentage: decimal('response_percentage', { precision: 5, scale: 2 }), // 0.00 - 100.00

  // Visibility metrics (GBPO-02) - nullable as GBP may not provide
  impressions: integer('impressions'),
  searches: integer('searches'),
  actions: integer('actions'), // calls, directions, website clicks

  // Content metrics (GBPO-03)
  imageCount: integer('image_count').notNull().default(0),
  imageViews: integer('image_views'),

  // Review request metrics
  reviewRequestsSent: integer('review_requests_sent').notNull().default(0),
  reviewRequestsCompleted: integer('review_requests_completed').notNull().default(0),
  reviewRequestConversionRate: decimal('review_request_conversion_rate', { precision: 5, scale: 2 }), // 0.00 - 100.00

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one snapshot per tenant per period per date
  uniqueSnapshot: unique('metric_snapshots_unique').on(table.tenantId, table.snapshotDate, table.period),
  // Index for tenant queries
  tenantIdx: index('metric_snapshots_tenant_idx').on(table.tenantId),
  // Index for date range queries
  dateIdx: index('metric_snapshots_date_idx').on(table.snapshotDate),
}));

/**
 * Tenant Baselines Table
 *
 * Dynamic baseline storage for performance comparison.
 * Baselines are calculated from historical data and updated periodically.
 *
 * Per CONTEXT.md: "Goal-less optimization" - measure against own baseline, not arbitrary targets.
 */
export const tenantBaselines = pgTable('tenant_baselines', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // Baseline metrics
  baselineReviewRate: decimal('baseline_review_rate', { precision: 5, scale: 2 }), // Reviews per week
  baselineResponseRate: decimal('baseline_response_rate', { precision: 5, scale: 2 }), // 0.00 - 100.00
  baselineConversionRate: decimal('baseline_conversion_rate', { precision: 5, scale: 2 }), // 0.00 - 100.00

  // Sample tracking
  samplesCount: integer('samples_count').notNull().default(0), // Weeks of data used
  calculatedAt: timestamp('calculated_at', { withTimezone: true }).notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * A/B Test Variants Table
 *
 * Defines test variants for different optimization areas.
 * Each variant has content/configuration and tracks global winner status.
 *
 * Per GBPO-05: A/B testing for message templates, timing, etc.
 */
export const abTestVariants = pgTable('ab_test_variants', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Test identification
  testType: abTestTypeEnum('test_type').notNull(),
  variantName: varchar('variant_name', { length: 100 }).notNull(),

  // Variant configuration (JSON blob with specifics)
  variantContent: text('variant_content').notNull(), // JSON: { message: "...", delay: 24, etc. }

  // Control and winner tracking
  isControl: boolean('is_control').notNull().default(false),
  isGlobalWinner: boolean('is_global_winner').notNull().default(false),
  globalWinnerAt: timestamp('global_winner_at', { withTimezone: true }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Unique variant name per test type
  uniqueVariant: unique('ab_test_variants_unique').on(table.testType, table.variantName),
  // Index for test type lookups
  testTypeIdx: index('ab_test_variants_type_idx').on(table.testType),
}));

/**
 * A/B Test Assignments Table
 *
 * Per-tenant variant assignments with outcome tracking.
 * Each tenant is assigned to one variant per test type.
 *
 * Tracks conversion data for statistical significance calculations.
 */
export const abTestAssignments = pgTable('ab_test_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').notNull().references(() => abTestVariants.id, { onDelete: 'cascade' }),

  // Assignment tracking
  assignedAt: timestamp('assigned_at', { withTimezone: true }).notNull(),

  // Outcome tracking
  samplesCollected: integer('samples_collected').notNull().default(0),
  successCount: integer('success_count').notNull().default(0),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }), // 0.00 - 100.00

  // Active status
  isActive: boolean('is_active').notNull().default(true),
  deactivatedAt: timestamp('deactivated_at', { withTimezone: true }),
  deactivationReason: varchar('deactivation_reason', { length: 255 }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // One assignment per tenant per variant
  uniqueAssignment: unique('ab_test_assignments_unique').on(table.tenantId, table.variantId),
  // Index for variant aggregate queries
  variantIdx: index('ab_test_assignments_variant_idx').on(table.variantId),
}));

/**
 * Optimization Config Table
 *
 * Per-tenant tuning state and configuration.
 * Stores timing settings, limits, and auto-tuning state.
 *
 * Per CONTEXT.md: Soft limits with override capability for edge cases.
 */
export const optimizationConfig = pgTable('optimization_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // Review request timing (GBPO-05)
  reviewRequestDelayHours: integer('review_request_delay_hours').notNull().default(24),
  reviewReminderDelayDays: integer('review_reminder_delay_days').notNull().default(3),

  // Soft limits with override capability
  maxReviewRequestsPerCustomerPerMonth: integer('max_review_requests_per_customer_per_month').notNull().default(1),
  overrideLimits: boolean('override_limits').notNull().default(false),

  // Auto-tuning state
  lastTuningRun: timestamp('last_tuning_run', { withTimezone: true }),
  lastTuningAction: text('last_tuning_action'), // JSON summary of last action

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports for TypeScript inference
export type MetricSnapshot = typeof metricSnapshots.$inferSelect;
export type NewMetricSnapshot = typeof metricSnapshots.$inferInsert;

export type TenantBaseline = typeof tenantBaselines.$inferSelect;
export type NewTenantBaseline = typeof tenantBaselines.$inferInsert;

export type AbTestVariant = typeof abTestVariants.$inferSelect;
export type NewAbTestVariant = typeof abTestVariants.$inferInsert;

export type AbTestAssignment = typeof abTestAssignments.$inferSelect;
export type NewAbTestAssignment = typeof abTestAssignments.$inferInsert;

export type OptimizationConfig = typeof optimizationConfig.$inferSelect;
export type NewOptimizationConfig = typeof optimizationConfig.$inferInsert;
