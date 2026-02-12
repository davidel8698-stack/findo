# BigMistakeSection -- Exact Gap Analysis vs Linear.app

> **Analyst:** gap-analyst
> **Date:** 2026-02-11
> **Method:** Line-by-line comparison of current code against 8 Linear screenshots + 3 reference documents
> **Source files:** BigMistakeSection.tsx, big-mistake.module.css
> **Reference files:** LINEAR-VISUAL-DNA.md, LINEAR-CARD-DNA.md, BIGMISTAKE-QUALITY-AUDIT.md
> **Screenshots verified:** 03, 04, 07, 10, 11, 12, 14, 15

---

## A) THINGS TO REMOVE (Current code has, but Linear does NOT)

### A1. Shimmer Animation (.shimmer, .shimmer::before, @keyframes shimmerMove)

**Current code (CSS lines 232-273):**
```css
.shimmer { position: absolute; inset: 0; ... z-index: 25; }
.shimmer::before { ... animation: shimmerMove 4s ease-in-out infinite; }
@keyframes shimmerMove { 0% { left: -60%; } 100% { left: 100%; } }
```

**Current code (TSX lines 107-110):**
```tsx
{card.isFindo && (
  <>
    <div className={styles.shimmer} aria-hidden="true" />
```

**Why Linear does NOT do this:**
Verified across all 8 screenshots -- Linear cards have NO animated shimmer borders. The BIGMISTAKE-QUALITY-AUDIT.md incorrectly lists shimmer as a "missing Linear pattern" and calls it "Core Linear principle #9." However, examining the actual LINEAR-VISUAL-DNA.md section 4.3 "What Linear Does NOT Do" explicitly states: "NO hover glow effects on cards." The screenshots show completely static card borders. The earlier audit document appears to have confused Linear with a different design system. LINEAR-CARD-DNA.md's hover behavior section (line 447-464) describes only `translateY(-4px)` and subtle border brightening -- no shimmer at all.

**Action:** Remove `.shimmer`, `.shimmer::before`, `@keyframes shimmerMove` from CSS. Remove shimmer `<div>` from TSX.

---

### A2. Ambient Glow (.ambientGlow)

**Current code (CSS lines 36-51):**
```css
.ambientGlow {
  position: absolute; top: -15%; left: 50%;
  width: 1000px; height: 600px;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.018) 0%, ...);
}
```

**Current code (TSX line 145):**
```tsx
<div className={styles.ambientGlow} aria-hidden="true" />
```

**Why Linear does NOT do this:**
LINEAR-VISUAL-DNA.md section 4.2 states: "There are NO obvious glowing elements or radial light effects on Linear's homepage." Section 4.3 confirms: "NO gradient backgrounds." The screenshots (03, 04, 07, 10, 14, 15) all show a flat, uniform dark background with NO radial glow behind content sections. The only "glow" perception on Linear comes from white text on dark backgrounds creating natural luminosity. This ambient glow div adds a non-Linear atmospheric effect.

**Action:** Remove `.ambientGlow` from CSS and the corresponding `<div>` from TSX.

---

### A3. Findo Card Ambient Glow (.findoGlow)

**Current code (CSS lines 57-72):**
```css
.findoGlow {
  position: absolute; top: 50%; left: 0;
  width: 450px; height: 350px;
  background: radial-gradient(ellipse at center, rgba(56,136,57,0.05) 0%, ...);
}
```

**Current code (TSX line 203):**
```tsx
<div className={styles.findoGlow} aria-hidden="true" />
```

**Why Linear does NOT do this:**
Verified against screenshot 03 (3-column cards) and 12 (2-column product cards) -- Linear cards sit on a flat dark background with NO colored radial glows behind them. LINEAR-VISUAL-DNA.md section 4.3: "NO colorful section backgrounds." Section 1.1: "No visible noise or grain texture on the main backgrounds. The atmospheric quality comes from subtle gradient washes and ambient glow, NOT overlay textures." But the "ambient glow" Linear uses is in the HERO only (barely perceptible, centered) -- NOT behind individual cards. The findoGlow creates an effect that has no precedent on Linear.

**Action:** Remove `.findoGlow` from CSS and the corresponding `<div>` from TSX.

---

### A4. Centered Section Header (.sectionHeader { text-align: center })

