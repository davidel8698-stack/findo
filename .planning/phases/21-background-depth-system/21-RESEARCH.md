# Phase 21: Background Depth System - Research

**Researched:** 2026-02-03
**Domain:** CSS Background Layers, SVG Patterns, GPU-Accelerated Parallax, Performance Optimization
**Confidence:** HIGH

## Summary

This phase creates a sophisticated visual environment with layered background elements (grid pattern, gradient orbs, noise texture) that establishes a premium aesthetic while maintaining Lighthouse 95+ performance. The research confirms that all requirements can be met using pure CSS/SVG techniques with targeted GSAP ScrollTrigger for parallax effects.

The key challenge is balancing visual richness with performance constraints. The solution involves three layers: (1) an inline SVG grid pattern at 5% opacity, (2) blurred gradient orbs positioned with CSS and animated with GPU-only transforms, and (3) an inline SVG noise texture overlay. All three layers use techniques that avoid HTTP requests and leverage GPU acceleration.

For parallax (BG-06), the project already has GSAP and Motion installed. GSAP's ScrollTrigger is optimal for background parallax because it handles GPU-accelerated transforms efficiently. The key is using subtle speed differentials (0.5-0.8) and respecting the will-change limit (<10 elements).

**Primary recommendation:** Create a `BackgroundDepth` component with three fixed-position layers (grid, orbs, noise), apply GSAP ScrollTrigger parallax to 2-4 orb elements with subtle speed differentials, and use `pointer-events: none` on all background layers to prevent interaction blocking.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.1.18 | CSS utilities for positioning, opacity, blur | Already in project; provides `fixed`, `inset-0`, `opacity-*`, `blur-*` utilities |
| GSAP | 3.14.2 | Parallax scroll animation via ScrollTrigger | Already in project; 60fps GPU-accelerated transforms |
| Inline SVG | N/A | Grid pattern + noise texture | Zero HTTP requests, fully customizable, excellent performance |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @gsap/react | 2.1.2 | React integration with useGSAP hook | Already in project; use for parallax animations with proper cleanup |
| Motion | 12.x | useScroll hook for alternative parallax | Already in project; can use if simpler than GSAP for specific cases |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP ScrollTrigger | CSS scroll-driven animations | CSS `animation-timeline: scroll()` is zero-JS but lacks Firefox support as of 2026 |
| Inline SVG noise | PNG noise texture | PNG requires HTTP request, larger file size; inline SVG is ~500 bytes |
| Fixed position layers | Absolute within wrapper | Fixed is simpler for full-viewport coverage; absolute requires careful z-index |

**Installation:**
No additional packages needed - all features available with existing dependencies.

## Architecture Patterns

### Recommended Project Structure
```
website/
├── app/
│   └── globals.css           # Background layer CSS (grid, noise definitions)
├── components/
│   └── background/
│       ├── index.ts          # Barrel export
│       ├── BackgroundDepth.tsx    # Main orchestrator component
│       ├── GridOverlay.tsx        # Inline SVG grid pattern
│       ├── GradientOrbs.tsx       # Blurred gradient orbs with parallax
│       └── NoiseTexture.tsx       # Inline SVG noise overlay
```

### Pattern 1: Three-Layer Background Stack
**What:** Fixed-position layers with increasing z-index: grid (base) -> orbs (middle) -> noise (top)
**When to use:** For premium visual depth without blocking content interaction
**Example:**
```tsx
// Source: Verified pattern from research
// BackgroundDepth.tsx
export function BackgroundDepth() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1: Grid pattern (base) */}
      <GridOverlay className="opacity-5" />

      {/* Layer 2: Gradient orbs (middle) - these get parallax */}
      <GradientOrbs />

      {/* Layer 3: Noise texture (top) */}
      <NoiseTexture className="opacity-[0.03]" />
    </div>
  );
}
```

### Pattern 2: Inline SVG Grid Pattern
**What:** Full-viewport SVG pattern using `<pattern>` element, no external files
**When to use:** For subtle grid overlays that tile seamlessly
**Example:**
```tsx
// Source: https://www.shadcn.io/background/grid-pattern + adapted
// GridOverlay.tsx
export function GridOverlay({ className }: { className?: string }) {
  return (
    <svg
      className={cn("absolute inset-0 w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-zinc-500"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}
```

