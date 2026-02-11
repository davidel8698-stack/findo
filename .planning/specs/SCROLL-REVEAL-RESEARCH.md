# Scroll-Reveal Research: World-Class Text Animation Patterns

> Research compiled from Apple, Linear, Stripe, and modern web animation best practices.
> For FINDO TextJourneySection rebuild.

---

## 1. Executive Summary — Top 5 Patterns That Define "Premium"

### Pattern 1: Scroll-Linked Opacity (Word-by-Word)
The signature Apple technique. Text is split into individual words, each receiving its own opacity range mapped to scroll progress. Words reveal sequentially as scroll advances, creating a reading-pace animation that feels like the page is "speaking" to you. No time-based easing — purely scroll-driven.

### Pattern 2: Background-Gradient Text Reveal
A radial or linear gradient is applied as the text color via `background-clip: text`. The gradient position shifts based on scroll progress, creating a luminous "highlight sweeping through words" effect. Used on Apple iPhone pages.

### Pattern 3: Sticky Container + Scroll Canvas
The section spans 2-5x viewport height. Content is `position: sticky` (or `fixed`) in the center. Scroll distance becomes the animation timeline. This gives users control over pacing while keeping content centered and cinematic.

### Pattern 4: Atmospheric Layering
Premium sites never reveal text in isolation. Ambient effects — subtle gradients, noise textures, floating particles, or radial glows — surround text, creating depth. The text feels embedded in an environment, not pasted on a flat surface.

### Pattern 5: Transform + Opacity Only
Every world-class implementation restricts animations to `transform` and `opacity` properties exclusively. These are GPU-composited, avoiding layout recalculation and paint operations. This is non-negotiable for 60fps scroll performance.

---

## 2. Apple Patterns — Specific Techniques

### 2.1 AirPods Pro / iPhone Page: Scroll-Linked Text Opacity

**Architecture:**
```
<section style="height: 500vh">        <!-- Scroll canvas -->
  <div style="position: sticky; top: 50%">  <!-- Centered content -->
    <p>
      <span style="opacity: var(--word-1)">Word</span>
      <span style="opacity: var(--word-2)">by</span>
      <span style="opacity: var(--word-3)">word</span>
    </p>
  </div>
</section>
```

**How it works:**
1. Section height is 3-5x viewport (provides scroll distance for animation)
2. Text container is `position: sticky; top: 50%` — stays centered
3. Each word is wrapped in a `<span>` with individual opacity
4. JavaScript maps `scrollYProgress` (0 to 1) to each word's opacity range
5. Words have sequential, slightly overlapping ranges

**Range calculation for N words:**
```javascript
// Each word gets a proportional slice of scroll progress
const start = i / words.length;
const end = start + (1 / words.length);
// word i is invisible at scrollProgress < start, fully visible at scrollProgress >= end
```

**Key detail:** Apple uses a "shadow" layer — a dimmed version of the full text sits behind the animated layer. This means you always see the text structure, but words "light up" as you scroll. The shadow is typically at 10-20% opacity.

### 2.2 iPhone 14 Pro: Gradient Text Reveal

**Technique:** `background-clip: text` with animated `background-position`

```css
.reveal-text {
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(255,255,255,0.9),    /* center: bright */
    rgba(255,255,255,0.3) 20%, /* mid: dimmed */
    transparent 50%            /* edge: invisible */
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 400% 800%;
  background-position: 50% calc(100% * var(--reveal-value));
}
```

**How it works:**
1. Text color is `transparent`; visible color comes from `background-clip: text`
2. A radial gradient (bright center, transparent edges) acts as a "spotlight"
3. `background-size` is much larger than the element (400% x 800%)
4. `background-position` is driven by a CSS custom property
5. JavaScript updates `--reveal-value` from 0 to 1 based on scroll position
6. The spotlight sweeps through the text as you scroll

**Result:** Text appears to be illuminated by a moving light source — extremely cinematic.

### 2.3 Apple's Canvas Frame Technique (Product Imagery)

For product visuals (not text), Apple uses:
- Pre-rendered image sequences (100-400 frames)
- `<canvas>` element with `position: fixed`
- `scrollFraction = scrollTop / (scrollHeight - windowHeight)`
- `frameIndex = Math.floor(scrollFraction * frameCount)`
- `requestAnimationFrame` for GPU-accelerated rendering

This is the technique behind their product rotation/reveal sequences. Not directly applicable to text but shows their commitment to scroll-driven rather than time-driven animation.

### 2.4 Performance Rules (From Apple's Implementation)

- **Only animate `transform` and `opacity`** — these are GPU-composited
- **No layout-triggering properties** — never animate width, height, top, left, margin, padding
- **requestAnimationFrame** for all scroll-linked updates
- **Device-specific optimization** — smaller assets for mobile, reduced frame counts
- **Prefers-reduced-motion** — always check and provide static fallback

---

## 3. Linear Patterns — Specific Techniques

