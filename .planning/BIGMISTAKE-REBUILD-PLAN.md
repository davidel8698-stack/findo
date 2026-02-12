# BigMistakeSection -- Pixel-Perfect Rebuild Plan

> **Author:** plan-writer
> **Date:** 2026-02-11
> **Based on:** BIGMISTAKE-LINEAR-ANALYSIS.md + BIGMISTAKE-GAP-ANALYSIS.md
> **Target:** Screenshot 03 "Made for Modern Teams" (Pattern A)
> **Direction:** RTL (Hebrew)

---

## Section 1: EXACT Component Structure (JSX)

### Complete JSX Tree

```tsx
"use client";

import { useRef } from "react";
import { m, useInView } from "motion/react";
import styles from "./big-mistake.module.css";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── SVG Illustrations for Card Visual Areas ── */

/**
 * Abstract illustration: coins, click cursor, declining graph
 * All strokes in monochrome dark grays (#2a2b2f to #3a3b3f)
 */
function PaidAdIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Declining graph line */}
      <path d="M40 40 L100 55 L160 80 L220 110 L260 130" stroke="#2a2b2f" strokeWidth="2" strokeLinecap="round" />
      {/* Graph dots */}
      <circle cx="40" cy="40" r="3" fill="#3a3b3f" />
      <circle cx="100" cy="55" r="3" fill="#3a3b3f" />
      <circle cx="160" cy="80" r="3" fill="#3a3b3f" />
      <circle cx="220" cy="110" r="3" fill="#3a3b3f" />
      {/* Coin stack (left) */}
      <ellipse cx="60" cy="120" rx="18" ry="6" stroke="#2a2b2f" strokeWidth="1.5" />
      <ellipse cx="60" cy="114" rx="18" ry="6" stroke="#2a2b2f" strokeWidth="1.5" />
      <ellipse cx="60" cy="108" rx="18" ry="6" stroke="#2a2b2f" strokeWidth="1.5" />
      <line x1="42" y1="108" x2="42" y2="120" stroke="#2a2b2f" strokeWidth="1.5" />
      <line x1="78" y1="108" x2="78" y2="120" stroke="#2a2b2f" strokeWidth="1.5" />
      {/* Click cursor */}
      <path d="M200 50 L200 70 L208 65 L215 78" stroke="#2a2b2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dollar signs (subtle) */}
      <text x="140" y="55" fill="#1e1f22" fontSize="16" fontWeight="600" fontFamily="monospace">$</text>
      <text x="180" y="70" fill="#1a1b1e" fontSize="12" fontWeight="600" fontFamily="monospace">$</text>
    </svg>
  );
}

/**
 * Abstract illustration: calendar, growth curve, gears
 * All in monochrome dark grays
 */
function OrganicIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calendar outline */}
      <rect x="30" y="30" width="80" height="70" rx="4" stroke="#2a2b2f" strokeWidth="1.5" />
      <line x1="30" y1="48" x2="110" y2="48" stroke="#2a2b2f" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="50" y2="22" stroke="#2a2b2f" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="90" y1="30" x2="90" y2="22" stroke="#2a2b2f" strokeWidth="1.5" strokeLinecap="round" />
      {/* Calendar grid dots */}
      <circle cx="48" cy="62" r="2" fill="#2a2b2f" />
      <circle cx="70" cy="62" r="2" fill="#2a2b2f" />
      <circle cx="92" cy="62" r="2" fill="#2a2b2f" />
      <circle cx="48" cy="80" r="2" fill="#2a2b2f" />
      <circle cx="70" cy="80" r="2" fill="#2a2b2f" />
      <circle cx="92" cy="80" r="2" fill="#2a2b2f" />
      {/* Slow growth curve (right side) */}
      <path d="M140 120 C160 118 180 110 200 90 C220 70 240 55 260 50" stroke="#2a2b2f" strokeWidth="2" strokeLinecap="round" />
      {/* Gear (center-bottom) */}
      <circle cx="180" cy="130" r="12" stroke="#2a2b2f" strokeWidth="1.5" />
      <circle cx="180" cy="130" r="4" fill="#2a2b2f" />
      {/* Gear teeth */}
      <line x1="180" y1="116" x2="180" y2="112" stroke="#2a2b2f" strokeWidth="2" strokeLinecap="round" />
      <line x1="180" y1="144" x2="180" y2="148" stroke="#2a2b2f" strokeWidth="2" strokeLinecap="round" />
      <line x1="166" y1="130" x2="162" y2="130" stroke="#2a2b2f" strokeWidth="2" strokeLinecap="round" />
      <line x1="194" y1="130" x2="198" y2="130" stroke="#2a2b2f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Abstract illustration: target, checkmark, profile/business card
 * All in monochrome dark grays
 */
function DecisionIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Target rings */}
      <circle cx="80" cy="70" r="35" stroke="#2a2b2f" strokeWidth="1.5" />
      <circle cx="80" cy="70" r="22" stroke="#2a2b2f" strokeWidth="1.5" />
      <circle cx="80" cy="70" r="9" stroke="#2a2b2f" strokeWidth="1.5" />
      <circle cx="80" cy="70" r="3" fill="#3a3b3f" />
      {/* Checkmark (right side) */}
      <path d="M180 60 L195 78 L230 40" stroke="#3a3b3f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Business card outline */}
      <rect x="160" y="90" width="90" height="55" rx="4" stroke="#2a2b2f" strokeWidth="1.5" />
      {/* Profile circle in card */}
      <circle cx="185" cy="112" r="8" stroke="#2a2b2f" strokeWidth="1.5" />
      {/* Text lines in card */}
      <line x1="200" y1="108" x2="235" y2="108" stroke="#2a2b2f" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="200" y1="116" x2="225" y2="116" stroke="#2a2b2f" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="175" y1="132" x2="235" y2="132" stroke="#2a2b2f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Card Data ── */

interface CardData {
  id: string;
  label: string;
  Illustration: React.FC<{ className?: string }>;
  title: string;
  description: string;
  isFindo?: boolean;
}

const cards: CardData[] = [
  {
    id: "paid",
    label: "כמו שכירות",
    Illustration: PaidAdIllustration,
    title: "פרסום ממומן",
    description: "מביא תנועה כשמפעילים — נעצר כשנגמר הכסף.",
  },
  {
    id: "organic",
    label: "מרתון",
    Illustration: OrganicIllustration,
    title: "קידום אורגני",
    description: "מצוין לטווח ארוך — אבל דורש זמן ותהליך ותפעול.",
  },
  {
    id: "findo",
    label: "חיפוש מקומי (גוגל ביזנס)",
    Illustration: DecisionIllustration,
    title: "רגע ההחלטה",
    description: "הלקוח כבר רוצה פתרון. צריך רק רושם טוב + אמון + זמינות — ואז הלקוח פונה.",
    isFindo: true,
  },
];

/* ── Card Component ── */

function Card({
  card,
  index,
  inView,
}: {
  card: CardData;
  index: number;
  inView: boolean;
}) {
  return (
    <m.article
      className={card.isFindo ? styles.cardFindo : styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: 0.2 + index * 0.12,
        ease,
      }}
    >
      {/* Visual area — monochrome illustration */}
      <div className={styles.cardVisual}>
        <card.Illustration className={styles.cardIllustration} />
      </div>

      {/* Text content area */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <p className={styles.cardDesc}>{card.description}</p>
      </div>
    </m.article>
  );
}

/* ── Main Component ── */

export function BigMistakeSection() {
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Section Header — Split layout (RTL: headline RIGHT, description LEFT) */}
        <header ref={headerRef} className={styles.sectionHeader}>
          {/* Right column (start in RTL): eyebrow + headline */}
          <div className={styles.headerStart}>
            <m.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 8 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, ease }}
            >
              <span className={styles.eyebrowDot} />
              של רוב העסקים הקטנים
              <span className={styles.eyebrowArrow}>&rsaquo;</span>
            </m.p>

            <m.h2
              className={styles.displayTitle}
              initial={{ opacity: 0, y: 8 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.06, ease }}
            >
              הטעות הגדולה
            </m.h2>
          </div>

          {/* Left column (end in RTL): body text */}
          <m.div
            className={styles.headerEnd}
            initial={{ opacity: 0, y: 8 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.12, ease }}
          >
            <p className={styles.bodyText}>
              <strong>יש אפשרות שלישית.</strong>{" "}
              רוב בעלי העסקים חושבים שיש רק שתי דרכים להביא לקוחות — פרסום ממומן או קידום אורגני. אבל יש דרך שמתחילה בדיוק ברגע שבו הלקוח כבר מחפש פתרון.
            </p>
          </m.div>
        </header>

        {/* Card Grid — NO separator, NO glows */}
        <div ref={gridRef} className={styles.grid}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              index={index}
              inView={gridInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BigMistakeSection;
```

