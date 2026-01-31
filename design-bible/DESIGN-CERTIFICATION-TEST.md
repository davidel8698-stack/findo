# FINDO Design Certification Test v2.0

> **"No page ships without certification."**
> **"Excellence is not optional."**

---

## 🤖 AUTOMATED CERTIFICATION SYSTEM (PRIMARY METHOD)

> **"A test that can be faked is not a test. Our system checks itself."**

The primary certification method is now **fully automated** and **cryptographically unforgeable**.

### Quick Start

```bash
# Run automated certification on any URL
npm run cert:run https://your-page-url.com

# Verify an existing certification report
npm run cert:verify path/to/certification-report.json

# Help
npm run cert:help
```

### What the Automated System Does

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    🤖 AUTO-CERTIFIER CAPABILITIES                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ✅ FETCHES & ANALYZES PAGE CONTENT PROGRAMMATICALLY                    │
│     - No human can manipulate what the system sees                      │
│     - Real HTML/CSS analysis, not checkbox claims                       │
│                                                                         │
│  ✅ RUNS 19+ AUTOMATED CHECKS                                           │
│     A1: Headline clarity (word count, action words)                     │
│     A2: Value proposition presence                                      │
│     A3: CTA visibility and quality                                      │
│     B1: Navigation structure analysis                                   │
│     B2: Semantic HTML usage                                             │
│     B3: Form accessibility                                              │
│     C1: Readability scoring (sentence length, complexity)               │
│     C2: Jargon detection (buzzword patterns)                            │
│     C3: Benefits vs Features ratio                                      │
│     D1: Social proof presence                                           │
│     D2: Contact information availability                                │
│     D3: Guarantee visibility                                            │
│     E1: CTA language analysis                                           │
│     E2: Form friction (field count)                                     │
│     E3: Urgency pattern detection (fake urgency = fail)                 │
│     F1: Mobile viewport support                                         │
│     F2: Touch-friendly elements                                         │
│     G1: Accessibility basics (alt tags, semantic structure)             │
│     G2: Performance indicators                                          │
│                                                                         │
│  ✅ CRYPTOGRAPHIC CHECKSUM CHAIN                                        │
│     - SHA-256 hash chain links every check result                       │
│     - Any modification breaks the chain                                 │
│     - Tamper-proof audit trail                                          │
│                                                                         │
│  ✅ SIGNED CERTIFICATION REPORTS                                        │
│     - Digital signature on final report                                 │
│     - Verification command validates authenticity                       │
│     - Cannot be forged after the fact                                   │
│                                                                         │
│  ✅ TIMESTAMP VERIFICATION                                              │
│     - Reports timestamped at generation                                 │
│     - Old reports flagged as potentially stale                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Output Format

The system generates a JSON report containing:

```json
{
  "certificationId": "FINDO-2026-01-25-ABC123-AUTO",
  "url": "https://example.com/page",
  "timestamp": "2026-01-25T12:00:00.000Z",
  "totalScore": 87,
  "maxScore": 100,
  "grade": "B",
  "certified": false,
  "sections": {
    "A_FirstImpression": { "score": 12, "max": 15, "checks": [...] },
    "B_Usability": { "score": 13, "max": 15, "checks": [...] },
    ...
  },
  "checksumChain": ["a1b2c3...", "d4e5f6...", ...],
  "signature": "sha256:..."
}
```

### Verification

Anyone can verify a certification report hasn't been tampered with:

```bash
npm run cert:verify certification-report.json
```

The verifier checks:
1. ✅ Checksum chain integrity (no gaps, valid hashes)
2. ✅ Signature authenticity (matches report data)
3. ✅ Timestamp validity (not too old, not in future)
4. ✅ Score consistency (individual scores sum to total)

### When to Use Manual vs Automated

| Situation | Use |
|-----------|-----|
| Quick pre-launch check | **Automated** - Fast, objective |
| Detailed UX audit | Manual (below) - Human insights |
| Certification for deployment | **Automated** - Unforgeable proof |
| Learning & training | Manual - Educational value |
| Competitive analysis | **Automated** - Consistent scoring |
| User test integration | Manual - Requires human testing |

### Location of System Files

```
.state/design-bible/certification-system/
├── auto-certifier.ts      # Main certification engine
└── verify-certification.ts # Report verification tool
```

---

## Overview

This document also contains the **manual certification test** for deeper analysis.
A page must score **90% or higher** to be approved for implementation.

**Test Duration:** 60-90 minutes per page
**Minimum Passing Score:** 90/100
**Evaluators Required:** 2 (Designer + Independent Reviewer)
**Retest Waiting Period:** 24 hours minimum

---

## Critical Failures (Automatic Disqualification)

Before scoring begins, check for these **instant failures**. If ANY are present, the page **cannot proceed to full testing** until fixed:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    🚫 CRITICAL FAILURES - INSTANT DQ                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ☐ No clear primary CTA visible                                         │
│  ☐ Page takes longer than 5 seconds to load on mobile                   │
│  ☐ Critical accessibility errors (WAVE shows red errors)                │
│  ☐ Broken links or images                                               │
│  ☐ Copy contains spelling/grammar errors                                │
│  ☐ Fake urgency or scarcity (countdown that resets, fake "only 3 left") │
│  ☐ Hidden pricing (requires signup to see price)                        │
│  ☐ No way to contact support                                            │
│  ☐ Automatic video/audio that can't be stopped                          │
│  ☐ Dark patterns (confirm shaming, hidden costs, trick questions)       │
│                                                                         │
│  If ANY box is checked → STOP. Fix before proceeding.                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Critical Failure Check Result:** ☐ PASS (proceed to test) ☐ FAIL (fix issues first)

---

## 🔒 Anti-Cheating Protocol (MANDATORY)

> **"A test that can be cheated is not a test."**

Every certification MUST include verifiable evidence. Claims without proof = automatic failure.

### Required Evidence Artifacts

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    📁 MANDATORY EVIDENCE FOLDER                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  For EVERY certification, create folder:                                │
│  /certifications/[page-name]/[date-YYYY-MM-DD]/                         │
│                                                                         │
│  Required files:                                                        │
│  ├── screenshots/                                                       │
│  │   ├── desktop-full-page.png                                          │
│  │   ├── mobile-full-page.png                                           │
│  │   ├── pagespeed-mobile.png (with URL visible)                        │
│  │   ├── pagespeed-desktop.png (with URL visible)                       │
│  │   ├── wave-accessibility.png (with URL visible)                      │
│  │   └── hemingway-results.png                                          │
│  │                                                                       │
│  ├── recordings/                                                        │
│  │   ├── user-test-1.mp4 (with participant face OR screen only)         │
│  │   ├── user-test-2.mp4                                                │
│  │   └── user-test-3.mp4                                                │
│  │                                                                       │
│  ├── raw-data/                                                          │
│  │   ├── 5-second-test-responses.json (timestamped)                     │
│  │   ├── user-test-notes.md                                             │
│  │   └── tool-exports/ (PageSpeed JSON, WAVE export, etc.)              │
│  │                                                                       │
│  └── certification-form-signed.pdf                                      │
│                                                                         │
│  ⚠️ Missing artifacts = Section score is ZERO                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Evidence Requirements by Section

| Section | Required Evidence | Without Evidence |
|---------|-------------------|------------------|
| A: First Impression | Video/audio recordings of 5-second tests with 3 real people | Score = 0 |
| B: Usability | Screen recordings of "Where would I click?" tests | Score = 0 |
| C: Copy | Hemingway App screenshot showing URL and scores | Score = 0 |
| D: Trust | Screenshots of testimonials showing full names/photos | -2 points |
| E: Conversion | Screenshot of CTA with measurement overlay | -1 point |
| F: Mobile | Screenshot from REAL device (not browser emulator) | Score = 0 |
| G: Technical | PageSpeed & WAVE screenshots with visible URL + timestamp | Score = 0 |
| H-K | Documented process artifacts | -50% section score |

### Verification Checksums

Every certification generates a unique verification code:

```
Certification ID Format: FINDO-[YYYY]-[MM]-[DD]-[PAGE-HASH]-[EVAL-INITIALS]

Example: FINDO-2026-01-25-HP7X3K-AB

Where:
- PAGE-HASH = First 6 chars of SHA-256(page URL + test date)
- EVAL-INITIALS = Primary evaluator initials
```

**To verify any certification:** Run `npm run cert:verify [CERTIFICATION-ID]`

### Third-Party Tool Requirements

These sections MUST use external tools (not self-assessment):

| Section | Required Tool | Why |
|---------|---------------|-----|
| C1: Readability | Hemingway App (hemingwayapp.com) | Objective grade measurement |
| G1: Performance | PageSpeed Insights (pagespeed.web.dev) | Google's official metrics |
| G2: Accessibility | WAVE (wave.webaim.org) OR axe DevTools | Automated error detection |

