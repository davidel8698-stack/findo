# Phase 19: Performance, SEO & Certification - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Technical excellence achieving 95+ Lighthouse, complete SEO, analytics tracking, and Design Bible certification. This is optimization and verification work — no new features, no new UI components.

</domain>

<decisions>
## Implementation Decisions

### Performance Trade-offs
- Balance animation and performance case-by-case — keep essential animations, cut non-essential if they hurt LCP
- Image compression at 60-75% quality (medium) — good enough for web, balanced file size
- Use next/image automatic optimization — let Vercel handle on-the-fly optimization
- 3G fallback strategy: Claude's discretion on what to cut first (animations vs images) based on impact analysis

### Analytics Depth
- Track everything possible — full behavioral data for optimization
- Session replay enabled for all sessions — full behavioral insight
- A/B testing infrastructure ready to use — PostHog feature flags configured, can run tests immediately
- Multi-path funnel tracking — track all paths (demo viewers, FAQ readers, scrollers) to conversion

### SEO Strategy
- Solution-focused keywords — "אוטומציה לעסקים קטנים", "שיווק אוטומטי" (the category they're searching for)
- Maximum structured data coverage — Organization, WebSite, Product, FAQPage, LocalBusiness, Review
- Conversational meta description tone — "העסק שלך עובד. אתה לא." matches site personality
- Sitemap scope: Claude's discretion based on SEO best practices

### Certification Gates
- Lighthouse 95+ is mandatory — keep optimizing until target met, no exceptions
- Fix ALL Design Bible certification failures — no shipping until every check passes
- Hebrew copy reviewed by user personally — you will approve all copy
- Device testing via Chrome DevTools simulator only — no physical device requirement

### Claude's Discretion
- What to cut first on slow connections (animation vs images)
- Whether to include planned pages in sitemap
- Specific structured data field values
- Compression algorithm choices

</decisions>

<specifics>
## Specific Ideas

- PostHog is the analytics platform (already decided in v1.1 architecture)
- Target 50% conversion from qualified referral traffic (milestone goal)
- Design Bible certification target is 95+ (EXEMPLARY)
- Conversational Hebrew tone consistent with site personality established in earlier phases

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 19-performance-seo-certification*
*Context gathered: 2026-02-02*
