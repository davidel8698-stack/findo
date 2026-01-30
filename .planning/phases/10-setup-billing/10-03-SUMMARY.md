---
phase: 10
plan: 03
subsystem: setup-wizard
tags: [setup, ui, billing, telephony, wizard, hono]
depends_on:
  requires: [10-01]
  provides: [setup-wizard-steps-4-5, telephony-selection, billing-ui, success-page]
  affects: [10-04]
tech_stack:
  added: []
  patterns: [wizard-step-views, card-selection-ui, conditional-inputs]
key_files:
  created:
    - src/views/setup/step-4-telephony.ts
    - src/views/setup/step-5-billing.ts
    - src/views/setup/complete.ts
    - src/routes/setup/index.ts
  modified: []
decisions:
  - id: telephony-card-selection
    choice: Peer-checked radio with card-style UI
    rationale: Visual feedback, accessible, matches RESEARCH.md pattern
  - id: conditional-phone-inputs
    choice: JavaScript show/hide with required attribute toggle
    rationale: Progressive disclosure, only show phone input when needed
  - id: trial-option
    choice: 14-day trial without credit card
    rationale: Lower friction for signup, aligns with trial_ends_at schema field
  - id: layout-wrapper
    choice: Basic HTML wrapper for steps pending 10-02 full layout
    rationale: Wave 2 parallel execution, orchestrator handles merge
metrics:
  duration: ~4 min
  completed: 2026-01-30
---

# Phase 10 Plan 03: Setup Wizard Steps 4-5 Summary

**One-liner:** Telephony selection with 3 options and time expectations, billing summary with 3,500+350 NIS pricing, success page confirming Findo is active.

## What Was Built

### Task 1: Step 4 Telephony View
Created `src/views/setup/step-4-telephony.ts` with three-option selection:

1. **New Number** - Instant activation from Voicenter
2. **Transfer Existing** - 3-5 business days
3. **Use Current Mobile** - Instant call forwarding

Features:
- Peer-checked card-style radio buttons with visual checkmark
- Conditional phone input appears when transfer/current selected
- Israeli phone format hint (05X-XXXXXXX)
- Time expectations prominently displayed per option
- Hebrew RTL layout

### Task 2: Step 5 Billing View + Complete Page
Created `src/views/setup/step-5-billing.ts`:
- Pricing summary card: 3,500 NIS setup + 350 NIS/month
- "Pay securely" button (PayPlus integration in 10-04)
- 14-day trial option with no credit card required
- Security badges (SSL, PCI DSS)
- Hebrew disclaimer about payment security

Created `src/views/setup/complete.ts`:
- Success animation with green checkmark
- "Findo is working for you" message
- "What's happening now" box listing automated actions
- Dashboard CTA button
- Subtle confetti celebration effect
- WhatsApp notification promise

### Task 3: Setup Routes for Steps 4-5
Created `src/routes/setup/index.ts` with:
- GET/POST `/setup/step/4` - Telephony selection and validation
- GET `/setup/step/5` - Billing summary with subscription pricing
- POST `/setup/step/5/pay` - Payment initiation (placeholder for 10-04)
- POST `/setup/step/5/trial` - Start 14-day trial
- GET `/setup/complete` - Success page with business name

Validation:
```typescript
const step4Schema = z.object({
  telephonyOption: z.enum(['new', 'transfer', 'current']),
  existingNumber: z.string().optional(),
}).refine(
  (data) => data.telephonyOption === 'new' || (data.existingNumber && data.existingNumber.length >= 9),
  { message: 'יש להזין מספר טלפון', path: ['existingNumber'] }
);
```

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 04b7c33 | feat | create step 4 telephony selection view |
| a39f969 | feat | create step 5 billing view and complete page |
| d782773 | feat | add routes for setup wizard steps 4-5 |

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Telephony card selection | Peer-checked radio with card-style UI | Visual feedback, accessible, matches RESEARCH.md pattern |
| Conditional phone inputs | JavaScript show/hide with required toggle | Progressive disclosure, only show phone input when needed |
| Trial option | 14-day trial without credit card | Lower friction for signup, aligns with trial_ends_at schema field |
| Layout wrapper | Basic HTML wrapper pending 10-02 | Wave 2 parallel execution, orchestrator handles merge |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Checklist

- [x] Step 4 shows three telephony options with time expectations
- [x] Conditional phone input appears for transfer/current options
- [x] Step 4 POST validates and saves choice
- [x] Step 5 shows pricing (3,500 + 350)
- [x] Step 5 has payment and trial buttons
- [x] Trial starts with 14-day period
- [x] Complete page shows "Findo is working" message
- [x] Dashboard link works from complete page
- [x] All Hebrew RTL layout correct
- [x] TypeScript compiles without errors

## Key Artifacts

### Exports
- `renderStep4Telephony(data?: Step4Data)` - Step 4 view
- `renderStep5Billing(data: Step5Data)` - Step 5 view
- `renderSetupComplete(data: SetupCompleteData)` - Success page
- `setupRoutes` - Hono router for /setup/* routes

### Key Links
- Routes import and render views: `src/routes/setup/index.ts` -> `src/views/setup/*.ts`
- Complete page links to dashboard: `/setup/complete` -> `/dashboard`

## Next Phase Readiness

**Ready for 10-04 (PayPlus Integration):**
- Payment button POST to `/setup/step/5/pay` is ready for PayPlus redirect
- Subscription record created with correct pricing in agorot
- Success/failure redirect URLs can be configured

**Dependencies satisfied:**
- 10-01 billing schema provides subscriptions and setupProgress tables
- Routes use schema correctly with helper functions
