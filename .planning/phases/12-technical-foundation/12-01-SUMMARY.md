---
phase: 12-technical-foundation
plan: 01
subsystem: infra
tags: [nextjs, tailwindcss, typescript, react, app-router]

# Dependency graph
requires: []
provides:
  - Next.js 16 project with Turbopack
  - Tailwind CSS 4.0 with CSS-first configuration
  - TypeScript strict mode enabled
  - Mobile-first viewport configuration
  - App Router structure
affects: [12-02, 12-03, 13-design-system, 14-hero]

# Tech tracking
tech-stack:
  added: [next@16.1.6, react@19.2.3, tailwindcss@4, @tailwindcss/postcss, eslint@9]
  patterns: [css-first-tailwind, app-router, viewport-export]

key-files:
  created:
    - website/package.json
    - website/app/layout.tsx
    - website/app/page.tsx
    - website/app/globals.css
    - website/postcss.config.mjs
    - website/tsconfig.json
  modified: []

key-decisions:
  - "Next.js 16 instead of planned 15.5 - sales website has no API routes, so API stability concern does not apply"
  - "Tailwind 4.0 CSS-first with @theme blocks - no tailwind.config.ts needed"
  - "Viewport export pattern (Next.js 15+ API) for mobile-first MOBILE-01"

patterns-established:
  - "CSS-first Tailwind: Use @import 'tailwindcss' and @theme blocks, not tailwind.config.ts"
  - "Viewport export: Use separate viewport export for mobile meta tags"
  - "Mobile-first classes: Use base styles for mobile (p-6), sm: for tablet (sm:p-12), md: for desktop (md:p-24)"

# Metrics
duration: 5min
completed: 2026-01-31
---

# Phase 12 Plan 01: Technical Foundation Summary

**Next.js 16 with Turbopack, Tailwind CSS 4.0 CSS-first configuration, TypeScript strict mode, and mobile-first viewport setup**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-31T17:06:14Z
- **Completed:** 2026-01-31T17:11:04Z
- **Tasks:** 3
- **Files modified:** 17

## Accomplishments
- Next.js 16.1.6 project with React 19 and Turbopack
- Tailwind CSS 4.0 with CSS-first @theme configuration (no tailwind.config.ts)
- Mobile-first viewport meta with device-width and initialScale
- TypeScript strict mode enabled
- Test page with responsive Tailwind utilities

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Next.js project** - `e13a4dc` (feat)
2. **Task 2: Configure Tailwind 4.0 globals.css** - `07df4e9` (chore)
3. **Task 3: Add test page and viewport** - `96ca0ef` (feat)

## Files Created/Modified
- `website/package.json` - Project dependencies with Next.js 16, Tailwind 4.0, React 19
- `website/app/layout.tsx` - Root layout with viewport export and Hebrew lang
- `website/app/page.tsx` - Test page with mobile-first responsive classes
- `website/app/globals.css` - Tailwind CSS-first import with @theme placeholder
- `website/postcss.config.mjs` - @tailwindcss/postcss plugin configuration
- `website/tsconfig.json` - TypeScript strict mode enabled

## Decisions Made

1. **Next.js 16 instead of 15.5** - The plan specified 15.5 for API stability, but the sales website has no API routes (backend is v1.0). create-next-app now defaults to v16 with React 19 and improved Turbopack.

2. **No src/ directory** - create-next-app v16 defaults to `app/` directly without `src/`. Plan specified `src/app/` but functionality is identical.

3. **Tailwind 4.0 pre-installed** - create-next-app now includes Tailwind 4.0 with CSS-first setup, so Task 2 was simplified to just cleaning up globals.css.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used Next.js 16 instead of 15.5**
- **Found during:** Task 1 (Project creation)
- **Issue:** create-next-app@latest now installs Next.js 16.1.6, not 15.5
- **Fix:** Proceeded with v16 since sales website has no API routes (the v15.5 decision was for API access stability which doesn't apply here)
- **Files modified:** website/package.json
- **Verification:** Build passes, all features work
- **Committed in:** e13a4dc

**2. [Rule 3 - Blocking] Used app/ instead of src/app/**
- **Found during:** Task 1 (Project creation)
- **Issue:** create-next-app v16 defaults to app/ directly, not src/app/
- **Fix:** Proceeded with app/ structure as functionality is identical
- **Files modified:** All app files in website/app/ instead of website/src/app/
- **Verification:** Build passes, structure works correctly
- **Committed in:** e13a4dc

---

**Total deviations:** 2 auto-fixed (blocking - newer tooling defaults)
**Impact on plan:** Both changes are improvements from newer create-next-app. No functional impact.

## Issues Encountered
- Lockfile warning from Turbopack about multiple lockfiles (pnpm-lock.yaml in project root, package-lock.json in website/) - cosmetic warning, doesn't affect build

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Technical foundation complete and building successfully
- Ready for Plan 12-02 (RTL support and Hebrew configuration)
- Ready for Plan 12-03 (Heebo font and animation libraries)

---
*Phase: 12-technical-foundation*
*Completed: 2026-01-31*