### Key Structural Changes from Current Code

1. **REMOVED:** `ambientGlow` div
2. **REMOVED:** `findoGlow` div
3. **REMOVED:** `shimmer` div and `findoBadge` span
4. **REMOVED:** `separator` div (gradient separator)
5. **REMOVED:** `indicatorRow`, `indicatorDot`, `cardLabel` elements inside cards
6. **REMOVED:** `icon` element inside cards
7. **REMOVED:** `cardFootnote` element
8. **REMOVED:** `cardInner` wrapper (replaced with `cardVisual` + `cardContent`)
9. **REMOVED:** `data-color` attribute on cards
10. **ADDED:** Split header with `headerStart` (eyebrow + headline) and `headerEnd` (body text)
11. **ADDED:** `eyebrowArrow` span with `>` character
12. **ADDED:** `cardVisual` area with SVG illustration per card
13. **ADDED:** `cardContent` area below the visual
14. **CHANGED:** Bold lead-in moved to START of body text: `<strong>יש אפשרות שלישית.</strong>` then rest follows
15. **CHANGED:** Body text content expanded for the split-column layout (needs to fill a ~50% column)

---

## Section 2: EXACT CSS Specifications

### Complete CSS File

```css
/* ==========================================================================
   BigMistakeSection — Linear-Grade Rebuild (Pattern A: Screenshot 03)

   Specifications:
   - Split header: headline RIGHT (RTL), description LEFT (RTL)
   - 3-column identical card grid
   - Cards with visual illustration area + text content
   - Zero shimmer, zero badge, zero glow, zero gradient separator
   - All cards identical containers (Findo only differs by subtle border tint)
   ========================================================================== */

/* --------------------------------------------------------------------------
   Section Container
   -------------------------------------------------------------------------- */

.section {
  background: #08090a;
  padding: 128px 24px;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
  position: relative;
}

/* --------------------------------------------------------------------------
   Section Header — Split Layout (RTL grid)

   In RTL: first column = RIGHT (headline), second column = LEFT (body text)
   Matches Linear Pattern A (Screenshot 03: "Made for Modern Teams")
   -------------------------------------------------------------------------- */

.sectionHeader {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: end;
  margin-bottom: 64px;
}

/* Right column in RTL (start side): contains eyebrow + headline */
.headerStart {
  /* No special styles needed — inherits RTL text-align from container */
}

/* Left column in RTL (end side): contains body text */
.headerEnd {
  /* Aligns to bottom of grid row via parent align-items: end */
}

/* --------------------------------------------------------------------------
   Eyebrow — Colored dot + text + arrow
   Linear pattern: [dot 8px] [text 13px gray] [> arrow]
   -------------------------------------------------------------------------- */

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Heebo', 'Noto Sans Hebrew', -apple-system, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.02em;
  margin: 0 0 20px;
}

.eyebrowDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #388839;
  flex-shrink: 0;
}

.eyebrowArrow {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
  margin-right: 2px;
}

/* --------------------------------------------------------------------------
   Display Title — "The Shout"
   48-52px, weight 600, pure white, tight tracking
   -------------------------------------------------------------------------- */

.displayTitle {
  font-family: 'Heebo', 'Noto Sans Hebrew', -apple-system, sans-serif;
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
  color: #ffffff;
}

/* --------------------------------------------------------------------------
   Body Text — "The Explain"
   18px, weight 400, muted at 0.6 opacity
   Bold lead-in at START: white, weight 600
   -------------------------------------------------------------------------- */

.bodyText {
  font-family: 'Heebo', 'Noto Sans Hebrew', -apple-system, sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0;
  max-width: 520px;
}

.bodyText strong {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
}

/* --------------------------------------------------------------------------
   Card Grid — 3 equal columns, 24px gap
   -------------------------------------------------------------------------- */

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: stretch;
}

/* --------------------------------------------------------------------------
   Base Card — Linear card surface material (ALL cards identical)

   background: rgba(255,255,255,0.05) approximately #131416
   border: 1px solid rgba(255,255,255,0.07)
   border-radius: 16px
   box-shadow: ambient + inner top-edge highlight
   transition: standard Linear easing for ALL properties
   -------------------------------------------------------------------------- */

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* --------------------------------------------------------------------------
   Findo Card — SAME container as other cards
   ONLY difference: very subtle green border tint (creative license)
   Everything else IDENTICAL
   -------------------------------------------------------------------------- */

.cardFindo {
  composes: card;
  border-color: rgba(56, 136, 57, 0.12);
}

.cardFindo:hover {
  transform: translateY(-4px);
  border-color: rgba(56, 136, 57, 0.18);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* --------------------------------------------------------------------------
   Card Visual Area — Top portion with SVG illustration
   Approximately 180-220px height, monochrome dark illustrations
   Separated from content by subtle border
   -------------------------------------------------------------------------- */

.cardVisual {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px;
  overflow: hidden;
}

.cardIllustration {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

/* --------------------------------------------------------------------------
   Card Content Area — Below the visual
   Title + description with standard padding
   -------------------------------------------------------------------------- */

.cardContent {
  padding: 24px 32px 32px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* --------------------------------------------------------------------------
   Card Typography — Opacity-based hierarchy
   Title: 20px, weight 600, pure white
   Description: 15px, weight 400, 0.55 opacity
   -------------------------------------------------------------------------- */

.cardTitle {
  font-family: 'Heebo', 'Noto Sans Hebrew', -apple-system, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
  line-height: 1.3;
}

.cardDesc {
  font-family: 'Heebo', 'Noto Sans Hebrew', -apple-system, sans-serif;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
  letter-spacing: 0;
  flex: 1;
}

/* --------------------------------------------------------------------------
   Focus States — Accessibility
   -------------------------------------------------------------------------- */

.card:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.3);
  outline-offset: 2px;
}

/* ==========================================================================
   Responsive — Tablet (768-1023px)

   - Header stacks vertically (single column)
   - Grid becomes 2 columns + Findo card spans full width
   - Reduced sizes
   ========================================================================== */

@media (max-width: 1023px) {
  .section {
    padding: 96px 20px;
  }

  .sectionHeader {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 56px;
  }

  .displayTitle {
    font-size: 44px;
  }

  .bodyText {
    font-size: 16px;
    max-width: 100%;
  }

  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .cardFindo {
    grid-column: 1 / -1;
  }

  .cardVisual {
    height: 160px;
  }

  .cardContent {
    padding: 20px 28px 28px;
  }

  .cardTitle {
    font-size: 18px;
  }
}

/* ==========================================================================
   Responsive — Mobile (<768px)

   - Single column everything
   - Smaller typography
   - Compressed spacing
   ========================================================================== */

@media (max-width: 767px) {
  .section {
    padding: 80px 16px;
  }

  .sectionHeader {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 48px;
  }

  .displayTitle {
    font-size: 36px;
    letter-spacing: -0.01em;
  }

  .eyebrow {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .bodyText {
    font-size: 16px;
    max-width: 100%;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .cardVisual {
    height: 140px;
  }

  .cardContent {
    padding: 20px 24px 24px;
  }
}

/* ==========================================================================
   Reduced Motion — Accessibility
   ========================================================================== */

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }

  .card:hover {
    transform: none;
  }
}
```

