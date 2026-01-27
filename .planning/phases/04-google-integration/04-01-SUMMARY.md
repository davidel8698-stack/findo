---
phase: 04-google-integration
plan: 01
subsystem: google-oauth
tags: [google, oauth, gbp, database, schema]
dependency-graph:
  requires: [01-foundation-complete, token-vault]
  provides: [google-connections-table, google-oauth-service, google-routes]
  affects: [04-02-reviews-polling, 04-03-review-responses]
tech-stack:
  added: [googleapis@170.1.0]
  patterns: [oauth2-flow, token-refresh, tenant-state-validation]
key-files:
  created:
    - src/db/schema/google.ts
    - src/services/google/oauth.ts
    - src/services/google/index.ts
    - src/routes/google/callback.ts
    - src/routes/google/index.ts
    - drizzle/0005_foamy_magus.sql
  modified:
    - src/db/schema/index.ts
    - src/index.ts
    - package.json
    - pnpm-lock.yaml
decisions:
  - id: google-scope-business-manage
    choice: "business.manage scope for full GBP access"
    rationale: "Covers reviews read/reply, business info, locations"
  - id: tenant-in-state
    choice: "Pass tenantId in OAuth state parameter"
    rationale: "Validates callback is for correct tenant, prevents CSRF"
  - id: prompt-consent
    choice: "prompt: consent in OAuth URL"
    rationale: "Forces consent screen to ensure refresh token returned"
  - id: account-from-api
    choice: "Fetch account info from accounts.list API"
    rationale: "Get accountId/accountName programmatically vs user input"
metrics:
  duration: 9.5 min
  completed: 2026-01-27
---

# Phase 4 Plan 1: Google OAuth Foundation Summary

**One-liner:** Google OAuth flow with googleapis library, token vault storage, and HTTP routes for auth/callback/status.

## What Was Built

### 1. Google Connections Database Schema
- **googleConnectionStatusEnum**: pending, active, disconnected, invalid (mirrors WhatsApp pattern)
- **google_connections table**: tenant uniqueness constraint, accountId/accountName, locationId/locationName
- **Migration**: drizzle/0005_foamy_magus.sql creates table with status index

### 2. Google OAuth Service
- **getAuthUrl(tenantId)**: Generates OAuth URL with business.manage scope, tenantId in state
- **handleCallback(code, state)**: Exchanges code for tokens, fetches GBP account info, stores tokens
- **getGoogleConnection(tenantId)**: Returns connection status and metadata
- **disconnectGoogle(tenantId)**: Marks disconnected, deletes tokens from vault
- **createAuthenticatedClient(tenantId)**: Factory for authenticated API calls with auto-refresh

### 3. Google OAuth Routes
- **GET /api/google/auth**: Returns authUrl for frontend redirect
- **GET /api/google/callback**: OAuth redirect handler, exchanges code, redirects to success/error
- **GET /api/google/status**: Connection status JSON
- **POST /api/google/disconnect**: Disconnect Google connection

## Key Implementation Details

### OAuth Flow
1. User visits /api/google/auth - gets authUrl
2. User redirected to Google consent screen
3. Google redirects to /api/google/callback?code=...&state=tenantId
4. Callback exchanges code for tokens via googleapis
5. Fetches account list to get accountId/accountName
6. Stores access_token + refresh_token in token vault (encrypted)
7. Creates/updates google_connections record
8. Redirects to GOOGLE_REDIRECT_SUCCESS_URI with success=true or error

### Token Storage Pattern
- Access token: provider=google, type=access_token, identifier=tenantId
- Refresh token: provider=google, type=refresh_token, identifier=tenantId
- Uses existing token vault infrastructure (AES-256-GCM encryption)

### Auto-refresh Handling
- googleapis library emits 'tokens' event on refresh
- createAuthenticatedClient listens and stores new access token
- Proactive refresh if token expires within 5 minutes

## Deviations from Plan

None - plan executed exactly as written.

## Environment Variables Required

```env
# Google OAuth (required for Google integration)
GOOGLE_CLIENT_ID=from Google Cloud Console
GOOGLE_CLIENT_SECRET=from Google Cloud Console
GOOGLE_REDIRECT_URI=https://app.findo.co.il/api/google/callback
GOOGLE_REDIRECT_SUCCESS_URI=/setup/google  # optional, defaults to /setup/google
```

## Commits

| Hash | Type | Description |
|------|------|-------------|
| e1c8721 | feat | Create Google connections database schema |
| 45c0831 | feat | Create Google OAuth service |
| ae229b0 | feat | Create Google OAuth routes |

## Verification Results

- [x] Migration generated: drizzle/0005_foamy_magus.sql
- [x] TypeScript compiles: `npx tsc --noEmit` passes
- [x] Server starts: `npm run dev` runs without errors
- [x] Routes mounted at /api/google/*

## Next Phase Readiness

**Ready for 04-02: Reviews Polling**
- OAuth service provides createAuthenticatedClient() for API calls
- Connection record tracks accountId/locationId for reviews API
- Token refresh handled automatically by googleapis
