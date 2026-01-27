# Phase 2: WhatsApp Integration - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Business owners connect WhatsApp in one click via Meta Embedded Signup. System stores WABA ID, Phone Number ID, and tokens encrypted in Token Vault. System can send messages to test numbers and receive incoming messages via webhook for processing. Creating conversations, chatbots, and lead capture are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Connection Flow UX
- Dimmed overlay with spinner while Meta Embedded Signup popup is open
- If user closes popup without completing: show confirmation dialog first ("Are you sure? You'll need to start over")
- On successful connection: show success screen with details (connected phone number, business name) and "Continue" button
- On Meta error (e.g., phone already registered): show error + retry guidance with specific steps to fix

### Credential Storage Scope
- Store only tokens needed for API calls (no profile data caching)
- Daily validation: check token validity every 24 hours proactively
- If token becomes invalid: multi-channel notification (WhatsApp alert to owner + dashboard alert + email)
- Single WhatsApp number per business; if owner wants to replace, require explicit confirmation before disconnecting old

### Message Sending Behavior
- Templates to initiate conversations; freeform messages allowed within 24-hour customer service window after customer responds
- On delivery failure: retry automatically with backoff, notify owner only if all retries fail
- Track everything: sent, delivered, and read status for all messages
- Follow Meta's tier limits only; no additional per-tenant rate limiting

### Webhook Processing
- Handle text messages and images in this phase (ignore voice, documents, location for now)
- Separate queues: customer messages vs status updates (delivered/read/failed)
- Status updates processed in batches (every few minutes, not real-time)
- Unknown message types (sticker, contact card, etc.): auto-reply "Sorry, I can only handle text and images"

### Claude's Discretion
- Exact retry timing and backoff strategy for failed messages
- Batch interval for status update processing
- Success screen layout and exact wording
- Error message Hebrew translations

</decisions>

<specifics>
## Specific Ideas

- Multi-channel notification for token issues ensures owner doesn't miss critical reconnection needs
- Confirmation dialog before popup close prevents accidental abandonment of signup flow
- Status batching reduces database writes while still maintaining delivery tracking

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-whatsapp-integration*
*Context gathered: 2026-01-27*