### 3.1 Technology Stack
Linear's website is built with **Next.js + TypeScript + Tailwind CSS + Framer Motion** — the exact same stack as FINDO. This makes their patterns directly applicable.

### 3.2 Design Philosophy

**Dark-first design:**
- Pure dark backgrounds (#000 to #0a0a0a range)
- Text hierarchy through opacity, not color (white at 100%, 60%, 30%)
- Subtle border lines at ~8% white opacity
- Radial gradient glows behind key content sections

**Typography approach:**
- Large, bold headings (48-72px) with tight letter-spacing (-0.02em to -0.04em)
- Body text at comfortable reading size (18-20px) with generous line-height (1.6-1.8)
- Text reveals are viewport-triggered, not continuous scroll-linked

**Scroll behavior:**
- Uses `whileInView` from Framer Motion for section entrance animations
- Staggered children with `staggerChildren: 0.1` in parent variants
- Opacity + translateY (0,20px -> 0,0) for text entrance
- Shimmer/gradient effects using CSS animation loops (not scroll-linked)

### 3.3 Linear's Signature Shimmer Effect

```css
.shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.05) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

This runs continuously, not on scroll — it's ambient atmospheric effect.

### 3.4 Linear's Gradient Glow Pattern

Behind important text sections, Linear places radial gradient "pools of light":

```css
.glow {
  position: absolute;
  width: 600px;
  height: 400px;
  background: radial-gradient(
    ellipse at center,
    rgba(100, 100, 255, 0.08) 0%,
    transparent 70%
  );
  filter: blur(80px);
  pointer-events: none;
}
```

These are static or slowly animated — they create atmosphere without consuming scroll budget.

---

## 4. Stripe Patterns — Specific Techniques

### 4.1 IntersectionObserver for Animation Triggers

From Stripe's technical blog:
```javascript
function observeScroll(element, callback) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(element); // Fire once
      }
    },
    { threshold: 1.0 } // Fully visible
  );
  observer.observe(element);
}
```

**Key insight:** Stripe triggers animations on viewport entry, then lets them play out on a timeline. They do NOT use continuous scroll-linked animation for most text sections.

### 4.2 Performance First

Stripe's rules (from their "Connect: Behind the Front-End Experience" blog):
- **Animate only `transform` and `opacity`** — offloads to GPU
- **Use `will-change` CSS property** on elements about to animate
- **Use `requestIdleCallback`** for non-critical animation setup
- **`backface-visibility: hidden`** to reduce repaints
- **Keep durations under 500ms** for UI animations

### 4.3 Stripe's WebGL Gradient Background

Their famous mesh gradient uses:
- Custom "miniGL" library (~10kb, ~800 lines)
- WebGL canvas for GPU-accelerated gradient rendering
- ScrollObserver to pause when not visible
- Blend modes for text layering over gradient

Not directly applicable to text reveal, but shows their commitment to GPU-accelerated, performant effects.

---

## 5. Technical Recommendations — For Our Next.js + Framer Motion Stack

### 5.1 Recommended Approach: Framer Motion `useScroll` + `useTransform`

**Why Framer Motion over GSAP or CSS scroll-driven animations:**

| Consideration | Framer Motion | GSAP ScrollTrigger | CSS Scroll API |
|--------------|---------------|-------------------|----------------|
| React integration | Native, declarative | Imperative, needs refs | No React API |
| Bundle size | Already in project | +23kb gzipped | 0kb (native) |
| Browser support | All modern | All modern | Chrome/Edge only* |
| Performance | IntersectionObserver-based | Frame-by-frame measurement | GPU-native |
| Developer experience | Excellent with React | Good but imperative | Limited tooling |

*CSS scroll-driven animations landed in Safari 26 (2025) but are still not universally supported for production. Framer Motion is the safest, most React-idiomatic choice.

### 5.2 Core Implementation Pattern

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative inline-block mr-[0.25em]">
      {/* Shadow layer — always visible at low opacity */}
      <span className="opacity-[0.15]">{children}</span>
      {/* Animated layer — fades in on scroll */}
      <motion.span
        className="absolute inset-0"
        style={{ opacity }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function ScrollRevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
    // Animation starts when element top hits 90% of viewport
    // Animation completes when element top hits 25% of viewport
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef}>
      <p className="text-4xl font-semibold leading-relaxed">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}
```

### 5.3 Offset Configuration Guide

The `offset` parameter in `useScroll` controls when animation starts and ends:

```
offset: ["start end", "end start"]
//       [when 0]      [when 1]
```

Format: `"[target edge] [viewport edge]"`
- `"start 0.9"` = element's top edge at 90% of viewport height (near bottom)
- `"start 0.25"` = element's top edge at 25% of viewport height (near top)
- `"center center"` = element center at viewport center

