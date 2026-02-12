# LINEAR.APP VISUAL DNA -- Complete Design Language Analysis

> Extracted from 17 screenshots (00-16) of linear.app homepage.
> This document is detailed enough to recreate Linear's design language from scratch.

---

## 1. GLOBAL FOUNDATIONS

### 1.1 Background System

Linear uses a **near-black base** that is NOT pure black. The entire page sits on a background of approximately `#0a0a0b` to `#0e0e10`. This is critical -- pure `#000000` would feel flat and dead. Linear's background has a barely perceptible warm-cool tint that gives it depth.

**Background layers (bottom to top):**
1. **Base canvas**: `#0a0a0b` -- the deepest layer, visible in section gaps
2. **Section backgrounds**: `#111113` to `#131315` -- slightly elevated surfaces for content areas
3. **Card surfaces**: `#191919` to `#1a1a1c` -- the elevated card/panel material
4. **Interactive surfaces**: `#222224` to `#252527` -- hover states, input fields

**No visible noise or grain texture** on the main backgrounds. The atmospheric quality comes from subtle gradient washes and ambient glow, NOT overlay textures.

### 1.2 The Navigation Bar

- **Fixed/sticky** at the top with a subtle backdrop blur
- Background: semi-transparent dark, approximately `rgba(10, 10, 11, 0.8)` with `backdrop-filter: blur(12px)`
- Logo: Linear wordmark + icon in white, approximately 18-20px height
- Nav links: `~#a0a0a0` (secondary gray), ~14px, font-weight 400 (regular)
- Nav link spacing: ~32-40px between items
- "Log in" link: same style as nav links, no special treatment
- "Sign up" button: outlined/bordered button, `border: 1px solid rgba(255,255,255,0.2)`, border-radius ~8px, padding ~8px 16px, white text
- Overall nav height: approximately 56-64px
- Nav items: Product, Resources, Pricing, Customers, Now, Contact

### 1.3 Typography System

Linear uses a **sans-serif system** that appears to be their own custom font or a high-quality geometric sans (similar to Inter or their custom "Linear" font, but with tighter metrics).

**Hierarchy levels:**

| Level | Size (est.) | Weight | Color | Letter-spacing | Line-height | Usage |
|-------|-------------|--------|-------|----------------|-------------|-------|
| **Mega headline** | 56-64px | 500-600 (medium-semibold) | `#ffffff` | `-0.02em` to `-0.03em` (tight) | 1.05-1.1 | Hero headline |
| **Section headline** | 44-52px | 500-600 | `#ffffff` | `-0.02em` | 1.1-1.15 | "Made for modern product teams", "Set the product direction" |
| **Sub-section headline** | 24-28px | 600 (semibold) | `#ffffff` | `-0.01em` | 1.2 | "Manage projects end-to-end", card titles |
| **Category label** | 13-14px | 400-500 | `#8a8a8a` to `#a0a0a0` | `0.01em` to `0.02em` (slightly wide) | 1.4 | "Artificial intelligence >", "Task tracking and sprint planning >" |
| **Body text** | 16-18px | 400 | `#888888` to `#999999` | `0em` | 1.5-1.6 | Description paragraphs |
| **Small body** | 14-15px | 400 | `#777777` to `#888888` | `0em` | 1.5 | Card descriptions, secondary info |
| **Caption/micro** | 12-13px | 400-500 | `#666666` to `#777777` | `0.02em` | 1.4 | Fine print, badges |

**The "Whisper-Shout" Pattern:**
This is Linear's signature move. Every major section follows this exact sequence:
1. **Whisper**: A small category label (13-14px, muted gray, sometimes with a colored dot and arrow `>`)
2. **Shout**: A massive headline (44-64px, white, tight letter-spacing)
3. **Explain**: A medium body paragraph (16-18px, muted gray)
4. **(Optional) CTA**: A button or "Learn more >" link

The contrast ratio between the whisper and shout is extreme -- roughly 4:1 size ratio with a dramatic color shift from muted gray to pure white.

### 1.4 Color Philosophy

