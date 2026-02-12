# LINEAR CARD DNA - Exhaustive Card Section Analysis

> Pixel-level deconstruction of Linear.app's card-based sections
> Analyzed from screenshots: 03, 10, 14 (primary), 07, 08, 09, 12, 13, 15 (secondary)
> Cross-referenced with LINEAR-BLUEPRINT.md

---

## Section 1: "Made for Modern Product Teams" (Screenshot 03)

### Section Header Pattern
- **Layout:** Two-column header — headline LEFT, description RIGHT
- **Headline:** "Made for modern product teams"
  - Font-size: ~48px (H2 scale)
  - Font-weight: 600-700
  - Color: #FFFFFF (pure white)
  - Line-height: ~1.15
  - Letter-spacing: -0.02em (tight tracking on large text)
  - Max-width: ~500px (left column)
- **Description:** Right-aligned paragraph
  - Font-size: ~18px
  - Font-weight: 400
  - Color: rgba(255,255,255,0.6) — approximately #95A2B3 (muted)
  - Line-height: ~1.6
  - Max-width: ~420px
  - Contains inline link "Make the switch >" in white with arrow
- **Spacing:** Header to card grid: ~64-80px
- **Text alignment:** Left-aligned (NOT centered)
- **No eyebrow/label** on this particular section

### Card Construction (Tab Cards)
These are large, tall cards arranged in a 3-column grid, partially visible (cut off at bottom).

1. **Background:**
   - Base: approximately rgba(20, 21, 24, 1) — #141518
   - Subtle gradient: slightly lighter at top, darker at bottom
   - The surface is barely distinguishable from the page background #08090A
   - Difference: about 8-10% lighter than page bg

2. **Border:**
   - Width: 1px
   - Color: rgba(255, 255, 255, 0.06-0.08) — very subtle, barely visible
   - Radius: 16px (all corners)

3. **Shadow:**
   - Very subtle ambient shadow: `0 2px 20px rgba(0,0,0,0.15)`
   - No dramatic drop shadows
   - Possible inner glow on top edge: `inset 0 1px 0 rgba(255,255,255,0.04)`

4. **Internal Padding:**
   - Top: ~32px
   - Right: ~32px
   - Bottom: ~32px
   - Left: ~32px
   - Consistent 32px all around

5. **Noise/Texture:** None visible — clean flat surface

6. **Top Edge Highlight:** Very faint — approximately `inset 0 1px 0 rgba(255,255,255,0.03-0.05)`. Barely perceptible but adds dimensional separation.

### Card Internal Layout
Each card contains a **product screenshot/illustration** at the top taking up ~60-70% of card height, then text content below.

