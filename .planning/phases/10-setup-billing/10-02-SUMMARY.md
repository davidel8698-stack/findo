---
phase: 10-setup-billing
plan: 02
subsystem: ui
tags: [setup-wizard, hono, html, hebrew, rtl, whatsapp, google-oauth]

# Dependency graph
requires:
  - phase: 10-01
    provides: billing schema (setupProgress, subscriptions, payments tables)
  - phase: 02-06
    provides: WhatsApp connect page patterns
  - phase: 04-04
    provides: Google connect page patterns
provides:
  - Setup wizard layout with 5-step progress indicator (Hebrew RTL)
  - Step 1 business info form with hours UI
  - Step 2 WhatsApp connection view (Embedded Signup SDK)
  - Step 3 Google connection view (OAuth trigger)
  - Setup routes for steps 1-3 with progress persistence
affects: [10-03, 10-04, 10-05, 10-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Setup wizard layout pattern with progress indicator
    - Multi-step form with server-side progress persistence
    - Hebrew RTL form patterns with business hours UI

key-files:
  created:
    - src/views/setup/layout.ts
    - src/views/setup/step-1-business.ts
    - src/views/setup/step-2-whatsapp.ts
    - src/views/setup/step-3-google.ts
  modified:
    - src/routes/setup/index.ts

key-decisions:
  - "Israeli week starts Sunday in business hours UI"
  - "Business hours default 08:00-18:00 with day toggles"
  - "Copy-to-all button for convenience in hours setup"
  - "WhatsApp/Google steps have skip option (advances to next step)"
  - "Tenant created in step 1 if email not found, or resumed if exists"
  - "Progress saved to setupProgress table for resume capability"

patterns-established:
  - "Setup wizard layout with 5-step circular progress indicator"
  - "Form with Hebrew labels, RTL layout, and inline validation"
  - "Connection steps with connected/not-connected states"
  - "Skip/continue navigation pattern for optional integrations"

# Metrics
duration: 12min
completed: 2026-01-30
---

# Phase 10 Plan 02: Setup Wizard Steps 1-3 Summary

**5-step setup wizard layout with Hebrew RTL, business info form (step 1), WhatsApp Embedded Signup (step 2), and Google OAuth trigger (step 3)**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-30
- **Completed:** 2026-01-30
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Created shared wizard layout with 5-step progress indicator
- Step 1 business form collects name, type, owner, email, phone, address, business hours
- Step 2 integrates WhatsApp Embedded Signup SDK with connected/skip states
- Step 3 triggers Google OAuth with connected/skip states
- All routes persist progress to setupProgress table for resume capability
- Full Hebrew RTL support throughout

## Task Commits

Each task was committed atomically:

1. **Task 1: Create setup wizard layout and step 1** - `1cffbbe` (feat)
2. **Task 2: Create steps 2-3 views (WhatsApp & Google)** - `919fabb` (feat)
3. **Task 3: Create setup routes for steps 1-3** - `02bf977` (feat)

## Files Created/Modified
- `src/views/setup/layout.ts` - Shared layout with progress indicator (5 steps)
- `src/views/setup/step-1-business.ts` - Business info form with hours UI
- `src/views/setup/step-2-whatsapp.ts` - WhatsApp Embedded Signup view
- `src/views/setup/step-3-google.ts` - Google OAuth trigger view
- `src/routes/setup/index.ts` - Routes for steps 1-3 (merged with 10-03 step 4-5 routes)

## Decisions Made
- Israeli week starts Sunday for business hours (per CONTEXT.md)
- Business hours UI uses day checkboxes with open/close time selects
- Copy-to-all button copies first active day's hours to all days
- Tenant created with 14-day trial in step 1 if email not found
- If email exists, resume with existing tenant (updates info, preserves ID)
- Progress persists in setupProgress.stepData JSONB for form resume
- WhatsApp/Google steps can be skipped (advances to next step)
- Connected state shows checkmark and disabled button

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Parallel execution with 10-03 created initial routes file; merged steps 1-3 with existing steps 4-5

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Steps 1-3 complete and functional
- Steps 4-5 from 10-03 already in place
- Ready for PayPlus integration (10-04)
- Full wizard flow navigable end-to-end

---
*Phase: 10-setup-billing*
*Completed: 2026-01-30*
