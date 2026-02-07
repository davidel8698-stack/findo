# Phase 28: Design Foundation - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the complete color and typography token system as CSS custom properties. This phase creates the foundational design tokens — semantic colors, surface hierarchy, and typography scales — that all subsequent Linear Design System components will build upon. Tokens are defined and documented; migration of existing components happens in Phase 30.

</domain>

<decisions>
## Implementation Decisions

### Token Naming Convention
- Use `--color-` prefix pattern: `--color-bg-primary`, `--color-text-secondary`
- No project prefix (no `--findo-`), cleaner names preferred
- Typography uses both primitive + semantic tokens:
  - Primitives: `--font-size-xl`, `--font-weight-bold`
  - Semantic aliases: `--text-heading-1`, `--text-body-large`
- All tokens defined in a single `tokens.css` file

### Surface Hierarchy
- 4 surface levels: bg (deepest), surface-1, surface-2, elevated
- Glassmorphism handled as both:
  - Effect tokens: `--effect-glass-blur`, `--effect-glass-border`, `--effect-glass-bg`
  - Convenience token: `--color-surface-glass`
- Dark mode only — no light mode toggle preparation
- Separate border tokens: `--color-border-default`, `--color-border-subtle`, etc.

### Migration Scope
- Token definitions only in this phase — no migration of existing components
- Colors and typography applied when components redesigned in Phase 30
- Dark background (#08090A) applied now as part of foundation
- Tailwind config extended to use token values for utility classes

### Color Granularity
- Text colors: 4+ levels (primary, secondary, tertiary, muted, disabled)
- Accent approach: Brand accent + semantic status colors
  - Brand: Keep existing Findo accent color
  - Status: success, warning, error
- Interactive state tokens: `--color-accent-hover`, `--color-accent-active`, etc.

### Claude's Discretion
- Exact hex values for surface levels (following Linear patterns)
- Typography line-height values
- Border color opacity levels
- Tailwind config structure for token integration

</decisions>

<specifics>
## Specific Ideas

- Follow Linear's exact dark background (#08090A) specification
- 4px-based type scale as specified in requirements
- Heebo font support for Hebrew typography
- Glass surface formula: 5% white background, blur, 8% border (from requirements)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 28-design-foundation*
*Context gathered: 2026-02-05*