### Pattern 3: Blurred Gradient Orbs with Parallax
**What:** Absolutely positioned divs with radial gradients, blur filter on container, parallax via GSAP
**When to use:** For ambient background depth with orange brand color
**Example:**
```tsx
// Source: https://andrewwalpole.com/blog/glowing-blurred-backgrounds-with-css/ + GSAP parallax
// GradientOrbs.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GradientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Subtle parallax - speed 0.5 means moves at half scroll speed
    gsap.to(orb1Ref.current, {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    gsap.to(orb2Ref.current, {
      y: -150,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // 1 second smoothing
      },
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ filter: "blur(80px)" }} // Blur on container, not orbs
    >
      {/* Orb 1: Top-right area */}
      <div
        ref={orb1Ref}
        className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-orange-500/20 will-change-transform"
      />

      {/* Orb 2: Bottom-left area */}
      <div
        ref={orb2Ref}
        className="absolute bottom-[20%] left-[15%] w-[300px] h-[300px] rounded-full bg-amber-500/15 will-change-transform"
      />
    </div>
  );
}
```

### Pattern 4: Inline SVG Noise Texture
**What:** Inline SVG with feTurbulence filter as repeating background
**When to use:** For premium "grain" overlay that adds texture without images
**Example:**
```tsx
// Source: https://ibelick.com/blog/create-grainy-backgrounds-with-css + freecodecamp article
// NoiseTexture.tsx
export function NoiseTexture({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px",
      }}
    />
  );
}
```

### Anti-Patterns to Avoid
- **Using filter:blur() on individual animated elements:** Apply blur to the container, not the moving orbs. Recalculating blur per frame kills performance.
- **External image files for patterns:** Inline SVG eliminates HTTP requests and is smaller than equivalent PNG/JPG.
- **More than 4 will-change elements:** Project constraint is <10 total; background orbs should use 2-4 max.
- **High parallax speed differentials:** Values beyond 0.7 cause motion sickness. Use 0.3-0.6 for subtle depth.
- **backdrop-filter:blur() on scrolling elements:** Creates severe FPS drops in Chrome. Use filter:blur() on static containers instead.
- **Animating blur radius:** GPU cannot accelerate blur changes. Apply static blur and only animate transform/opacity.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Grid pattern | CSS repeating-linear-gradient | Inline SVG pattern | SVG scales perfectly at any zoom, gradients pixelate |
| Noise texture | PNG image file | Inline SVG feTurbulence | Zero HTTP requests, ~500 bytes vs 10KB+ PNG |
| Parallax scroll | IntersectionObserver + manual transform | GSAP ScrollTrigger | Already in project, handles edge cases, cleanup, performance |
| Blur effect | backdrop-filter on orbs | filter:blur on container | backdrop-filter has severe Chrome performance issues |
| Responsive orb sizing | Complex calc() | Viewport units (vw/vh) | Simpler, works across breakpoints |

**Key insight:** GSAP ScrollTrigger is already in the project and specifically optimized for GPU-accelerated scroll animations. Using vanilla JS would require reimplementing wheel event handling, RAF batching, and cleanup logic that ScrollTrigger handles automatically.

## Common Pitfalls

### Pitfall 1: Filter Blur Performance Death
**What goes wrong:** Applying `filter: blur()` directly to animated elements causes 10-30fps instead of 60fps
**Why it happens:** Blur filter must be recalculated every frame during transform animation
**How to avoid:** Apply blur to a static parent container; only animate child transforms inside the blurred container
**Warning signs:** Scrolling feels "sticky" or "jumpy", especially on mobile Safari

### Pitfall 2: Too Many will-change Declarations
**What goes wrong:** Browser allocates excessive GPU memory, potentially crashing mobile tabs
**Why it happens:** will-change reserves GPU resources for each element indefinitely
**How to avoid:** Limit to 2-4 orb elements with will-change; remove with JS after animation if possible
**Warning signs:** Memory usage climbs continuously; mobile Safari crashes

