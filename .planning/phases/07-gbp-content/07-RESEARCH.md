# Phase 7: GBP Content - Research

**Researched:** 2026-01-29
**Domain:** Google Business Profile Content Management (Photos, Posts, Hours)
**Confidence:** MEDIUM-HIGH

## Summary

This phase implements the GBP content management system: weekly photo collection via WhatsApp, photo uploads to GBP, monthly promotional posts, and business hours updates for holidays. The technical foundation is solid as the codebase already has Google OAuth with `business.manage` scope, WhatsApp messaging infrastructure, Claude AI integration via Anthropic SDK, and BullMQ scheduler patterns.

The Google Business Profile API landscape is split across multiple API versions. Media uploads and local posts use the My Business API v4 (`mybusiness.googleapis.com/v4`), while business information updates (hours) use either v4 or the newer mybusinessbusinessinformation v1 API. The codebase already follows the pattern of using direct HTTP requests for reviews (v4), which should be extended for media and posts. For photos received via WhatsApp, the system must download media using a two-step process (get URL from Graph API, then download from lookaside URL with auth header).

**Primary recommendation:** Extend existing Google service patterns using direct HTTP to v4 API for media uploads, posts, and hours updates. Use `sharp` for image quality validation. Use `@hebcal/core` for Israeli holiday scheduling.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| googleapis | 170.1.0 | Google APIs (already installed) | Official Google client, already used for OAuth and profile |
| sharp | ^0.33.x | Image processing/validation | Fastest Node.js image library, blur detection, resize |
| @hebcal/core | ^5.x | Israeli holiday calendar | Authoritative Jewish/Israeli holiday source, TypeScript native |
| @anthropic-ai/sdk | 0.71.2 | AI content generation (already installed) | Already used for review replies, structured outputs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| openai | ^4.x | AI image generation (optional) | When owner has no photos and AI generation is approved |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| sharp | jimp | jimp is pure JS (slower), sharp requires native deps but 10x faster |
| @hebcal/core | REST API | Library is offline, no rate limits, same data source |
| OpenAI DALL-E | Stable Diffusion | DALL-E simpler API, SD more customizable but complex setup |

**Installation:**
```bash
pnpm add sharp @hebcal/core
# Optional for AI image generation:
pnpm add openai
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── services/
│   ├── google/
│   │   ├── media.ts           # Photo upload to GBP (new)
│   │   ├── posts.ts           # Local posts management (new)
│   │   ├── hours.ts           # Business hours updates (new)
│   │   └── ... (existing)
│   ├── gbp-content/
│   │   ├── photo-request.ts   # Weekly photo request flow
│   │   ├── photo-processor.ts # Quality check, upload orchestration
│   │   ├── post-generator.ts  # AI-generated promotional posts
│   │   └── hours-checker.ts   # Holiday hours reminder logic
│   └── media/
│       ├── whatsapp-download.ts  # Download media from WhatsApp
│       └── image-validator.ts    # Quality checks with sharp
├── scheduler/
│   └── jobs.ts                # Add photo-request, post-monthly, holiday-check jobs
└── queue/workers/
    ├── photo-request.worker.ts
    ├── photo-upload.worker.ts
    ├── monthly-post.worker.ts
    └── holiday-check.worker.ts
```

### Pattern 1: Direct HTTP for GBP v4 API
**What:** Use direct HTTP requests (like reviews.ts) rather than googleapis client for media/posts
**When to use:** All v4 API calls for media, posts, hours
**Example:**
```typescript
// Source: Existing pattern from src/services/google/reviews.ts
const GBP_API_BASE = 'https://mybusiness.googleapis.com/v4';

export async function createLocalPost(
  tenantId: string,
  accountId: string,
  locationId: string,
  post: LocalPostInput
): Promise<LocalPost> {
  const client = await createAuthenticatedClient(tenantId);
  if (!client) throw new Error(`No valid Google credentials for tenant ${tenantId}`);

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/localPosts`;

  const response = await client.request<LocalPostResponse>({
    url,
    method: 'POST',
    data: post,
  });

  return mapLocalPost(response.data);
}
```

### Pattern 2: Two-Step WhatsApp Media Download
**What:** Get media URL from Graph API, then download with auth header
**When to use:** Processing photos received via WhatsApp
**Example:**
```typescript
// Source: WhatsApp Cloud API documentation
const GRAPH_API_VERSION = 'v21.0';

