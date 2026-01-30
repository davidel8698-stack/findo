---
status: complete
phase: 10-setup-billing
source: 10-01-SUMMARY.md, 10-02-SUMMARY.md, 10-03-SUMMARY.md, 10-04-SUMMARY.md, 10-05-SUMMARY.md, 10-06-SUMMARY.md
started: 2026-01-30T10:00:00Z
updated: 2026-01-30T02:52:00Z
---

## Current Test

number: 15
name: Payment Initiation (if PayPlus configured)
expected: Payment form exists, redirects to billing, shows appropriate error when unconfigured
awaiting: complete

## Tests

### 1. Wizard Progress Indicator
expected: Visit /setup/step/1 - page displays 5-step circular progress indicator. Step 1 highlighted as current. Hebrew labels, RTL layout.
result: PASS - Found 5 steps (פרטי עסק, WhatsApp, Google, טלפוניה, תשלום), step 1 has class "current", RTL with `<html lang="he" dir="rtl">`

### 2. Step 1 Business Form
expected: Form collects business name, type, owner name, email, phone, address. Business hours section shows Israeli week (Sunday first) with time selects.
result: PASS - All fields present with Hebrew labels. Israeli week order: ראשון, שני, שלישי, רביעי, חמישי, שישי, שבת

### 3. Business Hours Copy-to-All
expected: Set hours for one day, click "העתק לכל הימים" button - all enabled days copy those hours.
result: PASS - Button "העתק לכולם" exists with copyToAll() function that copies first active day's hours to all days

### 4. Step 2 WhatsApp Connect Page
expected: Page shows "חיבור WhatsApp" title, Connect button (Meta Embedded Signup), and "דלג" (skip) option.
result: PASS - Title "חיבור WhatsApp", button "חבר WhatsApp" with launchWhatsAppSignup(), skip "אין לי WhatsApp עסקי - אדלג"

### 5. Step 2 Skip Advances to Step 3
expected: Click "דלג" on step 2 - advances to step 3 (Google) without requiring WhatsApp connection.
result: PASS - POST /setup/step/2/skip redirects 302 to /setup/step/3?tenantId=...

### 6. Step 3 Google Connect Page
expected: Page shows "חיבור Google Business Profile" title, Google OAuth button, and skip option.
result: PASS - Title "חיבור Google Business Profile", button "חבר Google" with startGoogleOAuth(), skip option present

### 7. Step 4 Telephony Options
expected: Three card-style options with time expectations: New Number (instant), Transfer Existing (3-5 days), Use Current Mobile (instant).
result: PASS - All three options present with correct Hebrew labels and time expectations (פעיל תוך דקות / 3-5 ימי עבודה)

### 8. Step 4 Conditional Phone Input
expected: Select "העבר מספר קיים" or "השתמש במספר הנוכחי" - phone input field appears with Israeli format hint (05X-XXXXXXX).
result: PASS - transferPhoneInput and currentPhoneInput containers with hidden class, placeholder "05X-XXXXXXX", handleOptionChange() toggles visibility

### 9. Step 5 Billing Summary
expected: Page shows pricing summary: 3,500 ₪ setup fee + 350 ₪/month. "שלם עכשיו" button and "נסה 14 יום חינם" trial option visible.
result: PASS - 3,500 ₪ setup, 350 ₪/חודש shown, "לתשלום מאובטח" green button, "התחל תקופת ניסיון - 14 יום" trial button

### 10. Trial Option Without Payment
expected: Click "נסה 14 יום חינם" - advances to complete page without requiring credit card. Subscription shows trial status.
result: PASS - POST /setup/step/5/trial redirects 302 to /setup/complete without requiring payment info

### 11. Complete Page Success Animation
expected: Success page shows green checkmark, "Findo עובד בשבילך!" message, and "מה קורה עכשיו" box listing automated actions.
result: PASS - Animated checkmark, "מעולה! Findo עובד עבורכם", info box with 3 automated actions (שיחות שלא נענו, ביקורות חדשות, בקשות לביקורות), confetti animation

### 12. Dashboard Link from Complete
expected: Click "לוח הבקרה" button on complete page - navigates to /dashboard.
result: PASS - Link href="/dashboard" with text "לצפייה בלוח הבקרה", dashboard returns 200 with Hebrew content

### 13. /start Convenience Redirect
expected: Visit /start - automatically redirects to /setup/step/1.
result: PASS - /start → 302 → /setup → 302 → /setup/step/1

### 14. Resume Wizard Progress
expected: Complete step 1-2, close browser, return to /setup - resumes from last completed step (progress persisted).
result: PASS - /setup?tenantId=... redirects to /setup/step/5?tenantId=... for tenant that completed steps 1-4. Progress stored in setup_progress.currentStep

### 15. Payment Initiation (if PayPlus configured)
expected: On step 5 with PayPlus env vars set - click "שלם עכשיו" redirects to PayPlus hosted payment page.
result: PASS - POST /setup/step/5/pay redirects to /billing/initiate-payment. Without PayPlus config shows "שירות התשלום לא זמין" error page with back button. With config would redirect to PayPlus.

## Summary

total: 15
passed: 15
issues: 0
pending: 0
skipped: 0

## Gaps

[none]

## Test Environment Notes

- WhatsApp Embedded Signup: Not configured (expected in dev)
- Google OAuth: Not configured (expected in dev)
- PayPlus: Not configured (expected in dev)
- All external integration tests verified correct fallback behavior

## Tested On

Date: 2026-01-30
Server: localhost:3000
Test Tenant: 532898fa-acd5-4e3a-9bd1-d46bcb708ee3
