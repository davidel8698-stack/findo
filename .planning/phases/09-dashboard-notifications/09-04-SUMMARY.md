---
phase: "09"
plan: "04"
subsystem: dashboard
tags: [activity-feed, grouping, sse, real-time, hebrew]
dependency-graph:
  requires: ["09-02"]
  provides: ["activity-grouper", "activity-feed-view", "activity-api"]
  affects: ["09-05", "09-08"]
tech-stack:
  added: []
  patterns: ["event-grouping", "sse-real-time", "two-column-layout"]
file-tracking:
  key-files:
    created:
      - src/services/dashboard/activity-grouper.ts
      - src/views/dashboard/activity-feed.ts
    modified:
      - src/routes/api/dashboard.ts
      - src/views/dashboard/main.ts
decisions:
  - id: "sourceId-grouping"
    choice: "Group events by sourceId into journeys"
    rationale: "Events with same sourceId (lead, review) represent related actions"
  - id: "journey-type-detection"
    choice: "Detect journey type from eventType prefix"
    rationale: "lead.*, review.*, content.* patterns already established"
  - id: "hebrew-summaries"
    choice: "Generate Hebrew summaries for groups"
    rationale: "Israeli market, consistent with CONTEXT.md"
  - id: "100-item-dom-limit"
    choice: "Keep max 100 items in DOM for activity feed"
    rationale: "Prevent memory issues per RESEARCH.md pitfall"
  - id: "two-column-layout"
    choice: "Stats 1 col, Activity 2 cols on desktop"
    rationale: "Activity feed is primary, stats are supplementary"
metrics:
  duration: "~6 min"
  completed: "2026-01-29"
---

# Phase 09 Plan 04: Activity Feed Summary

Activity grouper service with journey detection and Hebrew summaries; activity feed view component with filters, expand/collapse, and real-time SSE updates; API endpoint for grouped activity; two-column dashboard layout integration.

## What Was Built

### Task 1: Activity Grouper Service
**File:** `src/services/dashboard/activity-grouper.ts`

Created activity grouping service for smart event grouping:
- `ActivityGroup` interface for journey and single event types
- `groupActivityEvents()` groups events by sourceId
- Journey type detection from eventType prefix (lead., review., content.)
- Hebrew summary generation for different journey types:
  - Lead: "ליד: יוסי - הוסמך"
  - Review: "ביקורת: 5 כוכבים מדנה"
  - Content: "תוכן: 3 פעולות"
- `filterByType()` helper for activity feed filters
- Sort groups by latestAt DESC (newest first)

### Task 2: Activity Feed Component
**File:** `src/views/dashboard/activity-feed.ts`

Created activity feed view with grouping and real-time updates:
- Filter tabs: הכל | לידים | ביקורות | תוכן
- Collapsible journey groups with timeline view
- Single events displayed inline
- Icons and colors by journey type
- Quick action buttons for review approval and lead contact
- Real-time SSE connection to `/api/activity/stream`
- 100-item DOM limit to prevent memory issues
- Hebrew relative time formatting ("לפני 5 דקות", "אתמול")
- Load more pagination

### Task 3: Activity Feed API and Integration
**Files:** `src/routes/api/dashboard.ts`, `src/views/dashboard/main.ts`

Added activity endpoint and dashboard integration:
- GET `/api/dashboard/activity` with filter, limit, offset params
- Groups raw events with `groupActivityEvents`
- Applies filter with `filterByType`
- Returns `{ groups: ActivityGroup[], hasMore: boolean }`

Dashboard layout update:
- Health status at top (full width)
- Two-column grid on desktop: stats (1 col), activity (2 cols)
- Single column on mobile: stats above activity
- Integrated `renderActivityFeed` component

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Event grouping | By sourceId | Related events share source reference |
| Journey detection | eventType prefix | Consistent with existing patterns |
| Summary language | Hebrew | Israeli market per CONTEXT.md |
| DOM limit | 100 items | Memory management per RESEARCH.md |
| Layout ratio | 1:2 (stats:activity) | Activity is primary dashboard content |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| e8119cd | feat | Create activity grouper service |
| 34c3a0e | feat | Create activity feed view component |
| ab06121 | feat | Add activity feed API endpoint and dashboard integration |

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

**Created:**
- `src/services/dashboard/activity-grouper.ts` - Event grouping logic
- `src/views/dashboard/activity-feed.ts` - Feed component with SSE

**Modified:**
- `src/routes/api/dashboard.ts` - Added /activity endpoint
- `src/views/dashboard/main.ts` - Two-column layout with activity feed

## Verification Results

- TypeScript compilation: PASSED
- All exports available:
  - `groupActivityEvents`, `filterByType`, `ActivityGroup` from activity-grouper
  - `renderActivityFeed` from activity-feed

## Next Phase Readiness

**Ready for:**
- 09-05: Dashboard Main View (builds on this dashboard layout)
- 09-08: Main Dashboard Integration (uses activity feed)

**No blockers identified.**