export async function downloadWhatsAppMedia(
  mediaId: string,
  accessToken: string
): Promise<Buffer> {
  // Step 1: Get the download URL
  const metaResponse = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${mediaId}`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  );
  const { url } = await metaResponse.json();

  // Step 2: Download from lookaside URL (expires in 5 minutes)
  const mediaResponse = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Findo/1.0'  // Required for lookaside URLs
    }
  });

  return Buffer.from(await mediaResponse.arrayBuffer());
}
```

### Pattern 3: Scheduler Jobs with Israel Timezone
**What:** Schedule recurring jobs with `Asia/Jerusalem` timezone
**When to use:** Weekly photo requests (Thursday), monthly posts, holiday checks
**Example:**
```typescript
// Source: Existing pattern from src/scheduler/jobs.ts
// Thursday 10:00 AM Israel time (end of Israeli work week)
await scheduledQueue.add(
  'photo-request',
  { jobType: 'photo-request' },
  {
    repeat: {
      pattern: '0 10 * * 4',  // Thursday at 10:00
      tz: 'Asia/Jerusalem',
    },
    jobId: 'photo-request-weekly',
  }
);
```

### Anti-Patterns to Avoid
- **Uploading unvalidated images:** Always check dimensions (min 250px) and blur before uploading - GBP will reject or the photo will look bad
- **Storing WhatsApp media URLs:** URLs expire in 5 minutes; always download immediately to buffer/storage
- **Assuming photo upload is instant:** GBP processing takes 24-48 hours; track status, don't promise immediate visibility
- **Hardcoding holiday dates:** Use @hebcal/core; Israeli holidays move every year on Gregorian calendar

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image blur detection | Custom Laplacian/FFT | sharp + stats() | sharp uses libvips, optimized C code |
| Hebrew/Israeli holidays | Static date list | @hebcal/core | Dates shift yearly, edge cases (leap years) |
| Image resizing/format | Canvas/jimp | sharp | 10x faster, handles EXIF orientation |
| Promotional post text | Template strings | Claude AI | Context-aware, business-specific, Hebrew |
| WhatsApp media URL | Store URL | Download immediately | URLs expire in 5 minutes |

**Key insight:** Image processing and calendar calculations have extensive edge cases. The libraries handle ICC profiles, EXIF rotation, Hebrew leap years, and holiday postponements that would take weeks to implement correctly.

## Common Pitfalls

### Pitfall 1: WhatsApp Media URL Expiration
**What goes wrong:** Storing the media URL for later processing; 5 minutes later the URL is invalid
**Why it happens:** Meta's lookaside URLs are temporary for security
**How to avoid:** Download immediately when webhook received, store buffer or upload to own storage
**Warning signs:** 403 errors when trying to download media hours after receiving

### Pitfall 2: GBP Photo Category Confusion
**What goes wrong:** Uploading to wrong category, or expecting owner to know category names
**Why it happens:** GBP has 12+ categories (COVER, PROFILE, EXTERIOR, INTERIOR, PRODUCT, AT_WORK, FOOD_AND_DRINK, MENU, COMMON_AREA, ROOMS, TEAMS, ADDITIONAL)
**How to avoid:** Ask owner in simple terms ("Is this your space, your team, or your product?"), map to API category
**Warning signs:** Photos appearing in wrong section on GBP

### Pitfall 3: Post Rejection for Phone Numbers
**What goes wrong:** Post with phone number in text gets rejected by Google
**Why it happens:** Google policy explicitly rejects posts containing phone numbers
**How to avoid:** AI prompt must explicitly forbid phone numbers; validate text before posting
**Warning signs:** Post creation returns error or post disappears after brief appearance

### Pitfall 4: Special Hours Overwrites
**What goes wrong:** Setting special hours for holiday but accidentally clearing regular hours
**Why it happens:** PATCH with wrong updateMask or misunderstanding API behavior
**How to avoid:** Always use specific updateMask (`specialHours.specialHourPeriods`), never `*`
**Warning signs:** Business shows "Hours not available" instead of regular + special

### Pitfall 5: Image Size/Format Rejection
**What goes wrong:** Photo upload fails silently or image looks terrible on GBP
**Why it happens:** Image too small (<250px), wrong format, or extreme aspect ratio
**How to avoid:** Validate with sharp before upload: min 250x250px, JPEG/PNG, reasonable aspect ratio
**Warning signs:** Upload succeeds but photo never appears; photo looks pixelated on profile

## Code Examples

Verified patterns from official sources:

### Upload Photo to GBP (via URL)
```typescript
// Source: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.media
interface MediaCreateRequest {
  mediaFormat: 'PHOTO' | 'VIDEO';
  locationAssociation: {
    category: 'COVER' | 'PROFILE' | 'EXTERIOR' | 'INTERIOR' | 'PRODUCT' |
              'AT_WORK' | 'FOOD_AND_DRINK' | 'MENU' | 'COMMON_AREA' |
              'ROOMS' | 'TEAMS' | 'ADDITIONAL';
  };
  sourceUrl: string;  // Must be publicly accessible
}

export async function uploadPhotoFromUrl(
  tenantId: string,
  accountId: string,
  locationId: string,
  photoUrl: string,  // Public URL (e.g., from S3)
  category: string
): Promise<{ mediaItemId: string }> {
  const client = await createAuthenticatedClient(tenantId);
  if (!client) throw new Error(`No valid Google credentials`);

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/media`;

  const response = await client.request<{ name: string }>({
    url,
    method: 'POST',
    data: {
      mediaFormat: 'PHOTO',
      locationAssociation: { category },
      sourceUrl: photoUrl,
    },
  });

  return { mediaItemId: response.data.name.split('/').pop() || '' };
}
```

### Create Local Post
```typescript
// Source: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts
interface LocalPostInput {
  languageCode: string;
  summary: string;  // Max 1500 chars, ideal 100-300
  topicType: 'STANDARD' | 'EVENT' | 'OFFER';
  callToAction?: {
    actionType: 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL';
    url: string;
  };
  media?: Array<{
    mediaFormat: 'PHOTO';
    sourceUrl: string;
  }>;
}

