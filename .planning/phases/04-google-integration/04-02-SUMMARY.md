---
phase: 04-google-integration
plan: 02
subsystem: google-api
tags: [google, gbp, reviews, profile, oauth]
depends_on:
  requires: ["04-01"]
  provides: ["profile-service", "reviews-service"]
  affects: ["05-review-management", "04-03"]
tech-stack:
  added: []
  patterns: ["direct-http-via-oauth", "typed-api-responses"]
key-files:
  created:
    - src/services/google/profile.ts
    - src/services/google/reviews.ts
  modified:
    - src/services/google/index.ts
decisions:
  - id: direct-http-for-reviews
    choice: "Use OAuth2 client.request() for reviews API"
    rationale: "googleapis mybusiness v4 types incomplete"
  - id: byte-limit-validation
    choice: "Validate 4096 byte limit before API call"
    rationale: "Hebrew chars 2-3 bytes each, fail-fast on oversized replies"
  - id: star-rating-parse
    choice: "Convert enum (ONE-FIVE) to number (1-5)"
    rationale: "Easier consumption in business logic"
metrics:
  duration: 5.2min
  completed: 2026-01-28
---

# Phase 4 Plan 02: Business Profile & Reviews Services Summary

**One-liner:** GBP profile reading and reviews management via mybusinessbusinessinformation and My Business v4 APIs

## What Was Built

### Profile Service (`src/services/google/profile.ts`)

Functions:
- `getLocations(tenantId, accountId)` - List all locations for a GBP account
- `getBusinessProfile(tenantId, accountId, locationId)` - Get details for specific location
- `getAccountInfo(tenantId, accountId)` - Get account verification info

Types exported:
- `BusinessProfile` - Account with locations array
- `LocationInfo` - Location details (title, address, phone, website)

API used: `mybusinessbusinessinformation` v1 with readMask for payload reduction.

### Reviews Service (`src/services/google/reviews.ts`)

Functions:
- `listReviews(tenantId, accountId, locationId, options)` - Paginated review list
- `postReviewReply(tenantId, accountId, locationId, reviewId, replyText)` - Post reply with byte validation
- `deleteReviewReply(tenantId, accountId, locationId, reviewId)` - Remove existing reply
- `getReview(tenantId, accountId, locationId, reviewId)` - Fetch single review

Types exported:
- `Review` - Full review data with star rating, comment, reply
- `ReviewReply` - Reply content and timestamp
- `ListReviewsOptions` - Pagination and ordering options

API used: My Business v4 (`https://mybusiness.googleapis.com/v4`) via direct HTTP.

### Barrel Export Updates (`src/services/google/index.ts`)

All services now exported from single entry point:
- OAuth: `getAuthUrl`, `handleCallback`, `getGoogleConnection`, `disconnectGoogle`, `createAuthenticatedClient`
- Token refresh: `refreshExpiringGoogleTokens`, `validateGoogleToken`, `validateAllGoogleTokens`
- Profile: `getLocations`, `getBusinessProfile`, `getAccountInfo`
- Reviews: `listReviews`, `postReviewReply`, `deleteReviewReply`, `getReview`

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Reviews API approach | Direct HTTP via OAuth2 client | googleapis mybusiness v4 types incomplete/broken |
| Reply byte validation | Check Buffer.byteLength before API call | Hebrew 2-3 bytes per char, fail fast on oversized |
| Star rating format | Parse enum to number 1-5 | Cleaner for business logic comparisons |
| Null handling | Use nullish coalescing (??) | Google API types include null, our interfaces use undefined |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript type errors in profile.ts**
- **Found during:** Task 1
- **Issue:** googleapis types include `null | undefined`, our interfaces only allow `undefined`
- **Fix:** Used nullish coalescing (`?? undefined`) for optional fields
- **Files modified:** src/services/google/profile.ts
- **Commit:** 76f3e07

**2. [Rule 3 - Blocking] Replaced broken mybusiness v4 typed client with direct HTTP**
- **Found during:** Task 2
- **Issue:** `google.mybusiness({ version: 'v4' })` returns types with no call signatures
- **Fix:** Used `client.request<T>()` with custom response interfaces
- **Files modified:** src/services/google/reviews.ts
- **Commit:** f1ceec2

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 76f3e07 | feat | Create business profile service |
| f1ceec2 | feat | Create reviews service with pagination and reply support |

## Verification Results

- TypeScript compiles: PASS
- All exports available from index.ts: PASS
- Type definitions complete: PASS

## Next Phase Readiness

**Ready for 04-03:** Review polling worker can now use `listReviews()` to fetch reviews and store them.

**Ready for Phase 5:** Review management can use:
- `listReviews()` to fetch pending reviews
- `postReviewReply()` to auto-reply to positive reviews
- `getReview()` to check current state before operations

**Integration points for future plans:**
- Reviews worker: Poll with `listReviews()`, track `updateTime` for delta detection
- AI reply generation: Call Claude, then `postReviewReply()` with generated text
- Dashboard: Display `listReviews()` results with star rating filters
