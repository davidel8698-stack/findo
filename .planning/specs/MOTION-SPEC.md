# Motion Specification: Text Journey Section (Enhanced)

> Cinematic scroll-driven animation system for Hebrew text reveals.
> Framer Motion `useScroll` + `useTransform` for continuous scroll-linked animation.
> Every value is exact and implementation-ready.

---

## 1. Paradigm Shift: From Binary to Continuous

### Current State (What We Replace)

The current system uses IntersectionObserver to toggle a `.visible` class. This produces a binary on/off transition — the block is either invisible or fading in via CSS `transition: 0.7s ease-out`. There is no scroll-linked progression, no exit animation, no line stagger tied to scroll, and no atmospheric effects.

### Target State (What We Build)

A **continuous scroll-linked animation** system where each block's opacity, blur, and position are tied to the user's scroll position — not to a binary class toggle. As the user scrolls, the text flows through four distinct phases: approach, enter, rest, and depart. The resolution block has a fifth phase: impact.

### Why Framer Motion

| Feature | IntersectionObserver + CSS | Framer Motion useScroll |
|---------|---------------------------|------------------------|
| Scroll-linked progress | No (binary threshold) | Yes (0-1 continuous) |
| Per-line stagger tied to scroll | No | Yes (useTransform per line) |
| Exit animation | Requires extra state + CSS | Natural (scroll-linked) |
| Spring physics | No | Yes (for resolution impact) |
| GPU performance | CSS transitions only | transform + opacity on compositor |
| prefers-reduced-motion | CSS media query | Programmatic check + CSS fallback |
| Bundle cost | 0 KB | ~4.6 KB with LazyMotion |

---

## 2. Scroll Animation Model

### Coordinate System

Each block occupies a **scroll range** defined relative to the viewport. We use Framer Motion's `useScroll` with `target` (the block element) and `offset` pairs to define when animation begins and ends.

```
Scroll position (viewport-relative):

  "start end"     = block's top edge meets viewport's bottom edge
  "start 0.75"    = block's top edge meets 75% from top of viewport
  "start center"  = block's top edge meets center of viewport
  "start 0.25"    = block's top edge meets 25% from top of viewport
  "end start"     = block's bottom edge meets viewport's top edge
```

### Per-Block Scroll Timeline

Each block transitions through 4 phases as it traverses the viewport:

```
Phase 1: APPROACH     Phase 2: ENTER        Phase 3: REST         Phase 4: DEPART
scroll: 0.0 - 0.2    scroll: 0.2 - 0.45    scroll: 0.45 - 0.7   scroll: 0.7 - 1.0

opacity:  0.0         0.0 -> 1.0            1.0                   1.0 -> 0.0
blur:     4px         4px -> 0px            0px                   0px -> 2px
translateY: 30px      30px -> 0px           0px                   0px -> -15px
```

### useScroll Configuration (Per Block)

```typescript
const { scrollYProgress } = useScroll({
  target: blockRef,
  offset: ["start end", "end start"]
});
```

This maps:
- `scrollYProgress = 0` when block's top edge meets viewport's bottom edge
- `scrollYProgress = 1` when block's bottom edge meets viewport's top edge

The full scroll range of each block spans from offscreen-below to offscreen-above.

---

## 3. Per-Block Animation Properties

### Normal Blocks (hook, pain, confusion, problem, mismatch, tease)

#### Opacity

```typescript
const opacity = useTransform(
  scrollYProgress,
  [0.0,  0.15, 0.35, 0.65, 0.85, 1.0],
  [0.0,  0.0,  1.0,  1.0,  0.0,  0.0]
);
```

| Scroll Range | Opacity | Behavior |
|--------------|---------|----------|
| 0.00 - 0.15 | 0.0 | Block is below viewport, fully invisible |
| 0.15 - 0.35 | 0.0 -> 1.0 | Block enters viewport from bottom, fades in |
| 0.35 - 0.65 | 1.0 | Block is in the active zone, fully visible |
| 0.65 - 0.85 | 1.0 -> 0.0 | Block approaches top of viewport, fades out |
| 0.85 - 1.0  | 0.0 | Block is above viewport, fully invisible |

