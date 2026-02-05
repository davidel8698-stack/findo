# Phase 26: Glassmorphism & Section Upgrades - Research

**Researched:** 2026-02-05
**Domain:** CSS backdrop-filter, glassmorphism, performance optimization, Tailwind 4.0
**Confidence:** HIGH

## Summary

This phase applies strategic glassmorphism effects to specific card components (feature, stats, testimonials, navigation, contact form) while upgrading all 10 sections with the visual language established in Phases 20-25. The CONTEXT.md decisions lock in subtle blur (8-12px), semi-transparent backgrounds (15-25% opacity), and thin Apple-style borders (1px, 10-20% opacity).

The primary challenge is performance. Backdrop-filter is GPU-intensive (15-30ms per element on mid-range mobile devices like Galaxy A24 4G), requiring strict enforcement of the 6-8 glass elements per viewport budget. The escape hatch defined in STATE.md (solid backgrounds if Lighthouse drops below 95) provides a clear fallback path.

The existing codebase already has a `.glass` utility in globals.css (`bg-card/80 backdrop-blur-md`) and StickyCtaBar uses `backdrop-blur-md`. However, these need upgrading to match the CONTEXT.md specifications (8-12px blur, thinner borders, @supports fallback) and the rim lighting effect on AnimatedCard/Card should be replaced by glass treatment (not layered).

**Primary recommendation:** Create a reusable `GlassCard` component with configurable intensity (strong/light), proper @supports fallback, and viewport budget awareness. Replace existing rimLight with glass effects on designated cards only.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.0 | backdrop-blur-*, bg-*/opacity utilities | Native support, theme-aware |
| CSS @supports | Native | Feature detection for fallback | Browser standard, no JS needed |
| CSS custom properties | Native | Theme variables for glass intensity | Existing @theme system in globals.css |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion/react | Existing | Scroll-triggered nav glass transition | When nav becomes sticky/scrolled |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @supports CSS | JS detection | CSS is synchronous, no FOUC; JS requires hydration |
| Inline styles | CSS utility classes | Tailwind utilities are more maintainable |
| backdrop-blur-lg (16px) | backdrop-blur (8-12px) | CONTEXT.md specifies subtle 8-12px, not heavy |

**Installation:**
No new packages required - all utilities already available via Tailwind 4.0.

## Architecture Patterns

### Recommended Project Structure
```
website/components/
├── ui/
│   ├── card.tsx                   # Extend with GlassCard variant
│   └── glass-card.tsx             # (Optional) Separate file if Card gets too complex
├── sections/
│   └── [section-name]/            # Apply glass to specific cards within sections
└── motion/
    └── variants.ts                # Add scrolled nav glass transition variant
```

### Pattern 1: CSS @supports Fallback Pattern
**What:** Progressive enhancement using feature detection
**When to use:** All glass elements
**Example:**
```css
/* Source: MDN Web Docs + CONTEXT.md decisions */

/* Base styles (fallback) - solid dark background */
.glass-card {
  background-color: rgb(24 24 27 / 0.8); /* zinc-900/80 */
  border: 1px solid rgb(255 255 255 / 0.15); /* Stronger border without blur */
}

/* Enhanced styles when backdrop-filter supported */
@supports (backdrop-filter: blur(10px)) {
  .glass-card {
    background-color: rgb(24 24 27 / 0.2); /* Lower opacity with blur */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px); /* Safari */
    border: 1px solid rgb(255 255 255 / 0.1); /* Thinner with blur */
  }
}
```

### Pattern 2: Glass Intensity Variants
**What:** Different glass treatments for visual hierarchy
**When to use:** Feature cards (strong) vs Stats/Testimonials (light)
**Example:**
```tsx
// Source: CONTEXT.md decisions
interface GlassCardProps {
  intensity?: "strong" | "light";
  children: React.ReactNode;
}

const intensityClasses = {
  // Feature cards - primary focus
  strong: {
    blur: "backdrop-blur-[12px]",    // Upper end of 8-12px
    bg: "bg-zinc-900/20",            // 20% opacity
    border: "border-white/10",       // 10% opacity
  },
  // Stats/Testimonials - lighter treatment
  light: {
    blur: "backdrop-blur-[8px]",     // Lower end of 8-12px
    bg: "bg-zinc-900/15",            // 15% opacity
    border: "border-white/[0.08]",   // 8% opacity
  },
};
```