**Current code (CSS lines 78-81):**
```css
.sectionHeader {
  text-align: center;
  margin-bottom: 64px;
}
```

**Why Linear does NOT do this:**
This is one of the most critical layout errors. Verified against EVERY screenshot:
- Screenshot 03: "Made for modern product teams" -- LEFT-aligned headline, description on the RIGHT in a split layout
- Screenshot 04: "AI-assisted product development" -- LEFT-aligned (eyebrow + headline + body all flush left)
- Screenshot 07: "Set the product direction" -- LEFT-aligned with eyebrow dot
- Screenshot 10: "Issue tracking you'll enjoy using" -- LEFT-aligned
- Screenshot 14: "Collaborate across tools and teams" -- LEFT-aligned headline, description RIGHT
- Screenshot 15: "Built on strong foundations" -- LEFT-aligned

LINEAR-CARD-DNA.md section headers explicitly state: "Layout: Two-column header -- headline LEFT, description RIGHT" and "Text alignment: Left-aligned (NOT centered)". LINEAR-VISUAL-DNA.md section 2.3 confirms: "Left side (~45%): headline / Right side (~55%): Description paragraph."

Linear NEVER centers section headers for card-based sections.

**Action:** Remove `text-align: center` from `.sectionHeader`. Restructure header to left-aligned or split-column layout.

---

### A5. Gradient Separator (.separator)

**Current code (CSS lines 137-148):**
```css
.separator {
  width: 100%; max-width: 200px; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
  margin: 0 auto 64px;
}
```

**Current code (TSX lines 181-187):**
```tsx
<m.div className={styles.separator} ... />
```

**Why Linear does NOT do this:**
Verified against screenshots. Linear uses thin horizontal lines (`1px solid rgba(255,255,255,0.06)`) that span the FULL container width to separate content areas -- see screenshot 10 (full-width line above 4-column feature row) and screenshot 15 (thin line above feature list rows). These are NOT centered gradient fades. They are full-width, uniform-opacity border lines.

However, Linear also frequently uses NO separator at all between header and cards -- relying purely on whitespace (screenshots 03, 04, 07, 14). The "Made for modern teams" section (03) goes directly from the split header to the card grid with just whitespace.

The current centered gradient fade is a decorative pattern that does not exist on Linear.

**Action:** Remove the `.separator` div entirely. Replace with either pure whitespace OR a full-width 1px solid line if visual separation is needed.

---

### A6. Findo Badge (.findoBadge)

**Current code (CSS lines 212-226):**
```css
.findoBadge {
  position: absolute; top: 16px; left: 16px;
  background: rgba(56,136,57,0.1); border: 1px solid rgba(56,136,57,0.15);
  padding: 4px 12px; border-radius: 20px;
  font-size: 11px; color: rgba(56,136,57,0.8);
}
```

**Current code (TSX line 110):**
```tsx
<span className={styles.findoBadge}>...</span>
```