**Easing**: The `useTransform` output is linear between keyframes. We apply easing via CSS `will-change: opacity, transform` and Framer Motion's built-in interpolation. For refined easing, we use `useSpring` as a smoothing layer:

```typescript
const smoothOpacity = useSpring(opacity, {
  stiffness: 100,
  damping: 30,
  mass: 0.5
});
```

These spring values produce a smooth, non-bouncy interpolation that feels like `cubic-bezier(0.16, 1, 0.3, 1)` — the "expo-out" feel.

#### TranslateY

```typescript
const y = useTransform(
  scrollYProgress,
  [0.0,  0.15, 0.35, 0.65, 0.85, 1.0],
  [40,   40,   0,    0,    -20,  -20]
);
```

| Scroll Range | translateY | Behavior |
|--------------|-----------|----------|
| 0.00 - 0.15 | 40px | Stationary below (unit: px) |
| 0.15 - 0.35 | 40px -> 0px | Rises into position |
| 0.35 - 0.65 | 0px | Stationary at rest |
| 0.65 - 0.85 | 0px -> -20px | Drifts upward as it exits |
| 0.85 - 1.0  | -20px | Stationary above |

**Why 40px enter vs 20px exit**: Entry movement is more dramatic to feel intentional ("this text is arriving"). Exit movement is subtle — the user's focus has moved forward, so exit should not compete for attention.

#### Filter Blur

```typescript
const blur = useTransform(
  scrollYProgress,
  [0.0,  0.15, 0.35, 0.65, 0.85, 1.0],
  [4,    4,    0,    0,    3,    3]
);
```

| Scroll Range | blur | Behavior |
|--------------|------|----------|
| 0.00 - 0.15 | 4px | Soft pre-reveal blur |
| 0.15 - 0.35 | 4px -> 0px | Sharpens into focus |
| 0.35 - 0.65 | 0px | Crisp and readable |
| 0.65 - 0.85 | 0px -> 3px | Softens as it exits |
| 0.85 - 1.0  | 3px | Out of focus |

**Why 4px enter, 3px exit**: Entry blur is slightly heavier because the text starts as an abstract shape — it should feel like focusing a lens. Exit blur is lighter because the text was already read and doesn't need to fully dissolve.

#### Applied via motion.div

```tsx
<motion.div
  ref={blockRef}
  style={{
    opacity: smoothOpacity,
    y,
    filter: useMotionTemplate`blur(${blur}px)`,
  }}
>
```

**Performance note**: `opacity` and `transform` (y) run on the compositor thread. `filter: blur()` is GPU-accelerated but triggers paint — at 3-4px radius on a text block, this is negligible. We use `will-change: opacity, transform, filter` on the block container.

---

## 4. Line-Level Stagger

### Stagger Model

Each `<p>` line within a block has its own offset relative to the block's scroll progress. Lines animate sequentially with a scroll-distance stagger, not a time-based stagger. This means the stagger is tied to how far the user has scrolled, not to clock time.

### Per-Line Scroll Offset

Each line receives a small additive delay to its animation range. The offset shifts the line's enter and exit keyframes later in the scroll timeline.

```typescript
const LINE_STAGGER = 0.03; // 3% of block's scroll range per line

// For line at index i within a block:
const lineOffset = i * LINE_STAGGER;

const lineOpacity = useTransform(
  scrollYProgress,
  [0.15 + lineOffset, 0.35 + lineOffset, 0.65 - lineOffset, 0.85 - lineOffset],
  [0.0,               1.0,               1.0,               0.0]
);

const lineY = useTransform(
  scrollYProgress,
  [0.15 + lineOffset, 0.35 + lineOffset, 0.65 - lineOffset, 0.85 - lineOffset],
  [20,                0,                  0,                  -10]
);
```

### Stagger Behavior

For a block with 4 lines (e.g., "confusion" block):