Linear is **aggressively monochromatic**. The entire site is:
- 90% grays (from near-black to white)
- 8% very subtle colored accents (green dots, yellow chart lines, blue data points)
- 2% interactive elements (teal/cyan for links, white for CTAs)

**Color accent usage rules:**
- Colored dots appear next to category labels (small, 6-8px circles)
- Green (`#4ade80`-ish) appears in: status indicators ("On track", "In Progress"), category dots
- Yellow/amber appears in: chart data lines, priority indicators
- Blue/cyan (`#6ee7f0`-ish) appears in: data visualization scatter plots
- Purple appears in: avatar/icon accents (very rare)
- **NO gradients in text.** NO colorful backgrounds. NO accent-colored sections.

**The "almost invisible" accent principle:** When color appears, it is tiny -- a 6px dot, a 1px chart line, a small status badge. Color never dominates. It punctuates.

### 1.5 Spacing Rhythm

Linear uses a **generous, breathable** spacing system based on an 8px grid:

- **Section padding (vertical)**: 120-160px top and bottom (massive breathing room)
- **Section gap**: 80-120px between major sections
- **Headline to body text**: 16-24px
- **Body text to CTA**: 24-32px
- **Category label to headline**: 12-16px
- **Card internal padding**: 24-32px
- **Card gap (in grids)**: 16-24px
- **Content max-width**: approximately 1200-1280px, centered
- **Left margin for text blocks**: approximately 200-220px from left edge of container (not edge-to-edge)

**The whitespace is not accidental.** There are sections with 200+ pixels of pure empty space between content blocks. This is the single biggest differentiator from amateur designs -- the courage to leave space empty.

---

## 2. SECTION-BY-SECTION ANALYSIS

### 2.1 Hero Section (Screenshots 01-02)

**Layout:**
- Left-aligned headline text, approximately 60% width
- Background: product UI screenshots at ~15-25% opacity, perspective-tilted, fading into the dark background
- The product screenshots create an ambient "world" behind the text without competing for attention

**Headline:**
- "Linear is a purpose-built tool for planning and building products"
- Estimated 56-60px, weight 500-600, white `#ffffff`
- Letter-spacing: tight, approximately `-0.025em`
- Line-height: ~1.08

**Subtext:**
- "Meet the system for modern software development. Streamline issues, projects, and product roadmaps."
- ~16px, weight 400, color `#888888`
- 24px below headline

**CTA area:**
- Primary button: "Start building" -- filled button with subtle border, likely `bg-white/10` or similar, rounded ~8px
- Secondary link: "New: Linear Reviews (Beta) >" -- plain text link
- Gap between headline and CTA: ~32px

**Background treatment:**
- Multiple product UI panels shown at oblique angles (3D perspective transform)
- Panels have very low opacity (~15-25%) and are progressively darker toward edges
- A subtle radial gradient glow behind the center, barely perceptible
- The overall effect: "the product exists in this dark space, emerging from shadow"

### 2.2 Customer Logos Section (Screenshots 02-03)

**Label text:**
- "Powering the world's best product teams."
- ~18-20px, weight 400-500, color `#cccccc` to `#dddddd` (brighter than body text)
- "From next-gen startups to established enterprises."
- ~16px, color `#888888`

**Logo grid:**
- 4 columns x 2 rows = 8 logos
- Logos: OpenAI, Cash App, Scale, Ramp, Vercel, Coinbase, BOOM, CURSOR
- All logos in **white/light gray monochrome** -- no brand colors
- Logo sizing: approximately 100-140px wide, vertically centered
- Grid gap: generous, approximately 80-120px horizontal between logo centers
- Logo opacity: approximately 70-80% white (not pure white, slightly muted)

**Transition from hero:** The product screenshots fade out, then substantial whitespace (120px+), then the "Powering..." text, then the logos.

### 2.3 "Made for Modern Product Teams" Section (Screenshots 03-04)

**Layout: Split composition**
- Left side (~45%): "Made for modern product teams" headline
- Right side (~55%): Description paragraph with "Make the switch >" link

