# Phase 8: GBP Optimization - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Monitor GBP metrics and autonomously optimize for better performance. System tracks review rates, visibility metrics, and content performance, then adjusts operational parameters (timing, templates, intervals) to improve results. Dashboard displays metrics; alerts notify when performance drops; A/B testing determines winning approaches.

</domain>

<decisions>
## Implementation Decisions

### Metrics Presentation
- Card grid layout — each metric in its own card with big number + trend arrow
- Timeframe toggle — default week-over-week, button to switch to month-over-month
- Expandable charts — click any card to see full history (30/60/90 days)
- Visibility metrics prioritized first (impressions, searches, contacts), then reviews, then content

### Alert Thresholds
- Dynamic baseline — learn from each business's history, alert on significant drop from their normal
- Weekly check frequency — once per week, summarize if below baseline
- WhatsApp-only delivery — consistent with existing notification flows
- Actionable content — alerts include suggestions ("Reviews dropped 40% — consider sending more review requests")

### Auto-Tuning Behavior
- Aggressive autonomy — system can try new approaches, inform owner after the fact
- Full operational scope — timing, messages, follow-up intervals, request frequency all tunable
- Weekly summary notifications — "This week I adjusted X and Y, here's why"
- Soft limits with override — guardrails exist (e.g., max 1 review request per customer per month) but system can exceed if data strongly supports it

### A/B Testing Approach
- Test everything tunable — messages, timing, follow-up intervals, photo request frequency
- Hybrid learning — start with cross-tenant insights, refine with per-tenant data
- Practical threshold for winners — switch when one variant is 20%+ better with 10+ samples
- Auto-adopt winning templates — global winners become default for new businesses
- Automatic rollback — if adopted template harms metrics, revert to previous version and log learnings

### Claude's Discretion
- Specific chart libraries and visualization approach
- Baseline calculation algorithm (moving average, percentile-based, etc.)
- Exact soft limit values (can start conservative, adjust based on data)
- Statistical methods for detecting "significant drop"

</decisions>

<specifics>
## Specific Ideas

- Winning templates get trial period on adoption — if they harm metrics for a specific business, auto-rollback to previous best and analyze why
- System should draw conclusions from failures, not just successes — learn what doesn't work for certain business types
- Owner gets proactive value from optimization ("Your review rate is 40% above similar businesses" type messaging)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-gbp-optimization*
*Context gathered: 2026-01-29*
