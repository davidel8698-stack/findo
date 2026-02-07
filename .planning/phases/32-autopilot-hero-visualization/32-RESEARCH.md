# Phase 32: Autopilot Hero Visualization - Research (RESET)

**Researched:** 2026-02-06
**Domain:** Complex multi-panel SaaS dashboard visualization with 3D CSS perspective, periodic live-update animations, RTL-aware detailed product UI
**Confidence:** HIGH (based on comprehensive codebase analysis + verified library usage patterns)

> **NOTE:** This research supersedes the original 32-RESEARCH.md. The previous implementation was reset because it used simple metric cards instead of detailed SaaS dashboard panels. This research addresses the corrected requirements from the updated 32-CONTEXT.md.

## Summary

This research covers how to build 3 detailed SaaS dashboard panels (Reviews Manager, Leads CRM, Activity Dashboard) with realistic product UI, overlapping 3D perspective layout, and periodic live-update animations inside the hero section. Each panel must look like a real SaaS application with headers, tabs, list items, action buttons, and stats footers -- not simple metric cards.

The standard approach uses the **existing stack already in the codebase**: `motion/react` v12.29.2 for entrance and periodic animations (AnimatePresence for item swap, useInView for viewport trigger, useSpring for count-up), CSS `perspective` + `transform: rotateX/rotateY` for 3D tilt (same pattern as PhoneMockup.tsx), and Lucide icons (already installed at v0.563.0). **No new libraries are needed.**

The key challenge is **composition complexity** -- combining existing simple patterns into 3 large, detailed, content-rich panels that each contain 6-8 sub-elements (header, status bar, tabs, list items, action buttons, footer stats). Each panel is roughly 10x more complex than anything currently in the codebase (e.g., ActivityCard is ~30 lines; a full ReviewsPanel will be ~200+ lines).

**Primary recommendation:** Build 3 custom panel components (NOT reusing GlassCard/ShimmerCard -- per CONTEXT.md explicit decision) with a shared `DashboardPanel` shell that handles the glass-header + solid-body pattern. Use `AnimatePresence` from `motion/react` for periodic item insertion/removal. Apply CSS `perspective` on the container and individual `transform` on each panel for the 3D cascade effect. Split into static data file for all Hebrew demo content.

## Standard Stack

### Core (Already Installed -- No New Dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `motion/react` | 12.29.2 | Entrance animations, AnimatePresence for periodic updates, useSpring for count-up, useInView for viewport trigger, layout prop for item shifting | Already used in 15+ components (SectionReveal, FloatingActivityWidget, ConversionSection, PhoneMockup, SocialProofCounters) |
| `lucide-react` | 0.563.0 | All icons: Star, Phone, Search, Filter, MessageSquare, Activity, Circle, Clock, CheckCircle, ChevronDown, MoreHorizontal, User, Bell, etc. | Already used in ActivityCard, FloatingActivityWidget, HeroContent, GlassNav. CONTEXT.md explicitly recommends Lucide |
| `gsap` | 3.14.2 | Hero entrance timeline coordination (if panels need to sync with existing hero GSAP choreography) | Already used for hero entrance in Hero.tsx, ActivityFeed.tsx |
| `tailwindcss` | 4.x (CSS-first) | Styling with existing design tokens. All spacing/color/shadow/easing tokens already defined in globals.css | No config file -- everything in globals.css @theme block |
| CSS `perspective` + `preserve-3d` | Native | 3D space for overlapping panels, subtle tilt | GPU-accelerated, no JS bundle cost. Already proven in PhoneMockup.tsx |

### Supporting (Already Available)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` + `tailwind-merge` | 2.1.1 / 3.4.0 | `cn()` utility for class composition | All component styling |
| `@gsap/react` | 2.1.2 | `useGSAP` hook for cleanup | Only if using GSAP for complex timelines |
| Existing `.shimmer-border` CSS | globals.css | Shimmer rotating gradient border | Reviews panel only (front panel) |
| Existing motion tokens | animation.ts | `cssEasing`, `cssDuration`, `springLinear`, `springGentle` | All animation timing values |
| Existing motion variants | variants.ts | `fadeInRise`, `reducedMotionFade`, `fastStaggerContainer` | Panel entrance animations |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion/react AnimatePresence | GSAP timeline for periodic updates | GSAP is more powerful for multi-element sequenced timelines, but AnimatePresence is simpler for single-item insert/remove per panel. Use AnimatePresence for individual panel item updates |
| CSS perspective | Three.js / React Three Fiber | Massively overkill. CSS perspective handles 5-8 degree tilt perfectly. PhoneMockup already uses CSS preserve-3d successfully |
| Custom panel components | Existing GlassCard/ShimmerCard | CONTEXT.md explicitly decided against this: "Custom panel components (don't force-fit existing GlassCard/ShimmerCard -- too different)". Panels need split glass-header + solid-body which is a different pattern |
| Static demo data | Real API data | Out of scope per CONTEXT.md. All data is static Hebrew demo data |

**Installation:** None needed -- all dependencies are already installed.

## Architecture Patterns