**Why Linear does NOT do this:**
Verified against screenshots 03, 14. Linear's 3-column cards (screenshot 03) and workflow cards (screenshot 14) show NO badge/pill overlays on any card. All cards in a grid are structurally identical -- there is no "featured" badge treatment. Linear differentiates content through:
1. Slightly different border color (very subtle)
2. Content hierarchy (the card's internal content speaks for itself)
3. Position in the grid

The badge pattern is more characteristic of pricing/comparison pages (Stripe, etc.), not Linear's design language.

**Action:** Remove `.findoBadge` from CSS and the `<span>` from TSX. Differentiate the Findo card through a subtle accent border color only.

---

### A7. Three Different Accent Colors (orange/blue/green)

**Current code (CSS lines 312-323):**
```css
.card[data-color="orange"] .indicatorDot { background: rgba(217,119,6,0.6); }
.card[data-color="blue"] .indicatorDot { background: rgba(59,130,246,0.6); }
.card[data-color="green"] .indicatorDot { background: rgba(56,136,57,0.7); }
```

**Why Linear does NOT do this:**
LINEAR-VISUAL-DNA.md section 1.4: "Linear is aggressively monochromatic. The entire site is 90% grays." Section 1.4 rule: "Color never dominates. It punctuates."

Looking at screenshots: each Linear section uses AT MOST one accent dot color:
- Screenshot 04: teal/cyan dot for "Artificial intelligence"
- Screenshot 07: green dot for "Project and long-term planning"
- Screenshot 10: yellow dot for "Task tracking and sprint planning"

Each section uses ONE color for its category dot, not three different colors within the same section. Having orange, blue, AND green in the same 3-card grid creates visual noise that directly contradicts Linear's monochrome discipline.

**Action:** Use a single accent color (green, since Findo's brand is green) for all indicator dots, OR remove colored dots entirely and use a monochrome approach.

---

### A8. Colored Indicator Dots with Labels (.indicatorRow, .indicatorDot, .cardLabel)

**Current code (CSS lines 298-330):**
```css
.indicatorRow { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.indicatorDot { width: 6px; height: 6px; border-radius: 50%; }
.cardLabel { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.45); }
```

**Why this is problematic:**
Linear uses the "colored dot + text" pattern for SECTION-level eyebrows (above section headlines), NOT for individual card-level labels. See screenshots:
- Screenshot 04: `[teal dot] Artificial intelligence >` -- this is a SECTION eyebrow
- Screenshot 07: `[green dot] Project and long-term planning >` -- SECTION eyebrow
- Screenshot 10: `[yellow dot] Task tracking and sprint planning >` -- SECTION eyebrow

Inside cards, Linear uses either:
1. No label at all (screenshots 03 cards -- just title at bottom)
2. Category text without dots (screenshot 14 -- "Customer Requests" label below card)

The current implementation incorrectly replicates the section-level eyebrow pattern inside each card.

**Action:** This pattern is partially acceptable but needs adjustment -- either remove the colored dot from cards (keep text label only) or convert to the simpler title-only approach that Linear uses in its card interiors. The colored dot should remain ONLY on the section eyebrow.

---

### A9. Card Inner Top-Edge Inset Shadow

**Current code (CSS line 173):**
```css
box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
```

**Verdict:** This is actually CORRECT per LINEAR-CARD-DNA.md (line 393): "Top edge highlight: inset 0 1px 0 rgba(255,255,255,0.03-0.05)". **Keep this.** However, it is listed as part of the `box-shadow` on `.card` which is fine.

---

### A10. Bounce Easing on Card Hover Transition

**Current code (CSS line 177):**
```css
transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Why this should be adjusted:**
LINEAR-CARD-DNA.md hover section (line 454): `transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1)`. Linear uses its standard easing for ALL transitions, including hover. The bounce easing `(0.34, 1.56, 0.64, 1)` creates a spring overshoot that Linear does not use. The BIGMISTAKE-QUALITY-AUDIT.md incorrectly recommends "bouncy easing" -- but the actual screenshots and LINEAR-CARD-DNA.md specify the standard ease `(0.16, 1, 0.3, 1)`.

**Action:** Replace bounce easing with `cubic-bezier(0.16, 1, 0.3, 1)` for all hover transitions.

---

## B) THINGS TO ADD (Linear does, but current code does NOT)

### B1. Left-Aligned or Split-Column Header Layout

**Priority: P0**

**What Linear does:**
Screenshot 03 & 14 show the dominant Linear header pattern for card sections: two-column split with headline LEFT and description RIGHT. Screenshot 07 shows left-aligned with eyebrow above. Neither uses centered text.

LINEAR-CARD-DNA.md (lines 10-29):
```
Layout: Two-column header -- headline LEFT, description RIGHT
Headline max-width: ~500px (left column)
Description max-width: ~420px
Contains inline link "Make the switch >" in white with arrow
```

**Exact CSS needed:**
```css
.sectionHeader {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: end;
  margin-bottom: 64px;
  text-align: right; /* RTL override */
}
```

For Findo's RTL Hebrew content, the split layout should be: headline on the RIGHT (start), description on the LEFT (end), mirroring Linear's LTR pattern.

---

### B2. Arrow ">" in Eyebrow Text

**Priority: P1**

**What Linear does:**
Verified in screenshots 04, 07, 10:
- Screenshot 04: `[teal dot] Artificial intelligence >`
- Screenshot 07: `[green dot] Project and long-term planning >`
- Screenshot 10: `[yellow dot] Task tracking and sprint planning >`

The `>` arrow always follows the category text. It indicates the eyebrow is a clickable link to a deeper page.

LINEAR-VISUAL-DNA.md section 3.3:
```
[colored dot 6px] [category text 13px gray] [> arrow]
```

**Current code has the dot but NOT the arrow.**

**Exact JSX needed:**
```tsx
<m.p className={styles.eyebrow}>
  <span className={styles.eyebrowDot} />
  של רוב העסקים הקטנים
  <span className={styles.eyebrowArrow}>&rsaquo;</span>
</m.p>
```

**CSS:**
```css
.eyebrowArrow {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
  margin-right: 2px; /* RTL: this is the "start" side */
}
```

---

### B3. Bold Lead-in Body Text Pattern

**Priority: P1**

**What Linear does:**
LINEAR-VISUAL-DNA.md section 3.4 documents this signature pattern:
```
**Bold white phrase.** Rest of paragraph in muted gray.
```

Verified in screenshots:
- Screenshot 04: "**Linear for Agents.** Choose from a variety of AI agents..."
- Screenshot 07: "**Align your team around a unified product timeline.** Plan, manage, and track..."
- Screenshot 11: "**Optimized for speed and efficiency.** Create tasks in seconds..."

The bold lead-in is pure white (#FFFFFF or rgba(255,255,255,0.95)), the rest is muted gray.

**Current code partially does this** (TSX line 176):
```tsx
<strong>אבל יש אפשרות שלישית.</strong>
```
But the `<strong>` is at the END, not the beginning. Linear always puts the bold at the START.

**CSS is already correct** (CSS line 129):
```css
.bodyText strong { color: rgba(255,255,255,0.95); font-weight: 600; }
```

**Action:** Restructure the Hebrew text so the bold phrase comes FIRST:
```tsx
<strong>יש אפשרות שלישית.</strong>{" "}
רוב בעלי העסקים חושבים שיש רק שתי דרכים להביא לקוחות.
```

---

### B4. Visual Content Inside Cards

**Priority: P1**

**What Linear does:**
This is the single biggest content gap. Verified across screenshots:
- Screenshot 03: Cards show dark monochromatic illustrations (Linear logo/3D elements, "50ms" speed viz, "Create" UI element) filling ~60-70% of card height
- Screenshot 14: Cards show product UI mockups (Intercom messages, git activity, mobile phone) filling most of the card
- Screenshot 12: Cards show product UI (Cycle 55 chart, Triage dropdown)

LINEAR-CARD-DNA.md (lines 62-79):
```
Illustration area: Takes up the upper portion of the card
Dark, monochromatic illustrations showing UI elements
Colors used in illustrations: dark grays (#1a1b1f to #2a2b2f)
Content spacing: ~16px gap between illustration area and title text
```

**Current code has ZERO visual content** -- cards contain only text (indicator, icon, title, description).

**What to add:** Each card needs a visual content area above the text. For the BigMistakeSection's comparison concept, this could be:
- Abstract geometric illustrations in dark monochrome
- Simplified UI mockup showing the concept (ad dashboard, SEO timeline, Google Business profile)
- The visual should take up the top 50-60% of the card

**Exact JSX structure needed:**
```tsx
<article className={styles.card}>
  <div className={styles.cardVisual}>
    {/* Illustration or abstract visual here */}
  </div>
  <div className={styles.cardContent}>
    <h3 className={styles.cardTitle}>{card.title}</h3>
    <p className={styles.cardDesc}>{card.description}</p>
  </div>
</article>
```

**CSS:**
```css
.cardVisual {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
}
```

---

### B5. Card Base Shadow (Ambient, Not Just Inset)

**Priority: P2**

**What Linear does:**
LINEAR-CARD-DNA.md card formula (line 409):
```
box-shadow: 0 2px 16px rgba(0,0,0,0.12)
```

Plus the inner highlight:
```
inset 0 1px 0 rgba(255,255,255,0.04)
```

**Current code (CSS line 173):**
```css
box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
```

Missing the ambient shadow `0 2px 16px rgba(0,0,0,0.12)`.

**CSS fix:**
```css
box-shadow:
  0 2px 16px rgba(0, 0, 0, 0.12),
  inset 0 1px 0 rgba(255, 255, 255, 0.04);
```

---

### B6. Full-Width Thin Line Separator (If Separator Is Kept)

**Priority: P2**

**What Linear does:**
Screenshot 10 shows a full-width `1px solid rgba(255,255,255,0.06)` horizontal rule spanning the entire container width above the 4-column feature items. Screenshot 15 shows thin horizontal lines separating feature rows.

LINEAR-VISUAL-DNA.md section 3.2:
```css
.linear-separator {
  border-top: 1px solid rgba(255,255,255,0.06);
}
```

If a separator is kept between header and cards, it should be full container width, not a 200px centered gradient.

**CSS:**
```css
.separator {
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 64px;
}
```

---

### B7. "+" Expand Button on Cards

**Priority: P2**

**What Linear does:**
Screenshot 03 (bottom of visible cards) and screenshot 04 both show a small circular `+` button in the bottom-right corner of each card. It's approximately 28-32px, with a subtle border.

LINEAR-CARD-DNA.md (line 175): "A small `+` button in the top-right or bottom-right corner (~28px circle, subtle border)"

**Current code has no expand button on any card.**

**CSS:**
```css
.cardExpand {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  position: absolute;
  bottom: 24px;
  left: 24px; /* RTL: maps to "end" */
}
```

---

## C) THINGS TO ADJUST (Present but wrong values)

### C1. Card Background Color

**Current value (CSS line 166):**
```css
background: rgba(255, 255, 255, 0.04);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md card formula (line 407): `background: #131416` (solid color)
LINEAR-CARD-DNA.md (line 37): `approximately rgba(20, 21, 24, 1) -- #141518`
LINEAR-VISUAL-DNA.md section 3.1: `background: #191919; /* or rgba(255,255,255,0.04) to 0.06 */`

The range is `rgba(255,255,255,0.04)` to `0.06`. Current value of 0.04 is at the very bottom of the range. For cards that need to be "barely visible but distinctly there," 0.05 is the midpoint.

**Evidence:** Screenshot 03 shows cards that are clearly distinguishable from the background -- slightly more visible than 0.04 would produce on #08090a.

**Correct value:**
```css
background: rgba(255, 255, 255, 0.05);
/* OR solid: #131416 */
```

---

### C2. Card Border Color

**Current value (CSS line 167):**
```css
border: 1px solid rgba(255, 255, 255, 0.07);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 408): `border: 1px solid rgba(255,255,255,0.07)`
LINEAR-VISUAL-DNA.md section 3.1: `border: 1px solid rgba(255,255,255,0.06)` or `0.08`

**Verdict:** 0.07 is actually within the correct range (0.06-0.08). **No change needed.**

---

### C3. Display Title Font Size

**Current value (CSS line 108):**
```css
font-size: 52px;
```

**Correct Linear value:**
LINEAR-VISUAL-DNA.md (line 43): Section headline: 44-52px
LINEAR-CARD-DNA.md (lines 14-15): `Font-size: ~48px (H2 scale)`

52px is at the top of the range but acceptable. However, the BIGMISTAKE-QUALITY-AUDIT suggests increasing to 56px for more drama. The screenshots show headlines that feel like 48px.

**Correct value:** 48px is the most consistent with screenshots. 52px is acceptable but slightly large.

```css
font-size: 48px; /* or keep 52px -- within range */
```

---

### C4. Display Title Font Weight

**Current value (CSS line 109):**
```css
font-weight: 600;
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 16): `Font-weight: 600-700`
LINEAR-VISUAL-DNA.md (line 43): `500-600 (medium-semibold)`

600 is correct. **No change needed.**

---

### C5. Body Text Color (Section Description)

**Current value (CSS line 121):**
```css
color: rgba(255, 255, 255, 0.55);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 23): `Color: rgba(255,255,255,0.6) -- approximately #95A2B3 (muted)`
LINEAR-VISUAL-DNA.md (line 47): Body text color `#888888` to `#999999`
LINEAR-CARD-DNA.md typography hierarchy (line 433): `SUBHEAD: 18-20px / weight 400 / rgba(255,255,255,0.5-0.6)`

Current 0.55 is within the 0.5-0.6 range. However, the dominant value across Linear is 0.55-0.6. Bumping to 0.6 would improve readability while staying muted.

**Correct value:**
```css
color: rgba(255, 255, 255, 0.6);
```

---

### C6. Card Description Color

**Current value (CSS line 364):**
```css
color: rgba(255, 255, 255, 0.5);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 434): `CARD DESC: 14-15px / weight 400 / rgba(255,255,255,0.45-0.55)`
LINEAR-CARD-DNA.md (line 397): `Description color: rgba(255,255,255,0.45-0.6) range`

0.5 is within range. Could go to 0.55 for slightly better readability.

**Correct value:**
```css
color: rgba(255, 255, 255, 0.55);
```

---

### C7. Card Title Color

**Current value (CSS line 355):**
```css
color: rgba(255, 255, 255, 0.95);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 396): `Title color: #FFFFFF`
LINEAR-CARD-DNA.md (line 72): `Color: #FFFFFF`

