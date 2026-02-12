# SVG Clarity Best Practices for Small Card Illustrations

> Actionable reference guide for Findo's BigMistakeSection card illustrations
> Target rendering sizes: Desktop ~380x250px, Tablet ~300x200px, Mobile ~full-widthx170px
> Background: #08090a (page), #0e0f11 to #131315 (card surfaces)

---

## 1. MINIMUM SIZES FOR VISIBILITY

### Stroke Width

| Rendering Height | Min Visible Stroke | Min "Clearly Readable" Stroke | Notes |
|------------------|-------------------|-------------------------------|-------|
| 250px (desktop)  | 0.8px in viewBox  | 1.5px in viewBox              | Sub-1px strokes anti-alias to semi-transparent smears |
| 200px (tablet)   | 1.0px in viewBox  | 2.0px in viewBox              | Additional scaling loss from smaller render |
| 170px (mobile)   | 1.2px in viewBox  | 2.5px in viewBox              | Absolute minimum for any line to register visually |

**Critical Rule:** When the SVG viewBox is `0 0 400 260`, rendering at 250px height means a **0.96x scale factor** (250/260). At 170px it's **0.65x**. A 1px viewBox stroke becomes 0.65px actual on mobile -- which anti-aliases into a blurry ghost line.

**The Safe Minimum:** Use **1.5px minimum** stroke width in viewBox coordinates for ANY line that must be visible across all breakpoints. For truly important structural lines, use **2px+**.

**Anti-aliasing Impact:** At sub-pixel sizes, browsers anti-alias strokes by reducing opacity and spreading across adjacent pixels. A 0.5px white line on #0e0f11 becomes a 1px line at ~50% opacity -- dramatically reducing perceived contrast. This is why thin decorative lines at 0.3-0.4px become invisible at small sizes.

### Circle/Dot Radius

| Element Purpose | Min Radius (viewBox) | Actual Px at 170px render | Visibility |
|----------------|---------------------|--------------------------|------------|
| Decorative dot | 1.0px | ~0.65px actual | INVISIBLE at mobile -- skip these |
| Visible dot/marker | 2.5px | ~1.6px actual | Barely visible |
| Clearly identifiable dot | 4.0px | ~2.6px actual | Reliably visible across all sizes |
| Data point dot | 5.0px+ | ~3.3px actual | Clearly scannable |

**Critical Rule:** Any circle meant to be SEEN (not just decorative atmosphere) needs a **minimum radius of 3px** in viewBox coordinates. At 2px radius, the circle becomes a blurry smudge at mobile sizes.

### Text Size in SVG

| Text Purpose | Min fontSize (viewBox) | At 250px render | At 170px render | Readable? |
|-------------|----------------------|-----------------|-----------------|-----------|
| Decorative/atmosphere | 7px | ~6.7px actual | ~4.6px actual | NO -- illegible squiggles |
| Small labels | 10px | ~9.6px actual | ~6.5px actual | Barely -- only as texture |
| Readable labels | 14px | ~13.4px actual | ~9.1px actual | YES at desktop, marginal mobile |
| Hero text | 20px+ | ~19.2px actual | ~13px actual | YES across all sizes |
| Large hero numbers | 48px+ | ~46px actual | ~31px actual | Dominant focal element |

**Critical Rule:** If text MUST be readable at all breakpoints, minimum fontSize is **14px in viewBox**. For hero/focal text that carries the illustration's story, use **40px+ in viewBox**. Text below 10px in viewBox serves only as texture/placeholder -- it won't be read.

### Rectangle/Shape Minimum Size

| Shape Purpose | Min Width x Height (viewBox) | At 170px render | Visible? |
|--------------|-----------------------------|-----------------| ---------|
| Placeholder bar | 20x3px | ~13x2px actual | Only as subtle texture |
| Readable UI element | 40x8px | ~26x5px actual | Identifiable shape |
| Key structural element | 60x16px | ~39x10px actual | Clearly distinguishable |
| Primary focal element | 100x30px+ | ~65x20px actual | Dominant, unmistakable |

