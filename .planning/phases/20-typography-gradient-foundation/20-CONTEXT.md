# Phase 20: Typography & Gradient Foundation - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish premium visual language with gradient text and optimized Hebrew typography across all content. This phase covers text styling only — background effects, glows, and animations are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Gradient text placement
- Color transition: orange-500 → amber-500 (warm, energetic)
- Apply gradient to: hero headline + key sections (Stats, Pricing, CTA sections)
- Intensity: noticeable transition — clear color journey but professional, not jarring
- Coverage: full headline gets gradient (not just key words)

### Typography hierarchy
- Secondary text color: zinc-400 for clear hierarchy distinction
- Size scale: moderate 1.33 ratio between heading levels
- Headline font weight: bold (700) for strong, confident presence
- Font consistency: same font throughout, hierarchy via weight/size

### Hebrew-specific tuning
- Font: Heebo (Google Font, clean geometric Hebrew)
- Line-height: 1.8 for Hebrew body text (optimized readability)
- Letter-spacing: normal (no adjustment for Hebrew headlines)
- Word wrap: never break Hebrew words (overflow-wrap: normal)

### RTL gradient behavior
- Direction: stay consistent regardless of text direction (no mirroring)
- Angle: top-left to bottom-right diagonal (adds energy/dynamism)
- Color stops: centered 40-60 for equal presence of both colors
- Text shadow: subtle orange glow behind gradient text for depth

### Claude's Discretion
- Exact gradient angle degrees (approximate 135deg for diagonal)
- Text shadow blur radius and opacity values
- Font weight for sub-headlines and body text
- Responsive font size adjustments

</decisions>

<specifics>
## Specific Ideas

- Gradient should feel like Linear/Stripe quality — noticeable but not gaudy
- Warm orange-amber creates cohesion with Findo brand identity
- Diagonal gradient adds subtle energy without being distracting

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 20-typography-gradient-foundation*
*Context gathered: 2026-02-03*