**Headline:**
- ~48-52px, weight 500-600, white
- Two lines: "Made for modern / product teams"
- Tight letter-spacing `-0.02em`

**Description:**
- ~16-17px, weight 400, color `#999999`
- "Linear is shaped by the practices and principles that distinguish world-class product teams from the rest: relentless focus, fast execution, and a commitment to the quality of craft."
- The words "Make the switch" are white, acting as an inline link with `>` arrow

**Three cards below (the "value proposition" cards):**
- 3-column grid, equal width
- Card background: `#1a1a1c` to `#1e1e20` -- a surface barely lighter than the page
- Card border: `1px solid rgba(255,255,255,0.06)` to `0.08` -- almost invisible, just enough to define edges
- Card border-radius: ~12-16px
- Card padding: ~24-32px
- Card height: roughly equal, ~300-350px including the illustration area

**Card contents:**
1. **"Purpose-built for product development"** -- Shows a dark 3D illustration of the Linear logo/icon with layered cards behind it
2. **"Designed to move fast"** -- Shows "50ms" text with motion lines (speed visualization)
3. **"Crafted to perfection"** -- Shows a "Create" interface element with cursor/grid design

Each card has:
- An illustration/visual taking up the top ~60-70% of the card
- Title text at bottom: ~18-20px, weight 600, white
- A small `+` button in the top-right or bottom-right corner (~28px circle, subtle border)
- The illustrations are rendered in **monochrome grays** with very subtle depth -- no color in the illustrations themselves

### 2.4 AI Section (Screenshots 04-05)

**Category label:**
- Small colored dot (teal/blue, ~6px) + "Artificial intelligence" + ">" arrow
- ~13-14px, color `#8a8a8a`, the dot is the only color

**Headline:**
- "AI-assisted product development"
- ~48-52px, weight 500-600, white

**Body:**
- "Linear for Agents." (bold white) + rest in muted gray
- The bold lead-in phrase pattern: first few words in white bold, rest in gray

**CTA:**
- "Learn more >" -- button with subtle border, ~14px text

**Visual (below text):**
- A dropdown/select UI showing "Assign to..." with agent options: Cursor, GitHub Copilot, Sentry, Leela, Codex, Conor
- This is a product UI screenshot with glass-morphism effect
- The dropdown has a very subtle backdrop blur and elevated surface
- Selected item (Cursor) has a checkmark
- "Agent" badges next to some names -- small gray pills

**Sub-features (below the dropdown):**
- Two-column layout separated by a vertical thin line (`1px solid rgba(255,255,255,0.08)`)
- Left: "Self-driving product operations" (white, bold) + description (gray)
- Right: "Linear MCP" (white, bold) + description (gray)

### 2.5 Triage Intelligence Section (Screenshot 06)

**Layout:** Two-column, each with a product UI panel

**Left panel: Triage Intelligence**
- A card showing "Triage Intelligence" heading
- Shows suggestion pills, "Duplicate of" / "Related to" fields
- A tooltip/popover explaining "Why this assignee was suggested"
- "Accept suggestion" button at bottom
- Card surface: `~#1a1a1c` with subtle border

**Right panel: Linear MCP**
- Code block showing JSON configuration (`//mcp.linear.app/sse`)
- Syntax-highlighted with muted colors (green for strings, white for keys)
- Below the code: an "Ask anything" chat input
- Action buttons: Attach, Search, Reason -- pill-shaped with icons

**Critical observation:** Both panels sit on the same dark background. They are separated by a vertical thin line, NOT by different background colors. The visual separation is achieved through the card surfaces and whitespace alone.

### 2.6 Product Direction Section (Screenshots 07-08)

**Category label:**
- Green dot + "Project and long-term planning" + ">"
- Same whisper-shout pattern

**Headline:**
- "Set the product direction"
- ~48px, white

**Body:**
- "Align your team around a unified product timeline." (white bold lead-in) + rest in gray