### Pattern 3: Mobile-First Performance Fallback
**What:** Automatic fallback on mobile devices via CSS media query
**When to use:** Per CONTEXT.md - desktop gets glass, mobile gets solid automatically
**Example:**
```css
/* Source: CONTEXT.md + Performance research */

/* Mobile first - solid fallback */
.glass-card {
  background-color: rgb(24 24 27 / 0.8);
  border: 1px solid rgb(255 255 255 / 0.2);
}

/* Desktop gets glass effect */
@media (min-width: 768px) {
  @supports (backdrop-filter: blur(10px)) {
    .glass-card {
      background-color: rgb(24 24 27 / 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgb(255 255 255 / 0.1);
    }
  }
}
```

### Pattern 4: Scrolled Nav Glass Transition
**What:** Glass effect appearing on navigation when scrolled
**When to use:** Navigation component when user scrolls past hero
**Example:**
```tsx
// Source: CONTEXT.md - Claude's discretion on timing
const scrolledNavStyles = {
  initial: "bg-transparent",
  scrolled: cn(
    "bg-zinc-900/20",
    "backdrop-blur-[10px]",
    "border-b border-white/10",
    // Transition timing - Claude's discretion
    "transition-all duration-300"
  ),
};
```

### Anti-Patterns to Avoid
- **Layering glass + rim lighting:** CONTEXT.md says "Glass replaces existing rim lighting effect (don't layer both)"
- **Heavy blur (20px+):** CONTEXT.md specifies 8-12px range only
- **Animating backdrop-filter:** Never animate blur value - causes severe jank
- **Glass on Footer:** CONTEXT.md explicitly says "Footer: No glass"
- **Exceeding viewport budget:** Maximum 6-8 glass elements visible at once

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Feature detection | JS-based detection | CSS @supports | Zero JS overhead, no FOUC |
| Blur animation | Animate blur value | Animate opacity instead | backdrop-filter animation is extremely expensive |
| Multiple glass layers | Stack transparent elements | Single glass layer per card | Each layer multiplies render cost |
| Safari prefix | Manual -webkit- addition | Tailwind's automatic prefixing | Tailwind 4.0 handles prefixes |
| Performance measurement | Manual profiling | Lighthouse audit | Standardized, automated |

**Key insight:** The existing `.glass` utility in globals.css (`bg-card/80 backdrop-blur-md`) is close but needs updating to match CONTEXT.md specs. Modify existing, don't create parallel systems.

## Common Pitfalls

### Pitfall 1: Performance Budget Violation
**What goes wrong:** Adding glass effects to too many elements causes FPS drops below 60
**Why it happens:** backdrop-filter is 15-30ms per element on mid-range mobile GPUs
**How to avoid:**
- Count glass elements per viewport (max 6-8)
- Use mobile fallback (solid backgrounds)
- Test on Galaxy A24 4G or equivalent
**Warning signs:** Lighthouse performance score drops below 95

### Pitfall 2: Forgetting Safari -webkit- Prefix
**What goes wrong:** Glass effect doesn't appear on Safari < 18.0
**Why it happens:** Safari 9-17.6 requires `-webkit-backdrop-filter`
**How to avoid:** Always include both properties or use Tailwind's automatic prefixing
**Warning signs:** Effect works in Chrome but not Safari

### Pitfall 3: Glass Without Visible Background Content
**What goes wrong:** Glass effect looks like plain semi-transparent card
**Why it happens:** No contrasting content behind the card to blur
**How to avoid:** Ensure BackgroundDepth orbs (Phase 21) are visible through glass cards
**Warning signs:** Glass cards look "flat" compared to design mockups

### Pitfall 4: Animating Backdrop-Filter
**What goes wrong:** Severe frame drops when transitioning blur values
**Why it happens:** Each blur value change requires full re-render of background
**How to avoid:** Only animate opacity, never blur value. For nav: start with 0 blur, transition to full blur via opacity
**Warning signs:** Stuttering/jank when scrolling near nav transition point

