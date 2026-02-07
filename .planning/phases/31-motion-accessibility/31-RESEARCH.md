# Phase 31: Motion & Accessibility - Research

**Researched:** 2026-02-06
**Domain:** CSS animation easing, Motion library reduced motion, WCAG accessibility, shimmer border effects
**Confidence:** HIGH

## Summary

This phase implements a complete motion system (easing curves, animation timing, shimmer border effects) and accessibility layer (skip links, keyboard navigation, focus states, reduced motion support) for the Findo website. The codebase already has solid foundations in place from previous phases.

**What was researched:**
1. CSS easing curves with the `linear()` function for spring-like animations
2. Motion library's `useReducedMotion` hook and accessibility patterns
3. WCAG 2.2 focus indicator requirements (2.4.7 and 2.4.13)
4. Shimmer/rotating border effects using CSS `conic-gradient` and `@property`
5. Skip-to-content link implementation patterns
6. Touch target size requirements (48px minimum per WCAG)

**Standard approach:** Extend existing `lib/animation.ts` with new easing CSS variables, create a shimmer border component using CSS `@property` for animating gradient rotation, and implement accessibility layer components (SkipLink, enhanced focus states, reduced motion hooks).

**Primary recommendation:** Define all easing curves as CSS custom properties in `globals.css` for consistency, use the existing `useReducedMotion` hook from Motion library for conditional animation behavior, and implement shimmer borders using CSS `@property` with `conic-gradient` for GPU-accelerated rotation.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `motion/react` | 12.29.2 | Spring animations, useReducedMotion hook | Already in codebase, provides accessibility utilities |
| `tailwindcss` | 4.x | CSS utilities, design tokens | Already configured with @theme variables |
| CSS `@property` | Native | Animate custom properties for shimmer | GPU-accelerated, no JS needed |
| CSS `prefers-reduced-motion` | Native | OS-level motion preference | Standard accessibility approach |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `gsap` | 3.14.2 | Complex scroll-triggered animations | Already used for hero entrance |
| CSS `linear()` function | Native | Spring-like easing without JS | For CSS-only transitions |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `@property` shimmer | JS-based rotation | JS adds bundle size, CSS is more performant |
| Motion useReducedMotion | Custom hook | Motion hook already imported, well-tested |
| CSS focus-visible | JS focus detection | CSS is more reliable, no JS needed |

**Installation:**
No additional packages needed - all dependencies already in place.

## Architecture Patterns

### Recommended Project Structure
```
lib/
  animation.ts            # Spring presets (existing) + new easing exports
app/
  globals.css             # @theme easing variables, focus-ring, shimmer keyframes
components/
  ui/
    skip-link.tsx         # NEW: Skip-to-content accessibility component
    card.tsx              # EXTEND: Add ShimmerCard variant
  motion/
    variants.ts           # EXTEND: Add reducedMotionVariants
```

### Pattern 1: CSS Custom Property Easing Curves
**What:** Define easing curves as CSS variables in @theme for consistent animation feel
**When to use:** All CSS transitions and animations that need standardized timing
**Example:**
```css
/* Source: CSS linear() function + Linear design inspiration */
@theme {
  /* Standard - smooth ease-out for most UI */
  --ease-standard: cubic-bezier(0.33, 1, 0.68, 1);

  /* Bouncy - Linear-style overshoot (for interactive elements) */
  --ease-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Material - Google Material Design ease */
  --ease-material: cubic-bezier(0.4, 0, 0.2, 1);

  /* Quick-press - snappy for micro-interactions */
  --ease-quick-press: cubic-bezier(0, 0, 0.2, 1);

  /* Timing tokens */
  --duration-hover: 150ms;    /* Hover animations */
  --duration-reveal: 400ms;   /* Scroll reveals */
}
```

### Pattern 2: Shimmer Border with CSS @property
**What:** Rotating gradient border effect using CSS custom property animation
**When to use:** Hero cards, featured elements requiring premium visual treatment
**Example:**
```css
/* Source: https://ishu.dev/post/create-moving-border-animation-in-css-using-conic-gradient */
@property --shimmer-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes shimmer-rotate {
  0% { --shimmer-angle: 0deg; }
  100% { --shimmer-angle: 360deg; }
}

.shimmer-border {
  position: relative;
  border-radius: 1rem;
  background: var(--color-card);
}

.shimmer-border::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: calc(1rem + 2px);
  background: conic-gradient(
    from var(--shimmer-angle),
    hsl(var(--primary)),
    transparent 25%,
    transparent 75%,
    hsl(var(--primary))
  );
  z-index: -1;
  animation: shimmer-rotate 1.5s linear infinite;
  animation-delay: 3s; /* Per MOTION-04: 3s delay */
}

/* Reduced motion: disable shimmer */
@media (prefers-reduced-motion: reduce) {
  .shimmer-border::before {
    animation: none;
    background: hsl(var(--primary) / 0.3);
  }
}
```