**Visual:** A large product UI showing a timeline/Gantt view:
- Angled perspective (3D tilt)
- Shows date headers (AUG 22, SEP), project bars (Realtime inference, Prototype, Beta, RLHF fine tuning)
- Green diamond milestone markers
- The timeline UI uses a dark surface with very subtle grid lines
- Labels are in a monospace or small sans-serif, muted gray

**Sub-sections (below the timeline):**
- Two-column layout
- "Manage projects end-to-end" + "Project updates"
- Each has: bold white title (~22-24px) + gray description (~15px)

**Product UI panels below:**
- "Project Overview" card: shows Properties, Resources, Milestones in a structured list
- "On track" status badge -- green dot + "On track" text
- Status update card with message preview

### 2.7 Collaborative Docs Section (Screenshot 09)

**Layout:** Left sidebar of feature items + right product UI panel

**Left side feature list:**
- "Ideate and specify what to build next"
- ~24-28px, weight 600, white
- Below: three bullet items with left border indicator
  - "Collaborative documents" (has a left blue/teal border, appears "active")
  - "Inline comments"
  - "Text-to-issue commands"
- The active item has a ~3px left border in a subtle color
- Inactive items: just text, muted

**Right product UI:**
- Shows "Spice harvester > Project specs" breadcrumb at top
- An icon/emoji (green alien face)
- "Collaborate on ideas" heading
- Body text about writing product ideas
- Below: a Gantt/timeline style bar chart

### 2.8 Feature Cards Grid (Screenshot 10)

**THIS IS A KEY PATTERN -- The 4-column feature card row:**

**Layout:** 4 cards in a horizontal row with even spacing

Each card contains:
- **Icon** (~20px, monochrome gray/white) on the left
- **Title** (~16-18px, weight 600, white) next to icon
- **Description** (~14-15px, weight 400, color `#888888`) below

**Cards:**
1. Initiatives -- flag/antenna icon -- "Coordinate strategic product efforts."
2. Cross-team projects -- globe icon -- "Collaborate across teams and departments."
3. Milestones -- diamond icon -- "Break projects down into concrete phases."
4. Progress insights -- bar chart icon -- "Track scope, velocity, and progress over time."

**Card styling:**
- NO card background/surface -- these sit directly on the dark background
- NO borders
- A horizontal thin line (`1px solid rgba(255,255,255,0.06)`) ABOVE the card row spans the full width
- The icons are very small and understated
- Spacing between icon and title: ~8px
- Spacing between title and description: ~8-12px
- This is a "flat feature list" pattern, not a raised card

### 2.9 Issue Tracking Section (Screenshot 11)

**Category label:**
- Yellow/amber dot + "Task tracking and sprint planning" + ">"

**Headline:**
- "Issue tracking you'll enjoy using"
- ~48-52px, white, tight spacing
- Uses an italic or slightly different weight for emphasis feel

**Body:**
- "Optimized for speed and efficiency." (white bold) + rest in gray

**Visual:** Floating issue cards in a dark space:
- Multiple issue cards at different depths/angles (parallax-like)
- Each card shows: priority label, issue ID (ENG-1025), title, tags
- Cards have: dark surface `~#1a1a1c`, subtle border, ~12px border-radius
- Status icons with priority colors (yellow for High Priority, red for Urgent)
- Tags/labels as small pills: "UI Refresh", "PSD2 Registration"
- Cards overlap and fade at the edges, creating depth
- The background is pure dark -- the cards "float" in space

### 2.10 Cycles & Triage Section (Screenshots 12-13)

**Two-column layout:**

**Left: "Build momentum with Cycles"**
- Title: ~22-24px, white, bold
- Description: gray
- Product UI: "Cycle 55" chart card
  - Shows Scope/Started/Completed legend with colored dots
  - Line chart with yellow and muted lines
  - Card surface: `#191919` to `#1c1c1e`, border-radius ~12px
  - Chart colors: yellow for one metric, gray for another

**Right: "Manage incoming work with Triage"**
- Title: ~22-24px, white, bold
- Description: gray
- Product UI: "Triage" card
  - Shows issue text with dropdown menu: Accept, Mark as duplicate, Decline
  - The dropdown has a darker surface than the card
  - Checkmark/action icons next to each option

