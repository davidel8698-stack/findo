# Phase 3: Lead Capture - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Missed calls become qualified leads delivered to business owner via WhatsApp. The system detects unanswered calls via Voicenter webhook, waits 2 minutes, sends WhatsApp to caller, collects basic info via chatbot, and notifies the owner with a structured summary.

Phone options (new/transfer/mobile) are a marketing distinction — all routes go through Voicenter.

</domain>

<decisions>
## Implementation Decisions

### Initial WhatsApp Message
- **Tone:** Warm and personal — feels like it comes from the owner
- **Identity:** Appears from owner, no mention of automation or assistant
- **Content:** Include business name to remind caller who they called
- **Call to action:** Open question — "איך אפשר לעזור?" invites them to explain their need
- **Example pattern:** "היי, ראיתי שניסית להתקשר ל[שם העסק] ולא הצלחתי לענות. איך אפשר לעזור?"

### Chatbot Conversation Flow
- **Info to collect:** Name + Need + Contact preference (when to call back)
- **Non-response handling:** Two reminders over 24 hours (at 2h and 24h), then mark as unresponsive
- **Unclear replies:** AI interpretation — extract intent from unclear messages, don't ask for clarification
- **Conversation end:** Promise callback — "תודה! אנחנו נחזור אליך בהקדם" sets expectation

### Owner Notification Format
- **Timing:** Real-time updates — notify on first message, update as info comes in
- **Format:** Structured summary with emoji headers:
  ```
  📞 ליד חדש
  שם: X
  צורך: Y
  העדפה: Z
  ```
- **Actions:** Tap to call/message — clickable phone number for direct action
- **Incomplete leads:** Yes, notify with "ליד חדש (חלקי)" — owner can still try to reach them

### Phone Option Behaviors
- **All options route through Voicenter** — marketing distinction only
- **New number:** Voicenter provides new number, owner's existing number unchanged
- **Transfer existing:** Port existing landline to Voicenter
- **Use current mobile:** Port mobile number to Voicenter
- **Same end result:** All calls tracked by Voicenter, missed calls trigger lead capture

### Claude's Discretion
- Exact Hebrew wording of messages (within warm/personal tone)
- Chatbot question sequence and phrasing
- AI model choice for intent extraction
- Reminder message variations
- Structured summary field layout

</decisions>

<specifics>
## Specific Ideas

- Message should feel like owner wrote it, not a system
- "ראיתי שניסית להתקשר" pattern — acknowledges the missed call warmly
- Owner gets actionable notification they can tap to respond
- 2-minute wait before sending (in case owner calls back immediately)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-lead-capture*
*Context gathered: 2026-01-27*
