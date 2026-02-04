# Phase 24: Micro-Interactions - Research

**Researched:** 2026-02-04
**Domain:** CSS Micro-Interactions, Hover/Press States, Link Underlines, Error Feedback, RTL Support
**Confidence:** HIGH

## Summary

This phase adds sophisticated hover and interaction states to all interactive elements (buttons, cards, links, inputs) to give the interface a "snappy & precise" feel as specified in CONTEXT.md. The research confirms CSS-first micro-interactions using `transform` and `opacity` provide 60fps performance on budget devices like Galaxy A24, while Motion handles stateful animations through `whileHover`/`whileTap`.

The key insight from user decisions: **shadow-lift is the primary button hover effect, NOT scale** (except icon buttons and hero CTA). This means translateY + increased shadow on hover, scale 0.98 + reduced shadow on press. Cards lift -4px with shadow increase. Links use the `transform-origin`/`scaleX` technique for animated underlines that grow from center outward (RTL: reverse origin). Error states use subtle shake (2px translateX, 2 oscillations) plus red glow pulse.

The project already has foundations: Phase 22's glow system (`--glow-cta`, `--shadow-hover`), the `AnimatedButton` component with Motion, and CSS timing variables (`--transition-timing-out`, `--transition-duration-200`). This phase extends these systematically with new keyframes for shake/error animations and utility classes for link underlines.

**Primary recommendation:** Implement micro-interactions via CSS utilities and keyframes in globals.css, using existing CSS variables for consistency. Use Motion's `whileHover`/`whileTap` for buttons that need shadow-lift behavior (since boxShadow animation requires JS). Apply GPU-accelerated properties only (transform, opacity, box-shadow). Create utility classes for link underlines with RTL support via `start`/`end` Tailwind utilities.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.x | Transition utilities, `start/end` RTL support | Already in project; `transition-*`, `ease-*`, `duration-*` |
| CSS Keyframes | N/A | Shake animation, error pulse | Pure CSS, GPU-accelerated when using transform |
| Motion | 12.x | `whileHover`/`whileTap` for button shadow-lift | Already in project; handles boxShadow string animations |
| CSS Custom Properties | N/A | Timing, shadow, glow variables | Already established in Phase 22 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `prefers-reduced-motion` | N/A | Accessibility compliance | Disable shake/pulse for users who prefer reduced motion |
| `@media (hover: hover)` | N/A | Touch device detection | Skip hover states on touch-only devices |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS keyframes shake | Motion shake | CSS is lighter for simple animations; Motion overkill |
| transform-origin underline | background-size technique | transform-origin is more performant (no repaint) |
| CSS transitions | Motion for everything | CSS transitions for simple states; Motion for complex |

**Installation:**
No additional packages needed - all features available with existing dependencies.

## Architecture Patterns

### Recommended Project Structure
```
website/
├── app/
│   └── globals.css           # Micro-interaction keyframes, utilities
├── components/
│   ├── ui/
│   │   ├── button.tsx        # Shadow-lift variant, press feedback
│   │   ├── card.tsx          # Already has lift; verify values
│   │   ├── input.tsx         # Add error shake, focus glow (exists)
│   │   └── link.tsx          # NEW: AnimatedLink with underline
│   └── molecules/
│       └── FormField.tsx     # Wire error shake to validation
├── lib/
│   └── animation.ts          # Add shake/error animation variants
```

### Pattern 1: Shadow-Lift Button Hover (Motion)
**What:** Buttons lift on hover via translateY + shadow increase, press scales down + reduces shadow
**When to use:** All buttons except disabled; hero CTA can add 1.02 scale
**Example:**
```tsx
// Source: CONTEXT.md decisions + Motion docs
// components/ui/button.tsx

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, glow, loading = false, children, ...props }, ref) => {
    return (
      <m.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, glow, loading, className }))}
        disabled={loading || props.disabled}
        // Shadow-lift on hover (not scale for standard buttons)
        whileHover={{
          y: -1,
          boxShadow: "var(--shadow-hover)",
        }}
        // Press: scale down + reduce shadow
        whileTap={{
          scale: 0.98,
          boxShadow: "var(--shadow-elevation-medium)",
        }}
        transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }} // ease-out, fast
        {...props}
      >
        {children}
      </m.button>
    );
  }
);

// Icon button variant can use scale
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...props }, ref) => (
    <m.button
      ref={ref}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </m.button>
  )
);
```

