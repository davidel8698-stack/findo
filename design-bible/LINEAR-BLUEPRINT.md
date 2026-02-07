# Linear Design Blueprint

> מדריך עיצוב מקיף לבניית אתר SaaS ברמת עולמית
> **מקור:** מסמך מזוקק ממחקר של 3 מודלי AI, פברואר 2026

---

## תוכן עניינים

1. [Executive Summary - 12 עקרונות מפתח](#1-executive-summary)
2. [Style Guide - פלטת צבעים](#2-style-guide)
3. [Typography System](#3-typography-system)
4. [Grid & Spacing](#4-grid--spacing)
5. [Component Library](#5-component-library)
6. [Motion Specification](#6-motion-specification)
7. [Content & Copy Patterns](#7-content--copy-patterns)
8. [Image & Visual Rules](#8-image--visual-rules)
9. [Accessibility & Performance](#9-accessibility--performance)
10. [Quality Checklist](#10-quality-checklist)

---

## 1. Executive Summary

### 12 עקרונות מפתח שהופכים את Linear לאתר SaaS מוביל בעולם

| # | עיקרון | תיאור |
|---|--------|-------|
| 1 | **Dark Mode First** | רקע ראשי `#08090A` (לא שחור טהור!) עם גרדיאנטים עדינים |
| 2 | **פונט יחיד - Inter** | הבחנה דרך משקל (400-800) ולא דרך משפחות שונות |
| 3 | **מינימליזם פונקציונלי** | כל אלמנט משרת מטרה. Whitespace הוא אלמנט עיצובי |
| 4 | **צבע מותג מאופק** | Indigo `#5E6AD2` משמש באופן מאופק. רוב הממשק Monochrome |
| 5 | **היררכיה טיפוגרפית דרמטית** | H1: 62px/800, Labels: 12px - הפער יוצר היררכיה |
| 6 | **Glassmorphism עדין** | backdrop-blur, שקיפויות, borders עדינים - ללא צללים כבדים |
| 7 | **אנימציות מאופקות** | hover: 200ms, Easing: `cubic-bezier(0.16, 1, 0.3, 1)` |
| 8 | **CTAs קצרים** | 1-2 מילים בלבד: "Start building", "Get started" |
| 9 | **Shimmer Effect** | אפקט זוהר נודד על borders - 1.5s, חוזר כל 3s |
| 10 | **נגישות מובנית** | Skip link, Focus states, contrast גבוה |
| 11 | **Image Optimization** | CDN עם f=auto, dpr=2, q=95 |
| 12 | **Method = פילוסופיה** | 8 עקרונות ו-14 practices שמנחים הכל |

---

## 2. Style Guide

### צבעי מותג רשמיים

| Token | HEX | שימוש |
|-------|-----|-------|
| **Primary** | `#5E6AD2` | צבע מותג, Accent, CTA |
| **Dark BG** | `#08090A` | רקע ראשי - Dark Mode |
| **Surface** | `#151516` | כרטיסים, Modals |
| **Light BG** | `#F7F8F8` | רקע ראשי - Light Mode |
| **Text Primary** | `#FFFFFF` | טקסט ראשי ב-Dark |
| **Text Muted** | `#95A2B3` | תיאורים, Secondary |

> **הערה ל-Findo:** אנחנו משתמשים בכתום (`--primary`) במקום Indigo

### צבעי סטטוס

| סטטוס | HEX | שימוש |
|-------|-----|-------|
| Success | `#22C55E` | On track, Progress |
| Warning | `#EAB308` | At risk |
| Error | `#EF4444` | Off track |
| Info | `#3B82F6` | Informational |

### Glassmorphism CSS

```css
.glass-surface {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.navigation-blur {
  background: rgba(8, 9, 10, 0.85);
  backdrop-filter: blur(12px);
}
```

### Shadows

| Type | Value |
|------|-------|
| Card Hover | `0 20px 60px rgba(0,0,0,0.3)` |
| Accent Glow | `0 0 40px rgba(94,106,210,0.15)` |
| Inner Glow | `inset 0 1px 1px rgba(255,255,255,0.05)` |
| Screenshot | `0 24px 80px rgba(0,0,0,0.4)` |

---

## 3. Typography System

### Font Stack

```css
/* Primary */
font-family: "Inter UI", "SF Pro Display", -apple-system, system-ui, sans-serif;

/* Monospace */
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

### Typography Scale

| Style | Size | Weight | Line Height | Letter Spacing | שימוש |
|-------|------|--------|-------------|----------------|-------|
| Display/H1 | 62px | 800 | 1.1-1.16 | normal | Hero headlines |
| Section Label | 12px | 600 | 1.25 | **11px** | Labels, categories |
| H2 | 32-48px | 600-700 | 1.2 | normal | Section headers |
| H3 | 20-24px | 600 | 1.3 | normal | Cards, pricing |
| Body Large | 18-20px | 400 | 1.55-1.6 | normal | פסקאות הסבר |
| Body | 16px | 400 | 1.5-1.6 | normal | טקסט רץ |
| Small | 14px | 400 | 1.5 | normal | תיאורים |
| Caption | 12px | 500 | 1.2 | normal | תגיות, badges |
| Button | 14px | 600 | normal | normal | כפתורים |

### Responsive Typography

| Element | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| H1/Display | 62px | 48px | 36px |
| H2 | 48px | 36px | 28px |
| Body | 16px | 16px | 16px |

---

## 4. Grid & Spacing

### Grid System

| Parameter | Value |
|-----------|-------|
| Max Width | ~1200px (עד 1400px) |
| Columns | 12 |
| Gutter | 24-32px |
| Margins | 24px (mobile) → 40px (desktop) |

### Spacing Scale (Base: 4px)

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Icon inline spacing |
| space-2 | 8px | Tight spacing |
| space-3 | 12px | Related items |
| space-4 | 16px | Standard / Button padding |
| space-6 | 24px | Section padding |
| space-8 | 32px | Card padding |
| space-12 | 48px | Section gaps |
| space-16 | 64px | Major sections |
| space-24 | 96px | Hero padding |
| space-32 | 128px | Section vertical padding |

### Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| Mobile | ≤640px | Single column, stacked |
| Tablet | 641-1024px | 2 columns |
| Desktop | 1025-1440px | Full layout, 12 columns |
| Large | ≥1441px | Max-width constraint |

### Section Padding

| Section | Top | Bottom |
|---------|-----|--------|
| Hero | 120px | 80px |
| Feature | 80px | 80px |
| CTA | 64px | 64px |
| Footer | 48px | 48px |

---

## 5. Component Library

### Navigation / Header

```
Height: 64px
Background: rgba(8,9,10,0.85) + backdrop-filter: blur(10px)
Position: sticky top
Z-index: 50
Border-bottom: 1px solid rgba(255,255,255,0.05)
```

### Buttons

#### Primary Button

```css
.btn-primary {
  background: linear-gradient(135deg, #5E6AD2, #4551B5);
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(94,106,210,0.3);
}

.btn-primary:active {
  transform: scale(0.95);
}
```

#### Secondary Button

```css
.btn-secondary {
  background: transparent;
  color: #F7F8F8;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 12px 24px;
  border-radius: 8px;
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.3);
}
```

#### Button Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| Small | 32px | 8px 16px | 12px |
| Medium | 40px | 12px 24px | 14px |
| Large | 48px | 16px 32px | 16px |

### Cards

```css
.feature-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 32px;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
```

**Highlighted Tier (Pricing):**
```css
border: 2px solid #5E6AD2;
box-shadow: 0 0 40px rgba(94,106,210,0.2);
/* + badge "Most popular" */
```

### Badges / Chips

```css
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge-new {
  background: rgba(94,106,210,0.2);
  color: #5E6AD2;
}

.badge-category {
  background: rgba(255,255,255,0.1);
  color: #95A2B3;
}
```

### Hero Section Pattern

```
Padding: 120px top, 80px bottom
Max-width headline: ~800px
Text align: center
Avatar row: overlap -8px, size 36-48px

Structure: Badge → H1 → Subheadline → CTAs → Social proof
```

### Logo Row (Social Proof)

```css
.logo-row {
  display: flex;
  justify-content: center;
  gap: 48px;
  opacity: 0.6;
  filter: grayscale(100%);
}

.logo-row img {
  height: 24px;
  width: auto;
}
```

---

## 6. Motion Specification

### עקרונות תנועה

| Principle | Description |
|-----------|-------------|
| **Restraint** | אנימציות קצרות ועדינות. אף אנימציה לא מפריעה |
| **Purpose** | כל תנועה משרתת מטרה: משוב, מיקוד, או הנחיה |
| **Performance** | רק GPU-accelerated: transform, opacity |
| **Accessibility** | תמיכה מלאה ב-prefers-reduced-motion |

### Easing Curves

| Name | Value | Usage |
|------|-------|-------|
| Standard | `cubic-bezier(0.16, 1, 0.3, 1)` | כניסת אלמנטים, reveals |
| Material | `cubic-bezier(0.4, 0, 0.2, 1)` | מעברים כלליים |
| Bouncy | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Hover, micro-feedback |
| Quick Press | `cubic-bezier(0.4, 0, 0.2, 1)` | לחיצת כפתור |
| Soft Out | `ease-out` | Fade-outs, shimmer |

### Animation Table

| Animation | Trigger | Duration | Easing | Properties |
|-----------|---------|----------|--------|------------|
| Button Hover | Hover | 150-200ms | Bouncy | translateY(-2px), shadow |
| Button Press | Active | 80ms | Quick Press | scale(0.95) |
| Card Hover | Hover | 200ms | Standard | translateY(-4px), shadow |
| Fade In | Load/Scroll | 300ms | Standard | opacity: 0→1 |
| Slide Up | Scroll | 300-500ms | Standard | translateY(20px→0) |
| Shimmer | Loop (3s) | 1500ms | Soft Out | translateX(0→800px) |

### Shimmer Effect Implementation

```css
.shimmer {
  position: absolute;
  width: 1px;
  height: 100px;
  background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%);
  animation: shimmer 1.5s ease-out infinite;
  animation-delay: 3s;
}

@keyframes shimmer {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(800px); opacity: 0; }
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Content & Copy Patterns

### Hero Headlines

- **אורך:** 5-10 מילים
- **מבנה:** הצהרה ישירה בזמן הווה

**דוגמאות:**
- "Linear is a purpose-built tool for planning and building products"
- "Build what customers actually want"
- "Product development for modern enterprises"

### Section Headlines

- **אורך:** 3-6 מילים
- **מבנה:** פועל + יעד

**דוגמאות:**
- "Set the product direction"
- "Issue tracking you'll enjoy using"
- "Built on strong foundations"

### CTAs - קריאות לפעולה

| Type | Examples |
|------|----------|
| **Primary (כפתורים)** | "Start building" ✓ / "Get started" ✓ / "Contact sales" ✓ |
| **Secondary (קישורים)** | "Learn more →" / "Meet our customers" / "See how it works" |

**אסור:**
- ❌ "Click here"
- ❌ "Submit"
- ❌ יותר מ-2 מילים

### טון כתיבה

| מאפיין | תיאור | דוגמה |
|--------|-------|-------|
| Professional | טכני אך נגיש | "Streamline issues, projects, and roadmaps" |
| Confident | הצהרתי בלי יומרנות | "Built for the best" (לא "The best tool") |
| Direct | ללא מילות מילוי | "Purpose-built" (לא "designed to be...") |
| Aspirational | שאיפה לאיכות | "magic", "crafted to perfection" |

---

## 8. Image & Visual Rules

### Screenshot Presentation

```css
.product-screenshot {
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.4);
  overflow: hidden;
}

.screenshot-wrapper::before {
  content: '';
  position: absolute;
  inset: -40px;
  background: radial-gradient(
    circle at center,
    rgba(94,106,210,0.15) 0%,
    transparent 70%
  );
  z-index: -1;
}
```

### Avatar Images

- Sizes: 36px, 48px, 72px
- Stacking: overlap -8px, z-index ascending

### Device Mockups

- ללא Chrome מלא - רק תוכן האפליקציה
- Window controls מינימליים (אופציונלי)
- פינות מעוגלות (8-12px)
- צללים רכים ועמוקים

---

## 9. Accessibility & Performance

### נגישות

- ✅ **Skip Link:** כל עמוד פותח ב-"Skip to content →"
- ✅ **Heading Hierarchy:** H1→H2→H3 עקבי
- ✅ **Alt Text:** תיאורים מפורטים
- ✅ **Focus States:** טבעת focus ברורה
- ✅ **Color Contrast:** WCAG AA+ (~12.8:1)
- ✅ **Keyboard Nav:** ניווט מלא ללא עכבר

### ביצועים

- Images: CDN, auto-format, lazy loading
- Fonts: Self-hosted Inter, system fallbacks
- Scripts: Next.js code-splitting
- **Target LCP:** < 2.5 שניות
- **Target Score:** Lighthouse 90+

---

## 10. Quality Checklist

### Visual Design
- [ ] Dark background: `#08090A` או קרוב
- [ ] Typography: Inter font family בלבד
- [ ] Color accent: שימוש מאופק
- [ ] Glassmorphism: blur + transparency על surfaces
- [ ] Border-radius: 8px לכפתורים, 12-16px לכרטיסים
- [ ] Shadows: עדינים, לא dramatic

### Layout
- [ ] Max-width: ~1200px
- [ ] Section padding: 80-120px vertical
- [ ] Consistent spacing scale: מכפלות של 4/8px
- [ ] Grid: 12 columns, 24-32px gutters
- [ ] Responsive breakpoints: 640/768/1024/1440px

### Typography
- [ ] H1: 48-62px, weight 800
- [ ] Labels: 12px, weight 600, letter-spacing
- [ ] Body: 16-20px, weight 400, line-height 1.5+
- [ ] Hierarchy ברורה בין levels

### Components
- [ ] Header: sticky, semi-transparent, blur
- [ ] Buttons: 3 variants (primary/secondary/ghost)
- [ ] Cards: consistent padding, border-radius
- [ ] Footer CTA: tagline + dual CTAs
- [ ] Social proof row: grayscale logos

### Animation
- [ ] Hover: 200ms, bouncy easing
- [ ] Reveals: 300ms, standard easing
- [ ] Shimmer effect על borders
- [ ] prefers-reduced-motion support

### Content
- [ ] Headlines: 3-10 words, declarative
- [ ] CTAs: 1-2 words, action verbs
- [ ] Tone: professional, confident, direct

### Technical
- [ ] Skip link לנגישות
- [ ] Image optimization: WebP, 2x DPR
- [ ] Semantic HTML: proper headings
- [ ] Performance: code-splitting, lazy loading
- [ ] Lighthouse score: 90+ בכל הקטגוריות

---

## Reference Screenshots

Located in: `Screenshots of the linear website/`

| # | Filename | Content |
|---|----------|---------|
| 01 | `01-hero-floating-ui-panels.png` | Hero with floating UI panels |
| 02 | `02-feature-cards-3-columns.png` | 3-column feature cards |
| 03 | `03-ai-agents-feature-page.png` | AI Agents selector |
| 04 | `04-ai-features-two-column.png` | Two-column AI features |
| 05 | `05-timeline-3d-visualization.png` | 3D Timeline visualization |
| 06 | `06-project-glass-cards.png` | Glassmorphism project cards |
| 07 | `07-ideate-collaborate-section.png` | Ideate section with icons |
| 08 | `08-issue-tracking-hero.png` | Issue tracking hero |
| 09 | `09-cycles-triage-features.png` | Cycles & Triage features |
| 10 | `10-insights-data-visualization.png` | Data visualization |
| 11 | `11-integrations-page-hero.png` | Integrations page |
| 12 | `12-foundations-trust-badges.png` | Trust badges section |
| 13 | `13-footer-cta-section.png` | Footer CTA |

---

*"Plan the present. Build the future."*

*מסמך זה מזקק את התובנות הטובות ביותר משלושה מודלי AI.*
*כל ערך ניתן להעתקה ישירה ל-Figma או קוד.*

*Last Updated: 2026-02-06*
