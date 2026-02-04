# Phase 25: Animation Choreography - Research

**Researched:** 2026-02-04
**Domain:** Hero Entrance Animation, Scroll-Triggered Reveals, GSAP Timelines, Motion React, Stats Counters
**Confidence:** HIGH

## Summary

This phase implements orchestrated entrance sequences and scroll-triggered reveals per CONTEXT.md decisions. The research confirms the existing two-library strategy (Motion for React components, GSAP for complex timelines) is the correct approach. GSAP's timeline position parameters enable the ~30% overlap choreography specified for hero entrance. Motion's `useInView` + `staggerChildren` handles scroll-triggered section reveals elegantly.

The project already has solid animation foundations from Phase 24: spring presets in `lib/animation.ts`, variants in `components/motion/variants.ts`, `ScrollReveal` and `StaggerContainer` components, and existing `SocialProofCounters` with spring-based counting. This phase extends these with hero entrance choreography, section-specific reveal personalities, and comprehensive reduced-motion handling.

Key insight from CONTEXT.md: The hero entrance should feel "snappy and confident" (~1s total), with fade + subtle rise (20-30px) as the primary motion style. Phone mockup gets special treatment (40-60px rise, longer duration). Stats counter animation uses ease-out easing (fast start, slow landing) for "unified impact."

**Primary recommendation:** Use GSAP timeline for hero entrance orchestration (7-phase sequence with overlapping position parameters), Motion `useInView` + `staggerChildren` for scroll-triggered section reveals, and the existing Motion `useSpring` approach for stats counters (already implemented correctly). Implement reduced-motion via `gsap.matchMedia()` and Motion's built-in hooks.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.14.2 | Hero entrance timeline orchestration | Position parameters enable precise overlap timing; `gsap.matchMedia()` for accessibility |
| Motion | 12.29.2 | Scroll-triggered reveals, staggered children | `useInView`, `whileInView`, `staggerChildren` built-in; React-native integration |
| @gsap/react | 2.1.2 | `useGSAP` hook for React lifecycle | Automatic cleanup, context management |
| ScrollTrigger (GSAP) | 3.14.2 | Already registered | Scroll-based triggers for complex sequences |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lenis | 1.3.17 | Smooth scrolling | Already in project; enhances scroll animation feel |
| CSS Custom Properties | N/A | Timing variables | `--transition-timing-out`, `--transition-duration-*` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP timeline for hero | Motion orchestration | GSAP position parameters (`-=0.3s`) more intuitive for overlap; Motion's `staggerChildren` less precise for fixed-timing sequences |
| Motion useInView | GSAP ScrollTrigger | Motion simpler for basic reveal; GSAP better if callbacks/scrub needed |
| Custom counter | react-countup | Motion useSpring already implemented, integrates with design system |

**Installation:**
No additional packages needed - all features available with existing dependencies.

## Architecture Patterns

### Recommended Project Structure
```
website/
├── lib/
│   ├── animation.ts              # ADD: hero entrance variants, section personalities
│   └── gsapConfig.ts             # EXISTS: GSAP + ScrollTrigger registration
├── components/
│   └── motion/
│       ├── variants.ts           # ADD: section-specific reveal variants
│       ├── ScrollReveal.tsx      # EXISTS: enhance with threshold config
│       ├── StaggerContainer.tsx  # EXISTS: enhance with timing presets
│       └── HeroEntrance.tsx      # NEW: GSAP timeline orchestration wrapper
├── hooks/
│   └── useReducedMotion.ts       # NEW: centralized reduced motion detection
```

