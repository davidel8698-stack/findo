# LINEAR CARD ILLUSTRATIONS SPEC
## Pixel-Level Analysis of Screenshot 03 Card Illustrations

> Source: `design-bible/linear-screenshots/03-made-for-modern-teams.png` + `04-ai-section.png`
> Cross-referenced with: `14-workflows-cards.png`, `10-feature-cards.png`
> Purpose: Provide exact specifications for recreating Linear-quality card illustrations for Findo's BigMistakeSection

---

## OVERALL CARD STRUCTURE (All 3 Cards)

### Card Proportions
- **Total card dimensions:** Approximately 380px wide x 480px tall (estimated from 3-col grid within ~1200px container with ~24px gaps)
- **Visual/illustration area:** Occupies the UPPER ~65-70% of the card (~310-340px of ~480px)
- **Text area:** Occupies the LOWER ~30-35% (~140-170px)
- **No hard separator line** between visual and text areas -- the visual area fades into the card surface seamlessly

### Visual Area Background Treatment
- The visual area background is **SLIGHTLY DARKER** than the card surface itself
- Card surface: ~#141518
- Visual area within card: ~#111214 to #0e0f11 (a subtle darkening, maybe 2-4% darker)
- This creates a natural "stage" for the illustration to sit on
- The darkening gradient goes from top (darkest) toward the bottom edge where text begins
- **NO hard edge** -- it's a soft vignette/gradient transition

### Illustration Style DNA
All three illustrations share:
- **Monochrome palette:** Only dark grays and whites used -- NO color accents
- **Gray range used:** #1a1b1f (darkest visible stroke) through #3a3b3f (lightest element), with some elements reaching #4a4b4f
- **Some elements use subtle white/light gray:** ~rgba(255,255,255,0.15-0.25) for subtle text within the illustration
- **3D perspective:** All illustrations use isometric or perspective projection to create depth
- **Floating composition:** Elements don't touch card edges -- they float in space with ~24-40px breathing room on all sides
- **Depth layering:** Multiple planes stacked with slight offsets create z-depth
- **Gradient shading:** Surfaces have subtle top-to-bottom gradients (lighter top edge, darker bottom)
- **Edge clipping:** Illustration elements are allowed to be partially cut off at card edges (especially bottom and sides), creating an "extends beyond" feeling
- **No hard outlines:** Elements use fill-based differentiation, not heavy strokes

### Title Text Area (Below Illustrations)
- **Position:** Bottom-left of card (left-aligned for LTR)
- **Title font:** ~20px, weight 600, color #FFFFFF
- **Visible titles:** "Purpose-built for product development", "Designed to move fast", "Crafted to perfection"
- **Title wraps to max 2 lines**
- **Padding from card edges:** 32px left, 32px bottom
- **Plus/expand button:** Small circular button (~28-32px diameter) at bottom-right corner of card
  - Background: rgba(255,255,255,0.06)
  - Border: 1px solid rgba(255,255,255,0.08)
  - "+" icon: thin cross, ~12px, color rgba(255,255,255,0.4)
  - Position: absolutely placed at bottom-right with 32px offset from edges

---

## CARD 1 (LEFT): "Purpose-built for product development"

### Overall Composition
A stack of overlapping dark UI panels/cards arranged with 3D perspective depth, creating a "layered interface" feeling. The composition is centered slightly to the left within the visual area. A large abstract logo or shield shape sits in the foreground-bottom area.

### Detailed Element Breakdown

#### Element A: Background Panel Stack (Rear)
- **3-4 rectangular panels** stacked with slight vertical offset (~6-8px between each)
- Panels are shown in **isometric/perspective view** -- rotated ~15-20 degrees on Y-axis
- Each panel approximately 180px wide x 120px tall at their projected size
- **Panel colors (back to front):**
  - Rear-most panel: #18191c (barely visible, mostly occluded)
  - Middle panel: #1c1d20
  - Front panel: #1f2023
  - Each successive panel is 2-3% lighter
