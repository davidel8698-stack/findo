# Phase 23: 3D Phone Mockup - Research

**Researched:** 2026-02-03
**Domain:** Pre-rendered 3D phone mockup, CSS multi-layer shadows, parallax effects, screen glow, image optimization
**Confidence:** HIGH

## Summary

This phase transforms the hero visual from a CSS-only phone frame to a premium pre-rendered 3D phone mockup with realistic shadows, screen glow, and parallax movement. The research confirms this can be achieved using a hybrid approach: a pre-rendered 3D phone image (AVIF/WebP) with CSS-powered effects for shadows, glow, and parallax.

The current `PhoneMockup.tsx` component uses pure CSS to create a phone frame shape with borders and border-radius. For Phase 23, we replace this with a high-quality pre-rendered 3D phone image while keeping the CSS shadow system from Phase 22 and adding new parallax behavior. The activity feed animation continues to play inside the mockup using an overlay technique.

Key implementation decisions from CONTEXT.md are already locked: three-quarter view angle (~30 degrees), space black/dark gray frame, 8-12 second activity feed loop, mouse + scroll parallax on desktop (scroll-only on mobile), and natural scroll exit behavior. Research confirms these are achievable with the existing stack (Motion, GSAP, Next.js Image).

**Primary recommendation:** Use a pre-rendered 3D phone PNG/WebP/AVIF image positioned with CSS, apply the Phase 22 multi-layer shadow system via CSS variables, implement screen glow using a pseudo-element with radial gradient and blur, add parallax using Motion's `useScroll` + `useTransform` for scroll and `useMotionValue` for mouse tracking.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js Image | 16.x | Optimized image loading with AVIF/WebP | Already in project; `priority` prop for LCP, automatic format selection |
| Motion | 12.x | Parallax via `useScroll`, `useTransform`, `useMotionValue` | Already in project; smooth scroll-linked animations, mouse tracking |
| GSAP ScrollTrigger | 3.14.x | Alternative parallax (already configured) | Already in project; useful for complex timeline-based parallax |
| CSS Multi-Layer Shadows | N/A | Realistic depth via 4-layer shadow system | Phase 22 established `--shadow-elevation-*` variables |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS Custom Properties | N/A | Shadow and glow values | Theme-level definitions from Phase 22 |
| CSS `transform: perspective()` | N/A | 3D rotation for mockup | If adding subtle perspective tilt |
| `prefers-reduced-motion` | N/A | Disable parallax for accessibility | Required for WCAG compliance |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Motion useScroll | GSAP ScrollTrigger | GSAP already set up; Motion preferred for React integration and simpler parallax |
| Motion useMotionValue | react-just-parallax | External library; Motion already handles mouse tracking without new dependency |
| Pre-rendered image | Spline 3D | CONTEXT.md explicitly chose pre-rendered over interactive 3D for performance |
| CSS screen glow | Canvas glow | CSS sufficient for "premium not distracting" glow; canvas overkill |

**Installation:**
No additional packages needed - all features available with existing dependencies (Motion 12.x, GSAP 3.14.x, Next.js 16.x).

## Architecture Patterns

### Recommended Project Structure
```
website/
├── public/
│   └── images/
│       ├── phone-mockup.avif      # Primary (smallest, modern browsers)
│       ├── phone-mockup.webp      # Fallback (wider support)
│       └── phone-mockup.png       # Final fallback (legacy)
├── components/
│   └── sections/
│       └── hero/
│           ├── PhoneMockup.tsx    # Replace CSS frame with image + effects
│           ├── PhoneParallax.tsx  # Optional: Extract parallax logic
│           ├── ScreenGlow.tsx     # Optional: Extract glow effect
│           └── ActivityFeed.tsx   # Existing (plays inside mockup)
└── app/
    └── globals.css                # Add phone mockup shadow variables
```

### Pattern 1: Pre-rendered Phone Image with CSS Overlay
**What:** Use Next.js Image for the phone mockup with activity feed positioned absolutely inside the "screen" area
**When to use:** When replacing CSS-only mockup with high-quality 3D render
**Example:**
```tsx
// Source: Next.js Image + existing project patterns
// components/sections/hero/PhoneMockup.tsx

import Image from "next/image";
import { cn } from "@/lib/utils";

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Pre-rendered 3D phone image */}
      <Image
        src="/images/phone-mockup.avif"
        alt=""
        width={580}
        height={1160}
        priority // LCP optimization
        className="w-[240px] md:w-[290px] h-auto"
        // Let CSS handle shadows
      />

      {/* Screen content overlay - positioned to match mockup screen area */}
      <div className="absolute inset-[12%] top-[8%] bottom-[6%] overflow-hidden rounded-[1.5rem]">
        {children}
      </div>

      {/* Screen glow effect */}
      <div className="absolute inset-0 -z-10 blur-[40px] opacity-60 bg-gradient-radial from-orange-500/30 to-transparent" />
    </div>
  );
}
```

