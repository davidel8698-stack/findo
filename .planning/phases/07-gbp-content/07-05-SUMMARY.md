# Phase 7 Plan 5: AI Post Generation and Approval Workflow Summary

---
phase: 07-gbp-content
plan: 05
subsystem: content-generation
tags: [ai, posts, workflow, claude, gbp]

dependency-graph:
  requires: [07-04]
  provides: [ai-post-generation, post-approval-workflow, owner-response-handling]
  affects: [07-06]

tech-stack:
  added: []
  patterns:
    - Claude Haiku 4.5 structured outputs for post generation
    - Dual-queue worker (notifications + scheduled)
    - Owner response routing in message handler

key-files:
  created:
    - src/services/gbp-content/post-generator.ts
    - src/queue/workers/post-approval.worker.ts
  modified:
    - src/queue/workers/whatsapp-message.worker.ts
    - src/scheduler/jobs.ts
    - src/queue/queues.ts
    - src/queue/index.ts
    - src/services/gbp-content/index.ts

decisions:
  - id: claude-haiku-for-posts
    choice: Claude Haiku 4.5 with structured outputs
    rationale: Same pattern as reply-generator.ts, cost-effective for Hebrew

  - id: safe-content-classification
    choice: isSafe boolean in PostContent
    rationale: Allows auto-publishing only safe content after timeout

  - id: reminder-sequence-days
    choice: Day 3 reminder 1, Day 7 reminder 2 + AI draft, Day 10 auto-publish
    rationale: Per CONTEXT.md - gradual escalation before auto-publish

  - id: dual-queue-worker
    choice: Separate workers for notifications and scheduled queues
    rationale: post-generate/publish on notifications, post-reminder on scheduled

  - id: post-response-priority
    choice: Post responses after photo handling, before lead chatbot
    rationale: Owner-specific flow should take precedence over lead chatbot

metrics:
  duration: ~10 min
  completed: 2026-01-29
---

**One-liner:** AI post generator with Claude Haiku 4.5 structured outputs, approval workflow with reminder sequence, and message handler integration for owner responses.

## What Was Built

### 1. AI Post Generator Service
Created `src/services/gbp-content/post-generator.ts`:
- `generatePostContent()` - generates Hebrew post content using Claude Haiku 4.5
- Uses structured outputs beta for guaranteed JSON format
- Supports both AI-only and owner-provided content modes
- Validates no phone numbers (Google policy)
- Classifies content as safe/promotional for auto-publish decisions
- `generateSafeAutoContent()` - generates safe content for auto-publishing
- Hebrew fallback replies for error cases

### 2. Post Approval Worker
Created `src/queue/workers/post-approval.worker.ts`:
- `handleGenerate()` - generates AI draft and sends to owner via WhatsApp
- `handlePublish()` - publishes approved post to GBP using createPost
- `handleReminders()` - processes reminder sequence:
  - Day 3: Send reminder 1
  - Day 7: Send reminder 2 + generate AI draft
  - Day 10: Auto-publish safe content
- Dual-queue worker: notifications (generate/publish) + scheduled (reminder)

### 3. Message Handler Integration
Updated `src/queue/workers/whatsapp-message.worker.ts`:
- Added `handleOwnerPostResponse()` function
- Status='requested' handling: AI/skip/content responses
- Status='pending_approval' handling: approve/edit/skip responses
- Integrated into message priority after photos, before lead chatbot
- Routes responses to post-generate and post-publish jobs

### 4. Scheduler Job
Added to `src/scheduler/jobs.ts`:
- post-reminder job: Daily at 11:00 AM Israel time
- 1 hour after monthly-post job for proper sequencing

## Key Patterns

### AI Generation with Safe Content Classification
```typescript
export interface PostContent {
  summary: string;
  topicType: PostTopicType;
  callToActionType: CallToActionType | null;
  isSafe: boolean; // Safe = can auto-publish without owner approval
}
```

### Reminder Sequence Flow
1. Day 0: Initial request sent (monthly-post.worker)
2. Day 3: Reminder 1 - gentle nudge
3. Day 7: Reminder 2 + AI generates safe draft
4. Day 10: Auto-publish safe content only

### Message Handler Priority
1. Review approval responses
2. Photo responses
3. Photo category selection
4. **Post responses** (new)
5. Lead chatbot flow

## Verification Results

All verification criteria met:
- AI post generator uses Claude Haiku 4.5 with structured outputs
- Handles owner content and AI-only generation
- Validates no phone numbers
- Distinguishes safe vs promotional content
- Post approval worker generates drafts and publishes to GBP
- Sends reminders at day 3 and day 7
- Auto-publishes safe content at day 10
- Message handler detects pending post requests
- Routes AI/skip/content responses correctly
- Routes approve/edit/skip for drafts

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | b90ae3d | feat(07-05): create AI post generator service |
| 2 | 1a43738 | feat(07-05): create post approval worker with reminder scheduler |
| 3 | 3854959 | feat(07-05): integrate post responses with message handler |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Ready for 07-06 (final plan in phase). The promotional post feature is now complete:
- Monthly requests are sent (07-04)
- AI generates content and owner can edit/approve (07-05)
- Reminders are sent automatically (07-05)
- Safe content auto-publishes after 10 days (07-05)

---

*Phase: 07-gbp-content*
*Plan: 05*
*Completed: 2026-01-29*
