# Phase 32: Autopilot Hero Visualization - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a Linear-quality "Autopilot Dashboard" visualization inside the hero section — 3 overlapping glass panels showing Findo running autonomously with realistic product UI. The panels display detailed dashboard interfaces (not simple metric cards) with live-updating data, telling the story "it works without me" through RESULT → PROOF → ACTIVITY visual hierarchy.

**OUT of scope:** Click interactions, panel expand/collapse, real data connections, hover states on individual list items, responsive tablet breakpoint, interactive elements.
**IN scope:** Static visual + entrance animations + periodic live updates on desktop. Full-width stacked panels on mobile. RTL throughout.

</domain>

<decisions>
## Implementation Decisions

### Placement & Hero Structure
- Panels live INSIDE the hero section, above the fold
- Hero flow: H1 → Subtitle → CTAs → **Autopilot Panels** → Hero Form
- No external label/badge above the panels — hero headline provides context
- Panels are part of the hero visual, not a separate section

### Layout
- 3-column equal-width panels on desktop
- Overlapping Z-layers with ~40px overlap between panels
- RTL cascade: front-right to back-left
- 5-8 degree perspective tilt on the group
- Varying panel sizes (S/M/L) for depth
- Deep shadows increasing toward back panels
- Mobile: all 3 panels stack vertically, full-width, full detail

### Panel Content (Detailed Product UI)
Each panel looks like a REAL SaaS dashboard with: header + status indicator, tabs/filters, list items with full details, action buttons, footer with statistics.

**Panel 1 — FRONT-RIGHT: Reviews Manager**
- Big rating display (4.8 ★★★★★) with trend indicator (▲ +0.3)
- Review items: avatar placeholder, name, stars, text preview, response status
- Stats footer: sent/received/conversion %
- Shimmer border effect (only panel with shimmer)

**Panel 2 — MIDDLE: Leads CRM**
- Search bar + filter dropdown
- Time tabs: היום | אתמול | השבוע
- Lead cards: status dot, name, phone, source, status badge, action icons
- Status badges: 🟢 חדש, 🟡 ממתין, ✅ הושלם (use premium icon equivalents, NOT emoji)
- Footer: conversion rate stats

**Panel 3 — BACK-LEFT: Activity Dashboard**
- Icons-only sidebar (~40px) with nav icons, active icon highlighted
- Tabs: הכל | לידים | ביקורות | הודעות
- Activity feed: icon, description, person details, timestamp
- Footer: "היום: 12 לידים • 8 הודעות • 3 ביקורות"

### Panel Z-Order Story
- Reviews front (RESULT — "4.8 stars, my rating is great!")
- Leads middle (PROOF — "leads are being handled")
- Activity back (ACTIVITY — "all this is happening automatically")
- Story arc: RESULT → PROOF → ACTIVITY (outcome-first for business owners)

### Data Realism
- Specific moment in time: "Tuesday 14:30" snapshot
- Hebrew names, Israeli phone numbers (052-XXX-XXXX format)
- Recent timestamps: 14:22, 13:45, 12:30
- 4-5 list items per panel (some partially cut off at bottom to suggest more)
- Status variety across items (new, pending, completed, etc.)

### Iconography
- **CRITICAL: No standard emojis anywhere in the panels**
- All icons and symbols must use premium icon library (Lucide, Heroicons, or similar)
- Status indicators use colored dots/badges, not emoji
- Action buttons use proper SVG icons

### Visual Treatment
- Card surface: Glass header + solid body (header uses glassmorphism, body is solid dark #151516)
- Glass formula: rgba(255,255,255,0.05) bg, 20px blur, 8% white border per Blueprint
- Solid body: #151516 with 1px rgba(255,255,255,0.08) border
- Border-radius: 16px per Blueprint
- Shimmer: front panel (Reviews) only
- Deep shadows per Blueprint: 0 20px 60px rgba(0,0,0,0.3)

### RTL
- Full RTL inside all panels: text right-aligned, icons on right, tabs flow right-to-left
- Panel cascade: front-right to back-left (matches Hebrew reading direction)
- RTL verification required in every sub-plan

### Animation Behavior

**Entrance (0-2s, on page load):**
- Staggered fade-up + scale: translateY(20px→0), scale(0.95→1)
- 300ms per panel, 150ms stagger between
- Order: Reviews (front) → Leads (middle) → Activity (back)
- Numbers count up to final values (4.5→4.8 rating, 0→12 leads, etc.)
- Uses Phase 31 motion tokens (ease-standard, duration-reveal)

**Continuous (forever):**
- Green status dot pulses gently (2s cycle, opacity 0.6→1→0.6)
- Shimmer border sweeps on Reviews panel

**Periodic events (every 5-7 seconds):**
- All 3 panels receive updates:
  - Activity: new item slides in from top, old items shift down, bottom fades out
  - Leads: new lead card appears
  - Reviews: rating occasionally ticks, or new review appears
- Subtle micro-animation on notification counts (+1)
- Max 3-4 new items per panel, then pause 30s before resuming
- All animations gentle (no jarring movement)
- All animations respect prefers-reduced-motion

### Quality Verification
- Primary references: 01-hero-floating-ui-panels.png (placement/context) + 05-timeline-3d-visualization.png (depth/perspective)
- Use DESIGN-PHASE-WORKFLOW.md process: REFERENCE→PLAN→IMPLEMENT→CAPTURE→ANALYZE→ITERATE→VERIFY
- visual:capture tool for screenshot comparison
- User approval at 2 checkpoints: (1) after static layout, (2) after animations added
- If quality not met after 3 iterations: user decides (simplify, iterate more, or accept)

### Risk Mitigation (Lessons from Failed Attempt)
- **3 sub-plans with checkpoints:**
  - Plan 1: Layout + card containers + Z-positioning + RTL check
  - Plan 2: Panel content (UI elements, data, icons) + RTL check
  - Plan 3: Animations + shimmer + periodic updates + RTL check
- RTL check in every sub-plan (not just at the end)
- Always reference Linear screenshots before and after implementation
- Custom panel components (don't force-fit existing GlassCard/ShimmerCard — too different)
- Can import motion tokens from Phase 31 for animation values

### Claude's Discretion
- Exact panel dimensions and spacing within the 3-column + overlap layout
- Specific Hebrew names and phone numbers for demo data
- Choice of premium icon library (Lucide recommended based on existing usage)
- Exact shadow values for back panels (increasing depth)
- Activity feed item content/descriptions
- Loading skeleton design if needed
- Exact count-up animation timing
- Mobile panel spacing and padding adjustments

</decisions>

<specifics>
## Specific Ideas

- "Must feel like looking at actual software, not a marketing mockup"
- "The business owner doesn't care if the system is busy — they care about RESULTS"
- "4.8 ★★★★★ ↑ in front is universally understood, visually striking, and the ultimate proof that Findo works without me"
- "The combination of count-up, pulsing dot, and new items tells the story: Findo is actively working while you watch"
- Panel design inspiration: real SaaS dashboards (think Stripe Dashboard, Linear interface, HubSpot CRM)
- Use the existing hero structure — panels enhance it, don't replace it

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 32-autopilot-hero-visualization*
*Context gathered: 2026-02-06*