Linear uses pure white for card titles, not 0.95 opacity.

**Correct value:**
```css
color: #ffffff;
```

---

### C8. Eyebrow Text Color

**Current value (CSS line 92):**
```css
color: rgba(255, 255, 255, 0.5);
```

**Correct Linear value:**
LINEAR-VISUAL-DNA.md (line 45): Category label color `#8a8a8a` to `#a0a0a0`
LINEAR-CARD-DNA.md (line 234): `Color: rgba(255,255,255,0.6)`
LINEAR-CARD-DNA.md eyebrow (line 430): `EYEBROW: 12-14px / weight 500 / rgba(255,255,255,0.5-0.6)`

0.5 is at the bottom of the range. Screenshots show eyebrow text is readable (not faint). 0.6 is more accurate.

**Correct value:**
```css
color: rgba(255, 255, 255, 0.6);
```

---

### C9. Eyebrow Dot Size

**Current value (CSS lines 98-99):**
```css
width: 8px;
height: 8px;
```

**Correct Linear value:**
LINEAR-VISUAL-DNA.md (line 74): "Colored dots appear next to category labels (small, 6-8px circles)"
LINEAR-VISUAL-DNA.md section 3.3: "Dot colors: teal/blue, green, yellow/amber -- varies by section"

Screenshots show dots that appear to be 6-8px. 8px is at the upper bound. The dots in screenshots 04, 07, 10 look closer to 8px.