### Pattern 1: GSAP Timeline with Position Parameters for Hero Entrance
**What:** 7-phase hero entrance with ~30% overlap using negative position parameters
**When to use:** Hero section orchestrated entrance sequence
**Example:**
```typescript
// Source: GSAP timeline position parameter docs + CONTEXT.md timing
// components/sections/hero/HeroEntrance.tsx

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

interface HeroEntranceProps {
  children: React.ReactNode;
  reducedMotion?: boolean;
}

export function HeroEntrance({ children, reducedMotion }: HeroEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion || !containerRef.current) return;

    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out",
        duration: 0.5,
      },
    });

    // Phase 1: Background (0-300ms) - immediate start
    tl.fromTo(
      "[data-hero-bg]",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      0
    );

    // Phase 2: Navigation (200-500ms) - starts at 0.2s, overlaps bg
    tl.fromTo(
      "[data-hero-nav]",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3 },
      0.2
    );

    // Phase 3: Headline (300-800ms) - word-by-word or full
    tl.fromTo(
      "[data-hero-headline]",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      0.3
    );

    // Phase 4: Subheadline (600-900ms)
    tl.fromTo(
      "[data-hero-subheadline]",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3 },
      0.6
    );

    // Phase 5: CTAs (800-1100ms) - bounce easing
    tl.fromTo(
      "[data-hero-cta]",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.3 },
      0.8
    );

    // Phase 6: Phone mockup (500-1200ms) - special treatment, larger motion
    tl.fromTo(
      "[data-hero-mockup]",
      { y: 60, opacity: 0 },  // 40-60px per CONTEXT.md
      { y: 0, opacity: 1, duration: 0.7 },
      0.5
    );

    // Phase 7: Activity feed starts (1000ms+) - after hero mostly complete
    tl.add(() => {
      // Trigger activity feed animation via event or ref
      window.dispatchEvent(new CustomEvent('hero-entrance-complete'));
    }, 1.0);

  }, { scope: containerRef, dependencies: [reducedMotion] });

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
```

### Pattern 2: Motion Scroll Reveal with Section Personality
**What:** Different sections get different reveal animations (stats count, testimonials slide, features fade)
**When to use:** Per-section scroll-triggered reveals
**Example:**
```typescript
// Source: Motion useInView + CONTEXT.md section personalities
// components/motion/variants.ts - ADD section-specific variants

import { Variants } from "motion/react";
import { springGentle } from "@/lib/animation";

// Standard fade + rise (20-30px) per CONTEXT.md
export const fadeInRise: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...springGentle,
      staggerChildren: 0.075, // Fast cascade per CONTEXT.md
      delayChildren: 0.1,
    },
  },
};

// Testimonials: slide from alternating sides
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springGentle,
  },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springGentle,
  },
};

// Container for staggered children - fast cascade
export const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075, // 50-75ms per CONTEXT.md
      delayChildren: 0.1,
    },
  },
};
```

### Pattern 3: Stats Counter with Ease-Out (Already Implemented)
**What:** Numbers count up with fast start, slow landing
**When to use:** Stats section counters
**Example:**
```typescript
// Source: Existing SocialProofCounters.tsx - ALREADY CORRECT
// Uses Motion useSpring with stiffness:100, damping:30
// This matches CONTEXT.md ease-out behavior (fast→slow)

const springValue = useSpring(0, {
  stiffness: 100,  // Higher = faster initial acceleration
  damping: 30,     // Higher = faster deceleration
  restDelta: 0.001,
});

// Trigger when in view
useEffect(() => {
  if (isInView) {
    springValue.set(target); // From 0 to target
  }
}, [isInView, target, springValue]);
```

### Pattern 4: gsap.matchMedia() for Reduced Motion
**What:** Centralized accessibility handling that auto-reverts animations
**When to use:** All GSAP animations that need reduced-motion fallback
**Example:**
```typescript
// Source: GSAP matchMedia docs + CONTEXT.md reduced motion handling
// hooks/useReducedMotion.ts

"use client";

import { useState, useEffect } from "react";
import { gsap } from "@/lib/gsapConfig";

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reducedMotion;
}

// In GSAP animations, use gsap.matchMedia() for auto-revert:
// lib/gsapConfig.ts - ADD matchMedia setup

export function createResponsiveTimeline() {
  const mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 1024px)",
    isMobile: "(max-width: 1023px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
  }, (context) => {
    const { reduceMotion, isDesktop } = context.conditions!;

    if (reduceMotion) {
      // Opacity-only fallback per CONTEXT.md
      // Duration: 150-200ms
      gsap.to("[data-animate]", {
        opacity: 1,
        duration: 0.15,
      });
      return; // Skip complex animations
    }

    // Full animation for normal motion preference
    // ...
  });

  return mm;
}
```

