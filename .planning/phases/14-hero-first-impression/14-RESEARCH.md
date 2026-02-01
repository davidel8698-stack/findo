# Phase 14: Hero & First Impression - Research

**Researched:** 2026-02-01
**Domain:** Hero section design, animations, LCP optimization, Hebrew RTL conversion copywriting
**Confidence:** MEDIUM-HIGH

## Summary

This research covers the technical and strategic requirements for building a high-converting hero section with animated activity feed visualization for a Hebrew RTL SaaS landing page. The hero must pass the 5-second test while maintaining LCP under 2.5 seconds despite complex animations.

The recommended approach combines:
1. **Motion library for simpler animations** (already integrated via LazyMotion) for fade-ins and stagger effects
2. **GSAP with @gsap/react hook** for complex timeline sequences in the activity feed
3. **Pure CSS phone mockup** using Tailwind (no external dependencies)
4. **Strategic trust signal placement** near CTA with specific number format
5. **Problem-focused Hebrew headline** addressing the target audience's failed agency/DIY history

**Primary recommendation:** Build the activity feed as a GSAP timeline with 4-5 floating cards inside a CSS phone mockup, auto-playing on load with spring-based easing. Use `useGSAP` hook for proper cleanup. Preload any hero images with `fetchpriority="high"` to protect LCP.

## Standard Stack

The established libraries/tools for this phase:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion/react | 11.x | Simple animations (fade, stagger) | Already integrated, LazyMotion configured |
| gsap | 3.12+ | Complex timeline sequences | Industry standard, now 100% free including all plugins |
| @gsap/react | 2.x | React integration with auto-cleanup | Official GSAP React hook, handles strict mode |
| Tailwind CSS | 4.0 | Phone mockup styling | Already established in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | (installed) | Icons in activity cards | Already in project |
| next/image | (built-in) | Optimized hero images | Any images in hero section |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP timeline | Motion sequences | Motion sequences less powerful for complex orchestration |
| CSS phone mockup | react-device-mockup | External dependency, less control |
| Custom activity cards | Pre-built component | No existing component matches exact need |

**Installation:**
```bash
# GSAP is likely already installed, if not:
npm install gsap @gsap/react
```

## Architecture Patterns

### Recommended Component Structure
```
website/components/
  sections/
    hero/
      Hero.tsx                 # Main hero section
      ActivityFeed.tsx         # Phone mockup with animated cards
      ActivityCard.tsx         # Individual activity card
      HeroContent.tsx          # Headline, subheadline, CTA
      TrustSignal.tsx          # Above-fold trust element
      StickyCtaBar.tsx         # Floating/sticky CTA (mobile)
```

### Pattern 1: GSAP Timeline with useGSAP Hook
**What:** Create a sequenced animation that auto-plays card appearances
**When to use:** Activity feed animation with precise timing control
**Example:**
```typescript
// Source: GSAP official React docs
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function ActivityFeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "back.out(1.7)", // Bouncy feel
        duration: 0.5
      }
    });

    // Stagger cards appearing
    tl.from(".activity-card", {
      y: 50,
      opacity: 0,
      scale: 0.8,
      stagger: {
        each: 0.3,
        from: "start"
      }
    });

    // Hold final state (no loop per CONTEXT.md)
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Cards render here */}
    </div>
  );
}
```

### Pattern 2: CSS Phone Mockup (No Dependencies)
**What:** Pure Tailwind phone frame with content area
**When to use:** Hero visual container
**Example:**
```typescript
// Source: Flowbite patterns adapted for Tailwind 4
export function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto border-card-foreground/20 bg-card border-[12px] rounded-[2.5rem] h-[500px] w-[240px] md:h-[600px] md:w-[290px] shadow-xl">
      {/* Notch */}
      <div className="w-[100px] h-[20px] bg-card-foreground/20 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute" />

      {/* Side buttons */}
      <div className="h-[32px] w-[3px] bg-card-foreground/30 absolute -start-[15px] top-[72px] rounded-s-lg" />
      <div className="h-[46px] w-[3px] bg-card-foreground/30 absolute -start-[15px] top-[124px] rounded-s-lg" />
      <div className="h-[64px] w-[3px] bg-card-foreground/30 absolute -end-[15px] top-[142px] rounded-e-lg" />

      {/* Screen content */}
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-background p-4">
        {children}
      </div>
    </div>
  );
}
```