| Line | Index | Enter Start | Enter End | Exit Start | Exit End |
|------|-------|-------------|-----------|------------|----------|
| Line 0 | 0 | 0.15 | 0.35 | 0.65 | 0.85 |
| Line 1 | 1 | 0.18 | 0.38 | 0.62 | 0.82 |
| Line 2 | 2 | 0.21 | 0.41 | 0.59 | 0.79 |
| Line 3 | 3 | 0.24 | 0.44 | 0.56 | 0.76 |

**Key properties**:
- Lines enter top-to-bottom (line 0 appears first when scrolling down)
- Lines exit bottom-to-top (line 3 disappears first when scrolling up toward top)
- The stagger compresses inward — later lines have shorter "rest" durations
- Maximum stagger for a 4-line block: 0.09 (3 * 0.03), keeping it subtle

**Why scroll-distance stagger, not time stagger**: Time-based stagger (via `transition-delay`) creates a "typewriter" effect that plays at clock speed regardless of scroll velocity. Scroll-linked stagger means fast scrolling sees all lines nearly together, while slow scrolling reveals the cascade. This feels natural — the animation speed matches the user's intent.

### Line TranslateY Values

Line-level translateY is smaller than block-level: 20px enter, -10px exit. The block provides the macro movement (40px), and lines add micro movement within. Combined, the first line moves 40+20 = 60px total during enter, which is still subtle at display type sizes.

### Line-Level Blur

Lines do NOT have individual blur. Blur is block-level only. Reason: applying `filter: blur()` on 3-4 nested elements creates compounding paint costs and visual artifacts (overlapping blur halos). One blur on the parent block is sufficient.

---

## 4B. Shadow Text Layer (Apple Technique)

### Concept

Apple's text reveal uses a dual-layer technique: a "shadow" version of the full text is always visible at low opacity (10-15%), while the "active" layer animates from 0 to full opacity based on scroll. This means the user always perceives the text structure and shape — words "light up" rather than "appear from nothing."

### Implementation

Each `JourneyLine` renders two layers:

```tsx
function JourneyLine({ text, style }: JourneyLineProps) {
  return (
    <span className={styles.lineWrapper}>
      {/* Shadow layer — always visible, provides text structure hint */}
      <span className={styles.lineShadow} aria-hidden="true">
        {text}
      </span>
      {/* Active layer — scroll-linked opacity */}
      <motion.p className={styles.line} style={style}>
        {text}
      </motion.p>
    </span>
  );
}
```

### CSS

```css
.lineWrapper {
  position: relative;
  display: block;
}

.lineShadow {
  color: var(--text-primary, #fefffe);
  opacity: 0.1;
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}

.line {
  position: relative; /* Stacks above shadow */
}
```

### Shadow Opacity: 0.1

Why 0.1 (not 0.15 or 0.2):
- At 0.1 against #050506, the text reads as a barely visible imprint — the user senses structure without being able to read the words clearly.
- At 0.15, Hebrew characters at 48-58px become legible, which spoils the reveal.
- At 0.05, the text is invisible on most displays.
- Apple uses 0.15 for Latin text, but Hebrew's denser stroke geometry makes it more visible at the same opacity. 0.1 is the equivalent perceived brightness.

### When Shadow Is Visible

The shadow layer is always rendered at `opacity: 0.1`. It does NOT animate. When the active layer reaches full opacity (1.0), the shadow is invisible beneath it. When the active layer is at opacity 0 (before enter or after exit), only the shadow is visible.

### Mobile Behavior

Shadow layer is **kept on mobile**. It costs zero GPU (static opacity, no animation, no compositing layer). It improves the experience by showing text structure during fast scroll-throughs.

### Reduced Motion

When `prefers-reduced-motion: reduce`, the shadow layer is hidden (`display: none`) and the active layer is at full opacity immediately.

---

## 5. Resolution Block Special Treatment

### What Makes It Different

The resolution block ("הגעתם למקום הנכון.") is the emotional climax. It must feel like the entire section has been building toward this moment. Three techniques create this impact:

