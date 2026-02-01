# Phase 16: Offer & Objection Handling - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Risk elimination so complete that saying no requires effort. This phase delivers pricing transparency, guarantee messaging, ROI calculator, FAQ, and comparison with alternatives. The goal is to remove every possible objection before checkout.

</domain>

<decisions>
## Implementation Decisions

### Pricing Presentation
- Three-column comparison table: DIY (doing it yourself) | Marketing Agency | Findo
- Findo positioned as the "sweet spot" between painful DIY and expensive agency
- Full transparency: 350 NIS/month + setup fee clearly visible (not hidden)
- Setup fee amount: Claude's discretion based on typical SaaS patterns

### ROI Calculator
- Two slider inputs: missed calls per week + monthly revenue
- Sliders update value in real-time as user drags
- Results animate with counting animation (matches existing spring patterns)
- Hebrew-friendly terminology - avoid "ROI" - use something like "כמה תרוויח" or "החזר ההשקעה שלך"
- Claude's discretion: preset starting values, result visualization approach

### Guarantee Messaging
- Three separate guarantees, each with its own badge:
  1. **14-day refund**: Full refund within 14 business days, no questions
  2. **60-second call promise**: Any unanswered call picked up within 60 seconds, or 250 NIS compensation
  3. **10-review guarantee**: At least 10 new reviews in first month (given 30+ customers notified), or full refund + 250 NIS
- Named guarantee: "ההבטחה של פינדו" or similar
- Placement: Brief badges near CTAs + dedicated "Our Promise" section with full details
- Claude's discretion: exact badge design, Hebrew wording for maximum impact

### FAQ Structure
- Accordion format (click to expand) - clean, scannable
- Top 5 objections: Claude's discretion based on typical SMB SaaS concerns (likely: "Is it hard to set up?", "What if it doesn't work for my business?", "Can I cancel anytime?", "How is this different from doing it myself?", "What if I need help?")
- Answer length: Claude's discretion per question (some need 1 sentence, some need more)
- Ends with "Still have questions?" WhatsApp CTA

### Claude's Discretion
- Setup fee amount (typical SaaS patterns)
- ROI calculator preset values and result visualization
- Exact guarantee badge design and Hebrew wording
- FAQ objection selection and answer length per question
- Comparison table row items (what features to compare)

</decisions>

<specifics>
## Specific Ideas

- Calculator sliders should feel interactive and playful - matches the existing animation character (bouncy, spring physics)
- The three-part guarantee is powerful - show the 250 NIS compensation prominently (specific numbers are persuasive)
- Comparison table should make competitors look expensive/painful without naming specific competitors
- "ההבטחה של פינדו" makes the guarantee memorable and shareable

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 16-offer-objection-handling*
*Context gathered: 2026-02-01*