**Verdict:** 8px is acceptable. **No change needed.**

---

### C10. Card Hover translateY

**Current value (CSS line 181):**
```css
transform: translateY(-4px);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 452): `transform: translateY(-4px)`

**Verdict:** -4px is correct. **No change needed.**

---

### C11. Card Hover Shadow

**Current value (CSS lines 183-185):**
```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.04),
  0 20px 40px rgba(0,0,0,0.2);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (lines 506-508):
```css
box-shadow:
  0 20px 40px rgba(0,0,0,0.2),
  inset 0 1px 0 rgba(255,255,255,0.04);
```

**Verdict:** Values match. **No change needed** (order doesn't matter).

---

### C12. Card Hover Border Color

**Current value (CSS line 182):**
```css
border-color: rgba(255, 255, 255, 0.12);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 505): `border-color: rgba(255,255,255,0.12)`

**Verdict:** Matches. **No change needed.**

---

### C13. Section Padding

**Current value (CSS line 18):**
```css
padding: 128px 24px;
```

**Correct Linear value:**
LINEAR-VISUAL-DNA.md (line 80): "Section padding (vertical): 120-160px top and bottom"

128px is within the 120-160px range. **No change needed.**

---

### C14. Container Max-Width

**Current value (CSS line 25):**
```css
max-width: 1200px;
```

**Correct Linear value:**
LINEAR-VISUAL-DNA.md (line 88): "Content max-width: approximately 1200-1280px, centered"
LINEAR-CARD-DNA.md (line 86): "Container max-width: ~1200px, centered"

**Verdict:** 1200px is correct. **No change needed.**

---

### C15. Grid Gap

**Current value (CSS line 157):**
```css
gap: 24px;
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 82): "Gap: ~24px between cards"
LINEAR-VISUAL-DNA.md (line 86): "Card gap (in grids): 16-24px"