### Pitfall 5: Double Glass Effect (Rim Light + Glass)
**What goes wrong:** Overwhelming visual noise, too much border emphasis
**Why it happens:** Existing Card/AnimatedCard has rimLight prop that adds top border
**How to avoid:** When applying glass, set rimLight={false} or remove entirely
**Warning signs:** Cards have both rim lighting border AND glass border

### Pitfall 6: RTL Carousel Arrow Placement
**What goes wrong:** Carousel prev/next arrows appear on wrong sides for RTL
**Why it happens:** Standard carousel assumes LTR navigation direction
**How to avoid:** Current carousel.tsx already uses `start`/`end` positioning (RTL-aware). Verify no hardcoded left/right. Per RTL-03: arrows should swap sides.
**Warning signs:** Users confused by arrow direction vs. content flow

## Code Examples

Verified patterns from official sources and existing codebase:

### GlassCard Component
```tsx
// Source: CONTEXT.md decisions + Tailwind docs + existing card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Glass intensity - determines blur and opacity levels
   * - strong: Feature cards (12px blur, 20% bg opacity)
   * - light: Stats/Testimonials (8px blur, 15% bg opacity)
   */
  intensity?: "strong" | "light";
}

/**
 * GlassCard - Glassmorphism card with performance-aware fallback
 *
 * Fallback strategy (per CONTEXT.md):
 * - Mobile: solid dark background (zinc-900/80)
 * - Desktop without support: solid dark background
 * - Desktop with support: glass effect
 *
 * Note: Replaces rim lighting - do not combine with rimLight prop
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "strong", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl",
        // Mobile fallback (solid) - applied first
        "bg-zinc-900/80 border border-white/20",
        // Desktop with glass support
        "md:supports-[backdrop-filter:blur(1px)]:bg-zinc-900/20",
        "md:supports-[backdrop-filter:blur(1px)]:border-white/10",
        intensity === "strong"
          ? "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[12px]"
          : "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[8px]",
        className
      )}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
```

### CSS-Only Glass with @supports
```css
/* Source: MDN + CONTEXT.md */
/* Add to globals.css or component CSS */

/* Glass utilities for Tailwind 4.0 @theme */
@theme {
  /* Glass effect variables */
  --glass-blur-strong: 12px;
  --glass-blur-light: 8px;
  --glass-bg-strong: rgb(24 24 27 / 0.2);
  --glass-bg-light: rgb(24 24 27 / 0.15);
  --glass-bg-fallback: rgb(24 24 27 / 0.8);
  --glass-border: rgb(255 255 255 / 0.1);
  --glass-border-fallback: rgb(255 255 255 / 0.2);
}

/* Glass utility classes */
.glass-strong {
  /* Fallback */
  background-color: var(--glass-bg-fallback);
  border: 1px solid var(--glass-border-fallback);
}

.glass-light {
  /* Fallback */
  background-color: var(--glass-bg-fallback);
  border: 1px solid var(--glass-border-fallback);
}

/* Desktop enhancement */
@media (min-width: 768px) {
  @supports (backdrop-filter: blur(1px)) {
    .glass-strong {
      background-color: var(--glass-bg-strong);
      backdrop-filter: blur(var(--glass-blur-strong));
      -webkit-backdrop-filter: blur(var(--glass-blur-strong));
      border: 1px solid var(--glass-border);
    }

    .glass-light {
      background-color: var(--glass-bg-light);
      backdrop-filter: blur(var(--glass-blur-light));
      -webkit-backdrop-filter: blur(var(--glass-blur-light));
      border: 1px solid var(--glass-border);
    }
  }
}
```

### Scrolled Navigation with Glass
```tsx
// Source: CONTEXT.md + existing StickyCtaBar pattern
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GlassNavProps {
  className?: string;
  children: React.ReactNode;
}

export function GlassNav({ className, children }: GlassNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50",
        // Transition timing - Claude's discretion: 300ms ease-out
        "transition-all duration-300 ease-out",
        isScrolled
          ? cn(
              // Glass effect when scrolled
              "bg-zinc-900/80 border-b border-white/20", // Mobile fallback
              "md:supports-[backdrop-filter:blur(1px)]:bg-zinc-900/20",
              "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[10px]",
              "md:supports-[backdrop-filter:blur(1px)]:border-white/10"
            )
          : "bg-transparent border-b border-transparent",
        className
      )}
    >
      {children}
    </nav>
  );
}
```

