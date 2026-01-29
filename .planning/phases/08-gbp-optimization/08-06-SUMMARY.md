---
phase: 08-gbp-optimization
plan: 06
subsystem: optimization
tags: [ab-testing, optimization, review-request, metrics]
dependency-graph:
  requires: ["08-01"]
  provides: ["ab-testing-framework", "variant-assignment", "outcome-tracking"]
  affects: ["review-request-workers", "future-optimization-features"]
tech-stack:
  added: []
  patterns: ["ab-testing", "variant-selection", "outcome-tracking", "winner-detection"]
key-files:
  created:
    - src/services/optimization/ab-testing.ts
  modified:
    - src/services/optimization/index.ts
    - src/services/review-request/messages.ts
    - src/services/review-request/completion.ts
    - src/queue/workers/review-request.worker.ts
decisions:
  - id: ab-testing-thresholds
    choice: "20% improvement with 10+ samples for winner detection"
    rationale: "Per CONTEXT.md - sufficient statistical confidence with practical sample size"
  - id: variant-assignment
    choice: "Prefer global winners, else random assignment"
    rationale: "New tenants get proven approaches while allowing experimentation"
  - id: outcome-tracking
    choice: "Track success on review completion, not send"
    rationale: "Measures actual outcome (review received) not just activity (message sent)"
  - id: template-based-variants
    choice: "Variants can specify alternate templates or personalization options"
    rationale: "WhatsApp templates are pre-approved, so variants modify which template or parameters"
metrics:
  duration: ~4 min
  completed: 2026-01-29
---

# Phase 08 Plan 06: A/B Testing Framework Summary

**One-liner:** A/B testing service with variant assignment, outcome tracking, and 20%+ winner detection integrated with review requests.

## What Was Built

### A/B Testing Service (ab-testing.ts)

Complete A/B testing framework for optimization experiments:

**Core Functions:**
- `getActiveVariant(tenantId, testType)` - Gets or assigns variant for tenant
- `assignVariant(tenantId, testType)` - Assigns variant (prefers global winners, else random)
- `recordOutcome(tenantId, testType, success)` - Tracks success/failure per variant
- `checkForWinner(testType)` - Identifies winner when 20%+ better with 10+ samples
- `promoteToGlobalWinner(variantId)` - Sets variant as global winner for new tenants
- `seedVariants(testType, variants)` - Initializes test variants during deployment

**Test Types (from schema):**
- `review_request_message` - Review request template variants
- `review_request_timing` - Delay timing variants
- `review_reminder_message` - Reminder message variants
- `photo_request_message` - Photo request variants
- `post_request_message` - Post request variants

### Review Request Integration

**messages.ts Changes:**
- Added `tenantId` parameter to `sendReviewRequestMessage`
- Calls `getActiveVariant` to check for assigned variant
- Applies variant content (template name, personalization options)
- Falls back to default template if no variant assigned

**completion.ts Changes:**
- Imports `recordOutcome` from ab-testing
- Calls `recordOutcome(tenantId, 'review_request_message', true)` on completion
- Tracks successful review request conversions for A/B analysis

**Worker Update:**
- Updated `review-request.worker.ts` to pass `tenantId` to message function

## Technical Details

### Winner Detection Algorithm

```typescript
// Per CONTEXT.md: 20%+ better with 10+ samples
const WINNER_THRESHOLD_PERCENT = 20;
const MIN_SAMPLES_FOR_WINNER = 10;

// Aggregates samples across all tenant assignments per variant
// Compares each variant's conversion rate to control
// Winner must beat control by 20%+ relative improvement
```

### Variant Content Structure

```typescript
interface ReviewRequestVariant {
  templateName?: string;       // Alternate pre-approved template
  customerFallback?: string;   // Hebrew fallback for missing name
  addEmoji?: boolean;          // Whether to add emoji to name
}
```

### Integration Pattern

```
Review Request Created
        |
        v
sendReviewRequestMessage(tenantId, ...)
        |
        v
getActiveVariant(tenantId, 'review_request_message')
        |
        v
[Variant found] -> Apply variant content
[No variant] -> Use default template
        |
        v
Message Sent
        .
        .  (customer receives, may leave review)
        .
        v
checkReviewCompletion() detects new review
        |
        v
recordOutcome(tenantId, 'review_request_message', true)
        |
        v
Conversion rate updated for tenant's assigned variant
```

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 3cf4cc0 | feat | Create A/B testing service |
| daf0199 | feat | Export A/B testing from optimization index |
| d831947 | feat | Integrate A/B testing with review requests |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated review request worker parameter**
- **Found during:** Task 3 TypeScript compilation
- **Issue:** Adding tenantId parameter to sendReviewRequestMessage broke worker call
- **Fix:** Updated review-request.worker.ts to pass tenantId
- **Files modified:** src/queue/workers/review-request.worker.ts
- **Commit:** d831947

## Success Criteria Verification

| Criteria | Status |
|----------|--------|
| A/B testing service can assign/track variants | PASS |
| Winner detection uses 20% threshold + 10 samples | PASS |
| Review request messages check for variant | PASS |
| Completion tracking records success outcomes | PASS |
| TypeScript compiles | PASS |

## Next Phase Readiness

**Ready for:**
- 08-07: Worker Registration - Can register metrics collection and A/B test checking

**Future extensions:**
- Add failure outcome tracking (expired requests without review)
- Extend A/B testing to other test types (timing, reminder, photo, post)
- Implement auto-promotion when winner found
- Add admin UI to view A/B test results