**Verdict:** 24px is correct. **No change needed.**

---

### C16. Card Internal Padding

**Current value (CSS line 280):**
```css
padding: 32px;
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (lines 52-55): "Consistent 32px all around"
LINEAR-CARD-DNA.md card formula (line 411): "padding: 32px (large)"

**Verdict:** 32px is correct. **No change needed.**

---

### C17. Animation Entry Y Distance

**Current value (TSX line 98):**
```tsx
initial={{ opacity: 0, y: 20 }}
```

**Correct Linear value:**
LINEAR-VISUAL-DNA.md doesn't specify exact animation values. BIGMISTAKE-QUALITY-AUDIT.md (line 165) suggests 20px.

**Verdict:** 20px is correct. **No change needed.**

---

### C18. Animation Entry Duration

**Current value (TSX line 101):**
```tsx
duration: 0.4,
```

**Correct Linear value:**
BIGMISTAKE-QUALITY-AUDIT.md (line 166): "Linear spec says 300-500ms for slide-up" and "Linear feels crisp at 400ms."

**Verdict:** 0.4s (400ms) is correct. **No change needed.**

---

### C19. Card Label Color

**Current value (CSS line 329):**
```css
color: rgba(255, 255, 255, 0.45);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 434): `CARD DESC: 14-15px / weight 400 / rgba(255,255,255,0.45-0.55)`
LINEAR-CARD-DNA.md caption (line 435): `CAPTION: 12-13px / weight 400-500 / rgba(255,255,255,0.4)`

