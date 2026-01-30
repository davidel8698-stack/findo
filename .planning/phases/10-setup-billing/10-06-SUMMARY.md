---
phase: 10-setup-billing
plan: 06
subsystem: integration
tags: [setup-wizard, billing, routing, worker-registration, hono]

# Dependency graph
requires:
  - phase: 10-01
    provides: billing schema (subscriptions, payments, setup_progress)
  - phase: 10-02
    provides: setup wizard steps 1-3 views and routes
  - phase: 10-03
    provides: setup wizard steps 4-5 views and routes
  - phase: 10-04
    provides: PayPlus service and webhook handler
  - phase: 10-05
    provides: progressive profiling worker and job
provides:
  - Setup wizard routes mounted at /setup
  - Billing routes mounted at /billing
  - Progressive profile worker registered in main app
  - Views index re-exporting all setup views
  - /start convenience redirect
affects: [deployment, production-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - route mounting via Hono route() method
    - worker import-time instantiation pattern
    - views index barrel export pattern

key-files:
  created:
    - src/views/setup/index.ts
  modified:
    - src/routes/pages.ts
    - src/index.ts

key-decisions:
  - "Mount billingWebhookRoutes separately for raw body access"
  - "progressiveProfileWorker uses import-time instantiation pattern"
  - "/start redirect for marketing/onboarding convenience"

patterns-established:
  - "Views barrel export: src/views/{feature}/index.ts re-exports all feature views"
  - "Route grouping: related routes (setup/billing) mounted with descriptive comments"

# Metrics
duration: 8min
completed: 2026-01-30
---

# Phase 10 Plan 06: Main App Integration Summary

**Setup wizard and billing routes wired into main app with progressive profile worker registered for weekly profiling**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-30
- **Completed:** 2026-01-30
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 3

## Accomplishments

- Setup views index re-exports all step views for clean imports
- Setup wizard accessible at /setup with 5-step flow
- Billing routes mounted at /billing (initiation, success, failure, webhook)
- Progressive profile worker registered with graceful shutdown
- Weekly profiling job scheduled at startup (Monday 10:00 AM Israel time)
- /start convenience redirect for marketing links

## Task Commits

Each task was committed atomically:

1. **Task 1: Create setup views index and update pages routes** - `c9833bd` (feat)
2. **Task 2: Register progressive profile worker** - `098f8aa` (feat)
3. **Task 3: UAT verification** - checkpoint (human-verify)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified

- `src/views/setup/index.ts` - Re-exports all setup wizard views (layout, steps 1-5, complete)
- `src/routes/pages.ts` - Mounts setup and billing routes, adds /start redirect
- `src/index.ts` - Imports and registers progressive profile worker, schedules job

## Decisions Made

- **Mount billingWebhookRoutes separately** - Needs raw body access for PayPlus signature verification
- **Import-time worker instantiation** - Matches pattern from holidayCheckWorker, metricsCollectionWorker
- **Schedule job at startup** - Uses scheduleProgressiveProfilingJob() for cron-based weekly execution

## Deviations from Plan

### Bugs Fixed During UAT

**1. [UAT Fix] Telephony form duplicate inputs causing ZodError**
- **Found during:** UAT checkpoint verification
- **Issue:** Step 4 telephony form had duplicate input fields causing validation error
- **Fix:** Fixed by user during UAT
- **Status:** Resolved before approval

**2. [UAT Fix] Payment button 404 error**
- **Found during:** UAT checkpoint verification
- **Issue:** GET /billing/initiate-payment returned 404 (only POST handler existed)
- **Fix:** Added GET handler for /billing/initiate-payment
- **Status:** Resolved before approval

---

**Total deviations:** 2 UAT fixes (fixed by user during testing)
**Impact on plan:** Both fixes necessary for functional setup flow. No scope creep.

## Issues Encountered

- TypeScript noEmit check shows many errors from node_modules (drizzle-orm, zod), but esbuild compilation succeeds
- This is a pre-existing project issue, not introduced by this plan

## User Setup Required

None - no new external service configuration required. All environment variables documented in previous plans:
- PAYPLUS_API_KEY, PAYPLUS_SECRET_KEY, PAYPLUS_TERMINAL_UID (from 10-04)
- META_APP_ID, META_APP_SECRET, etc. (from 02-*)
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc. (from 04-*)

## Next Phase Readiness

**Phase 10 COMPLETE**

All 6 plans executed:
- 10-01: Billing schema
- 10-02: Setup wizard steps 1-3
- 10-03: Setup wizard steps 4-5
- 10-04: PayPlus integration
- 10-05: Progressive profiling
- 10-06: Main app integration (this plan)

**Ready for production:**
- Full setup wizard flow (2-minute target)
- WhatsApp/Google optional integrations
- PayPlus payment processing
- Trial mode without credit card
- Progressive profiling for gradual data collection

**Remaining for launch:**
- Production environment variables
- Domain and SSL configuration
- Meta Business Verification (2-4 weeks)
- Google API access approval (3-5 days)

---
*Phase: 10-setup-billing*
*Completed: 2026-01-30*
