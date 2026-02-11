# Typography Specification: Text Journey Section

> Premium Hebrew typography for Apple-quality scroll-reveal text blocks
> Background: #050506 | RTL | Large display sizes

---

## 1. Font Selection: Heebo

### Choice: **Heebo** (already loaded in project)

**Rationale:**

| Criteria | Heebo | Assistant | Rubik |
|----------|-------|-----------|-------|
| SF Pro similarity | High - geometric, clean, uniform stroke width | Medium - thinner strokes, less authority | Medium - rounded terminals break the precision feel |
| Weight range | 100-900 (9 weights) | 200-800 (7 weights) | 300-900 (7 weights) |
| Large display rendering | Excellent - designed for both screen and print | Good - can feel thin at 500w | Good - rounded corners soften at large sizes |
| Hebrew diacritics | Native Hebrew design by Oded Ezer | Good but less refined | Adequate |
| Google Fonts CDN | Yes | Yes | Yes |

**Why Heebo wins:**

1. **Already loaded** in `layout.tsx` with `next/font/google` - zero additional load cost, no FOUT risk, consistent with the rest of the site.
2. **Geometric sans-serif** with uniform stroke widths, directly paralleling SF Pro's design philosophy.
3. **Designed by Oded Ezer**, one of Israel's premier typographers - the Hebrew letter forms are not an afterthought but the primary design language.
4. **Weights 400-800 loaded** - gives us the full range from medium body (500) to display emphasis (700-800).
5. **Even color** at 48-58px: Heebo maintains consistent optical density across Hebrew characters, avoiding the uneven "spotting" that some Hebrew fonts exhibit at display sizes.

### Why NOT the others:

- **Assistant**: Too light at weight 500. Lacks the visual authority needed for emotional display text. The thin strokes disappear against #050506.
- **Rubik**: Slightly rounded terminals create a friendly/casual feel that conflicts with the Apple-precision aesthetic. Better suited for UI, not cinematic scroll reveals.
- **Ploni**: Not available on Google Fonts. Would require self-hosting, adding complexity for marginal benefit.

---

## 2. Typography Values Per Breakpoint

### Desktop (1200px+)

| Property | Value | Rationale |
|----------|-------|-----------|
| `font-family` | `var(--font-heebo), Arial, sans-serif` | Heebo with system fallback |
| `font-size` | `clamp(48px, 4.2vw, 58px)` | Large, confident. 58px max matches Apple product pages |
| `line-height` | `1.2` | Tight for Hebrew display text. Hebrew ascenders/descenders need slightly more room than Latin at 1.1, but 1.3 is too loose |
| `letter-spacing` | `-0.02em` | Negative tracking tightens Hebrew at display sizes, increasing perceived weight and cohesion |
| `font-weight` | `500` | Medium weight. Reads as confident without feeling heavy. Apple uses SF Pro Medium (500) for product page body |
| Block margin-bottom | `180px` | Generous breathing room. Each block is a "scene" - needs dramatic pause between |
| Last block margin-bottom | `100px` | Slightly less before section ends |
| Section padding | `200px 24px` | Massive vertical padding creates the immersive scroll-theater feel |
| Max-width | `900px` | Narrower than full container - keeps line lengths comfortable at large sizes |
| Word spacing | `0.12em` (via margin) | Slight extra space between Hebrew words for optical clarity at display sizes |

### Tablet (768px - 1199px)

| Property | Value | Rationale |
|----------|-------|-----------|
| `font-size` | `clamp(36px, 5.5vw, 48px)` | Scales down proportionally. 5.5vw fluid keeps it feeling big on 768px (42px) |
| `line-height` | `1.25` | Slightly more breathing room as text gets smaller |
| `letter-spacing` | `-0.02em` | Maintain tightness |
| `font-weight` | `500` | Unchanged - consistency across breakpoints |
| Block margin-bottom | `150px` | Proportionally reduced |
| Section padding | `160px 24px` | Reduced but still generous |
| Max-width | `800px` | Slightly narrower |

### Mobile (481px - 767px)

