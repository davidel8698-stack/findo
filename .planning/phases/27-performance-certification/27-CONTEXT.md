# Phase 27: Performance Certification - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Validate all v2.0 visual excellence work through performance testing, device testing, and professional rating certification. No new visual features — this phase validates and certifies what was built in Phases 20-26.

</domain>

<decisions>
## Implementation Decisions

### Device Testing Scope
- Use Chrome DevTools throttling (4x CPU slowdown) as mid-range device baseline — no physical Galaxy A24 4G available
- Test on Desktop + Mobile profiles only (no tablet)
- Animation smoothness judged subjectively — animations should look smooth, no visible jank
- Test on local production build (`npm run build && npm start`) — not deployed Vercel

### Professional Rating Process
- 5 raters are target customers: actual small business owners who match the target audience
- Send URL + Google Form to collect ratings
- Include optional comments field alongside numeric ratings
- Claude designs the rating form with multiple aspects (visual design, trustworthiness, clarity, overall)

### Hebrew Review Process
- User (native Hebrew speaker) performs the review personally
- Claude provides a structured checklist of what to look for
- Focus areas determined by Claude (typography + content aspects most relevant to v2.0)
- Any issues found block certification until fixed

### Failure Handling
- Lighthouse: 95 is target, 90+ is acceptable minimum for certification
- Professional rating: must achieve 9+ average — iterate until satisfied
- If performance fixes require removing visual effects, Claude decides based on specific impact
- No iteration limit — keep iterating until all criteria pass

### Claude's Discretion
- Specific rating form questions and structure
- Which Hebrew aspects to include in review checklist
- Performance vs visuals tradeoffs (case-by-case basis)
- DevTools throttling profile settings

</decisions>

<specifics>
## Specific Ideas

- Rating form goes to actual small business owners, not designers or tech people — they represent the real audience
- Hebrew review checklist should be actionable, not just "does it look good"
- Performance testing happens on local build to avoid deployment overhead during iteration

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 27-performance-certification*
*Context gathered: 2026-02-05*