export async function createPost(
  tenantId: string,
  accountId: string,
  locationId: string,
  post: LocalPostInput
): Promise<{ postId: string; state: 'LIVE' | 'PROCESSING' | 'REJECTED' }> {
  const client = await createAuthenticatedClient(tenantId);
  if (!client) throw new Error(`No valid Google credentials`);

  // Validate: No phone numbers allowed
  if (/\d{2,3}[-.\s]?\d{7}/.test(post.summary)) {
    throw new Error('Posts cannot contain phone numbers per Google policy');
  }

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}/localPosts`;

  const response = await client.request<{
    name: string;
    state: string;
  }>({
    url,
    method: 'POST',
    data: post,
  });

  return {
    postId: response.data.name.split('/').pop() || '',
    state: response.data.state as 'LIVE' | 'PROCESSING' | 'REJECTED',
  };
}
```

### Update Special Hours for Holiday
```typescript
// Source: https://developers.google.com/my-business/reference/rest/v4/accounts.locations
interface SpecialHourPeriod {
  startDate: { year: number; month: number; day: number };
  openTime?: string;  // 24hr format "HH:MM"
  endDate: { year: number; month: number; day: number };
  closeTime?: string;
  isClosed: boolean;
}

export async function setHolidayHours(
  tenantId: string,
  accountId: string,
  locationId: string,
  periods: SpecialHourPeriod[]
): Promise<void> {
  const client = await createAuthenticatedClient(tenantId);
  if (!client) throw new Error(`No valid Google credentials`);

  const url = `${GBP_API_BASE}/accounts/${accountId}/locations/${locationId}`;

  await client.request({
    url,
    method: 'PATCH',
    params: {
      updateMask: 'specialHours.specialHourPeriods',
    },
    data: {
      specialHours: {
        specialHourPeriods: periods,
      },
    },
  });
}
```