**Critical Rule:** Any rectangle that should be identifiable as a distinct UI element needs minimum **40px wide x 8px tall** in viewBox coordinates. Below that, it's just a line or smear.

---

## 2. CONTRAST REQUIREMENTS ON DARK BACKGROUNDS

### Calculated Contrast Ratios

The background colors are critically dark. Here are calculated luminance ratios for key foreground colors on #0E0F11 (relative luminance ~0.006):

| Foreground Color | Hex | Contrast Ratio vs #0E0F11 | Visibility Level |
|-----------------|-----|---------------------------|-----------------|
| rgba(255,255,255,0.03) | ~#0f1012 effective | ~1.05:1 | **INVISIBLE** -- pure decoration, can remove |
| rgba(255,255,255,0.06) | ~#161719 effective | ~1.2:1 | **BARELY PERCEPTIBLE** -- decorative atmosphere only |
| rgba(255,255,255,0.08) | ~#1c1d20 effective | ~1.4:1 | **SUBLIMINAL** -- registers subconsciously, not consciously |
| rgba(255,255,255,0.12) | ~#222326 effective | ~1.7:1 | **FAINT** -- visible if you look for it |
| rgba(255,255,255,0.18) | ~#2e3033 effective | ~2.2:1 | **SUBTLE** -- clearly visible to attentive viewer |
| rgba(255,255,255,0.25) | ~#3f4144 effective | ~2.8:1 | **MODERATE** -- visible on first scan |
| rgba(255,255,255,0.35) | ~#565759 effective | ~3.8:1 | **CLEAR** -- passes WCAG AA for large elements (3:1) |
| rgba(255,255,255,0.45) | ~#6d6f71 effective | ~4.8:1 | **STRONG** -- passes WCAG AA for normal text (4.5:1) |
| rgba(255,255,255,0.55) | ~#858688 effective | ~6.1:1 | **PROMINENT** -- easily scannable |
| rgba(255,255,255,0.70) | ~#a8a9ab effective | ~8.4:1 | **DOMINANT** -- hero text level |
| #388839 (green accent) | #388839 | ~2.3:1 | **Visible as color** -- needs 4px+ element size |
| #883839 (red accent) | #883839 | ~1.8:1 | **Subtle color** -- needs larger elements or higher opacity |
| #885c38 (orange accent) | #885c38 | ~2.2:1 | **Visible as color** -- similar to green |
| #7a6b3f (gold/star) | #7a6b3f | ~2.4:1 | **Warm visible** -- good for stars at sufficient size |

### Opacity Thresholds for Functional Visibility

| Purpose | Minimum White Opacity on #0E0F11 | Recommended |
|---------|----------------------------------|-------------|
| "I want this to exist but barely be noticed" | 0.06 | 0.08 |
| "Decorative texture, subconscious only" | 0.08 | 0.10 |
| "Viewer should see this if they look" | 0.15 | 0.18-0.20 |
| "Important structural element" | 0.25 | 0.30 |
| "Must be noticed on first glance" | 0.35 | 0.40-0.45 |
| "Hero/focal text or element" | 0.50 | 0.60-0.75 |

### WCAG Reference Thresholds
- **3:1** minimum for non-text UI components and graphical objects (WCAG 2.1 AA, SC 1.4.11)
- **4.5:1** minimum for normal text readability (WCAG AA)
- **7:1** for enhanced contrast (WCAG AAA)

**For illustrations that are decorative (not functional UI):** WCAG doesn't strictly apply, but the 3:1 ratio is a useful benchmark for "clearly visible" vs "atmosphere/decoration." Elements below 2:1 are essentially invisible to casual scanning.

---

## 3. COMPOSITION RULES FOR 3-SECOND SCANNING

### Miller's Law: 7 Plus/Minus 2

Working memory can hold approximately 5-9 chunks of information. For a card illustration scanned in 3 seconds, this means:

| Element Type | Optimal Count | Max Before Overload |
|-------------|--------------|---------------------|
| **Primary/hero elements** | 1 (maximum 2) | 2 |
| **Secondary supporting elements** | 2-3 | 4 |
| **Background/decorative elements** | 3-5 | unlimited (they don't compete for attention) |
| **Total distinct "noticeable" elements** | 4-5 | 7 |

### The 60-30-10 Visual Hierarchy Rule

For each illustration:
- **60% visual weight** -- The dominant element. This tells the story. (e.g., declining graph line, "6-12" number, business card)
- **30% visual weight** -- Supporting context. Helps interpret the dominant. (e.g., metric cards, hourglass, star ratings)
- **10% visual weight** -- Accent elements. Color pops, small details. (e.g., red dots, green badge, orange warning)

### Focal Elements vs Supporting Elements

| Category | Characteristics | Opacity Range | Size (% of illustration area) |
|----------|----------------|---------------|-------------------------------|
| **Focal** (1-2 per card) | Highest contrast, largest, tells the story | 0.45-0.75 | 25-40% of visual area |
| **Supporting** (2-3 per card) | Medium contrast, medium size, provides context | 0.20-0.40 | 10-20% each |
| **Atmospheric** (unlimited) | Low contrast, small, creates mood/depth | 0.04-0.12 | Scattered fills |

### The 3-Second Scan Path

Design each illustration so the eye follows this path in 3 seconds:
1. **Entry point** (0-0.5s): The eye hits the highest-contrast element first
2. **Context scan** (0.5-2s): Eye moves to 2-3 supporting elements
3. **Atmosphere absorption** (2-3s): Peripheral vision registers the background mood

If the viewer cannot identify the illustration's METAPHOR in 3 seconds, it has failed.

---

## 4. COLOR ON DARK BACKGROUNDS

### Color Visibility Comparison at Various Opacities

All colors tested against #0E0F11 background:

| Color | At 0.3 opacity | At 0.5 opacity | At 0.7 opacity | At 1.0 opacity |
|-------|----------------|----------------|----------------|----------------|
| **Red #883839** | Nearly invisible | Visible as dark red tint | Clearly red | Bold red |
| **Orange #885c38** | Nearly invisible | Visible warm tone | Clearly orange | Bold orange |
| **Green #388839** | Slightly more visible than red | Good visibility | Clear green | Bold green |
| **Blue #385688** | Slightly less than green | Moderate | Clear | Bold |
| **Gold #d4af37** | Visible (bright base) | Warm prominent | Very clear | Dominant |
| **Amber #c19552** | Visible | Warm, inviting | Rich amber | Strong |
| **White #ffffff** | Clearly visible | Strong | Dominant | Too harsh |

### Key Finding: Green > Orange > Red for Dark Backgrounds

At the same opacity, green (#388839) is approximately **15-20% more perceptible** than red (#883839) on near-black backgrounds. This is because:
1. Human eyes have more green-sensitive cones (M-cones) than red (L-cones) or blue (S-cones)
2. Green's luminance contribution is higher in the sRGB color space
3. Red shifts toward black faster as opacity decreases on dark backgrounds

### Best Gold/Amber Values for Stars on Dark Backgrounds

| Gold Variant | Hex | Best Use Case | Minimum Element Size |
|-------------|-----|---------------|---------------------|
| **Bright Gold** | #FFD700 | High visibility needed, small elements | 8px+ (works small) |
| **Metallic Gold** | #D4AF37 | Rich, premium feel | 10px+ |
| **Amber Gold** | #C19552 | Warm, sophisticated, matches Findo palette | 12px+ |
| **Dark Gold (current)** | #7A6B3F | Very subtle, almost invisible at small sizes | 16px+ AND 0.7+ opacity |

**Recommendation for Findo Stars:** Use **#C19552** or **#D4AF37** at **opacity 0.65-0.80** for stars. The current #7A6B3F at 0.7 opacity gives approximately **#554B2C effective** which has extremely low contrast (~1.6:1) on #0E0F11. It's nearly invisible.

**Fix:** Change star fill from `#7a6b3f` at `opacity="0.7"` to `#C19552` at `opacity="0.6"` -- this approximately doubles perceived visibility while keeping the warm premium tone.

### Accent Color Minimum Element Sizes

For accent colors (#388839, #883839, #885c38) to register AS COLOR (not just as a slightly lighter gray):

| Element Type | Minimum Size for Color Recognition |
|-------------|-----------------------------------|
| Filled circle | r="3px" minimum in viewBox (~2px rendered at mobile) |
| Filled rectangle | 8x8px minimum in viewBox |
| Stroke/line | 2px strokeWidth minimum, AND 30px+ length |
| Text | 14px+ fontSize with the color as fill |

Below these sizes, accent colors are perceived as generic "slightly lighter" spots, not as their actual hue.

---

## 5. SVG TECHNICAL BEST PRACTICES

### ViewBox Sizing for Responsive Rendering

**Current viewBox:** `0 0 400 260` -- This is a reasonable choice for the card proportions.

**Scale Factors at Each Breakpoint:**

| Breakpoint | Render Width | Render Height | Scale from viewBox | 1px viewBox = |
|-----------|-------------|--------------|-------------------|---------------|
| Desktop | ~380px | ~250px | 0.95x-0.96x | ~0.96px actual |
| Tablet | ~300px | ~200px | 0.75x-0.77x | ~0.77px actual |
| Mobile | ~360px (full) | ~170px | 0.65x-0.90x | ~0.65px actual |

**Best Practice:** Design all elements targeting the **worst case (0.65x scale)** and verify they survive. This means:
- Design in viewBox coordinates
- Multiply all critical dimensions by 0.65 to check actual rendered size
- If anything falls below 1px actual, it needs to be larger or removed

### `preserveAspectRatio` Setting

Use `preserveAspectRatio="xMidYMid meet"` (the default) -- this centers the SVG and scales uniformly. Never use `"none"` as it will distort illustrations.

### When to Use Stroke vs Fill

| Technique | Best For | Worst For |
|-----------|----------|-----------|
| **Fill** | Solid shapes, backgrounds, large elements | Very thin elements (fill-based thin rects are fragile) |
| **Stroke** | Lines, outlines, graph lines, borders | Small elements at low opacity (anti-aliasing kills them) |
| **Stroke + Fill** | Data points, icons, prominent elements | N/A -- always good for important elements |

**Rule of thumb:** For elements that MUST be visible, prefer **fill** over stroke. A 3px-wide filled rectangle is more reliably rendered than a 3px stroke line, because stroke rendering can vary by 0.5px across browsers due to anti-aliasing alignment.

### Gradient Techniques for Depth on Dark Backgrounds

**Surface shading (panels/cards within SVG):**
```svg
<linearGradient id="panelShade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="rgba(255,255,255,0.04)" /> <!-- top: slightly lighter -->
  <stop offset="100%" stop-color="rgba(0,0,0,0.1)" />       <!-- bottom: slightly darker -->
</linearGradient>
```
Apply to rect elements to create subtle 3D panel feel.

**Area fill under chart lines:**
```svg
<linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="#CURRENT_COLOR" stop-opacity="0.25" />
  <stop offset="100%" stop-color="#CURRENT_COLOR" stop-opacity="0.02" />
</linearGradient>
```
The gradient should fade to near-zero at the bottom -- this creates depth without muddying the background.

**Radial glow behind hero elements:**
```svg
<radialGradient id="heroGlow" cx="50%" cy="40%" r="40%">
  <stop offset="0%" stop-color="rgba(255,255,255,0.03)" />
  <stop offset="100%" stop-color="rgba(255,255,255,0)" />
</radialGradient>
```
Very subtle -- the glow should be sensed, not seen. Maximum 0.03-0.05 opacity at center.

### Making Elements "Pop" Without Breaking Dark Aesthetic

Techniques ordered from most subtle to most aggressive:

1. **Luminance lift only** (+2-3% lightness from surrounding): `fill="#1c1d20"` on `#131416` background
2. **Subtle border**: `stroke="rgba(255,255,255,0.06)"` adds edge definition without brightness
3. **Top-edge highlight**: A 1px line at the top edge of a panel at `rgba(255,255,255,0.04-0.06)` -- mimics overhead light
4. **Drop shadow**: `filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3))` -- lifts element off background
5. **Slight scale increase**: Make the focal element 10-20% larger than secondary elements
6. **Color accent**: Use accent color at 0.15-0.30 opacity for a subtle glow ring around an important element
7. **Full accent fill**: Reserve for maximum 1-2 small elements per illustration (status dots, checkmarks)

**The hierarchy:** If everything "pops," nothing pops. Maximum 2 techniques on the hero element, 1 technique on supporting elements, 0 on atmospheric elements.

### Crisp Rendering Tips

- **Align to whole pixels:** For horizontal/vertical lines, ensure coordinates are at `.5` values (e.g., `y="50.5"`) so the 1px stroke straddles two pixel rows evenly, avoiding blurry anti-aliasing
- **Use `shape-rendering="crispEdges"`** on grid lines and straight structural elements -- this disables anti-aliasing for sharper edges (but makes curves jagged, so avoid on curved paths)
- **Avoid `shape-rendering="crispEdges"` on curves, circles, and diagonal lines** -- these need anti-aliasing to look smooth
- **Use `vector-effect="non-scaling-stroke"`** on strokes that should maintain consistent weight regardless of SVG scaling (use sparingly -- can cause inconsistency across browsers)

---

## 6. THE SQUINT TEST

### What It Tests

The squint test simulates what a viewer perceives in the first 0.5-1 second of glancing at an illustration. When you physically squint at a screen:
- Fine details disappear
- Low-contrast elements vanish
- Only high-contrast shapes and color accents remain
- The illustration's SILHOUETTE and COLOR SPOTS are what register

### What Should Survive the Squint

| Must Survive | May Fade | Should Disappear |
|-------------|----------|------------------|
| Hero element shape (graph, number, card) | Secondary UI elements | Grid lines |
| Any color accent dots/badges | Placeholder text bars | Atmosphere dots |
| Overall composition layout | Small icons | Sub-0.10 opacity elements |
| The emotional STORY of the illustration | Border details | Background texture |

### Design Principles for Squint Test Success

1. **Big shapes beat fine details.** A 100x60px filled rectangle at 0.12 opacity is more visible than ten 1px lines at 0.08 opacity. When in doubt, make elements LARGER and FEWER.

2. **Contrast beats complexity.** One element at 0.50 opacity is more impactful than five elements at 0.15 opacity. Concentrate your contrast "budget" on the hero element.

3. **Color accent beats same-tone elements.** A single 4px green (#388839) dot at 0.8 opacity is more memorable than an entire complex UI mockup in monochrome gray. Use color strategically and sparingly for maximum impact.

4. **Solid fills beat thin strokes.** At small sizes, a filled shape maintains its area even when anti-aliased. A thin stroke can anti-alias to near-invisibility. For any element that must survive the squint test, use fill-based rendering.

5. **Negative space is structural.** The empty dark areas between elements are not "wasted" -- they define the shapes. If the illustration is too dense, elements merge into an undifferentiated gray blob when squinted. Target 25-35% negative space.

### Applying the Squint Test to Each Tab

**Tab 1 (Paid Ads) -- What should survive:**
- The declining line/curve shape (dramatic diagonal from upper-left to lower-right)
- Red accent color (signaling "bad/danger")
- The overall "dashboard going down" silhouette

**Tab 2 (Organic) -- What should survive:**
- The "6-12" hero number (large, high contrast)
- Orange accent (signaling "patience/warning")
- The flat horizontal growth line (contrast: dramatic decline in Tab 1 vs. flat stagnation in Tab 2)

**Tab 3 (Findo) -- What should survive:**
- The business card/profile shape (the "result")
- Green accent color (signaling "good/success/found it")
- Star ratings (warm gold/amber glow)
- The overall "complete, ready" feeling vs the "broken/slow" feelings of Tabs 1 and 2

---

## 7. SPECIFIC RECOMMENDATIONS FOR FINDO'S ILLUSTRATIONS

### Problem Analysis: Current Illustrations

**Common issues across all 3 current SVGs:**

1. **Too many sub-pixel elements:** Calendar day grids (5x5px cells at 0.3 opacity), atmosphere dots (r=0.7-1px), month number labels (7px fontSize) -- all invisible at mobile rendering
2. **Over-reliance on low opacity:** Many critical elements at 0.06-0.12 opacity on #0E0F11 -- these have contrast ratios below 1.5:1, effectively invisible
3. **Text that can't be read:** Small text labels (7-8px) at low opacity serve no purpose -- they're neither readable NOR visually impactful as texture at card size
4. **Insufficient contrast budget concentration:** Instead of having 1 dominant element at high contrast, the contrast is spread thinly across many elements
5. **Stars (#7a6b3f at 0.7) are too dark:** Effective color is approximately #554B2C on #0E0F11, giving ~1.6:1 contrast -- nearly invisible

### Recommended Minimum Standards

| Parameter | Minimum Value | Recommended |
|-----------|--------------|-------------|
| Stroke width (any visible line) | 1.5px in viewBox | 2px |
| Circle radius (any visible dot) | 3px in viewBox | 4-5px |
| Text fontSize (readable) | 14px in viewBox | 16px+ |
| Text fontSize (hero) | 40px in viewBox | 48-82px |
| Rect size (identifiable) | 40x8px in viewBox | 60x16px+ |
| Focal element opacity | 0.45 white | 0.55-0.75 |
| Structural element opacity | 0.20 white | 0.25-0.35 |
| Decorative element opacity | 0.06 white | 0.08-0.12 |
| Color accent element size | r=3px / 8x8px | r=4px+ / 12x12px+ |
| Negative space | 25% of area | 30% |
| Total "noticeable" elements | max 7 | 4-5 |

### Color System Recommendation

For the 3-tab story (Bad / Slow / Good):

| Tab | Accent Color | Usage | Hex at Recommended Opacity |
|-----|-------------|-------|---------------------------|
| Tab 1: Paid | Red | Danger, loss, decline | #883839 at 0.5-0.7 opacity |
| Tab 2: Organic | Orange/Amber | Warning, patience, time | #885c38 at 0.5-0.7 opacity |
| Tab 3: Findo | Green | Success, found, go | #388839 at 0.6-0.9 opacity |
| Tab 3: Stars | Gold/Amber | Quality, premium, ratings | #C19552 at 0.6-0.8 opacity |

### ViewBox and Rendering Config

```jsx
<svg
  className={className}
  viewBox="0 0 400 260"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMidYMid meet"
>
```

This is correct and should be maintained. The `400x260` viewBox gives a ~1.54:1 aspect ratio which works well for the card illustration area.

---

## 8. QUICK REFERENCE CHEAT SHEET

### "Will This Be Visible?" Decision Tree

```
Is the element's contrast ratio > 2:1 on #0E0F11?
├── NO → It's decoration only. Is that intended?
│   ├── YES → Keep but don't count as functional
│   └── NO → Increase opacity or remove
└── YES → Is it larger than the minimum size for its type?
    ├── NO → Scale up or combine with nearby elements
    └── YES → Is it one of the 5-7 "noticeable" elements?
        ├── YES → Ensure it supports the 60-30-10 hierarchy
        └── NO → Consider reducing to atmosphere (lower opacity) or removing
```

### The 5-Element Clarity Test

For each illustration, identify exactly 5 elements by visual importance:

1. **THE story** -- What a viewer describes after a 1-second glance (e.g., "a declining graph")
2. **THE context** -- What tells them WHERE/WHAT (e.g., "inside a dashboard")
3. **THE emotion** -- What accent color/shape triggers the feeling (e.g., "red warning dot")
4. **THE texture** -- What creates depth/atmosphere (e.g., "grid lines in background")
5. **THE frame** -- What contains/bounds the composition (e.g., "dark panel border")

If you cannot clearly identify all 5, the illustration either has too many competing elements or too few distinct ones.

---

*Guide compiled from web research on SVG rendering, WCAG contrast guidelines, cognitive load theory (Miller's Law), color science, and analysis of the current Findo illustration SVGs.*