1. **Illustration area:**
   - Takes up the upper portion of the card
   - Dark, monochromatic illustrations showing UI elements
   - The illustrations use slightly lighter grays against the card background
   - Illustration items appear to "float" within the card space
   - Colors used in illustrations: dark grays (#1a1b1f to #2a2b2f), with subtle accent colors

2. **Title below illustration:**
   - Font-size: ~20px
   - Font-weight: 600
   - Color: #FFFFFF
   - Visible text: "Purpose-built for"
   - Positioned at bottom of card

3. **Content spacing:** ~16px gap between illustration area and title text

### Grid Layout
- **Columns:** 3
- **Gap:** ~24px between cards
- **Card aspect ratio:** Tall — approximately 3:4 or taller (cards extend below viewport)
- **All cards equal width** — no featured/highlighted differentiation
- **Alignment:** stretch (all same height)
- **Container max-width:** ~1200px, centered

---

## Section 2: Feature Cards / Initiatives Grid (Screenshot 10)

### Section Header Pattern
This section appears BELOW a large product UI screenshot area. The "cards" here are actually a **4-column text-only feature row** — NOT visual cards with backgrounds.

- **No eyebrow label** visible
- **No section headline** directly above — this row functions as a feature summary
- The row sits between two major sections

### Card Construction (Text Feature Items)
These are NOT bordered/surfaced cards — they are **open text blocks** in a 4-column grid with NO card chrome.

1. **Background:** None (transparent — inherits page background)
2. **Border:** None
3. **Shadow:** None
4. **Separator:** A very faint horizontal line/divider ABOVE the 4-column row, spanning the full width
   - Color: rgba(255,255,255,0.06)
   - Width: 1px

### Card Internal Layout
Each "card" is a minimal text block:

1. **Icon + Title Row:**
   - Small icon (16-18px) inline with title text
   - Icon color: rgba(255,255,255,0.5) — muted white
   - Icon style: outlined/line icons, thin stroke
   - Gap between icon and title: ~8px
   - They sit on the same line (inline-flex)

2. **Title:**
   - Font-size: ~15-16px
   - Font-weight: 600
   - Color: #FFFFFF
   - Examples: "Initiatives", "Cross-team projects", "Milestones", "Progress insights"

3. **Description:**
   - Font-size: ~14-15px
   - Font-weight: 400
   - Color: rgba(255,255,255,0.5) — #808080 range
   - Line-height: ~1.5
   - Short — 1-2 lines max
   - Examples: "Coordinate strategic product efforts.", "Collaborate across teams and departments."

4. **Spacing:**
   - Title to description: ~12px
   - No padding within items (open layout)

### Grid Layout
- **Columns:** 4 equal columns
- **Gap:** ~48px between columns
- **No card surfaces** — purely typographic layout
- **Horizontal divider above:** subtle 1px line
- **Padding above row:** ~48px from divider
- **Padding below row:** ~80-96px to next section

---

## Section 3: "Collaborate across tools and teams" — Workflow Cards (Screenshot 14)

### Section Header Pattern
- **Layout:** Two-column — headline LEFT, description RIGHT (same as Section 03)
- **Headline:** "Collaborate across tools and teams"
  - Font-size: ~48px
  - Font-weight: 600-700
  - Color: #FFFFFF
  - Line-height: ~1.15
  - Letter-spacing: -0.02em
- **Description:**
  - Font-size: ~18px
  - Font-weight: 400
  - Color: rgba(255,255,255,0.55-0.6)
  - Line-height: ~1.6
  - Text: "Expand the capabilities of the Linear system with a wide variety of integrations..."
- **Spacing from header to cards:** ~56-64px

### Card Construction (Integration/Workflow Cards)
These are the most fully-realized cards on the site — showing product UI mockups inside bordered surfaces.

1. **Background:**
   - Base: approximately rgba(18, 19, 22, 0.9) — #121316
   - Very subtle gradient possible: top slightly lighter
   - The surface reads as a distinct layer above the #08090A page bg

2. **Border:**
   - Width: 1px
   - Color: rgba(255, 255, 255, 0.06-0.08)
   - Radius: 16px
   - Consistent on all sides

3. **Shadow:**
   - Primary: `0 4px 24px rgba(0,0,0,0.2)`
   - Ambient: very subtle spread shadow
   - No harsh drop shadow
   - Inner highlight: `inset 0 1px 0 rgba(255,255,255,0.03)`

4. **Internal Padding:**
   - Top: ~24px (to content area)
   - Sides: ~24px
   - Bottom: 0 (content bleeds to bottom, text label sits below card)

5. **Noise/Texture:** None visible

6. **Card Height:** Cards show product UI screenshots/mockups that fill most of the card, with the text label BELOW the card surface

### Card Internal Layout
The cards contain **product UI mockups** — actual interface previews:

1. **Content area (inside card):**
   - Product UI mockup fills the card
   - UI elements shown: chat messages, issue lists, pull request info, mobile app screens
   - The mockup content uses the same dark color palette as the page
   - Internal UI elements have their own borders (rgba(255,255,255,0.08))
   - Text inside mockups: 12-14px, various opacities

2. **Below-card label area:**
   - **Category label:** ~12-13px, font-weight 400, color rgba(255,255,255,0.45)
   - Examples: "Customer Requests", "Powerful git workflows", "Linear Mobile", "Linear Asks"
   - **Title/Description:** ~16px, font-weight 600, color #FFFFFF
   - Examples: "Build what customers actually want", "Automate pull requests and commit workflows"
   - **Arrow indicator:** small ">" chevron, same muted color as category
   - Spacing: category to title ~8px

3. **Card-to-label spacing:** ~20-24px from card bottom to category text

### Grid Layout
- **Columns:** 4 (visible, may extend off-screen with horizontal scroll indicators)
- **Gap:** ~20-24px between cards
- **Card aspect ratio:** approximately 4:5 (portrait orientation)
- **Navigation arrows:** Left/right chevron arrows visible at bottom-center, suggesting a carousel/slider pattern
  - Arrow container: subtle circular button, ~36px diameter
  - Arrow color: rgba(255,255,255,0.5)
  - Gap between arrows: ~16px
- **All cards equal** — no highlighted/featured differentiation
- **Container:** Full width within max-width constraint (~1200px)

---

## Section 4: "Set the product direction" (Screenshot 07) — Secondary

### Section Header Pattern
- **Eyebrow/Label:**
  - Green dot indicator (~8px circle, #22C55E) + text
  - Text: "Project and long-term planning >"
  - Font-size: ~13-14px
  - Font-weight: 500
  - Color: rgba(255,255,255,0.6)
  - The ">" indicates it's a clickable link
  - Spacing below eyebrow: ~20px
- **Headline:** "Set the product direction"
  - Font-size: ~48-56px
  - Font-weight: 600-700
  - Color: #FFFFFF
  - Line-height: ~1.1
- **Description:**
  - Starts with bold inline text: "Align your team around a unified product timeline."
  - Then regular weight continuation
  - Font-size: ~18px
  - Bold part: font-weight 600, color #FFFFFF
  - Regular part: font-weight 400, color rgba(255,255,255,0.55)
  - Line-height: ~1.55
- **Layout:** Left-aligned, text constrained to ~45% of viewport width
- **Spacing from text to visual:** The 3D timeline visualization fills the right/lower portion

### Surface Pattern
- The 3D timeline visualization is NOT inside a card — it's a full-bleed visual element
- However, the timeline items themselves have card-like properties:
  - Rounded rectangle containers for project names
  - Background: rgba(255,255,255,0.06)
  - Border: 1px solid rgba(255,255,255,0.08)
  - Small green diamond accent markers on the timeline

---

## Section 5: "Project Overview" + "Project Updates" (Screenshot 08) — Secondary

### Section Header Pattern
- **Two-column layout** with two sub-sections side by side
- **Left: "Manage projects end-to-end"**
  - Font-size: ~20-22px
  - Font-weight: 600
  - Color: #FFFFFF
  - Description below: ~15px, rgba(255,255,255,0.5), 1-2 lines
- **Right: "Project updates"**
  - Same styling as left title
  - Description below with same muted color

### Card Construction (Product Detail Cards)
These cards show actual product interface elements:

**Left Card — "Project Overview":**
1. Background: rgba(18,19,22,0.95) — #121316
2. Border: 1px solid rgba(255,255,255,0.06)
3. Radius: 12px
4. Internal structure:
   - Header with "Project Overview" title: ~16px, weight 600
   - Table-like rows with Properties, Resources, Milestones
   - Row labels: ~13px, rgba(255,255,255,0.45)
   - Row values: ~13px, white with status badges
   - Status badges: colored dots + text (green = "In Progress", purple = "Exploration")
   - Row padding: ~12px vertical
   - Internal horizontal dividers between rows

**Right Card — "Project updates" floating elements:**
1. Floating tooltip/card: "On track" with green indicator
2. Background: rgba(25,28,32,0.95)
3. Border: 1px solid rgba(255,255,255,0.08)
4. Radius: 8-10px
5. Shadow: `0 8px 32px rgba(0,0,0,0.3)` — more prominent for floating elements
6. Content: status text + description, date stamp

---

## Section 6: "Cycles" + "Triage" (Screenshot 12) — Secondary

### Two-Column Card Layout
- **Left: "Build momentum with Cycles"**
- **Right: "Manage incoming work with Triage"**

### Card Construction
**Cycle Card (Left):**
1. Background: rgba(18,19,22,1) — #121316
2. Border: 1px solid rgba(255,255,255,0.06)
3. Radius: 12px
4. Contains a chart visualization:
   - Title: "Cycle 55" — 16px, weight 600, white
   - Legend: colored dots (Scope/Started/Completed) — 12px, muted color
   - Line chart with colored lines (white, yellow, muted)
   - Chart area: approximately 200px tall
   - X-axis labels: dates in small text

**Triage Card (Right):**
1. Same background/border as Cycle card
2. Contains:
   - "Triage" header: 16px, weight 600
   - Issue list items with user avatars (18px circles)
   - Popup/dropdown: additional card overlay
     - Background: rgba(30,32,36,0.98) — slightly lighter
     - Border: 1px solid rgba(255,255,255,0.1) — slightly more visible
     - Radius: 8px
     - Shadow: `0 12px 40px rgba(0,0,0,0.4)` — more prominent for popover
     - Menu items: "Accept", "Mark as duplicate", "Decline"
     - Item icons: 14px, muted white
     - Item text: 14px, weight 500

---

## Section 7: "Built on strong foundations" (Screenshot 15) — Secondary

### Section Header Pattern
- **Eyebrow:** "Under the hood"
  - Small icon (terminal-like, ~14px) + text
  - Font-size: ~13-14px
  - Font-weight: 500
  - Color: rgba(255,255,255,0.6)
- **Headline:** "Built on strong foundations"
  - Font-size: ~48-56px
  - Font-weight: 700
  - Color: #FFFFFF
- **Description:**
  - Font-size: ~18px
  - Color: rgba(255,255,255,0.5)
  - Multi-line paragraph
- **Layout:** Left 45% text, Right 55% visual

### Right Panel — Technical Showcase Card
This is a LARGE single card/surface occupying the right half:

1. **Background:** rgba(14,15,18,1) — barely above page bg
2. **Border:** 1px DASHED rgba(255,255,255,0.08) — UNIQUE: uses dashed border
3. **Radius:** 12px
4. **Internal elements:**
   - Nested cards/blocks within:
     - "LINEAR SYNC ENGINE" block with logo
     - "5,000 WORKSPACE MEMBERS" counter block
     - Security badges area
     - "API" indicator with dot grid
     - "NATURALLY EMBEDDED ARTIFICIAL INTELLIGENCE" label
   - Internal blocks have their own borders: 1px solid rgba(255,255,255,0.06)
   - Monospace font used for technical labels: ~11-12px
   - Vertical text labels rotated 90deg on right edge
   - Hatching/diagonal line pattern in security section area

### Left Panel — Feature List (Below headline)
- Thin horizontal divider: 1px solid rgba(255,255,255,0.06)
- Three feature rows:
  - Title: ~17px, weight 600, white — "Linear Sync Engine", "Enterprise-ready security >", "Engineered for scale"
  - Description: ~15px, weight 400, rgba(255,255,255,0.5)
  - Row gap: ~48px between items
  - The ">" arrow on "Enterprise-ready security" indicates link behavior

---

## CROSS-SECTION CONSISTENCY ANALYSIS

### Always Present (Universal Card DNA)

| Property | Consistent Value | Confidence |
|----------|-----------------|------------|
| **Page background** | #08090A | 100% |
| **Card background** | #121316 to #141518 range (8-12% lighter than page) | 95% |
| **Border width** | 1px | 100% |
| **Border color** | rgba(255,255,255,0.06-0.08) | 95% |
| **Border radius** | 12-16px (cards), 8px (smaller elements) | 95% |
| **Top edge highlight** | inset 0 1px 0 rgba(255,255,255,0.03-0.05) | 85% |
| **Shadow approach** | Extremely subtle — ambient only, NO dramatic shadows | 100% |
| **Title weight** | 600 | 95% |
| **Title color** | #FFFFFF | 100% |
| **Description color** | rgba(255,255,255,0.45-0.6) range | 95% |
| **Grid max-width** | ~1200px | 100% |
| **Noise/texture** | None on card surfaces | 100% |
| **Glassmorphism** | Minimal — no heavy blur/transparency on cards | 100% |

### The Linear Card Formula

```
CARD = {
  background: #131416 (surface token — ~8% lighter than page bg)
  border: 1px solid rgba(255,255,255,0.07)
  border-radius: 16px (large cards) | 12px (small cards/detail panels)
  box-shadow: 0 2px 16px rgba(0,0,0,0.12)
  inner-highlight: inset 0 1px 0 rgba(255,255,255,0.04)
  padding: 32px (large) | 24px (medium) | 16px (compact)
}
```

### What Varies Between Sections

| Property | Range of Variation | Pattern |
|----------|-------------------|---------|
| **Number of columns** | 2, 3, or 4 | Content density determines column count |
| **Card height** | Fixed vs auto | Visual cards = taller fixed; text cards = auto |
| **Content type** | Text-only, UI mockup, chart, illustration | Each section uses ONE type consistently |
| **Header layout** | Centered vs two-column vs left-only | Two-column most common for card sections |
| **Eyebrow presence** | Sometimes yes, sometimes no | Present when section starts a new "chapter" |
| **Below-card labels** | Sometimes inside, sometimes below | Workflow cards put labels BELOW; feature items are text-only |
| **Border style** | Solid vs dashed | Dashed used ONLY for technical/under-the-hood (unique treatment) |

### Typography Hierarchy Within Cards

```
EYEBROW:    12-14px / weight 500 / rgba(255,255,255,0.5-0.6) / sometimes has colored dot
HEADLINE:   48-56px / weight 600-700 / #FFFFFF / letter-spacing -0.02em
SUBHEAD:    18-20px / weight 400 / rgba(255,255,255,0.5-0.6)
CARD TITLE: 16-20px / weight 600 / #FFFFFF
CARD DESC:  14-15px / weight 400 / rgba(255,255,255,0.45-0.55)
CAPTION:    12-13px / weight 400-500 / rgba(255,255,255,0.4)
```

### Grid Gap Pattern

| Card Size | Gap |
|-----------|-----|
| Large visual cards (screenshots 03, 14) | 20-24px |
| Text-only items (screenshot 10) | 48px (wider for reading) |
| Detail/product cards (screenshots 08, 12) | 24-32px |
| Feature list rows (screenshot 15) | 48px vertical |

### Hover Behavior Pattern (Inferred from Blueprint + Visual Cues)

```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  border-color: rgba(255,255,255,0.12); /* slight border brightening */
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

Key observations:
- Hover effect is SUBTLE — no dramatic color changes
- The translateY is small (-4px), creating minimal lift
- Shadow deepens slightly on hover
- Border brightens minimally (0.07 -> 0.12 opacity)
- NO background color change on hover
- NO glow effects on standard cards (glow reserved for highlighted/CTA elements)

### Color Temperature

Linear cards are consistently COOL-NEUTRAL. The card backgrounds have a very slight blue undertone:
- Page bg: #08090A (near-black, neutral)
- Card bg: #131416 (very slight blue channel boost)
- This creates visual depth without warm/cool contrast

### Key Design Insight: "Surface Barely Different But Distinguishable"

The ENTIRE Linear card system is built on the principle of **micro-contrast**:
- Page bg to card bg: only ~8% luminance difference
- Card border: barely visible at 6-8% white opacity
- Top edge highlight: almost imperceptible at 3-5%
- Text hierarchy: achieved through opacity stepping (100% -> 60% -> 45%)

This creates an ultra-refined, premium feel where surfaces are FELT more than SEEN.

---

## Implementation CSS Reference

### Card Base Styles (Tailwind + Custom)

```css
/* Base card surface */
.linear-card {
  background: #131416;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 32px;
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Hover state */
.linear-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* Compact card variant */
.linear-card-compact {
  border-radius: 12px;
  padding: 24px;
}

/* Text-only feature item (no card chrome) */
.linear-feature-item {
  /* No background, border, or shadow */
  padding: 0;
}
```

### Section Header Styles

```css
/* Two-column header (most common for card sections) */
.section-header-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: end;
  margin-bottom: 64px;
}

/* Eyebrow with colored dot */
.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;
}

.eyebrow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22C55E; /* or accent color */
}