**Screenshots must show:**
1. The tool's URL/interface (proves which tool was used)
2. The page URL being tested
3. Date/timestamp (browser tab or tool's own timestamp)
4. Full results (no cropping to hide failures)

### User Test Integrity

For Sections A, B (user tests):

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    👥 USER TEST REQUIREMENTS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. REAL USERS ONLY                                                     │
│     - Cannot be team members                                            │
│     - Cannot be family of team members                                  │
│     - Should match target persona (or be noted as non-match)            │
│                                                                         │
│  2. RECORDED SESSIONS                                                   │
│     - Screen recording required (Loom, Zoom, etc.)                      │
│     - Audio of user's think-aloud required                              │
│     - Face optional but timestamped consent required                    │
│                                                                         │
│  3. DOCUMENTED PARTICIPANTS                                             │
│     For each tester, record:                                            │
│     - First name + last initial (e.g., "Sarah M.")                      │
│     - Age range (18-25, 26-35, etc.)                                    │
│     - Occupation/role                                                   │
│     - Tech comfort level (1-5)                                          │
│     - Relationship to company: "None" required                          │
│                                                                         │
│  4. BLIND TESTING                                                       │
│     - Testers should NOT know who designed the page                     │
│     - Testers should be encouraged to criticize                         │
│     - Script: "This was designed by another company"                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Evaluator Accountability

| Requirement | Details |
|-------------|---------|
| **Two independent evaluators** | Cannot be on same team or report to each other |
| **Score difference audit** | If scores differ by >10 points, third evaluator required |
| **Signature under penalty** | Evaluators sign statement that evidence is authentic |
| **Random audit risk** | 20% of certifications randomly audited by design lead |
| **False certification penalty** | 3 falsified certifications = removed from evaluator pool |

### Audit Trail

Every certification auto-logs:

```json
{
  "certification_id": "FINDO-2026-01-25-HP7X3K-AB",
  "page_url": "https://findo.com/pricing",
  "test_date": "2026-01-25T14:30:00Z",
  "evaluators": [
    {"name": "Alice Brown", "employee_id": "E001", "ip_hash": "a1b2c3..."},
    {"name": "Bob Smith", "employee_id": "E002", "ip_hash": "d4e5f6..."}
  ],
  "scores": {
    "evaluator_1": 92,
    "evaluator_2": 89,
    "final": 90.5
  },
  "evidence_files": [
    {"file": "pagespeed-mobile.png", "hash": "sha256:abc123...", "size": "245KB"},
    {"file": "user-test-1.mp4", "hash": "sha256:def456...", "size": "45MB"}
  ],
  "tool_results": {
    "hemingway_grade": 7,
    "pagespeed_mobile": 94,
    "pagespeed_desktop": 98,
    "wave_errors": 0,
    "wave_alerts": 3
  }
}
```

### Spot Check Protocol

Design Lead conducts random audits:

1. **Weekly:** Pick 1 random certified page
2. **Re-run:** PageSpeed, WAVE, Hemingway (results should match ±5%)
3. **Review:** Watch 1 random user test recording
4. **Verify:** Check participant wasn't a team member
5. **Document:** Log audit results, flag discrepancies

**Discrepancy penalties:**
- Minor (tool scores differ by >10%): Warning
- Major (user tests faked or missing): Certification revoked
- Repeated (3+ issues): Evaluator removed from pool

---

## 📋 How to Run This Test (Step-by-Step)

### Phase 1: Pre-Test Preparation (30 min before)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    📦 GATHER BEFORE YOU START                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. PAGE ACCESS                                                         │
│     □ Live URL of page to test (staging or production)                  │
│     □ Mobile device for real testing (not just browser emulator)        │
│     □ Desktop browser (Chrome, Firefox, Safari)                         │
│                                                                         │
│  2. TOOLS OPEN                                                          │
│     □ Hemingway App: hemingwayapp.com                                   │
│     □ PageSpeed Insights: pagespeed.web.dev                             │
│     □ WAVE: wave.webaim.org                                             │
│     □ Screenshot tool (Snagit, native OS, etc.)                         │
│     □ Screen recorder (Loom, Zoom, etc.)                                │
│                                                                         │
│  3. PEOPLE READY                                                        │
│     □ 3 test users scheduled (NOT team members)                         │
│     □ 2 evaluators assigned (Designer + Independent Reviewer)           │
│     □ Test participants briefed ("We're testing a competitor's page")   │
│                                                                         │
│  4. EVIDENCE FOLDER CREATED                                             │
│     □ /certifications/[page-name]/[date-YYYY-MM-DD]/                    │
│     □ Subfolders: screenshots/, recordings/, raw-data/                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 2: Run User Tests FIRST (45-60 min)

**Why first?** User test insights inform how you score the rest.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    👥 USER TESTING PROTOCOL                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FOR EACH USER (15-20 min per user, 3 users total):                     │
│                                                                         │
│  1. START RECORDING (screen + audio)                                    │
│                                                                         │
│  2. 5-SECOND TEST (Section A)                                           │
│     → Show page for exactly 5 seconds                                   │
│     → Hide it                                                           │
│     → Ask: "What was this page about?"                                  │
│     → Ask: "What do you remember seeing?"                               │
│     → Record their answers verbatim                                     │
│                                                                         │
│  3. FIRST IMPRESSIONS (Section A, B)                                    │
│     → Show page again                                                   │
│     → Ask: "What stands out to you first?"                              │
│     → Ask: "What would you click first?"                                │
│     → Ask: "Is this trustworthy? Why/why not?"                          │
│                                                                         │
│  4. TASK COMPLETION (Section B, E)                                      │
│     → Give task: "Find [X] / Sign up for [Y] / Learn about [Z]"         │
│     → Watch silently, don't help                                        │
│     → Note: Where did they hesitate? What confused them?                │
│                                                                         │
│  5. WRAP-UP QUESTIONS                                                   │
│     → "What would make this page better?"                               │
│     → "Would you trust this company with your money/data?"              │
│     → "What nearly stopped you from completing the task?"               │
│                                                                         │
│  6. STOP RECORDING, SAVE FILE                                           │
│     → Name: user-test-[1/2/3]-[first-name].mp4                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 3: Run Automated Tools (10 min)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    🔧 TOOL CHECKS                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. PAGESPEED INSIGHTS (pagespeed.web.dev)                              │
│     → Enter page URL                                                    │
│     → Run for MOBILE first (more important)                             │
│     → Screenshot full results (score visible, URL visible)              │
│     → Run for DESKTOP                                                   │
│     → Screenshot full results                                           │
│     → Export JSON (click "View JSON" → save to raw-data/)               │
│                                                                         │
│  2. WAVE ACCESSIBILITY (wave.webaim.org)                                │
│     → Enter page URL                                                    │
│     → Screenshot: Summary panel showing errors/alerts/features          │
│     → Screenshot: Details panel if errors exist                         │
│     → Note: Red = errors (critical), Yellow = alerts (review)           │
│                                                                         │
│  3. HEMINGWAY APP (hemingwayapp.com)                                    │
│     → Copy ALL visible text from the page                               │
│     → Paste into Hemingway                                              │
│     → Screenshot: Grade level + color-coded text                        │
│     → Record: Grade level, hard sentences count, adverbs count          │
│                                                                         │
│  4. REAL MOBILE TEST                                                    │
│     → Open page on ACTUAL phone (iPhone/Android)                        │
│     → Screenshot: Full page on real device                              │
│     → Test: Tap targets reachable? Text readable? CTA visible?          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 4: Score Each Section (30-45 min)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ✅ SCORING PROCESS                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. OPEN THIS TEST DOCUMENT                                             │
│     → Print it or open in separate tab                                  │
│                                                                         │
│  2. GO SECTION BY SECTION (A → K)                                       │
│     → For each criterion, mark: ☑ Yes / ☐ No / ⚠ Partial                │
│     → Calculate points using the scoring tables                         │
│     → Write notes for any failed items                                  │
│                                                                         │
│  3. USE YOUR EVIDENCE                                                   │
│     → Section A: Reference 5-second test recordings                     │
│     → Section B: Reference task completion recordings                   │
│     → Section C: Reference Hemingway screenshot                         │
│     → Section G: Reference PageSpeed/WAVE screenshots                   │
│                                                                         │
│  4. BOTH EVALUATORS SCORE INDEPENDENTLY                                 │
│     → Don't discuss until both are done                                 │
│     → Compare scores at the end                                         │
│                                                                         │
│  5. IF SCORES DIFFER >10 POINTS                                         │
│     → Discuss each section where you differed                           │
│     → Agree on final score or bring third evaluator                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Calculate Final Score

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    🧮 SCORE CALCULATION                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CORE SECTIONS (max 80 points)                                          │
│  ─────────────────────────────                                          │
│  Section A: First Impression      _____ / 15                            │
│  Section B: Usability             _____ / 15                            │
│  Section C: Copy & Content        _____ / 12                            │
│  Section D: Trust & Credibility   _____ / 12                            │
│  Section E: Conversion Elements   _____ / 12                            │
│  Section F: Mobile Experience     _____ / 8                             │
│  Section G: Technical             _____ / 6                             │
│                            SUBTOTAL: _____ / 80                         │
│                                                                         │
│  ADVANCED SECTIONS (max 20 points)                                      │
│  ─────────────────────────────────                                      │
│  Section H: Micro-Copy & Forms    _____ / 5                             │
│  Section I: Emotional Design      _____ / 5                             │
│  Section J: User Journey          _____ / 5                             │
│  Section K: UX Process            _____ / 5                             │
│                            SUBTOTAL: _____ / 20                         │
│                                                                         │
│  BONUS POINTS (max +10)           _____ / 10                            │
│                                                                         │
│  ════════════════════════════════════════                               │
│  FINAL SCORE:                     _____ / 100 (+bonus)                  │
│  ════════════════════════════════════════                               │
│                                                                         │
│  RESULT:                                                                │
│  □ 90-100+: ✅ CERTIFIED - Ready to ship                                │
│  □ 80-89:   ⚠️ CONDITIONAL - Fix issues, retest in 24h                  │
│  □ 70-79:   ❌ FAILED - Major revision required                         │
│  □ <70:     ❌ REJECTED - Back to design phase                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 6: Complete Certification

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    📝 FINALIZE CERTIFICATION                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. GENERATE CERTIFICATION ID                                           │
│     Format: FINDO-[YYYY]-[MM]-[DD]-[PAGE-HASH]-[EVAL-INITIALS]          │
│     Run: npm run cert:generate [page-url]                               │
│                                                                         │
│  2. COMPLETE EVIDENCE FOLDER                                            │
│     □ All screenshots saved with timestamps                             │
│     □ All recordings uploaded                                           │
│     □ Raw data exports saved                                            │
│     □ Signed certification form (PDF)                                   │
│                                                                         │
│  3. LOG TO CERTIFICATION HISTORY                                        │
│     → Add row to Appendix D table                                       │
│     → Include: Page, Version, Date, Score, Status, Evaluators           │
│                                                                         │
│  4. IF PASSED (90+)                                                     │
│     □ Notify team: Page approved for deployment                         │
│     □ Add certification badge to page metadata                          │
│     □ Schedule 30-day post-launch review                                │
│                                                                         │
│  5. IF FAILED (<90)                                                     │
│     □ Create action items for each failed criterion                     │
│     □ Assign owner to fix each issue                                    │
│     □ Schedule retest (minimum 24h after fixes)                         │
│     □ Reference "Fix Priority Guide" section below                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Quick Reference: Test Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| 1. Prep | 30 min | Gather tools, schedule users, create folders |
| 2. User Tests | 45-60 min | 3 users × 15-20 min each |
| 3. Tool Checks | 10 min | PageSpeed, WAVE, Hemingway, mobile |
| 4. Scoring | 30-45 min | Both evaluators score independently |
| 5. Calculate | 5 min | Add up scores, determine result |
| 6. Finalize | 10 min | Generate ID, save evidence, log result |
| **TOTAL** | **~2-2.5 hours** | First test takes longer; subsequent tests ~90 min |

---

## Scoring System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SCORING BREAKDOWN                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  CORE SECTIONS (80 points - weighted by importance)                     │
│  ──────────────────────────────────────────────────                     │
│  Section A: First Impression & Value Communication    (15 points)       │
│  Section B: Usability - Krug's Laws                   (15 points)       │
│  Section C: Copy, Content & Messaging                 (12 points)       │
│  Section D: Trust & Credibility                       (12 points)       │
│  Section E: Conversion Elements                       (12 points)       │
│  Section F: Mobile Experience                         (8 points)        │
│  Section G: Technical & Accessibility                 (6 points)        │
│                                                                         │
│  ADVANCED SECTIONS (20 points - for excellence)                         │
│  ──────────────────────────────────────────────────                     │
│  Section H: Micro-Copy & Form Intelligence            (5 points)        │
│  Section I: Emotional Design & Persuasion             (5 points)        │
│  Section J: User Journey & Context                    (5 points)        │
│  Section K: UX Process & Research Validation          (5 points)        │
│                                                                         │
│  TOTAL: 100 points                                                      │
│                                                                         │
│  BONUS POINTS (up to +10 for exceptional execution)                     │
│  ──────────────────────────────────────────────────                     │
│  Delight moments, innovation, exceeding expectations                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                         CERTIFICATION LEVELS                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  95-100+: ⭐ EXEMPLARY - Reference implementation, share as example     │
│  90-94:   ✅ CERTIFIED - Ready for implementation                       │
│  85-89:   ⚠️ CONDITIONAL - Fix critical issues, quick retest           │
│  75-84:   ❌ FAILED - Significant revision required, full retest        │
│  Below 75: ❌ REJECTED - Back to design phase, consult Design Bible     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Pre-Test Requirements

Before testing can begin, the following MUST be provided:

### Required Documentation

| Document | Status | Notes |
|----------|--------|-------|
| Target persona document | ☐ Provided ☐ Missing | |
| User journey map (showing where this page fits) | ☐ Provided ☐ Missing | |
| Page goals & success metrics | ☐ Provided ☐ Missing | |
| Competitive analysis (how competitors handle this) | ☐ Provided ☐ Missing | |
| Diagnosis data used to inform design | ☐ Provided ☐ Missing | |

**Missing documents = automatic -5 points from Section K**

---

## Test Form

### Page Information

| Field | Value |
|-------|-------|
| **Page Name:** | ___________________________________ |
| **Page Type:** | ☐ Landing ☐ Product ☐ Pricing ☐ Onboarding ☐ Feature ☐ Other: _____ |
| **Page URL/Location:** | ___________________________________ |
| **Page Purpose (1 sentence):** | ___________________________________ |
| **Target User Persona:** | ___________________________________ |
| **User Journey Stage:** | ☐ Awareness ☐ Consideration ☐ Decision ☐ Retention ☐ Advocacy |
| **Primary Goal (ONE):** | ___________________________________ |
| **Secondary Goal (ONE):** | ___________________________________ |
| **Success Metric:** | ___________________________________ |
| **Date Tested:** | ___________________________________ |
| **Evaluator 1 (Designer):** | ___________________________________ |
| **Evaluator 2 (Reviewer):** | ___________________________________ |
| **Test Version:** | ☐ Desktop ☐ Mobile ☐ Both |

---

# SECTION A: First Impression & Value Communication (15 Points)

> "You have 5 seconds to communicate value. Make them count."
> — Making Websites Win

---

## A1. The 5-Second Test (5 points)

**Instructions:** Show the page to 3 people for exactly 5 seconds each. They should NOT be familiar with your product.

### Test 1: What is this page about?

| Tester | Background | Response | Accuracy |
|--------|------------|----------|----------|
| Tester 1 | Job: _______ | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |
| Tester 2 | Job: _______ | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |
| Tester 3 | Job: _______ | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |

### Test 2: What can you do here? (What action can you take?)

| Tester | Response | Accuracy |
|--------|----------|----------|
| Tester 1 | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |
| Tester 2 | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |
| Tester 3 | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |

### Test 3: Who is this for?

| Tester | Response | Accuracy |
|--------|----------|----------|
| Tester 1 | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |
| Tester 2 | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |
| Tester 3 | _________________________ | ☐ Accurate ☐ Partial ☐ Wrong |

**Scoring:**
- 9 Accurate: **5 points** (perfect)
- 7-8 Accurate: **4 points**
- 5-6 Accurate: **3 points**
- 3-4 Accurate: **2 points**
- Less than 3: **0 points** (critical failure - redesign needed)

**Score: ___/5**

**If failed, diagnose:**
- [ ] Headline doesn't communicate value (too clever, too vague)
- [ ] Visual noise competing for attention
- [ ] Primary CTA not prominent enough
- [ ] Value proposition buried below fold
- [ ] Too much information above fold
- [ ] Imagery not supporting the message

---

## A2. Visual Hierarchy Analysis (5 points)

### The Squint Test
Blur the page (or squint/view from 3 meters) and answer:

| Criteria | Rating | Score |
|----------|--------|-------|
| Can you identify the single most important element? | ☐ Clearly ☐ Somewhat ☐ No | /1 |
| Is there ONE clear focal point (not competing elements)? | ☐ Yes ☐ Somewhat ☐ No | /1 |
| Do eyes naturally flow toward the CTA? | ☐ Yes ☐ Somewhat ☐ No | /1 |
| Is there visual breathing room (adequate whitespace)? | ☐ Yes ☐ Somewhat ☐ No | /1 |
| Are related items visually grouped together? | ☐ Yes ☐ Somewhat ☐ No | /1 |

**"Somewhat" = 0.5 points**

**Score: ___/5**

### Visual Hierarchy Checklist

| Element | Present? | Correctly Prioritized? |
|---------|----------|------------------------|
| Headline | ☐ | ☐ Largest text element |
| Subheadline | ☐ | ☐ Supports, doesn't compete |
| Primary CTA | ☐ | ☐ Most prominent color/position |
| Supporting content | ☐ | ☐ Clearly secondary |
| Social proof | ☐ | ☐ Near CTA but doesn't distract |

**If scored low, review:**
- Size hierarchy (larger = more important)
- Color contrast (primary color reserved for primary action)
- Spacing and grouping (proximity principle)
- Visual weight distribution (F-pattern or Z-pattern)
- Eye tracking simulation tools

---

## A3. Above-the-Fold Impact (5 points)

**Without scrolling**, evaluate what the user sees:

### Essential Elements Check

| Element | Present Above Fold? | Quality Assessment | Score |
|---------|---------------------|-------------------|-------|
| Clear headline with benefit | ☐ Yes ☐ No | ☐ Great ☐ OK ☐ Weak | /1 |
| Primary CTA button | ☐ Yes ☐ No | ☐ Great ☐ OK ☐ Weak | /1 |
| Supporting visual (hero image/video) | ☐ Yes ☐ No | ☐ Relevant ☐ Generic ☐ N/A | /1 |
| Trust signal (logos/reviews/proof) | ☐ Yes ☐ No | ☐ Strong ☐ Weak ☐ N/A | /1 |
| Scroll indicator or curiosity trigger | ☐ Yes ☐ No | ☐ Natural ☐ Forced ☐ N/A | /1 |

**Quality Assessment Notes:**
- "Great" = Full point
- "OK" = 0.5 point
- "Weak/Generic" = 0 points

**Score: ___/5**

### Above-the-Fold Don'ts (Check = Bad)

| Anti-Pattern | Present? |
|--------------|----------|
| Giant logo taking too much space | ☐ |
| Slider/carousel with multiple messages | ☐ |
| Video that auto-plays with sound | ☐ |
| More than 2 competing CTAs | ☐ |
| Generic stock photo | ☐ |

**Each checked item: -0.5 from above score**

---

## Section A Total: ___/15

**Section A Interpretation:**
- 13-15: Excellent first impression
- 10-12: Good, minor improvements needed
- 7-9: Needs significant work
- Below 7: Critical issues - redesign above fold

---

# SECTION B: Usability - Krug's Laws (15 Points)

> "Don't make me think."
> — Steve Krug, Don't Make Me Think

---

## B1. Self-Evident Design Test (4 points)

### The "Moron in a Hurry" Test
Would a distracted, impatient user understand this page instantly?

| Element | Self-Evident? | Notes |
|---------|---------------|-------|
| What is clickable is obvious | ☐ 0 ☐ 0.5 ☐ 1 | |
| Buttons look like buttons | ☐ 0 ☐ 0.5 ☐ 1 | |
| Links look like links (underlined or clearly different) | ☐ 0 ☐ 0.5 ☐ 1 | |
| Form fields have visible labels (not just placeholders) | ☐ 0 ☐ 0.5 ☐ 1 | |

**Scoring:**
- 0 = Requires thinking
- 0.5 = Somewhat obvious
- 1 = Completely obvious

**Score: ___/4**

### Failure Indicators (Check = Problem)

| Issue | Found? | Severity |
|-------|--------|----------|
| Icons without labels | ☐ | ☐ Critical ☐ Major ☐ Minor |
| Non-standard UI patterns | ☐ | ☐ Critical ☐ Major ☐ Minor |
| Hover-dependent important information | ☐ | ☐ Critical ☐ Major ☐ Minor |
| Placeholder text as only label | ☐ | ☐ Critical ☐ Major ☐ Minor |
| Mystery meat navigation (images only) | ☐ | ☐ Critical ☐ Major ☐ Minor |

---

## B2. The Trunk Test (4 points)

**Scenario:** Drop someone on this page with NO context (arrived from random link). Can they answer:

| Question | Answer Clear? | How Long to Find? | Score |
|----------|---------------|-------------------|-------|
| 1. What site is this? (Logo visible) | ☐ Yes ☐ No | ☐ <1s ☐ 1-3s ☐ >3s | /1 |
| 2. What page am I on? (Page title clear) | ☐ Yes ☐ No | ☐ <1s ☐ 1-3s ☐ >3s | /1 |
| 3. What are major sections? (Nav visible) | ☐ Yes ☐ No | ☐ <1s ☐ 1-3s ☐ >3s | /1 |
| 4. How can I search or get help? | ☐ Yes ☐ No | ☐ <1s ☐ 1-3s ☐ >3s | /1 |

**Scoring:** Yes AND <3s = 1 point. Yes AND >3s = 0.5 points. No = 0 points.

**Score: ___/4**

---

## B3. Scanning Optimization (4 points)

> "Users scan, they don't read. Design for scanning."

### F-Pattern Compliance

| Criteria | Implemented? | Score |
|----------|--------------|-------|
| Most important content top-left (for LTR) | ☐ Yes ☐ No | /0.5 |
| Headlines form scannable left edge | ☐ Yes ☐ No | /0.5 |
| Key information not buried in paragraphs | ☐ Yes ☐ No | /1 |
| Visual anchors at regular intervals | ☐ Yes ☐ No | /1 |
| Content chunked into digestible sections | ☐ Yes ☐ No | /1 |

**Score: ___/4**

### Scanning Checklist

| Element | Status |
|---------|--------|
| Short paragraphs (max 3-4 lines) | ☐ Yes ☐ No |
| Bullet/numbered lists for 3+ items | ☐ Yes ☐ No |
| Key terms bolded/highlighted | ☐ Yes ☐ No |
| Descriptive headings (not clever) | ☐ Yes ☐ No |
| White space between sections | ☐ Yes ☐ No |

---

## B4. Mindless Navigation (3 points)

> "Every click should be a mindless, unambiguous choice."

### Click Audit
Test each navigation point. Time yourself - does it require thinking?

| Action Point | Mindless (<1s decision)? | If No, Why? |
|--------------|-------------------------|-------------|
| Primary CTA | ☐ Yes ☐ No | _____________ |
| Main navigation items | ☐ Yes ☐ No | _____________ |
| Secondary actions | ☐ Yes ☐ No | _____________ |
| Links in content | ☐ Yes ☐ No | _____________ |
| Form submission | ☐ Yes ☐ No | _____________ |
| Back/Cancel/Exit | ☐ Yes ☐ No | _____________ |

**Scoring:**
- All mindless: **3 points**
- 1 requires thought: **2 points**
- 2 require thought: **1 point**
- 3+ require thought: **0 points**

**Score: ___/3**

### "Where would I click?" Test

Ask 3 testers: "Where would you click to [PRIMARY GOAL]?"

| Tester | Clicked Correct Element? | Time to Decide |
|--------|-------------------------|----------------|
| Tester 1 | ☐ Yes ☐ No | ☐ <2s ☐ 2-5s ☐ >5s |
| Tester 2 | ☐ Yes ☐ No | ☐ <2s ☐ 2-5s ☐ >5s |
| Tester 3 | ☐ Yes ☐ No | ☐ <2s ☐ 2-5s ☐ >5s |

**All correct in <2s = Bonus +1 to section total**

---

## Section B Total: ___/15

**Section B Interpretation:**
- 13-15: Excellent usability
- 10-12: Good, minor friction points
- 7-9: Significant usability issues
- Below 7: Major usability problems

---

# SECTION C: Copy, Content & Messaging (12 Points)

> "If visitors can't understand your writing, they can't buy."
> — Making Websites Win

---

## C1. Readability Test (4 points)

### Hemingway App Analysis
Run ALL visible copy through hemingwayapp.com

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Grade Level | ≤ 9 | _____ | ☐ Pass ☐ Fail |
| Hard sentences | ≤ 10% | _____% | ☐ Pass ☐ Fail |
| Very hard sentences | 0% | _____% | ☐ Pass ☐ Fail |
| Adverbs | ≤ 5 total | _____ | ☐ Pass ☐ Fail |
| Passive voice | ≤ 5% | _____% | ☐ Pass ☐ Fail |
| Average sentence length | ≤ 15 words | _____ | ☐ Pass ☐ Fail |

**Scoring:**
- All 6 pass: **4 points**
- 5 pass: **3 points**
- 4 pass: **2 points**
- 3 pass: **1 point**
- Less than 3: **0 points**

**Score: ___/4**

### Copy Samples to Evaluate

**Headline:** ________________________________________
- ☐ Under 10 words ☐ Active voice ☐ Benefit-focused

**Subheadline:** ________________________________________
- ☐ Supports headline ☐ Adds specific detail ☐ Under 25 words

**First body paragraph:** ________________________________________
- ☐ Opens with benefit ☐ Under 50 words ☐ No jargon

---

## C2. Benefit Hierarchy Test (4 points)

### The "So What?" Ladder
For each main claim, apply the "So what?" test until you reach an emotional benefit.

**Claim 1:** _______________________________________

| Level | "So What?" Response | Type |
|-------|---------------------|------|
| Feature | _________________ | ☐ This is the claim |
| Benefit | So you can... ______________ | ☐ Functional benefit |
| Emotional | Which means you'll feel... ______________ | ☐ Emotional benefit |

**Does the page communicate at the emotional level?** ☐ Yes ☐ No

**Claim 2:** _______________________________________

| Level | "So What?" Response | Type |
|-------|---------------------|------|
| Feature | _________________ | ☐ This is the claim |
| Benefit | So you can... ______________ | ☐ Functional benefit |
| Emotional | Which means you'll feel... ______________ | ☐ Emotional benefit |

**Does the page communicate at the emotional level?** ☐ Yes ☐ No

**Claim 3:** _______________________________________

| Level | "So What?" Response | Type |
|-------|---------------------|------|
| Feature | _________________ | ☐ This is the claim |
| Benefit | So you can... ______________ | ☐ Functional benefit |
| Emotional | Which means you'll feel... ______________ | ☐ Emotional benefit |

**Does the page communicate at the emotional level?** ☐ Yes ☐ No

**Scoring:**
- All 3 reach emotional: **4 points**
- 2 reach emotional: **3 points**
- 1 reaches emotional: **2 points**
- Only functional benefits: **1 point**
- Only features: **0 points**

**Score: ___/4**

---

## C3. Copy Quality Audit (4 points)

### Word-Level Check

| Criteria | Status | Score |
|----------|--------|-------|
| No jargon without explanation | ☐ Yes ☐ No | /0.5 |
| No "happy talk" (empty welcome text) | ☐ Yes ☐ No | /0.5 |
| Action verbs (not nominalizations) | ☐ Yes ☐ No | /0.5 |
| Specific numbers where possible | ☐ Yes ☐ No | /0.5 |
| Customer's language used (from research) | ☐ Yes ☐ No | /0.5 |
| No weasel words ("up to," "as much as") | ☐ Yes ☐ No | /0.5 |
| Consistent terminology | ☐ Yes ☐ No | /0.5 |
| No obvious AI-generated filler text | ☐ Yes ☐ No | /0.5 |

**Score: ___/4**

### The "Mom Test"
Would your non-tech-savvy relative understand:

| Question | Answer |
|----------|--------|
| What you're selling? | ☐ Clearly ☐ Mostly ☐ No |
| Why it's valuable? | ☐ Clearly ☐ Mostly ☐ No |
| What to do next? | ☐ Clearly ☐ Mostly ☐ No |

**All "Clearly" = +0.5 bonus**

---

## Section C Total: ___/12

---

# SECTION D: Trust & Credibility (12 Points)

> "If visitors are wary, they won't convert."
> — Making Websites Win

---

## D1. Social Proof Audit (4 points)

### Testimonial Quality Check

| Testimonial | Full Name | Photo | Company/Role | Specific Result | Score |
|-------------|-----------|-------|--------------|-----------------|-------|
| 1 | ☐ | ☐ | ☐ | ☐ | /1 |
| 2 | ☐ | ☐ | ☐ | ☐ | /1 |
| 3 | ☐ | ☐ | ☐ | ☐ | /1 |

**Each testimonial with all 4 elements = 1 point (max 3)**

**Additional Social Proof:**

| Element | Present? | Quality | Score |
|---------|----------|---------|-------|
| Customer count ("10,000+ users") | ☐ Yes ☐ No | ☐ Verifiable ☐ Vague | /0.5 |
| Recognizable client logos | ☐ Yes ☐ No | ☐ Relevant ☐ Padding | /0.5 |

**Score: ___/4**

### Social Proof Quality Scale

| Quality Level | Description |
|---------------|-------------|
| ⭐⭐⭐⭐⭐ | Video testimonial with specific metrics |
| ⭐⭐⭐⭐ | Full name, photo, role, company, specific result |
| ⭐⭐⭐ | Full name, role, specific result |
| ⭐⭐ | Full name, generic praise |
| ⭐ | First name only, generic praise |
| ❌ | Obviously fake ("John D. says it's great!") |

---

## D2. Risk Reversal & Guarantees (4 points)

| Element | Present? | Prominent? | Score |
|---------|----------|------------|-------|
| Money-back guarantee | ☐ Yes ☐ No | ☐ Yes ☐ No | /1 |
| Guarantee duration specified (30+ days) | ☐ Yes ☐ No | N/A | /0.5 |
| "No questions asked" or similar language | ☐ Yes ☐ No | N/A | /0.5 |
| Guarantee visible NEAR the CTA | ☐ Yes ☐ No | N/A | /1 |
| Free trial option (if applicable) | ☐ Yes ☐ No ☐ N/A | ☐ Yes ☐ No | /0.5 |
| Cancel anytime mentioned | ☐ Yes ☐ No ☐ N/A | N/A | /0.5 |

**Score: ___/4**

### Guarantee Naming (Bonus)
Does the guarantee have a memorable name?
- ☐ Yes (e.g., "The Peace of Mind Promise") → +0.5 bonus
- ☐ No (just "30-day money-back guarantee")

---

## D3. Transparency & Credibility Signals (4 points)

| Element | Present? | Score |
|---------|----------|-------|
| Contact information visible (email or phone) | ☐ Yes ☐ No | /0.5 |
| Phone number visible (not just form) | ☐ Yes ☐ No | /0.5 |
| Live chat option | ☐ Yes ☐ No | /0.5 |
| Real team photos (not stock) | ☐ Yes ☐ No | /0.5 |
| Physical address (if applicable) | ☐ Yes ☐ No ☐ N/A | /0.5 |
| Security badges (SSL, payment security) | ☐ Yes ☐ No | /0.5 |
| Privacy policy easily findable | ☐ Yes ☐ No | /0.5 |
| Clear refund/return policy | ☐ Yes ☐ No | /0.5 |

**Score: ___/4**

### Authority Signals (Bonus Check)

| Signal | Present? |
|--------|----------|
| Industry awards or certifications | ☐ Yes ☐ No |
| "As seen in" media mentions | ☐ Yes ☐ No |
| Expert endorsements | ☐ Yes ☐ No |
| Academic or research backing | ☐ Yes ☐ No |
| Years in business | ☐ Yes ☐ No |

**3+ present = +0.5 bonus**

---

## Section D Total: ___/12

---

# SECTION E: Conversion Elements (12 Points)

> "Like water chutes - once they enter, they slide through."
> — Making Websites Win

---

## E1. CTA Analysis (4 points)

### Primary CTA Audit

**CTA Text:** [ _________________________________ ]
**CTA Color:** _____________ **Button Size:** _____________

| Criteria | Rating | Score |
|----------|--------|-------|
| Action-oriented verb ("Get," "Start," not "Submit") | ☐ Yes ☐ No | /0.5 |
| Communicates value ("Start Free Trial" vs "Sign Up") | ☐ Yes ☐ No | /0.5 |
| First-person when appropriate ("Start MY trial") | ☐ Yes ☐ No | /0.5 |
| Stands out visually (contrast, size, whitespace) | ☐ Yes ☐ No | /0.5 |
| Only ONE primary CTA per viewport | ☐ Yes ☐ No | /0.5 |
| Repeated after long content sections | ☐ Yes ☐ No | /0.5 |
| Supporting text below CTA (what happens next) | ☐ Yes ☐ No | /0.5 |
| No competing CTAs of similar visual weight | ☐ Yes ☐ No | /0.5 |

**Score: ___/4**

### CTA Quality Scale

| Level | Example | Points |
|-------|---------|--------|
| ⭐⭐⭐⭐⭐ | "Start My Free 14-Day Trial → No credit card required" | 4 |
| ⭐⭐⭐⭐ | "Start Free Trial" with supporting text | 3 |
| ⭐⭐⭐ | "Get Started" with clear context | 2 |
| ⭐⭐ | "Sign Up" | 1 |
| ⭐ | "Submit" or "Click Here" | 0 |

---

## E2. Friction Audit (4 points)

**Start with 4 points. Deduct for each friction point found:**

| Friction Point | Present? | Deduction |
|----------------|----------|-----------|
| More than 3 form fields visible initially | ☐ Yes | -0.5 |
| Required fields that shouldn't be required | ☐ Yes | -0.5 |
| Credit card required for free trial | ☐ Yes | -1 |
| Account creation required before value shown | ☐ Yes | -0.5 |
| Unclear or unhelpful error messages | ☐ Yes | -0.5 |
| No progress indicator in multi-step process | ☐ Yes | -0.5 |
| Full navigation visible in checkout/funnel | ☐ Yes | -0.5 |
| No guest checkout option (e-commerce) | ☐ Yes | -0.5 |
| CAPTCHA required | ☐ Yes | -0.5 |
| Form requires scrolling to complete | ☐ Yes | -0.5 |

**Starting Score: 4 - _____ = ___/4**

### Conversion Path Analysis

Map the user's path from landing to conversion:

| Step | Action Required | Friction Level |
|------|-----------------|----------------|
| 1 | _________________ | ☐ Low ☐ Med ☐ High |
| 2 | _________________ | ☐ Low ☐ Med ☐ High |
| 3 | _________________ | ☐ Low ☐ Med ☐ High |
| 4 | _________________ | ☐ Low ☐ Med ☐ High |
| 5 | _________________ | ☐ Low ☐ Med ☐ High |

**Any "High" friction = must be justified and addressed**

---

## E3. Clarity & Urgency (4 points)

### Clarity Check

| Question | Answer Immediately Clear? | Score |
|----------|---------------------------|-------|
| What does the user GET? | ☐ Yes ☐ No | /1 |
| What does the user PAY? | ☐ Yes ☐ No | /1 |
| What happens NEXT after clicking? | ☐ Yes ☐ No | /1 |
| How long until they see value? | ☐ Yes ☐ No | /0.5 |

### Urgency Check (if urgency is used)

| Urgency Element | Genuine? | Verifiable? |
|-----------------|----------|-------------|
| _________________ | ☐ Yes ☐ No | ☐ Yes ☐ No |

**Fake urgency = automatic -2 points**

| Urgency Type | Status | Score |
|--------------|--------|-------|
| Time-limited offer with real deadline | ☐ Present ☐ N/A | /0.5 if genuine |
| Limited availability with real count | ☐ Present ☐ N/A | /0 if fake |

**Score: ___/4**

---

## Section E Total: ___/12

---

# SECTION F: Mobile Experience (8 Points)

> "Mobile is not a smaller desktop. It's a different context entirely."
> — Designed for Use

---

## F1. Mobile-First Assessment (4 points)

**Test on actual mobile device (not just browser resize)**

Device used: _____________ Screen size: _____________

| Criteria | Status | Score |
|----------|--------|-------|
| All content readable without zooming | ☐ Yes ☐ No | /0.5 |
| Tap targets minimum 44x44 pixels | ☐ Yes ☐ No | /0.5 |
| No horizontal scrolling required | ☐ Yes ☐ No | /0.5 |
| Primary CTA reachable with thumb (bottom half) | ☐ Yes ☐ No | /0.5 |
| Forms use appropriate mobile keyboards | ☐ Yes ☐ No | /0.5 |
| No hover-dependent interactions | ☐ Yes ☐ No | /0.5 |
| Images optimized for mobile (not desktop scaled down) | ☐ Yes ☐ No | /0.5 |
| Navigation works with one hand | ☐ Yes ☐ No | /0.5 |

**Score: ___/4**

---

## F2. Mobile-Specific UX (4 points)

### Touch & Gesture Support

| Feature | Implemented? | Score |
|---------|--------------|-------|
| Swipe gestures where appropriate | ☐ Yes ☐ No ☐ N/A | /0.5 |
| Touch feedback on interactive elements | ☐ Yes ☐ No | /0.5 |
| Pull-to-refresh where expected | ☐ Yes ☐ No ☐ N/A | /0.5 |
| Pinch-to-zoom on images (if needed) | ☐ Yes ☐ No ☐ N/A | /0.5 |

### Mobile Context Optimization

| Feature | Implemented? | Score |
|---------|--------------|-------|
| Phone numbers are tap-to-call | ☐ Yes ☐ No ☐ N/A | /0.5 |
| Addresses link to maps | ☐ Yes ☐ No ☐ N/A | /0.5 |
| Forms leverage autofill | ☐ Yes ☐ No ☐ N/A | /0.5 |
| Mobile-specific CTAs (shorter text) | ☐ Yes ☐ No | /0.5 |

**Score: ___/4**

### Mobile Anti-Patterns (Check = Bad)

| Issue | Present? |
|-------|----------|
| Pop-ups that are hard to close on mobile | ☐ |
| Sticky elements covering too much screen | ☐ |
| Tiny close buttons on modals | ☐ |
| Fixed headers eating too much viewport | ☐ |
| Auto-playing videos on mobile data | ☐ |

**Each checked = -0.5 points**

---

## Section F Total: ___/8

---

# SECTION G: Technical & Accessibility (6 Points)

> "A site that doesn't work is a site that doesn't convert."

---

## G1. Performance (3 points)

### Core Web Vitals (Google PageSpeed Insights)

| Metric | Target | Mobile | Desktop | Status |
|--------|--------|--------|---------|--------|
| Performance Score | ≥ 90 | _____ | _____ | ☐ Pass ☐ Fail |
| LCP (Largest Contentful Paint) | ≤ 2.5s | _____s | _____s | ☐ Pass ☐ Fail |
| FID/INP (Interaction to Next Paint) | ≤ 200ms | _____ms | _____ms | ☐ Pass ☐ Fail |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | _____ | _____ | ☐ Pass ☐ Fail |

**Scoring:**
- All pass on mobile: **3 points**
- All pass on desktop, 1-2 fail mobile: **2 points**
- Any red metrics: **1 point**
- Multiple reds: **0 points**

**Score: ___/3**

---

## G2. Accessibility (3 points)

### WAVE Tool Analysis (wave.webaim.org)

| Metric | Count | Max Allowed | Status |
|--------|-------|-------------|--------|
| Errors | _____ | 0 | ☐ Pass ☐ Fail |
| Contrast Errors | _____ | 0 | ☐ Pass ☐ Fail |
| Alerts | _____ | 5 | ☐ Pass ☐ Fail |

### Manual Accessibility Check

| Criteria | Status | Score |
|----------|--------|-------|
| All images have meaningful alt text | ☐ Yes ☐ No | /0.5 |
| Keyboard navigation works (Tab through page) | ☐ Yes ☐ No | /0.5 |
| Focus indicators visible | ☐ Yes ☐ No | /0.5 |
| Skip-to-content link present | ☐ Yes ☐ No | /0.25 |
| Proper heading hierarchy (H1→H2→H3) | ☐ Yes ☐ No | /0.25 |
| Color is not only indicator | ☐ Yes ☐ No | /0.5 |
| Form labels properly associated | ☐ Yes ☐ No | /0.5 |

**Score: ___/3**

---

## Section G Total: ___/6

---

# SECTION H: Micro-Copy & Form Intelligence (5 Points)

> "Micro-copy is macro-important."

---

## H1. Micro-Copy Quality (2.5 points)

### Button & Link Text

| Element | Text | Clear & Actionable? | Score |
|---------|------|---------------------|-------|
| Primary CTA | _____________ | ☐ Yes ☐ No | /0.5 |
| Secondary CTA | _____________ | ☐ Yes ☐ No | /0.25 |
| Nav items | _____________ | ☐ Yes ☐ No | /0.25 |
| Help links | _____________ | ☐ Yes ☐ No | /0.25 |

### Error Messages

| Error Type | Message | Helpful? (explains AND offers solution) |
|------------|---------|----------------------------------------|
| Empty required field | _____________ | ☐ Yes ☐ No |
| Invalid format | _____________ | ☐ Yes ☐ No |
| Server error | _____________ | ☐ Yes ☐ No |

**All helpful = 0.75 points, Some = 0.25 points, None = 0 points**

### Success Messages

| Action | Success Message | Reassuring? |
|--------|-----------------|-------------|
| Form submit | _____________ | ☐ Yes ☐ No |
| Sign up | _____________ | ☐ Yes ☐ No |

**Both reassuring = 0.5 points**

**Score: ___/2.5**

---

## H2. Form Intelligence (2.5 points)

| Feature | Implemented? | Score |
|---------|--------------|-------|
| Labels above fields (not just placeholders) | ☐ Yes ☐ No | /0.5 |
| Inline validation (real-time feedback) | ☐ Yes ☐ No | /0.5 |
| Smart defaults pre-filled | ☐ Yes ☐ No | /0.25 |
| Format hints shown (e.g., "MM/DD/YYYY") | ☐ Yes ☐ No | /0.25 |
| Password requirements visible BEFORE error | ☐ Yes ☐ No | /0.25 |
| Optional fields marked (not required marked) | ☐ Yes ☐ No | /0.25 |
| Autofocus on first field | ☐ Yes ☐ No | /0.25 |
| Tab order logical | ☐ Yes ☐ No | /0.25 |

**Score: ___/2.5**

---

## Section H Total: ___/5

---

# SECTION I: Emotional Design & Persuasion (5 Points)

> "People don't buy products. They buy better versions of themselves."

---

## I1. Emotional Triggers (2.5 points)

### Emotional Design Check

| Emotion | How It's Triggered | Present? | Score |
|---------|-------------------|----------|-------|
| Trust | _________________ | ☐ Yes ☐ No | /0.5 |
| Confidence | _________________ | ☐ Yes ☐ No | /0.5 |
| Relief (from pain point) | _________________ | ☐ Yes ☐ No | /0.5 |
| Excitement/desire | _________________ | ☐ Yes ☐ No | /0.5 |
| Belonging/social proof | _________________ | ☐ Yes ☐ No | /0.5 |

**Score: ___/2.5**

---

## I2. Persuasion Principles (2.5 points)

### Cialdini's Principles Applied

| Principle | How Applied | Score |
|-----------|-------------|-------|
| **Reciprocity** (give value first) | _________________ | /0.5 if present |
| **Scarcity** (genuine, not fake) | _________________ | /0.5 if genuine |
| **Authority** (expertise shown) | _________________ | /0.5 if present |
| **Consistency** (micro-commitments) | _________________ | /0.5 if present |
| **Social Proof** (others doing it) | _________________ | Already scored in D1 |

**Score: ___/2.5** (max 2.5 from above, Social Proof scored separately)

### Persuasion Don'ts

| Dark Pattern | Present? | Penalty |
|--------------|----------|---------|
| Confirm shaming | ☐ | -1 point |
| Hidden costs revealed late | ☐ | -1 point |
| Trick questions | ☐ | -1 point |
| Forced continuity without warning | ☐ | -1 point |

---

## Section I Total: ___/5

---

# SECTION J: User Journey & Context (5 Points)

> "Every page is part of a larger story."

---

## J1. Journey Fit (2.5 points)

| Question | Answer |
|----------|--------|
| What page/action comes BEFORE this? | _________________ |
| What page/action comes AFTER this? | _________________ |
| What user state are they in when arriving? | _________________ |

### Journey Continuity Check

| Criteria | Score |
|----------|-------|
| Messaging consistent with previous touchpoint | ☐ Yes (0.5) ☐ No (0) |
| Logical next step is clear | ☐ Yes (0.5) ☐ No (0) |
| No jarring context switches | ☐ Yes (0.5) ☐ No (0) |
| Exit paths make sense for journey stage | ☐ Yes (0.5) ☐ No (0) |
| Page addresses stage-appropriate concerns | ☐ Yes (0.5) ☐ No (0) |

**Score: ___/2.5**

---

## J2. Context Awareness (2.5 points)

### Entry Point Analysis

| Traffic Source | Optimized For It? |
|----------------|-------------------|
| Direct | ☐ Yes ☐ No ☐ N/A |
| Search (SEO) | ☐ Yes ☐ No ☐ N/A |
| Paid ads | ☐ Yes ☐ No ☐ N/A |
| Email campaign | ☐ Yes ☐ No ☐ N/A |
| Social media | ☐ Yes ☐ No ☐ N/A |
| Referral | ☐ Yes ☐ No ☐ N/A |

### Context Check

| Criteria | Score |
|----------|-------|
| Works well for first-time visitors | ☐ Yes (0.5) ☐ No (0) |
| Works well for returning visitors | ☐ Yes (0.5) ☐ No (0) |
| Handles different user intents | ☐ Yes (0.5) ☐ No (0) |
| Provides relevant exit points if not ready | ☐ Yes (0.5) ☐ No (0) |
| Personalization used (if applicable) | ☐ Yes (0.5) ☐ No (0) ☐ N/A |

**Score: ___/2.5**

---

## Section J Total: ___/5

---

# SECTION K: UX Process & Research Validation (5 Points)

> "Design without research is guessing."
> — Designed for Use

---

## K1. Research Foundation (2.5 points)

| Question | Evidence Provided? | Score |
|----------|-------------------|-------|
| Which specific persona is this page for? | ☐ Yes ☐ No | /0.5 |
| What user research informed this design? | ☐ Yes ☐ No | /0.5 |
| What diagnosis technique was used? | ☐ Yes ☐ No | /0.5 |
| What hypothesis does this design test? | ☐ Yes ☐ No | /0.5 |
| What competitive analysis was done? | ☐ Yes ☐ No | /0.5 |

**Score: ___/2.5**

**Missing pre-test documentation: -5 points here**

---

## K2. Testing Validation (2.5 points)

| Question | Evidence Provided? | Score |
|----------|-------------------|-------|
| User tested with 3+ people? | ☐ Yes ☐ No | /1 |
| Major issues from testing were addressed? | ☐ Yes ☐ No ☐ N/A | /0.5 |
| Wireframes tested before high-fidelity? | ☐ Yes ☐ No | /0.5 |
| Plan exists for post-launch testing/iteration? | ☐ Yes ☐ No | /0.5 |

**Score: ___/2.5**

---

## Section K Total: ___/5

---

# FINAL SCORING

## Score Summary

| Section | Max Points | Your Score | Weight |
|---------|------------|------------|--------|
| A: First Impression | 15 | _____ | Core |
| B: Usability | 15 | _____ | Core |
| C: Copy & Content | 12 | _____ | Core |
| D: Trust & Credibility | 12 | _____ | Core |
| E: Conversion Elements | 12 | _____ | Core |
| F: Mobile Experience | 8 | _____ | Core |
| G: Technical & Accessibility | 6 | _____ | Core |
| **Core Subtotal** | **80** | **_____** | |
| H: Micro-Copy & Forms | 5 | _____ | Advanced |
| I: Emotional Design | 5 | _____ | Advanced |
| J: User Journey | 5 | _____ | Advanced |
| K: UX Process | 5 | _____ | Advanced |
| **Advanced Subtotal** | **20** | **_____** | |
| **TOTAL** | **100** | **_____** | |

---

## Bonus Points (Max +10)

| Bonus Criteria | Points | Awarded? |
|----------------|--------|----------|
| Exceptional visual design (beyond functional) | +2 | ☐ |
| Delightful micro-interactions | +1 | ☐ |
| Outstanding copy that evokes emotion | +2 | ☐ |
| Innovative solution to common problem | +2 | ☐ |
| Exceptional mobile experience | +1 | ☐ |
| Goes above and beyond in accessibility | +1 | ☐ |
| Strong A/B test hypothesis documented | +1 | ☐ |

**Bonus Total: +___**

---

## Final Score

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FINAL CALCULATION                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Core Sections (A-G):       _____ / 80                                  │
│  Advanced Sections (H-K):   _____ / 20                                  │
│  Bonus Points:              + _____                                      │
│  ─────────────────────────────────────────                              │
│  FINAL SCORE:               _____ / 100 (+bonus)                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Certification Result

```
☐ 95-100+: ⭐ EXEMPLARY
   Outstanding work. This page should be used as a reference.
   Share with team as example of best practices.

☐ 90-94: ✅ CERTIFIED
   Page approved for implementation.
   Meets FINDO Design Bible standards.

☐ 85-89: ⚠️ CONDITIONAL
   Fix issues marked as "Critical" below.
   Quick retest of affected sections only.
   Deadline for fixes: ____________

☐ 75-84: ❌ FAILED
   Significant revision required.
   Full retest after revision.
   Consultation with senior designer required.

☐ Below 75: ❌ REJECTED
   Return to design phase.
   Review Design Bible before redesigning.
   Must present revised approach before retest.
```

---

## Section-by-Section Analysis

### Sections Passed (Score ≥ 80% of section max)

| Section | Score | Max | % | Status |
|---------|-------|-----|---|--------|
| A | | 15 | | ☐ Pass ☐ Fail |
| B | | 15 | | ☐ Pass ☐ Fail |
| C | | 12 | | ☐ Pass ☐ Fail |
| D | | 12 | | ☐ Pass ☐ Fail |
| E | | 12 | | ☐ Pass ☐ Fail |
| F | | 8 | | ☐ Pass ☐ Fail |
| G | | 6 | | ☐ Pass ☐ Fail |
| H | | 5 | | ☐ Pass ☐ Fail |
| I | | 5 | | ☐ Pass ☐ Fail |
| J | | 5 | | ☐ Pass ☐ Fail |
| K | | 5 | | ☐ Pass ☐ Fail |

**Any section below 60% = Critical Issue (must address before certification)**

---

## Required Fixes

### Critical Issues (Must fix before any retest)

| # | Issue | Section | Specific Problem | Recommended Fix | Owner | Deadline |
|---|-------|---------|------------------|-----------------|-------|----------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

### Major Issues (Should fix, will be retested)

| # | Issue | Section | Impact Level | Recommended Fix |
|---|-------|---------|--------------|-----------------|
| 1 | | | ☐ High ☐ Med | |
| 2 | | | ☐ High ☐ Med | |
| 3 | | | ☐ High ☐ Med | |

### Minor Issues (Nice to have, won't block certification)

| # | Issue | Section | Improvement |
|---|-------|---------|-------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## What Works Well

Document strengths to replicate in future work:

### Exceptional Elements

| Element | Why It Works | Apply To Future Pages |
|---------|--------------|----------------------|
| 1. | | ☐ |
| 2. | | ☐ |
| 3. | | ☐ |

### Successful Patterns

| Pattern | Section | Notes |
|---------|---------|-------|
| | | |
| | | |

---

## Sign-Off

### Evaluator Information

| Role | Name | Department | Date |
|------|------|------------|------|
| Primary Evaluator | | | |
| Secondary Evaluator | | | |
| Design Lead (if failed) | | | |

### Score Reconciliation

If evaluators disagree by more than 5 points:

| Evaluator 1 Score | Evaluator 2 Score | Difference | Resolution |
|-------------------|-------------------|------------|------------|
| _____ | _____ | _____ | ☐ Discussion ☐ Third evaluator |

**Final Agreed Score:** _____

### First Test Results

| Evaluator | Score | Date | Signature |
|-----------|-------|------|-----------|
| Evaluator 1 | | | |
| Evaluator 2 | | | |
| **Average** | | | |

### Retest Results (if applicable)

| Attempt | Evaluator | Score | Date | Notes |
|---------|-----------|-------|------|-------|
| Retest 1 | | | | |
| Retest 2 | | | | |
| Retest 3 | | | | |

**Maximum 3 retests allowed. After 3 failures, escalate to design leadership.**

---

## Certification Statement

### For Scores 95+: ⭐ EXEMPLARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ⭐ EXEMPLARY CERTIFICATION ⭐                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  This page has achieved EXEMPLARY status.                               │
│                                                                         │
│  It exceeds FINDO Design Bible standards and demonstrates               │
│  mastery of principles from:                                            │
│  • "Making Websites Win" - Conversion optimization                      │
│  • "Don't Make Me Think" - Usability excellence                         │
│  • "Designed for Use" - UX process best practices                       │
│                                                                         │
│  This page should be used as a reference implementation.                │
│                                                                         │
│  Certified by: _______________________                                  │
│  Date: _______________________                                          │
│  Certification ID: FINDO-EXEMPLARY-_______                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### For Scores 90-94: ✅ CERTIFIED

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ✅ CERTIFIED                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  This page has been certified according to FINDO Design Bible           │
│  standards. It meets requirements from "Making Websites Win,"           │
│  "Don't Make Me Think," and "Designed for Use."                         │
│                                                                         │
│  Certified by: _______________________                                  │
│  Date: _______________________                                          │
│  Certification ID: FINDO-CERT-_______                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Post-Certification Requirements

Even after certification, pages must:

### Week 1 After Launch

- [ ] Review first 100 sessions in analytics
- [ ] Check heatmap data for unexpected patterns
- [ ] Monitor conversion rate vs benchmark
- [ ] Collect user feedback (5+ data points)

### Month 1 After Launch

- [ ] Conduct 3 additional user tests
- [ ] Analyze conversion funnel drop-off
- [ ] Review support tickets mentioning this page
- [ ] Compare against A/B test hypothesis

### Ongoing

- [ ] Quarterly re-certification if major changes
- [ ] Annual review against updated Design Bible
- [ ] Report learnings to design team

---

# Quick Reference: Failure Fixes

## If Section A fails (First Impression):
- **Root Cause:** Value not clear in 5 seconds
- **Primary Fix:** Rewrite headline to lead with primary benefit
- **Secondary Fix:** Remove competing visual elements
- **Reference:** MAKING-WEBSITES-WIN.md, Trait 4 (Make Benefits Clear)

## If Section B fails (Usability):
- **Root Cause:** Users have to think
- **Primary Fix:** Follow conventions, make clickable things look clickable
- **Secondary Fix:** Add labels to icons, simplify navigation
- **Reference:** DONT-MAKE-ME-THINK.md, Chapters 1-3

## If Section C fails (Copy):
- **Root Cause:** Copy is hard to read or feature-focused
- **Primary Fix:** Run through Hemingway, simplify all sentences
- **Secondary Fix:** Convert every feature to emotional benefit
- **Reference:** MAKING-WEBSITES-WIN.md, Trait 1 (Written Well)

## If Section D fails (Trust):
- **Root Cause:** Not enough credibility signals
- **Primary Fix:** Add real testimonials with full details
- **Secondary Fix:** Make guarantee prominent near CTA
- **Reference:** MAKING-WEBSITES-WIN.md, Traits 6-7 (Trustworthy, Remove Risk)

## If Section E fails (Conversion):
- **Root Cause:** Too much friction or unclear CTA
- **Primary Fix:** Remove unnecessary form fields
- **Secondary Fix:** Rewrite CTA to communicate value
- **Reference:** MAKING-WEBSITES-WIN.md, Trait 8 (Like Water Chutes)

## If Section F fails (Mobile):
- **Root Cause:** Desktop-first design
- **Primary Fix:** Redesign mobile as primary, desktop as enhancement
- **Secondary Fix:** Increase tap targets to 44px minimum
- **Reference:** DONT-MAKE-ME-THINK.md, Mobile Usability chapter

## If Section G fails (Technical):
- **Root Cause:** Slow or inaccessible
- **Primary Fix:** Optimize images, enable caching
- **Secondary Fix:** Fix all accessibility errors
- **Reference:** Google PageSpeed Insights, WAVE Tool

## If Section H fails (Micro-copy):
- **Root Cause:** Unhelpful error messages or unclear labels
- **Primary Fix:** Rewrite every micro-copy element as helpful guidance
- **Secondary Fix:** Add inline validation with helpful hints
- **Reference:** DESIGNED-FOR-USE.md, Feedback section

## If Section I fails (Emotional Design):
- **Root Cause:** Design is functional but not emotionally engaging
- **Primary Fix:** Identify and address user's emotional needs
- **Secondary Fix:** Apply appropriate persuasion principles
- **Reference:** MAKING-WEBSITES-WIN.md, emotional benefits

## If Section J fails (User Journey):
- **Root Cause:** Page doesn't fit into larger context
- **Primary Fix:** Map the complete user journey
- **Secondary Fix:** Align messaging with journey stage
- **Reference:** DESIGNED-FOR-USE.md, Journey Mapping

## If Section K fails (Process):
- **Root Cause:** Design wasn't research-based
- **Primary Fix:** Conduct diagnosis before any redesign
- **Secondary Fix:** User test before finalizing
- **Reference:** diagnosis-toolkit.md, DESIGNED-FOR-USE.md

---

# Appendix A: Testing Resources & Tools

## Required Tools

| Tool | Purpose | URL | Cost |
|------|---------|-----|------|
| Hemingway App | Readability analysis | hemingwayapp.com | Free |
| PageSpeed Insights | Performance testing | pagespeed.web.dev | Free |
| WAVE | Accessibility testing | wave.webaim.org | Free |
| axe DevTools | Accessibility (browser) | deque.com/axe | Free |
| UsabilityHub | 5-second tests | usabilityhub.com | Paid |
| Hotjar | Heatmaps & recordings | hotjar.com | Freemium |
| Loom | User test recordings | loom.com | Free |

## Design Bible Reference Documents

| Document | Primary Use | When to Consult |
|----------|-------------|-----------------|
| [INDEX.md](./INDEX.md) | Quick start | Before any work |
| [MAKING-WEBSITES-WIN.md](./MAKING-WEBSITES-WIN.md) | Conversion issues | Sections D, E, I |
| [DONT-MAKE-ME-THINK.md](./DONT-MAKE-ME-THINK.md) | Usability issues | Sections A, B, F |
| [DESIGNED-FOR-USE.md](./DESIGNED-FOR-USE.md) | Process issues | Sections J, K |
| [diagnosis-toolkit.md](./diagnosis-toolkit.md) | Before any design | Section K |
| [page-checklist.md](./page-checklist.md) | During design | All sections |
| [anti-patterns.md](./anti-patterns.md) | Review designs | Avoid mistakes |

---

# Appendix B: Score Interpretation Guide

## Overall Score Meaning

| Score Range | Interpretation | Action Required |
|-------------|----------------|-----------------|
| 95-100+ | Exceptional work, reference quality | Document and share as example |
| 90-94 | Solid professional work | Implement with confidence |
| 85-89 | Good but has addressable gaps | Quick fixes, targeted retest |
| 75-84 | Significant issues | Full revision cycle |
| 65-74 | Fundamental problems | Back to research phase |
| Below 65 | Major misalignment | Reassess project understanding |

## Section Score Interpretation

| Section Score % | Status | Meaning |
|-----------------|--------|---------|
| 90-100% | Excellent | Exceeds standards |
| 80-89% | Good | Meets standards |
| 70-79% | Acceptable | Minor improvements needed |
| 60-69% | Concerning | Significant work required |
| Below 60% | Critical | Section fails, blocks certification |

---

# Appendix C: Evaluator Guidelines

## Evaluator Qualifications

Primary evaluators must:
- Have completed FINDO Design Bible training
- Have certified at least 5 pages previously
- Not be the page's designer (for independent review)

## Scoring Principles

1. **Be consistent** - Use the same standards for all pages
2. **Be objective** - Score based on criteria, not personal preference
3. **Be constructive** - Failed items need actionable feedback
4. **Be thorough** - Complete every section, no skipping
5. **Be honest** - Don't pass work that shouldn't pass

## Handling Disagreements

If evaluators disagree by more than 5 points:
1. Discuss specific criteria where scores differ
2. Re-evaluate those sections together
3. If still disagreeing, bring in third evaluator
4. Final score is average of two closest scores

## Conflict of Interest

Evaluators should recuse themselves if they:
- Designed or directly contributed to the page
- Have a personal relationship with the designer
- Have a vested interest in the outcome

---

# Appendix D: Certification History Template

## Page Certification Record

| Page | Version | Test Date | Score | Status | Evaluators | Notes |
|------|---------|-----------|-------|--------|------------|-------|
| | | | | | | |
| | | | | | | |
| | | | | | | |

## Team Certification Statistics

| Metric | This Month | Last Month | Trend |
|--------|------------|------------|-------|
| Pages tested | | | |
| First-pass certifications | | | |
| Average score | | | |
| Exemplary certifications | | | |
| Failed certifications | | | |
| Average retest count | | | |

---

*This certification test is mandatory for all FINDO pages.*
*No page ships without a passing score of 90+.*
*Excellence is not optional.*

*Version: 2.0*
*Last Updated: 2026-01-25*
*Based on: Making Websites Win, Don't Make Me Think, Designed for Use*