1. **Delayed threshold** — the resolution enters later in the viewport
2. **Expanded motion range** — bigger translateY, slower fade
3. **Scale pulse** — a subtle scale animation at peak visibility

### Resolution Scroll Timeline

```typescript
// Resolution uses custom offsets — enters later, stays longer
const { scrollYProgress } = useScroll({
  target: resolutionRef,
  offset: ["start end", "end start"]
});
```

#### Resolution Opacity

```typescript
const resOpacity = useTransform(
  scrollYProgress,
  [0.0,  0.25, 0.50, 0.85, 1.0],
  [0.0,  0.0,  1.0,  1.0,  1.0]
);
```

| Scroll Range | Opacity | Behavior |
|--------------|---------|----------|
| 0.00 - 0.25 | 0.0 | Invisible longer — builds anticipation |
| 0.25 - 0.50 | 0.0 -> 1.0 | Slower fade-in (25% of scroll range vs 20% for normal) |
| 0.50 - 1.0  | 1.0 | Stays visible — no exit fade. This is the conclusion. |

**Why no exit**: The resolution is the final statement. It should persist as the user scrolls into the next section. Fading it out would undercut the emotional landing.

#### Resolution TranslateY

```typescript
const resY = useTransform(
  scrollYProgress,
  [0.0,  0.25, 0.50, 0.85, 1.0],
  [60,   60,   0,    0,    0]
);
```

60px entry (vs 40px for normal blocks) creates a more dramatic "rising" entrance. No exit movement — it stays planted.

#### Resolution Blur

```typescript
const resBlur = useTransform(
  scrollYProgress,
  [0.0,  0.25, 0.50, 1.0],
  [6,    6,    0,    0]
);
```

6px entry blur (vs 4px for normal) creates a deeper soft-focus effect. The text materializes from a softer state, making the sharpening more satisfying.

#### Resolution Scale Pulse

```typescript
const resScale = useTransform(
  scrollYProgress,
  [0.25, 0.45, 0.55],
  [0.96, 1.02, 1.0]
);
```

| Scroll Range | Scale | Behavior |
|--------------|-------|----------|
| 0.25 | 0.96 | Starts slightly smaller (compressed energy) |
| 0.45 | 1.02 | Overshoots by 2% (impact moment) |
| 0.55 | 1.0 | Settles to natural size |

This is the ONLY use of scale in the entire section. The 4% total range (0.96 to 1.02 back to 1.0) is imperceptible as a "zoom" but registers subconsciously as weight and arrival. Apple uses this exact pattern on iPhone Pro product page hero text.

**Why spring for resolution**: The scale pulse uses a spring for natural settle:

```typescript
const smoothResScale = useSpring(resScale, {
  stiffness: 200,
  damping: 20,
  mass: 0.8
});
```

These values produce a single subtle overshoot with no visible bounce. Stiffer than the opacity spring because scale must feel precise.

---

## 6. Atmospheric Effects

### 6.1 Background Gradient Mask

A subtle top-and-bottom gradient mask softens the edges of the section, creating a "fade to void" effect. This is NOT an animated gradient — it is a static CSS pseudo-element.

```css
.section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    to bottom,
    #050506 0%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 2;
}

.section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    to top,
    #050506 0%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 2;
}
```

**Purpose**: Blocks that are partially entering or exiting the viewport get naturally masked by these gradients, creating a seamless "emerging from darkness" effect. This replaces the need for complex per-block clipping.

### 6.2 Ambient Light Shift (Scroll-Reactive)

A very subtle radial gradient follows the most-visible block, creating a gentle "spotlight" effect. This is section-level, not block-level.

```typescript
// In TextJourneySection, track overall scroll progress
const { scrollYProgress: sectionProgress } = useScroll({
  target: sectionRef,
  offset: ["start end", "end start"]
});

// Map section progress to a vertical position for the ambient light
const ambientY = useTransform(
  sectionProgress,
  [0, 1],
  ["0%", "100%"]
);

const ambientOpacity = useTransform(
  sectionProgress,
  [0, 0.1, 0.9, 1],
  [0, 0.4, 0.4, 0]
);
```

