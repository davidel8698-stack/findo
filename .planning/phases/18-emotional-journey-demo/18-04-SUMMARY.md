---
phase: 18
plan: 04
subsystem: design-system
tags: [motion, micro-interactions, animation, accessibility]

dependency_graph:
  requires:
    - "12-03 (Motion setup)"
    - "13-03 (Spring presets in lib/animation.ts)"
  provides:
    - "AnimatedButton component with scale hover/tap"
    - "AnimatedCard component with elevation hover"
    - "7 new Motion variants for hover interactions"
    - "Global CSS polish (focus, selection, reduced motion)"
  affects:
    - "Any component using Button can upgrade to AnimatedButton"
    - "Any component using Card can upgrade to AnimatedCard"
    - "18-05 may use new variants for demo polish"

tech_stack:
  added: []
  patterns:
    - "m.button/m.div wrappers for motion-enhanced UI"
    - "whileHover/whileTap for micro-interactions"
    - "Spring physics for playful character"

key_files:
  created: []
  modified:
    - "website/components/motion/variants.ts"
    - "website/components/ui/button.tsx"
    - "website/components/ui/card.tsx"
    - "website/app/globals.css"

decisions:
  - id: "18-04-01"
    title: "Separate animated components vs extending existing"
    choice: "Created AnimatedButton/AnimatedCard alongside existing Button/Card"
    rationale: "Motion m.* wrappers cannot support asChild (Radix Slot), needed for Link components. Regular Button preserved for compatibility."

metrics:
  duration: "~4 minutes"
  completed: "2026-02-02"
---

# Phase 18 Plan 04: Micro-interactions & Polish Summary

**One-liner:** Added playful button hover/tap and card elevation using Motion spring physics, plus WCAG-compliant focus states and reduced motion support.

## What Was Built

### 1. Hover Variants (variants.ts)

Added 7 new variants to the animation system:

| Variant | Effect | Use Case |
|---------|--------|----------|
| `buttonHover` | scale 1.02 on hover, 0.98 on tap | Interactive buttons |
| `cardHover` | y:-4 lift + shadow increase | Cards on hover |
| `iconSpin` | 15deg rotation | Decorative icons |
| `linkUnderline` | width 0->100% | Text link hover |
| `bounceIn` | scale 0.3->1 with bounce | Attention elements |
| `slideInEnd` | x:50->0 | RTL slide from end |
| `slideInStart` | x:-50->0 | RTL slide from start |

### 2. AnimatedButton Component (button.tsx)

```typescript
<AnimatedButton variant="default" size="lg">
  Click me
</AnimatedButton>
```

- Uses `m.button` wrapper from Motion
- `whileHover={{ scale: 1.02 }}` - subtle but noticeable
- `whileTap={{ scale: 0.98 }}` - press feedback
- `transition={springBouncy}` - playful character
- Same variant/size props as regular Button

### 3. AnimatedCard Component (card.tsx)

```typescript
<AnimatedCard className="p-6">
  Card content
</AnimatedCard>
```

- Uses `m.div` wrapper from Motion
- `whileHover={{ y: -4, boxShadow: "..." }}` - elevation effect
- `transition={springGentle}` - smooth, professional feel

### 4. Global CSS Polish (globals.css)

| Feature | Implementation | Purpose |
|---------|----------------|---------|
| Focus visible | Primary color outline | WCAG accessibility |
| Selection | Orange tint (primary/0.2) | Brand consistency |
| Cursor pointer | Auto on buttons/links | Better affordance |
| Smooth scroll | `scroll-behavior: smooth` | Non-Lenis fallback |
| Reduced motion | Disable all animations | WCAG accessibility |

## Decisions Made

### AnimatedButton vs extending Button

**Decision:** Created separate AnimatedButton component instead of adding motion to existing Button.

**Rationale:** The regular Button supports `asChild` prop (Radix Slot pattern) for wrapping Link components. Motion's `m.button` cannot wrap arbitrary children this way. Keeping both ensures:
- AnimatedButton: For standalone buttons needing micro-interactions
- Button: For Link-as-button patterns (navigation, CTAs with routing)

## Verification Results

- Build: PASSED (Next.js 16.1.6 Turbopack)
- TypeScript: No errors
- Key artifacts verified:
  - `buttonHover` exists in variants.ts
  - `whileHover` in AnimatedButton
  - `springBouncy` imported from lib/animation
  - `m.button` pattern in button.tsx

## Requirements Addressed

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| EMOTION-05 | DONE | Button hover/tap, card elevation |
| EMOTION-07 | DONE | Polished focus states, selection |
| WCAG reduced motion | DONE | `prefers-reduced-motion` media query |

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Message | Files |
|------|---------|-------|
| 2ff3983 | feat(18-04): add hover variants to animation system | variants.ts |
| 4a22fb7 | feat(18-04): create AnimatedButton with Motion | button.tsx |
| a741251 | feat(18-04): add AnimatedCard and global CSS polish | card.tsx, globals.css |

## Next Phase Readiness

**Ready for 18-05** - Micro-interactions system complete. Components can now use:
- `AnimatedButton` for playful CTAs
- `AnimatedCard` for elevated card interactions
- New variants for entrance/hover animations
- All with WCAG-compliant reduced motion support
