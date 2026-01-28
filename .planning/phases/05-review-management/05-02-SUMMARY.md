---
phase: 05-review-management
plan: 02
subsystem: ai-services
tags: [claude-ai, structured-outputs, hebrew, review-replies]

dependency_graph:
  requires:
    - 05-01 (review schema for storing AI replies)
    - 03-04 (established Anthropic SDK pattern in intent.ts)
  provides:
    - AI reply generation service with Hebrew support
    - Sentiment classification for 3-star edge cases
    - Structured output format for consistent replies
  affects:
    - 05-03 (review polling worker will use generateReviewReply)
    - 05-04 (owner approval flow will use draft replies)

tech_stack:
  added: []
  patterns:
    - Claude Haiku 4.5 structured outputs beta for JSON responses
    - Fallback replies for AI failure resilience
    - Byte-length validation for Google API limits

key_files:
  created:
    - src/services/review-management/reply-generator.ts
    - src/services/review-management/index.ts
  modified: []

decisions:
  - id: claude-haiku-4-5-model
    decision: "Use claude-haiku-4-5-20251001 for reply generation"
    rationale: "Better Hebrew support than older models, cost-effective for high-volume replies"
  - id: structured-outputs-beta
    decision: "Use structured-outputs-2025-11-13 beta with output_format"
    rationale: "Guarantees JSON format, eliminates parsing failures"
  - id: 3-star-default-negative
    decision: "3-star reviews without comment default to negative"
    rationale: "Safer to alert owner than auto-reply to ambiguous reviews"
  - id: fallback-replies
    decision: "Hebrew fallback replies for AI failures"
    rationale: "Ensure reviews always get responses even if AI is down"

metrics:
  duration: "4 min"
  completed: "2026-01-28"
---

# Phase 05 Plan 02: AI Reply Generation Summary

**One-liner:** Claude Haiku 4.5 reply generator with structured outputs for personalized Hebrew review responses and 3-star sentiment classification.

## What Was Built

### Reply Generator Service (`reply-generator.ts`)

1. **generateReviewReply function:**
   - Uses Claude Haiku 4.5 with structured outputs beta
   - Generates personalized Hebrew replies per CONTEXT.md guidelines:
     - 1-2 sentences maximum
     - Warm personal tone, not corporate
     - References specific review content
     - No emojis, signs as business
   - Positive reviews: warm thank-you with return invitation
   - Negative reviews: Claude chooses apologetic or neutral tone
   - Validates reply byte length (max 4096 bytes for Google API)
   - Falls back to Hebrew default replies on AI failure

2. **classifyReviewSentiment function:**
   - Handles 3-star edge case per CONTEXT.md
   - 4-5 stars: automatically positive
   - 1-2 stars: automatically negative
   - 3 stars without comment: defaults to negative (safer)
   - 3 stars with comment: Claude sentiment analysis

### Service Barrel Export (`index.ts`)

- Re-exports all reply-generator functions
- Enables clean imports: `import { generateReviewReply } from '@/services/review-management'`

## Interfaces

```typescript
interface ReviewReplyResult {
  replyText: string;      // Hebrew reply text
  tone: 'warm' | 'apologetic' | 'neutral';
  referencedContent: string;  // What from review was referenced
}

interface ReviewForReply {
  reviewerName: string;
  comment?: string;
  starRating: number;
}
```

## AI Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Model | claude-haiku-4-5-20251001 | Latest Haiku with improved Hebrew |
| max_tokens | 512 | Limits reply length |
| Beta | structured-outputs-2025-11-13 | Guaranteed JSON format |
| output_format | json_schema | Type-safe response structure |

## Fallback Replies (Hebrew)

- **Positive:** "תודה רבה על הביקורת החיובית! נשמח לראותך שוב."
- **Negative:** "תודה על הביקורת. אנו לוקחים את המשוב שלך ברצינות ונשמח לדבר איתך."

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 94be26d | feat | Create AI reply generator with Claude structured outputs |
| 5fdc681 | feat | Create review-management service barrel export |

## Next Phase Readiness

**Ready for 05-03:**
- Reply generator available for review polling worker
- Sentiment classifier ready for 3-star edge cases
- Service properly exported for import

**No blockers identified.**

## Testing Notes

Functions require ANTHROPIC_API_KEY environment variable. Unit tests should mock the Anthropic client to avoid API calls.