### Image Quality Validation with Sharp
```typescript
// Source: https://sharp.pixelplumbing.com/
import sharp from 'sharp';

interface ImageValidationResult {
  valid: boolean;
  reason?: string;
  width: number;
  height: number;
  format: string;
  sharpnessScore: number;  // Higher = sharper
}

export async function validateImage(buffer: Buffer): Promise<ImageValidationResult> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Check dimensions (GBP requires minimum 250x250)
  if (!metadata.width || !metadata.height) {
    return { valid: false, reason: 'Could not read image dimensions', width: 0, height: 0, format: '', sharpnessScore: 0 };
  }

  if (metadata.width < 250 || metadata.height < 250) {
    return {
      valid: false,
      reason: `Image too small (${metadata.width}x${metadata.height}), minimum 250x250`,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format || '',
      sharpnessScore: 0
    };
  }

  // Check format
  if (!['jpeg', 'png', 'webp'].includes(metadata.format || '')) {
    return {
      valid: false,
      reason: `Unsupported format: ${metadata.format}`,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format || '',
      sharpnessScore: 0
    };
  }

  // Blur detection using Laplacian variance
  // Apply Laplacian kernel and measure variance
  const { entropy } = await image
    .greyscale()
    .convolve({
      width: 3,
      height: 3,
      kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0],  // Laplacian kernel
    })
    .stats();

  // entropy.sum gives indication of sharpness (higher = more edges = sharper)
  const sharpnessScore = entropy;
  const isBlurry = sharpnessScore < 50;  // Threshold determined empirically

  if (isBlurry) {
    return {
      valid: false,
      reason: 'Image appears blurry',
      width: metadata.width,
      height: metadata.height,
      format: metadata.format || '',
      sharpnessScore
    };
  }

  return {
    valid: true,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format || '',
    sharpnessScore
  };
}
```

### Israeli Holiday Lookup with Hebcal
```typescript
// Source: @hebcal/core documentation
import { HebrewCalendar, HolidayEvent, flags, Location } from '@hebcal/core';

interface UpcomingHoliday {
  name: string;
  hebrewName: string;
  date: Date;
  isYomTov: boolean;  // Work forbidden
}

// Major holidays that affect business hours
const BUSINESS_AFFECTING_HOLIDAYS = [
  'Rosh Hashana',
  'Yom Kippur',
  'Sukkot',
  'Shmini Atzeret',
  'Simchat Torah',
  'Pesach',
  'Shavuot',
  'Yom HaAtzma\'ut',  // Independence Day
];

export function getUpcomingHolidays(daysAhead: number = 14): UpcomingHoliday[] {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + daysAhead);

  const events = HebrewCalendar.calendar({
    start: now,
    end: end,
    il: true,  // Use Israeli holidays
    candlelighting: false,
    sedrot: false,
    omer: false,
    noModern: false,  // Include modern Israeli holidays
  });

  return events
    .filter((ev): ev is HolidayEvent =>
      ev instanceof HolidayEvent &&
      BUSINESS_AFFECTING_HOLIDAYS.some(h => ev.getDesc().includes(h))
    )
    .map(ev => ({
      name: ev.getDesc(),
      hebrewName: ev.render('he'),
      date: ev.getDate().greg(),
      isYomTov: (ev.getFlags() & flags.CHAG) !== 0,
    }));
}
```

### AI Post Content Generation
```typescript
// Source: Existing pattern from src/services/review-management/reply-generator.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

interface PostContent {
  summary: string;
  callToActionType: 'LEARN_MORE' | 'BOOK' | 'ORDER' | null;
  isSafe: boolean;  // Safe = can auto-publish without approval
}

export async function generatePostContent(
  businessName: string,
  businessType: string,
  recentActivity?: string
): Promise<PostContent> {
  const prompt = `Generate a Google Business Profile post for a business.

Business: ${businessName}
Type: ${businessType}
Recent Activity: ${recentActivity || 'none'}

Requirements:
- Write in Hebrew
- 100-200 characters (ideal length for GBP)
- Engaging, friendly tone
- NO phone numbers (Google rejects these)
- NO specific discounts or offers (unless explicitly provided)
- Focus on: seasonal greeting, behind-the-scenes, quality commitment, or customer appreciation