**Recommended offsets for text reveal:**
- Gentle reveal: `["start 0.9", "start 0.35"]` — long scroll distance
- Punchy reveal: `["start 0.8", "start 0.5"]` — shorter, more impactful
- Full-section: `["start end", "end start"]` — maps to entire element visibility

### 5.4 Performance Checklist

1. **Only animate `opacity` and `transform`** — never width, height, color, background
2. **Use `will-change: opacity, transform`** on animated elements (sparingly)
3. **Avoid re-renders** — `useTransform` returns MotionValues, not state; no React re-renders
4. **Respect `prefers-reduced-motion`** — provide instant-visible fallback
5. **Limit animated elements** — 50-100 words is fine; 500+ characters individually will lag
6. **Use `LazyMotion`** if bundle size matters (4.6kb vs 34kb full)

---

## 6. Concrete Implementation Plan — What We Should Build

### Architecture

```
TextJourneySection
├── Sticky wrapper (height: 300vh, contains sticky inner at 50%)
│   └── Content container (sticky, centered)
│       ├── Atmospheric glow (radial gradient, position: absolute)
│       ├── Pain point cards (3-4 cards, each with scroll-linked reveal)
│       │   ├── Icon or emoji (fade + scale on entry)
│       │   ├── Headline (word-by-word opacity reveal)
│       │   └── Description (paragraph fade-in after headline)
│       └── Transition element (gradient fade to next section)
```

### Animation Choreography (Per Card)

**Phase 1 — Entrance (scrollProgress 0.0 → 0.15):**
- Card container: `opacity: 0 → 1`, `translateY: 30px → 0`
- Icon: `scale: 0.8 → 1`, `opacity: 0 → 1`

**Phase 2 — Text Reveal (scrollProgress 0.15 → 0.65):**
- Headline words: sequential opacity reveal (word-by-word)
- Each word: `opacity: 0.15 → 1.0`
- Shadow text layer always visible at 15% opacity for structure

**Phase 3 — Description (scrollProgress 0.55 → 0.85):**
- Description paragraph: `opacity: 0 → 1`, `translateY: 10px → 0`
- Overlaps with end of headline reveal for smooth flow

**Phase 4 — Exit (scrollProgress 0.85 → 1.0):**
- Entire card: `opacity: 1 → 0`, `translateY: 0 → -20px`
- Only if transitioning to next card; final card stays visible

### Atmospheric Effects

1. **Radial glow behind text** — `radial-gradient(ellipse, accent-color at 5-8% opacity, transparent)`
2. **Subtle noise texture** — CSS `background-image` with SVG noise at 2-3% opacity
3. **Ambient border glow** — `box-shadow: 0 0 80px rgba(accent, 0.05)`

### Easing Curves

For scroll-linked animations, easing is built into the scroll mapping (the `useTransform` ranges create natural easing). For time-based entrance animations:

```javascript
// Premium entrance easing (equivalent to Apple's feel)
const premiumEase = [0.25, 0.1, 0.25, 1.0]; // cubic-bezier

// Snappy exit
const exitEase = [0.4, 0.0, 1, 1]; // ease-in

// Framer Motion spring (for subtle bounces)
const premiumSpring = {
  type: "spring",
  stiffness: 100,
  damping: 30,
  mass: 1
};
```

### CSS Custom Properties for Theming

```css
:root {
  --scroll-reveal-shadow-opacity: 0.15;
  --scroll-reveal-glow-color: rgba(56, 136, 56, 0.06);
  --scroll-reveal-glow-size: 400px;
  --scroll-reveal-text-size: clamp(1.5rem, 4vw, 3rem);
  --scroll-reveal-line-height: 1.4;
  --scroll-reveal-letter-spacing: -0.02em;
}
```

### Accessibility

```tsx
// Detect reduced motion preference
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// If reduced motion, show all text immediately at full opacity
// Skip scroll-linked animation entirely
```

---

## Sources

- [Apple-Style Scroll Animations (CSS-Tricks)](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/)
- [Text Gradient Scroll Opacity (Olivier Larose)](https://blog.olivierlarose.com/tutorials/text-gradient-scroll-opacity-v2)
- [CSS Scroll-Driven Animations (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Framer Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations)
- [useScroll Hook API](https://motion.dev/docs/react-use-scroll)
- [Stripe: Connect Front-End Experience](https://stripe.com/blog/connect-front-end-experience)
- [Rebuilding Linear.app (GitHub)](https://github.com/frontendfyi/rebuilding-linear.app)
- [Gradient Text Reveal with Tailwind (Cruip)](https://cruip.com/create-a-gradient-text-reveal-on-scroll-with-tailwind-css-and-js/)
- [GSAP vs Motion Comparison](https://motion.dev/docs/gsap-vs-motion)
- [Apple-Style Text Reveal (Builder.io)](https://www.builder.io/blog/view-timeline)
- [Smashing Magazine: CSS Scroll-Driven Animations](https://www.smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations/)
- [Easing Functions Cheat Sheet](https://easings.net/)