| Property | Value | Rationale |
|----------|-------|-----------|
| `font-size` | `clamp(28px, 7vw, 40px)` | 7vw on 481px = 33.7px, on 767px = 53.7px (clamped to 40px). Still feels bold |
| `line-height` | `1.3` | Hebrew needs more room at smaller sizes - diacritics, descenders |
| `letter-spacing` | `-0.015em` | Slightly less negative - at smaller sizes, too-tight tracking hurts readability |
| `font-weight` | `500` | Unchanged |
| Block margin-bottom | `120px` | Reduced proportionally |
| Section padding | `120px 20px` | Less vertical padding, tighter horizontal |
| Max-width | `100%` | Full width with padding |

### Small Mobile (<=480px)

| Property | Value | Rationale |
|----------|-------|-----------|
| `font-size` | `clamp(24px, 7.5vw, 34px)` | 7.5vw on 375px = 28px. Still reads as display text, not body |
| `line-height` | `1.35` | Most generous - small screen, need clear separation between lines |
| `letter-spacing` | `-0.01em` | Minimal negative - preserve readability |
| `font-weight` | `500` | Unchanged |
| Block margin-bottom | `100px` | Minimum spacing that still feels like separate scenes |
| Section padding | `100px 16px` | Compact but not cramped |
| Max-width | `100%` | Full width with padding |

---

## 3. Resolution Variant (Dramatic Ending Block)

The final "tease" block uses larger, bolder typography for emotional climax.

| Property | Desktop | Tablet | Mobile | Small Mobile |
|----------|---------|--------|--------|-------------|
| `font-size` | `clamp(56px, 7vw, 88px)` | `clamp(44px, 8vw, 64px)` | `clamp(36px, 10vw, 52px)` | `clamp(30px, 10vw, 44px)` |
| `font-weight` | `700` | `700` | `700` | `700` |
| `line-height` | `1.1` | `1.12` | `1.15` | `1.18` |
| `letter-spacing` | `-0.03em` | `-0.025em` | `-0.02em` | `-0.02em` |
| `margin-top` | `280px` | `220px` | `180px` | `140px` |

---

## 4. Font Loading Strategy

### Current Implementation (Keep As-Is)

```tsx
// website/app/layout.tsx - already configured
const heebo = Heebo({
  subsets: ["hebrew"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heebo",
  fallback: ["Arial", "sans-serif"],
  preload: true,
});
```

**Why this is correct:**

1. **`next/font/google`** automatically:
   - Self-hosts the font files (no external CDN requests)
   - Generates optimal `@font-face` declarations
   - Adds `preload` link tags for the font files
   - Inlines font CSS at build time

2. **`subsets: ["hebrew"]`** - Only loads Hebrew + Latin glyphs. No Arabic, Cyrillic, etc. Smaller file size.

3. **`display: "swap"`** - Text renders immediately with Arial fallback, swaps to Heebo when loaded. Prevents invisible text (FOIT).

4. **`preload: true`** - Font files are preloaded in `<head>`, ensuring Heebo is available by the time the text-journey section scrolls into view.

5. **Weights loaded: 400, 500, 600, 700, 800** - We primarily use 500 and 700 for this section. The other weights serve the rest of the site.

### No Additional Loading Needed

The text-journey section inherits `font-family: var(--font-heebo)` from the global `@theme` configuration in `globals.css`:

```css
--font-sans: var(--font-heebo), Arial, sans-serif;
```

---

## 5. Fallback Stack

```css
font-family: var(--font-heebo), "Arial", sans-serif;
```

| Priority | Font | Reason |
|----------|------|--------|
| 1 | Heebo (self-hosted via next/font) | Primary - loaded and preloaded |
| 2 | Arial | Universal Hebrew support on all platforms. Similar geometric feel. Metrics close enough to avoid major CLS |
| 3 | sans-serif | System default generic |

**Why Arial as first fallback (not "Segoe UI" or system-ui):**
- Arial has native Hebrew support on Windows, macOS, Linux, iOS, and Android
- Arial's Hebrew glyphs are geometric and relatively clean
- `system-ui` resolves to different fonts across platforms, making CLS prediction impossible
- The existing `layout.tsx` already uses this fallback stack

### CLS Mitigation

Because Heebo is preloaded via `next/font`, the fallback is rarely displayed. But when it is:

- Heebo and Arial have similar x-height ratios (~0.52)
- Line heights are specified in unitless values (not px), so proportional scaling works
- The text-journey section is below the fold, so any swap happens before the user scrolls to it

---

## 6. Hebrew-Specific Considerations

### RTL Rendering

