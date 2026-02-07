# Phase 30: Component Library - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign all interactive components (buttons, cards, navigation, hero, footer) to Linear specifications with proper variants, hover states, and animations. This phase delivers the component foundation that visualizations (Phases 32-35) will build upon.

</domain>

<decisions>
## Implementation Decisions

### Button feel & feedback
- Bouncy spring press feel — Linear-style slight overshoot, playful
- Loading: spinner replaces text, button width stays constant
- Icon placement is context-dependent — action icons leading, directional icons trailing
- Disabled state: 50% reduced opacity, same colors

### Card visual hierarchy
- Highlighted variant reserved for pricing tier emphasis only (recommended plan)
- Gradient borders: subtle on regular cards, bold on highlighted/featured cards
- Hover lift: subtle 4-8px elevation change, professional feel
- Glassmorphism blur: consistent 12-16px across all glass surfaces

### Navigation scroll behavior
- Background: transparent at top → blurred glass after 50-100px scroll
- Height: stays consistent throughout scroll (no compacting)
- Mobile menu: full-screen dark glass overlay with centered links
- Logo: unchanged on scroll

### Hero structure & CTAs
- Badge placement: above H1 headline (small chip, then big headline)
- CTA pairing: Primary + Ghost (solid button + transparent text-only)
- Social proof: customer logos row (4-6 businesses) in hero
- Additional social proof distributed strategically throughout page in varied formats
- Hero visual: placeholder for Autopilot dashboard (Phase 32 visualization)

### Claude's Discretion
- Exact spring tension values for bouncy animation
- Specific blur px values within 12-16px range
- Spinner design and animation
- Ghost button hover treatment
- Mobile overlay animation (fade vs slide)

</decisions>

<specifics>
## Specific Ideas

- Social proof should be integrated throughout the page in different ways — logos, stats, testimonials, badges — strategically placed for psychological impact
- Hero references the Autopilot dashboard visualization coming in Phase 32
- Linear-style bouncy feel on interactions, not corporate/stiff

</specifics>

<deferred>
## Deferred Ideas

- Comprehensive social proof strategy (placement throughout page) — implement during section-specific work
- Autopilot dashboard visualization — Phase 32

</deferred>

---

*Phase: 30-component-library*
*Context gathered: 2026-02-05*