### Pattern 5: RTL-Aware Slide Animations
**What:** Slide animations that respect document direction
**When to use:** Testimonials, any horizontal slide animations
**Example:**
```typescript
// Source: CSS Logical Properties + CONTEXT.md RTL requirements
// RTL: slide from "end" means slide from LEFT (since end is left in RTL)

// Option 1: Use CSS custom property for direction
// In globals.css:
// :root { --slide-direction: 1; }  /* LTR: positive = from right */
// [dir="rtl"] { --slide-direction: -1; } /* RTL: negative = from left */

// Option 2: Check direction in JS
function getSlideX(direction: 'start' | 'end', magnitude: number = 50): number {
  const isRTL = document.documentElement.dir === 'rtl';

  if (direction === 'end') {
    // "from end" = from right in LTR, from left in RTL
    return isRTL ? -magnitude : magnitude;
  } else {
    // "from start" = from left in LTR, from right in RTL
    return isRTL ? magnitude : -magnitude;
  }
}

// Usage in variants:
export const createSlideVariant = (direction: 'start' | 'end'): Variants => ({
  hidden: {
    opacity: 0,
    x: getSlideX(direction),
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springGentle,
  },
});
```

### Anti-Patterns to Avoid
- **Starting hero timeline before DOM ready:** Use `useGSAP` hook with scope for proper timing
- **Animating all hero elements simultaneously:** Hero loses visual hierarchy; use timeline with overlap
- **Fixed translateX values without RTL check:** `x: 50` wrong for RTL; use direction-aware calculation
- **Scroll reveal threshold too high:** 50%+ means animation often missed; use 20-30% per CONTEXT.md
- **Re-triggering scroll animations:** "Animate once only" per CONTEXT.md; set `once: true`
- **Heavy animations on mobile:** Use `gsap.matchMedia()` to simplify or disable on mobile if needed
- **Blocking initial render with animations:** Defer activity feed via `requestIdleCallback` (already done)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Timeline with overlap | Manual setTimeout chains | GSAP position params `-=0.3` | Auto-cleanup, precise timing, scrubbing support |
| Scroll-triggered reveal | IntersectionObserver + state | Motion `useInView` / `whileInView` | Built-in once, margin, amount options |
| Staggered children animation | Manual delay calculation | Motion `staggerChildren` | Declarative, variants-compatible |
| Counter animation | setInterval increment | Motion `useSpring` | Physics-based easing, smooth across frame rates |
| Reduced motion detection | Manual matchMedia | `gsap.matchMedia()` + `useReducedMotion` | Auto-revert, centralized logic |
| RTL animation direction | Hardcoded negative values | Direction-aware helper | Single source of truth for direction |

**Key insight:** GSAP excels at fixed-timing orchestration (hero entrance) while Motion excels at reactive/scroll-based animations. Don't force one to do the other's job.

## Common Pitfalls

### Pitfall 1: Hero Animation Runs Before Layout Complete
**What goes wrong:** Elements jump or flash as timeline starts mid-render
**Why it happens:** GSAP timeline starts immediately, but SSR hydration isn't complete
**How to avoid:** Use `useGSAP` hook with `scope` ref; add short delay if needed
**Warning signs:** Flash of unstyled content, elements jump on load

### Pitfall 2: Scroll Reveal Triggers Too Late
**What goes wrong:** User scrolls past element before animation starts
**Why it happens:** Default viewport threshold is 50% or higher
**How to avoid:** Set `amount: 0.2` (20-30% visible triggers) per CONTEXT.md; use negative `margin`
**Warning signs:** Fast scrollers miss animations entirely

