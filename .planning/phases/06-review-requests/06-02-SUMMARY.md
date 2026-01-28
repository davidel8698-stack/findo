---
phase: 06-review-requests
plan: 02
subsystem: api
tags: [greeninvoice, jwt, invoice-polling, api-client]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: token vault for credential storage
provides:
  - GreeninvoiceClient with JWT authentication
  - fetchInvoices for document search
  - DetectedInvoice normalized format
affects: [06-03, 06-04, invoice-polling-worker]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - JWT token caching with expiration buffer
    - 401 retry with token refresh
    - Normalized invoice format across providers

key-files:
  created:
    - src/services/greeninvoice/types.ts
    - src/services/greeninvoice/index.ts
    - src/services/greeninvoice/documents.ts
  modified: []

key-decisions:
  - "5-minute expiration buffer for proactive token refresh"
  - "401 retry with cache clear and re-auth"
  - "Document types 305 (Tax Invoice) and 320 (Invoice/Receipt) for polling"
  - "DetectedInvoice as normalized format for multi-provider support"

patterns-established:
  - "Provider client pattern: tenantId + credentials constructor"
  - "Token caching per tenant in memory Map"
  - "Normalized invoice format for cross-provider consistency"

# Metrics
duration: 5min
completed: 2026-01-28
---

# Phase 6 Plan 02: Greeninvoice Client Summary

**Greeninvoice API client with JWT token caching, 401 retry logic, and document search for invoice polling**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-01-28
- **Completed:** 2026-01-28
- **Tasks:** 3
- **Files created:** 3

## Accomplishments
- GreeninvoiceClient class with automatic JWT token management
- Token caching per tenant with 5-minute expiration buffer
- Automatic 401 retry with token refresh
- fetchInvoices function for searching Tax Invoice (305) and Invoice/Receipt (320) documents
- DetectedInvoice normalized format for multi-provider support

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Greeninvoice types** - `fdd390d` (feat)
2. **Task 2: Create Greeninvoice client with JWT authentication** - `f24a7be` (feat)
3. **Task 3: Create document search function** - `6715cbd` (feat)

## Files Created/Modified
- `src/services/greeninvoice/types.ts` - TypeScript interfaces for Greeninvoice API
- `src/services/greeninvoice/index.ts` - GreeninvoiceClient class with JWT auth
- `src/services/greeninvoice/documents.ts` - fetchInvoices document search function

## Decisions Made
- **5-minute expiration buffer** - Proactive token refresh prevents edge case failures
- **401 retry logic** - Single retry with cache clear handles expired token race conditions
- **Document types 305/320** - Tax Invoice and Invoice/Receipt cover invoice use cases
- **DetectedInvoice format** - Normalized structure supports future icount integration

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed response.json() type assertions**
- **Found during:** Task 2 (Client implementation)
- **Issue:** fetch response.json() returns unknown in strict TypeScript
- **Fix:** Added explicit type assertions: `(await response.json()) as T`
- **Files modified:** src/services/greeninvoice/index.ts
- **Verification:** npx tsc --noEmit passes
- **Committed in:** f24a7be (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Type assertion necessary for TypeScript strict mode. No scope creep.

## Issues Encountered
None - implementation proceeded smoothly.

## User Setup Required
None - no external service configuration required. Greeninvoice credentials will be stored in token vault at runtime.

## Next Phase Readiness
- Greeninvoice client ready for invoice polling worker
- Same pattern can be used for icount client implementation
- DetectedInvoice format ready for review request flow integration

---
*Phase: 06-review-requests*
*Completed: 2026-01-28*