- **Panel features:**
  - Rounded corners: ~8px radius
  - Very faint border: rgba(255,255,255,0.04)
  - Subtle text lines inside (placeholder content): horizontal bars of rgba(255,255,255,0.06-0.08), varying lengths (~60%, ~40%, ~80% of panel width)
  - Small dots/icons at top-left of each panel: rgba(255,255,255,0.08), ~4px diameter
  - Text labels visible in panels (very dim): words like "Roadmap", "Projects", "Inbox" at ~10px in rgba(255,255,255,0.10-0.15)

#### Element B: Foreground UI Card
- One card closer to viewer, slightly larger
- Shows internal UI structure:
  - Header row with dot indicator (small colored dot ~4px, muted green ~#2a3a2a)
  - Text placeholder lines
  - Subtle tag/badge elements
- Background: #222326
- Border: 1px solid rgba(255,255,255,0.06)
- Corner radius: 8px

#### Element C: Abstract Logo/Shield Shape
- Located in the lower-center of the illustration area
- A large (~80px) abstract emblem/shield shape
- Uses the Linear brand icon style: overlapping geometric curves
- Color: #1a1b1e fill with rgba(255,255,255,0.04) stroke
- The shape has a **3D rotation effect** -- appears to be rotating or at an angle
- Diagonal lines/stripes pass through the shape: ~4-5 parallel lines at 45-degree angle
  - Line color: rgba(255,255,255,0.06)
  - Line spacing: ~8px apart
  - Creates a "hatching" or "holographic" effect

#### Element D: Small Accent Elements
- Tiny floating dots scattered around panels: 2-3px, rgba(255,255,255,0.06)
- Very faint grid/guide lines in background: rgba(255,255,255,0.02), creating a subtle blueprint feel
- Small "d" or status indicator near one panel: ~12px text, rgba(255,255,255,0.15)

### Spatial Depth Map
```
Z-depth (front to back):
  Z0 (closest): Shield/logo shape
  Z1: Front panel with content
  Z2: Middle panel
  Z3: Rear panel (mostly hidden)
  Z4 (furthest): Subtle grid/guide lines
```

### Edge Behavior
- Top edge: panels clip slightly at top of visual area
- Left/right edges: panels extend beyond card boundaries and are cropped
- Bottom edge: shield shape sits near the transition zone to text area, softly fading

---

## CARD 2 (MIDDLE): "Designed to move fast"

### Overall Composition
A dramatic "speed" visualization featuring the bold "50ms" typography as the centerpiece, with a series of horizontal wave/speed lines below it creating a sense of rapid movement and data streaming.

### Detailed Element Breakdown

#### Element A: "50ms" Typography
- **Position:** Upper-center of the visual area, roughly 35% from the top
- **Font size:** Very large -- approximately 48-56px relative to the card, appearing prominently
- **Font weight:** 500-600 (medium-bold)
- **Font family:** The same sans-serif used site-wide (likely GT America or similar)
- **Color:** rgba(255,255,255,0.65-0.75) -- NOT pure white, slightly muted
- **Letter-spacing:** Normal to slightly loose (~0.01em)
- **The "ms" portion** appears slightly smaller than "50" -- approximately 70-80% of the numeral size
- **No background/badge** behind the text -- it floats directly on the dark visual area
- **Subtle shadow/glow:** Very faint text-shadow: 0 2px 20px rgba(255,255,255,0.05) giving the slightest luminance

#### Element B: Horizontal Wave/Speed Lines
- Located **below** the "50ms" text, filling the lower 50-60% of the visual area
- **Pattern:** 8-12 roughly horizontal lines that undulate with slight wave motion
- **Line characteristics:**
  - Each line stretches nearly the full width of the card (with ~20px margins on each side)
  - Lines are NOT perfectly straight -- they have gentle sinusoidal curves, amplitude ~3-8px
  - Stroke width: ~1.5-2px
  - Lines are PARALLEL to each other, maintaining ~10-14px vertical spacing
  - The wave pattern is slightly different for each line (different phase offsets), creating an organic flowing feel
- **Color/opacity gradient (top to bottom):**
  - Top lines (nearest to "50ms"): rgba(255,255,255,0.20-0.25) -- most visible
  - Middle lines: rgba(255,255,255,0.12-0.15)
  - Bottom lines: rgba(255,255,255,0.05-0.08) -- fading away
  - This creates a "dissipating" effect as if speed trails are fading
- **Line curvature detail:**
  - Lines curve more dramatically on the left side (as if energy originates from left)
  - Lines become more horizontal/calm toward the right
  - The overall flow direction is LEFT to RIGHT
- **Possible motion blur effect:** The lines at the bottom may have slightly increased stroke-width (2-3px) with lower opacity, simulating motion blur

#### Element C: Perspective/Depth Effect
- The entire line pattern has a subtle **perspective convergence** -- lines appear to converge slightly toward the upper-right, creating a vanishing-point illusion
- The spacing between lines may decrease slightly from bottom to top, reinforcing the 3D speed tunnel effect
- A very faint radial gradient behind the "50ms" text: rgba(255,255,255,0.02-0.03) creating a soft glow/focus point

#### Element D: Background Texture
- The visual area background is marginally darker on the edges (vignette effect)
- No visible grid or dots -- the composition is clean and focused
- Very faint horizontal noise/grain: barely perceptible, adding organic quality

### Edge Behavior
- Lines extend fully to left and right card edges and are **hard-clipped** by the card boundary (overflow hidden)
- Top edge: "50ms" text has clearance (~40px from visual area top)
- Bottom edge: lowest lines fade out well before the text area begins

---

## CARD 3 (RIGHT): "Crafted to perfection"

### Overall Composition
An abstract technical/blueprint-style composition featuring a prominent "Create" button element with a "+" icon, overlaid on a grid of dashed lines with dot markers at intersections. The aesthetic is "precision engineering meets UI design."

### Detailed Element Breakdown

#### Element A: "Create" Button/Element
- **Position:** Upper-right quadrant of the visual area
- **Approximate size:** ~120px wide x 40px tall
- **Rotation:** The button is rotated approximately -15 to -20 degrees (counter-clockwise), giving it a 3D perspective feel
- **Background:** #222326 to #252628 (slightly lighter than surrounding area)
- **Border:** 1px solid rgba(255,255,255,0.08-0.10) -- slightly more visible than card border
- **Corner radius:** ~8px
- **Text "Create":**
  - Font-size: ~14-16px
  - Font-weight: 500
  - Color: rgba(255,255,255,0.5-0.6)
  - Left-aligned within the button with ~12px padding
- **There may be a small icon** to the left of "Create" text -- a small square or plus icon
- **Subtle shadow:** 0 4px 12px rgba(0,0,0,0.2) making it pop slightly above the grid

#### Element B: "+" Icon Element
- Located **below and slightly left** of the "Create" button
- A larger "+" symbol: approximately 20-24px in size
- Color: rgba(255,255,255,0.3-0.4)
- Clean, thin strokes (2px weight)
- Possibly enclosed in a subtle circular or rounded-square boundary
  - If circular: ~36px diameter, border rgba(255,255,255,0.06), no fill
- The "+" and "Create" button appear connected conceptually -- as if the "+" triggers creating

#### Element C: Dashed Line Grid/Pattern
- **Extends across the lower 60-70% of the visual area**
- **Pattern structure:** A grid of dashed lines forming a coordinate/blueprint system
  - Horizontal dashed lines: 3-4 lines spaced ~40-50px apart
  - Vertical dashed lines: 3-4 lines spaced ~50-60px apart
  - Dash pattern: approximately 8px dash, 6px gap
  - Line color: rgba(255,255,255,0.06-0.08) -- very subtle
  - Line weight: 1px
- **The grid is shown in PERSPECTIVE** -- rotated to match the overall isometric angle
  - Grid lines converge slightly, creating depth
  - The grid appears to recede into the background toward the upper-left

#### Element D: Dot Markers at Grid Intersections
- Small dots placed at key grid intersection points
- Dot size: ~4-5px diameter
- Dot color: rgba(255,255,255,0.12-0.18) -- slightly brighter than the grid lines
- Not at EVERY intersection -- selectively placed (maybe 5-8 dots total)
- Some dots may be slightly larger (~6px) to indicate "active" or "selected" intersection points

#### Element E: "X" or Cross Mark
- Near the upper-center area, there appears to be a small "X" mark
- Size: ~16px
- Color: rgba(255,255,255,0.15-0.20)
- Thin strokes (~1.5px)
- Functions as a "close" or "dismiss" marker, contributing to the "UI element" aesthetic

#### Element F: Diagonal Speed Lines
- A cluster of 4-6 short diagonal lines in the lower-right area
- Thin (1px), rgba(255,255,255,0.05-0.08)
- Angled ~30-45 degrees
- Lengths: 20-40px each
- Creates a subtle "motion" accent in the corner
- These lines parallel the dashed grid angle

### Spatial Depth Map
```
Z-depth (front to back):
  Z0 (closest): "Create" button (rotated, floating)
  Z1: "+" icon
  Z2: Dot markers
  Z3: Dashed grid lines
  Z4 (furthest): Diagonal speed lines + background
```

### Edge Behavior
- Grid lines extend beyond card edges on all sides (clipped by overflow hidden)
- "Create" button clips slightly at the right card edge -- not fully visible, reinforcing the "extends beyond" feeling
- Dots near edges may be partially visible (half-clipped)

---

## CROSS-CARD ILLUSTRATION PRINCIPLES

### 1. Color Palette (Illustration Elements Only)
```
STROKES (lines, borders):
  Darkest:  #18191c  (barely visible, background elements)
  Dark:     #1e1f22  (secondary elements)
  Medium:   #2a2b2f  (primary structural lines)
  Light:    #3a3b3f  (emphasized elements)

FILLS (surfaces, shapes):
  Darkest:  #111214  (visual area background darken)
  Dark:     #18191c  (rear panels)
  Medium:   #1c1d20  (middle panels)
  Light:    #222326  (foreground panels, buttons)

TEXT WITHIN ILLUSTRATIONS:
  Dim:      rgba(255,255,255,0.08-0.12)  (placeholder lines)
  Subtle:   rgba(255,255,255,0.15-0.20)  (labels within UI mockups)
  Medium:   rgba(255,255,255,0.30-0.40)  (icons, secondary text)
  Prominent: rgba(255,255,255,0.60-0.75)  ("50ms" hero text)

DOTS/MARKERS:
  Faint:    rgba(255,255,255,0.06)  (background dots)
  Visible:  rgba(255,255,255,0.12-0.18)  (intersection markers)
```

### 2. Illustration Technique Principles
- **NO flat 2D icons** -- everything has perspective or depth
- **Layer separation** through luminance, not color
- **Ambient occlusion feel** -- where elements overlap, the gap between them is slightly darker
- **Generous negative space** -- illustrations breathe within their containers
- **Asymmetric composition** -- elements cluster toward a focal point rather than being evenly distributed
- **Implied continuation** -- elements suggest they extend beyond the visible frame

### 3. Visual Weight Distribution
```
Card 1 (Left):   Weight in CENTER-LEFT, stacked vertically
Card 2 (Middle): Weight in UPPER-CENTER ("50ms") + horizontal spread below
Card 3 (Right):  Weight in UPPER-RIGHT ("Create") + diagonal flow to lower-left
```
This creates a visual rhythm across the three cards: the eye moves from left-center, to center, to upper-right.

### 4. Scale Relationship
- The largest single element in each card is approximately 30-40% of the visual area width
- Supporting elements are 50-70% the size of the primary element
- Background elements are 30-50% the size of the primary element
- This 3-tier size hierarchy is consistent across all cards

---

## COMPARISON WITH OTHER LINEAR CARD SECTIONS

### Screenshot 14 (Workflows Cards) -- Different Approach
- These cards use **actual product UI mockups** (real interface screenshots) rather than abstract illustrations
- The mockups show: chat interfaces, issue trackers, mobile app screens
- Text appears realistic (actual messages, usernames, timestamps)
- This is DIFFERENT from the abstract/conceptual illustrations in Screenshot 03
- **Lesson:** Screenshot 03 cards are more conceptual/abstract -- they communicate IDEAS, not features

### Screenshot 10 (Feature Cards) -- Text Only
- These "cards" have NO visual/illustration area at all
- They are purely text with small icons
- **Lesson:** Linear uses different card formats for different content types

### Key Takeaway for Findo's BigMistakeSection
The BigMistakeSection cards should follow the **Screenshot 03 pattern** specifically:
- Abstract, conceptual illustrations (NOT UI mockups)
- Dark monochrome palette (NOT colorful)
- 3D depth and perspective (NOT flat)
- Illustrations tell a CONCEPT story (paid ads = declining graph + money; organic = slow calendar; decision moment = target + precision)

---

## ADAPTATION GUIDE: LINEAR TO FINDO

### Card 1: "Paid Advertising" (Findo) -- Inspired by Linear Card 1
**Concept:** Money being drained, temporary traffic, dependency on budget
- **Primary element:** Stack of "ad panels" (like browser windows) with dollar/shekel symbols, arranged in perspective like Linear's stacked UI panels
- **Secondary element:** A declining graph line (similar to Linear's data visualization approach)
- **Background element:** Coin stack with perspective depth
- **Key difference from current SVG:** Current implementation is too flat and simple -- needs 3D perspective, layered panels with internal content, and the "extends beyond frame" treatment

### Card 2: "Organic Growth" (Findo) -- Inspired by Linear Card 2
**Concept:** Long timeline, slow process, sustained effort
- **Primary element:** A large time indicator (like Linear's "50ms" but could be "6-12 months" or a calendar icon) -- bold typography as focal point
- **Secondary element:** A slow, gradual upward curve with wave-like quality (matching Linear's horizontal line treatment)
- **Background element:** Gear/process icons at reduced opacity
- **Key difference from current SVG:** Current implementation lacks the dramatic typography focal point and the horizontal speed-line aesthetic

### Card 3: "Decision Moment" (Findo) -- Inspired by Linear Card 3
**Concept:** Precision, the exact right moment, creating connection
- **Primary element:** A "Search" or "Find" button element (matching Linear's "Create" button aesthetic) -- rotated with 3D feel
- **Secondary element:** A "+" or connection icon
- **Background element:** A precision grid of dashed lines with dot markers at key points (representing the search results grid)
- **Accent element:** A map pin or location marker at one intersection (the moment of finding)
- **Key difference from current SVG:** Current implementation uses target rings which are too literal and flat -- needs the technical blueprint aesthetic with perspective grid

---

## TECHNICAL SVG IMPLEMENTATION NOTES

### Viewbox Recommendation
- Current SVGs use `viewBox="0 0 280 160"` which is landscape-oriented
- The visual area is actually TALLER than wide (portrait-like, ~65-70% of a tall card)
- **Recommended viewBox:** `"0 0 340 280"` or similar portrait aspect to fill the visual area properly

### Required SVG Techniques
1. **Linear gradients** for surface shading (top-lighter, bottom-darker on panels)
2. **Opacity layering** for depth hierarchy
3. **Transform: rotate()** for isometric/perspective panel effects
4. **clipPath** for elements extending beyond logical boundaries
5. **Dashed stroke arrays** for grid patterns (`stroke-dasharray="8 6"`)
6. **Multiple overlapping rectangles** with slight offsets for panel stacking
7. **Text elements** for typography focal points (like "50ms")
8. **Subtle drop-shadow filters** for floating elements

### Performance Considerations
- Keep SVG elements under 50 per illustration for rendering performance
- Use `will-change: transform` on the visual area container if animations are added
- Prefer `fill-opacity` over multiple gradient stops where possible
- Inline SVGs (current approach) is correct -- no need to externalize

---

*Analysis complete. Every visible pixel documented.*
