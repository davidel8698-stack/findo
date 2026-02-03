# Visual Learnings Knowledge Base

> This file captures patterns learned from visual verification failures.
> Claude should consult this file before writing UI code to avoid repeating mistakes.

## How to Use This File

1. **Before writing UI code**: Read relevant sections to avoid known pitfalls
2. **After fixing a visual issue**: Add the learning here
3. **During code review**: Check if code violates any of these patterns

---

## CSS & Styling

### RTL Layout
- [ ] Always use logical properties: `ms-` / `me-` instead of `ml-` / `mr-`
- [ ] Always use logical properties: `ps-` / `pe-` instead of `pl-` / `pr-`
- [ ] For flexbox, use `flex-row-reverse` with RTL if natural order is needed
- [ ] Gradient directions may need to flip for RTL

### Responsive Design
- [ ] Never use fixed widths without `max-w-full` for mobile safety
- [ ] Test all components at 390px (iPhone) and 1440px (desktop)
- [ ] Sticky elements: ensure they don't cover content on small screens

### Radix UI Components
- [ ] Ensure all Radix components have proper styling (they're unstyled by default)
- [ ] Check focus states are visible and accessible
- [ ] Verify animations work in RTL mode

### Colors & Contrast
- [ ] Test contrast in dark mode (WCAG 2.1 AA: 4.5:1 for text)
- [ ] Verify orange accent is visible on dark backgrounds
- [ ] Check disabled states are distinguishable

---

## Layout

### Cards & Grid
- [ ] Use `h-full` on cards in grids for equal heights
- [ ] Test grids with varying content lengths
- [ ] Ensure gaps are consistent (prefer `gap-6` or `gap-8`)

### Sections
- [ ] All sections should have consistent vertical padding
- [ ] Add `data-section="name"` attribute for visual capture
- [ ] Ensure section IDs are unique for anchor links

### Hero Section
- [ ] CTA must be visible without scrolling on all viewports
- [ ] Phone mockup must not overflow on mobile
- [ ] Trust signal should be visible above fold

---

## Typography

### Hebrew Text
- [ ] Line height should be 1.8+ for Hebrew readability
- [ ] Body text minimum 16px
- [ ] Don't use thin font weights (<400) for Hebrew

### Hierarchy
- [ ] Headlines: clear size difference between h1, h2, h3
- [ ] Use color to reinforce hierarchy (muted for secondary text)
- [ ] Limit line length for readability (max ~70 characters)

---

## Animations

### Performance
- [ ] Only animate `transform` and `opacity` (GPU-accelerated)
- [ ] Use `will-change` sparingly
- [ ] Test on low-end devices if possible

### Motion Preferences
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Provide fallback for users who disable animations

### Scroll Animations
- [ ] Ensure content is visible even if animations fail
- [ ] Don't animate on initial load (causes CLS)
- [ ] Stagger delays should be subtle (0.05-0.1s)

---

## Components

### Buttons
- [ ] Minimum touch target: 48px height
- [ ] Hover and active states clearly visible
- [ ] Loading state for async actions

### Forms
- [ ] Error messages in Hebrew, below the field
- [ ] Success feedback is clear (green checkmark)
- [ ] Focus state visible on all inputs

### Carousels
- [ ] Navigation arrows respect RTL (right arrow = previous)
- [ ] Dot indicators align correctly
- [ ] Touch/swipe works on mobile

---

## Known Issues Fixed

### 2026-02-02 - Testimonials Duplicate Heading
**Issue**: "מה הלקוחות שלנו אומרים" appeared twice
**Root Cause**: Heading in both page.tsx and TestimonialsCarousel component
**Fix**: Removed duplicate from page.tsx
**Prevention**: Components with headings should be self-contained OR receive heading as prop

### 2026-02-02 - Guarantee Days Inconsistency
**Issue**: ZeroRiskSummary said "14 days", GuaranteeBadge said "30 days"
**Root Cause**: Different files with duplicate content strings
**Fix**: Updated ZeroRiskSummary to 30 days
**Prevention**: Use constants for repeated values, or centralize copy

### 2026-02-02 - Trust Badges Missing Heading
**Issue**: Trust Badges section had no visible heading
**Root Cause**: Component didn't include heading, page.tsx didn't add one
**Fix**: Added "למה לבחור ב-Findo" heading in page.tsx
**Prevention**: All sections should have clear headings

### 2026-02-02 - Floating Widget Overlapping Sticky CTA
**Issue**: Activity widget at bottom-4 overlapped mobile sticky CTA
**Root Cause**: Fixed positioning without accounting for sticky bar height
**Fix**: Changed to bottom-20 on mobile, bottom-4 on desktop
**Prevention**: Always consider other fixed/sticky elements when positioning

---

## Patterns Discovered (2026-02-02 User Feedback)

### Layout Balance Issues
- [x] Social Proof Counters pushed to right, left side empty
- [ ] Team Section content on right, placeholder photo not balancing
- [x] Zero Risk card not centered in container
**Pattern**: Grid layouts with flex content tend to unbalance
**Prevention**: Use explicit centering or max-width with mx-auto

### Missing/Placeholder Assets
- [x] Founder photo: dark circle placeholder instead of real image
- [x] Video testimonial: empty player, no poster image
**Pattern**: Development placeholders shipped to production
**Prevention**: Add asset checklist before phase completion

### UI Element Sizing
- [x] Carousel navigation arrows too small to notice
**Pattern**: Functional but not usable UI elements
**Prevention**: Minimum 44px touch targets, visible contrast

### Phone Mockup Cutoff
- [ ] Notch area appears cut off or asymmetric
**Pattern**: Complex SVG/graphics not fully tested at all viewports
**Prevention**: Test decorative elements at multiple sizes

---

## Fixes Applied (2026-02-02 Continued)

### Social Proof Counters Centering Fix
**Issue**: Counters appeared pushed to right side with empty left space
**Root Cause**: Double-wrapping - component had its own section/container, plus page.tsx wrapped it in another section/container
**Fix**: Removed inner section/container from SocialProofCounters, added `max-w-4xl mx-auto` to grid
**Prevention**: Components should NOT include section wrappers; let page.tsx control layout

### Carousel Navigation Arrows
**Issue**: Arrows too small to easily see and click
**Root Cause**: Default icon size (20px) and minimal styling
**Fix**: Increased button to h-14 w-14 (56px), icon to h-6 w-6 (24px), added shadow and hover effects
**Prevention**: Navigation elements need minimum 44px+ touch targets with clear visual prominence

### Video Testimonial Placeholder
**Issue**: Empty video player when video file doesn't exist
**Root Cause**: No error handling for missing video assets
**Fix**: Added error state detection and placeholder UI with message "סרטון עדות לקוח - הסרטון יעלה בקרוב"
**Prevention**: All media components should gracefully handle missing assets

### Team Section Photo Fallback
**Issue**: Broken image when founder photo doesn't exist at /team/founder.jpg
**Root Cause**: Image component fails silently, shows empty space
**Fix**: Added onError handler with fallback to User icon in gradient circle
**Prevention**: All Image components should have onError fallback UI

### Zero Risk Summary Centering
**Issue**: Card not properly centered, inconsistent with design
**Root Cause**: No max-width on component, relying only on parent constraint
**Fix**: Added `max-w-lg mx-auto` to component, improved padding and visual treatment
**Prevention**: Cards and contained elements should self-center with max-width

### Hero Form Edge Alignment (Missed by Visual Analysis)
**Issue**: Lead capture form pushed to right edge of screen, slightly cut off
**Root Cause**: Form had `max-w-sm` to limit width but no `mx-auto` for centering
**Fix**: Added `mx-auto` to LeadCaptureForm component
**Prevention**: ANY element with max-width MUST also have mx-auto for centering
**Visual Analysis Gap**: Need to specifically check edge-aligned elements that should be centered

---

## Visual Analysis Methodology Gaps

### Gap 1: Edge Alignment Detection
**Symptom**: Elements at screen edges that should be centered
**Check**: Look for elements touching or near viewport edges
**Pattern**: `max-w-*` without `mx-auto` causes edge alignment in flex/grid parents

### Gap 2: Inherited Centering Assumptions
**Symptom**: Assuming parent flex/justify-center will center children
**Reality**: Children with `w-full` expand to fill, inner content needs its own centering
**Check**: Verify inner elements have explicit centering, not just wrappers

---

## Comprehensive Centering Audit (2026-02-02)

### Components Fixed for Double-Wrapping:
1. **TestimonialsCarousel** - Removed inner `<section>`, now returns `<div>`
2. **TeamSection** - Removed inner `<section>` and `container`, now returns `<div>`
3. **ContactSection** - Removed inner `<section>` and `container`, now returns `<div>`

### Components Fixed for Centering:
1. **PricingComparison** - Added `max-w-4xl mx-auto` to table wrapper
2. **LeadCaptureForm** - Added `mx-auto` to form
3. **ZeroRiskSummary** - Removed double max-width from page.tsx wrapper

### New Documentation:
- Created **CENTERING-PATTERNS.md** - Complete guide for centering patterns

### Key Rules Established:
1. **Golden Rule**: Every `max-w-*` MUST have `mx-auto`
2. Components called inside page.tsx wrappers should NOT have own section/container
3. Components called directly (ROICalculator, PricingSection, FAQSection) CAN have own section
4. Forms always need `mx-auto` when using `max-w-*`
5. Grids with constrained width need `max-w-* mx-auto`

---

*Last updated: 2026-02-02*
*Total learnings: 16 fixes applied, 6 patterns identified, 2 methodology gaps documented*
*New: CENTERING-PATTERNS.md guide created*
