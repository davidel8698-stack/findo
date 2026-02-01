# Phase 15: Social Proof & Trust - Research

**Researched:** 2026-02-01
**Domain:** Testimonials, carousels, video autoplay, animated counters, floating notifications
**Confidence:** HIGH

## Summary

This phase implements the "proof cascade" - an overwhelming display of social proof elements including testimonial carousels, video testimonials with autoplay, animated counters, floating activity notifications, and trust signals. The project already uses Motion (v12.29) and GSAP (v3.14) for animations, with shadcn/ui components built on Radix primitives.

The standard approach for testimonial carousels uses shadcn/ui's Carousel component (built on Embla Carousel), which has native RTL support via `direction: 'rtl'` option. Video autoplay requires `muted` and `playsInline` attributes per browser policies, with Intersection Observer controlling play/pause. Animated counters should use the existing Motion library with `useSpring` and `useTransform` hooks rather than adding a new dependency. Floating notifications should be custom-built using existing Motion/GSAP patterns rather than third-party social proof widgets.

**Primary recommendation:** Use shadcn/ui Carousel with RTL configuration, Motion for viewport-triggered counters and floating widgets, and custom video component with Intersection Observer for autoplay.

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.29.2 | Animation library | Already in use, provides useInView, useSpring, useTransform |
| gsap | 3.14.2 | Timeline animations | Already in use for complex sequences (ActivityFeed) |
| @gsap/react | 2.1.2 | GSAP React integration | Already configured with ScrollTrigger |

### Supporting (To Add)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| embla-carousel-react | ^8.x | Carousel core | Required by shadcn/ui Carousel component |
| embla-carousel-autoplay | ^8.x | Carousel autoplay plugin | Optional: for auto-advancing testimonials |

### Not Recommended

| Library | Why Skip |
|---------|----------|
| react-countup | Adds unnecessary dependency; Motion useSpring achieves same effect |
| swiper | Embla is lighter, shadcn-native |
| react-toastify/sonner | Wrong use case - these are for user notifications, not social proof |

**Installation:**
```bash
pnpm add embla-carousel-react embla-carousel-autoplay
```

Note: shadcn/ui Carousel CLI command will add these automatically.

## Architecture Patterns

### Recommended Project Structure
```
website/
  components/
    sections/
      social-proof/
        TestimonialsCarousel.tsx     # Main carousel section
        TestimonialCard.tsx          # Individual testimonial card
        VideoTestimonial.tsx         # Video with autoplay behavior
        SocialProofCounters.tsx      # Animated metrics counters
        FloatingActivityWidget.tsx   # Floating notification widget
        TrustBadges.tsx              # Authority/partner logos
        GuaranteeBadge.tsx           # Guarantee badge near CTAs
    sections/
      trust/
        TeamSection.tsx              # Founder story section
        ContactSection.tsx           # Contact information
        FooterSection.tsx            # Footer with legal links
    ui/
      carousel.tsx                   # shadcn/ui carousel (to install)
```

### Pattern 1: RTL Carousel with Motion
**What:** Horizontal swipeable carousel with RTL support
**When to use:** Testimonials section, video gallery
**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/components/carousel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

<Carousel
  dir="rtl"
  opts={{
    direction: "rtl",
    align: "start",
    loop: true,
  }}
  className="w-full"