### Recommended Component Structure

```
website/components/sections/autopilot-hero/
├── index.ts                      # Barrel exports
├── AutopilotPanels.tsx           # Container: perspective wrapper, 3-column layout, entrance orchestration
├── DashboardPanel.tsx            # Shared shell: glass header + solid body + optional shimmer
├── ReviewsPanel.tsx              # Panel 1 (FRONT-RIGHT): rating display, review items, stats footer
├── LeadsPanel.tsx                # Panel 2 (MIDDLE): search bar, time tabs, lead cards, stats footer
├── ActivityPanel.tsx             # Panel 3 (BACK-LEFT): icon sidebar + tabs + activity feed + footer
├── PulsingDot.tsx                # Reusable green status dot with CSS pulse animation
├── StarRating.tsx                # Star display component using Lucide Star icons
├── StatusBadge.tsx               # Colored status badge with Lucide icon (no emoji)
├── usePeriodicUpdates.ts         # Custom hook: manages periodic item insertion across panels
└── panelData.ts                  # Static demo data: Hebrew names, phone numbers, timestamps, items
```

**Rationale for this split:**
- `DashboardPanel` is reusable across all 3 panels (shared visual shell)
- Each panel component owns its specific content layout (different per panel)
- `panelData.ts` separates data from presentation (easy to modify Hebrew content)
- `usePeriodicUpdates` encapsulates the timer/state logic (testable, reusable)
- Small utility components (`PulsingDot`, `StarRating`, `StatusBadge`) prevent repetition

### Pattern 1: Glass Header + Solid Body Panel (DashboardPanel Shell)