For card-internal labels at 13px, 0.45 is within the acceptable range. Could bump to 0.5.

**Correct value:**
```css
color: rgba(255, 255, 255, 0.5);
```

---

### C20. Findo Card Border Color

**Current value (CSS line 194):**
```css
border-color: rgba(56, 136, 57, 0.15);
```

**Correct Linear value:**
Linear does NOT use colored card borders for featured cards in screenshots 03, 14 (all cards have the same border). However, for Findo's purpose of differentiating one card as "the answer," a very subtle accent border is an acceptable creative license. The opacity should be restrained.

**Verdict:** 0.15 is acceptable as a creative deviation. Could reduce to 0.12 for more subtlety. Keep as creative license.

---

### C21. Findo Card Additional Padding

**Current value (CSS lines 289-292):**
```css
.cardFindo .cardInner {
  padding: 36px 32px;
  padding-top: 44px;
}
```

**Correct Linear value:**
Linear cards all share the same padding (32px). No card gets special padding treatment.

**Correct value:** Remove the Findo-specific padding override. All cards should use uniform `padding: 32px`.

---

### C22. Icon Styling

**Current value (CSS lines 337-341):**
```css
.icon {
  width: 20px; height: 20px;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 16px;
}
```

**Correct Linear value:**
LINEAR-VISUAL-DNA.md section 7 (line 647): "Size: 16-20px in feature lists" and "Color: #888888 to #aaaaaa -- never bright, never colored"

The icon color `rgba(255,255,255,0.35)` is too dim. `#888888` = approximately `rgba(255,255,255,0.53)`. `#aaaaaa` = approximately `rgba(255,255,255,0.67)`.

**Correct value:**
```css
.icon {
  width: 20px; height: 20px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}
```

Also remove the green-tinted icon color for the Findo card:
```css
/* REMOVE: */
.cardFindo .icon { color: rgba(56,136,57,0.5); }
```
Linear icons are always monochrome gray, never accent-colored.

---

### C23. Card Hover Transition Easing