### Pitfall 3: Stats Counter Jumps Instead of Animates
**What goes wrong:** Number snaps from 0 to final without smooth transition
**Why it happens:** Using setState directly instead of spring; or restDelta too high
**How to avoid:** Use `useSpring` with low restDelta (0.001); ensure `isInView` triggers only once
**Warning signs:** Numbers appear instantly when section enters view

### Pitfall 4: Testimonials Slide Wrong Direction in RTL
**What goes wrong:** "Slide from left" slides from left in both LTR and RTL
**Why it happens:** Hardcoded `x: -50` doesn't respect document direction
**How to avoid:** Use direction-aware helper or CSS logical properties approach
**Warning signs:** Hebrew users report animations feel "backwards"

### Pitfall 5: Activity Feed Blocks LCP
**What goes wrong:** Lighthouse flags hero text LCP as slow
**Why it happens:** GSAP timeline setup runs before first meaningful paint
**How to avoid:** Defer activity feed via `requestIdleCallback` (already implemented!)
**Warning signs:** LCP > 2.5s in Lighthouse; waterfall shows animation JS blocking

### Pitfall 6: Reduced Motion Ignored for GSAP Animations
**What goes wrong:** Users with vestibular disorders see full animations
**Why it happens:** GSAP doesn't auto-respect `prefers-reduced-motion`; only Motion does
**How to avoid:** Use `gsap.matchMedia()` with `reduceMotion` condition; skip timeline
**Warning signs:** Accessibility audit fails; user complaints about motion

### Pitfall 7: Stagger Creates Timing Gaps
**What goes wrong:** Long pauses between staggered elements feel sluggish
**Why it happens:** `staggerChildren` value too high (e.g., 0.3s)
**How to avoid:** Use fast cascade (50-75ms) per CONTEXT.md; total sequence under 0.5s for dense content
**Warning signs:** Animation feels "slow" or "old-fashioned"

## Code Examples

Verified patterns from official sources:

### Complete Hero Entrance Timeline
```typescript
// Source: GSAP docs + CONTEXT.md hero timing (0-1200ms total, ~30% overlap)
// components/sections/hero/useHeroEntrance.ts

"use client";

import { useRef, useCallback } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";

interface HeroEntranceConfig {
  enabled: boolean;
  onComplete?: () => void;
}

export function useHeroEntrance({ enabled, onComplete }: HeroEntranceConfig) {
  const scopeRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!enabled || !scopeRef.current) return;

    // Create matchMedia for responsive/accessibility
    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: "(prefers-reduced-motion: reduce)",
      standard: "(prefers-reduced-motion: no-preference)",
    }, (context) => {
      const { reduceMotion } = context.conditions!;

      if (reduceMotion) {
        // Reduced motion: opacity-only, 150-200ms per CONTEXT.md
        gsap.set("[data-hero-animate]", { opacity: 0 });
        gsap.to("[data-hero-animate]", {
          opacity: 1,
          duration: 0.15,
          stagger: 0.05,
          onComplete,
        });
        return;
      }

      // Full 7-phase hero entrance per CONTEXT.md
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete,
      });
      timelineRef.current = tl;

      // Initial state: everything invisible
      gsap.set("[data-hero-animate]", { opacity: 0 });

      // Phase 1: Background fade (0-300ms)
      tl.to("[data-hero-bg]", {
        opacity: 1,
        duration: 0.3,
      }, 0);

      // Phase 2: Nav slide down (200-500ms) - 200ms offset
      tl.fromTo("[data-hero-nav]",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        0.2
      );

      // Phase 3: Headline reveal (300-800ms)
      tl.fromTo("[data-hero-headline]",
        { y: 30, opacity: 0 },  // 20-30px rise per CONTEXT.md
        { y: 0, opacity: 1, duration: 0.5 },
        0.3
      );

      // Phase 4: Subheadline fade up (600-900ms)
      tl.fromTo("[data-hero-subheadline]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        0.6
      );

      // Phase 5: CTAs scale in with bounce (800-1100ms)
      tl.fromTo("[data-hero-cta]",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.3 },
        0.8
      );

      // Phase 6: Phone mockup (500-1200ms) - special treatment
      tl.fromTo("[data-hero-mockup]",
        { y: 60, opacity: 0 },  // 40-60px rise, longer duration
        { y: 0, opacity: 1, duration: 0.7 },
        0.5
      );

      // Phase 7: Activity feed trigger (1000ms+)
      tl.call(() => {
        window.dispatchEvent(new CustomEvent('hero-entrance-complete'));
      }, [], 1.0);
    });

    return () => mm.revert();
  }, { scope: scopeRef, dependencies: [enabled] });

  return { scopeRef, timelineRef };
}
```