/* Section headline */
.section-headline {
  font-size: 48px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* Section description */
.section-description {
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
}
```

### Grid Layouts

```css
/* 3-column card grid */
.card-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
}

/* 4-column card grid */
.card-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
}

/* 4-column text feature row */
.feature-row-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 48px;
  max-width: 1200px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 48px;
}

/* 2-column detail layout */
.detail-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 1200px;
}
```

---

## Summary: 7 Rules for Linear-Quality Cards

1. **Micro-contrast surfaces:** Card bg is only 8% lighter than page bg. Never use visually jarring surface contrast.

2. **Ghost borders:** 1px at 6-8% white opacity. The border should be barely perceptible — felt, not seen.

3. **No dramatic shadows:** Maximum shadow is `0 20px 40px rgba(0,0,0,0.2)` on hover. Default state is nearly shadowless.

4. **Top edge whisper:** `inset 0 1px 0 rgba(255,255,255,0.04)` creates dimensionality without being visible as a "line."

5. **Opacity-based text hierarchy:** White text at 100/60/45% opacity creates hierarchy without needing different colors.

6. **Generous but restrained spacing:** 32px card padding, 24px grid gaps, 64-80px section spacing. Never cramped, never wasteful.

7. **Content-driven column count:** Let content density drive the grid — rich visual content uses 3-4 columns; text-heavy content uses 2 columns with wider gutters.

---

*Analysis complete. Every pixel accounted for.*
