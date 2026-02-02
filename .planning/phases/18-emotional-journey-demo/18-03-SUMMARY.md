---
phase: 18-emotional-journey-demo
plan: 03
subsystem: ui
tags: [storylane, iframe, interactive-demo, tabs, lottie, lazy-loading]

# Dependency graph
requires:
  - phase: 18-02
    provides: LottieDemo component, DemoSection wrapper, demo-poster.svg
provides:
  - InteractiveDemo component with lazy Storylane iframe embed
  - Tab interface for video/interactive demo switching
  - Fullscreen modal for immersive demo experience
  - Homepage integration with DemoSection
affects: [19-performance, 18-05-UAT]

# Tech tracking
tech-stack:
  added: []
  patterns: [click-to-load iframe, tab state management, modal overlay]

key-files:
  created:
    - website/components/sections/demo/InteractiveDemo.tsx
    - website/public/images/interactive-demo-poster.svg
  modified:
    - website/components/sections/demo/DemoSection.tsx
    - website/app/page.tsx

key-decisions:
  - "Click-to-load pattern: iframe only loads when user clicks poster"
  - "Storylane embed URL format: app.storylane.io/demo/{demoId}?embed=inline"
  - "Placeholder demo ID via NEXT_PUBLIC_STORYLANE_DEMO_ID env var"
  - "Tab state managed in DemoSection with video as default"
  - "Green theme for interactive poster (vs orange for video)"

patterns-established:
  - "iframe lazy loading: poster overlay with click handler, conditional iframe render"
  - "Fullscreen modal: fixed overlay with stopPropagation on content"

# Metrics
duration: 4min
completed: 2026-02-02
---

# Phase 18 Plan 03: Interactive Demo Integration Summary

**Tab-based demo section with Storylane interactive embed, lazy iframe loading, and fullscreen modal for immersive experience**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-02T18:57:28Z
- **Completed:** 2026-02-02T19:01:06Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created InteractiveDemo component with click-to-load Storylane iframe (136 lines)
- Added video/interactive tab switcher to DemoSection with Hebrew labels
- Integrated DemoSection into homepage after testimonials section
- Implemented fullscreen modal for immersive demo experience

## Task Commits

Each task was committed atomically:

1. **Task 1: Create InteractiveDemo component with lazy iframe** - `666ed1e` (feat)
2. **Task 2: Update DemoSection with tabs for Lottie and Interactive** - `16015dd` (feat)
3. **Task 3: Integrate DemoSection into homepage** - `81c9204` (feat)

## Files Created/Modified

- `website/components/sections/demo/InteractiveDemo.tsx` - Lazy-loaded Storylane iframe with fullscreen modal
- `website/components/sections/demo/DemoSection.tsx` - Tab interface for video/interactive switching
- `website/public/images/interactive-demo-poster.svg` - Green-themed poster for interactive demo
- `website/app/page.tsx` - DemoSection integration after testimonials

## Decisions Made

1. **Click-to-load pattern** - iframe only mounts when user clicks poster, not on page load (performance)
2. **Storylane URL format** - `https://app.storylane.io/demo/{demoId}?embed=inline` for inline embed mode
3. **Placeholder ID via env var** - `NEXT_PUBLIC_STORYLANE_DEMO_ID` allows easy configuration without code changes
4. **Tab default to video** - Most users expect video first; interactive is opt-in for more engaged visitors
5. **Green theme for interactive poster** - Visual differentiation from orange video poster; green suggests "action/try"
6. **DemoSection position** - After testimonials, before video testimonial (proof -> try -> more proof flow)

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

**Storylane interactive demo requires configuration.**

To enable the interactive demo:

1. Create Storylane account at https://www.storylane.io
2. Create Findo demo walkthrough in Storylane Dashboard
3. Get demo ID from Share -> Website Embed URL
4. Set environment variable: `NEXT_PUBLIC_STORYLANE_DEMO_ID=your-demo-id`

Until configured, the interactive tab will show a placeholder that won't load an actual demo.

## Next Phase Readiness

- Demo section complete with both video and interactive options
- Ready for 18-04 (Micro-interactions & Polish) - already completed
- Ready for 18-05 (UAT Verification)
- Note: PLACEHOLDER_DEMO_ID needs replacement with real Storylane ID before production

---
*Phase: 18-emotional-journey-demo*
*Completed: 2026-02-02*
