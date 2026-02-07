---
phase: 28-design-foundation
plan: 01
subsystem: ui
tags: [design-tokens, css-variables, tailwind, linear-design-system, color-system]

# Dependency graph
requires:
  - phase: 21-background-system
    provides: BackgroundDepth component foundation
provides:
  - Semantic color token system (bg, surface, text, accent, status, border, glow)
  - Glass effect formula tokens
  - Heebo font weight extensions (600, 800)
  - Linear #08090A background implementation
affects: [29-layout-grid, 30-component-library, 31-motion-system]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Semantic color token naming (--color-{category}-{variant})
    - CSS variable-based theming in @theme block
    - Inline style for semantic token consumption

key-files:
  created: []
  modified:
    - website/app/globals.css
    - website/app/layout.tsx
    - website/components/background/BackgroundDepth.tsx

key-decisions:
  - "Used inline style for BackgroundDepth to avoid Tailwind double-prefix (bg-bg-primary)"
  - "Glass tokens split between @theme (blur values) and :root (rgba effect formulas)"
  - "Maintained backward compatibility with existing color tokens"

patterns-established:
  - "Semantic color tokens: --color-bg-*, --color-text-*, --color-accent-*, --color-status-*, --color-border-*, --color-glow-*"
  - "Glass effect formula: 5% white bg, 20px blur, 8% white border"
  - "Surface hierarchy: bg-primary (#08090A) -> surface-1 -> surface-2 -> elevated"

# Metrics
duration: 12min
completed: 2026-02-05
---

# Phase 28 Plan 01: Semantic Color Token System Summary

**Linear Design System color foundation with 5-level surface hierarchy, 5-level text hierarchy, accent states, status colors, border variants, and glass effect tokens**

## Performance

- **Duration:** 12 min
- **Started:** 2026-02-05T10:00:00Z
- **Completed:** 2026-02-05T10:12:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Extended Heebo font with weights 600 (semibold) and 800 (extrabold) for full typography system
- Created complete semantic color token vocabulary in globals.css @theme block
- Implemented Linear #08090A background via var(--color-bg-primary) in BackgroundDepth
- Added glass effect formula tokens for consistent glassmorphism

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Heebo font weights 600 and 800** - `c7f88a4` (feat)
2. **Task 2: Create semantic color tokens in @theme** - Included in prior commits (tokens present)
3. **Task 3: Apply #08090A background to BackgroundDepth** - `c36a6c3` (feat)

## Files Created/Modified

- `website/app/layout.tsx` - Extended Heebo font weights to [400, 500, 600, 700, 800]
- `website/app/globals.css` - Added semantic color tokens in @theme block + glass effect tokens in :root
- `website/components/background/BackgroundDepth.tsx` - Updated Layer 0 to use var(--color-bg-primary)

## Token Reference

### Background/Surface Hierarchy
```css
--color-bg-primary: #08090A;      /* Main background */
--color-bg-surface-1: #0F1011;    /* Cards, sections */
--color-bg-surface-2: #151516;    /* Elevated surfaces */
--color-bg-elevated: #1A1B1C;     /* Modals, popovers */
```

### Text Hierarchy
```css
--color-text-primary: #FAFAFA;    /* Headings */
--color-text-secondary: #A1A1AA;  /* Body text */
--color-text-tertiary: #71717A;   /* Captions */
--color-text-muted: #52525B;      /* Placeholders */
--color-text-disabled: #3F3F46;   /* Disabled */
```

### Accent States
```css
--color-accent-primary: #F97316;  /* CTAs, links */
--color-accent-hover: #FB923C;    /* Hover */
--color-accent-active: #EA580C;   /* Active/pressed */
```

### Status Colors
```css
--color-status-success: #22C55E;
--color-status-warning: #EAB308;
--color-status-error: #EF4444;
--color-status-info: #3B82F6;
```

### Border Colors
```css
--color-border-default: rgba(255, 255, 255, 0.1);
--color-border-subtle: rgba(255, 255, 255, 0.06);
--color-border-strong: rgba(255, 255, 255, 0.15);
```

### Glow Tokens
```css
--color-glow-15: rgba(249, 115, 22, 0.15);
--color-glow-20: rgba(249, 115, 22, 0.2);
--color-glow-30: rgba(249, 115, 22, 0.3);
```

### Glass Effect Formula
```css
--effect-glass-bg: rgba(255, 255, 255, 0.05);
--effect-glass-border: rgba(255, 255, 255, 0.08);
--effect-glass-blur: 20px;
--color-surface-glass: rgba(255, 255, 255, 0.05);
```

## Decisions Made

1. **Inline style for BackgroundDepth** - Used `style={{ backgroundColor: 'var(--color-bg-primary)' }}` instead of Tailwind utility to avoid double-prefix issue with `bg-bg-primary`
2. **Token split** - Glass blur values in @theme for Tailwind utility generation, rgba formulas in :root for direct CSS variable use
3. **Backward compatibility** - All existing color tokens preserved; new semantic tokens added alongside

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- **Build cache issues** - OneDrive sync caused intermittent build failures due to lock file contention. Resolved by killing stuck node processes and clearing .next directory.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Color token system complete and ready for component library (Phase 30)
- Typography tokens (28-02) can now reference color tokens for consistent theming
- All tokens available as CSS variables for both Tailwind utilities and direct CSS use

---
*Phase: 28-design-foundation*
*Completed: 2026-02-05*
