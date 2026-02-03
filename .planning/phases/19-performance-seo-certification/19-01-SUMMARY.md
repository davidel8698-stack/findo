---
phase: 19-performance-seo-certification
plan: 01
subsystem: analytics
tags: [posthog, analytics, session-replay, heatmaps, ab-testing, reverse-proxy]

# Dependency graph
requires:
  - phase: 12-technical-foundation
    provides: Next.js 16 project structure, providers.tsx
provides:
  - PostHog client initialization with reverse proxy
  - Typed event tracking utilities (CTA, form, demo)
  - Automatic pageview tracking for App Router
  - Heatmap support via autocapture
  - Session replay configuration
affects: [conversion-tracking, ab-testing, funnel-analysis]

# Tech tracking
tech-stack:
  added: [posthog-js@1.337.0, posthog-node@5.24.8]
  patterns: [reverse-proxy-analytics, typed-event-tracking, suspense-pageview]

key-files:
  created:
    - website/lib/posthog/client.ts
    - website/lib/posthog/events.ts
    - website/components/PostHogPageview.tsx
  modified:
    - website/next.config.ts
    - website/app/providers.tsx
    - website/app/layout.tsx
    - website/package.json

key-decisions:
  - "Reverse proxy via /ingest/* to bypass ad blockers (prevents 30-40% session loss)"
  - "PostHogProvider conditional rendering - only after client initialization"
  - "autocapture: true for heatmap support (ANALYTICS-04)"
  - "Manual pageview capture for App Router compatibility"

patterns-established:
  - "Reverse proxy pattern: /ingest/* rewrites to PostHog for ad blocker bypass"
  - "Typed event tracking: trackCtaClick, trackFormSubmit, trackDemoView functions"
  - "Conditional provider: PostHogProvider only renders when client is initialized"

# Metrics
duration: 8min
completed: 2026-02-03
---

# Phase 19 Plan 01: PostHog Analytics Setup Summary

**PostHog analytics with reverse proxy, automatic pageview tracking, typed event capture, and heatmap support for conversion funnel analysis**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-03T08:30:00Z
- **Completed:** 2026-02-03T08:38:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Installed posthog-js and posthog-node packages
- Configured reverse proxy in next.config.ts to bypass ad blockers
- Created typed event tracking utilities for conversion funnel
- Integrated PostHogProvider and pageview tracker into app

## Task Commits

Each task was committed atomically:

1. **Task 1: Install PostHog packages and configure reverse proxy** - `0427044` (feat) - Already committed as part of 19-02
2. **Task 2: Create PostHog client and provider** - `d7c3047` (feat)
3. **Task 3: Integrate PostHog provider and pageview tracker** - `f95d648` (feat)

## Files Created/Modified

- `website/lib/posthog/client.ts` - PostHog initialization with reverse proxy, session replay, autocapture
- `website/lib/posthog/events.ts` - Typed event tracking (CTA clicks, form submissions, demo views)
- `website/components/PostHogPageview.tsx` - Automatic pageview tracking for App Router
- `website/next.config.ts` - Reverse proxy rewrite rules for /ingest/*
- `website/app/providers.tsx` - PostHogProvider integration with conditional rendering
- `website/app/layout.tsx` - PostHogPageview with Suspense wrapper
- `website/package.json` - Added posthog-js and posthog-node dependencies

## Decisions Made

1. **Reverse proxy via /ingest/*** - Routes PostHog requests through the site domain to avoid ad blockers blocking 30-40% of sessions
2. **Conditional PostHogProvider** - Only renders when client is initialized (avoids SSR hydration issues)
3. **autocapture: true** - Enables heatmaps feature per ANALYTICS-04 requirement
4. **Manual pageview capture** - App Router requires explicit pageview tracking with usePathname/useSearchParams
5. **Provider nesting order** - DirectionProvider > ThemeProvider > PostHogProvider > MotionProvider > SmoothScroll

## Deviations from Plan

### Note on Task 1

Task 1 artifacts (posthog-js, posthog-node, reverse proxy in next.config.ts) were already committed as part of 19-02 preparation work (commit `0427044`). Task 2 and 3 were executed fresh.

---

**Total deviations:** 0 auto-fixed
**Impact on plan:** Task 1 pre-completed, no scope changes

## Issues Encountered

- OneDrive sync caused npm install failure on first attempt (EBUSY/ENOTEMPTY errors in node_modules). Resolved on retry.

## User Setup Required

**External services require manual configuration:**

1. **Create PostHog project:**
   - Go to PostHog Dashboard -> New Project
   - Create project for Findo website

2. **Get API key:**
   - Go to Project Settings -> Project API Key
   - Copy the key starting with `phc_`

3. **Add environment variable:**
   ```bash
   # .env.local
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_api_key
   ```

4. **Enable Heatmaps (ANALYTICS-04):**
   - Go to Data Management -> Autocapture -> Enable Heatmaps toggle

5. **Verify:**
   ```bash
   npm run dev
   # Visit localhost:3000
   # Check Network tab for /ingest requests
   # Check PostHog dashboard for incoming events
   ```

## Next Phase Readiness

- PostHog infrastructure ready for event tracking integration
- Event utilities (trackCtaClick, trackFormSubmit, trackDemoView) ready for use in components
- Session replay and heatmaps will activate once NEXT_PUBLIC_POSTHOG_KEY is set
- Ready for 19-02 (SEO metadata) - already complete
- Ready for 19-03 (performance optimization) and beyond

## Requirements Addressed

- **ANALYTICS-01:** Page view tracking - PostHogPageview component
- **ANALYTICS-02:** Funnel tracking - events.ts typed utilities
- **ANALYTICS-03:** Session replay - session_recording config enabled
- **ANALYTICS-04:** Heatmaps - autocapture: true in config
- **ANALYTICS-06:** A/B testing infrastructure - bootstrap.featureFlags ready

---
*Phase: 19-performance-seo-certification*
*Completed: 2026-02-03*