### CSS Changes Summary (What Changed vs Current)

#### REMOVED CSS Classes:
| Class | Reason |
|-------|--------|
| `.ambientGlow` | Linear has no radial glow in content sections |
| `.findoGlow` | Linear has no colored glows behind cards |
| `.shimmer` | Linear has no animated shimmer borders |
| `.shimmer::before` | Part of shimmer system |
| `@keyframes shimmerMove` | Part of shimmer system |
| `.findoBadge` | Linear has no badge overlays on cards |
| `.separator` | Linear uses whitespace, not gradient separators |
| `.cardInner` | Replaced by `.cardVisual` + `.cardContent` |
| `.indicatorRow` | Colored dots belong at section level only |
| `.indicatorDot` | Part of indicator system |
| `.cardLabel` | Part of indicator system |
| `.icon` | Replaced by illustration area |
| `.cardFindo .icon` | Removed with icon system |
| `.cardFindo .cardInner` (padding override) | All cards must have identical padding |
| `.card[data-color="orange"] .indicatorDot` | Multi-color indicator removed |
| `.card[data-color="blue"] .indicatorDot` | Multi-color indicator removed |
| `.card[data-color="green"] .indicatorDot` | Multi-color indicator removed |
| `.cardFootnote` | Italic footnotes are un-Linear |

