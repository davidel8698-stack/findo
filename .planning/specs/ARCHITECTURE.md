# Architecture Specification: Text Journey Section (Rebuild)

> Three-layer scroll architecture. Apple-quality fade reveals. Zero JavaScript animation libraries.

---

## 1. Component Tree

```
TextJourneySection              ← Layer 1: Container (layout only)
│
├── TextBlock [id="hook"]       ← Layer 2: Individual block (renders lines)
│   ├── <p> "אם הגעתם לכאן"
│   ├── <p> "יתכן שמשהו בשיווק של העסק שלכם"
│   └── <p> "לא מרגיש יציב."
│
├── TextBlock [id="pain"]
│   ├── <p> "יש תקופות עם פניות"
│   └── <p> "ויש תקופות שפחות."
│
├── TextBlock [id="confusion"]
│   ├── <p> "לא תמיד ברור:"
│   ├── <p> "מה באמת מביא לקוחות"
│   ├── <p> "על מה שווה להשקיע"
│   └── <p> "ומה סתם רעש"
│
├── TextBlock [id="problem"]
│   ├── <p> "רוב הפתרונות דורשים"
│   └── <p> "הרבה כסף, ניהול שוטף וידע."
│
├── TextBlock [id="mismatch"]
│   ├── <p> "וזה לא מותאם לאופן שבו"
│   └── <p> "עסק קטן באמת מתנהל."
│
├── TextBlock [id="tease"]
│   ├── <p> "אם אתם מחפשים שיווק"
│   └── <p> "שלא יצריך ממכם התעסקות בשוטף."
│
└── TextBlock [id="resolution" variant="resolution"]
    └── <p> "הגעתם למקום הנכון."
```

**Key difference from original**: Lines are `<p>` elements with plain text. NO word-splitting into `<span>` elements. The DOM node count drops from ~80 spans to ~20 paragraphs.

---

## 2. File Structure

```
website/components/sections/text-journey/
├── index.ts                    # Barrel export: { TextJourneySection }
├── TextJourneySection.tsx      # Layer 1: Container component
├── TextBlock.tsx               # Layer 2: Block component
├── useScrollFade.ts            # Layer 3: Scroll-driven fade hook
└── text-journey.module.css     # All styles (typography tokens + animations)
```

4 files. No utility functions, no GSAP imports, no word-splitting helpers.

---

## 3. TypeScript Interfaces

```typescript
// ── Content Data ──────────────────────────────────────

interface JourneyBlockData {
  id: string;
  lines: string[];
}

// ── Component Props ───────────────────────────────────

interface TextBlockProps {
  lines: string[];
  variant?: "normal" | "resolution";
}

// ── Hook Return ───────────────────────────────────────

interface ScrollFadeResult {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
  hasExited: boolean;
}
```

### Why this interface design:

- **`TextBlockProps`** receives only what it needs: the text lines and the variant. No `className` override needed — the component owns its styling entirely.
- **`ScrollFadeResult`** returns a ref, and two booleans. The component uses these to apply CSS classes. ALL animation math lives in CSS, not in JavaScript return values like `opacity: 0.73` or `blur: 4.2px`.
- **No `progress` number**. The original returned a 0-1 float that triggered re-renders on every scroll frame. This design uses discrete state transitions (invisible → visible → exited) that only cause re-renders at threshold boundaries.

---

## 4. Layer Specifications

### Layer 1: TextJourneySection (Container)

**Responsibility**: Layout wrapper. Maps content data to TextBlock components.

```
Does:
  - Renders <section> with section-level styles (background, padding, direction)
  - Holds the content data array as a module-level constant
  - Maps each block to a <TextBlock> component
  - Passes variant="resolution" to the final block

Does NOT:
  - Touch scroll behavior
  - Manage any state
  - Import any hooks beyond React defaults
```

**Content data**: Defined as a module-level constant (not inside the component). 6 normal blocks + 1 resolution block. Same content as the original:

```typescript
const journeyBlocks: JourneyBlockData[] = [
  { id: "hook",      lines: ["אם הגעתם לכאן", "יתכן שמשהו בשיווק של העסק שלכם", "לא מרגיש יציב."] },
  { id: "pain",      lines: ["יש תקופות עם פניות", "ויש תקופות שפחות."] },
  { id: "confusion", lines: ["לא תמיד ברור:", "מה באמת מביא לקוחות", "על מה שווה להשקיע", "ומה סתם רעש"] },
  { id: "problem",   lines: ["רוב הפתרונות דורשים", "הרבה כסף, ניהול שוטף וידע."] },
  { id: "mismatch",  lines: ["וזה לא מותאם לאופן שבו", "עסק קטן באמת מתנהל."] },
  { id: "tease",     lines: ["אם אתם מחפשים שיווק", "שלא יצריך ממכם התעסקות בשוטף."] },
];

const resolution: JourneyBlockData = {
  id: "resolution",
  lines: ["הגעתם למקום הנכון."],
};
```

### Layer 2: TextBlock (Individual Block)

**Responsibility**: Renders one emotional block. Connects to scroll behavior via the hook.

```
Does:
  - Calls useScrollFade() to get { ref, isVisible, hasExited }
  - Attaches ref to the block wrapper <div>
  - Applies CSS classes based on state:
    - Default: styles.block (invisible)
    - isVisible && !hasExited: styles.block + styles.visible (fade in)
    - hasExited: styles.block + styles.exited (fade out)
  - Renders lines as <p> elements with staggered animation-delay
  - Applies styles.resolution class when variant === "resolution"

Does NOT:
  - Compute any opacity, blur, transform, or scale values in JS
  - Split words into spans
  - Use useMemo for trivial operations
```

**Stagger pattern**: Each `<p>` line receives a CSS custom property `--line-index` set via inline `style`. CSS uses this for `transition-delay` calculation:

```tsx
<p style={{ '--line-index': index } as React.CSSProperties}>
  {line}
</p>
```

```css
.line {
  transition-delay: calc(var(--line-index) * 80ms);
}
```

This keeps stagger logic in CSS while only passing the index from JS. No per-frame recalculation.

### Layer 3: useScrollFade (Hook)

**Responsibility**: The ONLY piece that touches scroll behavior. Returns discrete visibility states.

**Chosen approach: IntersectionObserver with bidirectional tracking.**

```
Input: none (creates its own ref internally)
Output: { ref, isVisible, hasExited }

State machine:
  ┌────────────┐    enters viewport    ┌─────────────┐    exits top    ┌────────────┐
  │  INVISIBLE  │ ──────────────────→  │   VISIBLE    │ ────────────→ │   EXITED   │
  │ isVisible:F │    (bottom 20%)      │ isVisible:T  │  (top 20%)    │ hasExited:T│
  │ hasExited:F │                      │ hasExited:F  │               │ isVisible:T│
  └────────────┘                      └─────────────┘               └────────────┘
        ↑                                    ↑                            │
        │            re-enters viewport      │     scrolls back down      │
        └────────────────────────────────────┴────────────────────────────┘
```

**Implementation detail**:

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        setHasExited(false);
      } else if (entry.boundingClientRect.top < 0) {
        // Element has scrolled above viewport
        setHasExited(true);
      } else {
        // Element is below viewport (scrolled back up past it)
        setIsVisible(false);
        setHasExited(false);
      }
    });
  },
  {
    threshold: 0,
    rootMargin: "-20% 0px -20% 0px",
  }
);
```

**Why this rootMargin**: `-20% 0px -20% 0px` shrinks the effective viewport by 20% on top and bottom. This means:
- A block entering from below triggers at the bottom 80% line (Apple's pattern)
- A block exiting at the top triggers at the top 20% line
- The "active zone" is the middle 60% of the viewport

**Why NOT `animation-timeline: view()`**:

| Factor | `animation-timeline: view()` | IntersectionObserver |
|--------|------------------------------|---------------------|
| Browser support | Chrome 115+, no Firefox, no Safari | All browsers since 2016 |
| iOS Safari | Not supported | Full support |
| Progressive enhancement | Needs full JS fallback anyway | IS the universal solution |
| Complexity | CSS + JS fallback = two systems | One system |
| Control | Tied to scroll position (continuous) | Discrete thresholds (efficient) |

**Verdict**: `animation-timeline: view()` would require us to maintain TWO animation systems (CSS for Chrome, JS for Safari/Firefox). Since our target audience includes iOS users (the product is for Israeli small businesses who primarily use iPhones), Safari support is mandatory. IntersectionObserver with CSS transitions gives us a single, universal, performant solution.

**Why NOT continuous scroll tracking (like the original GSAP scrub)**:

The original used `scrub: 0.3` which means the animation progress is continuously tied to scroll position — opacity 0.73 at 73% scroll through the trigger zone, etc. This requires:
1. Scroll event listener firing on every frame
2. `setProgress(self.progress)` causing React re-render on every frame
3. `useMemo(() => calculateVisuals(progress))` recomputing on every render
4. Inline styles applied on every render

Our approach uses **discrete transitions**: the block is either fading in, fully visible, or fading out. The actual interpolation (0 → 1 opacity over 600ms) is handled by CSS `transition`, which runs on the compositor thread without touching JavaScript or React.

---

## 5. Scroll Trigger Points

```
Viewport
┌────────────────────────────┐
│                            │  ← 0% (top of viewport)
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  ← 20% — EXIT trigger (block fades out here)
│                            │
│                            │
│        ACTIVE ZONE         │  ← 20%-80% — Block is fully visible
│       (middle 60%)         │
│                            │
│                            │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │  ← 80% — ENTER trigger (block fades in here)
│                            │
└────────────────────────────┘  ← 100% (bottom of viewport)