### Pattern 3: Skip-to-Content Link
**What:** First focusable element that jumps to main content
**When to use:** All pages - required for WCAG compliance
**Example:**
```typescript
// Source: WebAIM skip navigation + WCAG 2.1 AA requirements
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        // Positioned off-screen by default
        "sr-only focus:not-sr-only",
        // Visible styles on focus
        "focus:fixed focus:top-4 focus:inset-x-4 focus:z-[100]",
        "focus:flex focus:justify-center",
        // Visual styling
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-lg",
        "font-medium text-sm",
        // Focus ring
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
    >
      דלג לתוכן הראשי
    </a>
  );
}
```

### Pattern 4: Reduced Motion Variants
**What:** Alternative animation variants for users with motion sensitivity
**When to use:** All Motion-based animations
**Example:**
```typescript
// Source: Motion.dev accessibility docs + CONTEXT.md decisions
import { useReducedMotion, Variants } from "motion/react";

// Fade-only variant (no transform movement)
export const reducedMotionReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15 }, // 150ms per CONTEXT.md
  },
};

// In component:
const prefersReducedMotion = useReducedMotion();
const variants = prefersReducedMotion ? reducedMotionReveal : fadeInRise;
```

### Pattern 5: Focus-Visible Ring (WCAG Compliant)
**What:** 2px outline ring visible only on keyboard navigation
**When to use:** All interactive elements
**Example:**
```css
/* Source: Sara Soueidan focus indicators guide + WCAG 2.4.7/2.4.13 */
/* Already partially in globals.css - needs enhancement */
:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Utility class for complex focus states */
.focus-ring {
  @apply focus-visible:outline-none;
  @apply focus-visible:ring-2 focus-visible:ring-primary;
  @apply focus-visible:ring-offset-2 focus-visible:ring-offset-background;
}
```

### Anti-Patterns to Avoid
- **Animating layout properties:** NEVER animate width, height, margin, padding (use transform/opacity only per MOTION-08)
- **Removing focus indicators:** NEVER hide focus states globally (violates WCAG 2.4.7)
- **Ignoring reduced motion:** NEVER forget prefers-reduced-motion check (required for accessibility)
- **Using :focus instead of :focus-visible:** Shows focus ring on mouse clicks (annoying for mouse users)
- **Shimmer on all cards:** Reserve for hero/featured elements only (per CONTEXT.md)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced motion detection | window.matchMedia hook | `useReducedMotion()` from motion/react | Already imported, handles SSR correctly |
| Focus-visible polyfill | Custom JS detection | Native CSS `:focus-visible` | 97%+ browser support, no JS needed |
| Spring easing | JS-based spring physics | Motion spring presets or CSS cubic-bezier | JS adds bundle, CSS works fine for hover |
| Skip link visibility | Custom show/hide logic | `sr-only focus:not-sr-only` | Tailwind pattern, well-tested |
| Gradient rotation | requestAnimationFrame | CSS @property animation | GPU-accelerated, no JS bundle cost |

**Key insight:** The existing motion system (`lib/animation.ts`, `components/motion/`) provides solid patterns. Extend rather than replace. Use CSS for what CSS does best (transitions, keyframes) and Motion for what it does best (gesture-aware physics springs).

## Common Pitfalls

### Pitfall 1: @property Browser Support
**What goes wrong:** CSS `@property` not supported in older browsers (Safari < 15.4)
**Why it happens:** Relatively new CSS feature
**How to avoid:** Provide fallback with static gradient border for unsupported browsers
**Warning signs:** Shimmer works in Chrome but not Safari
```css
/* Fallback for @property */
@supports not (font: -apple-system-body) {
  .shimmer-border::before {
    background: linear-gradient(hsl(var(--primary)), transparent);
    /* Static gradient, no animation */
  }
}
```

