# Phase 26: Glassmorphism & Section Upgrades - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply glassmorphism effect strategically to cards (feature, stats, testimonials, nav, form) with performance-tested fallbacks, and upgrade all 10 sections with the full visual language from Phases 20-25. This phase does NOT add new features — it elevates existing sections visually.

</domain>

<decisions>
## Implementation Decisions

### Glass Effect Intensity
- Subtle blur (8-12px) — not heavy frosted glass
- Semi-transparent background (15-25% opacity)
- Thin white/light border (1px, 10-20% opacity) — Apple-style edge definition
- Glass replaces existing rim lighting effect (don't layer both)

### Fallback Strategy
- When glass fails performance: solid dark background (zinc-900/80)
- Device-specific via CSS @supports — desktop gets glass, mobile gets solid automatically
- Reduced-motion users keep glass (it's not motion, it's visual)
- Border strengthens on fallback (15-25% opacity when no blur present)

### Section Upgrade Priorities
- **Feature cards**: Primary focus — strongest glass treatment
- **Stats + Testimonials**: Lighter glass (less blur/opacity) — visual hierarchy
- **Navigation**: Glass background when scrolled/sticky
- **Contact form**: Glass treatment on form card
- **ROI Calculator, FAQ, Pricing, Founder**: Polish only (Phase 20-25 upgrades, no glass)
- **Footer**: No glass

### Visual Consistency Rules
- Feature cards get stronger glass, stats/testimonials get lighter — creates hierarchy
- Hover lift + shadow maintained from Phase 24 (glass doesn't change hover behavior)
- Background orbs (Phase 21) visible through glass — creates depth effect
- Maximum 6-8 glass elements per viewport (performance budget)

### Claude's Discretion
- Exact blur values within 8-12px range
- Exact opacity values within stated ranges
- Shadow adjustments for glass cards
- Specific timing for scrolled nav glass transition

</decisions>

<specifics>
## Specific Ideas

- Linear-style subtle glass — barely visible background, not heavy frosted
- Apple's thin border treatment for edge definition
- Background orbs should create depth when viewed through glass cards

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 26-glassmorphism-section-upgrades*
*Context gathered: 2026-02-05*