Timeline for a single block as user scrolls down:

  Block below viewport     →  opacity: 0, translateY: 20px
         │
  Block hits 80% line      →  CSS transition begins (600ms ease-out)
         │                      opacity: 0 → 1
         │                      translateY: 20px → 0
         │                      Lines stagger: +80ms each
         │
  Block in active zone     →  opacity: 1, translateY: 0 (fully visible)
         │
  Block hits 20% line      →  CSS transition begins (400ms ease-in)
         │                      opacity: 1 → 0
         │                      translateY: 0 → -10px
         │
  Block above viewport     →  opacity: 0, translateY: -10px
```

### Exact CSS transition values:

| State transition | Duration | Easing | Properties |
|-----------------|----------|--------|------------|
| invisible → visible (fade in) | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | opacity, transform |
| visible → exited (fade out) | 400ms | `cubic-bezier(0.4, 0, 1, 1)` | opacity, transform |
| Per-line stagger | 80ms * line-index | — | via transition-delay |

**Why asymmetric durations**: Fade-in is slower (600ms) to feel deliberate and cinematic. Fade-out is faster (400ms) because the user's attention has already moved past — lingering exit animations feel sluggish.

**Easing choices**:
- Fade-in: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, gentle settle. This is the "expo-out" feel Apple uses on their product pages.
- Fade-out: `cubic-bezier(0.4, 0, 1, 1)` — gentle start, quick finish. The block seems to "let go" gracefully.

---

## 6. Data Flow Diagram

```
                    ┌─────────────────────────────┐
                    │    Content Data (static)      │
                    │    journeyBlocks[]            │
                    │    resolution                 │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │   TextJourneySection          │
                    │   <section>                   │
                    │     map → TextBlock           │
                    └──────────────┬───────────────┘
                                   │ props: { lines, variant }
                    ┌──────────────▼───────────────┐
                    │   TextBlock                   │
                    │   calls useScrollFade()       │
                    │   applies CSS classes         │
                    │   renders <p> per line        │
                    └──────────────┬───────────────┘
                                   │ uses
                    ┌──────────────▼───────────────┐
                    │   useScrollFade (hook)        │
                    │   IntersectionObserver        │
                    │   returns { ref,              │
                    │     isVisible, hasExited }    │
                    └──────────────┬───────────────┘
                                   │ triggers
                    ┌──────────────▼───────────────┐
                    │   CSS Transitions             │
                    │   .visible { opacity: 1 }     │
                    │   .exited  { opacity: 0 }     │
                    │   Compositor thread — no JS   │
                    └──────────────────────────────┘
