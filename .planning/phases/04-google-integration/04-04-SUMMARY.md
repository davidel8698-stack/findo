---
phase: "04"
plan: "04"
subsystem: google-integration
tags: [google, oauth, frontend, ui, hebrew, rtl]
dependency-graph:
  requires: ["04-01"]
  provides: ["google-connect-ui", "oauth-flow-frontend"]
  affects: ["05-reviews-worker"]
tech-stack:
  added: []
  patterns: ["server-side-html-rendering", "client-side-oauth-redirect"]
key-files:
  created:
    - src/views/google-connect.ts
    - public/js/google-connect.js
  modified:
    - src/views/index.ts
    - src/routes/pages.ts
    - src/routes/google/callback.ts
decisions:
  - id: "google-ui-pattern"
    choice: "Follow WhatsApp connection page pattern"
    rationale: "Consistent UX across integration flows"
  - id: "google-oauth-redirect"
    choice: "Client-side fetch then redirect"
    rationale: "Same pattern as WhatsApp, allows loading overlay"
  - id: "google-callback-route"
    choice: "/connect/google as callback success page"
    rationale: "Consistent with WhatsApp /connect/whatsapp pattern"
metrics:
  duration: "~11 min"
  completed: "2026-01-28"
---

# Phase 4 Plan 4: Google Connection UI Summary

**One-liner:** Hebrew RTL Google connection page with OAuth redirect, success/error states following WhatsApp pattern.

## What Was Built

### Google Connection Page View (`src/views/google-connect.ts`)
- Hebrew RTL layout matching WhatsApp connection page
- Google-branded styling (#4285F4 blue, #34A853 green)
- Three states: initial (connect button), success (business name), error (troubleshooting)
- Loading overlay during OAuth redirect
- Features list explaining what user gets after connection

### Client-Side OAuth Logic (`public/js/google-connect.js`)
- `startGoogleOAuth()` fetches `/api/google/auth` for OAuth URL
- Shows loading overlay during redirect
- Hebrew error messages on failure
- `resetToInitial()` for retry functionality

### Page Route (`src/routes/pages.ts`)
- `GET /connect/google` with tenant context middleware
- Parses `success` and `error` query params from OAuth callback
- Fetches connection details on success to show business name
- Hebrew error translation for common OAuth errors

### Callback Update (`src/routes/google/callback.ts`)
- Changed default redirect from `/setup/google` to `/connect/google`
- Maintains env var override via `GOOGLE_REDIRECT_SUCCESS_URI`

## Technical Details

### State Flow
```
Initial → Click Connect → Loading Overlay → Google OAuth
                                              ↓
                              ← Callback with code/error
                                              ↓
                    Success: /connect/google?success=true
                    Error: /connect/google?error=message
```

### Error Translation
Common OAuth errors translated to Hebrew:
- `access_denied` → "הגישה נדחתה. אנא אשרו את ההרשאות הנדרשות."
- `No GBP accounts found` → "לא נמצאו פרופילים עסקיים בחשבון Google שלכם."
- `Google OAuth not configured` → "חיבור Google לא מוגדר במערכת. אנא פנו לתמיכה."

### Files Changed
| File | Lines | Purpose |
|------|-------|---------|
| src/views/google-connect.ts | +289 | HTML template with all states |
| public/js/google-connect.js | +143 | Client-side OAuth logic |
| src/routes/pages.ts | +79 | Route and error translation |
| src/routes/google/callback.ts | +2/-2 | Update default redirect |

## Verification Results

User verified:
- Hebrew UI displays correctly with RTL layout
- Connect button shows Google branding
- Error state displays Hebrew troubleshooting guidance
- Loading overlay appears during OAuth attempt
- Graceful handling when Google credentials not configured

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI pattern | Follow WhatsApp connection page | Consistent UX across integrations |
| OAuth redirect | Client-side fetch + redirect | Allows loading overlay, same as WhatsApp |
| Callback route | /connect/google | Consistent with /connect/whatsapp pattern |
| Error handling | Hebrew translation map | User-friendly errors in target language |

## Deviations from Plan

None - plan executed exactly as written.

## Phase 4 Completion Status

All 4 plans in Phase 4 (Google Integration) are now complete:

| Plan | Name | Status |
|------|------|--------|
| 04-01 | Google OAuth Foundation | Complete |
| 04-02 | Profile & Reviews Services | Complete |
| 04-03 | Token Refresh Worker | Complete |
| 04-04 | Google Connection UI | Complete |

## Next Phase Readiness

**Phase 5 Prerequisites Met:**
- Google OAuth flow functional (04-01)
- Reviews API service available (04-02)
- Token refresh keeps credentials valid (04-03)
- UI allows users to connect Google (04-04)

**Ready for:** Phase 5 - Reviews Worker (polling, AI replies, notifications)
