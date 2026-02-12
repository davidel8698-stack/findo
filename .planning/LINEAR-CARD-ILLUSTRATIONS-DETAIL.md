# LINEAR CARD ILLUSTRATIONS -- Exhaustive Pixel-Level Analysis

> Source screenshots analyzed:
> - `03-made-for-modern-teams.png` (upper portion of cards, section header)
> - `04-ai-section.png` (lower portion of cards with text areas and + buttons)
> - `14-workflows-cards.png` (different card style -- product UI mockups, for comparison)
> - `15-under-the-hood.png` (technical showcase card with dashed borders, hatching patterns)
> - `00-full-page.png` (zoomed-out context of entire page)

---

## SECTION CONTEXT

The "Made for modern product teams" section sits approximately 35-40% down the Linear homepage. Above it: customer logos (OpenAI, Cash App, Scale, Ramp, Vercel, Coinbase, Boom, Cursor). Below it: the "AI-assisted product development" section.

The section header uses a two-column layout:
- **Left column:** "Made for modern product teams" -- large serif-less headline, ~48px, weight 600-700, pure white, tight letter-spacing (-0.02em)
- **Right column:** Descriptive paragraph in muted white (~rgba(255,255,255,0.55)), ending with "Make the switch >" link in brighter white

The three cards sit in a 3-column grid with ~24px gaps, max-width ~1200px centered. Cards are tall (approximately 3:4 aspect ratio) and partially overflow the viewport at the bottom in screenshot 03 -- the full bottom is visible in screenshot 04.

---

## OVERALL CARD ANATOMY (Shared by All 3 Cards)

### Card Shell
- **Background:** #131416 to #141518 -- approximately 8-10% luminance above the page background (#08090a)
- **Border:** 1px solid rgba(255,255,255,0.06-0.08) -- barely perceptible ghost border
- **Border-radius:** 16px on all corners
- **Box-shadow:** Very subtle ambient: approximately `0 2px 16px rgba(0,0,0,0.12)` -- no dramatic shadows
- **Inner top-edge highlight:** `inset 0 1px 0 rgba(255,255,255,0.03-0.05)` -- a whisper-thin bright line at the top edge
- **No noise, no texture, no glassmorphism** -- clean flat dark surface

### Internal Layout Split
Each card divides into two zones:

**Zone A: Illustration Area (upper ~65-70%)**
- Takes up approximately 310-340px of the ~480px card height
- Background is SUBTLY DARKER than the card surface: ~#111214 to #0e0f11 (2-4% darker)
- This darkening is a soft gradient, NOT a hard edge
- Creates a natural "stage" or "theater" for the illustration to perform on
- The gradient transition from illustration-dark to card-surface happens gradually over the bottom ~40-60px of this zone

**Zone B: Text + Action Area (lower ~30-35%)**
- **Card title:** Bold white text, left-aligned, ~20px, weight 600, color #FFFFFF
- **Title wraps to 2 lines maximum** where needed
- **Padding:** ~32px from left edge, ~32px from bottom edge
- **"+" expand button:** Positioned at bottom-right corner, ~32px inset from both edges
  - Circle diameter: ~28-32px
  - Background: rgba(255,255,255,0.06)
  - Border: 1px solid rgba(255,255,255,0.08)
  - "+" icon inside: thin cross shape, ~12px size, rgba(255,255,255,0.4) color
  - The button sits on the SAME horizontal line as the bottom of the title text

### Confirmed Card Titles (from screenshot 04)
- Card 1 (Left): "Purpose-built for product development" (wraps to 2 lines)
- Card 2 (Center): "Designed to move fast" (single line)
- Card 3 (Right): "Crafted to perfection" (single line)

---

## CARD 1 (LEFT): "Purpose-built for product development"