- **`direction: rtl`** is set on the `<html>` element and the section's CSS
- **`text-align: center`** is used for all journey blocks - works identically in RTL and LTR
- Word order is natural Hebrew right-to-left; no `unicode-bidi` overrides needed

### Hebrew Typographic Characteristics at Display Sizes

1. **No word breaking**: Hebrew words must never be hyphenated or broken across lines. The CSS uses `overflow-wrap: normal` (matching the `.prose-hebrew` utility in `globals.css`).

2. **Letter-spacing in Hebrew**: Unlike Latin, Hebrew letters connect visually through shared baseline rhythm. Negative letter-spacing at display sizes (-0.02em) tightens the visual texture without creating ligature collisions, because Heebo's Hebrew glyphs have built-in sidebearings that prevent overlap.

3. **Line-height considerations**: Hebrew has relatively tall ascenders (lamed) and deep descenders (final kaf, final nun). The line-height values (1.2-1.35) are calibrated to prevent clipping while maintaining the tight, display-text feel.

4. **Word spacing**: The `.word` class uses `margin: 0 0.12em` for inter-word spacing. This is slightly wider than default because Hebrew words at 48-58px can merge visually without deliberate spacing.

5. **Font feature settings**: The global CSS enables `"rlig" 1, "calt" 1` (required ligatures and contextual alternates). Heebo uses these for proper Hebrew letter-form selection based on position.

### Optical Adjustments

| Consideration | Value | Why |
|---------------|-------|-----|
| `text-rendering` | `optimizeLegibility` | Set globally. Enables kerning pairs and ligatures for Hebrew |
| `-webkit-font-smoothing` | `antialiased` | Set globally. Subpixel rendering is too noisy at 48px+ on dark backgrounds |
| `-moz-osx-font-smoothing` | `grayscale` | macOS equivalent of antialiased |
| `will-change` | `opacity, transform` | On `.word` elements for GPU-accelerated scroll animations |

---

## 7. CSS Variable Tokens for Text Journey

These tokens should be defined in the text-journey CSS module for section-scoped use:

```css
/* Text Journey Typography Tokens */

/* Normal blocks */
--tj-font-size: clamp(48px, 4.2vw, 58px);
--tj-line-height: 1.2;
--tj-letter-spacing: -0.02em;
--tj-font-weight: 500;
--tj-block-gap: 180px;
--tj-section-padding: 200px;
--tj-max-width: 900px;
--tj-word-gap: 0.12em;

/* Resolution variant */
--tj-res-font-size: clamp(56px, 7vw, 88px);
--tj-res-line-height: 1.1;
--tj-res-letter-spacing: -0.03em;
--tj-res-font-weight: 700;
--tj-res-margin-top: 280px;

/* Responsive overrides via media queries */
```

---

## 8. Visual Reference: Apple Typography Parallels

| Apple Pattern | Our Implementation |
|--------------|-------------------|
| SF Pro Display at 56px, weight 600 | Heebo at 48-58px, weight 500 (Heebo 500 has similar optical weight to SF Pro 600 due to Hebrew stroke geometry) |
| Line-height 1.05-1.1 on English display | Line-height 1.2 on Hebrew display (Hebrew needs +0.1 for ascenders/descenders) |
| Letter-spacing -0.015em | Letter-spacing -0.02em (Hebrew benefits from slightly more tightening) |
| Fade-to-blur scroll reveal | Identical - opacity + blur + translateY driven by GSAP ScrollTrigger |
| Single-column centered layout | Identical - max-width 900px, text-align center |
| Generous vertical rhythm (150-200px) | 180px between blocks (desktop) |

---

## 9. Implementation Checklist

- [x] Font: Heebo via `next/font/google` (already loaded in layout.tsx)
- [x] Subsets: `["hebrew"]` only
- [x] Weights: 400, 500, 600, 700, 800 loaded
- [x] `display: "swap"` for no FOIT
- [x] `preload: true` for early loading
- [x] Fallback: Arial, sans-serif
- [ ] CSS values per breakpoint (to be implemented by STYLIST agent)
- [ ] Resolution variant typography (to be implemented by STYLIST agent)
- [ ] CSS custom property tokens (to be implemented by STYLIST agent)

---

*Spec authored for Text Journey rebuild. Values derived from Apple product page analysis, Hebrew typographic principles, and the existing Findo design system.*
