---
phase: 16-offer-objection-handling
plan: 03
subsystem: website-offer
tags: [roi-calculator, slider, spring-animation, motion]

dependency-graph:
  requires: ["16-01"]
  provides: ["ROICalculator component with spring-animated results"]
  affects: ["16-04", "16-05", "page-integration"]

tech-stack:
  added: []
  patterns: ["useSpring for animated counting", "SliderInput controlled component"]

key-files:
  created:
    - website/components/sections/offer/ROICalculator.tsx
  modified:
    - website/components/sections/offer/index.ts

decisions:
  - id: "roi-calc-spring"
    choice: "useSpring with stiffness:100 damping:30 for smooth counting"
    reason: "Matches SocialProofCounters pattern for consistency"
  - id: "roi-calc-labels"
    choice: "Hebrew labels avoiding ROI term"
    reason: "Per CONTEXT.md - use 'כמה תרוויח' style instead"

metrics:
  duration: "2m 8s"
  completed: "2026-02-01"
---

# Phase 16 Plan 03: ROI Calculator Summary

**One-liner:** Interactive ROI calculator with two sliders and spring-animated results showing potential leads and NIS value.

## What Was Built

### ROICalculator Component (167 lines)

Created an interactive calculator that helps visitors visualize potential value:

**Slider Inputs:**
- Missed calls per week: min 1, max 20, step 1, default 5
- Monthly revenue: min 10,000, max 200,000, step 5,000, default 50,000

**Calculation Logic:**
```typescript
const CONVERSION_RATE = 0.15; // 15% of missed calls become leads
const AVG_DEAL_VALUE_MULTIPLIER = 0.1; // 10% of monthly revenue per lead

const leadsRecovered = Math.round(missedCalls * 4 * CONVERSION_RATE);
const valueRecovered = Math.round(leadsRecovered * monthlyRevenue * AVG_DEAL_VALUE_MULTIPLIER);
```

**Animation Pattern:**
- Two useSpring instances (stiffness: 100, damping: 30)
- useTransform for Hebrew locale formatting (he-IL)
- Initial animation triggers when results div enters viewport
- Subsequent animations update as slider values change

### Barrel Export Update

Added ROICalculator to offer section barrel export for clean imports:
```typescript
import { ROICalculator } from "@/components/sections/offer";
```

## Commits

| Hash | Type | Description |
|------|------|-------------|
| e622012 | feat | Create ROI calculator component |
| 25b573b | chore | Add ROICalculator to offer barrel export |

## Verification Results

All checks passed:
- [x] `npm run build` passes with no errors
- [x] ROICalculator.tsx exists with useSpring animation pattern
- [x] Two slider inputs present (missed calls, monthly revenue)
- [x] Results display shows leads and NIS value
- [x] index.ts exports ROICalculator
- [x] Hebrew formatting used (toLocaleString("he-IL"))
- [x] Hebrew labels (no "ROI" term - uses "כמה אתה מפסיד")

## Deviations from Plan

None - plan executed exactly as written.

## Key Patterns Established

**Spring Animation for Dynamic Values:**
```typescript
const valueSpring = useSpring(0, { stiffness: 100, damping: 30 });
const displayValue = useTransform(valueSpring, (v) =>
  Math.round(v).toLocaleString("he-IL")
);
```

**Two-phase Animation Trigger:**
1. Initial animation when entering viewport (once: true)
2. Update animation when input values change

## Files Changed

```
website/components/sections/offer/
├── ROICalculator.tsx   (created, 167 lines)
└── index.ts            (modified, +1 export)
```

## Next Phase Readiness

Ready for 16-04 (Pricing Section) and 16-05 (FAQ Accordion). ROICalculator can be integrated into any page that needs to show potential value calculation.

---
*Completed: 2026-02-01 | Duration: 2m 8s | Tasks: 2/2*