### Pattern 2: Animated Link Underline (CSS)
**What:** Underline scales in from center (or from start in RTL)
**When to use:** Inline links (not nav links)
**Example:**
```css
/* Source: Tobias Ahlin's technique + RTL adaptation */
/* globals.css */

.link-underline {
  position: relative;
  text-decoration: none;
}

.link-underline::after {
  content: "";
  position: absolute;
  bottom: -2px;
  /* Use inset-inline-start for RTL support */
  inset-inline-start: 50%;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  transition: transform var(--transition-duration-200) var(--transition-timing-out);
}

.link-underline:hover::after,
.link-underline:focus-visible::after {
  transform: translateX(-50%) scaleX(1);
}

/* Variant: slide from start (left in LTR, right in RTL) */
.link-underline-slide::after {
  inset-inline-start: 0;
  transform: scaleX(0);
  transform-origin: inline-start; /* CSS Logical property */
}

.link-underline-slide:hover::after {
  transform: scaleX(1);
}
```

### Pattern 3: Error Shake Animation (CSS Keyframes)
**What:** Subtle horizontal shake for error feedback
**When to use:** Form validation errors (blocking errors only, per CONTEXT.md)
**Example:**
```css
/* Source: CSS-Tricks + CONTEXT.md decisions (2px amplitude, 2 oscillations) */
/* globals.css */

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-2px);
  }
  40%, 80% {
    transform: translateX(2px);
  }
}

@keyframes error-glow-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 hsl(var(--destructive) / 0.4);
  }
  50% {
    box-shadow: 0 0 8px 4px hsl(var(--destructive) / 0.2);
  }
}

.shake {
  animation: shake 0.3s ease-in-out;
}

.error-shake {
  animation:
    shake 0.3s ease-in-out,
    error-glow-pulse 0.6s ease-in-out;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .shake,
  .error-shake {
    animation: none;
  }
}
```

### Pattern 4: Input Focus Glow Enhancement
**What:** Box-shadow glow on focus with 4px spread
**When to use:** All form inputs
**Example:**
```tsx
// Source: Phase 22 + CONTEXT.md (already partially implemented)
// Enhance existing input.tsx

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3",
          // Focus glow with 4px spread (per requirements)
          "focus-visible:shadow-[0_0_0_4px_hsl(var(--ring)_/_0.1)]",
          "focus-visible:border-ring",
          "transition-[box-shadow,border-color] duration-200 ease-out",
          // Error state styling
          error && "border-destructive focus-visible:border-destructive",
          error && "focus-visible:shadow-[0_0_0_4px_hsl(var(--destructive)_/_0.15)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Pattern 5: Card Lift (Already Implemented)
**What:** Cards lift -4px on hover with shadow increase
**When to use:** Feature cards, testimonials, any clickable card
**Example:**
```tsx
// Source: Existing AnimatedCard in card.tsx - verify values match requirements
// Already implemented correctly:
// - y: -4 (matches MICRO-03)
// - boxShadow: "var(--shadow-hover)" (shadow increase)
// - springGentle transition