### TestimonialCard with Glass (Replacing rimLight)
```tsx
// Source: Existing TestimonialCard.tsx + CONTEXT.md
// Modification: Replace rimLight Card with glass-light effect

export function TestimonialCard({
  quote,
  name,
  business,
  metric,
  avatarSrc,
  industry,
}: TestimonialCardProps) {
  return (
    <m.div
      whileHover={{ scale: 1.02 }}
      transition={springBouncy}
      className="h-full"
    >
      {/* Replace <Card rimLight> with glass variant */}
      <Card
        className={cn(
          "h-full",
          // Glass light effect
          "bg-zinc-900/80 border border-white/20", // Mobile fallback
          "md:supports-[backdrop-filter:blur(1px)]:bg-zinc-900/15",
          "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[8px]",
          "md:supports-[backdrop-filter:blur(1px)]:border-white/[0.08]"
        )}
        rimLight={false} // Disable rim lighting - replaced by glass
      >
        <CardContent className="p-6 flex flex-col gap-4 h-full">
          {/* ... existing content ... */}
        </CardContent>
      </Card>
    </m.div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| backdrop-filter with -webkit- prefix only | Standard + prefix for Safari < 18 | Sept 2024 | 95.76% global support |
| Heavy blur (20px+) for "frosted glass" | Subtle blur (8-12px) for Linear-style | 2025 | Better performance, modern aesthetic |
| JS feature detection | CSS @supports | Always available | Zero JS overhead |
| Full-page blur | Scoped per-element blur | Performance learning | 6-8 elements max per viewport |
| Glass everywhere | Strategic glass + solid elsewhere | UX maturation | Clear visual hierarchy |

**Deprecated/outdated:**
- Using filter: blur() instead of backdrop-filter: Glass effect should blur background, not the element itself
- Heavy blur values (20px+): Per CONTEXT.md and performance research, stick to 8-12px
- JS-based feature detection: CSS @supports is synchronous and prevents FOUC

## Open Questions

Things that couldn't be fully resolved:

1. **Exact blur value within 8-12px range**
   - What we know: CONTEXT.md allows Claude's discretion within 8-12px
   - What's unclear: Exact visual preference (10px might be optimal middle ground)
   - Recommendation: Start with 10px for strong, 8px for light. Adjust based on visual testing.

2. **Navigation glass transition timing**
   - What we know: CONTEXT.md marks as Claude's discretion
   - What's unclear: Whether 200ms, 300ms, or 400ms feels best
   - Recommendation: Use 300ms with ease-out. Match existing transition timing in codebase.

3. **Viewport budget counting mechanism**
   - What we know: Max 6-8 glass elements per viewport
   - What's unclear: Whether to enforce via code or documentation
   - Recommendation: Document in component JSDoc, verify during code review. No runtime counting needed.

4. **Safari 18.0 unprefixed support deployment**
   - What we know: Safari 18.0+ supports unprefixed backdrop-filter
   - What's unclear: Current Safari version distribution in target market
   - Recommendation: Keep -webkit- prefix for now. Safe to remove in 2027.

## Sources

### Primary (HIGH confidence)
- MDN Web Docs - backdrop-filter: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- Can I Use - backdrop-filter: https://caniuse.com/css-backdrop-filter (95.76% global support)
- Existing codebase: globals.css, card.tsx, TestimonialCard.tsx, StickyCtaBar.tsx

### Secondary (MEDIUM confidence)
- Epic Web Dev - Tailwind glassmorphism: https://www.epicweb.dev/tips/creating-glassmorphism-effects-with-tailwind-css
- LogRocket - Linear design principles: https://blog.logrocket.com/ux-design/linear-design/
- shadcn/ui Issue #327 - backdrop-filter performance: https://github.com/shadcn-ui/ui/issues/327

### Tertiary (LOW confidence)
- WebSearch results on glassmorphism 2026 trends (general guidance, not implementation-specific)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using only native CSS and existing Tailwind utilities
- Architecture: HIGH - Patterns derived from CONTEXT.md decisions and existing codebase
- Pitfalls: HIGH - Well-documented performance characteristics of backdrop-filter

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable CSS properties, unlikely to change)
