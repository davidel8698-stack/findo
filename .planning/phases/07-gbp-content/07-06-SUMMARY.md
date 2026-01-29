---
phase: 07-gbp-content
plan: 06
subsystem: business-hours
tags: [gbp-api, holiday-detection, hebrew-calendar, whatsapp-integration]

dependency-graph:
  requires: ["07-03"]
  provides: ["holiday-detection", "gbp-hours-update", "hours-message-handler"]
  affects: []

tech-stack:
  added: ["@hebcal/core"]
  patterns: ["holiday-detection-with-hebcal", "owner-response-parsing", "gbp-hours-merge"]

key-files:
  created:
    - src/services/gbp-content/holiday-checker.ts
    - src/services/google/hours.ts
    - src/queue/workers/holiday-check.worker.ts
  modified:
    - src/services/gbp-content/index.ts
    - src/services/google/index.ts
    - src/scheduler/jobs.ts
    - src/queue/workers/whatsapp-message.worker.ts
    - src/queue/queues.ts
    - package.json

decisions:
  - id: hebcal-core-library
    choice: "@hebcal/core for Israeli holidays"
    rationale: "Comprehensive Hebrew calendar library with Israeli holiday support"
  - id: business-affecting-holidays
    choice: "Curated list of holidays that affect business hours"
    rationale: "Not all holidays affect business - Rosh Hashana, Yom Kippur, Pesach, etc. are major"
  - id: reminder-window
    choice: "5-8 days window for 'one week' reminder"
    rationale: "Gives owner time to respond before holiday arrives"
  - id: hours-response-pattern
    choice: "DD/MM: format for parsing"
    rationale: "Simple pattern for Hebrew users - Israeli date format"
  - id: merge-special-hours
    choice: "Merge with existing, replace conflicts"
    rationale: "Don't lose existing special hours, just update conflicting dates"

metrics:
  duration: 6 min
  completed: 2026-01-29
---

# Phase 07 Plan 06: Business Hours Updates Summary

**One-liner:** Israeli holiday detection with @hebcal/core, WhatsApp reminders, owner reply parsing, direct GBP hours update.

## What Was Built

### 1. Holiday Checker Service (holiday-checker.ts)

- Uses @hebcal/core with `il: true` for Israeli holidays
- Detects business-affecting holidays (Rosh Hashana, Yom Kippur, Sukkot, Pesach, etc.)
- `getUpcomingHolidays(daysAhead)` - lists holidays in time window
- `getHolidaysNeedingReminder()` - filters to 5-8 days window
- `checkTenantHolidays(tenantId)` - sends WhatsApp reminder with format instructions
- `parseHoursResponse(text)` - parses "DD/MM: hours" or "DD/MM: closed" format
- Hebrew holiday name mapping for user-friendly messages

### 2. GBP Hours Service (hours.ts)

- `getLocationHours()` - fetches current regular and special hours
- `setSpecialHours()` - updates special hours with proper merge logic
  - Uses specific `updateMask: 'specialHours.specialHourPeriods'` (never '*')
  - Merges with existing hours, replaces conflicting dates
- `createSingleDayPeriod()` - helper for creating single-day periods

### 3. Holiday Check Worker (holiday-check.worker.ts)

- Runs weekly on Sunday 10:00 AM Israel time
- First checks if any holidays need reminders (skip if none)
- Queries tenants with active Google AND WhatsApp connections
- 100ms rate limiting between tenants
- Concurrency: 1

### 4. Message Handler Integration

- Added hours response detection (position 5 in priority order)
- Pattern: `/\d{1,2}\/\d{1,2}\s*:/` (DD/MM: format)
- Parses response with `parseHoursResponse()`
- Converts to `SpecialHourPeriod[]` using `createSingleDayPeriod()`
- Calls `setSpecialHours()` to update GBP
- Sends confirmation: "Updated hours in Google: {summary}"

## Message Flow

```
Sunday 10:00 AM (weekly)
         |
         v
  [Holiday Check Worker]
         |
         v
  getHolidaysNeedingReminder()
         |
    Any holidays?
   /           \
  NO           YES
  |             |
 (skip)    For each tenant:
             checkTenantHolidays()
                  |
                  v
           WhatsApp: "בעוד שבוע יש חגים..."

Owner responds: "15/9: סגור\n16/9: 10:00-14:00"
         |
         v
  parseHoursResponse()
         |
         v
  createSingleDayPeriod() for each
         |
         v
  setSpecialHours() -> GBP API
         |
         v
  WhatsApp: "עדכנתי את השעות בגוגל:..."
```

## Message Priority Order (Updated)

1. Review approval responses (button clicks, text replies)
2. Photo responses (images when photo request active)
3. Photo category selection (1-5 or Hebrew category words)
4. Post responses (AI/skip/content when pending post request)
5. **Hours responses (DD/MM: format for holiday hours)** [NEW]
6. Lead chatbot flow (fallback for non-owner messages)

## Verification Checklist

- [x] @hebcal/core installed and detecting Israeli holidays
- [x] Holiday reminders sent 1 week before major holidays
- [x] Owner can respond with hours in simple DD/MM: format
- [x] Special hours updated on GBP directly from WhatsApp reply
- [x] Confirmation sent after successful update
- [x] TypeScript compiles without errors

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Phase 7 (GBP Content) is now COMPLETE. All 6 plans implemented:
- 07-01: Photo Request Foundation
- 07-02: Media Services
- 07-03: Photo Upload Flow
- 07-04: Promotional Posts
- 07-05: AI Post Generation
- 07-06: Business Hours Updates

Ready for Phase 8 (Dashboard) or Phase 9 (Analytics) as per PROJECT.md roadmap.