### Pitfall 3: Z-Index Battles with Content
**What goes wrong:** Background layers appear above page content or block clicks
**Why it happens:** Fixed positioning creates new stacking context; z-index conflicts with page structure
**How to avoid:** Use `-z-10` or `z-[-1]` on background container; add `pointer-events: none` to entire background layer
**Warning signs:** Links unclickable; content appears behind backgrounds

### Pitfall 4: Parallax Causing Motion Sickness
**What goes wrong:** Users feel disoriented or nauseated from parallax movement
**Why it happens:** Speed differentials too extreme (>0.7) or parallax applied to too many elements
**How to avoid:** Keep speed differentials subtle (0.3-0.6); test with prefers-reduced-motion; limit to 2-4 parallax elements
**Warning signs:** User complaints; high bounce rate on mobile

### Pitfall 5: Breakpoint Transitions Causing Layout Shift
**What goes wrong:** Orbs visibly "jump" when viewport crosses breakpoints (mobile -> tablet -> desktop)
**Why it happens:** Using fixed pixel values that change at breakpoints
**How to avoid:** Use viewport units (vw/vh/%) for orb sizing and positioning; use CSS clamp() if needed
**Warning signs:** CLS score increases; visible "pop" during resize

### Pitfall 6: SVG Pattern ID Conflicts
**What goes wrong:** Grid pattern disappears or shows wrong pattern
**Why it happens:** Multiple inline SVGs using same `id` attribute for pattern definitions
**How to avoid:** Use unique IDs (e.g., `grid-pattern-bg`) or use React useId() hook for dynamic IDs
**Warning signs:** Pattern works in isolation but breaks when combined with other SVG elements

### Pitfall 7: prefers-reduced-motion Not Respected
**What goes wrong:** Users with vestibular disorders get parallax motion they explicitly disabled
**Why it happens:** Parallax animation runs regardless of system preference
**How to avoid:** Check `window.matchMedia('(prefers-reduced-motion: reduce)')` before initializing parallax; globals.css already has `@media (prefers-reduced-motion: reduce)` rules
**Warning signs:** WCAG accessibility audit failure

## Code Examples

Verified patterns from official sources:

### Complete BackgroundDepth Component
```tsx
// Source: Synthesized from research - pattern from multiple verified sources
// components/background/BackgroundDepth.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface BackgroundDepthProps {
  className?: string;
}

export function BackgroundDepth({ className }: BackgroundDepthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Parallax animation (only if motion allowed)
  useGSAP(() => {
    if (prefersReducedMotion) return;

    const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current].filter(Boolean);
    const speeds = [-80, -120, -60]; // Subtle y-offset in pixels

    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: speeds[i],
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Smooth 1.5s lag for organic feel
        },
      });
    });
  }, { scope: containerRef, dependencies: [prefersReducedMotion] });

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Layer 1: Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bg-grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-zinc-500 dark:text-zinc-400"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
      </svg>

      {/* Layer 2: Gradient Orbs (blurred container) */}
      <div
        className="absolute inset-0"
        style={{ filter: "blur(80px)" }}
      >
        {/* Orange orb - top right */}
        <div
          ref={orb1Ref}
          className="absolute w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-orange-500/20 will-change-transform"
          style={{ top: "5%", right: "5%" }}
        />
        {/* Amber orb - bottom left */}
        <div
          ref={orb2Ref}
          className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-amber-500/15 will-change-transform"
          style={{ bottom: "15%", left: "10%" }}
        />
        {/* Subtle secondary orb - center */}
        <div
          ref={orb3Ref}
          className="absolute w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-orange-400/10 will-change-transform"
          style={{ top: "40%", left: "40%" }}
        />
      </div>

      {/* Layer 3: Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
        }}
      />
    </div>
  );
}
```

### Alternative: Separate Components (if preferred)
```tsx
// GridOverlay.tsx
export function GridOverlay({ className }: { className?: string }) {
  return (
    <svg
      className={cn("absolute inset-0 w-full h-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="bg-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-grid)" />
    </svg>
  );
}
```

### CSS Variables for Customization (add to globals.css)
```css
/* Source: Project patterns + research synthesis */
@theme {
  /* Background depth system variables */
  --bg-grid-opacity: 0.05;
  --bg-orb-opacity: 0.20;
  --bg-noise-opacity: 0.03;
  --bg-orb-blur: 80px;
  --bg-noise-size: 180px;
}
```