```

**Render flow**:
1. TextJourneySection renders 7 TextBlock components (static, never re-renders)
2. Each TextBlock calls useScrollFade once on mount
3. useScrollFade creates ONE IntersectionObserver per block (7 total)
4. As user scrolls, observer fires callbacks at threshold boundaries ONLY (not every frame)
5. Callback sets boolean state → React adds/removes CSS class → CSS transition runs on GPU
6. The transition interpolation (0→1 opacity) happens entirely in CSS on the compositor thread

**Re-render count comparison**:

| Scenario (scrolling through one block) | Original (GSAP) | Rebuild |
|----------------------------------------|-----------------|---------|
| Entering viewport | ~60 re-renders (scrub) | 1 re-render |
| Fully visible, scrolling through | ~120 re-renders (scrub) | 0 re-renders |
| Exiting viewport | ~60 re-renders (scrub) | 1 re-render |
| **Total per block** | **~240 re-renders** | **2 re-renders** |

---

## 7. Performance Analysis

### Why this architecture is better than the original

| Metric | Original (GSAP scrub) | Rebuild (IntersectionObserver + CSS) |
|--------|----------------------|--------------------------------------|
| **JS bundle** | +44KB (gsap) + 12KB (ScrollTrigger) | 0KB added |
| **DOM nodes per block** | 15-25 `<span>` (word-split) + `<p>` wrappers | 2-4 `<p>` elements |
| **Total DOM nodes** | ~150 | ~25 |
| **Scroll handler** | Per-frame (requestAnimationFrame) | Threshold-only (2 fires per block) |
| **React re-renders** | ~240 per block scroll-through | 2 per block scroll-through |
| **Animation thread** | Main thread (JS inline styles) | Compositor thread (CSS transitions) |
| **State updates** | `setProgress(float)` every frame | `setIsVisible(bool)` at boundary |
| **will-change usage** | On every word span (anti-pattern) | On block element only (correct) |
| **Memoization** | 3 useMemo hooks (wasted on trivial ops) | 0 useMemo hooks needed |

### Compositor thread advantage

CSS `opacity` and `transform` transitions run on the compositor thread, meaning:
- No layout recalculation (no reflow)
- No paint operations on the main thread
- Smooth 60fps even on low-end devices
- The main thread is free for other work during animations

The original applied `opacity`, `filter: blur()`, `transform`, and `will-change` as inline styles via JavaScript, which forces style recalculation on the main thread for every scroll frame.

### Memory footprint

- **Original**: 7 IntersectionObserver instances (unused after GSAP was added) + 7 ScrollTrigger instances + per-word state tracking
- **Rebuild**: 7 IntersectionObserver instances (one per block). Each observer tracks exactly one element. Total memory overhead is negligible.

---

## 8. Accessibility

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  .block {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

When reduced motion is preferred, all blocks render at full visibility with no animation. The hook still runs (isVisible defaults to true behavior) but CSS overrides ensure no visual transitions.

### Semantic HTML

- `<section>` for the journey container
- `<div>` for each block (grouping element)
- `<p>` for each line (paragraph content)
- `dir="rtl"` inherited from section CSS
- `text-align: center` on all blocks

No `aria-hidden` toggling. The text is always in the DOM and accessible to screen readers regardless of visual opacity.

---

## 9. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Fast scrolling past all blocks | Each block gets isVisible=true then hasExited=true in rapid succession. CSS transitions may not complete but states are correct. |
| Scrolling back up | hasExited resets to false, isVisible resets as block re-enters. Full bidirectional support. |
| Page load with block already in viewport | IntersectionObserver fires immediately on observe() if element is in viewport. Block fades in on load. |
| Resize/orientation change | IntersectionObserver automatically recalculates. rootMargin percentages scale with viewport. |
| Tab away and back | No scroll events missed. Observer state is current. Transitions pick up where they left off. |

---

## 10. Resolution Variant Differences

The final "resolution" block (`"הגעתם למקום הנכון."`) uses the same architecture but with CSS overrides:

| Property | Normal blocks | Resolution block |
|----------|---------------|------------------|
| Font size | clamp(48px, 4.2vw, 58px) | clamp(56px, 7vw, 88px) |
| Font weight | 500 | 700 |
| Line height | 1.2 | 1.1 |
| Letter spacing | -0.02em | -0.03em |
| Text color | var(--text-secondary) | var(--text-primary) |
| Margin top | 0 (uses block-gap) | 280px (dramatic pause) |
| Fade-in duration | 600ms | 800ms (more dramatic) |
| translateY range | 20px | 30px (more movement) |

NO shimmer animations. NO gradient text. NO breathing glow. The resolution block is simply bigger, bolder, brighter. This is the Apple way — drama through scale and weight, not through decorative effects.

---

*Architecture spec authored for Text Journey rebuild. Designed for maximum performance with minimum complexity.*
