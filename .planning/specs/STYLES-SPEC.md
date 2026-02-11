# Styles Specification: Text Journey Section

> Apple-level CSS for scroll-reveal Hebrew text blocks
> Principle: restraint. Every property earns its place.

---

## 1. Design Philosophy

### What We Keep
- Clean dark background (#050506)
- RTL direction
- Centered, narrow text column
- Scroll-driven opacity/transform transitions
- Generous vertical rhythm
- Reduced motion support

### What We Remove (and Why)

| Removed | Reason |
|---------|--------|
| `::before` radial gradient overlay on section | Adds visual noise to a dark background that should feel void-like. Apple uses flat black. |
| `::after` decorative line between blocks | Dividers break the vertical flow. Whitespace alone separates blocks (Apple pattern). |
| `::before` decorative dots (`"..."`) on resolution block | Ornamental. Apple never uses typographic decorations between content blocks. |
| `@keyframes shimmerText` gradient animation | Moving gradient text is a 2020 trend. Apple uses solid text color, full stop. |
| `@keyframes breatheGlow` pulsing filter | Pulsing glow screams "gaming UI." Apple text is static once revealed. |
| `text-shadow` on resolution words | Glow halos reduce legibility on dark backgrounds. Clean edges read better. |
| `background-clip: text` gradient fill | See shimmer above. Resolution text uses bold weight + solid color for emphasis. |
| `will-change` on individual words | Over-applied. Only blocks need GPU compositing, not every word span. |
| `filter: drop-shadow()` | Drop shadows on text at display sizes create visual mud, not depth. |
| `scale` transforms | Apple text sections never scale text during scroll reveals. Only opacity + translateY. |

---

## 2. Complete CSS Module

The following is the complete `text-journey.module.css`, ready to copy-paste.

```css
/* ==========================================================================
   Text Journey Section — CSS Module

   Apple-quality scroll-reveal for Hebrew display text.
   Background: #050506 | RTL | Heebo font | 5 emotional blocks

   Architecture:
   - .section: full-width dark container
   - .block: individual text group, animated via .visible class
   - .line: <p> element with display typography
   - .resolution: variant class for final dramatic block

   Animation strategy:
   - JS adds/removes .visible class based on scroll position
   - CSS transitions handle the visual change
   - No JS-driven inline styles for animation properties
   ========================================================================== */

/* --------------------------------------------------------------------------
   Section Container
   -------------------------------------------------------------------------- */

.section {
  direction: rtl;
  background: #050506;
  width: 100%;
  padding: 200px 24px;
  position: relative;

  /* No ::before, no ::after, no overflow: hidden (clips nothing useful) */
}

/* --------------------------------------------------------------------------
   Block — Individual Text Group

   Each block is a "scene" in the scroll narrative.
   Transitions are class-driven: .block → .block.visible

   Apple timing: 0.7s ease-out is the signature curve for content reveals.
   translateY(20px) is subtle — enough to feel directional, not enough to
   feel like a "slide in" animation from a WordPress theme.
   Blur of 2px adds depth without making text illegible during transition.
   -------------------------------------------------------------------------- */

.block {
  text-align: center;
  max-width: 900px;
  margin: 0 auto 180px;

  /* Initial state: invisible, slightly below, subtly blurred */
  opacity: 0;
  transform: translateY(20px);
  filter: blur(2px);

  /* Transition all three properties together for cohesive reveal */
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out,
    filter 0.7s ease-out;

  /* GPU compositing hint — only set here, not on children */
  will-change: opacity, transform, filter;
}

.block:last-child {
  margin-bottom: 100px;
}

/* Visible state: toggled by scroll JS */
.block.visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

/* --------------------------------------------------------------------------
   Line — <p> Element with Display Typography

   Values from TYPOGRAPHY-SPEC.md:
   - font-size: clamp(48px, 4.2vw, 58px)  — large, confident
   - line-height: 1.2                       — tight for Hebrew display
   - letter-spacing: -0.02em                — tightens Hebrew at display sizes
   - font-weight: 500                       — Heebo Medium (matches SF Pro Medium)
   - color: #fefffe                         — text-primary from design system

   No word-level styling. Lines are plain <p> elements.
   font-family is inherited from the section/body (Heebo via CSS variable).
   -------------------------------------------------------------------------- */

.line {
  color: var(--text-primary, #fefffe);
  font-size: clamp(48px, 4.2vw, 58px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-align: center;
  margin: 0;
  padding: 4px 0;
  display: block;
}

/* --------------------------------------------------------------------------
   Resolution — Final Dramatic Block

   Larger, bolder typography for emotional climax.
   Uses weight 700 and tighter tracking instead of gradients or glow.
   The size increase alone creates the "payoff" moment.

   Values from TYPOGRAPHY-SPEC.md Section 3:
   - font-size: clamp(56px, 7vw, 88px)
   - font-weight: 700
   - line-height: 1.1
   - letter-spacing: -0.03em
   - margin-top: 280px (dramatic pause before reveal)
   -------------------------------------------------------------------------- */

.resolution {
  margin-top: 280px;
  margin-bottom: 100px;
}

.resolution .line {
  font-size: clamp(56px, 7vw, 88px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;

  /* Solid color. No gradient, no shimmer, no glow.
     The size + weight shift IS the emphasis. */
}

/* ==========================================================================
   Responsive Breakpoints

   Breakpoints match TYPOGRAPHY-SPEC.md exactly:
   - Tablet:       max-width: 1199px
   - Mobile:       max-width: 767px
   - Small mobile: max-width: 480px
   ========================================================================== */

/* --------------------------------------------------------------------------
   Tablet (768px - 1199px)
   -------------------------------------------------------------------------- */

@media (max-width: 1199px) {
  .section {
    padding: 160px 24px;
  }

  .block {
    max-width: 800px;
    margin-bottom: 150px;
  }

  .line {
    font-size: clamp(36px, 5.5vw, 48px);
    line-height: 1.25;
    /* letter-spacing: -0.02em — unchanged */
  }

  .resolution {
    margin-top: 220px;
  }

  .resolution .line {
    font-size: clamp(44px, 8vw, 64px);
    line-height: 1.12;
    letter-spacing: -0.025em;
  }
}

/* --------------------------------------------------------------------------
   Mobile (481px - 767px)
   -------------------------------------------------------------------------- */

@media (max-width: 767px) {
  .section {
    padding: 120px 20px;
  }

  .block {
    max-width: 100%;
    margin-bottom: 120px;
  }

  .line {
    font-size: clamp(28px, 7vw, 40px);
    line-height: 1.3;
    letter-spacing: -0.015em;
  }

  .resolution {
    margin-top: 180px;
  }

  .resolution .line {
    font-size: clamp(36px, 10vw, 52px);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }
}

/* --------------------------------------------------------------------------
   Small Mobile (<=480px)
   -------------------------------------------------------------------------- */

@media (max-width: 480px) {
  .section {
    padding: 100px 16px;
  }

  .block {
    margin-bottom: 100px;
  }

  .line {
    font-size: clamp(24px, 7.5vw, 34px);
    line-height: 1.35;
    letter-spacing: -0.01em;
  }

  .resolution {
    margin-top: 140px;
  }

  .resolution .line {
    font-size: clamp(30px, 10vw, 44px);
    line-height: 1.18;
    letter-spacing: -0.02em;
  }
}

/* ==========================================================================
   Reduced Motion

   Users who prefer reduced motion see all blocks immediately.
   No transitions, no transforms, no blur. Content is fully visible.
   ========================================================================== */

@media (prefers-reduced-motion: reduce) {
  .block {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
    will-change: auto;
  }
}
```

---

## 3. CSS Class Reference

| Class | Element | Purpose |
|-------|---------|---------|
| `.section` | `<section>` | Full-width dark container, RTL, vertical padding |
| `.block` | `<div>` | Individual text group with scroll animation |
| `.block.visible` | `<div>` | Block in viewport — fully visible |
| `.line` | `<p>` | Single line of display typography |
| `.resolution` | `<div>` | Modifier on `.block` for the final dramatic block |

---

## 4. Animation State Machine

```
.block (default)          .block.visible (scroll-triggered)
─────────────────         ───────────────────────────────
opacity: 0          →     opacity: 1
translateY(20px)    →     translateY(0)
blur(2px)           →     blur(0)

Transition: 0.7s ease-out (all three properties)
```

**JS responsibility:** Add/remove the `.visible` class based on IntersectionObserver or scroll position. CSS handles all visual transitions.

**will-change lifecycle:**
- `will-change: opacity, transform, filter` is set statically on `.block`
- For a 5-block section, this is acceptable (5 compositing layers)
- If block count exceeds ~10, consider toggling `will-change` dynamically via JS

---

## 5. Value Rationale

### Why 0.7s ease-out?
Apple's scroll-reveal timing across apple.com product pages (iPhone, Mac, AirPods) consistently uses 0.6-0.8s with ease-out curves. The ease-out curve means the element decelerates as it arrives at its final position — it "settles" rather than "pops." 0.7s is the midpoint.

### Why translateY(20px) not 30px or 40px?
The original used 30px. At 30px+, the motion becomes noticeable as a "slide-in" rather than a gentle materialization. Apple's reveals feel like content was always there and just became visible. 20px provides directional cue without theatrics.

### Why blur(2px) not 10px?
The original had heavy blur on word-level elements. At 10px, text becomes an unrecognizable smear that snaps into focus — jarring. At 2px, text is soft but readable in peripheral vision, and the focus transition is smooth. Apple uses 0-3px blur in their text reveals.

### Why opacity 0 not 0.15?
Some implementations use a minimum opacity so text is "hinted at" before reveal. Apple uses full 0 → 1. The blur(2px) already provides the "something is there" hint.

### Why no word-level animation?
The original animated individual words with staggered delays. This creates a "typewriter" effect that:
1. Slows down the reading experience
2. Fights against RTL natural reading order
3. Is a well-known CSS animation pattern — not premium-feeling
Block-level reveals respect the content as a unit.

### Why no scale transform?
Apple text sections on apple.com do not use scale during scroll reveals. Scale on text creates subpixel rendering artifacts and font-weight visual shifts. Only opacity + translate + blur.

---

## 6. Specificity and Module Scoping

This CSS uses CSS Modules (`.module.css`), so all class names are locally scoped. No need for:
- BEM naming (modules handle isolation)
- `!important` (no specificity wars)
- Deep nesting (flat selectors)

The only nested selector is `.resolution .line` — one level deep, clear intent.

---

## 7. Performance Notes

| Property | Compositing | Cost |
|----------|-------------|------|
| `opacity` | Compositor thread | Near zero |
| `transform: translateY()` | Compositor thread | Near zero |
| `filter: blur()` | GPU-accelerated | Low (2px radius, text only) |

All three animated properties run on the compositor thread, avoiding layout and paint. The 60fps budget is safe.

`will-change` promotes elements to their own compositing layer. With 5 blocks, memory overhead is negligible (~5 layers, each containing a text block of ~900px wide).

---

## 8. Implementation Checklist

- [ ] Create `text-journey.module.css` with the CSS from Section 2
- [ ] Ensure `.section` has no `::before` or `::after`
- [ ] Ensure `.block` has no `::before` or `::after`
- [ ] Verify `.visible` class is toggled by scroll JS (not inline styles)
- [ ] Test reduced motion: all blocks visible immediately
- [ ] Test all 4 breakpoints: desktop (1200+), tablet (768-1199), mobile (481-767), small (<=480)
- [ ] Verify no shimmer/glow/gradient animations exist
- [ ] Confirm font inherits from body (no explicit font-family needed)

---

*Spec authored by STYLIST agent. Values derived from TYPOGRAPHY-SPEC.md and Apple product page analysis. Every removed effect is documented in Section 1.*