### 2.11 Linear Insights (Screenshot 13)

**Title:** "Linear Insights" -- ~28-32px, white, bold
**Description:** gray body text
**CTA:** "Learn more >" button with border

**Visual:** A 3D data visualization scatter plot
- Dots in multiple colors (blue, cyan, green, yellow)
- Axis labels along edges: "Momentum", "Cycle Time", "Completion rate", "Assignee", "Team"
- The visualization is rendered in perspective (3D angle)
- Dark background, data points are the only color burst

### 2.12 Collaborate Across Tools (Screenshot 14 -- Workflows Cards)

**Headline:**
- "Collaborate across tools and teams"
- ~48px, white

**Description:**
- Right-aligned paragraph block
- ~16px gray

**Card grid: Three product UI cards + phone mockup**

**Card 1 (left): Customer Requests**
- Shows integration messages (Intercom, etc.)
- Card has structured list items with icons and brief descriptions
- Surface: standard dark card treatment

**Card 2 (center): Git Workflows**
- Shows git activity feed with linked/changed status items
- Monochrome with status text

**Card 3 (right): Linear Mobile**
- Shows a phone mockup (dark phone frame) with the Linear mobile app
- "Inbox" view visible on screen

**Below the cards -- Feature labels:**
- 4-column text row (same pattern as Screenshot 10)
- "Customer Requests" / "Powerful git workflows" / "Linear Mobile" / "Linear Asks"
- Each with: bold white title (~16px) + gray description + `>` or `+` icon
- Carousel navigation arrows (left/right) at the right edge

### 2.13 Under the Hood Section (Screenshot 15)

**Category label:**
- Small disk/circle icon + "Under the hood"

**Headline:**
- "Built on strong foundations"
- ~48-52px, white

**Description:**
- ~16-18px, gray
- About complex technologies under the hood

**Left side: Three feature rows separated by thin lines**

Each row:
- Bold white title (~18-20px): "Linear Sync Engine", "Enterprise-ready security >", "Engineered for scale"
- Gray description text on the right (~15px)
- Thin horizontal separator line between rows

**Right side: Large architectural diagram/illustration**
- Rectangular bordered area (dashed border, `border: 1px dashed rgba(255,255,255,0.15)`)
- Inside: modular blocks showing:
  - Linear logo + "SYNC ENGINE" label
  - Counter showing "5,000" with +/- controls + "WORKSPACE MEMBERS" label
  - Security compliance icons (SOC 2, SSO, SAML, etc.) + "ADVANCED ADMIN CONTROLS"
  - API indicator dots
  - Cross-hatch/grid pattern texture in some areas
  - "NATURALLY EMBEDDED ARTIFICIAL INTELLIGENCE" label at bottom
- All rendered in monochrome gray with tiny accent dot (orange/red, ~3px)
- Labels in a **monospace/technical font** (all caps, letter-spaced)
- The illustration style is "technical blueprint" -- very engineering-feel

### 2.14 CTA Section (Screenshot 16)

**Compliance badges at top:**
- "SOC 2" + checkmark icon, "GDPR" + checkmark, "HIPAA" + checkmark
- Small gray text, inline layout

**Massive whitespace** (~160-200px) between badges and CTA

**CTA headline:**
- "Plan the present. Build the future."
- ~36-40px, weight 500-600, white
- Single line

**Buttons (right-aligned, inline with headline):**
- "Contact sales" -- filled dark button with border, ~14px text
- "Get started" -- filled WHITE button (primary CTA), ~14px text, border-radius ~8px
- This is the ONLY white/bright button on the entire page

**Footer:**
- Separated by thin horizontal line
- Logo on far left (icon only, no wordmark)
- 5 columns: Features, Product, Company, Resources, Connect
- Column headers: ~14px, white, weight 500-600
- Links: ~14px, `#666666` to `#777777`, weight 400
- Footer background: same dark base, no differentiation
- Very generous padding above and below

