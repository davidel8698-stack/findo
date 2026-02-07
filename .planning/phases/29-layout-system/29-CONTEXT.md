# Phase 29: Layout System - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement comprehensive 4px-grid spacing system with responsive breakpoints. Define spacing tokens, 12-column grid configuration, content containers, and section padding following Linear specifications. Audit all existing sections for 4px grid alignment.

</domain>

<decisions>
## Implementation Decisions

### Spacing Scale
- Linear jumps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- Stop at 128px — use token combinations for larger gaps
- Numeric naming: space-4, space-8, space-12, etc.
- No negative spacing tokens — handle case-by-case with arbitrary values

### Grid Behavior
- 24px gutters between columns
- Keep 16px edge margins on mobile (content doesn't touch edges)
- Use Tailwind default breakpoints: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
- No debug grid overlay — trust the token system

### Section Rhythm
- Type-specific section padding:
  - Hero: 120px vertical
  - Features/content: 80px vertical
  - CTA: 64px vertical
- Mobile scales proportionally (60%):
  - Hero: 72px
  - Features: 48px
  - CTA: 40px
- Semantic section tokens: py-section-hero, py-section-feature, py-section-cta
- No explicit gaps between sections — padding creates the rhythm

### Audit Approach
- Visual alignment is the goal, not rigid token usage
- Silent exceptions — no documentation required for arbitrary values that fit visually
- Snap non-conforming values to nearest token (23px → 24px)
- Manual review during phase, no lint rules

### Claude's Discretion
- Exact responsive scaling calculations
- Container width implementation approach
- Order of audit (which sections first)
- Edge case handling for nested grids

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard Linear-style approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 29-layout-system*
*Context gathered: 2026-02-05*