#### ADDED CSS Classes:
| Class | Purpose |
|-------|---------|
| `.sectionHeader` (grid layout) | Split two-column header |
| `.headerStart` | Right column in RTL (headline) |
| `.headerEnd` | Left column in RTL (body text) |
| `.eyebrowArrow` | The `>` character after eyebrow text |
| `.cardVisual` | Top illustration area in cards |
| `.cardIllustration` | SVG illustration styling |
| `.cardContent` | Bottom text area in cards |

#### ADJUSTED CSS Values:
| Property | Old Value | New Value | Reason |
|----------|-----------|-----------|--------|
| `.sectionHeader` layout | `text-align: center` | `display: grid; grid-template-columns: 1fr 1fr` | Linear never centers headers |
| `.eyebrow` color | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.6)` | Match Linear 0.5-0.6 range |
| `.displayTitle` font-size | `52px` | `48px` | More consistent with screenshots |
| `.displayTitle` margin | `0 0 20px` | `0` | Inside headerStart, margin handled by grid gap |
| `.bodyText` color | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.6)` | Match Linear body text |
| `.bodyText` margin | `0 auto` (centered) | `0` | No centering in split layout |
| `.card` background | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.05)` | Slightly more visible, closer to #131416 |
| `.card` box-shadow | `inset 0 1px 0 rgba(255,255,255,0.04)` | `0 2px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)` | Added ambient shadow |
| `.card` transition | Mixed easings (bounce on transform) | `all 200ms cubic-bezier(0.16, 1, 0.3, 1)` | Uniform standard easing |
| `.cardFindo` border-color | `rgba(56,136,57,0.15)` | `rgba(56,136,57,0.12)` | More subtle |
| `.cardFindo` box-shadow | Green-tinted inset + green ambient | Same as base card | No colored shadows |
| `.cardFindo:hover` border-color | `rgba(56,136,57,0.25)` | `rgba(56,136,57,0.18)` | More subtle |
| `.cardFindo:hover` box-shadow | Green-tinted shadows | Same as base card hover | No colored shadows |
| `.cardTitle` color | `rgba(255,255,255,0.95)` | `#ffffff` | Linear uses pure white for titles |
| `.cardDesc` color | `rgba(255,255,255,0.5)` | `rgba(255,255,255,0.55)` | Slightly more readable |