### Pattern 2: Multi-Layer Shadow for Realistic Depth
**What:** Apply Phase 22 shadow system with additional contact shadow for grounded feel
**When to use:** Phone mockup to create floating-above-surface illusion
**Example:**
```tsx
// Source: Phase 22 research + Josh W. Comeau shadow layering
// Apply to phone container

const phoneShadowClasses = cn(
  // Multi-layer elevation shadow (Phase 22)
  "shadow-[var(--shadow-elevation-high)]",
  // Contact shadow (dark, tight, beneath phone)
  "[filter:drop-shadow(0_30px_30px_rgba(0,0,0,0.25))]",
  // Directional shadow (simulates light source)
  "[filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.15))]"
);

// Or as CSS variable for phone specifically:
// globals.css
// --shadow-phone-mockup:
//   0 2px 4px hsl(0 0% 0% / 0.1),
//   0 8px 16px hsl(0 0% 0% / 0.1),
//   0 16px 32px hsl(0 0% 0% / 0.08),
//   0 32px 64px hsl(0 0% 0% / 0.05);
```

### Pattern 3: Screen Glow Effect
**What:** Subtle ambient glow that "bleeds" from screen edges with brand orange tint
**When to use:** Hero phone mockup to create "screen is on" illusion
**Example:**
```tsx
// Source: CONTEXT.md decision - orange-amber glow, subtle/premium
// components/sections/hero/ScreenGlow.tsx

export function ScreenGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10",
        // Blur creates soft glow edge
        "blur-[40px]",
        // Scale slightly larger than phone
        "scale-110",
        // Brand orange radial gradient
        "bg-[radial-gradient(ellipse_at_center,hsl(24.6_95%_53.1%_/_0.25)_0%,transparent_70%)]",
        className
      )}
      aria-hidden="true"
    />
  );
}
```

### Pattern 4: Scroll Parallax with Motion useScroll
**What:** Phone moves slower than content during scroll, creating depth
**When to use:** Desktop and mobile scroll parallax (CONTEXT.md: 20-40px movement)
**Example:**
```tsx
// Source: Motion documentation + project patterns
// components/sections/hero/PhoneMockup.tsx

"use client";

import { useScroll, useTransform, m } from "motion/react";
import { useRef } from "react";

export function PhoneMockupWithParallax({ children }: PhoneMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // Track from hero start to hero exit
  });

  // Map scroll progress to Y offset (20-40px range per CONTEXT.md)
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <m.div
      ref={containerRef}
      style={{ y }}
      className="relative"
    >
      {/* Phone image + content */}
    </m.div>
  );
}
```

### Pattern 5: Mouse Parallax (Desktop Only)
**What:** Phone tilts subtly toward cursor position on desktop
**When to use:** Desktop only (CONTEXT.md: no mouse tracking on mobile for performance)
**Example:**
```tsx
// Source: Motion useMotionValue + useTransform
// components/sections/hero/PhoneMockup.tsx

"use client";

import { useMotionValue, useTransform, useSpring, m } from "motion/react";
import { useEffect, useState } from "react";

export function PhoneMockupWithMouseParallax({ children }: PhoneMockupProps) {
  const [isMobile, setIsMobile] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for natural feel
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  useEffect(() => {
    // Detect mobile
    setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize to -0.5 to 0.5 range
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  return (
    <m.div
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        perspective: "1000px",
      }}
      className="relative"
    >
      {/* Phone content */}
    </m.div>
  );
}
```

### Pattern 6: Activity Feed Loop (8-12 seconds)
**What:** Activity feed animation loops continuously inside phone screen
**When to use:** Hero phone mockup to show full Findo journey
**Example:**
```tsx
// Source: CONTEXT.md decision - continuous loop, 8-12 seconds
// Modify existing ActivityFeed.tsx

// Current implementation animates once and holds.
// Change to continuous loop with GSAP repeat:-1

useEffect(() => {
  const tl = gsap.timeline({
    defaults: { ease: "back.out(1.7)", duration: 0.5 },
    repeat: -1, // Infinite loop
    repeatDelay: 2, // Pause between cycles
  });

  // Animate in
  tl.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.5 });

  // Hold for viewing
  tl.to({}, { duration: 3 }); // 3s pause

  // Animate out
  tl.to(cards, { y: -40, opacity: 0, stagger: 0.2 });

  // Total cycle: ~0.5*5 + 3 + 0.2*5 = 2.5 + 3 + 1 = 6.5s per cycle
  // Adjust stagger/hold for 8-12s target
}, []);
```