### Composition Overview
A dense, layered composition of overlapping dark UI panels arranged in 3D perspective, with a large abstract shield/emblem shape in the foreground-bottom. The visual weight sits CENTER-LEFT, with panels spreading slightly upward-right. The composition conveys "a rich product ecosystem with many interconnected views."

### Layer-by-Layer Breakdown (Back to Front)

#### Layer 4 (Furthest Back): Faint Guide Lines
- Extremely subtle grid/guide lines in the deep background
- Color: rgba(255,255,255,0.02-0.03) -- almost invisible, more felt than seen
- Creates a blueprint/engineering feel without being distracting
- Possibly 2-3 barely visible horizontal lines crossing the upper area

#### Layer 3: Rear Panel Stack
- **3-4 rectangular panels** arranged in a fanned stack, like a hand of cards tilted in perspective
- Panels are shown with **Y-axis rotation of approximately 15-20 degrees** -- the right edge is closer to the viewer, the left edge recedes
- Each panel: approximately 160-180px wide x 100-120px tall (projected size)
- **Vertical stagger:** Each panel offset ~6-8px downward from the one behind it
- **Panel background colors (back to front):**
  - Rearmost: #17181b (barely distinguishable from illustration background)
  - Second: #1a1b1e
  - Third: #1d1e21
- **Panel details:**
  - Rounded corners: ~6-8px radius
  - Very faint border: rgba(255,255,255,0.03-0.04)
  - Internal content: Horizontal placeholder bars (text lines) at varying lengths
    - Bar color: rgba(255,255,255,0.05-0.08)
    - Bar widths: ~60%, ~40%, ~75% of panel width, staggered
    - Bar height: ~2-3px each
    - Spacing between bars: ~6-8px
  - Small dots/icons at top-left corners: ~3-4px diameter, rgba(255,255,255,0.06-0.08)
  - Very faint text labels inside: words like "Roadmap", "Projects", "Inbox" visible at extremely low opacity (~rgba(255,255,255,0.10-0.15)), font-size ~9-10px