>
  <CarouselContent className="-ms-4">
    {testimonials.map((t) => (
      <CarouselItem key={t.id} className="ps-4 basis-full md:basis-1/2 lg:basis-1/3">
        <TestimonialCard {...t} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious className="rtl:rotate-180" />
  <CarouselNext className="rtl:rotate-180" />
</Carousel>
```

### Pattern 2: Video Autoplay with Intersection Observer
**What:** Video that plays when in viewport, pauses when out
**When to use:** Video testimonials
**Example:**
```typescript
// Source: Motion docs + browser autoplay policy
"use client";

import { useRef, useEffect } from "react";
import { useInView } from "motion/react";

export function AutoplayVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked - user interaction required
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <div ref={containerRef}>
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        poster={poster}
        className="w-full rounded-lg"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
```

### Pattern 3: Animated Counter with Motion
**What:** Numbers that count up with spring physics when scrolled into view
**When to use:** Metrics display (customers, reviews, leads)
**Example:**
```typescript
// Source: Motion useSpring + useTransform
"use client";

import { useRef, useEffect } from "react";
import { useInView, useSpring, useTransform, m } from "motion/react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  label: string;
}

export function AnimatedCounter({ target, suffix = "", label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const display = useTransform(springValue, (v) =>
    Math.round(v).toLocaleString("he-IL")
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(target);
    }
  }, [isInView, target, springValue]);

  return (
    <div ref={ref} className="text-center">
      <m.span className="text-4xl font-bold text-primary">
        {display}
        {suffix}
      </m.span>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
```

### Pattern 4: Floating Activity Widget
**What:** Notification-style popups showing simulated activity
**When to use:** Social proof - "John from Tel Aviv just signed up"
**Example:**
```typescript
// Source: Custom implementation per CONTEXT.md decisions
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, m } from "motion/react";
import { springBouncy } from "@/lib/animation";

interface Activity {
  message: string;
  location: string;
  timeAgo: string;
}

const activities: Activity[] = [
  { message: "הצטרף לשירות", location: "תל אביב", timeAgo: "לפני 2 דקות" },
  { message: "קיבל 5 לידים חדשים", location: "חיפה", timeAgo: "לפני 5 דקות" },
  // ...more activities
];

export function FloatingActivityWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first notification after delay
    const showTimer = setTimeout(() => setIsVisible(true), 5000);

    // Cycle through activities
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % activities.length);
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(cycleInterval);
    };
  }, []);

  const activity = activities[currentIndex];

  return (
    <div className="fixed bottom-4 start-4 z-50">
      <AnimatePresence>
        {isVisible && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={springBouncy}
            className="bg-card border rounded-lg shadow-lg p-4 max-w-xs"
          >
            <p className="text-sm font-medium">{activity.message}</p>
            <p className="text-xs text-muted-foreground">
              {activity.location} - {activity.timeAgo}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Using third-party social proof SaaS widgets:** Adds external dependency, loading overhead, and doesn't match design system. Build custom.
- **Adding react-countup for counters:** Unnecessary dependency when Motion provides useSpring/useTransform.
- **Autoplaying video with sound:** Browser will block. Always use `muted` attribute.
- **Missing `playsInline` on video:** Safari/iOS will not autoplay without it.
- **Dark patterns in social proof:** No fake urgency, no random/fake notifications. Use realistic timing and pre-set activities.
- **Carousel without RTL direction option:** Will break in Hebrew layout. Always set `direction: 'rtl'` in opts.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Testimonial carousel | Custom swipe detection | shadcn/ui Carousel (Embla) | Touch, keyboard, RTL, loop all handled |
| Number animation | setTimeout/setInterval loops | Motion useSpring + useTransform | Proper spring physics, GPU-accelerated |
| Viewport detection | Manual scroll listener | Motion useInView or Intersection Observer | Performance, debouncing handled |
| Video autoplay logic | Play on mount always | Intersection Observer pattern | Respects viewport, battery-efficient |

**Key insight:** The existing Motion + GSAP stack handles all animation needs. Resist adding specialized libraries when general tools suffice.

## Common Pitfalls

### Pitfall 1: Video Autoplay Blocked by Browser
**What goes wrong:** Video doesn't play, console shows DOMException
**Why it happens:** Chrome/Safari block autoplay with sound since 2018
**How to avoid:** Always include `muted` and `playsInline` attributes
**Warning signs:** Works in dev, fails in production on mobile

### Pitfall 2: Carousel Wrong Direction in RTL
**What goes wrong:** Slides go left when arrows point right, confusing UX
**Why it happens:** Embla defaults to LTR, shadcn arrows not rotated
**How to avoid:** Set `direction: 'rtl'` in opts AND `dir="rtl"` on component AND add `rtl:rotate-180` to arrow buttons
**Warning signs:** Swipe feels "backwards", arrows point wrong way

### Pitfall 3: Counter Animation Starts Before Visible
**What goes wrong:** User scrolls to section, animation already finished
**Why it happens:** Animation starts on component mount, not viewport entry
**How to avoid:** Use useInView with `once: true` to trigger animation
**Warning signs:** Counter shows final number when user reaches it

### Pitfall 4: Floating Widget Performance
**What goes wrong:** Janky animations, layout shifts
**Why it happens:** Widget causes repaints, position not optimized
**How to avoid:** Use `position: fixed`, animate with transform only, use AnimatePresence
**Warning signs:** Main thread blocking when notification appears

### Pitfall 5: Missing Video Poster Image
**What goes wrong:** Black rectangle before video loads
**Why it happens:** No poster attribute, video takes time to decode first frame
**How to avoid:** Always provide `poster` attribute with thumbnail image
**Warning signs:** Visible flash of black on slow connections

### Pitfall 6: Avatar Images Not Optimized
**What goes wrong:** Slow LCP, large file downloads
**Why it happens:** Using raw photos instead of optimized thumbnails
**How to avoid:** Use Next.js Image component with width/height, serve WebP
**Warning signs:** Lighthouse flags images as largest contentful paint

## Code Examples

### shadcn/ui Carousel Installation
```bash
# Install the carousel component
pnpm dlx shadcn@latest add carousel
```

### Testimonial Card with Avatar
```typescript
// Source: Tailwind + shadcn patterns
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  name: string;
  business: string;
  metric: string;
  avatarSrc: string;
}

export function TestimonialCard({
  quote,
  name,
  business,
  metric,
  avatarSrc
}: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col gap-4">
        {/* Quote */}
        <blockquote className="text-lg leading-relaxed">
          "{quote}"
        </blockquote>

        {/* Attribution */}
        <div className="flex items-center gap-3 mt-auto">
          <Image
            src={avatarSrc}
            alt={name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{business}</p>
          </div>
        </div>

        {/* Metric badge */}
        <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full w-fit">
          {metric}
        </div>
      </CardContent>
    </Card>
  );
}
```

### Guarantee Badge Component
```typescript
// Source: Design patterns from CONTEXT.md
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

interface GuaranteeBadgeProps {
  variant?: "inline" | "full";
  className?: string;
}

export function GuaranteeBadge({ variant = "inline", className }: GuaranteeBadgeProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}>
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span>אחריות 100% החזר כספי</span>
      </div>
    );
  }

  return (
    <div className={cn("bg-primary/5 border border-primary/20 rounded-lg p-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <span className="font-semibold">ההבטחה של Findo</span>
      </div>
      <p className="text-sm text-muted-foreground">
        לא מרוצה? קבל החזר מלא תוך 30 יום, ללא שאלות.
      </p>
    </div>
  );
}
```

### Trust Badges Section
```typescript
// Source: Common trust signal patterns
import Image from "next/image";

const badges = [
  { src: "/badges/google-partner.svg", alt: "Google Partner" },
  { src: "/badges/meta-partner.svg", alt: "Meta Partner" },
  { src: "/badges/ssl-secure.svg", alt: "SSL Secure" },
  { src: "/badges/payplus.svg", alt: "PayPlus" },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 py-8">
      {badges.map((badge) => (
        <Image
          key={badge.alt}
          src={badge.src}
          alt={badge.alt}
          width={120}
          height={40}
          className="opacity-60 hover:opacity-100 transition-opacity"
        />
      ))}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion package | motion package (rebranded) | 2025 | Same API, new name |
| react-intersection-observer | Motion useInView hook | Motion v12 | One less dependency |
| Swiper carousel | Embla carousel | 2024-2025 | Lighter, more accessible |
| Custom counter animations | Motion useSpring + useTransform | Motion v10+ | Smoother physics |

**Deprecated/outdated:**
- `framer-motion` import: Use `motion/react` instead (Motion 12+)
- Third-party notification widgets for social proof: Build custom for control

## Open Questions

1. **Video hosting solution**
   - What we know: Videos need to be hosted somewhere, autoplay requires muted
   - What's unclear: Will videos be self-hosted or use Mux/Cloudinary?
   - Recommendation: Use standard HTML video with WebM/MP4 for MVP, consider Mux for production

2. **Testimonial content source**
   - What we know: Need real photos, names, businesses, metrics
   - What's unclear: Are these coming from a CMS, hardcoded, or API?
   - Recommendation: Hardcode for MVP, structure for future CMS integration

3. **Counter data updates**
   - What we know: Counters show customers, reviews collected, leads captured
   - What's unclear: Are these real-time or static snapshot values?
   - Recommendation: Static values for MVP (updated periodically), API endpoint for real-time later

## Sources

### Primary (HIGH confidence)
- shadcn/ui Carousel documentation - RTL support, API, installation
- Embla Carousel options documentation - direction, loop, align options
- Motion documentation - useInView, useSpring, useTransform, AnimatePresence
- Next.js video guide - autoplay, muted, playsInline requirements

### Secondary (MEDIUM confidence)
- GitHub shadcn-ui/ui#6335 - RTL carousel bug fix, flex direction handling
- react-intersection-observer docs - verified useInView patterns
- Browser autoplay policies - Chrome/Safari restrictions (multiple sources agree)

### Tertiary (LOW confidence)
- General carousel library comparisons - ecosystem patterns
- Social proof tool comparisons - validated against custom approach decision

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - shadcn/Embla is documented, Motion already in project
- Architecture: HIGH - patterns verified against official docs and existing codebase
- Pitfalls: HIGH - browser policies well-documented, RTL issues verified

**Research date:** 2026-02-01
**Valid until:** 2026-03-01 (30 days - stable libraries, no breaking changes expected)
