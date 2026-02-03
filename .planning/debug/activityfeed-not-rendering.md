---
status: diagnosed
trigger: "Diagnose why ActivityFeed is not rendering inside the PhoneMockup on the live site"
created: 2026-02-01T12:00:00Z
updated: 2026-02-01T12:05:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED - ActivityCard components have `opacity-0` set as initial CSS class that GSAP should animate away, but GSAP animation uses `.from()` which sets initial values and animates TO current state - the `opacity-0` class remains applied permanently
test: Analyzed ActivityFeed.tsx line 110 and GSAP animation at lines 76-84
expecting: Cards stay invisible because opacity-0 CSS class overrides GSAP animation
next_action: Report root cause

## Symptoms

expected: Phone mockup on hero section should display ActivityFeed with animated cards (review, post, lead, call)
actual: Phone mockup shows blank screen
errors: None - this is a CSS/animation logic error, not a runtime error
reproduction: Visit live site, observe hero section phone mockup
started: Built this way

## Eliminated

- hypothesis: ActivityFeed not rendered as child of PhoneMockup
  evidence: Hero.tsx lines 54-56 clearly show `<PhoneMockup><ActivityFeed /></PhoneMockup>` structure
  timestamp: 2026-02-01T12:02:00Z

- hypothesis: PhoneMockup doesn't render children
  evidence: PhoneMockup.tsx line 66 renders `{children}` inside screen area
  timestamp: 2026-02-01T12:02:00Z

- hypothesis: Component tree incorrect (Hero > PhoneMockup > ActivityFeed)
  evidence: All files confirm correct structure - Hero.tsx renders PhoneMockup with ActivityFeed inside
  timestamp: 2026-02-01T12:02:00Z

## Evidence

- timestamp: 2026-02-01T12:02:00Z
  checked: Hero.tsx component structure
  found: Lines 54-56 correctly render `<PhoneMockup><ActivityFeed /></PhoneMockup>`
  implication: Component tree is correct

- timestamp: 2026-02-01T12:02:00Z
  checked: PhoneMockup.tsx children rendering
  found: Line 66 renders `{children}` inside the screen area div
  implication: Children are being rendered

- timestamp: 2026-02-01T12:03:00Z
  checked: ActivityFeed.tsx card rendering and animation
  found: Line 110 sets `className="opacity-0 will-change-transform"` on each ActivityCard
  implication: Cards start invisible by design, relying on GSAP to make them visible

- timestamp: 2026-02-01T12:04:00Z
  checked: GSAP animation logic in ActivityFeed.tsx
  found: Lines 76-84 use `gsap.from()` with `opacity: 0` - this animates FROM opacity:0 TO the current CSS state
  implication: BUG - The animation goes FROM opacity:0 TO opacity:0 (the CSS class), so cards never become visible

- timestamp: 2026-02-01T12:04:30Z
  checked: ActivityCard.tsx className application
  found: Line 46-53 apply passed className (including opacity-0) to the card div
  implication: The opacity-0 class is permanently applied to the element

## Resolution

root_cause: The ActivityFeed animation has a fundamental logic error. Cards have `opacity-0` CSS class (line 110 of ActivityFeed.tsx) that should be removed by GSAP animation, but the GSAP animation uses `.from()` which animates FROM specified values TO current CSS values. Since current CSS is `opacity-0` (from the class), the animation goes from opacity:0 to opacity:0, leaving cards permanently invisible.

fix:
verification:
files_changed: []