### Pitfall 2: Reduced Motion Breaks Functionality
**What goes wrong:** Disabling all animations breaks UI feedback (loading states, success confirmations)
**Why it happens:** Over-aggressive reduced-motion implementation
**How to avoid:** Per CONTEXT.md: "Essential loops only - loading spinners allowed, decorative loops disabled"
**Warning signs:** Users don't know if button click worked
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable decorative animations */
  .shimmer-border::before { animation: none; }

  /* Keep essential feedback (loading spinners) */
  .animate-spin { /* Keep spinning */ }
}
```

### Pitfall 3: Focus Ring Contrast on Dark Backgrounds
**What goes wrong:** Primary orange focus ring invisible on dark cards
**Why it happens:** Single-color ring doesn't work on all backgrounds
**How to avoid:** Use double-ring technique with offset for universal visibility
**Warning signs:** Focus state invisible on certain UI elements
```css
/* Per Sara Soueidan: universal focus ring */
:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
  /* Additional offset creates visible gap */
}
```

### Pitfall 4: Skip Link Not First in Tab Order
**What goes wrong:** Skip link is buried in navigation, users tab through menu first
**Why it happens:** Skip link placed after other focusable elements
**How to avoid:** Skip link MUST be first child inside <body>
**Warning signs:** Tab order shows logo/nav before skip link

### Pitfall 5: Touch Targets Too Small on Mobile
**What goes wrong:** Interactive elements under 48px are hard to tap
**Why it happens:** Desktop-first sizing, buttons inherit small size
**How to avoid:** All interactive elements minimum 48x48px touch target (use padding if needed)
**Warning signs:** Users miss taps, rage clicks
```css
/* Ensure minimum touch target */
button, a {
  min-height: 48px;
  min-width: 48px;
  /* Or use padding to expand tap area */
}
```

### Pitfall 6: Shimmer Animation Performance
**What goes wrong:** Shimmer causes jank, battery drain
**Why it happens:** Multiple animated gradients, not GPU-accelerated
**How to avoid:** Use CSS @property (GPU-accelerated), limit to hero only
**Warning signs:** Frame drops on scroll, hot device
```css
/* GPU acceleration via will-change */
.shimmer-border::before {
  will-change: transform;
  transform: translateZ(0);
}
```

## Code Examples

Verified patterns from official sources and existing codebase:

### CSS Easing Variables (MOTION-01)
```css
/* Source: Josh Comeau linear() function + Linear design inspiration */
@theme {
  /* Standard - smooth ease-out for general UI */
  --ease-standard: cubic-bezier(0.33, 1, 0.68, 1);

  /* Bouncy - Linear-style slight overshoot */
  --ease-bouncy: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Material - Google Material Design */
  --ease-material: cubic-bezier(0.4, 0, 0.2, 1);

  /* Quick-press - snappy micro-interactions (150ms) */
  --ease-quick-press: cubic-bezier(0, 0, 0.2, 1);

  /* Duration tokens */
  --duration-hover: 150ms;      /* MOTION-02: Hover 150-200ms */
  --duration-hover-max: 200ms;
  --duration-reveal: 400ms;     /* MOTION-03: Reveal 300-500ms */
  --duration-reveal-max: 500ms;
  --duration-shimmer: 1.5s;     /* MOTION-04: Shimmer 1.5s */
  --delay-shimmer: 3s;          /* MOTION-04: 3s delay */
}
```

### Shimmer Border Component (MOTION-04, MOTION-05)
```typescript
// Source: CSS @property animation pattern
import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Disable shimmer animation */
  noShimmer?: boolean;
}

const ShimmerCard = React.forwardRef<HTMLDivElement, ShimmerCardProps>(
  ({ className, noShimmer = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl p-8",
        "bg-card text-card-foreground",
        // Shimmer border effect (hero only per CONTEXT.md)
        !noShimmer && "shimmer-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ShimmerCard.displayName = "ShimmerCard";

export { ShimmerCard };
```

### Link Underline Animation (MOTION-07)
```css
/* Source: Existing globals.css pattern - verify conformance */
/* Already implemented - ensure scaleX with transform-origin */
.link-underline::after {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  inset-inline-end: 0;
  bottom: 0;
  height: 1px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: center; /* Scale from center per MOTION-07 */
  transition: transform var(--duration-hover) var(--ease-quick-press);
}

.link-underline:hover::after {
  transform: scaleX(1);
}
```

### Skip-to-Content Link (A11Y-01)
```typescript
// Source: WebAIM + A11Y Collective best practices
"use client";

import { cn } from "@/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        // Off-screen by default (not display:none for SR access)
        "sr-only focus:not-sr-only",
        // On focus: fixed position, high z-index
        "focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[100]",
        // Visual styling
        "bg-primary text-primary-foreground",
        "px-6 py-3 rounded-lg",
        "font-semibold text-sm",
        // Focus ring
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // Ensure 48px minimum touch target
        "min-h-[48px] flex items-center"
      )}
    >
      {/* Hebrew: "Skip to main content" */}
      דלג לתוכן הראשי
    </a>
  );
}
```

### Enhanced Focus States (A11Y-02)
```css
/* Source: WCAG 2.4.7 + 2.4.13 + Sara Soueidan guide */
/* Extend existing :focus-visible in globals.css */
:focus-visible {
  /* 2px ring per CONTEXT.md decision */
  outline: 2px solid hsl(var(--primary)); /* Primary accent color */
  outline-offset: 2px; /* 2px offset per CONTEXT.md */
}

