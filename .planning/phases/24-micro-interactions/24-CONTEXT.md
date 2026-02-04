# Phase 24: Micro-Interactions - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Add sophisticated hover and interaction states to every interactive element (buttons, cards, links, inputs). This phase is about **feel** — how elements respond to user interaction. Animation choreography (Phase 25) handles entrance/scroll animations.

</domain>

<decisions>
## Implementation Decisions

### Interaction Personality
- Snappy & precise feel overall (like Linear, Stripe)
- Fast durations: 150-200ms for all micro-interactions
- Vary timing by importance: CTAs faster/punchier, secondary elements slightly slower
- Graduated error states based on severity:
  - Inline validation hints: color change + icon only (user already focused there)
  - Field validation on submit: gentle pulse (1-2 cycles) + icon
  - Blocking errors (payment failed, auth): short jolt (2px, 2 oscillations) + glow
- Error philosophy: guide, not scold — tiny amplitude (2-4px), always pair with icon for accessibility
- Respect prefers-reduced-motion: fall back to immediate color change + icon

### Button Behavior
- Hover: shadow-lift as primary effect (translateY -1px + increased shadow), NOT scale
  - Exception: icon buttons can scale 1.05-1.1 (small elements can scale more)
  - Primary CTA (hero): can use 1.02 scale if has breathing room
  - Standard buttons: shadow/color instead of scale
  - Button groups: no scale (causes collisions)
- Press (active): both scale down (0.98) AND shadow reduces
- CTA glow: intensify subtly on hover (~20-30% increase)
  - Glow spread: +8-12px
  - Glow opacity: +0.1
- Disabled buttons: no hover effect at all, cursor: not-allowed

### Card Hover Effects
- Lift distance: -4px (noticeable, standard)
- Shadow: increases on hover (reinforces lift)
- Border/glow: lift + shadow only, no rim light or border glow change on hover
- Tiered by importance: primary cards more dramatic, secondary more subtle

### Link Animations
- Inline links: scale underline (grows from center outward) + subtle text brightness on hover
- Nav links (header/footer): different treatment — background fill or indicator line
- External links: arrow icon that nudges outward on hover

### Claude's Discretion
- Exact easing curves (cubic-bezier values)
- Specific shadow values for card tiers
- Input focus glow implementation details
- Navigation link hover specifics (background vs indicator approach)

</decisions>

<specifics>
## Specific Ideas

- "Shadow-lift as primary button effect, not scale — feels physical and satisfying"
- "Errors should guide, not scold — tiny amplitude, severity matches urgency"
- "CTAs should feel alive — glow intensification makes them inviting"
- "Nav links need different treatment than inline links — context matters"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 24-micro-interactions*
*Context gathered: 2026-02-04*