### Scroll Reveal Section Component with Personality
```typescript
// Source: Motion docs + CONTEXT.md section personalities
// components/motion/SectionReveal.tsx

"use client";

import { type ReactNode } from "react";
import { m, type Variants, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SectionPersonality = 'fade' | 'slideFromSides' | 'scaleIn';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  personality?: SectionPersonality;
  /** Trigger threshold (0-1) - default 0.2 per CONTEXT.md */
  threshold?: number;
  /** Stagger delay between children (ms) - default 75ms per CONTEXT.md */
  staggerMs?: number;
}

const personalityVariants: Record<SectionPersonality, Variants> = {
  fade: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  },
  slideFromSides: {
    // Children will use alternating slide directions
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  },
};

// Reduced motion fallback: opacity-only, 150-200ms
const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

export function SectionReveal({
  children,
  className,
  personality = 'fade',
  threshold = 0.2,
  staggerMs = 75,
}: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0.05 : staggerMs / 1000,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,  // Per CONTEXT.md: animate once only
        amount: threshold,
        margin: "-50px",  // Trigger slightly before visible
      }}
      variants={containerVariants}
      className={cn(className)}
    >
      {children}
    </m.div>
  );
}

// Child component for section items
export function SectionRevealItem({
  children,
  className,
  personality = 'fade',
}: {
  children: ReactNode;
  className?: string;
  personality?: SectionPersonality;
}) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : personalityVariants[personality];

  return (
    <m.div variants={variants} className={cn(className)}>
      {children}
    </m.div>
  );
}
```