---

## Section 3: Animation Specifications

### Easing Function

**ALL animations use the same easing:**
```ts
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
```

This is Linear's standard ease-out. No bounce, no spring, no variation.

### Header Animations

All header elements use `useInView` with `{ once: true, margin: "-80px" }`.

| Element | Initial State | Animate State | Duration | Delay | Easing |
|---------|---------------|---------------|----------|-------|--------|
| Eyebrow | `{ opacity: 0, y: 8 }` | `{ opacity: 1, y: 0 }` | 0.35s | 0s | `[0.16, 1, 0.3, 1]` |
| Display Title | `{ opacity: 0, y: 8 }` | `{ opacity: 1, y: 0 }` | 0.4s | 0.06s | `[0.16, 1, 0.3, 1]` |
| Body Text (headerEnd) | `{ opacity: 0, y: 8 }` | `{ opacity: 1, y: 0 }` | 0.35s | 0.12s | `[0.16, 1, 0.3, 1]` |

**Notes:**
- Y distance is `8px` for header elements (subtle, controlled)
- Stagger between elements: `0.06s`
- All durations between 0.35-0.4s (crisp, not lazy)

### Card Animations

All cards use `useInView` with `{ once: true, margin: "-60px" }`.

| Element | Initial State | Animate State | Duration | Delay | Easing |
|---------|---------------|---------------|----------|-------|--------|
| Card [0] | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | 0.4s | 0.2s | `[0.16, 1, 0.3, 1]` |
| Card [1] | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | 0.4s | 0.32s | `[0.16, 1, 0.3, 1]` |
| Card [2] | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | 0.4s | 0.44s | `[0.16, 1, 0.3, 1]` |

