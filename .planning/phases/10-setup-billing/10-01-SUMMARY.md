---
phase: 10
plan: 01
subsystem: billing
tags: [database, schema, drizzle, subscriptions, payments, setup-wizard]

dependency-graph:
  requires: [01-foundation]
  provides: [billing-schema, subscription-tracking, payment-history, setup-progress]
  affects: [10-02, 10-03, 10-04, 10-05, 10-06]

tech-stack:
  added: []
  patterns: [agorot-currency, jsonb-wizard-state, enum-lifecycle]

key-files:
  created:
    - src/db/schema/billing.ts
    - drizzle/0011_dusty_sentry.sql
  modified:
    - src/db/schema/index.ts

decisions:
  - id: agorot-currency
    choice: Store amounts in agorot (cents) as integers
    rationale: Avoids floating point precision issues with ILS currency
  - id: payplus-token-storage
    choice: Store PayPlus customer/token IDs in subscriptions table
    rationale: Enables recurring billing without re-authentication
  - id: jsonb-wizard-state
    choice: Use JSONB stepData for wizard form persistence
    rationale: Flexible schema for add/modify step fields without migrations
  - id: subscription-status-enum
    choice: 5-state lifecycle (trial, pending_payment, active, past_due, cancelled)
    rationale: Covers full billing lifecycle from trial through cancellation

metrics:
  duration: 3.5 min
  completed: 2026-01-30
---

# Phase 10 Plan 01: Billing Schema Summary

**One-liner:** Database schema for subscriptions with PayPlus token storage, payment history, and JSONB wizard state tracking.

## What Was Built

Created three new database tables for billing and setup wizard functionality:

### 1. subscriptions
- One-to-one with tenants (unique constraint)
- PayPlus integration fields (customerId, tokenId)
- 5-state status enum: trial, pending_payment, active, past_due, cancelled
- Pricing in agorot: 350 NIS monthly (35000), 3500 NIS setup (350000)
- Billing cycle dates (period start/end, next billing date)

### 2. payments
- Transaction history linked to tenant and subscription
- PayPlus transaction reference
- Amount in agorot with ILS currency default
- Payment types: setup_fee, subscription, manual
- Status tracking: pending, completed, failed, refunded
- Card display info (last4, brand) and failure tracking

### 3. setup_progress
- One-to-one with tenants (unique constraint)
- 5-step wizard tracking (currentStep 1-5)
- JSONB stepData for partial form persistence across sessions
- Completion timestamp for finished wizards

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Currency storage | Agorot (integer) | Avoids floating point precision issues |
| PayPlus tokens | Direct fields in subscriptions | Enables recurring billing |
| Wizard state | JSONB stepData | Flexible for form field changes |
| Status enum | 5 states | Covers trial to cancellation lifecycle |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 64fca3f | feat | Add billing schema with subscriptions, payments, setup_progress |
| 4d553d9 | chore | Add billing export and migration |

## Verification Results

- [x] `npx tsc --noEmit` passes
- [x] Database migration applied successfully
- [x] All three tables created with foreign keys to tenants
- [x] Schema exported from index.ts

## Files

**Created:**
- `src/db/schema/billing.ts` - Billing schema (subscriptions, payments, setupProgress)
- `drizzle/0011_dusty_sentry.sql` - Migration file

**Modified:**
- `src/db/schema/index.ts` - Added billing export

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Ready for 10-02:** Setup wizard service
- Billing schema provides foundation for wizard state management
- setupProgress table ready to track multi-step wizard flow
- subscriptions table ready for trial creation

**Dependencies satisfied:**
- tenants table exists with required fields
- Token vault available for credential storage