---

## 3. SIGNATURE PATTERNS (RECREATABLE)

### 3.1 Card Surface Material

The "Linear card" is one of the most distinctive elements:

```css
.linear-card {
  background: #191919;          /* or rgba(255,255,255,0.04) to 0.06 */
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  /* NO box-shadow -- depth comes from background contrast alone */
  /* NO backdrop-filter on standard cards */
}
```

**Important:** The cards do NOT have visible drop shadows. The depth perception comes entirely from the background color difference between the card surface and the page. This is more subtle and premium than shadow-based elevation.

### 3.2 Thin Line Separators

Linear uses `1px` lines extensively to create structure:

```css
.linear-separator {
  border-top: 1px solid rgba(255,255,255,0.06);
  /* sometimes rgba(255,255,255,0.08) for slightly more visible lines */
}
```

Used for:
- Separating feature rows within a section
- Above feature card grids
- Between footer and content
- Between two-column sub-sections (vertical variant)

### 3.3 The Category Label + Arrow Pattern

```
[colored dot 6px] [category text 13px gray] [> arrow]
```

- Dot colors: teal/blue, green, yellow/amber -- varies by section
- Text: uppercase optional, regular weight, `#8a8a8a`
- Arrow `>` in same color as text
- This always sits 12-16px ABOVE the big headline

### 3.4 Bold Lead-in Body Text

```
**Bold white phrase.** Rest of paragraph in muted gray.
```

Linear consistently starts body paragraphs with a few words in white bold, then transitions to muted gray for the rest. Examples:
- "**Linear for Agents.** Choose from a variety of AI agents..."
- "**Align your team around a unified product timeline.** Plan, manage, and track..."
- "**Optimized for speed and efficiency.** Create tasks in seconds..."

### 3.5 Product UI Screenshots as Visual Elements

Rather than generic illustrations, Linear shows their actual product:
- Screenshots are rendered in perspective (3D CSS transforms)
- Opacity reduced to 15-40%
- They fade to black at the edges (gradient masks)
- Multiple screenshots overlap at different depths
- This creates an atmospheric "the product is everywhere" feeling

### 3.6 Button Styles

**Primary (rare -- only CTA section):**
```css
.btn-primary {
  background: #ffffff;
  color: #000000;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
}
```

**Secondary (most common):**
```css
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: #ffffff;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 400;
}
```

**Ghost/Link (inline):**
```
"Text >" with > being an arrow character
Color: white for emphasis or #8a8a8a for subtle
```

### 3.7 The Two-Column Split Pattern

Used repeatedly (AI section, Product Direction sub-features, Cycles/Triage):

```
|  Title (bold, white)     |  Title (bold, white)       |
|  Description (gray)      |  Description (gray)        |
|  [Product UI card]       |  [Product UI card]         |
```

- Columns separated by thin vertical line OR just whitespace
- Equal width or slightly asymmetric
- Product UI panels inside each column

---

## 4. ATMOSPHERIC QUALITIES

### 4.1 The "Cinematic Dark" Feel

Linear achieves its premium atmosphere through:

1. **No competing colors** -- the monochrome palette prevents visual noise
2. **Massive whitespace** -- sections breathe; nothing feels cramped
3. **Product as backdrop** -- real UI screenshots at low opacity create depth
4. **Consistent surface material** -- every card, panel, and element uses the same subtle surface
5. **Typography contrast** -- the extreme size difference between labels and headlines creates drama

### 4.2 Light Sources and Glow

There are NO obvious glowing elements or radial light effects on Linear's homepage. The "glow" feeling comes from:
- White text on dark backgrounds (natural glow perception)
- Very slight radial gradient behind the hero area (barely perceptible, centered)
- Data visualization colors providing pinpoint light
- The nav bar backdrop blur creating a slight luminosity

### 4.3 What Linear Does NOT Do