**What:** Each panel has a glassmorphic header area (status bar, title, tabs) and a solid dark body (#151516) for list content. This matches real SaaS dashboard design and the CONTEXT.md specification.

**When to use:** All 3 panels use this shell.

**Example:**
```tsx
// Source: CONTEXT.md visual treatment specs + LINEAR-BLUEPRINT.md
interface DashboardPanelProps {
  title: string;
  statusIndicator?: React.ReactNode;  // PulsingDot or status text
  headerContent?: React.ReactNode;    // Tabs, filters, search bar
  children: React.ReactNode;           // List items (panel body)
  footerContent?: React.ReactNode;     // Stats footer
  shimmer?: boolean;                   // Only Reviews panel gets shimmer
  className?: string;
  style?: React.CSSProperties;
}

function DashboardPanel({
  title, statusIndicator, headerContent,
  children, footerContent, shimmer, className, style
}: DashboardPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",              // 16px radius per Blueprint
        shimmer && "shimmer-border",                 // Reuse existing shimmer CSS
        className
      )}
      style={style}
    >
      {/* Glass header - per CONTEXT.md: rgba(255,255,255,0.05) bg, 20px blur, 8% border */}
      <div className={cn(
        "px-4 py-3",
        "bg-[rgba(255,255,255,0.05)]",
        "backdrop-blur-[20px]",
        "border-b border-white/[0.08]",
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {statusIndicator}
            <span className="text-sm font-semibold text-[#FAFAFA]">{title}</span>
          </div>
        </div>
        {headerContent}
      </div>

      {/* Solid body - per CONTEXT.md: #151516 with 1px rgba(255,255,255,0.08) border */}
      <div className="bg-[#151516] p-3">
        {children}
      </div>

      {/* Stats footer */}
      {footerContent && (
        <div className="bg-[#151516] border-t border-white/[0.08] px-4 py-2 text-xs text-[#71717A]">
          {footerContent}
        </div>
      )}
    </div>
  );
}
```

**CSS specifics from CONTEXT.md:**
- Glass header: `background: rgba(255,255,255,0.05)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(255,255,255,0.08)`
- Solid body: `background: #151516`, `border: 1px solid rgba(255,255,255,0.08)`
- Border-radius: `16px` (rounded-2xl in Tailwind)
- Deep shadow: `0 20px 60px rgba(0,0,0,0.3)` per Blueprint
- Mobile fallback for glass: solid `rgb(24 24 27 / 0.8)` without blur (pattern from GlassCard)

### Pattern 2: CSS 3D Perspective Container

**What:** A wrapper div with `perspective` that gives all child panels a shared vanishing point, creating the illusion of tilted dashboard panels floating in 3D space.

**When to use:** The outer container wrapping all 3 panels (desktop only).

**Key insight from codebase:** PhoneMockup.tsx already uses `transformStyle: "preserve-3d"` with `rotateX`/`rotateY` via motion/react successfully in production. The same technique applies here but with static tilt.

**Example:**
```tsx
// Source: PhoneMockup.tsx pattern + CONTEXT.md "5-8 degree perspective tilt"
function AutopilotPanels() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Desktop: 3D perspective cascade */}
      <div
        className="hidden lg:block relative"
        style={{
          perspective: '1200px',          // Moderate depth
          perspectiveOrigin: '50% 40%',   // Slightly above center
        }}
      >
        <div
          className="relative grid grid-cols-3"
          style={{
            transform: 'rotateX(5deg) rotateY(-3deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Panels in source order: Reviews, Leads, Activity */}
          {/* In RTL, first = rightmost = front panel */}
        </div>
      </div>

      {/* Mobile: Simple vertical stack */}
      <div className="lg:hidden space-y-4 px-4">
        {/* All 3 panels stacked, full-width, no perspective */}
      </div>
    </div>
  );
}
```

**Critical: Overlapping Z-layers with RTL cascade:**
```css
/* Per CONTEXT.md: ~40px overlap between panels */
/* In RTL, CSS grid naturally places first item on the right */

/* Panel 1 - Reviews (FRONT, rightmost in RTL) */
.panel-front {
  z-index: 30;
  transform: translateZ(40px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

/* Panel 2 - Leads (MIDDLE) */
.panel-middle {
  z-index: 20;
  transform: translateZ(0px);
  margin-inline-start: -40px;   /* Overlap with front panel */
  margin-inline-end: -40px;     /* Overlap with back panel */
  box-shadow: 0 25px 70px rgba(0,0,0,0.35);
}

/* Panel 3 - Activity (BACK, leftmost in RTL) */
.panel-back {
  z-index: 10;
  transform: translateZ(-40px);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
}
```

**CRITICAL: CSS properties that break preserve-3d:**
```css
/* NEVER apply these to the preserve-3d container or its children: */
overflow: hidden;      /* Flattens 3D context */
filter: blur();        /* Flattens 3D context */
clip-path: ...;        /* Flattens 3D context */
mix-blend-mode: ...;   /* Flattens 3D context */
opacity: ... on parent /* Can cause issues with child 3D */
contain: paint;        /* Flattens 3D context */
```

**SAFE: shimmer-border uses `overflow: hidden` on individual panel, NOT on the grid container.**
The shimmer pseudo-element needs overflow:hidden to clip. This is fine because each panel is its own stacking context -- the `preserve-3d` is on the parent grid, not on individual panels.

### Pattern 3: Periodic Live-Update Animation with AnimatePresence

**What:** Every 5-7 seconds, new items slide into each panel's list. New items enter from top, existing items shift down, bottom item fades out. After 3-4 cycles, pause 30 seconds.

**When to use:** The periodic update behavior for all 3 panels.

**Codebase precedent:** `FloatingActivityWidget.tsx` uses `AnimatePresence mode="wait"` with `setTimeout` cycling (5s show, 3s hide). This pattern adapts it for list item cycling.

**Example:**
```tsx
// Source: Derived from FloatingActivityWidget.tsx pattern + CONTEXT.md periodic specs
import { useReducedMotion } from "motion/react";

interface PeriodicUpdateConfig {
  items: Item[];              // Full pool of items to cycle through
  visibleCount: number;       // How many visible at once (4-5)
  intervalMs: number;         // 5000-7000ms
  maxCycles: number;          // 3-4 before pause
  pauseMs: number;            // 30000ms pause
}

function usePeriodicUpdates(config: PeriodicUpdateConfig) {
  const prefersReducedMotion = useReducedMotion();
  const [visibleItems, setVisibleItems] = useState(
    config.items.slice(0, config.visibleCount)
  );
  const [nextIndex, setNextIndex] = useState(config.visibleCount);
  const [cycleCount, setCycleCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Skip periodic updates for reduced motion
  if (prefersReducedMotion) return { visibleItems, isUpdating: false };

  useEffect(() => {
    if (isPaused) {
      timerRef.current = setTimeout(() => {
        setIsPaused(false);
        setCycleCount(0);
      }, config.pauseMs);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }

    timerRef.current = setInterval(() => {
      setVisibleItems(prev => {
        const newItem = config.items[nextIndex % config.items.length];
        return [newItem, ...prev.slice(0, config.visibleCount - 1)];
      });
      setNextIndex(i => i + 1);
      setCycleCount(c => {
        if (c >= config.maxCycles - 1) {
          setIsPaused(true);
          return 0;
        }
        return c + 1;
      });
    }, config.intervalMs);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, nextIndex]);

  return { visibleItems, isUpdating: !isPaused };
}
```

**List rendering with AnimatePresence:**
```tsx
// Source: motion/react AnimatePresence pattern (verified in ConversionSection.tsx, FloatingActivityWidget.tsx)
import { AnimatePresence, m } from "motion/react";
import { cssEasing, cssDuration } from "@/lib/animation";

function AnimatedItemList({ items }: { items: ListItem[] }) {
  return (
    <div className="space-y-1.5 overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <m.div
            key={item.id}
            layout                                    // GPU-accelerated position transitions
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.2, ease: cssEasing.standard },
              layout: { duration: 0.3, ease: cssEasing.standard },
              scale: { duration: 0.2 },
            }}
          >
            <ItemRow {...item} />
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

**Key points:**
- `mode="popLayout"` prevents layout jumps during exit (item exits visually while siblings already reflow)
- `layout` prop enables automatic position animation when items shift (GPU-accelerated)
- `initial={false}` prevents entrance animation on first render (items are already there)
- `key={item.id}` is critical -- each item needs a stable unique key for AnimatePresence to track

### Pattern 4: Count-Up Animation for Numbers (Entrance Only)

**What:** Rating (4.5 -> 4.8), lead count (0 -> 12), etc. animate on entrance.

**Codebase precedent:** `SocialProofCounters.tsx` uses `useSpring` + `useTransform` + `useInView` for this exact pattern. **Reuse directly.**

**Example:**
```tsx
// Source: SocialProofCounters.tsx (existing codebase, verified)
import { useRef, useEffect } from "react";
import { useInView, useSpring, useTransform, m } from "motion/react";

function AnimatedNumber({
  from, to, decimals = 0
}: { from: number; to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const springValue = useSpring(from, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const display = useTransform(springValue, v =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("he-IL")
  );

  useEffect(() => {
    if (isInView) springValue.set(to);
  }, [isInView, to, springValue]);

  return <m.span ref={ref} className="tabular-nums">{display}</m.span>;
}

// Usage in ReviewsPanel:
<AnimatedNumber from={4.5} to={4.8} decimals={1} />  // Rating
// Usage in LeadsPanel footer:
<AnimatedNumber from={0} to={12} />                   // Lead count
```

### Pattern 5: RTL-Aware Dashboard Layout

**What:** All panel content is RTL (Hebrew). Text right-aligned, icons on right, tabs flow right-to-left.

**Codebase precedent:** The entire app uses `dir="rtl"`. Tailwind logical properties are used throughout (`ps-`, `pe-`, `start-`, `end-`, `ms-`, `me-`).

**RTL rules for panels:**
- Use `text-start` not `text-right` (logical)
- Use `ps-`/`pe-` not `pl-`/`pr-` (logical)
- Use `start-`/`end-` for absolute positioning (logical)
- Use `ms-`/`me-` for margins (logical)
- Use `margin-inline-start`/`margin-inline-end` for panel overlap (flips automatically in RTL)
- Flexbox and Grid respect `dir="rtl"` automatically
- Star ratings should use `dir="ltr"` locally (stars always fill left-to-right)
- Panel cascade: first in source = rightmost in RTL = front panel (Reviews)

**Activity Panel sidebar special case:**
The Activity Dashboard has a narrow icon sidebar (~40px). In RTL, this sidebar should be on the RIGHT side (the "start" side). Use `flex-row` which becomes right-to-left in RTL automatically.

### Pattern 6: Staggered Entrance Animation

**What:** Panels fade-up with scale, staggered 150ms apart, triggered by viewport entry.

**Codebase precedent:** `SectionReveal.tsx` with stagger. Also, the Hero.tsx GSAP timeline dispatches `hero-entrance-complete` event.

**Decision: Use Motion, sync with hero via event.**
```tsx
// Source: SectionReveal.tsx pattern + CONTEXT.md entrance spec
const panelVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: {
      duration: cssDuration.revealMin,     // 300ms per CONTEXT.md
      ease: cssEasing.standard,            // [0.33, 1, 0.68, 1]
    },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }, // 150ms stagger per CONTEXT.md
  },
};

