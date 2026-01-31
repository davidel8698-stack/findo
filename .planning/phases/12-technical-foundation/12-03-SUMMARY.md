---
phase: 12-technical-foundation
plan: 03
subsystem: animation-infrastructure
tags: [font, heebo, motion, gsap, lenis, smooth-scroll, rtl]
dependency-graph:
  requires: ["12-01", "12-02"]
  provides: ["heebo-font", "motion-lazymotion", "gsap-config", "lenis-smooth-scroll"]
  affects: ["13-*", "14-*"]
tech-stack:
  added: ["motion@12.29.2", "gsap@3.14.2", "@gsap/react@2.1.2", "lenis@1.3.17"]
  patterns: ["centralized-gsap-config", "lazy-motion-tree-shaking", "lenis-gsap-sync"]
key-files:
  created:
    - website/lib/gsapConfig.ts
    - website/providers/MotionProvider.tsx
    - website/components/SmoothScroll.tsx
  modified:
    - website/app/layout.tsx
    - website/app/globals.css
    - website/app/providers.tsx
    - website/package.json
decisions:
  - id: radix-react19-fix
    choice: "Upgrade @radix-ui/react-direction to RC version"
    rationale: "1.1.1 has createContext bug with React 19, RC 1.1.2 fixes it"
    outcome: "Build passes, DirectionProvider works correctly"
metrics:
  duration: 6m 43s
  completed: 2026-01-31
---

# Phase 12 Plan 03: Font & Animation Config Summary

**One-liner:** Heebo Hebrew font with preload optimization, Motion LazyMotion for 4.6KB bundle, centralized GSAP config, Lenis smooth scroll synced with ScrollTrigger.

## What Was Built

### 1. Heebo Font Configuration
- Next.js font optimization with `next/font/google`
- Hebrew subset only (smaller download)
- `font-display: swap` prevents FOUT
- Weights 400, 500, 700 for typography needs
- CSS variable `--font-heebo` for Tailwind integration
- Preload enabled in document head

### 2. Animation Library Stack
| Library | Version | Purpose | Bundle Impact |
|---------|---------|---------|---------------|
| motion | 12.29.2 | Declarative animations | 4.6KB (LazyMotion) |
| gsap | 3.14.2 | Scroll-triggered animations | Tree-shakeable |
| @gsap/react | 2.1.2 | React hooks for GSAP | Minimal |
| lenis | 1.3.17 | Smooth scroll | 2.8KB |

### 3. Centralized GSAP Configuration
```typescript
// website/lib/gsapConfig.ts
gsap.registerPlugin(ScrollTrigger, useGSAP);
export { gsap, ScrollTrigger, useGSAP };
```
- Single registration point prevents warnings
- SSR-safe with `typeof window` check
- All imports go through this file

### 4. Provider Architecture
```
DirectionProvider (RTL context - outermost)
  └── MotionProvider (LazyMotion tree-shaking)
        └── SmoothScroll (Lenis + GSAP sync - innermost)
              └── {children}
```

### 5. Lenis-GSAP Integration
- `lenis.on("scroll", ScrollTrigger.update)` syncs scroll position
- GSAP ticker controls Lenis RAF for frame-perfect timing
- Lag smoothing disabled for responsive feel

## Commits

| Hash | Type | Description |
|------|------|-------------|
| b579a90 | feat | Configure Heebo Hebrew font with next/font optimization |
| 5fc26a5 | feat | Install animation libraries and create GSAP config |
| 27d7029 | feat | Create Motion LazyMotion provider for tree-shaking |
| c26d818 | feat | Create Lenis smooth scroll with GSAP integration |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed @radix-ui/react-direction React 19 compatibility**
- **Found during:** Task 1 build verification
- **Issue:** `createContext is not a function` error during SSR
- **Fix:** Upgraded from 1.1.1 to 1.1.2-rc.1766004502650
- **Files modified:** website/package.json, website/package-lock.json
- **Commit:** b579a90

**2. [Rule 3 - Blocking] Used existing Providers component**
- **Found during:** Task 1 execution
- **Issue:** Plan assumed DirectionProvider in layout.tsx, but 12-02 created app/providers.tsx
- **Fix:** Integrated MotionProvider and SmoothScroll into existing Providers component
- **Files modified:** website/app/providers.tsx
- **Commits:** 27d7029, c26d818

## Verification Results

| Check | Status |
|-------|--------|
| Build completes successfully | PASS |
| Heebo font import in layout.tsx | PASS |
| gsap.registerPlugin in gsapConfig.ts | PASS |
| LazyMotion in MotionProvider.tsx | PASS |
| lenis.on scroll sync in SmoothScroll.tsx | PASS |
| Provider nesting order correct | PASS |
| No SSR errors | PASS |

## Key Patterns Established

1. **Font loading:** Always use `next/font` with subset and swap
2. **GSAP imports:** Always import from `@/lib/gsapConfig`, never from "gsap"
3. **Provider order:** DirectionProvider must be outermost for RTL
4. **Animation bundle:** Use LazyMotion with domAnimation for minimal bundle

## Next Phase Readiness

**Dependencies satisfied:**
- Heebo font available via `--font-heebo` CSS variable
- Motion components can use `m.*` from motion/react
- GSAP ScrollTrigger ready for scroll animations
- Lenis smooth scroll active on all pages

**Ready for:**
- Phase 13: Design system tokens can use Heebo font
- Phase 14: Hero animations can use GSAP + Motion
- Phase 17: Scroll-triggered animations ready