This is equally important:
- NO gradient backgrounds (no purple-to-blue gradients)
- NO colorful section backgrounds (no alternating white/dark/colored sections)
- NO hover glow effects on cards (if any hover, it is extremely subtle border brightening)
- NO decorative patterns or textures (except the architectural diagram)
- NO rounded/bubbly elements (everything is sharp and geometric)
- NO emoji or playful elements
- NO parallax scroll effects on the static page (animations may exist but the visual language is static-first)
- NO image backgrounds (photographs, abstract art, etc.)
- NO colored text (all text is white or gray, never colored)
- NO gradient text
- NO large colored buttons (except the single white "Get started" at the very end)

---

## 5. SECTION TRANSITION PATTERNS

### How sections flow into each other:

1. **Content ends** -- last element (text, cards, or UI panel)
2. **Generous empty space** -- 100-160px of pure dark background
3. **Optional thin horizontal line** -- `1px solid rgba(255,255,255,0.06)`
4. **More empty space** -- 60-100px
5. **Category label** appears (the "whisper")
6. **Headline** appears 12-16px below (the "shout")
7. **Body text** 16-24px below headline
8. **Content** (cards, UI screenshots) 32-48px below body

The transitions are **seamless** -- there are no visible "section breaks" with different background colors. The entire page is one continuous dark surface. Structure comes from spacing and thin lines alone.

---

## 6. GRID AND LAYOUT SYSTEM

### Content Container
- Max-width: ~1200-1280px
- Centered with auto margins
- Side padding: ~24-32px (mobile), ~48-64px (desktop)

### Column Systems Used
- **Full-width**: Hero, CTA
- **Split 45/55 or 50/50**: "Made for modern teams" headline/description, Product Direction sub-features
- **3-column grid**: Value proposition cards (Purpose-built, Move fast, Crafted)
- **4-column grid**: Feature icon rows (Initiatives, Cross-team, Milestones, Insights)
- **2-column with vertical divider**: Cycles/Triage, AI sub-features

### Responsive Hints
- Logos grid likely collapses to 2x4 on mobile
- 3-column cards likely stack to single column
- 4-column feature rows likely become 2x2
- Split sections likely stack vertically

---

## 7. ICON AND VISUAL TREATMENT

### Icons
- **Style**: Outline/stroke icons, 1.5-2px stroke weight
- **Size**: 16-20px in feature lists
- **Color**: `#888888` to `#aaaaaa` -- never bright, never colored
- **Container**: None -- icons sit directly next to text, no background circles or squares

### Status Indicators
- Colored dots: 6-8px circles
- Colors used: green (on track), yellow (in progress), red (at risk), blue (info)
- Always paired with text label

### Avatar Indicators
- Small circles, ~24-28px
- Show user photos or colored initials
- Subtle ring border

---

## 8. RECREATING LINEAR'S DESIGN LANGUAGE -- CHECKLIST

To recreate this in another project:

1. [ ] Set base background to `#0a0a0b` or `#08090a` (NOT pure black)
2. [ ] Use only grays for 95% of the interface (white to `#666666` range)
3. [ ] Headlines: 48-64px, weight 500-600, tight letter-spacing, white
4. [ ] Body text: 16-18px, weight 400, `#888888` to `#999999`
5. [ ] Labels: 13-14px, muted gray, with optional colored 6px dot
6. [ ] Cards: `background: rgba(255,255,255,0.04-0.06)`, `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: 12px`, NO shadow
7. [ ] Separators: `1px solid rgba(255,255,255,0.06)`
8. [ ] Section spacing: 120-160px vertical padding
9. [ ] Content max-width: 1200-1280px
10. [ ] Buttons: mostly ghost/bordered, ONLY white fill for final CTA
11. [ ] Every section: whisper (label) -> shout (headline) -> explain (body) -> show (visual)
12. [ ] Bold lead-in phrases in body text
13. [ ] Product UI as atmospheric visuals, not decorative illustrations
14. [ ] Color accents: tiny dots and data visualization only
15. [ ] No gradients, no textures, no decorative elements
16. [ ] Generous, courageous whitespace everywhere

---

*Analysis generated from 17 screenshots of linear.app homepage, February 2026.*
