# Phase 17: Conversion Flow & Forms - Context

**Gathered:** 2026-02-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Action path so simple that NOT taking it requires conscious resistance. Minimal friction lead capture forms, strategic CTA placement, mobile-optimized sticky CTAs, and celebration moment on signup. Does NOT include the actual onboarding flow or dashboard - redirect goes to existing app.

</domain>

<decisions>
## Implementation Decisions

### CTA Placement Strategy
- 4-5 CTAs on homepage: hero, after social proof, after pricing, after FAQ, footer
- CTA text consistent throughout - same wording for reinforcement
- "What happens next" text below each CTA (e.g., "2 minutes to setup, no credit card")
- Secondary CTAs (WhatsApp) kept separate from primary conversion CTAs - only in contact section

### Form Field Design
- Two fields: Phone + Name
- Phone auto-formats as user types (05X-XXX-XXXX) with checkmark when valid
- Validation errors are warm and helpful ("Almost there! Enter a valid phone number")
- Form inline in sections (hero and below pricing), not modal or separate page

### Mobile CTA Behavior
- Sticky bottom bar (full-width, not floating button)
- Appears after hero CTA scrolls out of view (~400px scroll)
- Always visible once shown - no hide on scroll down
- Bar contains just the CTA button - minimal, clean

### Signup Success Moment
- Inline success state - form transforms into celebration
- Confetti burst + green checkmark animation
- Value reminder message: "You're in! Get ready for more customers, less work"
- 2-3 second celebration, then redirect to app login/setup

### Claude's Discretion
- Exact confetti animation implementation
- CTA button text wording
- Form placeholder text
- iOS safe area handling for sticky bar
- Redirect URL to app

</decisions>

<specifics>
## Specific Ideas

- Phone number should feel Israeli-native (05X format auto-detected)
- Celebration should match Findo's playful personality established in design system
- Sticky bar already exists from Phase 14 (StickyCtaBar) - extend/adapt for form integration

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-conversion-flow*
*Context gathered: 2026-02-01*
