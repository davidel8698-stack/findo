# Phase 33 Research: Emotional Scrollytelling Section

## Inspiration Analysis: Terminal Industries

### Key Techniques Observed

| Technique | Implementation | Complexity |
|-----------|---------------|------------|
| **Scroll-driven text reveal** | GSAP ScrollTrigger with scrub | Medium |
| **Typewriter effect** | GSAP SplitText (paid) or custom | Medium-High |
| **Particle system** | Canvas/WebGL or CSS | High |
| **Grid pattern** | CSS + SVG | Low |
| **Sticky sections** | ScrollTrigger pin | Medium |
| **Section transitions** | SVG clip-path curves | Medium |
| **Counter animation** | GSAP countUp | Low |

### Terminal Industries Flow

```
1. Hero (truck + sunset gradient)
   ↓ scroll
2. 3D Grid tunnel + floating particles + typewriter text
   ↓ scroll
3. White section (bridge statement)
   ↓ scroll
4. Sticky image + scrolling text steps (01, 02, 03...)
   ↓ scroll
5. YOS letter reveal (Y-O-S dramatic)
   ↓ scroll
6. 3D Wireframe + Benefits
```

---

## Technical Approach for Findo

### Stack Decision

| Component | Choice | Reason |
|-----------|--------|--------|
| **Scroll control** | GSAP ScrollTrigger | Already in project, best-in-class |
| **Typewriter** | Custom implementation | SplitText is paid; need RTL support |
| **Particles** | CSS + requestAnimationFrame | Performance, no WebGL dependency |
| **Grid** | CSS background + SVG dots | Simple, performant |
| **Transitions** | CSS clip-path | GPU-accelerated |

### RTL Hebrew Considerations

1. **Text direction**: Typewriter must reveal from RIGHT to LEFT
2. **Character splitting**: Hebrew characters are self-contained (no ligatures like Arabic)
3. **Word boundaries**: Hebrew words split cleanly on spaces
4. **Punctuation**: Question marks (?) go at end of sentence (left side in RTL)

### Custom Typewriter Implementation

```typescript
// Approach: Split text into characters, animate opacity/visibility
// For RTL: Characters array stays in logical order, CSS handles display

interface TypewriterConfig {
  text: string;
  progress: number; // 0 to 1, controlled by ScrollTrigger
}

function getVisibleCharacters(text: string, progress: number): number {
  return Math.floor(text.length * progress);
}

// In component:
// - Split text into spans
// - Use ScrollTrigger scrub to control progress
// - Animate character visibility based on progress
```

### Particle System Approach

**Option A: Pure CSS (chosen)**
- Use CSS `@keyframes` for floating animation
- Position particles with CSS Grid or absolute positioning
- Randomize initial positions and animation delays
- ~50-100 particles for good density without performance hit

**Option B: Canvas (alternative)**
- Better for 500+ particles
- More complex setup
- May be overkill for this section

### Grid Pattern

```css
.grid-pattern {
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Accent dots at intersections */
.grid-dots {
  background-image: radial-gradient(
    circle at center,
    var(--accent-orange) 2px,
    transparent 2px
  );
  background-size: 60px 60px;
  opacity: 0.3;
}
```

---

## Content Structure

### 7 Scroll Phases

```
Phase 1 - Hook (0-15% scroll)
"אם הגעתם לכאן,
יתכן שמשהו בשיווק של העסק שלכם לא מרגיש יציב."

Phase 2 - Pain (15-30% scroll)
"יש תקופות עם פניות
ויש תקופות שפחות."

Phase 3 - Confusion (30-50% scroll)
"לא תמיד ברור:
מה באמת מביא לקוחות?
על מה שווה להשקיע?
ומה סתם שטויות..."

Phase 4 - Problem (50-65% scroll)
"הפתרונות הקיימים היום דורשים:
הרבה כסף
הרבה ניהול שוטף
הרבה ידע."

Phase 5 - Mismatch (65-75% scroll)
"וזה לא מותאם לאופן שבו עסק קטן באמת מתנהל."

Phase 6 - Tease (75-90% scroll)
"אם אתם מחפשים שיווק אמיתי
שמתאים בדיוק לאופן שבו עסק קטן מתנהל."

Phase 7 - Arrival (90-100% scroll)
"הגעתם למקום הנכון."
(Dramatic large letter reveal)
```

### Visual Progression

| Phase | Background | Particles | Grid | Text Style |
|-------|------------|-----------|------|------------|
| 1-2 | Dark | Sparse, slow | Faint | Normal typewriter |
| 3-4 | Dark | Medium density | Visible | Questions emphasized |
| 5-6 | Dark → lighter | Dense, faster | Strong | Transition feeling |
| 7 | Bright accent | Burst | Fades | HUGE letters |

---

## Component Architecture

```
website/components/sections/scrollytelling/
├── index.ts                    # Barrel export
├── ScrollytellingSection.tsx   # Main container with ScrollTrigger
├── TypewriterText.tsx          # Custom typewriter component
├── ParticleField.tsx           # CSS particle system
├── GridPattern.tsx             # Background grid
├── DramaticReveal.tsx          # Final "הגעתם למקום הנכון" reveal
└── useScrollProgress.ts        # Custom hook for scroll progress
```

### ScrollTrigger Setup

```typescript
// ScrollytellingSection.tsx
useGSAP(() => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.current,
      start: "top top",
      end: "+=5000", // 5000px of scroll distance
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    }
  });

  // Add phases to timeline
  timeline
    .to(progressRef, { value: 0.15 }, "phase1")
    .to(progressRef, { value: 0.30 }, "phase2")
    // ... etc
}, { scope: containerRef });
```

---

## Mobile Considerations

1. **Reduced particles**: 20-30 instead of 50-100
2. **Simplified grid**: Larger cells, fewer dots
3. **Faster scroll**: Shorter total scroll distance (3000px vs 5000px)
4. **Touch-friendly**: No hover states relied upon
5. **prefers-reduced-motion**: Static text reveal, no particles

---

## Performance Budget

| Metric | Target | Fallback |
|--------|--------|----------|
| FPS during scroll | 60fps | 30fps acceptable |
| JS bundle addition | <20KB | Lazy load if larger |
| Paint operations | Compositor only | Reduce particles |
| Memory | <50MB for particles | Use CSS only |

---

## Dependencies

**Already in project:**
- GSAP 3.14.2
- ScrollTrigger
- @gsap/react (useGSAP hook)

**No new dependencies needed**

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| RTL typewriter bugs | Medium | Thorough testing, fallback to word-by-word |
| Performance on mobile | Medium | Progressive enhancement, reduce particles |
| Safari ScrollTrigger issues | Low | Test early, use will-change sparingly |
| Hebrew character rendering | Low | Use Heebo font (already in project) |

---

*Research completed: 2026-02-10*
*Ready for implementation planning*
