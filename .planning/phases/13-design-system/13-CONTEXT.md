# Phase 13: Design System & Components - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete atomic component library with Hebrew typography, RTL-aware animations, and accessibility built-in. Includes Button, Input, Badge, Card components, typography scale, color tokens, and Motion animation variants. Does not include page layouts or specific sections (those are later phases).

</domain>

<decisions>
## Implementation Decisions

### Button styles & variants
- Clean & professional + warm & inviting — solid but approachable
- Moderately rounded corners (8-12px radius)
- Icons available but not default — use when it adds clarity
- Loading state: button pulses/shimmers, no spinner

### Color palette & visual tone
- Bold with contrast — strong dark/light sections, punchy presence
- Dark mode by default with toggle to light
- Subtle gradients — soft transitions for depth, not flashy

### Animation character
- Playful & delightful — bouncy, expressive, micro-interactions
- Scroll reveal: staggered cascade — elements animate in sequence, theatrical
- Hover micro-interactions on CTAs and cards, not everything

### Component density
- Balanced overall spacing — comfortable, neither cramped nor sparse
- Medium padding on cards
- More spacious on mobile — larger touch targets, easier scrolling
- Compact form fields — feels quick to fill

### Claude's Discretion
- Primary brand/accent color (based on conversion best practices)
- Animation easing style (match playful character — likely spring physics)
- Exact spacing values and typography scale
- Shadow depths and card elevation
- Focus ring styling

</decisions>

<specifics>
## Specific Ideas

- Dark mode as the bold default makes the site stand out from typical Israeli business sites
- Loading shimmer on buttons instead of spinner — feels more integrated
- Theatrical staggered reveals give the playful personality space to shine

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 13-design-system*
*Context gathered: 2026-01-31*