// Just verify in card.tsx that values match:
whileHover={{
  y: -4,  // Correct per MICRO-03
  boxShadow: "var(--shadow-hover)",
}}
```

### Anti-Patterns to Avoid
- **Scale for all buttons:** CONTEXT.md explicitly says shadow-lift is primary; scale only for icon buttons and hero CTA
- **Using margin/top/left for shake:** Always use `transform: translateX()` for GPU acceleration
- **Animating width for underlines:** Use `scaleX()` with transform-origin; width causes reflow
- **Linear easing:** All transitions must use cubic-bezier (ease-out recommended for enter)
- **Instant hovers:** All hover states need 150-200ms duration per CONTEXT.md
- **Ignoring disabled state:** Disabled buttons must have NO hover effect + cursor: not-allowed
- **Same shake for all errors:** Graduate by severity (inline hint vs blocking error)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Link underline animation | border-bottom + width | transform-origin + scaleX | scaleX is GPU-accelerated; width causes reflow |
| Button press feedback | Manual state tracking | Motion whileTap | Handles touch vs mouse, accessibility |
| Shake on error | setTimeout + className | CSS animation + animationend event | Cleaner, handles multiple triggers correctly |
| RTL underline direction | Manual dir detection | transform-origin: inline-start | CSS Logical Properties handle RTL automatically |
| Reduced motion | Manual JS check | @media (prefers-reduced-motion) | Browser handles it; CSS cascade |

**Key insight:** For micro-interactions, CSS is usually sufficient and more performant than JS. Use Motion only when you need to animate complex properties like `boxShadow` or need state-aware animations (whileHover/whileTap). CSS handles transform/opacity transitions perfectly.

## Common Pitfalls

### Pitfall 1: Animating Layout Properties
**What goes wrong:** Janky, low-fps animations, especially on mobile
**Why it happens:** Using width, height, margin, top/left triggers layout recalculation
**How to avoid:** Stick to transform (translate, scale, rotate) and opacity
**Warning signs:** Animations feel "sticky"; Chrome DevTools shows red paint rectangles

### Pitfall 2: Hover on Touch Devices
**What goes wrong:** Hover states "stick" on tap, confusing users
**Why it happens:** Touch devices simulate hover on first tap
**How to avoid:** Use `@media (hover: hover)` to target only hover-capable devices; or accept sticky hover as feedback
**Warning signs:** Mobile users report buttons staying "highlighted"

### Pitfall 3: Shake Animation Won't Re-trigger
**What goes wrong:** Shake only works once, then element ignores errors
**Why it happens:** CSS animation doesn't restart when class is already present
**How to avoid:** Remove class, force reflow, re-add class; or use JS animationend event
**Warning signs:** First validation error shakes, subsequent ones don't
```js
// Fix: trigger reflow
element.classList.remove('shake');
void element.offsetWidth; // Force reflow
element.classList.add('shake');
```

### Pitfall 4: Motion Re-renders on Every Hover
**What goes wrong:** Performance issues with many animated elements
**Why it happens:** Motion component re-renders on gesture state change
**How to avoid:** Use `React.memo` for animated components; keep animation values stable (not inline objects)
**Warning signs:** High CPU usage on hover; React DevTools shows frequent re-renders

### Pitfall 5: Underline Jumps in RTL
**What goes wrong:** Underline animates from wrong direction in RTL layouts
**Why it happens:** Using `left` instead of CSS Logical Properties
**How to avoid:** Use `inset-inline-start` and `transform-origin: inline-start`
**Warning signs:** Hebrew users report underlines feeling "backwards"

### Pitfall 6: Focus States Missing for Keyboard Users
**What goes wrong:** Keyboard users can't see which element is focused
**Why it happens:** Only styling :hover, not :focus-visible
**How to avoid:** Always pair :hover with :focus-visible for interactive elements
**Warning signs:** Tab navigation shows no visible focus; accessibility audit fails

### Pitfall 7: Glow Intensification Too Subtle
**What goes wrong:** CTA glow on hover looks identical to idle state
**Why it happens:** Glow increase is too small (less than 20%)
**How to avoid:** Per CONTEXT.md: +8-12px spread, +0.1 opacity on hover
**Warning signs:** Users don't notice CTA "inviting" them on hover

## Code Examples

Verified patterns from official sources:

### Complete Micro-Interaction CSS (globals.css)
```css
/* Source: Research synthesis + CONTEXT.md decisions */
/* ============================================
 * MICRO-INTERACTIONS - Phase 24
 * Snappy & precise feel (150-200ms)
 * ============================================ */

/* ----- Link Underlines ----- */

.link-underline {
  position: relative;
  text-decoration: none;
  transition: color var(--transition-duration-150) var(--transition-timing-out);
}

.link-underline::after {
  content: "";
  position: absolute;
  bottom: -2px;
  inset-inline-start: 0;
  inset-inline-end: 0;
  height: 1.5px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--transition-duration-200) var(--transition-timing-out);
}

.link-underline:hover::after,
.link-underline:focus-visible::after {
  transform: scaleX(1);
}

/* Brightness increase on hover */
.link-underline:hover {
  filter: brightness(1.1);
}