### Pattern 3: Sticky CTA with Proper Placement
**What:** Mobile-first sticky CTA that appears on scroll
**When to use:** Always-visible conversion action
**Example:**
```typescript
// Source: UX Movement best practices
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero CTA
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-border md:hidden">
      <Button size="lg" className="w-full">
        {/* Hebrew: Start free trial */}
      </Button>
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Lazy-loading LCP elements:** Never use `loading="lazy"` on hero images - kills LCP
- **JavaScript-dependent hero rendering:** Hero must be server-rendered, not client-loaded
- **Looping animations:** Per CONTEXT.md, play once then hold (no infinite loops)
- **Blocking animations on paint:** Use `will-change: transform` and GPU-accelerated properties only
- **Oversized trust signal bars:** Keep trust signals subtle, not dominant

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animation cleanup | Manual cleanup in useEffect | `useGSAP` hook from @gsap/react | Handles React 18 strict mode, auto-reverts |
| Stagger timing math | Custom delay calculations | GSAP `stagger` property | Battle-tested, handles edge cases |
| Phone frame SVG | Custom SVG paths | Pure CSS with Tailwind | Simpler, responsive, themeable |
| Spring physics | Manual spring equations | GSAP `ease: "back.out(1.7)"` or Motion springs | Optimized, GPU-accelerated |
| RTL icon flipping | Manual transform logic | CSS `start`/`end` + Icon rtlFlip prop | Already built into Icon component |

**Key insight:** The activity feed animation looks complex but is straightforward with GSAP timeline + stagger. Don't overcomplicate with manual orchestration.

## Common Pitfalls

### Pitfall 1: LCP Destroyed by Animation Loading
**What goes wrong:** Hero animation JavaScript blocks rendering, LCP jumps to 4+ seconds
**Why it happens:** GSAP/animation code imported synchronously, not code-split
**How to avoid:**
- Keep hero content (headline, CTA) server-rendered
- Load animation logic with dynamic import or keep it lightweight
- Use `fetchpriority="high"` on any hero images
- Never lazy-load above-fold content
**Warning signs:** LCP element is the animation container, not text content

### Pitfall 2: Animation Memory Leaks in React
**What goes wrong:** Animations continue after unmount, cause errors, consume memory
**Why it happens:** GSAP instances not cleaned up, especially with ScrollTrigger
**How to avoid:**
- Always use `useGSAP` hook instead of manual `useEffect`
- Register GSAP plugins once at module level
- Use `scope` property to contain selector targeting
**Warning signs:** Console errors about unmounted components, sluggish navigation

### Pitfall 3: Sticky CTA Obscuring Content
**What goes wrong:** Floating CTA covers important content, frustrates users
**Why it happens:** Fixed position without considering safe areas, thumb zones
**How to avoid:**
- Only show sticky CTA after user scrolls past initial CTA
- Use `safe-area-inset-bottom` for iOS devices
- Keep CTA bar height moderate (60-72px max)
- Test on real devices, not just simulators
**Warning signs:** User complaints, accidental taps, low mobile conversion

### Pitfall 4: RTL Layout Breaks
**What goes wrong:** Hero looks "off" because visual hierarchy is LTR-oriented
**Why it happens:** Content designed LTR first, then flipped
**How to avoid:**
- Design RTL-first: headline on right, visual on left
- Use logical properties (`ms-`, `me-`, `start`, `end`) not physical (`ml-`, `mr-`)
- Keep play buttons, numbers, and progress indicators LTR
- Mirror layout but not certain UI conventions (scrollbars stay right)
**Warning signs:** Hero feels "backwards," reading flow disrupted

### Pitfall 5: Over-Trusting Above Fold
**What goes wrong:** Trust signals feel desperate, reduce credibility
**Why it happens:** Adding too many badges, testimonials, and logos above fold
**How to avoid:**
- Use ONE trust signal above fold (customer count OR key metric)
- Avoid perfect 5.0 scores (feels fake)
- Prefer specific numbers ("573 businesses") over rounded ("500+")
- Keep trust signal visually subdued, not competing with CTA
**Warning signs:** "They're trying too hard" feeling, inverted U-curve effect

## Code Examples

### Activity Card Component
```typescript
// Source: Project patterns + GSAP docs
import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms";
import { type LucideIcon, MessageSquare, Star, Camera, Phone } from "lucide-react";

interface ActivityCardProps {
  type: "review" | "post" | "lead" | "call";
  title: string;
  subtitle: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  review: Star,
  post: Camera,
  lead: MessageSquare,
  call: Phone,
};

const colorMap: Record<string, string> = {
  review: "bg-amber-500/20 text-amber-500",
  post: "bg-emerald-500/20 text-emerald-500",
  lead: "bg-blue-500/20 text-blue-500",
  call: "bg-purple-500/20 text-purple-500",
};

