# Visual Analysis 4.0 Checklist

> Systematic checklist for visual verification.
> Claude must check ALL items when analyzing screenshots.

---

## ⚠️ CRITICAL: Systematic vs Local Issues

**Before checking individual elements, ALWAYS perform the CENTER LINE TEST:**

1. Draw an imaginary vertical line down the exact center of the screen
2. Check if ALL content appears shifted to one side across multiple sections
3. If YES → This is a **SYSTEMATIC ISSUE** (container/CSS level)
4. If NO → Check individual sections for **LOCAL ISSUES**

### Systematic Issue Indicators
- [ ] **All sections shifted same direction** → Container not centered
- [ ] **Content consistently off-center** → Missing `margin-inline: auto`
- [ ] **Headers/titles all shifted** → Framework-level issue

### Root Cause Checklist (for systematic issues)
- [ ] Is `container` class auto-centered in CSS? (Tailwind 4 does NOT auto-center!)
- [ ] Check globals.css for container configuration
- [ ] Verify `margin-inline: auto` is applied to `.container`

**Tailwind 4 Fix (REQUIRED):**
```css
@layer utilities {
  .container {
    margin-inline: auto;
  }
}
```

---

## A. Layout & Centering

### A1. Element Centering
- [ ] **CENTER LINE TEST**: Draw imaginary center line - is content balanced around it?
- [ ] Is the main content centered within its container?
- [ ] Are standalone elements (cards, badges, forms) properly centered?
- [ ] Is there unexpected offset to left/right?
- [ ] **EDGE CHECK**: Are any elements touching/cut off at screen edges?
- [ ] **FORM CHECK**: Are input forms centered, not edge-aligned?

### A2. Visual Balance (NOT just technical centering)
- [ ] Content doesn't have to be centered IF the layout is intentionally asymmetric
- [ ] BUT content MUST be visually BALANCED relative to screen center
- [ ] In 2-column layouts: Is the combined visual weight balanced around center?
- [ ] Are there large empty areas on one side but not the other?
- [ ] Does the layout feel balanced or lopsided?

### A3. Grid Symmetry
- [ ] In 2+ column layouts, are columns roughly equal?
- [ ] Is content distributed evenly across grid cells?
- [ ] Do grid items have consistent sizing?

---

## B. Asset Completeness (Missing in v2.0)

### B1. Images
- [ ] Are all images loading (not broken)?
- [ ] Are placeholder images replaced with real content?
- [ ] Do images have appropriate aspect ratios?

### B2. Videos
- [ ] Does video have a visible thumbnail/poster?
- [ ] Is video player sized appropriately?
- [ ] Is there actual video content (not just empty player)?

### B3. Graphics
- [ ] Are SVGs/icons rendering correctly?
- [ ] Are decorative elements complete (not cut off)?
- [ ] Phone mockups, illustrations - are they fully visible?

---

## C. UI Element Sizing (Missing in v2.0)

### C1. Navigation Elements
- [ ] Are carousel arrows large enough to see/click?
- [ ] Are navigation dots/indicators visible?
- [ ] Is pagination clear and usable?

### C2. Interactive Elements
- [ ] Are buttons minimum 48px height on mobile?
- [ ] Are clickable areas obvious?
- [ ] Do hover/focus states exist?

### C3. Text Sizing
- [ ] Is body text minimum 16px?
- [ ] Are headings clearly larger than body?
- [ ] Is there clear visual hierarchy?

---

## D. Visual Flow (Missing in v2.0)

### D1. Section Transitions
- [ ] Do adjacent sections connect visually?
- [ ] Is the vertical rhythm consistent?
- [ ] Are section boundaries clear but not jarring?

### D2. Content Flow
- [ ] Does the eye naturally flow through content?
- [ ] Is the CTA path obvious?
- [ ] Are related elements grouped together?

### D3. Spacing Consistency
- [ ] Is padding consistent between sections?
- [ ] Are gaps within sections uniform?
- [ ] Is there a clear spacing system?

---

## E. Phase-Specific Criteria

### Per Current Phase
- [ ] All success criteria visually verified
- [ ] All requirements have visual evidence
- [ ] No regressions from previous phases

---

## F. Issue Severity Matrix

| Severity | Definition | Example |
|----------|------------|---------|
| P0 - Critical | Blocks conversion or destroys trust | Missing founder photo, empty video |
| P1 - High | Looks unprofessional | Uncentered content, unbalanced layout |
| P2 - Medium | Noticeable issue | Small nav arrows, tight spacing |
| P3 - Low | Minor polish | Slight alignment, color tweaks |

---

## G. Checklist Usage

When analyzing screenshots, Claude must:

1. **Scan for empty spaces** - Look for large blank areas
2. **Check centering** - Is content centered or offset?
3. **Verify assets** - Are all images/videos showing content?
4. **Measure balance** - Are grids symmetrical?
5. **Test UI elements** - Are interactive elements sized correctly?
6. **Follow flow** - Does the page flow logically?

---

*Version: 4.0*
*Created: 2026-02-02*
*Based on user feedback identifying 7 missing check categories*
*v3.1: Added EDGE CHECK and FORM CHECK after hero form centering bug*
*v4.0: Added CENTER LINE TEST and systematic issue detection after discovering Tailwind 4 container centering bug*
