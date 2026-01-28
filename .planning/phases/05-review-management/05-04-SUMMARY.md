---
phase: 05-review-management
plan: 04
subsystem: notifications
tags: [whatsapp, interactive-buttons, owner-approval, hebrew]

dependency_graph:
  requires:
    - 05-01 (processedReviews schema with approval tracking fields)
    - 05-02 (AI reply generation for draft replies)
  provides:
    - sendInteractiveButtons for WhatsApp reply button messages
    - sendApprovalRequest for owner notification flow
    - checkAndSendApproval as integration point
    - Full negative review notification flow
  affects:
    - 05-05 (owner response handling will use button IDs)
    - Review webhook handler (will match approve_/edit_ patterns)

tech_stack:
  added: []
  patterns:
    - WhatsApp interactive button messages for in-session approval
    - Text fallback with instructions for out-of-session approval
    - Hebrew notification templates with review details

key_files:
  created:
    - src/services/review-management/approval-flow.ts
  modified:
    - src/services/whatsapp/messages.ts
    - src/services/whatsapp/index.ts
    - src/services/review-management/index.ts

decisions:
  - id: interactive-button-pattern
    decision: "Use approve_{reviewId} and edit_{reviewId} as button callback IDs"
    rationale: "Enables webhook handler to extract review ID and action from button response"
  - id: window-aware-notifications
    decision: "Check conversation window before choosing message type"
    rationale: "Interactive buttons only work within 24-hour session, text fallback always works"
  - id: fallback-instructions-hebrew
    decision: "Include Hebrew text instructions in fallback messages"
    rationale: "Owner can respond with 'אשר' or custom text when buttons unavailable"

metrics:
  duration: "6 min"
  completed: "2026-01-28"
---

# Phase 05 Plan 04: Owner Approval Flow Summary

**One-liner:** WhatsApp interactive buttons for owner approval of negative review responses with automatic text fallback for out-of-session notifications.

## What Was Built

### Interactive Button Messages (`messages.ts`)

1. **InteractiveButton interface:**
   - `id`: Button callback ID (max 256 chars)
   - `title`: Button display text (max 20 chars)

2. **sendInteractiveButtons function:**
   - Constructs WhatsApp Cloud API interactive message payload
   - Validates max 3 buttons per message
   - Validates body text max 1024 characters
   - Supports optional header and footer text
   - Returns MessageSendResult with messageId for tracking

### Approval Flow Service (`approval-flow.ts`)

1. **sendApprovalRequest function:**
   - Loads processed review and tenant data
   - Gets owner phone from tenant.ownerPhone
   - Checks conversation window status via getOwnerConversationWindow
   - Builds Hebrew notification message with:
     - Star rating header: "ביקורת חדשה ({N} כוכבים)"
     - Review content: "{reviewerName}: "{comment}""
     - Draft reply: "תשובה מוצעת: "{draftReply}""
   - If window open: sends interactive buttons
   - If window closed: sends text with instructions
   - Updates processedReview with approvalMessageId and approvalSentAt

2. **checkAndSendApproval function:**
   - Integration point for processNewReview
   - Simply calls sendApprovalRequest

3. **getOwnerConversationWindow helper:**
   - Queries whatsappConversations for owner's window status
   - Returns windowExpiresAt or null

### Integration (`index.ts`)

- Exports approval-flow module
- processNewReview now calls checkAndSendApproval for negative reviews
- Creates 'review.approval_requested' activity event for audit trail

## Interactive Button Payload

```typescript
{
  messaging_product: 'whatsapp',
  recipient_type: 'individual',
  to: ownerPhone,
  type: 'interactive',
  interactive: {
    type: 'button',
    body: { text: notificationMessage },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'approve_{reviewId}', title: 'אשר ושלח' } },
        { type: 'reply', reply: { id: 'edit_{reviewId}', title: 'רוצה לערוך' } }
      ]
    }
  }
}
```

## Hebrew Message Templates

**Notification (body):**
```
ביקורת חדשה (2 כוכבים)

דני כהן: "השירות היה גרוע מאוד"

תשובה מוצעת:
"תודה על הביקורת דני. אנו מצטערים לשמוע..."
```

**Fallback instructions (appended when window closed):**
```
השב 'אשר' לאישור, או כתוב את התשובה שלך
```

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 3785664 | feat | Add sendInteractiveButtons for WhatsApp reply buttons |
| 4a78ac9 | feat | Create approval flow service for negative reviews |
| a9b4d92 | feat | Integrate approval flow with processNewReview |

## Next Phase Readiness

**Ready for 05-05:**
- Button callback IDs (approve_{id}, edit_{id}) ready for webhook handler
- Activity event 'review.approval_requested' created for audit trail
- Owner can respond via buttons or text

**No blockers identified.**

## Testing Notes

- Interactive buttons require active 24-hour conversation window
- Test both window-open (buttons) and window-closed (text) scenarios
- Verify button callback IDs match expected pattern in webhook handler

---
*Phase: 05-review-management*
*Completed: 2026-01-28*