// Wait for hero entrance to complete before showing panels
const [heroComplete, setHeroComplete] = useState(false);
useEffect(() => {
  const handler = () => setHeroComplete(true);
  window.addEventListener("hero-entrance-complete", handler);
  const fallback = setTimeout(() => setHeroComplete(true), 2000);
  return () => {
    window.removeEventListener("hero-entrance-complete", handler);
    clearTimeout(fallback);
  };
}, []);
```

### Anti-Patterns to Avoid

- **Reusing GlassCard/ShimmerCard for panels:** CONTEXT.md explicitly says "Custom panel components (don't force-fit existing GlassCard/ShimmerCard -- too different)." Panels need glass-header + solid-body split.
- **Using Three.js for 3D:** Overkill. CSS perspective handles 5-8 degrees.
- **Animating layout properties:** Never animate width, height, margin, padding per MOTION-08 rule. Use transform and opacity only. Use motion `layout` prop for position changes.
- **Emoji for status indicators:** CONTEXT.md explicitly forbids this. Use Lucide icons + colored dots/badges.
- **Placing panels outside hero:** This was the primary failure of the previous attempt. Panels go INSIDE the hero section.
- **overflow:hidden on preserve-3d container:** This flattens the 3D context. Apply overflow:hidden only on individual panel children, not the grid container.
- **Mouse-tracking parallax on panels:** Unlike PhoneMockup, the panels should have STATIC tilt. Mouse parallax on 3 content-rich panels would be distracting and hurt readability.
- **Continuous number animation:** Numbers only animate on ENTRANCE (count-up). Periodic updates are for LIST ITEMS, not number counters.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Count-up numbers | Custom interval counter | `useSpring` + `useTransform` from motion/react | Already proven in SocialProofCounters.tsx. Handles easing, spring physics, display formatting |
| Item enter/exit animation | Custom opacity toggling with setTimeout | `AnimatePresence` from motion/react | Handles mount/unmount animations with proper cleanup. Used in FloatingActivityWidget.tsx and ConversionSection.tsx |
| Item position shifting | Manual translateY calculation | `layout` prop on `m.div` | GPU-accelerated automatic position animation. No manual position math |
| Viewport detection | IntersectionObserver | `useInView` from motion/react | Already used in 5+ components. Handles cleanup and options |
| Reduced motion check | `window.matchMedia` | `useReducedMotion` from motion/react | SSR-safe, reactive. Already used in SectionReveal.tsx, TestimonialsCarousel.tsx |
| Shimmer border animation | Custom CSS gradient | Existing `.shimmer-border` class in globals.css | Already implemented with @property GPU acceleration, Safari fallback, reduced motion support |
| Class composition | Manual string concat | `cn()` from utils.ts | Already used everywhere. Handles Tailwind merge conflicts |
| 3D perspective | Three.js / WebGL | CSS `perspective` + `transform` | PhoneMockup proves this works in production |
| Icon library | Custom SVGs or emoji | `lucide-react` | Already installed (v0.563.0), used throughout codebase |
| RTL detection | Manual `dir` check | `useDirection()` hook from hooks/useDirection.ts | Already built, handles mutation observation |
| Hero entrance sync | Custom timing logic | `hero-entrance-complete` event | Already dispatched by Hero.tsx at 1000ms. ActivityFeed.tsx already listens for it |

**Key insight:** The codebase already has EVERY building block needed. No new libraries, no new CSS techniques. The challenge is **composition** -- combining existing patterns into 3 much more complex UI panels.

## Common Pitfalls

### Pitfall 1: Panel Content Overflow / Clipping

**What goes wrong:** Detailed SaaS panel content (header + tabs + 5 list items + footer) overflows panel height, especially when back panels are shorter for depth effect.
**Why it happens:** Fixed-height panels with too much content. CONTEXT.md says "varying panel sizes (S/M/L) for depth."
**How to avoid:**
- Use `overflow: hidden` on the panel body (NOT on the perspective container)
- Set `max-h-` with overflow hidden so last item is partially cut off (per CONTEXT.md: "some partially cut off at bottom to suggest more")
- Size panels by content: Reviews (L, tallest, front), Leads (M), Activity (S, shortest, back)
- The partially-cut-off effect creates realism -- real dashboards have scrollable lists
**Warning signs:** Content spilling outside panel borders, text truncation breaking Hebrew words, last item cut mid-character

### Pitfall 2: Performance with 3 Complex Panels + Continuous Animations

**What goes wrong:** 3 panels each with periodic item animations, shimmer, pulsing dots, plus count-up -- all running simultaneously causes jank on lower-end devices.
**Why it happens:** Too many concurrent animations, especially if any are non-GPU-accelerated.
**How to avoid:**
- **Only ONE shimmer** (Reviews panel only, per CONTEXT.md decision)
- **Only ONE pulsing dot per panel** (CSS animation, GPU-accelerated via opacity only)
- **Stagger periodic updates** across panels. Don't update all 3 at the same millisecond. Offset each panel by ~2 seconds: Activity at 5s, Leads at 7s, Reviews at 9s
- Use motion's `layout` prop for item position changes (GPU-accelerated transforms)
- Use `will-change: transform, opacity` during animation, remove after (pattern from ActivityFeed.tsx)
- Apply `contain: layout style` on the panels container (pattern from globals.css)
- Count-up animations are one-time (`useInView once: true`) -- they end quickly
- On mobile (no 3D perspective), performance is naturally better
**Warning signs:** Dropped frames during periodic updates, high CPU in Chrome Performance profiler, battery drain

### Pitfall 3: 3D Perspective Breaking on Mobile

**What goes wrong:** CSS perspective and rotateX/rotateY cause layout issues on mobile -- panels distorted, content unreadable, overlap creates tap-target confusion.
**Why it happens:** Perspective transform doesn't scale down gracefully to small screens. Overlapping panels are unusable on touch.
**How to avoid:**
- Per CONTEXT.md: "Mobile: all 3 panels stack vertically, full-width, full detail"
- **Desktop ONLY:** perspective + tilt + overlap + Z-layers
- **Mobile:** Simple vertical stack, no perspective, no overlap, full-width panels
- Use `hidden lg:block` / `lg:hidden` (pattern from existing hero grid)
- Each mobile panel gets full-width with same content detail
**Warning signs:** Panels overlapping on mobile, unreadable content at small sizes, tap targets obscured

### Pitfall 4: Periodic Update Timer Memory Leaks

**What goes wrong:** `setInterval` + `setTimeout` for periodic updates not properly cleaned up on unmount.
**Why it happens:** Component unmount doesn't clear timers. Multiple effect re-runs create duplicate timers.
**How to avoid:**
- Return cleanup functions from ALL `useEffect` hooks
- Use `useRef` for timer IDs (stable across renders)
- Clear all timers in cleanup function
- Use `useReducedMotion` to skip periodic updates entirely when reduced motion is preferred
- Pattern from FloatingActivityWidget.tsx: `return () => clearTimeout(hideTimer)`
**Warning signs:** Animation speeds up over time (duplicate intervals), console warnings about setState on unmounted component, memory usage grows

### Pitfall 5: Hero Layout Breaking When Panels Added

**What goes wrong:** Hero section's `min-h-[100dvh]` with centered flex layout breaks when 3 large panels are added below the 2-column grid. Content pushes too far down or hero becomes excessively tall.
**Why it happens:** Current hero has a 2-column grid (HeroContent + PhoneMockup). Adding a full-width row of 3 panels changes the vertical flow significantly.
**How to avoid:**
- Per CONTEXT.md: "Hero flow: H1 -> Subtitle -> CTAs -> Autopilot Panels -> Hero Form"
- **Option A (recommended):** Add panels as a full-width row below the 2-column grid, still inside `<Hero>`. The hero `min-h-[100dvh]` becomes a minimum -- panels can extend below the fold (inviting scroll). Adjust hero padding as needed.
- **Option B:** Place panels in page.tsx between `<Hero>` and the hero-form section (technically outside hero, but visually continuous).
- The hero currently centers content vertically with `flex items-center`. With panels, it may need to switch to `flex items-start` with explicit top padding, or remove the min-height constraint.
**Warning signs:** Massive whitespace above/below panels, content crammed together, panels entirely below the fold

### Pitfall 6: RTL Panel Cascade Direction

**What goes wrong:** Panel cascade goes left-to-right instead of right-to-left in RTL context.
**Why it happens:** Using physical positioning (left/right) instead of logical properties (start/end), or hardcoding CSS grid column order.
**How to avoid:**
- CSS Grid with `dir="rtl"` automatically places first item on the RIGHT
- The "front-right to back-left" cascade happens automatically when:
  1. First panel in source order = Reviews (front)
  2. Grid places it rightmost in RTL
  3. Z-index + translateZ handles depth
- Use `margin-inline-start`/`margin-inline-end` for overlap (these flip correctly in RTL)
- **Test:** Temporarily add `dir="ltr"` to verify cascade reverses
**Warning signs:** Front (Reviews) panel appears on left instead of right

### Pitfall 7: shimmer-border Breaking 3D Context

**What goes wrong:** The `.shimmer-border` class uses `overflow: hidden` on the element. If applied to a child of the preserve-3d container, it could flatten sibling 3D transforms.
**Why it happens:** `overflow: hidden` creates a new stacking context that can interfere with preserve-3d.
**How to avoid:**
- The shimmer-border is on the individual panel div, NOT on the grid container
- Each panel is its own stacking context -- this is fine
- The `preserve-3d` is on the parent grid wrapper, which has NO overflow or filter
- Verify: the shimmer ::before pseudo-element uses `z-index: -1` which works within the panel's stacking context
**Warning signs:** Front panel's shimmer causes middle/back panels to lose 3D depth

## Code Examples

### Example 1: Pulsing Status Dot (CSS-Only Animation)

```tsx
// Source: CONTEXT.md "Green status dot pulses gently (2s cycle, opacity 0.6->1->0.6)"
// Uses pure CSS animation for zero JS overhead, GPU-accelerated opacity
import { cn } from "@/lib/utils";

function PulsingDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full bg-emerald-500",
        "animate-[pulse-dot_2s_ease-in-out_infinite]",
        className
      )}
      aria-hidden="true"
    />
  );
}

// Required CSS in globals.css:
// @keyframes pulse-dot {
//   0%, 100% { opacity: 0.6; }
//   50% { opacity: 1; }
// }
//
// Reduced motion handled by existing globals.css rule:
// @media (prefers-reduced-motion: reduce) {
//   *, *::before, *::after {
//     animation-duration: 0.01ms !important;
//     animation-iteration-count: 1 !important;
//   }
// }
```

### Example 2: Star Rating Display with Lucide (No Emoji)

```tsx
// Source: CONTEXT.md "Big rating display (4.8 stars)" + "No standard emojis"
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const fullStars = Math.floor(rating);
  const hasPartial = rating % 1 >= 0.3;
  const sizeClass = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";

  return (
    // Stars always fill left-to-right regardless of RTL
    <div className="flex items-center gap-0.5" dir="ltr">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < fullStars
              ? "fill-amber-400 text-amber-400"
              : i === fullStars && hasPartial
              ? "fill-amber-400/50 text-amber-400"
              : "fill-zinc-700 text-zinc-700"
          )}
        />
      ))}
    </div>
  );
}
```

### Example 3: Status Badge with Colored Dot (No Emoji)

```tsx
// Source: CONTEXT.md "Status badges: use premium icon equivalents, NOT emoji"
import { Circle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LeadStatus = "new" | "pending" | "completed";

const statusConfig: Record<LeadStatus, {
  icon: typeof Circle; label: string; dotColor: string; bgColor: string;
}> = {
  new:       { icon: Circle,       label: "חדש",    dotColor: "text-emerald-400", bgColor: "bg-emerald-400/15" },
  pending:   { icon: Clock,        label: "ממתין",   dotColor: "text-amber-400",   bgColor: "bg-amber-400/15" },
  completed: { icon: CheckCircle2, label: "הושלם",  dotColor: "text-blue-400",    bgColor: "bg-blue-400/15" },
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const { icon: Icon, label, dotColor, bgColor } = statusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
      dotColor, bgColor,
    )}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
