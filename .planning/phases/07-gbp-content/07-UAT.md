---
status: complete
phase: 07-gbp-content
source: 07-01-SUMMARY.md, 07-02-SUMMARY.md, 07-03-SUMMARY.md, 07-04-SUMMARY.md, 07-05-SUMMARY.md, 07-06-SUMMARY.md, 07-07-SUMMARY.md
started: 2026-01-29T14:30:00Z
updated: 2026-01-29T15:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Weekly Photo Request
expected: Thursday 10:00 AM: Owner with both WhatsApp AND Google connected receives Hebrew WhatsApp message asking for 1-2 photos from the week. Message includes business name and clear instructions.
result: pass

### 2. Photo Reminder (2 days)
expected: If owner doesn't respond to photo request, Saturday 10:00 AM sends a reminder message. Reminder is friendly and mentions the deadline.
result: pass

### 3. Photo Upload via WhatsApp
expected: When owner sends a photo via WhatsApp, system downloads it, validates quality (size, blur), asks for category selection, and uploads to GBP. Owner receives confirmation with GBP link.
result: issue
reported: "Confirmation message works but does not include GBP link. GBP images are in 'Processing' state at upload time - real URL only available after 24-48h processing."
severity: minor

### 4. Photo Validation Rejection
expected: If owner sends a blurry or too-small photo, they receive a Hebrew error message explaining the issue (e.g., "התמונה קטנה מדי" or "התמונה נראית מטושטשת").
result: pass

### 5. Monthly Post Request
expected: 1st of month at 10:00 AM: Owner receives WhatsApp asking about promotional post content. Message includes statistics (35% more views) and three options: provide content, request AI generation, or skip.
result: pass

### 6. AI Post Generation
expected: If owner requests AI generation ("AI" response), system generates Hebrew post content using Claude, sends draft for approval. Owner can approve, edit, or skip.
result: pass

### 7. Post Approval Flow
expected: Owner can approve post by replying "אשר" or similar. Post is published to GBP. Owner receives confirmation with link to view the post.
result: issue
reported: "Approval detection works, post published correctly, owner receives confirmation - but missing link to view the post in confirmation message."
severity: minor

### 8. Post Reminder Sequence
expected: If owner doesn't respond: Day 3 gentle reminder, Day 7 reminder + AI draft, Day 10 auto-publishes safe content. Each step has appropriate Hebrew message.
result: pass

### 9. Holiday Hours Reminder
expected: ~1 week before major Israeli holidays (Rosh Hashana, Yom Kippur, Pesach, etc.), owner receives WhatsApp asking about special hours with format instructions.
result: pass

### 10. Hours Update via WhatsApp
expected: Owner can reply with hours in "DD/MM: hours" format (e.g., "15/9: סגור\n16/9: 10:00-14:00"). System updates GBP special hours and confirms with summary.
result: pass

### 11. Workers Start on Server Boot
expected: When server starts, all Phase 7 workers log their startup. Server logs show photo-request, photo-upload, monthly-post, post-approval, and holiday-check workers initialized.
result: issue
reported: "All 5 workers imported and started, 4 workers log startup message. holiday-check worker doesn't have explicit startup log (instantiated directly at import, not via start function)."
severity: cosmetic

### 12. Graceful Shutdown
expected: On SIGTERM/SIGINT, all Phase 7 workers stop gracefully before Redis connections close. Server logs confirm each worker stopped.
result: pass

## Summary

total: 12
passed: 9
issues: 3
pending: 0
skipped: 0

## Gaps

- truth: "Owner receives confirmation with GBP link after photo upload"
  status: failed
  reason: "User reported: Confirmation message works but does not include GBP link. GBP images are in 'Processing' state at upload time - real URL only available after 24-48h processing."
  severity: minor
  test: 3
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Owner receives confirmation with link to view the post after approval"
  status: failed
  reason: "User reported: Approval detection works, post published correctly, owner receives confirmation - but missing link to view the post in confirmation message."
  severity: minor
  test: 7
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "All Phase 7 workers log their startup on server boot"
  status: failed
  reason: "User reported: All 5 workers imported and started, 4 workers log startup message. holiday-check worker doesn't have explicit startup log (instantiated directly at import, not via start function)."
  severity: cosmetic
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