Return JSON with:
- summary: The post text in Hebrew
- callToActionType: "LEARN_MORE", "BOOK", "ORDER", or null
- isSafe: true if this is generic (seasonal, appreciation), false if mentions specific promotions`;

  try {
    const response = await anthropic.beta.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      betas: ['structured-outputs-2025-11-13'],
      messages: [{ role: 'user', content: prompt }],
      output_format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            callToActionType: {
              type: ['string', 'null'],
              enum: ['LEARN_MORE', 'BOOK', 'ORDER', null]
            },
            isSafe: { type: 'boolean' }
          },
          required: ['summary', 'callToActionType', 'isSafe'],
          additionalProperties: false
        }
      }
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    return JSON.parse(content.text) as PostContent;
  } catch (error) {
    console.error('[post-generator] Failed:', error);
    // Safe fallback
    return {
      summary: `תודה שאתם איתנו! ${businessName} מזמין אתכם להמשיך ליהנות משירות מעולה.`,
      callToActionType: null,
      isSafe: true
    };
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| My Business API v3 | v4 + Business Info v1 | 2022 | v3 fully deprecated, must use v4 for posts/media |
| googleapis SDK for all | Direct HTTP for v4 | Ongoing | SDK has incomplete types for mybusiness v4 |
| JPEG only uploads | JPEG, PNG, WebP | 2023 | More flexibility, but validate format before upload |
| Single photo per post | Single media per post | Current | Videos not supported for posts via API |

**Deprecated/outdated:**
- `mybusinessv3` API: Fully removed, all code must use v4
- `plus.business.manage` scope: Now just `business.manage`
- Product posts via API: Not supported, must use Business Profile Manager UI

## Open Questions

Things that couldn't be fully resolved:

1. **AI Image Generation Service Selection**
   - What we know: Claude cannot generate images; OpenAI DALL-E, Stable Diffusion, WaveSpeedAI are options
   - What's unclear: Which service best matches business photo aesthetics; cost per image
   - Recommendation: Start with owner's existing photos; defer AI generation to future iteration, or use OpenAI DALL-E if owner explicitly enables

2. **Blur Detection Threshold**
   - What we know: Laplacian variance method works; sharp can compute it
   - What's unclear: Exact threshold for "too blurry" varies by image content
   - Recommendation: Start with threshold of 50; collect feedback; allow Claude's discretion to adjust

3. **Photo Storage Between WhatsApp Download and GBP Upload**
   - What we know: WhatsApp URLs expire in 5 minutes; GBP needs public URL
   - What's unclear: Whether to use cloud storage (S3/GCS) or serve from Findo backend
   - Recommendation: Use cloud storage (S3-compatible); simpler, scales, GBP can access directly

## Sources

### Primary (HIGH confidence)
- Google Business Profile API v4 REST Reference - media, localPosts, locations
- WhatsApp Cloud API Documentation - media download
- sharp npm documentation - image processing
- Existing codebase patterns (`src/services/google/reviews.ts`, `src/services/review-management/reply-generator.ts`)

### Secondary (MEDIUM confidence)
- [Google My Business API Reference](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.media) - media endpoints
- [Google My Business Posts Guide](https://developers.google.com/my-business/content/posts-data) - post creation
- [WhatsApp Media Download Guide](https://medium.com/@shreyas.sreedhar/downloading-media-using-whatsapps-cloud-api-webhooks-and-uploading-it-to-aws-s3-bucket-via-nodejs-07c5cbae896f) - community pattern
- [Hebcal Developer APIs](https://www.hebcal.com/home/developer-apis) - Jewish calendar

### Tertiary (LOW confidence)
- GBP post character limit (1500 max, 100-300 ideal) - community forums, no official API doc found
- Blur detection threshold - empirical, needs validation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - googleapis already integrated, sharp is industry standard
- Architecture: HIGH - extends proven existing patterns in codebase
- Media upload API: MEDIUM - official docs, but no actual testing
- Post API constraints: MEDIUM - phone number rejection confirmed, but edge cases unclear
- Blur detection: LOW - algorithm known, threshold needs calibration
- Pitfalls: MEDIUM - community-reported, not all personally verified

**Research date:** 2026-01-29
**Valid until:** 2026-02-28 (GBP API stable, but monitor for deprecation notices)
