---
phase: 04-google-integration
plan: 03
subsystem: auth
tags: [google, oauth, token-refresh, googleapis, bullmq]

# Dependency graph
requires:
  - phase: 04-01
    provides: Google OAuth service with tokenVaultService integration
  - phase: 01-03
    provides: Token vault service with findExpiringTokens method
  - phase: 01-04
    provides: BullMQ queue infrastructure for scheduled jobs
provides:
  - Proactive Google token refresh (tokens refreshed before expiry)
  - Daily Google token validation (detect revoked tokens)
  - Scheduled jobs: google-token-refresh (every 5 min), google-token-validation (daily 3:30 AM)
affects:
  - 04-04 (reviews reply - depends on valid tokens)
  - 05-ai-analysis (review polling - depends on valid tokens)

# Tech tracking
tech-stack:
  added: []  # No new libraries, uses existing googleapis
  patterns:
    - Proactive token refresh before expiry (10-minute window)
    - Rate limit protection with 100ms delay between operations
    - Activity event on token invalidation for dashboard notification

key-files:
  created:
    - src/services/google/token-refresh.ts
  modified:
    - src/services/google/index.ts
    - src/scheduler/jobs.ts
    - src/queue/workers/test.worker.ts

key-decisions:
  - "10-minute expiry window for proactive refresh (sufficient buffer)"
  - "google-token-validation at 3:30 AM (offset from WhatsApp at 3:00 AM)"
  - "100ms delay between operations matches WhatsApp validation pattern"
  - "TenantId used as identifier (matches oauth.ts token storage pattern)"

patterns-established:
  - "Proactive refresh: find expiring tokens within N minutes, refresh each"
  - "Daily validation: iterate active connections, check against API, mark invalid"
  - "Activity event pattern: 'provider.token.invalid' for dashboard notification"

# Metrics
duration: 4.5min
completed: 2026-01-28
---

# Phase 4 Plan 03: Google Token Refresh Summary

**Proactive Google token refresh every 5 minutes with daily validation using googleapis refreshAccessToken**

## Performance

- **Duration:** 4.5 min
- **Started:** 2026-01-27T22:55:02Z
- **Completed:** 2026-01-27T22:59:35Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Proactive token refresh finds tokens expiring within 10 minutes and refreshes them
- Daily validation checks all active Google connections against GBP accounts.list API
- Invalid tokens marked in vault and connection status updated to 'invalid'
- Activity event created for dashboard notification when tokens become invalid
- Scheduled jobs registered: every 5 minutes (proactive) and daily at 3:30 AM (validation)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Google token refresh service** - `8f09546` (feat)
2. **Task 2: Register Google token refresh scheduled jobs** - `96b38dc` (feat)

## Files Created/Modified

- `src/services/google/token-refresh.ts` - Token refresh and validation service (refreshExpiringGoogleTokens, validateGoogleToken, validateAllGoogleTokens)
- `src/services/google/index.ts` - Barrel export updated to include token-refresh exports
- `src/scheduler/jobs.ts` - Google token refresh (every 5 min) and validation (daily 3:30 AM) jobs
- `src/queue/workers/test.worker.ts` - Handler for google provider with proactive and daily-validation modes

## Decisions Made

- **10-minute expiry window:** Sufficient buffer for refresh before actual expiration
- **3:30 AM validation time:** 30-minute offset from WhatsApp validation (3:00 AM) to spread load
- **100ms delay between operations:** Matches WhatsApp validation pattern, prevents rate limiting
- **TenantId as identifier:** Consistent with oauth.ts token storage pattern (identifier=tenantId)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required. Uses existing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET from Phase 04-01.

## Next Phase Readiness

- Token refresh infrastructure complete
- Ready for Phase 04-04: Reviews Reply (tokens will stay valid for continuous operation)
- Ready for Phase 05: AI Analysis (review polling can rely on valid tokens)

---
*Phase: 04-google-integration*
*Completed: 2026-01-28*
