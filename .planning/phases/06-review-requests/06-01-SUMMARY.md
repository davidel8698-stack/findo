---
phase: 06-review-requests
plan: 01
subsystem: database
tags: [drizzle, postgres, schema, enums, review-requests, accounting]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: tenants table for foreign key reference
  - phase: 01-foundation
    provides: token-vault for encrypted credential storage pattern
provides:
  - reviewRequests table for tracking review request lifecycle
  - accountingConnections table for provider credential storage
  - TypeScript types (ReviewRequest, NewReviewRequest, AccountingConnection, NewAccountingConnection)
  - 3 enums (review_request_status, review_request_source, accounting_provider)
affects:
  - 06-02 (invoice polling worker will use accountingConnections)
  - 06-03 (review request service will use reviewRequests)
  - 06-04 (review request worker will update reviewRequests status)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Review request 6-state lifecycle (pending/requested/reminded/completed/stopped/skipped)
    - Multi-source invoice tracking (greeninvoice/icount/manual/forwarded)
    - Encrypted credentials via credentialsVaultId reference to token_vault

key-files:
  created:
    - src/db/schema/review-requests.ts
    - drizzle/0007_busy_shinko_yamashiro.sql
  modified:
    - src/db/schema/index.ts

key-decisions:
  - "6-state review request lifecycle (pending/requested/reminded/completed/stopped/skipped)"
  - "4-source tracking (greeninvoice/icount/manual/forwarded)"
  - "credentialsVaultId references token_vault conceptually (not FK) for encrypted credentials"
  - "Unique constraint on (tenantId, source, invoiceId) prevents duplicate review requests"

patterns-established:
  - "Review request status enum: pending -> requested -> reminded -> completed/stopped"
  - "Accounting connection pattern: one connection per provider per tenant"

# Metrics
duration: 5min
completed: 2026-01-28
---

# Phase 6 Plan 01: Review Requests Schema Summary

**Database schema for review request tracking with 6-state lifecycle enum and accounting provider connections for Greeninvoice/iCount credential storage**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-28T10:00:00Z
- **Completed:** 2026-01-28T10:05:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created reviewRequests table with full lifecycle tracking (6 states, 4 sources)
- Created accountingConnections table for encrypted provider credentials
- Added unique constraint to prevent duplicate invoice requests
- Generated and applied migration 0007 to database

## Task Commits

Each task was committed atomically:

1. **Task 1: Create review requests and accounting connections schema** - `30880ef` (feat)
2. **Task 2: Export schema and run migration** - `403ffdf` (chore)

## Files Created/Modified
- `src/db/schema/review-requests.ts` - New schema with reviewRequests and accountingConnections tables, 3 enums, TypeScript types
- `src/db/schema/index.ts` - Added export for review-requests module
- `drizzle/0007_busy_shinko_yamashiro.sql` - Migration creating tables, enums, constraints, indexes

## Decisions Made
- **6-state status enum:** pending (24h wait), requested (initial sent), reminded (3-day reminder), completed (customer reviewed), stopped (flow ended after reminder), skipped (no phone)
- **4-source tracking:** greeninvoice, icount, manual (dashboard button), forwarded (WhatsApp invoice)
- **credentialsVaultId as UUID reference:** References token_vault conceptually without FK constraint for flexibility
- **Unique constraint on (tenantId, source, invoiceId):** Prevents duplicate review requests per invoice

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Schema ready for invoice polling worker (06-02)
- accountingConnections table ready for Greeninvoice/iCount credential storage
- reviewRequests table ready for review request service implementation
- No blockers

---
*Phase: 06-review-requests*
*Completed: 2026-01-28*
