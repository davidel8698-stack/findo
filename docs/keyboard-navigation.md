# Keyboard Navigation Guide

## Overview

The Findo website supports full keyboard navigation following WCAG 2.1 AA guidelines.
All interactive elements are reachable via Tab key and activatable via Enter/Space.

## Tab Order (RTL Layout)

The website follows right-to-left logical tab order for Hebrew content.

### 1. Skip Link (First Focus)
- **Element:** Skip-to-content link
- **Visible:** Only on focus
- **Action:** Enter/Space skips to main content

### 2. Navigation
- **Logo:** Findo logo (link to home)
- **Nav Links:** Features, Pricing, FAQ (right to left)
- **CTA Button:** "התחל" (Start) button

### 3. Hero Section
- **Badge:** Announcement badge (decorative, skipped)
- **CTA Group:**
  - Primary: "התחל בחינם" (Start Free)
  - Secondary: "איך זה עובד?" (How it works)

### 4. Feature Sections
Each feature section contains:
- Section heading (not focusable)
- Feature cards (if interactive)
- Any embedded CTAs

### 5. Pricing Section
- Pricing tier cards
- Plan selection buttons
- FAQ accordion (Enter to expand/collapse)

### 6. Footer
- Footer links (3 columns, right to left)
- Social media links
- Legal links (Privacy, Terms)

## Focus Indicators

All focusable elements display:
- 2px solid outline in primary color (orange)
- 2px offset from element edge
- Visible only on keyboard focus (:focus-visible)

## Reduced Motion

When prefers-reduced-motion is enabled:
- Animations are disabled or reduced to simple fades
- Skip link still functions normally
- Focus indicators remain unchanged

## Testing Checklist

- [ ] Tab through entire page from top to bottom
- [ ] Verify skip link appears first
- [ ] Verify skip link jumps to main content
- [ ] Verify all buttons are reachable and activatable
- [ ] Verify accordion opens/closes with Enter
- [ ] Verify focus ring visible on all elements
- [ ] Test in both LTR and RTL layouts

---

*Document created: Phase 31 (A11Y-04)*
*Last updated: 2026-02-06*
