# Phase 25: Animation Choreography - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement orchestrated entrance sequences and scroll-triggered reveals that create premium polish through timing precision. Covers hero entrance choreography, scroll-triggered section reveals, stats counter animations, and reduced-motion accessibility fallbacks.

</domain>

<decisions>
## Implementation Decisions

### Hero Entrance Timing
- **Personality:** Snappy and confident — complete in ~1s, decisive and modern
- **Overlap:** Slight overlap (~30%) — clear sequence with momentum, readable hierarchy
- **Motion style:** Fade + subtle rise (20-30px translateY) — elegant, proven, direction-neutral
- **Phone mockup:** Special treatment — larger motion (40-60px rise), longer duration, arrives as the payoff with presence

### Scroll Reveal Behavior
- **Trigger threshold:** Early (20-30% visible) — anticipatory, ensures animations are seen, feels responsive
- **Replay:** Animate once only — page "locks in" as you scroll, cleaner second passes
- **Stagger timing:** Fast cascade (50-75ms delays) — unified groups, matches snappy personality
- **Section personality:** Different sections get different reveals:
  - Stats: count up animation
  - Testimonials: slide from sides
  - Features: fade in
  - Other sections: standard fade+rise

### Stats Counter Animation
- **Easing:** Ease-out (fast→slow) — starts fast, decelerates to final number, lands with weight
- **Duration:** Medium (2-2.5s) — gives time to register the climb, feels substantial
- **Start point:** From zero — full journey, maximum impact
- **Synchronization:** Simultaneous — all numbers race together, unified impact

### Reduced Motion Handling
- **Fallback strategy:** Opacity-only — elements fade in without translation/scale
- **Stats counter:** Show final number immediately — no counting animation
- **Fade duration:** Brief (150-200ms) — gentle transition, avoids jarring pop-in
- **Parallax:** Disable all parallax effects — static positioning for all elements

### Claude's Discretion
- Exact easing curves (cubic-bezier values)
- GSAP vs Motion library choices per animation type
- Scroll observer implementation details
- RTL direction adjustments for slide animations

</decisions>

<specifics>
## Specific Ideas

- Hero entrance should feel "confident and decisive, respects the user's time"
- Stats counting creates "unified impact, single moment of arrival"
- Fast cascade stagger "creates unified groups" — items feel connected
- Reduced motion users get "gentle presence without motion"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 25-animation-choreography*
*Context gathered: 2026-02-04*
