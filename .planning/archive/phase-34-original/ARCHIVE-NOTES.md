# Phase 34 Original - TextJourneySection Archive

## Archived: 2026-02-11
## Reason: Over-engineered implementation replaced with Apple-level rebuild

---

## Issues with Original Implementation

### 1. Over-engineered GSAP ScrollTrigger
- Used GSAP ScrollTrigger (heavy library) for what amounts to simple fade-in/fade-out effects
- ScrollTrigger `scrub` mode creates continuous re-renders tied to scroll position
- Could be achieved with CSS `scroll-timeline` or lightweight IntersectionObserver

### 2. Word-level DOM splitting (splitIntoWords)
- Every line of text is split into individual `<span>` elements per word
- Creates excessive DOM nodes for no meaningful visual payoff
- Each word gets its own inline styles recalculated on every scroll frame
- `wordsWithIndices` and `lineGroups` useMemo chains add complexity for a simple word array

### 3. Complex calculateVisuals() math
- Elaborate math (Math.pow, distanceFromCenter) to compute opacity, blur, scale, and Y offset
- Produces a "spotlight" curve that could be a simple CSS opacity transition
- Returns 4 properties recalculated via useMemo on every progress change

### 4. Inline styles on every render
- Block element: `opacity`, `filter` (blur), `transform` (translateY + scale), `willChange`
- Each word element: `opacity`, `transform` (translateY)
- All recomputed from `progress` state on every scroll frame via `setProgress`
- `willChange` on every element is a performance anti-pattern when applied broadly

### 5. CSS bloat
- `shimmerText` keyframe animation: gradient text shimmer on resolution variant
- `breatheGlow` keyframe animation: pulsing glow effect on words
- Decorative dots (`"• • •"`) via ::before pseudo-element
- Decorative gradient lines via ::after pseudo-element on every block
- Multiple responsive breakpoints for decorative elements that add no value

### 6. State management overhead
- `progress` state updates on every scroll frame via `setProgress(self.progress)`
- Causes full React re-render cycle on each scroll tick
- `hasScrolled` boolean tracked redundantly alongside progress
- Should use refs for scroll-driven values to avoid re-renders

### 7. Resolution variant feels gimmicky
- Gradient text with shimmer animation (`background-size: 200%` cycling)
- Breathing glow with `text-shadow` and `drop-shadow` filter animation
- These effects feel more "template website" than premium/Apple-level

### 8. Unnecessary useMemo usage
- `wordsWithIndices` memoizes splitting a few short Hebrew strings into words
- `lineGroups` memoizes grouping those same words by line index
- Both are trivial computations that don't benefit from memoization
- `calculateVisuals` wrapped in useMemo but depends on `progress` which changes every frame

---

## Files Archived
- `JourneyBlock.tsx` - GSAP-based scroll block component (157 lines)
- `TextJourneySection.tsx` - Journey content mapper (55 lines)
- `text-journey.module.css` - Overloaded CSS styles (221 lines)
- `index.ts` - Barrel exports (2 lines)
