# Phase 7: GBP Content - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Keep business's Google profile fresh with regular photos and promotional posts. Owner receives weekly WhatsApp requests for photos, photos are uploaded to GBP, monthly promotional posts are created, and business details (hours, holidays) stay current. This phase covers content collection and publishing — metrics and optimization are Phase 8.

</domain>

<decisions>
## Implementation Decisions

### Photo Request Flow
- Weekly requests on Thursday (end of Israeli work week)
- Request 1-2 photos per week — low commitment approach
- Casual/friendly tone in Hebrew: "היי 🙋‍♀️ איך היה השבוע? שלח 1-2 תמונות..."
- One reminder after 2 days if no response, then skip until next week

### Photo Upload Handling
- Basic quality checks — reject blurry/too small photos with friendly message
- Ask owner to confirm category after sending: "זה נראה כמו [category] — נכון?"
- Upload to GBP within 24 hours (batch during off-peak)
- Always confirm successful upload: "התמונה עלתה לגוגל ✅" with link

### Promotional Posts
- Monthly WhatsApp asking if owner wants AI to create a "new offer"
- Include compelling explanation of why fresh posts matter for GBP
- Owner can edit/approve AI-generated content before publishing
- Reminder sequence if no response:
  1. Initial request
  2. Reminders (multiple)
  3. If still no response: AI creates safe content, sends for approval
  4. If still no response: publish, but ONLY safe content (no promotions owner can't fulfill)
- Safe content = general updates, seasonal greetings, behind-the-scenes — NOT discounts or offers
- Post images: use owner's recent photos if available; if not, AI generates images based on existing business photos (same location, team, products style)

### Business Details Updates
- Both calendar-based (holidays) AND monthly proactive checks
- Remind 1 week before Israeli holidays about special hours
- Always ask owner about hours — don't assume based on history
- WhatsApp confirmation is enough to update GBP (no dashboard approval needed)
- Owner replies "סגור 10-14" → Findo updates GBP directly

### Claude's Discretion
- Post type selection (offers vs updates vs seasonal) based on business type
- Post timing within the month based on engagement patterns
- Quality check thresholds (exact blur/size limits)
- Category auto-detection algorithm

</decisions>

<specifics>
## Specific Ideas

- AI-generated images must maintain visual consistency with existing business photos (same space, people, products)
- Safe auto-posted content should never include promotions or offers the business might not be able to fulfill
- Holiday reminders should cover all major Israeli holidays (Rosh Hashanah, Yom Kippur, Sukkot, Pesach, etc.)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-gbp-content*
*Context gathered: 2026-01-28*
