# Phase 22: Glow Effects & Multi-Layer Shadows - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Bring attention to conversion points with sophisticated glow effects and multi-layer shadow system. This phase adds visual depth and draws the eye to CTAs through pulse animations, hover glows, and layered shadows. Creates premium separation in dark mode with rim lighting on cards.

</domain>

<decisions>
## Implementation Decisions

### CTA Pulse Behavior
- Noticeable pulse animation — clearly visible but not distracting
- Medium speed: 2-second cycle
- Pulse pauses on hover, glow intensifies to max (feels responsive)
- Primary CTA only (hero "Start Free Trial" button) — other CTAs don't pulse

### Glow Behavior
- Primary CTA has subtle ambient glow beneath + pulse modulating intensity
- Secondary buttons and cards get glow only on hover (not always-on)
- Hover glow color for non-CTA elements: white/neutral (doesn't compete with CTA)
- Links (text links) have no glow — just underline animation (Phase 24)
- Glow transitions: fade in 150-200ms (smooth, polished)
- Form inputs: white/neutral glow on focus
- Navigation: CTA button gets hover glow, rest of nav stays clean
- Mobile sticky CTA bar: static glow (no pulse) — less distracting on mobile

### Shadow Layering
- Medium depth overall — clear elevation, elements obviously float but not exaggerated
- CTAs more elevated than cards — clear action hierarchy
- Hover: lift effect (translateY) + deeper shadow expansion
- CTA shadows have subtle orange tint — reinforces brand color
- Cards and other elements: neutral (black/gray) shadows

### Rim Lighting (Dark Mode)
- Subtle but clear rim — visible edge highlight that separates elements cleanly
- Color: white/zinc — neutral, doesn't add color
- Scope: cards only (feature cards, testimonial cards) — buttons don't need it
- Position: top edge only — simulates natural light from above

### Claude's Discretion
- Exact shadow layer values (4-layer system specifics)
- Pulse easing curve details
- Specific blur radius for glow effects
- Performance optimization approach if Lighthouse dips

</decisions>

<specifics>
## Specific Ideas

- CTA pulse should draw the eye like a heartbeat — alive, not frantic
- Hover glow on cards should feel like they're responding to your attention
- Orange tint in CTA shadow creates subtle brand reinforcement without being garish
- Top-edge rim lighting mimics real-world overhead lighting

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 22-glow-effects-shadows*
*Context gathered: 2026-02-03*