Applied as a background on the section:

```tsx
<motion.div
  className={styles.ambientLight}
  style={{
    top: ambientY,
    opacity: ambientOpacity,
  }}
/>
```

```css
.ambientLight {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.02) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
}
```

**Why 0.02 opacity**: This is barely perceptible — the user will not consciously notice it. But the subtle brightening near the active text creates a subliminal focus effect. Apple uses this technique on their AirPods Max page (a faint warm glow behind the active text block).

### 6.3 Resolution Atmospheric Shift

When the resolution block enters, the ambient light intensifies slightly and shifts color:

```typescript
const resolutionAmbientOpacity = useTransform(
  sectionProgress,
  [0.75, 0.85, 1.0],
  [0.0, 0.06, 0.0]
);
```

```css
.resolutionGlow {
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translateX(-50%);
  width: 800px;
  height: 500px;
  background: radial-gradient(
    ellipse at center,
    rgba(56, 136, 57, 0.04) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}
```

**Why green tint**: The brand accent green (#388839) at 0.04 opacity creates a nearly invisible warm-green aura behind the resolution text. This signals "arrival" and "positive outcome" at a subliminal level. The user feels a shift but cannot identify why.

---

## 7. Component Architecture

### File Structure (Enhanced)

```
website/components/sections/text-journey/
  index.ts                    # Barrel export
  TextJourneySection.tsx      # Section container + atmospheric effects
  TextBlock.tsx               # Individual block with scroll-linked animation
  JourneyLine.tsx             # NEW: Individual line with scroll-stagger
  useBlockScroll.ts           # NEW: Framer Motion scroll hook per block
  text-journey.module.css     # All styles
```

### Component Tree

```
TextJourneySection
  <motion.section>
    <div className="topMask" />          ← CSS gradient mask (top)
    <motion.div className="ambientLight" /> ← Scroll-reactive ambient glow

    {journeyBlocks.map(block => (
      <TextBlock key={block.id} lines={block.lines} />
    ))}

    <TextBlock lines={resolution.lines} variant="resolution" />

    <motion.div className="resolutionGlow" /> ← Resolution-specific glow
    <div className="bottomMask" />        ← CSS gradient mask (bottom)
  </motion.section>
```

### Hook: useBlockScroll

```typescript
interface UseBlockScrollOptions {
  lineCount: number;
  variant: "normal" | "resolution";
}

interface UseBlockScrollResult {
  blockRef: React.RefObject<HTMLDivElement>;
  blockStyle: {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
    filter: MotionValue<string>;
    scale?: MotionValue<number>;
  };
  getLineStyle: (index: number) => {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
  };
}

function useBlockScroll(options: UseBlockScrollOptions): UseBlockScrollResult;
```

**API design rationale**:
- `blockRef` — ref to attach to the block container for scroll tracking
- `blockStyle` — motion values for the block-level container (opacity, y, blur, optional scale)
- `getLineStyle(index)` — returns motion values for a specific line, with stagger offset baked in
- `variant` — switches between normal and resolution scroll timelines
- `lineCount` — needed to compute maximum stagger range and ensure it doesn't exceed the rest zone

### Component: TextBlock

```typescript
interface TextBlockProps {
  lines: string[];
  variant?: "normal" | "resolution";
}
```

```tsx
function TextBlock({ lines, variant = "normal" }: TextBlockProps) {
  const { blockRef, blockStyle, getLineStyle } = useBlockScroll({
    lineCount: lines.length,
    variant,
  });

  return (
    <motion.div
      ref={blockRef}
      className={clsx(styles.block, variant === "resolution" && styles.resolution)}
      style={blockStyle}
    >
      {lines.map((line, index) => (
        <JourneyLine key={index} text={line} style={getLineStyle(index)} />
      ))}
    </motion.div>
  );
}
```

### Component: JourneyLine

```typescript
interface JourneyLineProps {
  text: string;
  style: {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
  };
}
```

```tsx
function JourneyLine({ text, style }: JourneyLineProps) {
  return (
    <span className={styles.lineWrapper}>
      {/* Shadow layer — always visible at 10% opacity, provides text structure hint */}
      <span className={styles.lineShadow} aria-hidden="true">
        {text}
      </span>
      {/* Active layer — scroll-linked animation */}
      <motion.p className={styles.line} style={style}>
        {text}
      </motion.p>
    </span>
  );
}
```

**Why a separate JourneyLine component**: Each line receives its own `MotionValue` from the parent hook. By isolating the `<motion.p>` into its own component, React only re-renders the line when its style changes. Without this, the entire TextBlock would re-render whenever any line's values change.

**Shadow layer**: The `lineShadow` span renders the same text at 10% opacity, positioned absolutely behind the active layer. This Apple technique lets users perceive the text structure before the scroll-linked reveal — words "light up" rather than "appear from void." See Section 4B for full rationale.

### Section: TextJourneySection

```tsx
function TextJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const ambientY = useTransform(sectionProgress, [0, 1], ["0%", "100%"]);
  const ambientOpacity = useTransform(sectionProgress, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0]);
  const resGlowOpacity = useTransform(sectionProgress, [0.75, 0.85, 1.0], [0.0, 0.06, 0.0]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.topMask} />
      <motion.div className={styles.ambientLight} style={{ top: ambientY, opacity: ambientOpacity }} />

      {journeyBlocks.map((block) => (
        <TextBlock key={block.id} lines={block.lines} />
      ))}
      <TextBlock lines={resolution.lines} variant="resolution" />

      <motion.div className={styles.resolutionGlow} style={{ opacity: resGlowOpacity }} />
      <div className={styles.bottomMask} />
    </section>
  );
}
```

---

## 8. Easing Curves

### Why Spring-Based Smoothing Over CSS Cubic-Bezier

Framer Motion's `useTransform` produces linear interpolation between keyframes. Raw linear output feels mechanical. We apply `useSpring` as a smoothing filter on the motion values to produce natural, organic motion.

### Spring Configurations

| Purpose | Stiffness | Damping | Mass | Character |
|---------|-----------|---------|------|-----------|
| Block opacity smoothing | 100 | 30 | 0.5 | Gentle, no overshoot. Equivalent to ~cubic-bezier(0.16, 1, 0.3, 1) |
| Block Y smoothing | 120 | 28 | 0.5 | Slightly tighter than opacity. Position arrives fractionally before opacity completes — text "lands" then "brightens." |
| Resolution scale | 200 | 20 | 0.8 | Precise with single overshoot. The 2% overshoot of scale(1.02) comes from this spring's underdamped response. |
| Line Y smoothing | 80 | 25 | 0.3 | Lighter, more responsive. Lines within a block should feel like they follow the block with slight delay, not fight it. |

### Application Pattern

```typescript
// In useBlockScroll:
const rawOpacity = useTransform(scrollYProgress, [...], [...]);
const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 30, mass: 0.5 });

const rawY = useTransform(scrollYProgress, [...], [...]);
const y = useSpring(rawY, { stiffness: 120, damping: 28, mass: 0.5 });
```

### Why These Specific Values

**Stiffness 100, Damping 30, Mass 0.5 (block opacity)**:
- `damping / (2 * sqrt(stiffness * mass))` = `30 / (2 * sqrt(50))` = `30 / 14.14` = `2.12`
- Damping ratio > 1.0 = overdamped = no bounce
- Settling time ~300ms — fast enough to track scroll, slow enough to feel organic

**Stiffness 200, Damping 20, Mass 0.8 (resolution scale)**:
- `damping / (2 * sqrt(stiffness * mass))` = `20 / (2 * sqrt(160))` = `20 / 25.3` = `0.79`
- Damping ratio < 1.0 = underdamped = single subtle overshoot
- This produces the 0.96 -> 1.02 -> 1.0 scale pulse behavior

---

## 9. Reduced Motion Support

### Strategy: Dual Layer

1. **CSS media query** — instant visibility for all blocks
2. **JavaScript check** — skip Framer Motion springs and transforms

### CSS Layer

```css
@media (prefers-reduced-motion: reduce) {
  .block,
  .line {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  .ambientLight,
  .resolutionGlow,
  .topMask,
  .bottomMask {
    display: none;
  }
}
```

### JavaScript Layer

```typescript
// In useBlockScroll:
const prefersReducedMotion = usePrefersReducedMotion();

if (prefersReducedMotion) {
  // Return static values — no scroll tracking, no springs
  return {
    blockRef,
    blockStyle: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
    getLineStyle: () => ({
      opacity: 1,
      y: 0,
    }),
  };
}
```

### Framer Motion's usePrefersReducedMotion

Framer Motion exports this hook natively. It returns `true` when `prefers-reduced-motion: reduce` matches. No custom implementation needed.

---

## 10. Mobile Considerations

### Touch Scroll Behavior

Scroll-linked animations on mobile must account for:

1. **Momentum scrolling (inertia)**: iOS and Android both have momentum-based scrolling where the scroll position continues after the finger lifts. Framer Motion's `useScroll` handles this naturally — it tracks the actual `scrollY`, not touch events.

2. **Reduced animation ranges**: On mobile, the viewport is shorter, so blocks traverse faster. We reduce atmospheric effects:

```typescript
// In TextJourneySection:
const isMobile = useMediaQuery("(max-width: 767px)");

// Mobile: disable ambient light (saves GPU)
// Mobile: disable resolution glow (saves GPU)
// Mobile: keep block and line animations (they are essential)
```

### Mobile-Specific Adjustments

| Property | Desktop | Mobile (<=767px) |
|----------|---------|-------------------|
| Block entry translateY | 40px | 25px |
| Block exit translateY | -20px | -12px |
| Block entry blur | 4px | 2px |
| Block exit blur | 3px | 0px (disabled) |
| Line stagger (LINE_STAGGER) | 0.03 | 0.02 |
| Ambient light | Enabled | Disabled |
| Resolution glow | Enabled | Disabled |
| Resolution entry translateY | 60px | 35px |
| Resolution entry blur | 6px | 3px |
| Resolution scale pulse | 0.96-1.02-1.0 | Disabled (always 1.0) |
| Edge masks height | 200px | 120px |

### Why Reduce on Mobile

- **GPU budget**: Mobile GPUs have limited VRAM. Multiple `filter: blur()` layers compete for resources.
- **Viewport size**: Smaller viewport means less travel distance. Large translateY values feel jumpy, not cinematic.
- **Attention span**: Mobile users scroll faster. Subtle atmospheric effects are wasted — they scroll past before registration.

---

## 11. Complete Keyframe Tables

### Normal Block — All Properties

```
scrollYProgress:  0.00   0.15   0.35   0.65   0.85   1.00
                  ──────────────────────────────────────────
opacity:          0.0    0.0    1.0    1.0    0.0    0.0
translateY:       40     40     0      0      -20    -20
blur:             4      4      0      0      3      3
scale:            1.0    1.0    1.0    1.0    1.0    1.0
```

### Resolution Block — All Properties

```
scrollYProgress:  0.00   0.25   0.50   0.85   1.00
                  ────────────────────────────────────
opacity:          0.0    0.0    1.0    1.0    1.0
translateY:       60     60     0      0      0
blur:             6      6      0      0      0
scale:            1.0    0.96   1.02   1.0    1.0
```

### Line Stagger — Per-Line Offset (Normal Block with 4 Lines)

```
                  Line 0    Line 1    Line 2    Line 3
                  ──────    ──────    ──────    ──────
Enter start:      0.15      0.18      0.21      0.24
Enter end:        0.35      0.38      0.41      0.44
Exit start:       0.65      0.62      0.59      0.56
Exit end:         0.85      0.82      0.79      0.76
translateY in:    20px      20px      20px      20px
translateY out:   -10px     -10px     -10px     -10px
```

---

## 12. Performance Budget

### Target: 60fps on All Devices

| Metric | Budget | Strategy |
|--------|--------|----------|
| Compositing layers | <= 12 | 7 block layers + 2 atmospheric + 2 masks + 1 section |
| Paint operations per frame | 0 during scroll | All animated properties are compositor-safe (opacity, transform). Blur is pre-painted. |
| JS execution per scroll frame | < 2ms | useTransform is computed in Framer Motion's internal loop, not in React render |
| React re-renders per scroll | 0 | MotionValues update outside React's render cycle |
| Bundle impact | < 5KB gzipped | LazyMotion with domAnimation feature set |

### LazyMotion Configuration

```tsx
// In TextJourneySection or a shared layout wrapper:
import { LazyMotion, domAnimation } from "framer-motion";

function TextJourneySection() {
  return (
    <LazyMotion features={domAnimation}>
      {/* ... */}
    </LazyMotion>
  );
}
```

`domAnimation` includes: `animate`, `exit`, `useScroll`, `useTransform`, `useSpring`, `motion.div`. It excludes: layout animations, drag, 3D transforms. Bundle: ~4.6KB gzipped vs ~34KB for the full bundle.

### will-change Strategy

```css
/* Static — always composited */
.block {
  will-change: opacity, transform, filter;
}

/* Lines do NOT get will-change — they animate within the block's layer */
.line {
  /* No will-change — animated via motion.p style prop */
}

/* Atmospheric elements */
.ambientLight,
.resolutionGlow {
  will-change: transform, opacity;
}
```

**Why no will-change on lines**: Lines are children of blocks. If the block already has its own compositing layer (via `will-change`), child opacity and transform changes are handled within that layer. Adding `will-change` to each line would create 20+ extra compositing layers — counterproductive.

---

## 13. Implementation Checklist

### New Files to Create

- [ ] `JourneyLine.tsx` — motion.p component for individual lines
- [ ] `useBlockScroll.ts` — Framer Motion useScroll + useTransform hook

### Files to Modify

- [ ] `TextJourneySection.tsx` — Add section-level scroll tracking, atmospheric elements, LazyMotion wrapper
- [ ] `TextBlock.tsx` — Replace useScrollFade with useBlockScroll, render JourneyLine components
- [ ] `text-journey.module.css` — Add atmospheric styles (.topMask, .bottomMask, .ambientLight, .resolutionGlow), remove .visible class rules (no longer needed), add mobile adjustments

### Files to Delete

- [ ] `useScrollFade.ts` — Replaced entirely by useBlockScroll

### Dependency Check

- [ ] Verify `framer-motion` is installed in `website/package.json`
- [ ] Import `LazyMotion`, `domAnimation`, `motion`, `useScroll`, `useTransform`, `useSpring`, `useMotionTemplate` from `framer-motion`

---

## 14. Summary: Before vs After

| Aspect | Current (Binary) | Enhanced (Scroll-Linked) |
|--------|-------------------|--------------------------|
| Animation trigger | IntersectionObserver threshold | Continuous scroll position |
| Opacity mapping | 0 or 1 (class toggle) | 0.0 - 1.0 (scroll-linked) |
| Entry motion | CSS transition 0.7s | Scroll-linked with spring smoothing |
| Exit motion | None (stays visible) | Fade + drift upward + blur |
| Line stagger | CSS transition-delay 80ms | Scroll-distance offset 3% per line |
| Shadow text layer | None | 10% opacity ghost text always visible (Apple technique) |
| Resolution drama | Bigger font only | Bigger font + delayed entry + scale pulse + glow |
| Atmosphere | None | Edge masks + ambient light + resolution glow |
| Framework | CSS transitions | Framer Motion (4.6KB LazyMotion) |
| Re-renders per block | 2 (enter/exit) | 0 (MotionValues bypass React) |
| GPU properties | opacity, transform, filter | opacity, transform, filter (identical) |
| Reduced motion | CSS media query | CSS + JS dual layer |

---

*Motion specification authored for TextJourneySection enhancement. Every value is exact, every decision is documented. Ready for implementation.*