/* Utility for components needing custom focus */
.focus-ring-custom {
  @apply focus-visible:outline-none;
  @apply focus-visible:ring-2 focus-visible:ring-primary;
  @apply focus-visible:ring-offset-2 focus-visible:ring-offset-background;
}

/* Ensure focus ring visible on dark backgrounds */
.dark .focus-visible,
.dark :focus-visible {
  /* Primary orange has sufficient contrast (4.5:1+) on dark bg */
  outline-color: hsl(var(--primary));
}
```

### Reduced Motion Implementation (A11Y-03)
```css
/* Source: Existing globals.css - verify completeness */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* EXCEPTION: Keep essential UI feedback */
  /* Loading spinners allowed per CONTEXT.md */
  .animate-spin {
    animation-duration: 1s !important;
    animation-iteration-count: infinite !important;
  }

  /* Shimmer completely disabled per CONTEXT.md */
  .shimmer-border::before {
    animation: none !important;
    background: hsl(var(--primary) / 0.2); /* Static fallback */
  }

  /* Scroll reveals: fade only, no movement */
  [data-motion] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

### Touch Target Minimum Size (A11Y-06)
```css
/* Source: WCAG 2.5.5 Target Size (Enhanced) */
/* Ensure all interactive elements meet 48px minimum */
button,
[role="button"],
a[href],
input[type="checkbox"],
input[type="radio"],
.interactive {
  min-height: 48px;
  min-width: 48px;
}

/* For inline links, use padding to expand touch area */
a.inline-link {
  padding: 8px 0; /* Vertical padding expands tap area */
  margin: -8px 0; /* Negative margin maintains visual position */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| cubic-bezier only | CSS linear() function | 2023 | Spring-like curves possible in pure CSS |
| :focus for all | :focus-visible | 2020+ | Focus ring only on keyboard navigation |
| JS matchMedia for motion | CSS prefers-reduced-motion | 2019 | No JS needed for reduced motion |
| border-image gradients | conic-gradient + @property | 2021+ | Works with border-radius, animatable |
| display:none skip links | sr-only + focus:not-sr-only | Standard | Screen readers can still access |

**Deprecated/outdated:**
- `outline: none` on buttons: Violates WCAG 2.4.7 - never remove focus indicators
- JavaScript-based reduced motion: Use CSS media query + Motion hook
- Multiple animation libraries: Consolidate on Motion + GSAP (already done)

## Open Questions

Things that couldn't be fully resolved:

1. **Exact shimmer gradient colors**
   - What we know: CONTEXT.md says "Primary accent gradient colors for brand-consistent shimmer"
   - What's unclear: Whether to use pure orange or orange-to-amber gradient
   - Recommendation: Start with `hsl(var(--primary))` to `transparent`, tune visually

2. **Keyboard navigation path documentation (A11Y-04)**
   - What we know: Need to "test and document" the path
   - What's unclear: Format for documentation (markdown? code comments?)
   - Recommendation: Create `docs/keyboard-navigation.md` with section-by-section tab order

3. **WCAG AA+ contrast verification method (A11Y-05)**
   - What we know: Need to verify all text/background combinations
   - What's unclear: Manual audit vs automated tooling
   - Recommendation: Use Lighthouse accessibility audit + spot-check with color contrast checker

## Sources

### Primary (HIGH confidence)
- Existing codebase: `website/lib/animation.ts` - spring presets already defined
- Existing codebase: `website/app/globals.css` - reduced motion, focus states partially implemented
- Existing codebase: `website/components/motion/SectionReveal.tsx` - useReducedMotion pattern
- [Motion.dev useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) - Hook API
- [WCAG 2.2 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) - 2.4.7 requirements

### Secondary (MEDIUM confidence)
- [Josh Comeau linear() function](https://www.joshwcomeau.com/animation/linear-timing-function/) - Spring CSS curves
- [Sara Soueidan focus indicators](https://www.sarasoueidan.com/blog/focus-indicators/) - WCAG-conformant focus design
- [Animated gradient borders](https://ibelick.com/blog/create-animated-gradient-borders-with-css) - @property technique
- [WebAIM Skip Navigation](https://webaim.org/techniques/skipnav/) - Skip link patterns
- [Conic gradient borders](https://ishu.dev/post/create-moving-border-animation-in-css-using-conic-gradient) - Shimmer rotation

### Tertiary (LOW confidence)
- Linear design system references: Limited official documentation, inferred from screenshots/demos

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in codebase, well-documented
- Architecture patterns: HIGH - Extend existing patterns, verified approaches
- Easing values: MEDIUM - Based on design inspiration, needs visual tuning
- Shimmer implementation: MEDIUM - CSS @property has browser support considerations
- Accessibility patterns: HIGH - WCAG standards are clear, existing partial implementation

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days - stable CSS specs, Motion library stable)
