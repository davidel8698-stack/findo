---
phase: 05-review-management
plan: 05
subsystem: webhooks
tags: [whatsapp, interactive-buttons, owner-approval, webhook-handler]

dependency_graph:
  requires:
    - 05-03 (processNewReview for processing flow)
    - 05-04 (sendApprovalRequest for notification sent to owner)
  provides:
    - handleOwnerReviewResponse for processing owner button clicks
    - approveReviewReply for posting draft to Google
    - submitEditedReply for posting custom reply to Google
    - ParsedMessage.buttonId for button click detection
  affects:
    - Future review reminder/auto-post features (05-06)

tech_stack:
  added: []
  patterns:
    - Button ID extraction at webhook parsing layer
    - AWAITING_EDIT marker in ownerResponse field for edit tracking
    - Owner phone check before review response handling
    - Interactive message type mapped to text for database storage

key_files:
  created:
    - src/services/review-management/response-handler.ts
  modified:
    - src/services/whatsapp/webhooks.ts
    - src/queue/workers/whatsapp-message.worker.ts
    - src/services/review-management/index.ts

decisions:
  - id: button-id-at-webhook-layer
    decision: "Extract buttonId from interactive messages in parseWebhookPayload"
    rationale: "Centralized parsing, available to all downstream handlers"
  - id: interactive-to-text-mapping
    decision: "Map interactive type to text for database storage"
    rationale: "Avoids schema migration, button replies are conceptually text responses"
  - id: awaiting-edit-marker
    decision: "Store 'AWAITING_EDIT:{reviewId}' in ownerResponse field"
    rationale: "Reuses existing schema field, enables pending edit detection"
  - id: owner-check-before-lead
    decision: "Check owner review response before lead conversation handling"
    rationale: "Owner review responses take priority, prevents false lead processing"

metrics:
  duration: "7 min"
  completed: "2026-01-28"
---

# Phase 05 Plan 05: Owner Response Handler Summary

**One-liner:** Webhook handler for owner button clicks and text responses that posts approved or edited replies to Google.

## What Was Built

### Response Handler Service (`response-handler.ts`)

1. **handleOwnerReviewResponse function:**
   - Entry point for owner message processing
   - Detects button clicks (approve_{id}, edit_{id})
   - Handles Hebrew text "אשר" for text-based approval
   - Detects pending edit state and submits edited reply
   - Returns boolean indicating if message was handled

2. **approveReviewReply function:**
   - Loads processed review and Google connection
   - Posts draft reply via postReviewReply
   - Updates status: pending_approval -> approved -> replied
   - Sends Hebrew confirmation: "התשובה פורסמה בהצלחה!"
   - Creates activity event 'review.replied' with replyType: 'approved'

3. **submitEditedReply function:**
   - Validates byte length <= 4096 (Hebrew chars are 2-3 bytes)
   - Posts edited text via postReviewReply
   - Updates status: edited -> replied
   - Stores edited text in ownerResponse field
   - Sends Hebrew confirmation
   - Creates activity event 'review.replied' with replyType: 'edited'

4. **requestEditedReply function:**
   - Marks review status as 'edited'
   - Sets ownerResponse to 'AWAITING_EDIT:{reviewId}'
   - Sends prompt: "אנא כתוב/י את התשובה שברצונך לפרסם:"

5. **Helper functions:**
   - getPendingEditForOwner: Finds reviews with AWAITING_EDIT marker
   - getLatestPendingApproval: Finds most recent pending review
   - sendOwnerConfirmation: Sends WhatsApp message to owner

### Webhook Parsing Updates (`webhooks.ts`)

1. **ParsedMessage interface:**
   - Added `buttonId?: string` field
   - Added `'interactive'` to type union

2. **WhatsAppIncomingMessage interface:**
   - Added `interactive` field with button_reply structure

3. **parseWebhookPayload function:**
   - Extracts buttonId from interactive.button_reply.id
   - Sets text field to button title for interactive messages

4. **mapMessageType function:**
   - Added 'interactive' case mapping

### Worker Integration (`whatsapp-message.worker.ts`)

1. **Owner detection:**
   - Loads tenant early to get ownerPhone
   - Compares message.from to tenant.ownerPhone

2. **Review response handling:**
   - Calls handleOwnerReviewResponse for owner messages
   - Skips lead processing if handled as review response
   - Non-owner messages continue to lead capture unchanged

3. **Database compatibility:**
   - Maps 'interactive' type to 'text' for database storage

## Message Flow

```
WhatsApp Webhook
       |
       v
parseWebhookPayload (extracts buttonId)
       |
       v
whatsapp-message.worker
       |
       +-> Is from owner?
       |       |
       |       YES -> handleOwnerReviewResponse
       |       |           |
       |       |           +-> Button 'approve_*' -> approveReviewReply -> postReviewReply
       |       |           +-> Button 'edit_*' -> requestEditedReply (prompts for text)
       |       |           +-> Text 'אשר' -> getLatestPendingApproval -> approveReviewReply
       |       |           +-> Text + pending edit -> submitEditedReply -> postReviewReply
       |       |
       |       NO -> Lead conversation handling (unchanged)
       |
       v
Save message to database
```

## Status Transitions

| Trigger | From Status | To Status |
|---------|-------------|-----------|
| Button approve/Text אשר | pending_approval | approved -> replied |
| Button edit | pending_approval | edited |
| Text response (with edit pending) | edited | replied |
| Reminder sent | pending_approval | reminded |
| Auto-post (future) | reminded | expired -> replied |

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 4b2cc14 | feat | Create owner response handler for review approvals |
| b2f9549 | feat | Add buttonId to ParsedMessage and parse from webhook |
| e9a3731 | feat | Integrate response handler into WhatsApp message worker |
| 2ce0d78 | chore | Export response-handler from review-management index |

## Success Criteria Verification

| Criteria | Status |
|----------|--------|
| Owner button clicks detected from webhook via ParsedMessage.buttonId | PASS |
| Approve posts draft reply to Google immediately | PASS |
| Edit prompts owner and waits for custom reply | PASS |
| Custom reply is validated (4096 bytes) and posted to Google | PASS |
| Owner receives Hebrew confirmation after posting | PASS |
| Status transitions: pending_approval -> approved -> replied | PASS |
| Status transitions: pending_approval -> edited -> replied | PASS |
| Existing lead capture for non-owner messages works unchanged | PASS |

## Key Links Verification

| From | To | Via | Verified |
|------|----|----|----------|
| response-handler.ts | google/reviews.ts | postReviewReply import | PASS |
| whatsapp-message.worker.ts | review-management | handleOwnerReviewResponse import | PASS |
| webhooks.ts | button_reply.id | interactive message parsing | PASS |

## Next Phase Readiness

**Phase 5 Complete:**
- 05-01: Reviews Schema
- 05-02: AI Reply Generation
- 05-03: Review Polling Worker
- 05-04: Owner Approval Flow
- 05-05: Owner Response Handler (this plan)

**Ready for Phase 6:** All review management functionality is complete:
- Positive reviews get auto-replied immediately
- Negative reviews alert owner with draft
- Owner can approve via button or text
- Owner can edit and submit custom reply
- Reply is posted to Google and tracked

**Outstanding for future plans:**
- 48h reminder if owner doesn't respond
- Auto-post draft after reminder expires

---
*Phase: 05-review-management*
*Completed: 2026-01-28*