### Anti-Patterns to Avoid
- **Animating `filter: drop-shadow()` directly:** Extremely expensive; use static CSS shadows, animate opacity of glow pseudo-element instead
- **Mouse parallax on mobile:** CONTEXT.md explicitly forbids; causes performance issues on touch devices
- **Heavy 3D transforms:** Simple perspective tilt is fine; avoid full 3D rotation or complex transforms
- **Blocking LCP with image:** Use `priority` prop on Next.js Image; ensure mockup image is preloaded
- **Large unoptimized image:** CONTEXT.md requires AVIF/WebP; PNG fallback only for legacy browsers
- **Glow competing with background orbs:** Screen glow should be subtle (20-30% opacity); background orbs already provide ambient glow

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-linked animation | Manual scroll listener | Motion `useScroll` + `useTransform` | Handles throttling, RAF, SSR |
| Mouse tracking parallax | Raw mousemove events | Motion `useMotionValue` + `useSpring` | Smooth interpolation, performance |
| 3D phone image | CSS-only frame (current) | Pre-rendered 3D asset | CONTEXT.md decision; realistic quality |
| Multi-layer shadows | Multiple shadow classes | CSS variable `--shadow-phone-mockup` | Single class, consistent application |
| Responsive images | Manual srcset | Next.js Image | Automatic AVIF/WebP, srcset, sizes |
| Reduced motion | Manual matchMedia | CSS `prefers-reduced-motion` + Motion | Library respects preference automatically |

**Key insight:** Motion library already handles the complexity of scroll-linked and mouse-tracking animations with built-in performance optimizations. Don't reimplement with raw event listeners.

## Common Pitfalls

### Pitfall 1: Phone Image Blocking LCP
**What goes wrong:** Hero phone mockup image delays Largest Contentful Paint, Lighthouse score drops
**Why it happens:** Large image without preloading; wrong format; no priority hint
**How to avoid:**
- Use Next.js Image with `priority` prop (preloads immediately)
- Serve AVIF primary, WebP fallback (50% smaller than PNG)
- Keep image dimensions reasonable (580x1160 max)
- Static import for automatic blur placeholder
**Warning signs:** LCP > 2.5s on mobile; Lighthouse flags "Eliminate render-blocking resources"

### Pitfall 2: Parallax Causing Layout Shift (CLS)
**What goes wrong:** Phone mockup "jumps" when parallax kicks in, CLS > 0
**Why it happens:** Parallax offset changes element position after initial render
**How to avoid:**
- Apply initial parallax offset on first render
- Use `contain: layout` on parallax container
- Keep parallax subtle (20-40px per CONTEXT.md)
**Warning signs:** CLS > 0 in Lighthouse; visible "jump" on scroll start

### Pitfall 3: Mouse Parallax Jank on Mobile
**What goes wrong:** Touch events trigger mouse parallax; phone jitters during scroll
**Why it happens:** Not checking for touch device; no mobile override
**How to avoid:**
- Detect mobile via `window.matchMedia("(max-width: 1024px)")`
- Set mouse parallax to `0` on mobile (scroll parallax only)
- Use `useEffect` dependency to re-check on resize
**Warning signs:** Jank during mobile scroll; users report "jittery" phone

### Pitfall 4: Screen Glow Too Intense
**What goes wrong:** Glow looks like a video game UI, not premium SaaS
**Why it happens:** High opacity, large blur radius, saturated color
**How to avoid:**
- CONTEXT.md says "subtle ambient glow, premium not distracting"
- Start with 20% opacity, 40px blur
- Use orange-amber tint, not pure orange
- Test on dark background
**Warning signs:** Glow dominates visual hierarchy; testimonial cards harder to see

### Pitfall 5: Activity Feed Not Looping
**What goes wrong:** Animation plays once and stops; hero feels static
**Why it happens:** Current implementation uses `repeat: 0` (default)
**How to avoid:**
- Add `repeat: -1` to GSAP timeline for infinite loop
- Include 2s `repeatDelay` for pause between cycles
- Target 8-12 second total cycle time
**Warning signs:** Animation stops after first play; hero feels "dead" after 5 seconds