**Current value (CSS lines 175-177):**
```css
transition:
  border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
  box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1),
  transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Correct Linear value:**
LINEAR-CARD-DNA.md (line 454): `transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1)`

The transform uses a different (bouncy) easing than the other properties. Linear uses the same easing for all properties.

**Correct value:**
```css
transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
```

---

### C24. Findo Card Hover Box Shadow

**Current value (CSS lines 201-206):**
```css
.cardFindo:hover {
  border-color: rgba(56, 136, 57, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(56, 136, 57, 0.08),
    0 20px 40px rgba(0, 0, 0, 0.2),
    0 0 60px -10px rgba(56, 136, 57, 0.08);
}
```

The green-tinted inner glow and ambient glow on hover do not exist in Linear. Linear hover states only change `translateY`, `border-color` (to slightly brighter white), and `box-shadow` (deeper dark shadow). No accent-colored shadows.

**Correct value:**
```css
.cardFindo:hover {
  transform: translateY(-4px);
  border-color: rgba(56, 136, 57, 0.2); /* slightly brighter accent border, acceptable */
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
```

---

## SUMMARY TABLE

### Removals (10 items)

| # | Element | Severity | Reason |
|---|---------|----------|--------|
| A1 | Shimmer animation | HIGH | Linear has no animated shimmer borders |
| A2 | Ambient glow div | MEDIUM | Linear has no radial glow in content sections |
| A3 | Findo glow div | MEDIUM | Linear has no colored glows behind cards |
| A4 | Centered header | HIGH | Linear always left-aligns section headers |
| A5 | Gradient separator | MEDIUM | Linear uses full-width lines or whitespace only |
| A6 | Findo badge pill | MEDIUM | Linear has no badge overlays on cards |
| A7 | 3 accent colors | MEDIUM | Linear uses 1 accent per section max |
| A8 | Colored dots inside cards | LOW | Dots belong at section level, not card level |
| A10 | Bounce easing on transform | LOW | Linear uses standard easing uniformly |

### Additions (7 items)

| # | Element | Priority | Impact |
|---|---------|----------|--------|
| B1 | Left-aligned / split header layout | P0 | Fundamental layout correction |
| B2 | Arrow ">" in eyebrow | P1 | Linear signature pattern |
| B3 | Bold lead-in at START of body text | P1 | Linear signature pattern |
| B4 | Visual content inside cards | P1 | Biggest content gap |
| B5 | Ambient card base shadow | P2 | Subtle depth improvement |
| B6 | Full-width separator (if kept) | P2 | Correct separator pattern |
| B7 | "+" expand button on cards | P2 | Linear card detail |

### Adjustments (11 items)

| # | Property | Current | Correct | Severity |
|---|----------|---------|---------|----------|
| C1 | Card background | 0.04 | 0.05 (or #131416) | MEDIUM |
| C5 | Body text color | 0.55 | 0.6 | LOW |
| C6 | Card desc color | 0.5 | 0.55 | LOW |
| C7 | Card title color | rgba 0.95 | #ffffff | LOW |
| C8 | Eyebrow text color | 0.5 | 0.6 | LOW |
| C19 | Card label color | 0.45 | 0.5 | LOW |
| C21 | Findo extra padding | 36/44px | 32px uniform | LOW |
| C22 | Icon color | 0.35 | 0.5 | MEDIUM |
| C22b | Findo icon color | green-tinted | monochrome | LOW |
| C23 | Hover easing mismatch | mixed | uniform standard | LOW |
| C24 | Findo hover shadows | green-tinted | neutral dark | LOW |

---

## CORRECTING THE AUDIT DOCUMENT

The BIGMISTAKE-QUALITY-AUDIT.md contains several recommendations that CONTRADICT what Linear actually does, based on verified screenshot evidence:

1. **"Add shimmer border effect -- Core Linear principle #9"** -- WRONG. Linear has NO shimmer. The current code already has shimmer and it should be REMOVED.

2. **"Add backdrop-filter: blur(20px) to cards for glassmorphism"** -- WRONG. LINEAR-VISUAL-DNA.md section 4.3: Linear has "NO backdrop-filter on standard cards." LINEAR-CARD-DNA.md (line 400): "Glassmorphism: Minimal -- no heavy blur/transparency on cards." Do NOT add backdrop-filter.

3. **"Add bouncy easing for hover"** -- WRONG. LINEAR-CARD-DNA.md specifies `cubic-bezier(0.16, 1, 0.3, 1)` (standard easing) for hover, not a bouncy spring.

4. **"Fix eyebrow letter-spacing to 11px"** -- QUESTIONABLE. The screenshots show normal letter-spacing on eyebrow text (e.g., "Artificial intelligence >" in screenshot 04 reads as normal word spacing, NOT ultra-wide tracking). The "11px letter-spacing" claim has no visual evidence from the screenshots. The eyebrow text is lowercase with normal spacing. Current `0.02em` is fine.

5. **"Add gradient text"** -- WRONG. LINEAR-VISUAL-DNA.md section 4.3 explicitly states: "NO gradient text."

6. **"Increase grain opacity"** -- WRONG. LINEAR-VISUAL-DNA.md section 1.1: "No visible noise or grain texture." There should be NO grain at all.

These corrections are critical -- implementing the audit's recommendations without this gap analysis would have moved the design FURTHER from Linear, not closer.

---

*Gap analysis complete. Every CSS value verified against screenshots and reference documents.*