```

### Example 4: Review List Item (Detailed Product UI)

```tsx
// Source: CONTEXT.md "Review items: avatar placeholder, name, stars, text preview, response status"
import { User, CheckCircle2 } from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  responded: boolean;
}

function ReviewListItem({ item }: { item: ReviewItem }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-white/[0.06] last:border-0">
      {/* Avatar placeholder */}
      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <User className="w-3.5 h-3.5 text-[#71717A]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#FAFAFA]">{item.name}</span>
          <StarRating rating={item.rating} size="sm" />
        </div>
        <p className="text-[11px] text-[#A1A1AA] truncate mt-0.5">{item.text}</p>
      </div>

      {/* Response status */}
      {item.responded && (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
      )}
    </div>
  );
}
```

### Example 5: Lead Card Item (Detailed CRM UI)

```tsx
// Source: CONTEXT.md "Lead cards: status dot, name, phone, source, status badge, action icons"
import { Phone, MoreHorizontal } from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: "new" | "pending" | "completed";
}

function LeadCardItem({ item }: { item: LeadItem }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-white/[0.06] last:border-0">
      {/* Status dot */}
      <span className={cn(
        "w-2 h-2 rounded-full shrink-0",
        item.status === "new" ? "bg-emerald-400" :
        item.status === "pending" ? "bg-amber-400" : "bg-blue-400"
      )} />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#FAFAFA]">{item.name}</span>
          <StatusBadge status={item.status} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Phone className="w-3 h-3 text-[#71717A]" />
          <span className="text-[11px] text-[#A1A1AA]" dir="ltr">{item.phone}</span>
          <span className="text-[11px] text-[#52525B]">•</span>
          <span className="text-[11px] text-[#71717A]">{item.source}</span>
        </div>
      </div>

      {/* Action icons */}
      <MoreHorizontal className="w-4 h-4 text-[#52525B] shrink-0" />
    </div>
  );
}
```

Note: Phone numbers use `dir="ltr"` to display correctly (052-XXX-XXXX should not reverse).

### Example 6: Mobile Stacked Layout

```tsx
// Source: CONTEXT.md "Mobile: all 3 panels stack vertically, full-width, full detail"
function AutopilotPanels() {
  return (
    <div className="w-full">
      {/* Desktop: 3D perspective cascade */}
      <div
        className="hidden lg:block relative max-w-5xl mx-auto"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative flex justify-center"
          style={{
            transform: "rotateX(5deg) rotateY(-3deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <ReviewsPanel className="panel-front" />
          <LeadsPanel className="panel-middle" />
          <ActivityPanel className="panel-back" />
        </div>
      </div>

      {/* Mobile: Simple vertical stack */}
      <div className="lg:hidden space-y-4 px-4">
        <ReviewsPanel mobile />
        <LeadsPanel mobile />
        <ActivityPanel mobile />
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion/react` (same lib, renamed) | motion v12 | Import from `motion/react`. Already correct in codebase |
| `AnimatePresence mode="sync"` | `mode="popLayout"` for lists | motion v11 | `popLayout` prevents layout jumps during exit. Better for list item removal |
| Manual position calc for shifting items | `layout` prop on `m.div` | motion v3+ | GPU-accelerated automatic position transitions |
| Manual IntersectionObserver | `useInView` from motion/react | motion v10+ | Simpler API, automatic cleanup. Used in 5+ components |
| Tailwind config file | CSS-first config (@theme in globals.css) | Tailwind v4 | No tailwind.config.ts. All tokens in globals.css |
| CSS transitions for springs | Motion `springLinear` / `springGentle` presets | Phase 30-31 | More natural feel, already tuned for Linear aesthetic |

**Deprecated/outdated:**
- `framer-motion` package name: Use `motion` package, import from `motion/react`
- `AnimatePresence mode="wait"` for lists: Use `mode="popLayout"` -- exits don't block entries
- Raw `setInterval` without ref cleanup: Use `useRef` for timer IDs + return cleanup
- Tailwind `@apply` for complex dynamic styles: Use `cn()` + conditional classes

## Open Questions

1. **Hero Structure Modification**
   - What we know: CONTEXT.md says "Hero flow: H1 -> Subtitle -> CTAs -> Autopilot Panels -> Hero Form." Current Hero.tsx has 2-column grid (HeroContent + PhoneMockup).
   - What's unclear: Does PhoneMockup + ActivityFeed stay alongside the autopilot panels? They serve a similar purpose (showing Findo working). Having both might be visually redundant.
   - Recommendation: The planner should decide one of: (A) Keep PhoneMockup, add panels as new full-width row below the 2-col grid inside Hero; (B) Replace PhoneMockup with autopilot panels entirely (panels become the hero visual); (C) Keep PhoneMockup on mobile only, show panels on desktop only.

2. **Exact Panel Dimensions at Desktop**
   - What we know: 3-column equal-width with ~40px overlap. Varying S/M/L heights.
   - What's unclear: Exact pixel widths and heights at 1200px container.
   - Recommendation: Start with ~320px width per panel (960px total, fitting in container with overlap). Heights: Reviews ~340px, Leads ~310px, Activity ~280px. Adjust during visual verification step.

3. **Periodic Update Staggering Across Panels**
   - What we know: All 3 panels receive updates every 5-7 seconds. Max 3-4 cycles then 30s pause.
   - What's unclear: Do all panels update simultaneously, or staggered? Simultaneous could look coordinated but risks performance.
   - Recommendation: Stagger by 2 seconds each. Activity updates at T+5s, Leads at T+7s, Reviews at T+9s. This creates a wave effect and spreads GPU load.

4. **shimmer-border Compatibility with Custom Panel Shell**
   - What we know: `.shimmer-border` needs `overflow: hidden` and uses `::before`/`::after` pseudo-elements.
   - What's unclear: Whether the DashboardPanel's glass-header + solid-body structure conflicts with shimmer's pseudo-elements (shimmer uses `::after` to cover the center with card background).
   - Recommendation: Test during implementation. The shimmer `::after` sets `background: hsl(var(--card))` which may not match the split glass/solid design. May need a custom shimmer variant for the panel shell.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** -- Read and analyzed 25+ source files:
  - `website/components/sections/hero/Hero.tsx` -- Current hero structure, GSAP entrance, hero-entrance-complete event
  - `website/components/sections/hero/HeroContent.tsx` -- Hero content flow, badge/headline/CTA structure
  - `website/components/sections/hero/PhoneMockup.tsx` -- CSS 3D perspective pattern (preserve-3d, rotateX/Y, mouse parallax)
  - `website/components/sections/hero/ActivityFeed.tsx` -- GSAP periodic animation, hero-entrance-complete sync, timer cleanup
  - `website/components/sections/hero/ActivityCard.tsx` -- Simple card component with Lucide icons
  - `website/components/sections/social-proof/FloatingActivityWidget.tsx` -- AnimatePresence periodic cycling pattern
  - `website/components/sections/social-proof/SocialProofCounters.tsx` -- useSpring count-up pattern
  - `website/components/motion/SectionReveal.tsx` -- Staggered viewport entrance with reduced motion
  - `website/components/motion/variants.ts` -- All reusable Motion variants (fadeInRise, stagger, etc.)
  - `website/components/ui/card.tsx` -- GlassCard, ShimmerCard, AnimatedCard component patterns
  - `website/lib/animation.ts` -- All spring presets, cssEasing, cssDuration tokens
  - `website/lib/hooks/useDirection.ts` -- RTL detection and slide offset calculation
  - `website/lib/gsapConfig.ts` -- GSAP setup with ScrollTrigger registration
  - `website/lib/utils.ts` -- cn() utility
  - `website/app/globals.css` -- All CSS tokens, shimmer-border, glass utilities, reduced motion, pulsing animations
  - `website/app/page.tsx` -- Page structure, hero form placement, section ordering
  - `website/package.json` -- Exact library versions
- `.planning/phases/32-autopilot-hero-visualization/32-CONTEXT.md` -- All locked user decisions
- `design-bible/LINEAR-BLUEPRINT.md` -- Visual specifications (colors, shadows, borders, animation curves, typography)
- `Screenshots of the linear website/01-hero-floating-ui-panels.png` -- Visual reference for panel placement context
- `Screenshots of the linear website/05-timeline-3d-visualization.png` -- Visual reference for 3D depth/perspective
- `Screenshots of the linear website/06-project-glass-cards.png` -- Visual reference for glass card style with status indicators

### Secondary (MEDIUM confidence)
- **motion/react API patterns** -- Based on verified usage in 15+ codebase components. AnimatePresence (2 components), useInView (6 components), useSpring (2 components), useTransform (3 components), layout prop (not yet used but available in v12.29.2), useReducedMotion (4 components). All patterns verified through existing working code.
- **CSS perspective/transform** -- Verified via PhoneMockup.tsx which uses preserve-3d with rotateX/rotateY + useSpring successfully in production.

### Tertiary (LOW confidence)
- **AnimatePresence mode="popLayout" for lists** -- This mode is available in motion v12 but not yet used in the codebase. It should be tested during implementation. Fallback: `mode="sync"` or no mode.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All libraries already installed and extensively used in codebase (0 new deps)
- Architecture patterns: HIGH -- All building blocks exist, verified through 25+ file analysis
- Component structure: HIGH -- Based on CONTEXT.md explicit decisions + codebase conventions
- 3D CSS perspective: HIGH -- Proven in PhoneMockup.tsx, MDN documented
- Periodic animations: HIGH -- Pattern from FloatingActivityWidget.tsx with AnimatePresence
- RTL layout: HIGH -- Entire codebase is RTL-native with logical properties
- Pitfalls: HIGH -- Based on prior failure analysis + specific codebase constraints
- Code examples: HIGH -- Derived from existing working codebase patterns with CONTEXT.md specs applied

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days -- stable stack, no library upgrades expected)
