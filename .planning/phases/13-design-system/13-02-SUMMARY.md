---
phase: 13-design-system
plan: 02
subsystem: ui
tags: [next-themes, tailwind4, dark-mode, design-tokens, css-variables, shadcn-ui]

# Dependency graph
requires:
  - phase: 12-technical-foundation
    provides: "Next.js 16 with Tailwind 4.0 CSS-first configuration"
provides:
  - Dark mode theming with next-themes (dark default)
  - Complete design tokens (typography, colors, spacing, radii, shadows)
  - HSL color system compatible with shadcn/ui
  - Orange primary color (#f97316) for conversion-optimized CTAs
affects:
  - 13-03-animation-variants (uses color tokens for animations)
  - 14-hero-section (uses typography scale and colors)
  - all-future-ui-phases (establishes visual foundation)

# Tech tracking
tech-stack:
  added:
    - next-themes ^0.4.6
  patterns:
    - "@custom-variant dark for Tailwind 4 dark mode"
    - "HSL color variables in :root and .dark for theme switching"
    - "suppressHydrationWarning on html element for SSR-safe theming"

key-files:
  created:
    - website/providers/ThemeProvider.tsx
  modified:
    - website/package.json
    - website/app/providers.tsx
    - website/app/layout.tsx
    - website/app/globals.css

key-decisions:
  - "Orange primary (#f97316) chosen for conversion-optimized CTAs"
  - "HSL color format for shadcn/ui compatibility"
  - "Provider order: DirectionProvider > ThemeProvider > MotionProvider > SmoothScroll"

patterns-established:
  - "ThemeProvider wraps app with dark default, class attribute, enableSystem"
  - "Design tokens in @theme block with semantic color references"
  - "Light mode in :root, dark mode in .dark class"

# Metrics
duration: 12min
completed: 2026-02-01
---

# Phase 13 Plan 02: Theme and Design Tokens Summary

**Dark mode theming with next-themes (dark default) and comprehensive Tailwind 4.0 design tokens including orange primary CTA color, WCAG-compliant typography scale, and HSL color system**

## Performance

- **Duration:** 12 min
- **Started:** 2026-02-01T00:28:00Z
- **Completed:** 2026-02-01T00:40:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Installed next-themes ^0.4.6 for dark/light mode switching with dark as default
- Created ThemeProvider with SSR-safe configuration (attribute="class", enableSystem)
- Established complete typography scale (12px-72px) with 16px+ body text for WCAG
- Defined comprehensive color palette with orange primary (#f97316) for CTAs
- Added HSL color system compatible with shadcn/ui components
- Created spacing scale (4px-384px) and border radius tokens (8-12px for buttons/cards)
- Added animation timing functions including bounce and spring for playful character

## Task Commits

Each task was committed atomically:

1. **Task 1: Install next-themes and create ThemeProvider** - `0c42599` (feat)
2. **Task 2: Create comprehensive design tokens in globals.css** - `ccd5282` (feat)
3. **Fix: Integrate ThemeProvider in provider chain** - `1a4d854` (fix)

## Files Created/Modified

- `website/providers/ThemeProvider.tsx` - Theme provider with dark default, class attribute
- `website/package.json` - Added next-themes dependency
- `website/app/providers.tsx` - Added ThemeProvider to provider chain
- `website/app/layout.tsx` - Added suppressHydrationWarning for SSR safety
- `website/app/globals.css` - Complete design tokens with color palette, typography, spacing

## Decisions Made

1. **Orange primary color (#f97316):** Chosen for conversion-optimized CTAs - proven high conversion rate, high contrast in both modes, energetic and approachable
2. **HSL color format:** Used for shadcn/ui compatibility - enables seamless integration with shadcn/ui components
3. **Provider nesting order:** DirectionProvider > ThemeProvider > MotionProvider > SmoothScroll - RTL outermost, theme before motion for consistent initial state
4. **Typography scale:** 16px base minimum - WCAG compliance for body text accessibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing provider integration in initial commit**
- **Found during:** Verification step
- **Issue:** Task 1 commit only included package.json and ThemeProvider.tsx, missing providers.tsx and layout.tsx changes
- **Fix:** Created separate fix commit with provider chain integration and suppressHydrationWarning
- **Files modified:** website/app/providers.tsx, website/app/layout.tsx
- **Verification:** Build passes, ThemeProvider in chain, suppressHydrationWarning present
- **Committed in:** 1a4d854

---

**Total deviations:** 1 auto-fixed (blocking)
**Impact on plan:** Fix was necessary for complete implementation. No scope creep.

## Issues Encountered

- **Memory issues during build:** Node.js ran out of memory during initial build. Resolved by adding `NODE_OPTIONS=--max_old_space_size=4096` for builds.
- **pnpm background install:** pnpm add commands ran in background and didn't complete properly. Switched to npm install which succeeded.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Theme foundation complete with dark mode default
- Color tokens ready for component styling
- Typography scale ready for text components
- Animation timing tokens ready for Phase 13-03 animation variants
- All builds passing

---
*Phase: 13-design-system*
*Completed: 2026-02-01*
