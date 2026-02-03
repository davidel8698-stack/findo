# Phase 23: 3D Phone Mockup - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Hero visual centerpiece — a pre-rendered 3D phone mockup displaying the Findo activity feed with realistic shadows, screen glow, and parallax movement. Animation choreography and other sections are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Phone Visual Style
- Three-quarter view angle (~30°) showing depth — Linear/Stripe hero style
- Modern frameless silhouette — thin bezels, rounded corners, generic premium phone (not brand-specific)
- Space black/dark gray frame — blends with dark theme, premium feel
- Realistic photo-quality 3D render with materials, shadows, reflections

### Activity Feed Content
- Full Findo journey sequence: Missed call → WhatsApp reply → Review request → 5-star received
- 8-12 second animation loop — enough to show full journey, short enough for multiple views
- Loop continuously — keeps hero alive, no pause between cycles
- Hebrew language for all content — matches target audience, authentic feel

### Screen Glow & Lighting
- Subtle ambient glow — soft light bleeding from screen edges, premium not distracting
- Brand orange tint for glow — orange-amber matching Findo identity
- Subtle rim light on phone frame — thin highlight on edges for premium separation
- Multi-layer realistic shadows — contact + directional + ambient (matches Phase 22 system)

### Parallax Behavior
- Subtle movement intensity — ~20-40px, noticeable but not distracting
- Mouse + scroll on desktop — slight tilt toward cursor, plus scroll response
- Scroll parallax only on mobile — no mouse tracking for performance
- Natural scroll exit — phone scrolls out with content, no sticky behavior

### Claude's Discretion
- Exact parallax easing curves and timing
- 3D render tool/source (pre-rendered image vs CSS 3D)
- Activity feed animation implementation (CSS, Motion, GSAP)
- Exact shadow spread/blur values within multi-layer system

</decisions>

<specifics>
## Specific Ideas

- Phone positioned on left side of hero (RTL layout — text on right, visual on left)
- Activity feed should feel like watching a real notification sequence, not a slideshow
- Glow should enhance the "screen is on" illusion without looking like a game UI

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 23-3d-phone-mockup*
*Context gathered: 2026-02-03*