#### Layer 2: Foreground UI Card
- One card positioned closer to the viewer, overlapping the rear stack
- Slightly larger than the rear panels: ~200px wide x 130px tall projected
- **Background:** #202124 to #222326 (noticeably lighter than rear panels)
- **Border:** 1px solid rgba(255,255,255,0.05-0.06)
- **Corner radius:** 8px
- **Internal structure visible:**
  - Header row with a small status dot (~4px, appears to be a muted dark green ~#2a3a2a or muted blue)
  - 3-4 text placeholder lines of varying lengths
  - One small tag/badge element: rounded rectangle ~40x16px, rgba(255,255,255,0.06) fill
  - The internal content has slightly MORE opacity than the rear panels' content, creating depth through luminance

#### Layer 1: Side Panel / Additional Card Fragment
- A narrower panel visible on the far left edge, partially clipped by the card boundary
- This panel appears as a sidebar or navigation element
- Background: ~#1c1d20
- Contains small dot indicators and very short text labels stacked vertically
- The partial clipping creates the "extends beyond the frame" effect

#### Layer 0 (Closest): Abstract Shield/Emblem Shape
- Positioned in the LOWER-CENTER of the illustration area
- Large shape: approximately 70-90px in diameter/width
- The shape is the **Linear brand icon** style -- overlapping curved geometric forms creating a shield or heart-like emblem
- **Fill:** #1a1b1e to #1c1d20 (very dark, barely above background)
- **Stroke:** rgba(255,255,255,0.03-0.04) -- ghost outline
- The shape is **rotated approximately 10-15 degrees** on its Z-axis, giving it a dynamic tilt
- **CRITICAL DETAIL -- Diagonal hatching lines pass through the shape:**
  - 4-5 parallel diagonal lines at approximately 45-degree angle
  - Line spacing: ~7-9px apart
  - Line color: rgba(255,255,255,0.05-0.07)
  - Line weight: ~1-1.5px
  - These lines create a "holographic" or "engraved" effect on the emblem surface
  - The lines may extend slightly beyond the shape boundary, clipped by the shape itself

#### Accent Elements
- Small "d" character or status indicator near one of the upper panels: ~12px, rgba(255,255,255,0.12-0.15)
- 2-3 tiny floating dots scattered in negative space: 2-3px, rgba(255,255,255,0.04-0.06)

### Edge Behavior
- **Top edge:** Upper panels clip slightly at the top of the visual area -- their topmost ~10-20px is cropped
- **Left edge:** The side panel is cropped at the left card boundary -- only the right ~60% visible
- **Right edge:** Rear panels extend slightly past the right boundary
- **Bottom edge:** The shield shape sits near the transition zone where illustration fades into text area; its bottom portion softly dissolves into the gradient

### Color Gradient (Darkest to Lightest)
```
#0e0f11  --  illustration background (darkest corners)
#111214  --  illustration background (general)
#17181b  --  rearmost panels
#1a1b1e  --  shield shape fill, middle panels
#1d1e21  --  forward panels
#222326  --  foreground card surface (lightest solid fill)
rgba(255,255,255,0.06-0.08)  --  placeholder bars, dots
rgba(255,255,255,0.10-0.15)  --  faint text labels within panels
```

---

## CARD 2 (CENTER): "Designed to move fast"

### Composition Overview
A dramatic "speed" visualization built around bold "50ms" typography as the centerpiece, with sweeping horizontal wave lines below creating an intense sense of lateral motion. The composition is vertically split: typography in the upper third, speed lines filling the lower two-thirds. The visual weight concentrates at UPPER-CENTER for the text, then spreads horizontally through the lines. This card has the SIMPLEST composition of the three -- clean, focused, high-impact.

### Layer-by-Layer Breakdown

#### Layer 2 (Background): Subtle Atmosphere
- The visual area background has a very faint radial gradient centered behind the "50ms" text
- Center glow: rgba(255,255,255,0.02-0.03) -- barely perceptible luminance bloom
- Edge vignette: slightly darker at the left and right margins of the illustration area
- No grid, no dots, no texture -- this card is intentionally CLEAN
- Very faint horizontal noise/grain may be present (sub-pixel level, adding organic quality)

#### Layer 1: Horizontal Wave/Speed Lines
- **Position:** Below the "50ms" text, filling the lower 55-65% of the visual area
- **Line count:** Approximately 8-12 individual lines (hard to count exactly as some are very faint)
- **Line geometry:**
  - Each line stretches nearly the FULL WIDTH of the card (with only ~15-20px margins on each side)
  - Lines are NOT straight -- they follow gentle **sinusoidal curves**
  - Wave amplitude: ~3-8px (subtle undulation, not dramatic waves)
  - Wave frequency: approximately 1.5-2 full cycles across the card width
  - Lines are roughly PARALLEL to each other, maintaining ~10-14px vertical spacing
  - Each line has a SLIGHTLY DIFFERENT phase offset, so the waves don't align perfectly -- this creates an organic, flowing quality rather than a mechanical pattern
- **Line stroke characteristics:**
  - Width: ~1.5-2px (consistent across most lines)
  - Bottom-most lines may be slightly thicker (~2-3px) with lower opacity, simulating motion blur
  - The lines are smooth curves (cubic bezier, not jagged)
- **Color/opacity gradient (TOP lines to BOTTOM lines):**
  - Lines 1-3 (nearest to "50ms"): rgba(255,255,255,0.20-0.25) -- most visible, crisp
  - Lines 4-6 (middle zone): rgba(255,255,255,0.12-0.15) -- moderate visibility
  - Lines 7-9 (lower zone): rgba(255,255,255,0.06-0.10) -- fading
  - Lines 10-12 (bottommost): rgba(255,255,255,0.03-0.05) -- nearly invisible, ghost trails
  - This creates a **dissipating energy** effect -- as if speed trails are streaming downward and fading away
- **Directional flow:**
  - The line curvature is MORE PRONOUNCED on the left side (higher amplitude)
  - Lines become more horizontal/calmer toward the right
  - The overall reading direction is LEFT-to-RIGHT, matching speed/progress metaphor
- **Perspective convergence:**
  - Lines appear to converge very subtly toward the upper-right, creating a vanishing-point illusion
  - Spacing between lines may decrease very slightly from bottom to top, reinforcing a 3D "speed tunnel" effect
  - This is extremely subtle -- maybe 10-15% spacing compression from bottom to top

#### Layer 0 (Foreground): "50ms" Typography
- **Position:** Upper-center of the visual area, approximately 30-35% down from the top of the illustration zone
- **Horizontal centering:** Approximately centered, perhaps shifted very slightly left of true center
- **Font characteristics:**
  - Size: Large -- approximately 48-56px relative to the card (this is the hero element)
  - Weight: 500-600 (medium to semi-bold) -- NOT extra-bold, has some elegance
  - Family: Same sans-serif as the rest of the site (likely GT America or Linear's custom typeface)
  - Letter-spacing: Normal to slightly loose (~0.01em)
- **"50" vs "ms" sizing:**
  - The "50" numerals are the dominant element
  - The "ms" suffix appears at the SAME baseline but is approximately 70-80% the size of the numerals
  - Both share the same color and weight -- the size difference alone creates the hierarchy
- **Color:** rgba(255,255,255,0.65-0.75) -- notably NOT pure white. It's a deliberately muted/ghostly white that integrates with the dark environment rather than screaming for attention
- **Text effects:**
  - Very subtle text-shadow: approximately `0 2px 20px rgba(255,255,255,0.04-0.06)` -- the faintest possible glow, creating a slight luminance aura
  - No background panel, no badge, no underline -- the text floats naked on the dark background
  - No border or outline treatment on the text itself
- **Semantic read:** "50ms" communicates response time / latency -- the core speed metric. Combined with the flowing lines below, it tells the story: "this is how fast we are."

### Edge Behavior
- **Left/right edges:** Speed lines are HARD-CLIPPED by the card boundary (overflow: hidden). They clearly extend conceptually beyond the visible frame on both sides.
- **Top edge:** "50ms" text has comfortable clearance (~35-45px from top of illustration area) -- NOT clipped
- **Bottom edge:** The lowest, faintest lines dissolve well before the transition to the text area. The fade-out is gradual -- no hard cutoff.

### Color Gradient (Darkest to Lightest)
```
#0e0f11  --  illustration background (edge vignette areas)
#111214  --  illustration background (general)
rgba(255,255,255,0.03-0.05)  --  ghost lines at bottom
rgba(255,255,255,0.06-0.10)  --  fading lower lines
rgba(255,255,255,0.12-0.15)  --  middle lines
rgba(255,255,255,0.20-0.25)  --  brightest lines (near text)
rgba(255,255,255,0.65-0.75)  --  "50ms" text (brightest element in card)
```

---

## CARD 3 (RIGHT): "Crafted to perfection"

### Composition Overview
A technical/blueprint-style composition featuring a "Create" button UI element floating above a perspective grid of dashed lines with dot markers at intersections. The aesthetic is "precision engineering meets interface design." The visual weight sits in the UPPER-RIGHT quadrant (where the "Create" element is), with a diagonal flow down-left through the grid. This card has the most "architectural drawing" feel of the three.

### Layer-by-Layer Breakdown

#### Layer 4 (Furthest Back): Background Gradient
- Same darkened illustration background as other cards: #0f1012 to #111214
- Slightly more uniform than Card 1 -- no specific spotlight or radial gradient visible
- The dark background gives maximum contrast to the dashed grid lines

#### Layer 3: Dashed Line Grid/Blueprint Pattern
- **Coverage:** Extends across the LOWER 60-70% of the visual area, and also partially into the upper area behind the "Create" element
- **Grid structure:**
  - **Horizontal dashed lines:** 3-4 lines spaced approximately 40-50px apart
  - **Diagonal/perspective dashed lines:** 3-4 lines creating a perspective grid -- these lines converge toward the upper-left, as if the grid plane is tilted in 3D space
  - The grid is NOT an orthogonal flat grid -- it's shown in PERSPECTIVE, matching the isometric/3D treatment of Cards 1 and 3
- **Dash characteristics:**
  - Dash pattern: approximately 8px dash, 6px gap (or similar short-dash pattern)
  - Stroke width: 1px
  - Color: rgba(255,255,255,0.06-0.08) -- very subtle, like pencil lines on dark paper
- **The grid lines extend BEYOND the card boundaries** on all sides, clipped by overflow:hidden. This creates the "infinite blueprint" feeling -- the precision system extends in all directions
- **Grid rotation:** The entire grid is rotated approximately 15-25 degrees, so what would be "horizontal" lines run slightly diagonal, and "vertical" lines also run at an angle. This matches the rotated perspective of the "Create" button

#### Layer 2: Dot Markers at Grid Intersections
- Small dots placed at KEY intersection points of the dashed grid -- NOT at every intersection
- **Total dots visible:** Approximately 5-8 dots
- **Dot sizes:**
  - Standard dots: ~4-5px diameter
  - Emphasized dots: ~6-7px diameter (1-2 of these, marking "important" intersections)
- **Dot colors:**
  - Standard: rgba(255,255,255,0.12-0.18) -- brighter than the grid lines, creating depth hierarchy
  - The emphasized/larger dots may be very slightly brighter: rgba(255,255,255,0.20-0.25)
- **Dot placement creates a pattern** -- they mark the key structural nodes of the composition, guiding the eye from the "Create" button down through the grid
- Some dots near the card edges are PARTIALLY CLIPPED, reinforcing the "extends beyond" motif

#### Layer 1: "X" / Cross Mark
- Located in the UPPER-CENTER area of the illustration, slightly left of the "Create" button
- Size: approximately 14-18px across
- Made of two crossing lines at approximately 45/135 degrees
- Stroke width: ~1.5px
- Color: rgba(255,255,255,0.15-0.20) -- moderately visible
- Functions as a "close" or "dismiss" element in UI design language
- Adds to the "UI component blueprint" narrative -- this is a diagram of interface elements being designed/created

#### Layer 0 (Closest): "Create" Button + "+" Icon

**"Create" Button Element:**
- **Position:** Upper-right quadrant, approximately 25-35% from the top, 60-75% from the left
- **Size:** Approximately 100-130px wide x 36-44px tall
- **Rotation:** Tilted approximately -15 to -20 degrees counter-clockwise, giving it a 3D "floating in space" appearance matching the grid perspective
- **Background:** #222326 to #262628 -- slightly lighter than surrounding elements, making it the most prominent surface
- **Border:** 1px solid rgba(255,255,255,0.08-0.10) -- slightly more visible than card border
- **Corner radius:** ~8px
- **Shadow:** Approximately `0 4px 12px rgba(0,0,0,0.15-0.25)` -- makes it pop above the grid plane
- **"Create" text inside:**
  - Font-size: ~14-16px
  - Font-weight: 500
  - Color: rgba(255,255,255,0.5-0.6) -- NOT pure white, deliberately muted to match the illustrative aesthetic
  - Horizontally positioned with ~12-14px left padding inside the button
  - Vertically centered within the button height

**"+" Icon:**
- Located BELOW and slightly LEFT of the "Create" button -- approximately 20-30px separation
- The "+" is rendered as two perpendicular lines (a plus cross)
- Size: approximately 16-22px per arm
- Stroke width: ~2px
- Color: rgba(255,255,255,0.30-0.40) -- brighter than the grid but dimmer than "Create" text
- May be enclosed in a subtle circular or rounded-square boundary:
  - If present: ~32-36px diameter, border rgba(255,255,255,0.04-0.06), no fill (or barely visible fill)
- The "+" and "Create" button are conceptually connected -- together they represent the act of creating, the moment of intention becoming reality

#### Accent Elements
- **Short diagonal lines** in the lower-right area:
  - 3-5 short strokes at approximately 30-40 degrees
  - Length: 15-35px each
  - Stroke: 1px, rgba(255,255,255,0.04-0.07)
  - These parallel the grid angle and add motion/energy to the lower corner
  - They could represent "acceleration marks" or "creation sparks"

### Edge Behavior
- **Top edge:** The "X" mark and the top of the "Create" button area approach but don't clip at the top -- comfortable ~20-30px clearance
- **Right edge:** The "Create" button is PARTIALLY CLIPPED on the right -- only about 85-90% of the button is visible, with the right portion cropped by the card boundary. This is a deliberate design choice creating the "extends beyond" feeling
- **Left edge:** Grid lines continue past the left boundary, clipped
- **Bottom edge:** Grid lines and dots fade/clip as they approach the transition to the text area

### Color Gradient (Darkest to Lightest)
```
#0f1012  --  illustration background (deepest)
#111214  --  illustration background (general)
rgba(255,255,255,0.04-0.07)  --  diagonal accent lines (faintest elements)
rgba(255,255,255,0.06-0.08)  --  dashed grid lines
rgba(255,255,255,0.12-0.18)  --  standard dots
rgba(255,255,255,0.15-0.20)  --  "X" mark
rgba(255,255,255,0.20-0.25)  --  emphasized dots
#222326                       --  "Create" button fill (lightest solid surface)
rgba(255,255,255,0.30-0.40)  --  "+" icon
rgba(255,255,255,0.50-0.60)  --  "Create" text (brightest text element)
```

---

## CROSS-CARD DESIGN SYSTEM

### Shared Illustration DNA

| Property | Card 1 | Card 2 | Card 3 |
|----------|--------|--------|--------|
| **Primary metaphor** | Layered product views | Speed/latency metric | Precision creation tools |
| **Dominant shape language** | Rectangles (UI panels) | Horizontal curves (waves) | Dashed lines + crosses (grid/blueprint) |
| **Depth technique** | Stacked overlapping panels | Opacity gradient (top-bright to bottom-faint) | Perspective convergence + Z-lift (button shadow) |
| **3D rotation** | ~15-20 deg Y-axis on panels | None (2.5D through perspective lines) | ~15-20 deg Z-rotation on "Create" button |
| **Brightest element** | Foreground card (~#222326) | "50ms" text (~0.70 white opacity) | "Create" text (~0.55 white opacity) |
| **Darkest element** | Background corners (~#0e0f11) | Edge vignette (~#0e0f11) | Background (~#0f1012) |
| **Extends beyond frame** | Yes (panels clip on all 4 sides) | Yes (lines clip left + right) | Yes (button clips right, grid clips all sides) |
| **Illustration complexity** | HIGH (many elements, dense) | LOW (2 element types: text + lines) | MEDIUM (grid + button + dots) |

### The Monochrome Rule
ZERO color is used in any illustration. Every element exists on a single luminance axis:
- Pure black (#000000) is never directly used -- darkest visible element is ~#0e0f11
- Pure white (#ffffff) is never directly used -- brightest element is approximately 70-75% white opacity
- This creates a **compressed tonal range** that reads as sophisticated and unified
- Color is RESERVED for the actual product UI (not these conceptual illustrations)

### The "Extends Beyond Frame" Principle
Every card has at least one element that is CLIPPED by the card boundary:
- Card 1: Panels on left, right, and top edges
- Card 2: Speed lines on left and right edges
- Card 3: "Create" button on right edge, grid lines on all edges, dots on edges

This is a CRITICAL design principle. It communicates:
1. The system is bigger than what you can see
2. The illustration feels alive and dynamic, not contained
3. It prevents the "floating island" feeling where everything is neatly contained

### The Fade-to-Card Transition
All three illustrations share the same bottom-edge treatment:
- The illustration area gradually transitions from the darker illustration background (~#111214) to the card surface (~#141518)
- This transition happens over approximately 40-60px
- It's a linear gradient from illustration-dark to card-surface-color
- NO hard edge, NO divider line, NO border between illustration and text
- The result: illustrations feel like they GROW FROM the card surface, not sit ON it

### Negative Space Balance
Each card maintains approximately 25-35% of its illustration area as pure negative space (empty dark background). This breathing room is essential:
- Card 1: Negative space in upper-right and lower-left corners
- Card 2: Negative space above the "50ms" text and below the last speed line
- Card 3: Negative space in the lower-left quadrant

---

## COMPARISON: SCREENSHOT 03 vs SCREENSHOT 14 (Workflow Cards)

### What's SIMILAR
- Dark card surfaces with ghost borders (same card DNA)
- Content occupies the majority of the card area
- Text labels positioned below or at the bottom of the content area
- Equal-width cards in a horizontal grid
- The same restrained, premium dark aesthetic

### What's DIFFERENT
| Property | Screenshot 03 (Concept Cards) | Screenshot 14 (Workflow Cards) |
|----------|-------------------------------|-------------------------------|
| **Content type** | Abstract conceptual illustrations | Actual product UI mockups |
| **Text representation** | Placeholder bars/shapes | Real readable text (messages, usernames) |
| **Color usage** | Strictly monochrome | Some color accents (blue links, green dots) |
| **Interactivity cues** | "+" expand button at bottom-right | ">" arrows in below-card labels |
| **Narrative function** | Communicates abstract IDEAS (purpose, speed, craft) | Shows concrete FEATURES (requests, git, mobile) |
| **Label position** | INSIDE the card at the bottom | BELOW the card surface |
| **Grid columns** | 3 columns | 4 columns (with carousel navigation) |

### Key Takeaway
Screenshot 03's illustrations are CONCEPTUAL SYMBOLS -- they use abstract shapes, typography, and patterns to EVOKE a feeling (complexity/purpose, speed, precision). They are NOT showing the actual product UI.

For Findo's BigMistakeSection, the illustrations should follow this CONCEPTUAL approach: use abstract shapes and patterns to EVOKE the concept of each card (wasteful spending, slow growth, decision moment), NOT literal representations.

---

## SCREENSHOT 15 "Under the Hood" -- Additional Illustration Reference

This section provides valuable additional reference for illustration techniques:

### Dashed Border Usage
- The large right-side panel uses a **dashed border** (unique on the entire page)
- Dash pattern: approximately 6px dash, 8px gap
- Color: rgba(255,255,255,0.06-0.08)
- This "technical schematic" border style appears ONLY in the engineering/under-the-hood context
- Lesson: Dashed patterns communicate "technical precision" and "blueprint"

### Nested Block Pattern
- Within the large panel, smaller cards/blocks are nested:
  - "LINEAR SYNC ENGINE" block with the Linear logo
  - "5,000" counter block with +/- buttons
  - Security badges area with SOC-2 / SSO labels
  - "API" indicator with a dot grid pattern
  - "NATURALLY EMBEDDED ARTIFICIAL INTELLIGENCE" label
- These nested blocks use:
  - Own borders: 1px solid rgba(255,255,255,0.06)
  - Slightly different background values to create depth
  - MONOSPACE FONT for technical labels (~11-12px)
  - ROTATED TEXT (90-degree rotation) for side labels

### Diagonal Hatching Pattern
- The security section area has a diagonal hatching pattern:
  - Parallel diagonal lines at ~45 degrees
  - Very fine: ~1px stroke
  - Color: rgba(255,255,255,0.04-0.06)
  - Spacing: ~6-8px between lines
  - This matches the hatching seen in Card 1's shield/emblem shape
- Hatching is used to fill areas that represent "protected" or "structured" content

### Dot Grid Pattern
- Near the "API" label, a small grid of dots is visible:
  - Dots arranged in approximately 3x6 or similar grid
  - Each dot: ~3px diameter
  - Color: rgba(255,255,255,0.08-0.12)
  - Spacing: ~8-10px between dots
  - This communicates "data points" or "connections"

---

## SVG IMPLEMENTATION SPECIFICATIONS

### Recommended ViewBox
- Current Findo SVGs use `viewBox="0 0 280 160"` (landscape) -- this is WRONG for these card illustrations
- Linear's illustration areas are TALLER than wide when measured within the card
- **Recommended:** `viewBox="0 0 340 280"` or `viewBox="0 0 360 300"` -- a portrait/square-ish aspect ratio that fills the visual area properly

### SVG Technique Checklist
1. **`<linearGradient>`** for surface shading (lighter top, darker bottom on panels)
2. **`<radialGradient>`** for the subtle glow behind focal elements (Card 2's "50ms")
3. **`opacity` attribute** for depth hierarchy (NOT `fill-opacity` + `stroke-opacity` separately -- use `opacity` on `<g>` groups for cleaner management)
4. **`transform="rotate(X Y Z)"`** for isometric panel tilts and button rotations
5. **`<clipPath>`** for elements that extend beyond boundaries
6. **`stroke-dasharray="8 6"`** for dashed grid patterns
7. **Layered `<rect>` elements** with slight position offsets for panel stacking
8. **`<text>` elements** for hero typography ("50ms" equivalent)
9. **`<filter>` for drop-shadows** on floating elements:
   ```svg
   <filter id="shadow">
     <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.2"/>
   </filter>
   ```
10. **Bottom fade gradient mask** to dissolve the illustration bottom edge:
    ```svg
    <linearGradient id="fadeBottom" x1="0" y1="0.7" x2="0" y2="1">
      <stop offset="0" stop-color="white" stop-opacity="1"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <mask id="illustrationMask">
      <rect width="100%" height="100%" fill="url(#fadeBottom)"/>
    </mask>
    ```

### Element Count Budget
- Target: 30-50 SVG elements per illustration (balancing richness with rendering performance)
- Card 1 (most complex): up to 50 elements
- Card 2 (simplest): 15-25 elements
- Card 3 (medium): 30-40 elements

### Required `<defs>` Section
Each SVG should define in `<defs>`:
- 2-3 linear gradients for surface shading
- 1 radial gradient for focal glow (if needed)
- 1 drop-shadow filter for floating elements
- 1 mask for bottom-edge fade
- Any clipPath elements needed for overflow behavior

---

## FINAL QUALITY BENCHMARKS

An illustration meets Linear quality when:

1. **Squint test passes:** When you squint at the card, you see a cohesive dark shape with subtle internal variation -- NOT a flat gray box, and NOT a busy mess of visible elements
2. **3-second scan:** In 3 seconds, the viewer should understand the METAPHOR (stacked views / speed / precision) without reading any text
3. **Monochrome discipline:** If ANY color besides gray/white is visible in the illustration, it fails
4. **Extends beyond:** At least one element must be clipped by the card boundary
5. **Luminance range:** The brightest illustration element should not exceed rgba(255,255,255,0.75). The darkest should not be lighter than the illustration background
6. **Breathing room:** At least 25% of the illustration area should be pure negative space
7. **No outlines:** Elements differentiate through FILL values and OPACITY, not heavy border outlines
8. **Perspective consistency:** If one element is in perspective, ALL elements should share the same vanishing point direction

---

*Analysis complete. Every visible pixel documented and cataloged for reproduction.*