**Notes:**
- Y distance is `20px` for cards (slightly more travel than header)
- Base delay: `0.2s` (cards appear after header settles)
- Stagger between cards: `0.12s`
- Duration: `0.4s` (400ms — Linear's crisp feel)

### Card Hover Transition

```css
transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
```

**Properties that transition on hover:**
- `transform: translateY(-4px)` — lift
- `border-color` — brightens from 0.07 to 0.12 (base) or 0.12 to 0.18 (Findo)
- `box-shadow` — deepens

**NO bounce easing. NO spring overshoot. Standard ease-out only.**

---

## Section 4: Responsive Breakpoints

### Desktop (>= 1024px)

```
Layout:
  Section padding: 128px 24px
  Container: max-width 1200px, centered, direction RTL

  Header: 2-column grid (1fr 1fr), gap 64px, align-items: end
    Right column (start): eyebrow + headline
    Left column (end): body text

  Cards: 3-column grid (repeat(3, 1fr)), gap 24px
    All cards identical
    Card visual area: 200px height
    Card content: padding 24px 32px 32px

Typography:
  Eyebrow: 13px, weight 500, rgba(255,255,255,0.6)
  Headline: 48px, weight 600, #ffffff
  Body: 18px, weight 400, rgba(255,255,255,0.6), max-width 520px
  Card title: 20px, weight 600, #ffffff
  Card desc: 15px, weight 400, rgba(255,255,255,0.55)
```

### Tablet (768px - 1023px)

```
Changes from desktop:
  Section padding: 96px 20px

  Header: 1-column grid, gap 24px
    Stacks vertically: eyebrow + headline on top, body text below
    Body text max-width: 100% (fills width)

  Headline: 44px
  Body: 16px

  Cards: 2-column grid (1fr 1fr), gap 20px
    Findo card spans full width (grid-column: 1 / -1)
    Card visual area: 160px height
    Card content: padding 20px 28px 28px
    Card title: 18px
```

### Mobile (< 768px)

```
Changes from tablet:
  Section padding: 80px 16px

  Header: 1-column grid, gap 20px

  Headline: 36px, letter-spacing -0.01em
  Eyebrow: 12px, margin-bottom 16px
  Body: 16px

  Cards: 1-column grid, gap 16px
    All cards full width
    Card visual area: 140px height
    Card content: padding 20px 24px 24px
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  .card:hover { transform: none; }
}
```

Framer Motion animations will still run but with `duration: 0` via the `motion/react` library's built-in reduced-motion handling.

---

## Section 5: Data Structure

### Card Data Interface

```ts
interface CardData {
  id: string;           // Unique identifier
  label: string;        // Hebrew subtitle (used as context, not rendered in card)
  Illustration: React.FC<{ className?: string }>;  // SVG component for visual area
  title: string;        // Card headline (20px, white)
  description: string;  // Card body text (15px, muted)
  isFindo?: boolean;    // If true, applies subtle green border tint
}
```

### Card Data Array

```ts
const cards: CardData[] = [
  {
    id: "paid",
    label: "כמו שכירות",
    Illustration: PaidAdIllustration,
    title: "פרסום ממומן",
    description: "מביא תנועה כשמפעילים — נעצר כשנגמר הכסף.",
  },
  {
    id: "organic",
    label: "מרתון",
    Illustration: OrganicIllustration,
    title: "קידום אורגני",
    description: "מצוין לטווח ארוך — אבל דורש זמן ותהליך ותפעול.",
  },
  {
    id: "findo",
    label: "חיפוש מקומי (גוגל ביזנס)",
    Illustration: DecisionIllustration,
    title: "רגע ההחלטה",
    description: "הלקוח כבר רוצה פתרון. צריך רק רושם טוב + אמון + זמינות — ואז הלקוח פונה.",
    isFindo: true,
  },
];
```

### SVG Illustration Specifications

All three illustrations follow the same visual language:

| Property | Value |
|----------|-------|
| ViewBox | `0 0 280 160` |
| Fill | `none` (all stroke-based) |
| Stroke colors | `#2a2b2f` (primary), `#3a3b3f` (accent), `#1a1b1e` to `#1e1f22` (faint) |
| Stroke width | `1.5px` (lines), `2px` (emphasis), `2.5px` (checkmark) |
| Stroke caps | `round` |
| Stroke joins | `round` |
| Overall opacity | `0.6` (applied via CSS `.cardIllustration`) |

**Card 1 — "Paid Advertising" (PaidAdIllustration):**
- Declining graph line (left-to-right downward)
- Graph dots at data points
- Coin stack (left side)
- Click cursor icon (right side)
- Faint dollar signs

**Card 2 — "Organic Promotion" (OrganicIllustration):**
- Calendar with grid dots
- Slow upward growth curve (right side)
- Gear/cog with center fill and teeth lines

**Card 3 — "Decision Moment / Findo" (DecisionIllustration):**
- Concentric target rings with center dot
- Bold checkmark (right side)
- Business card outline with profile circle and text lines

### Section Header Content

```
Eyebrow:  [green dot] של רוב העסקים הקטנים [>]
Headline: הטעות הגדולה
Body:     **יש אפשרות שלישית.** רוב בעלי העסקים חושבים שיש רק שתי דרכים להביא לקוחות — פרסום ממומן או קידום אורגני. אבל יש דרך שמתחילה בדיוק ברגע שבו הלקוח כבר מחפש פתרון.
```

**Note:** The bold lead-in `**יש אפשרות שלישית.**` is at the START of the body text (matching Linear's signature pattern). The body text is slightly longer than the current version to better fill the split-column width.

---

## Section 6: Implementation Checklist

The implementer should follow this exact order:

1. **Replace** `big-mistake.module.css` entirely with the CSS from Section 2
2. **Replace** `BigMistakeSection.tsx` entirely with the JSX from Section 1
3. **Verify** the section renders correctly at desktop width
4. **Test** hover states on all 3 cards — all should behave identically except Findo has subtle green border
5. **Test** scroll-triggered animations — header elements fade in first, cards after
6. **Test** tablet (1023px) — header stacks, grid becomes 2+1
7. **Test** mobile (767px) — everything single column
8. **Test** reduced motion — no transitions or transforms on hover
9. **Visual audit** — compare against Linear Screenshot 03

### Anti-Pattern Checklist (MUST NOT exist in final code)

- [ ] No `.shimmer` class
- [ ] No `.shimmer::before` pseudo-element
- [ ] No `@keyframes shimmerMove`
- [ ] No `.ambientGlow` class
- [ ] No `.findoGlow` class
- [ ] No `.findoBadge` class
- [ ] No `.separator` with gradient
- [ ] No `text-align: center` on section header
- [ ] No bounce easing `(0.34, 1.56, 0.64, 1)`
- [ ] No green-tinted box-shadow on Findo card
- [ ] No different padding on Findo card vs other cards
- [ ] No `data-color` attribute
- [ ] No colored indicator dots inside cards
- [ ] No `font-style: italic`
- [ ] No `backdrop-filter`
- [ ] No noise/grain textures
- [ ] No gradient text

---

*Plan complete. Every CSS value specified. Every JSX element defined. Every animation parameter documented. Ready for implementation.*
