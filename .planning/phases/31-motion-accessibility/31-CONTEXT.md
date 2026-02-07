# Phase 31: Motion & Accessibility - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement the complete motion system (easing curves, animation timing, shimmer effects) and accessibility layer (skip links, keyboard navigation, focus states, reduced motion support). This phase establishes the animation tokens and accessibility patterns that all components and visualizations will use.

</domain>

<decisions>
## Implementation Decisions

### Shimmer Effect Style
- Shimmer appears on hero cards only — premium feel reserved for above-the-fold
- Primary accent gradient colors for brand-consistent shimmer
- Continuous loop behavior — always animating
- Medium intensity — noticeable but not overwhelming

### Animation Feel
- Subtle bounce springs — slight overshoot that feels polished (Linear style)
- Balanced reveal speed (400-500ms) — smooth entrance without feeling slow
- Stagger 50-75ms between list/grid items — cascade with visible delay
- Standard hover intensity — card lifts slightly, shadows deepen (no glow)

### Reduced Motion Behavior
- Simple fades only when prefers-reduced-motion enabled — opacity transitions allowed, no movement/transforms
- Shimmer disabled completely — static border, no gradient animation
- Scroll-triggered reveals still happen but fade only — no slide/scale
- Essential loops only — loading spinners allowed, decorative loops (shimmer) disabled

### Focus Indicator Design
- 2px ring outline — classic focus ring, clear and accessible
- Primary accent color for focus ring — brand consistent
- Keyboard focus only (:focus-visible) — ring shows only for keyboard users
- 2px offset from element — small gap for clean look

### Claude's Discretion
- Exact spring stiffness/damping values
- Shimmer animation duration and gradient angle
- Skip-to-content link positioning and styling
- Keyboard navigation implementation details
- Contrast ratio verification approach

</decisions>

<specifics>
## Specific Ideas

- Linear-style subtle bounce — that polished overshoot feel
- Shimmer should feel premium but not distracting (medium intensity, continuous)
- Accessibility should be invisible to most users but fully functional for those who need it

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 31-motion-accessibility*
*Context gathered: 2026-02-06*