### Alternating Testimonial Slide
```typescript
// Source: CONTEXT.md + RTL-aware implementation
// components/sections/social-proof/TestimonialList.tsx

"use client";

import { m, type Variants, useReducedMotion } from "motion/react";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";
import { useDirection } from "@/hooks/useDirection";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

export function TestimonialList({ testimonials }: TestimonialListProps) {
  const prefersReducedMotion = useReducedMotion();
  const isRTL = useDirection() === 'rtl';

  // Create direction-aware slide variants
  const getSlideVariant = (index: number): Variants => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
      };
    }

    // Alternate sides: even from start, odd from end
    const fromStart = index % 2 === 0;
    // In RTL: start = right, end = left
    // In LTR: start = left, end = right
    const xOffset = fromStart
      ? (isRTL ? 50 : -50)  // from start
      : (isRTL ? -50 : 50); // from end

    return {
      hidden: { opacity: 0, x: xOffset },
      visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 },
      },
    };
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.075,  // Fast cascade per CONTEXT.md
        delayChildren: 0.1,
      },
    },
  };

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {testimonials.map((testimonial, index) => (
        <m.div key={testimonial.id} variants={getSlideVariant(index)}>
          <TestimonialCard {...testimonial} />
        </m.div>
      ))}
    </m.div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| setTimeout chains | GSAP timeline position params | 2020+ | Precise timing, auto-cleanup |
| Single entrance speed | ~1s "snappy" entrance | 2024+ | Users expect faster, more confident animations |
| Scroll-hijacking parallax | Scroll-triggered reveals | 2023+ | Less invasive, better accessibility |
| Arbitrary animation timing | 150-200ms micro, 300-500ms macro | 2025+ | Research-backed timing feels "premium" |
| Animate everything | GPU-only (transform, opacity) | 2022+ | 60fps on budget devices |
| Ignore reduced-motion | `gsap.matchMedia()` / Motion hooks | 2023+ | Required for accessibility compliance |

**Deprecated/outdated:**
- **requestAnimationFrame loops for counters**: Use physics-based springs (Motion useSpring)
- **IntersectionObserver boilerplate**: Motion's useInView handles this
- **CSS-only scroll animations**: Still limited browser support; GSAP/Motion more reliable
- **ScrollMagic library**: GSAP ScrollTrigger is the modern standard

## Open Questions

Things that couldn't be fully resolved:

1. **Exact cubic-bezier for "snappy & confident"**
   - What we know: ease-out family; `power2.out` / `[0, 0, 0.2, 1]` recommended
   - What's unclear: May need visual tuning for Findo's specific feel
   - Recommendation: Start with `power2.out` for GSAP, springGentle for Motion; tune visually

2. **Activity feed timing after hero**
   - What we know: Should start at 1000ms+ per CONTEXT.md
   - What's unclear: Exact coordination with GSAP timeline completion
   - Recommendation: Use custom event dispatch; activity feed listens for 'hero-entrance-complete'

3. **Word-by-word vs full headline animation**
   - What we know: CONTEXT.md says "word-by-word or letter-by-letter (300-800ms)"
   - What's unclear: Which is better for Hebrew text
   - Recommendation: Start with full headline animation; word-by-word adds complexity and may not benefit Hebrew

4. **Mobile parallax behavior**
   - What we know: Phase 23 says desktop-only (>1024px) for mouse parallax
   - What's unclear: Should scroll parallax also be desktop-only?
   - Recommendation: Keep scroll parallax on mobile (subtle); disable mouse parallax

## Sources

### Primary (HIGH confidence)
- [GSAP Timeline Position Parameters](https://gsap.com/community/position-parameter/) - Official GreenSock guide on `-=` syntax for overlap
- [GSAP gsap.matchMedia()](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()) - Accessibility and responsive animation handling
- [Motion useInView](https://www.framer.com/motion/use-in-view/) - Scroll-triggered state detection
- [Motion stagger](https://motion.dev/docs/stagger) - Stagger delay configuration
- Existing codebase: `lib/animation.ts`, `components/motion/variants.ts`, `SocialProofCounters.tsx`

### Secondary (MEDIUM confidence)
- [GSAP Timeline Orchestration Forum](https://gsap.com/community/forums/topic/40358-usegsap-with-advanced-timeline-orchestration/) - Community patterns
- [Framer Motion Staggered Animation](https://framermotionexamples.com/example/variants-staggered-animation) - staggerChildren example
- [Algolia Blog - 60fps Animations](https://www.algolia.com/blog/engineering/performant-web-animations/) - Performance best practices
- [Smashing Magazine - Respecting Motion Preferences](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/) - Accessibility patterns

### Tertiary (LOW confidence)
- Various 2026 blog posts on hero animation trends - General guidance only
- Forum discussions on scroll-trigger thresholds - May vary by use case

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - GSAP + Motion already in project; patterns verified against official docs
- Hero entrance timing: HIGH - GSAP position parameters well-documented; CONTEXT.md provides exact timing
- Scroll reveals: HIGH - Motion useInView/whileInView are standard; existing ScrollReveal component
- Stats counter: HIGH - Already implemented with useSpring; matches CONTEXT.md requirements
- RTL handling: MEDIUM - Direction detection straightforward; CSS logical properties not fully applicable to transforms
- Reduced motion: HIGH - gsap.matchMedia() + Motion useReducedMotion well-documented

**Research date:** 2026-02-04
**Valid until:** 90 days (GSAP 3.x and Motion 12.x APIs stable; choreography patterns established)
