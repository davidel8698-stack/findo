# Phase 5: Review Management - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Positive reviews (4-5 stars) get AI-generated auto-replies. Negative reviews (1-3 stars) get drafted responses sent to owner via WhatsApp for approval. System polls hourly for new reviews. Review requests and metrics are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Auto-reply voice & style
- Warm & personal tone in Hebrew
- Always reference specific content from the review (what they mentioned)
- No emojis in replies
- Short replies: 1-2 sentences (thank you + invitation to return)

### Negative review handling
- Alert includes full review text, star rating, and suggested draft reply
- Owner can respond via WhatsApp ("אשר" to approve, or type edited version) OR via dashboard
- 48h reminder if owner doesn't respond
- If still no response after reminder, system auto-posts the draft
- Draft tone: Claude's discretion (apologetic vs neutral based on review content)

### Review classification
- 4-5 stars: auto-reply immediately
- 1-3 stars: alert owner with draft
- 3-star edge case: analyze sentiment to determine if positive or negative
- Reviews without text: still respond (generic thank-you for positive, alert for negative)
- No spam detection — respond to all reviews Google shows
- If review is updated after reply: alert owner if rating changed significantly

### Polling & timing
- Auto-reply posts immediately when detected (hourly poll)
- Negative review alerts: send immediately 24/7 (no quiet hours)
- No daily limit on auto-replies
- Multiple reviews from same reviewer: Claude's discretion on handling

### Claude's Discretion
- Draft tone for negative reviews (apologetic vs neutral)
- Handling of multiple reviews from same reviewer
- Specific wording variations for auto-replies

</decisions>

<specifics>
## Specific Ideas

- Auto-replies should feel like the business owner wrote them, not a bot
- "שמחנו לארח אותך ומחכים לפעם הבאה" type warmth
- Reference what reviewer mentioned: "שמחנו לשמוע שאהבת את הפיצה!"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-review-management*
*Context gathered: 2026-01-28*
