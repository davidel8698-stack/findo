---
phase: 08-gbp-optimization
plan: 04
subsystem: dashboard
tags: [metrics, dashboard, api, hebrew]

dependency_graph:
  requires: [08-01]
  provides: [metrics-api, metrics-dashboard]
  affects: [08-05, 08-06]

tech_stack:
  added: []
  patterns: [card-grid-layout, trend-arrows, period-toggle]

key_files:
  created:
    - src/routes/metrics.ts
    - src/views/metrics-dashboard.ts
  modified:
    - src/routes/pages.ts
    - src/views/index.ts

decisions:
  - id: metrics-trend-threshold
    decision: Use 5% change threshold for trend direction
    rationale: Avoids noise from small fluctuations while surfacing meaningful changes

metrics:
  duration: ~4 min
  completed: 2026-01-29
---

# Phase 8 Plan 04: Metrics Dashboard API and View Summary

**One-liner:** Hebrew RTL metrics dashboard with API endpoint showing visibility, reviews, content, and conversion trends.

## What Was Built

### Task 1: Metrics API Endpoint
Created `src/routes/metrics.ts` providing:
- GET `/api/metrics?tenantId=xxx&period=week|month` endpoint
- Queries metricSnapshots and tenantBaselines from database
- Returns current metrics, trends (up/down/flat), baseline comparison, and 8-period history
- 5% threshold for trend detection to avoid noise

### Task 2: Metrics Dashboard View
Created `src/views/metrics-dashboard.ts` with:
- Hebrew RTL layout with 4 metric categories
- **Visibility section:** impressions, searches, actions with trend arrows
- **Reviews section:** average rating, new reviews, total reviews, response rate
- **Content section:** image count, image views with trends
- **Review requests section:** sent, completed, conversion rate with trend
- Period toggle (week/month) with active state styling
- Baseline comparison section showing performance vs. tenant's own average
- Loading spinner and no-data states for graceful UX

### Task 3: Route Mounting
Updated `src/routes/pages.ts` and `src/views/index.ts`:
- Mounted API at `/api/metrics`
- Added dashboard page at `/dashboard/metrics?tenantId=xxx`
- Exported renderMetricsDashboard from views barrel

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| 5% trend threshold | Filters noise, surfaces meaningful changes |
| parseFloat for decimal handling | Database returns decimal as string, need explicit conversion |
| Hebrew locale formatting | n.toLocaleString('he-IL') for proper number display |
| Flat trend for null/zero data | Graceful handling of insufficient history |

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | 6d11ca0 | feat(08-04): create metrics API endpoint |
| 2 | ff34bfa | feat(08-04): create metrics dashboard view |
| 3 | 425b191 | feat(08-04): mount metrics routes in pages |

## Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| src/routes/metrics.ts | created | API endpoint for metrics data |
| src/views/metrics-dashboard.ts | created | Dashboard HTML view |
| src/routes/pages.ts | modified | Route mounting |
| src/views/index.ts | modified | Export new view |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- TypeScript compiles without errors (plan code only)
- Export `metricsRoutes` exists in metrics.ts
- Export `renderMetricsDashboard` exists in metrics-dashboard.ts
- Routes mounted in pages.ts verified via grep

## Next Phase Readiness

**08-05 (Optimization Tips):** Ready - dashboard provides UI foundation for tips display
**08-06 (Dashboard Enhancements):** Ready - API and view structure in place for expansion

## Success Criteria Status

| Criteria | Status |
|----------|--------|
| API returns metrics data with trends and baseline | Complete |
| Dashboard shows all 4 metric categories | Complete |
| Period toggle switches between week/month | Complete |
| Trend arrows display correctly | Complete |
| Hebrew RTL layout | Complete |