### Pitfall 6: Phone Positioned Wrong for RTL
**What goes wrong:** Phone appears on right side of text in RTL layout
**Why it happens:** Using `left/right` instead of `start/end`; grid order not RTL-aware
**How to avoid:**
- CONTEXT.md specifies "left side of text in RTL" (which means phone on viewer's left)
- Current Hero.tsx uses `order-1 lg:order-2` correctly (phone goes to RTL "end" = left side visually)
- Verify with `dir="rtl"` testing
**Warning signs:** Phone appears on wrong side of headline; visual hierarchy broken

### Pitfall 7: Shadow Layers Not Compositing
**What goes wrong:** Shadows look flat despite 4-layer system
**Why it happens:** `filter: drop-shadow()` on transparent PNG drops all shadows together
**How to avoid:**
- Use `box-shadow` on the container, not `filter: drop-shadow()`
- Or wrap phone image in container with background color
- Use existing `--shadow-elevation-high` variable
**Warning signs:** Shadows look single-layer; no depth perception

## Code Examples

Verified patterns from official sources and existing project:

### Complete PhoneMockup Component (Recommended Implementation)
```tsx
// Source: Synthesis of Motion docs, Next.js Image, Phase 22 patterns
// components/sections/hero/PhoneMockup.tsx

"use client";

import Image from "next/image";
import { useRef, useEffect, useState, type ReactNode } from "react";
import { m, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children?: ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  // ----- Scroll Parallax -----
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 40]); // 40px max

  // ----- Mouse Parallax (Desktop Only) -----
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  useEffect(() => {
    // Detect mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile, mouseX, mouseY]);

  return (
    <m.div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        y: scrollY,
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Screen Glow - behind phone */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "blur-[40px] scale-110",
          "bg-[radial-gradient(ellipse_at_center,hsl(24.6_95%_53.1%_/_0.2)_0%,transparent_70%)]"
        )}
        aria-hidden="true"
      />

      {/* Phone Frame with Multi-Layer Shadow */}
      <div
        className={cn(
          // Container for shadow (box-shadow needs solid background)
          "relative rounded-[2.5rem]",
          // Multi-layer shadow system
          "shadow-[var(--shadow-phone-mockup)]"
        )}
      >
        {/* Pre-rendered 3D Phone Image */}
        <Image
          src="/images/phone-mockup.avif"
          alt=""
          width={580}
          height={1160}
          priority
          className="w-[240px] md:w-[290px] h-auto"
        />

        {/* Screen Content Overlay */}
        <div
          className={cn(
            "absolute overflow-hidden rounded-[1.75rem]",
            // Position to match screen area (adjust based on actual image)
            "inset-[5%] top-[4%] bottom-[4%]",
            "bg-background"
          )}
        >
          <div className="h-full w-full overflow-hidden p-3">
            {children}
          </div>
        </div>

        {/* Rim Light (dark mode only) */}
        <div
          className={cn(
            "absolute inset-0 rounded-[2.5rem] pointer-events-none",
            "border-t-2 border-t-white/10"
          )}
          aria-hidden="true"
        />
      </div>
    </m.div>
  );
}
```

### Phone Shadow CSS Variables (globals.css addition)
```css
/* Source: Phase 22 shadow system + contact shadow for grounding */
/* Add to @theme block in globals.css */

/* Phone mockup shadow - contact + directional + ambient */
--shadow-phone-mockup:
  0 1px 2px hsl(0 0% 0% / 0.1),
  0 4px 8px hsl(0 0% 0% / 0.1),
  0 16px 32px hsl(0 0% 0% / 0.08),
  0 32px 64px hsl(0 0% 0% / 0.06);

/* Screen glow for phone (brand orange) */
--glow-screen: 0 0 40px 20px hsl(24.6 95% 53.1% / 0.15);
```

### Activity Feed Loop Animation
```tsx
// Source: GSAP timeline with repeat
// Modify ActivityFeed.tsx useEffect

useEffect(() => {
  const startAnimation = () => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".activity-card");
    if (cards.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: "back.out(1.7)", duration: 0.6 },
      repeat: -1,       // Infinite loop
      repeatDelay: 1.5, // Pause between cycles
      onComplete: removeWillChange,
    });

    // Phase 1: Animate in (staggered)
    tl.fromTo(
      cards,
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, stagger: 0.4 } // ~2s total
    );

    // Phase 2: Hold for viewing
    tl.to({}, { duration: 4 }); // 4s pause to read

    // Phase 3: Animate out (faster)
    tl.to(cards, { y: -30, opacity: 0, stagger: 0.15 }); // ~0.75s

    // Total cycle: 2 + 4 + 0.75 + 1.5 delay = ~8.25s (within 8-12s target)
  };

  // Defer until browser idle (LCP optimization)
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(startAnimation, { timeout: 1000 });
    return () => window.cancelIdleCallback(id);
  } else {
    const id = setTimeout(startAnimation, 100);
    return () => clearTimeout(id);
  }
}, [removeWillChange]);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS-only phone frame | Pre-rendered 3D image | 2023+ | Photo-realistic quality, premium feel |
| Single layer shadow | 4-layer stacked shadows | 2020+ | Realistic depth, grounded appearance |
| JavaScript scroll listeners | Motion `useScroll` | 2022+ | Built-in performance, cleaner code |
| PNG hero images | AVIF with WebP fallback | 2024+ | 50% smaller files, faster LCP |
| Mouse parallax on all devices | Desktop-only with mobile detection | 2023+ | Better mobile performance |
| One-shot activity animation | Continuous loop | Per CONTEXT.md | Keeps hero alive, shows full journey |

**Deprecated/outdated:**
- **CSS-only phone mockup:** Still works but doesn't match "premium visual excellence" goal
- **PNG without fallback:** AVIF now has wide support; always provide fallback chain
- **requestAnimationFrame parallax:** Motion hooks handle this more elegantly
- **Simple-parallax-js library:** CONTEXT.md mentions it, but Motion already provides this; no need for extra dependency

## Open Questions

Things that couldn't be fully resolved:

1. **Exact screen overlay positioning**
   - What we know: Need to position activity feed over the "screen" area of phone image
   - What's unclear: Exact inset percentages depend on the specific 3D render used
   - Recommendation: Start with `inset-[5%] top-[4%] bottom-[4%]`, adjust per actual image

2. **3D phone image source**
   - What we know: Need three-quarter view (~30 deg), space black frame, frameless modern phone
   - What's unclear: Where to source/create the pre-rendered 3D image
   - Recommendation: Options include Mockuuups, Rotato, or Blender render; discuss with user

3. **Activity feed loop timing**
   - What we know: CONTEXT.md specifies 8-12 seconds, continuous loop
   - What's unclear: Whether current 5-card sequence is enough for full Findo journey
   - Recommendation: May need to add 2-3 more cards to show complete journey; current ~8s cycle is at lower bound

4. **Mouse parallax intensity**
   - What we know: CONTEXT.md says "subtle movement intensity (~20-40px)"
   - What's unclear: Whether rotation degrees (3-5 deg) matches perceived 20-40px movement
   - Recommendation: Start with 3 deg rotation, test visually, may increase to 5 deg

## Sources

### Primary (HIGH confidence)
- [Josh W. Comeau: Designing Beautiful Shadows](https://www.joshwcomeau.com/css/designing-shadows/) - Multi-layer shadow layering technique
- [Tobias Ahlin: Layered Smooth Box-Shadows](https://tobiasahlin.com/blog/layered-smooth-box-shadows/) - Smooth shadow stacking
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image) - priority prop, AVIF/WebP support
- [Builder.io: Parallax Scrolling Effect](https://www.builder.io/blog/parallax-scrolling-effect) - Modern parallax best practices
- Motion library (in project) - `useScroll`, `useTransform`, `useMotionValue` hooks

### Secondary (MEDIUM confidence)
- [React Just Parallax](https://github.com/michalzalobny/react-just-parallax) - Mouse + scroll parallax patterns (API reference)
- [Elementor: AVIF vs WebP](https://elementor.com/blog/webp-vs-avif/) - Image format comparison 2026
- [CSS-Tricks: Scroll-Driven CSS Animations](https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/) - CSS-only parallax (backup approach)

### Tertiary (LOW confidence)
- GSAP ScrollTrigger examples (CodePen) - Visual patterns for scroll parallax
- Screen glow techniques - Synthesized from multiple sources; specific values need testing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already in project; patterns verified
- Architecture: HIGH - Patterns follow existing project conventions
- Parallax implementation: HIGH - Motion hooks well-documented
- Shadow system: HIGH - Extends Phase 22 established system
- Activity feed loop: MEDIUM - Timing values need visual testing
- Screen glow: MEDIUM - Opacity/blur values need visual tuning
- Image overlay positioning: LOW - Depends on actual 3D render dimensions

**Research date:** 2026-02-03
**Valid until:** 90 days (techniques stable; Motion/Next.js APIs stable)
