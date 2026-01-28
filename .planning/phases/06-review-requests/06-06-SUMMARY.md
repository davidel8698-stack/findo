---
phase: 06-review-requests
plan: 06
subsystem: api
tags: [hono, zod, bullmq, review-requests, dashboard, hebrew-ui]

# Dependency graph
requires:
  - phase: 06-01
    provides: reviewRequests table schema
  - phase: 06-04
    provides: reviewRequestQueue for delayed job scheduling

provides:
  - Manual review request API endpoint (POST /api/review-requests/manual)
  - Review requests list endpoint (GET /api/review-requests)
  - Dashboard view for manual trigger at /review-requests
  - Phone normalization to +972 format
  - Duplicate detection for review requests

affects: [06-07, 07-forwarded-invoices]

# Tech tracking
tech-stack:
  added: []
  patterns: [phone-normalization, duplicate-detection-7-days, delayed-job-scheduling]

key-files:
  created:
    - src/routes/review-requests.ts
    - src/views/review-requests.ts
  modified:
    - src/routes/pages.ts
    - src/views/index.ts
    - src/index.ts

key-decisions:
  - "Phone normalization handles 0501234567, 972501234567, +972501234567 formats"
  - "7-day duplicate window prevents review request spam"
  - "XSS protection via HTML escaping in view"

patterns-established:
  - "Phone normalization: strip non-digits, handle +972 prefix"
  - "Manual trigger follows same 24h delay as invoice-triggered"

# Metrics
duration: 6min
completed: 2026-01-28
---

# Phase 6 Plan 6: Manual Review Request Trigger Summary

**Dashboard UI with Hebrew RTL layout for manual review request creation, phone normalization to +972 format, and 7-day duplicate detection**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-28T15:40:35Z
- **Completed:** 2026-01-28T15:47:00Z
- **Tasks:** 3
- **Files created:** 2
- **Files modified:** 3

## Accomplishments
- API endpoint for manual review request creation with validation
- Phone number normalization to consistent +972 format
- Duplicate detection prevents requests to same phone within 7 days
- Hebrew RTL dashboard view with manual trigger form
- Status and source badges with Hebrew translations
- Routes mounted at /api/review-requests/* and /review-requests page

## Task Commits

Each task was committed atomically:

1. **Task 1: Create manual review request API endpoint** - `55b26a3` (feat)
2. **Task 2: Create dashboard view for manual trigger** - `433b8f8` (feat)
3. **Task 3: Mount routes and add page endpoint** - `6bd55fd` (feat)

## Files Created/Modified
- `src/routes/review-requests.ts` - API routes: POST /manual, GET / for review requests
- `src/views/review-requests.ts` - Hebrew RTL dashboard view with form and table
- `src/routes/pages.ts` - Added GET /review-requests page endpoint
- `src/views/index.ts` - Export renderReviewRequestsPage
- `src/index.ts` - Mount review-requests API routes under /api

## Decisions Made
- Phone normalization handles common Israeli formats (0501234567, 972501234567, +972501234567)
- 7-day duplicate window prevents review request spam while allowing re-requests after reasonable period
- XSS protection via HTML escaping for user-provided data in view
- Manual requests follow same 24-hour delay as invoice-triggered requests (per REVW-04)
- 100 max limit on list endpoint to prevent large response payloads

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Manual review request trigger complete
- Ready for 06-07 (review completion tracking) to detect when customers leave reviews
- Dashboard view pattern established for future pages

---
*Phase: 06-review-requests*
*Completed: 2026-01-28*
