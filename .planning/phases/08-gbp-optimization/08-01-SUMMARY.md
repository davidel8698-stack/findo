---
phase: 08-gbp-optimization
plan: 01
subsystem: database
tags: [drizzle, postgresql, metrics, ab-testing, optimization]

dependency-graph:
  requires: [01-01-tenants-schema]
  provides: [metric-snapshots, ab-testing-tables, optimization-config]
  affects: [08-02-performance-api, 08-03-weekly-snapshot, 08-04-baseline-calculation, 08-05-ab-testing]

tech-stack:
  added: []
  patterns: [metric-aggregation, ab-test-tracking, per-tenant-config]

key-files:
  created:
    - src/db/schema/optimization.ts
    - drizzle/0009_brief_sentinels.sql
  modified:
    - src/db/schema/index.ts
    - drizzle/0008_busy_terrax.sql

decisions:
  - id: metric-period-enum
    choice: "week and month as metric aggregation periods"
    rationale: "Weekly for detailed tracking, monthly for trend analysis"
  - id: ab-test-types
    choice: "Five test types covering all optimization areas"
    rationale: "review_request_message, timing, reminder, photo_request, post_request per GBPO-05"
  - id: baseline-per-tenant
    choice: "One baseline row per tenant with unique constraint"
    rationale: "Goal-less optimization per CONTEXT.md - compare to own baseline"
  - id: decimal-precision
    choice: "5,2 precision for percentages and rates"
    rationale: "Supports 0.00-100.00 range with 2 decimal places"

metrics:
  duration: "4.4 min"
  completed: "2026-01-29"
---

# Phase 08 Plan 01: Optimization Schema Summary

**One-liner:** Database foundation for GBP optimization with 5 tables: metric snapshots, baselines, A/B test variants/assignments, and per-tenant config.

## What Was Built

### Tables Created

1. **metricSnapshots** - Weekly/monthly metric aggregation
   - Review metrics: totalReviews, averageRating, reviewCount, responsePercentage
   - Visibility metrics: impressions, searches, actions (nullable for GBP API limitations)
   - Content metrics: imageCount, imageViews
   - Review request metrics: sent, completed, conversionRate
   - Unique constraint on (tenantId, snapshotDate, period)

2. **tenantBaselines** - Dynamic baseline storage
   - baselineReviewRate, baselineResponseRate, baselineConversionRate
   - samplesCount for statistical validity tracking
   - calculatedAt timestamp for freshness
   - One row per tenant (unique tenantId)

3. **abTestVariants** - A/B test definitions
   - testType enum with 5 optimization areas
   - variantName, variantContent (JSON blob)
   - isControl, isGlobalWinner flags
   - Unique constraint on (testType, variantName)

4. **abTestAssignments** - Per-tenant variant tracking
   - Links tenant to variant with FK references
   - samplesCollected, successCount, conversionRate
   - isActive with deactivation tracking
   - Unique constraint on (tenantId, variantId)

5. **optimizationConfig** - Per-tenant tuning state
   - reviewRequestDelayHours (default 24)
   - reviewReminderDelayDays (default 3)
   - maxReviewRequestsPerCustomerPerMonth (default 1)
   - overrideLimits flag for edge cases
   - lastTuningRun, lastTuningAction for auto-tuning state

### Enums Created

- **metricPeriodEnum**: 'week', 'month'
- **abTestTypeEnum**: 'review_request_message', 'review_request_timing', 'review_reminder_message', 'photo_request_message', 'post_request_message'

### Indexes Created

- metric_snapshots_tenant_idx (tenantId)
- metric_snapshots_date_idx (snapshotDate)
- ab_test_variants_type_idx (testType)
- ab_test_assignments_variant_idx (variantId)

## Task Completion

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create optimization schema with metric snapshots | 81a275e | src/db/schema/optimization.ts |
| 2 | Register optimization schema in index | e757435 | src/db/schema/index.ts |
| 3 | Run migration to create tables | 0b71ad0 | drizzle/0008_busy_terrax.sql, drizzle/0009_brief_sentinels.sql |

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **Decimal precision 5,2 for percentages** - Supports 0.00-100.00 with 2 decimal places for rates and percentages.

2. **Five A/B test types** - Covers all optimization areas from GBPO-05: review request message, timing, reminder, photo request, post request.

3. **Unique tenant constraint on baselines and config** - Each tenant has exactly one baseline row and one config row.

4. **Nullable visibility metrics** - GBP API may not provide impressions/searches/actions data for all accounts.

## Technical Notes

- All tables use UUID primary keys with gen_random_uuid() default
- All FK references to tenants use cascade delete
- Type exports provided for TypeScript inference (Select and Insert types)
- Migration 0009_brief_sentinels.sql creates all 5 tables with proper indexes and constraints

## Next Phase Readiness

Ready for 08-02 (Performance API Client) which will use this schema to:
- Store fetched metrics in metricSnapshots table
- Query historical data for baseline calculations
- Support weekly snapshot jobs
