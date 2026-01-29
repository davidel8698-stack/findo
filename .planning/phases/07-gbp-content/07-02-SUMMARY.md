---
phase: 07-gbp-content
plan: 02
subsystem: media-services
tags: [whatsapp, google, media, sharp, image-processing]

dependency-graph:
  requires:
    - 04-01 (Google OAuth)
    - 02-01 (WhatsApp schema)
  provides:
    - WhatsApp media download service
    - Image quality validation
    - GBP photo upload/list/delete
  affects:
    - 07-03 (photo upload workflow)
    - 07-04 (promotional posts with images)

tech-stack:
  added:
    - sharp@0.34.5 (image processing)
  patterns:
    - Two-step WhatsApp media download (metadata then binary)
    - Laplacian variance for blur detection
    - Direct HTTP to GBP API v4

key-files:
  created:
    - src/services/media/whatsapp-download.ts
    - src/services/media/image-validator.ts
    - src/services/media/index.ts
    - src/services/google/media.ts
  modified:
    - package.json
    - src/services/google/index.ts

decisions:
  - id: two-step-download
    choice: "Get metadata first, then download binary"
    rationale: "WhatsApp Cloud API requires auth header for both steps"
  - id: laplacian-blur
    choice: "Use Laplacian variance for blur detection"
    rationale: "Standard approach, sharp supports convolution"
  - id: blur-threshold-50
    choice: "BLUR_THRESHOLD = 50"
    rationale: "Empirical starting point, adjustable based on feedback"
  - id: source-url-upload
    choice: "GBP photos via sourceUrl"
    rationale: "GBP API requires public URL, not binary upload"

metrics:
  duration: "~4 min"
  completed: "2026-01-29"
---

# Phase 07 Plan 02: Media Services Summary

Media pipeline services for downloading WhatsApp photos, validating quality, and uploading to GBP.

## One-liner

Three-service media pipeline: WhatsApp download (5min URL expiry), sharp-based validation (250px min, blur detection), and GBP upload via public URLs.

## What Was Built

### 1. WhatsApp Media Download Service
**File:** `src/services/media/whatsapp-download.ts`

Two-step download process:
1. Get metadata from Graph API v21.0 (includes temporary download URL)
2. Download binary from lookaside URL with auth header

```typescript
export async function downloadWhatsAppMedia(
  mediaId: string,
  accessToken: string
): Promise<DownloadedMedia>
```

**Critical:** WhatsApp media URLs expire in 5 minutes. Must download immediately when webhook received.

### 2. Image Validation Service
**File:** `src/services/media/image-validator.ts`

Validates images before GBP upload:
- **Dimensions:** Minimum 250x250px (GBP requirement)
- **Formats:** JPEG, PNG, WebP only
- **Blur detection:** Laplacian variance (threshold: 50)

```typescript
export async function validateImage(buffer: Buffer): Promise<ImageValidationResult>
export async function prepareImageForUpload(buffer: Buffer): Promise<Buffer>
```

Error messages in Hebrew for user-facing validation:
- "התמונה קטנה מדי (WxH). צריך לפחות 250x250"
- "פורמט לא נתמך: X. נא לשלוח JPEG, PNG או WebP"
- "התמונה נראית מטושטשת. נא לשלוח תמונה חדה יותר"

### 3. GBP Media Upload Service
**File:** `src/services/google/media.ts`

Following reviews.ts pattern with createAuthenticatedClient:

```typescript
export async function uploadPhotoFromUrl(
  tenantId: string,
  accountId: string,
  locationId: string,
  sourceUrl: string,
  category: PhotoCategory
): Promise<GBPPhoto>

export async function listPhotos(...): Promise<{ photos: GBPPhoto[]; nextPageToken?: string }>
export async function deletePhoto(...): Promise<void>
```

**Photo categories supported:** COVER, PROFILE, EXTERIOR, INTERIOR, PRODUCT, AT_WORK, FOOD_AND_DRINK, MENU, COMMON_AREA, ROOMS, TEAMS, ADDITIONAL

## Task Completion

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | WhatsApp Media Download Service | cf00c2a | whatsapp-download.ts, index.ts, package.json |
| 2 | Image Validation Service | 1bfcedd | image-validator.ts, index.ts |
| 3 | GBP Media Upload Service | c921e05 | media.ts, google/index.ts |

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Media download | Two-step (metadata + binary) | WhatsApp Cloud API architecture requires both |
| Blur detection | Laplacian variance with sharp | Standard edge detection, native sharp support |
| Blur threshold | 50 (stdev) | Starting point, tune based on real-world feedback |
| GBP upload method | sourceUrl (public URL) | GBP API doesn't accept binary uploads |
| Image prep | JPEG quality 85, mozjpeg | Good size/quality balance, strips EXIF |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed deprecated @types/sharp**
- **Found during:** Task 1 (dependency install)
- **Issue:** pnpm warned @types/sharp is deprecated, sharp includes own types
- **Fix:** Removed @types/sharp from devDependencies
- **Files modified:** package.json

## Next Phase Readiness

**Ready for:**
- 07-03: Photo upload workflow (uses all three services)
- 07-04: Promotional posts (can include images)

**Dependencies satisfied:**
- WhatsApp media download working
- Image validation with Hebrew errors
- GBP media API integration complete

**External requirements for production:**
- Public URL storage (S3/R2) for GBP uploads (sourceUrl must be accessible)
- Blur threshold may need tuning with real photos