export function ActivityCard({ type, title, subtitle, className }: ActivityCardProps) {
  const IconComponent = iconMap[type];

  return (
    <div
      className={cn(
        "activity-card flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm",
        className
      )}
    >
      <div className={cn("p-2 rounded-lg", colorMap[type])}>
        <Icon icon={IconComponent} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
    </div>
  );
}
```

### Hero Section Layout (RTL-Native)
```typescript
// Source: RTL best practices research
export function Hero() {
  return (
    <section className="min-h-[100dvh] flex items-center py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content - appears FIRST in DOM for SEO, displays on RIGHT in RTL */}
          <div className="order-2 lg:order-1 text-center lg:text-start">
            <HeroContent />
          </div>

          {/* Visual - appears SECOND in DOM, displays on LEFT in RTL */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### LCP-Safe Image Preloading
```typescript
// In app/layout.tsx or page.tsx head
// Source: web.dev LCP optimization
export const metadata = {
  // ... other metadata
};

// Add to head if hero has a background image
export default function Page() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/hero-bg.webp"
        fetchPriority="high"
      />
      {/* ... */}
    </>
  );
}
```

### Trust Signal Component
```typescript
// Source: Trust signal psychology research
import { cn } from "@/lib/utils";

interface TrustSignalProps {
  value: string; // e.g., "573" - specific, not rounded
  label: string; // e.g., "businesses trust Findo"
  className?: string;
}

export function TrustSignal({ value, label, className }: TrustSignalProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-muted-foreground text-sm",
      className
    )}>
      <span className="font-bold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}
```

## Headline & Copy Recommendations

Based on the CONTEXT.md emotional profile and conversion copywriting research:

### Headline Approach: Problem-Focused with Fresh Start Promise
**Target audience context:** Failed with agencies, failed with DIY, skeptical, anxious, time-poor

**Recommended tone:** Empathetic acknowledgment of past failures + promise of different approach

**Hebrew headline structure (under 8 words):**
- Option A: Direct pain acknowledgment - Speaks to the failure
- Option B: Fresh start promise - Offers hope without overpromising
- Option C: Relief/outcome focus - The emotional payoff

**Subheadline approach:** Explain HOW (the mechanism) rather than doubling down on emotion
- Mentions automation, zero effort, Google Business
- Bridges from emotional headline to logical understanding

**CTA text recommendations:**
- Primary: Value-focused, first-person when possible
- NOT: "Sign up" / "Submit" / "Learn more"
- YES: "Start free trial" / "See how it works" / "Try it free"

## Above-Fold Trust Signal Recommendation

Based on research, recommend **specific customer count** over other options:

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| Customer count ("573 businesses") | Specific numbers build credibility, low cognitive load | Requires real data | **RECOMMENDED** |
| Key metric ("12,000 leads captured") | Impressive if true | May feel like vanity metric | Second choice |
| Star rating | Familiar format | Can feel fake if 5.0, need source | Avoid above-fold |
| Logo bar | High credibility if recognizable | Likely no famous logos yet | Defer to proof section |

**Placement:** Below CTA button, subtle visual treatment, not competing with headline

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| useEffect + manual cleanup | @gsap/react useGSAP hook | 2024 | Eliminates memory leaks, React 18 compatible |
| priority prop on images | fetchPriority="high" + loading="eager" | Next.js 16 | Clearer semantics, better LCP |
| Framer Motion for everything | Motion for simple, GSAP for complex | Ongoing | Better performance for complex sequences |
| Generic trust badges | Specific numeric proof | 2024-2025 | 2% higher conversion with specific numbers |

**Deprecated/outdated:**
- `priority` prop in Next.js Image: Use `fetchPriority` and `loading` instead
- Manual GSAP context cleanup: Use `useGSAP` hook instead
- CSS transforms without `will-change`: Modern browsers optimize better with hints

## Open Questions

1. **Exact customer count for trust signal**
   - What we know: Need specific number, not rounded
   - What's unclear: Current actual customer count for Findo
   - Recommendation: Use placeholder "[X] businesses" in implementation, fill with real data

2. **Activity card content specifics**
   - What we know: Should show review replied, photo posted, lead captured, call handled
   - What's unclear: Exact Hebrew text for each card type
   - Recommendation: Define content in task, allow flexibility during implementation

3. **Hero section height decision**
   - What we know: Options are full viewport vs. peek below
   - What's unclear: Best for this specific audience
   - Recommendation: Full viewport (`min-h-[100dvh]`) for maximum impact, mobile will naturally show less

## Sources

### Primary (HIGH confidence)
- [GSAP Official React Docs](https://gsap.com/resources/React/) - useGSAP hook, cleanup patterns
- [GSAP Staggers Guide](https://gsap.com/resources/getting-started/Staggers/) - Stagger animation patterns
- [web.dev LCP Optimization](https://web.dev/articles/optimize-lcp) - Performance patterns
- [Next.js Image Component Docs](https://nextjs.org/docs/app/api-reference/components/image) - fetchPriority

### Secondary (MEDIUM confidence)
- [Flowbite Device Mockups](https://flowbite.com/docs/components/device-mockups/) - Phone mockup CSS patterns
- [Landing Page Flow CTA Best Practices](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages) - Sticky CTA patterns
- [Trustmary Trust Signals](https://trustmary.com/social-proof/trust-signals/) - Trust signal psychology
- [Reffine RTL Design Guide](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices) - RTL patterns

### Tertiary (LOW confidence)
- Various Medium articles on GSAP + Next.js optimization - Patterns verified against official docs
- Conversion copywriting research - General principles, not Hebrew-specific

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project or officially documented
- Architecture: HIGH - Patterns verified against official GSAP and Next.js docs
- Animation patterns: HIGH - GSAP official documentation
- LCP optimization: HIGH - web.dev and Next.js official guidance
- Trust signal psychology: MEDIUM - Multiple credible sources agree
- Hebrew copywriting: LOW - No Hebrew-specific research found, applying general principles
- Pitfalls: MEDIUM - Based on documented patterns and common issues

**Research date:** 2026-02-01
**Valid until:** 2026-03-01 (30 days - stable domain, but animation libraries update frequently)
