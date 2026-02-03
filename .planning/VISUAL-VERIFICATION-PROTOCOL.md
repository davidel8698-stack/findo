# Visual Verification Protocol

> This document defines how visual verification integrates with the GSD workflow.

## Overview

Visual verification ensures that code changes produce the intended visual result. After each plan execution, we capture screenshots and analyze them before marking the plan complete.

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  For each Plan:                                             │
│                                                             │
│  1. Execute plan (write code)                               │
│  2. Build check (npm run build)                             │
│  3. Visual Capture (npm run visual:capture)                 │
│  4. Claude reads & analyzes screenshots                     │
│  5. Document findings in PLAN.md                            │
│                                                             │
│  If issues found:                                           │
│  ├── 6a. Document the issue                                 │
│  ├── 6b. Analyze root cause                                 │
│  ├── 6c. Add learning to visual-learnings.md               │
│  ├── 6d. Apply fix                                          │
│  └── 6e. Re-run steps 3-5 (max 2 retries)                  │
│                                                             │
│  If passed:                                                 │
│  └── 7. Mark plan complete                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Commands

### Local Development
```bash
# Start dev server first
npm run dev

# In another terminal, capture screenshots
npm run visual:capture
```

### Vercel Preview
```bash
# Capture from deployed preview
npm run visual:capture:vercel https://your-preview-url.vercel.app
```

## Output

Screenshots are saved to: `website/.visual-verification/`

```
.visual-verification/
├── desktop-full-page.png
├── desktop-hero.png
├── desktop-social-proof.png
├── desktop-testimonials.png
├── desktop-roi-calculator.png
├── desktop-pricing.png
├── desktop-faq.png
├── desktop-founder.png
├── desktop-contact.png
├── desktop-footer.png
├── mobile-full-page.png
├── mobile-hero.png
├── ... (same for mobile)
└── report.json
```

## Analysis Checklist

When Claude analyzes screenshots, check for:

### 0. CENTER LINE TEST (DO THIS FIRST!)
**Before any other checks, perform the center line test:**

1. Mentally draw a vertical line at the exact center of the screenshot
2. Check if content is balanced around this line
3. If ALL sections are shifted to one side → **SYSTEMATIC ISSUE**
4. If only some sections are off → **LOCAL ISSUE**

**Systematic Issue = CSS/Framework level problem**
- Check `globals.css` for container centering
- Tailwind 4's `container` does NOT auto-center! (See CENTERING-PATTERNS.md)

**Local Issue = Component level problem**
- Check individual component for missing `mx-auto`
- Check for double-wrapping

### 1. Layout & Spacing
- [ ] **CENTER LINE**: Content balanced relative to screen center
- [ ] Elements are properly aligned
- [ ] Spacing is consistent
- [ ] No overflow or cut-off elements
- [ ] RTL layout is correct

### 2. Typography
- [ ] Text is readable
- [ ] Hierarchy is clear
- [ ] Hebrew renders correctly
- [ ] Line heights are appropriate

### 3. Visual Hierarchy
- [ ] CTA buttons are prominent
- [ ] Important elements stand out
- [ ] No visual clutter

### 4. Components
- [ ] All components render (no missing elements)
- [ ] Interactive elements look interactive
- [ ] States are distinguishable (hover, active, disabled)

### 5. Mobile Specific
- [ ] Touch targets are large enough (48px)
- [ ] Content fits viewport
- [ ] No horizontal scroll
- [ ] Sticky elements work correctly

### 6. Requirements Match
- [ ] What's in the code matches what's visible
- [ ] Success criteria from PLAN.md are met visually

## Documentation Template

Add this section to PLAN.md after visual verification:

```markdown
## Visual Verification

### Capture Details
- **Timestamp**: YYYY-MM-DD HH:MM
- **Source**: Local / Vercel Preview (URL)
- **Desktop**: X sections captured
- **Mobile**: X sections captured

### Analysis Results

#### ✅ Passed
- Section name: Brief description of what's correct

#### ⚠️ Warnings
- Section name: Issue description
  - Screenshot: filename.png
  - Suggestion: How to improve

#### ❌ Issues Found

**Issue 1: [Brief title]**
- Section: Which section
- Screenshot: filename.png
- Expected: What should appear
- Actual: What appears instead
- Root Cause: Why this happened
- Learning: Pattern to avoid (add to visual-learnings.md)
- Fix Applied: What was changed
- Re-verification: ✅ Passed / ❌ Still failing

### Summary
- Passed: X/Y sections
- Warnings: X
- Issues fixed: X
- Status: Ready for human verification / Needs attention
```

## Best Practices

### Before Writing Code
1. Read `.planning/visual-learnings.md` for known patterns
2. Check if similar components exist to maintain consistency
3. Plan mobile-first, enhance for desktop

### During Development
1. Test locally in browser before running visual capture
2. Check both desktop and mobile viewports
3. Verify RTL layout manually first

### After Visual Capture
1. Read ALL screenshots, not just full-page
2. Compare against plan requirements
3. Document everything, even minor issues
4. Add learnings to prevent recurrence

## Troubleshooting

### Capture fails with "Section not found"
- Check if `data-section` attribute exists on the element
- Verify the ID matches what's in visual-capture.ts
- Section might be conditionally rendered

### Screenshots are blank/black
- Dev server might not be running
- Page might not have loaded fully
- Check for JavaScript errors in console

### Mobile screenshots look wrong
- Verify viewport size is correct
- Check for fixed-width elements
- Test with actual device if possible

---

*Protocol version: 1.1*
*Created: 2026-02-01*
*v1.1: Added CENTER LINE TEST as mandatory first step after discovering systematic centering issues*