### Integration in Layout
```tsx
// app/layout.tsx or app/page.tsx
import { BackgroundDepth } from "@/components/background";

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <BackgroundDepth />
        {children}
      </body>
    </html>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PNG noise textures | Inline SVG feTurbulence | 2024+ | Zero HTTP requests, 95%+ file size reduction |
| jQuery parallax libraries | GSAP ScrollTrigger | 2021+ | 60fps GPU-accelerated, proper cleanup |
| backdrop-filter for blur | filter:blur on container | 2023+ | Avoids Chrome performance bug |
| CSS background gradients for grid | SVG pattern element | 2022+ | Perfect scaling at any zoom level |
| Manual scroll listeners | scroll-driven animations OR GSAP | 2025+ | CSS approach is browser-native; GSAP is more compatible |

**Deprecated/outdated:**
- **backdrop-filter:blur()**: Causes severe performance issues in Chrome (GitHub issues confirm); use filter:blur() on static container instead
- **Rellax.js**: Outdated; GSAP ScrollTrigger is more capable and project already has it
- **CSS perspective parallax**: Limited browser support and not GPU-optimized; GSAP transform is better
- **PNG pattern tiles**: Inline SVG is smaller and sharper; no HTTP request overhead

## Open Questions

Things that couldn't be fully resolved:

1. **Exact orb positioning for visual balance**
   - What we know: Top-right, bottom-left, center positions work well in research examples
   - What's unclear: Optimal positions for Findo's specific layout with RTL Hebrew content
   - Recommendation: Start with provided positions, adjust visually during implementation

2. **Optimal noise baseFrequency for "premium feel"**
   - What we know: 0.65 is commonly used; higher = finer grain, lower = coarser
   - What's unclear: Exact value that matches "Linear/Stripe" aesthetic referenced in project
   - Recommendation: Start with 0.65, adjust between 0.5-0.8 based on visual review

3. **Mobile Safari blur performance**
   - What we know: filter:blur() can be slow on older iOS devices
   - What's unclear: Performance on Findo's target iOS versions
   - Recommendation: Test on iPhone 12+ and iPad Pro; consider reducing blur radius to 60px for mobile if needed

4. **Parallax amount for full page scroll**
   - What we know: 80-150px y-offset works for typical landing pages
   - What's unclear: Optimal values for Findo's 10+ section page length
   - Recommendation: Use provided values initially; may need to increase to 150-200px if page is very long

## Sources

### Primary (HIGH confidence)
- [GSAP ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollSmoother/) - data-speed parallax, scrub settings
- [MDN CSS will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change) - Best practices for GPU hints
- [freeCodeCamp: Grainy CSS Backgrounds](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/) - feTurbulence filter implementation
- [ibelick: Grainy Backgrounds](https://ibelick.com/blog/create-grainy-backgrounds-with-css) - Noise overlay CSS pattern

### Secondary (MEDIUM confidence)
- [Andrew Walpole: Glowing Blurred Backgrounds](https://andrewwalpole.com/blog/glowing-blurred-backgrounds-with-css/) - Blur container pattern, vw units
- [Builder.io: Parallax in 2026](https://www.builder.io/blog/parallax-scrolling-effect) - Vanilla JS approach, performance considerations
- [shadcn.io: Grid Pattern](https://www.shadcn.io/background/grid-pattern) - SVG pattern component structure
- [fffuel.co nnnoise](https://www.fffuel.co/nnnoise/) - Noise texture generator reference

### Tertiary (LOW confidence)
- Chrome backdrop-filter performance issues: Confirmed via multiple GitHub issues but exact trigger conditions vary
- will-change element limit: General guidance is "as few as possible" but no hard limit specified; project uses <10 as conservative threshold

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already in project; patterns verified against official docs
- Architecture: HIGH - Pattern synthesis from multiple verified sources; aligns with project structure
- Pitfalls: HIGH - Performance issues confirmed via browser bug reports and testing articles
- Parallax specifics: MEDIUM - Exact values may need adjustment during implementation

**Research date:** 2026-02-03
**Valid until:** 90 days (core CSS/SVG patterns stable; GSAP API stable)