/* ----- Error Shake Animation ----- */

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-2px); }
  40%, 80% { transform: translateX(2px); }
}

@keyframes error-pulse {
  0%, 100% { box-shadow: 0 0 0 0 hsl(var(--destructive) / 0.4); }
  50% { box-shadow: 0 0 8px 4px hsl(var(--destructive) / 0.2); }
}

/* Inline hint: color only */
.error-hint {
  border-color: hsl(var(--destructive));
}

/* Field validation: gentle pulse */
.error-gentle {
  animation: error-pulse 0.6s ease-in-out;
}

/* Blocking error: shake + glow */
.error-shake {
  animation:
    shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97),
    error-pulse 0.6s ease-in-out;
}

/* ----- Accessibility: Reduced Motion ----- */

@media (prefers-reduced-motion: reduce) {
  .link-underline::after {
    transition: none;
    transform: scaleX(1);
    opacity: 0;
  }

  .link-underline:hover::after,
  .link-underline:focus-visible::after {
    opacity: 1;
  }

  .error-gentle,
  .error-shake {
    animation: none;
    /* Fallback: immediate color change */
    border-color: hsl(var(--destructive));
    box-shadow: 0 0 0 2px hsl(var(--destructive) / 0.2);
  }
}

/* ----- Touch Device Handling ----- */

@media (hover: none) {
  /* On touch devices, show underline immediately (no animation) */
  .link-underline::after {
    transform: scaleX(1);
    opacity: 0.5;
  }
}
```

### AnimatedButton with Shadow-Lift
```tsx
// Source: CONTEXT.md + Motion docs
// components/ui/button.tsx

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, glow, loading = false, children, ...props }, ref) => {
    const isDisabled = loading || props.disabled;

    return (
      <m.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, glow, loading, className }),
          isDisabled && "cursor-not-allowed"
        )}
        disabled={isDisabled}
        // No animations when disabled
        whileHover={isDisabled ? {} : {
          y: -1,
          boxShadow: "var(--shadow-hover)",
        }}
        whileTap={isDisabled ? {} : {
          scale: 0.98,
          boxShadow: "var(--shadow-elevation-medium)",
        }}
        transition={{
          duration: 0.15,
          ease: [0, 0, 0.2, 1], // ease-out
        }}
        {...props}
      >
        {children}
      </m.button>
    );
  }
);

// Hero CTA variant - can use scale
const HeroCTAButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, ...props }, ref) => (
    <AnimatedButton
      ref={ref}
      glow="cta"
      whileHover={{
        scale: 1.02,
        y: -1,
        boxShadow: "var(--glow-cta-intense), var(--shadow-cta)",
      }}
      {...props}
    >
      {children}
    </AnimatedButton>
  )
);
```

### Input with Error Shake Hook
```tsx
// Source: Research synthesis
// hooks/useShake.ts

import { useCallback, useRef } from 'react';

export function useShake() {
  const elementRef = useRef<HTMLElement>(null);

  const triggerShake = useCallback((severity: 'hint' | 'gentle' | 'blocking' = 'gentle') => {
    const element = elementRef.current;
    if (!element) return;

    // Remove previous animation
    element.classList.remove('error-hint', 'error-gentle', 'error-shake');

    // Force reflow to restart animation
    void element.offsetWidth;

    // Apply severity-appropriate class
    const className = severity === 'hint' ? 'error-hint'
                    : severity === 'blocking' ? 'error-shake'
                    : 'error-gentle';
    element.classList.add(className);

    // Clean up after animation
    const cleanup = () => {
      element.classList.remove(className);
      element.removeEventListener('animationend', cleanup);
    };
    element.addEventListener('animationend', cleanup);
  }, []);

  return { elementRef, triggerShake };
}
```

### AnimatedLink Component
```tsx
// Source: Research synthesis
// components/ui/link.tsx

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps extends React.ComponentProps<typeof Link> {
  /** Underline animation style */
  underline?: "center" | "slide" | "none";
  /** External link indicator */
  external?: boolean;
}

