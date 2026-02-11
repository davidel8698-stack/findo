# Inspection Report: TextJourneySection Rebuild

> Inspector: INSPECTOR agent
> Date: 2026-02-11
> Build status: PASS (Next.js 16.1.6 Turbopack)

---

## Checklist Results

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | No GSAP | PASS | Zero GSAP imports in entire text-journey directory. Verified via grep. |
| 2 | No excessive inline styles | PASS | Only inline style is `style={{ '--line-index': index }}` on `<p>` elements for CSS custom property stagger. This is explicitly allowed by the architecture spec. |
| 3 | Apple-level CSS restraint | PASS | No shimmer, no breathing glow, no pseudo-elements, no gradient text, no scale transforms, no text-shadow, no drop-shadow. Transitions use 0.7s ease-out. Blur max 2px. translateY max 20px. |
| 4 | RTL support | PASS | `direction: rtl` set on `.section` in CSS module. |
| 5 | Responsive breakpoints | PASS | All 4 breakpoints present: 1199px (tablet), 767px (mobile), 480px (small mobile). Desktop is default. Values match TYPOGRAPHY-SPEC.md exactly. |
| 6 | Reduced motion | PASS (fixed) | `@media (prefers-reduced-motion: reduce)` present. **Fix applied**: added `.line` reset to reduced-motion query after line stagger was added. |
| 7 | TypeScript | PASS | Clean types throughout. `ScrollFadeResult`, `TextBlockProps`, `JourneyBlockData` all properly typed. No `any`, no unused imports. |
| 8 | Semantic HTML | PASS | `<section>` for container, `<div>` for blocks, `<p>` for lines. Correct hierarchy. |
| 9 | Content accuracy | PASS | All 7 blocks present (6 normal + 1 resolution) with correct Hebrew text matching ARCHITECTURE.md exactly: hook, pain, confusion, problem, mismatch, tease, resolution. |
| 10 | Hook correctness | PASS | IntersectionObserver with `rootMargin: "-20% 0px -20% 0px"`, `threshold: 0`. Proper cleanup via `observer.disconnect()` in useEffect return. Also handles prefers-reduced-motion in JS. |
| 11 | Class-based animation | PASS | `.block` -> `.block.visible` toggling via `isVisible` boolean from hook. No continuous progress tracking. |
| 12 | Export chain | PASS | `index.ts` exports `TextJourneySection` -> imported in `website/app/page.tsx` as `@/components/sections/text-journey`. Build confirms successful resolution. |

---

## Fixes Applied

### Fix 1: Missing line stagger CSS (text-journey.module.css)

**Problem**: The architecture spec defines per-line stagger animation using `--line-index` CSS custom property. TextBlock.tsx correctly sets `style={{ '--line-index': index }}` on each `<p>`, but the CSS module had no rules consuming this property. The stagger had no visual effect.

**Fix**: Added line-level opacity/transform transitions to `.line` with `transition-delay: calc(var(--line-index, 0) * 80ms)`, and a `.visible .line` rule to reveal lines when the parent block becomes visible.

**Rationale**: The architecture spec explicitly specifies this pattern in "Layer 2: TextBlock" section. This is line-level stagger (not word-level), consistent with the styles spec's prohibition against word-level animation.

### Fix 2: Reduced motion coverage for lines (text-journey.module.css)

**Problem**: After adding line stagger, the `prefers-reduced-motion` media query only reset `.block` properties but not `.line` properties, meaning lines would still animate even with reduced motion preference.

**Fix**: Added `.line` reset (opacity: 1, transform: none, transition: none) inside the reduced-motion media query.

---

## Architecture Observation (No Fix Needed)

The `useScrollFade` hook returns `hasExited` for a three-state machine (invisible -> visible -> exited), but `TextBlock` only destructures `{ ref, isVisible }` and ignores `hasExited`. This means blocks that scroll past the top of the viewport remain visible rather than fading out.

This is intentional and correct: the STYLES-SPEC defines only two visual states (`.block` and `.block.visible`) with no `.exited` class. The hook provides the exit state for potential future use, but the current design keeps blocks visible once revealed -- matching Apple's pattern where revealed content stays visible as you scroll past it.

---

## Final Verdict

**PASS** -- The TextJourneySection rebuild meets all specification requirements. Two minor CSS fixes were applied (line stagger + reduced motion coverage). Build compiles successfully. The implementation is clean, performant, and follows Apple-level restraint principles.

---

## File Summary

| File | Lines | Status |
|------|-------|--------|
| `useScrollFade.ts` | 57 | Clean |
| `TextBlock.tsx` | 35 | Clean |
| `TextJourneySection.tsx` | 64 | Clean |
| `text-journey.module.css` | 262 | Fixed (2 changes) |
| `index.ts` | 1 | Clean |