const AnimatedLink = React.forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ className, underline = "center", external, children, ...props }, ref) => {
    const underlineClass = underline === "center" ? "link-underline"
                         : underline === "slide" ? "link-underline-slide"
                         : "";

    return (
      <Link
        ref={ref}
        className={cn(
          "text-foreground inline-flex items-center gap-1",
          underlineClass,
          className
        )}
        {...(external && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...props}
      >
        {children}
        {external && (
          <span className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            {/* Arrow icon */}
          </span>
        )}
      </Link>
    );
  }
);

AnimatedLink.displayName = "AnimatedLink";
export { AnimatedLink };
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| scale(1.05) on all buttons | Shadow-lift as primary hover | 2024+ | More physical, satisfying feel |
| border-bottom for underlines | transform-origin scaleX | 2020+ | GPU-accelerated, no layout shift |
| margin-left shake | translateX shake | 2018+ | 60fps on mobile |
| fixed left/right in CSS | CSS Logical Properties | 2023+ | RTL support built-in |
| :hover only | :hover + :focus-visible | 2021+ | Keyboard accessibility |
| 300ms transitions | 150-200ms transitions | 2023+ | Snappier, more responsive feel |

**Deprecated/outdated:**
- **margin/padding animations**: Always use transform
- **jQuery hover effects**: Use CSS or Motion
- **:focus without :focus-visible**: Shows focus ring on click (bad UX)

## Open Questions

Things that couldn't be fully resolved:

1. **Exact cubic-bezier for "snappy" feel**
   - What we know: ease-out (0, 0, 0.2, 1) recommended for enters
   - What's unclear: Exact values for optimal "Linear/Stripe" personality
   - Recommendation: Start with `--transition-timing-out`, tune visually

2. **Nav link hover treatment**
   - What we know: CONTEXT.md says "different treatment" - background fill or indicator
   - What's unclear: Which approach better fits Findo's brand
   - Recommendation: Try background fill first (more common), evaluate

3. **Performance impact of many animated buttons**
   - What we know: Motion creates new render layer per animated element
   - What's unclear: At what count does this impact Galaxy A24 performance
   - Recommendation: Test with 10+ buttons on page; consider CSS-only for simple cases

4. **Button group collision on scale**
   - What we know: CONTEXT.md says no scale for button groups
   - What's unclear: Exact gap needed if scale is accidentally applied
   - Recommendation: Add gap-2 to button groups as safety

## Sources

### Primary (HIGH confidence)
- [Motion React Gestures](https://motion.dev/docs/react-gestures) - whileHover/whileTap API
- [Josh W. Comeau: CSS Transitions](https://www.joshwcomeau.com/animation/css-transitions/) - Timing, easing best practices
- [Tobias Ahlin: Animating Underlines](https://tobiasahlin.com/blog/css-trick-animating-link-underlines/) - transform-origin technique
- [CSS-Tricks: Shake Animation](https://css-tricks.com/snippets/css/shake-css-keyframe-animation/) - translateX shake pattern
- Phase 22 Research - Shadow system, glow variables
- Phase 24 CONTEXT.md - User decisions on button behavior, error severity

### Secondary (MEDIUM confidence)
- [SitePoint: 60fps Mobile Animations](https://www.sitepoint.com/achieve-60-fps-mobile-animations-with-css3/) - Performance optimization
- [CSS-Tricks: Glowing Input Highlights](https://css-tricks.com/snippets/css/glowing-blue-input-highlights/) - Focus glow pattern
- [UX Collective: Better Focus Effects](https://uxdesign.cc/create-better-accessible-focus-effects-75a3de27b8ba) - Accessibility + box-shadow

### Tertiary (LOW confidence)
- Various blog posts on micro-interaction trends 2026 - General guidance only

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already in project; patterns verified against Motion/CSS docs
- Architecture: HIGH - Patterns align with existing button.tsx, card.tsx structure
- Pitfalls: HIGH - Performance issues confirmed via research; RTL issues are known
- Link underlines: HIGH - Tobias Ahlin's technique is well-established
- Error shake: MEDIUM - Exact amplitude (2px) from CONTEXT.md; timing may need tuning
- Nav link hover: LOW - CONTEXT.md defers to Claude's discretion

**Research date:** 2026-02-04
**Valid until:** 90 days (CSS/Motion APIs stable; micro-interaction patterns established)
