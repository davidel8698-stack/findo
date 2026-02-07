# Phase 28: Design Foundation - Research

**Researched:** 2026-02-05
**Domain:** CSS Design Tokens, Tailwind CSS v4, Linear Design System
**Confidence:** HIGH

## Summary

This phase establishes the foundational design token system for Findo's Linear-inspired dark mode design. The project already uses Tailwind CSS v4 with CSS-first configuration via `@theme` directive in `globals.css`. The existing setup provides a solid foundation that needs to be extended with semantic color tokens, a refined surface hierarchy, glassmorphism tokens, and a 4px-based typography scale.

The research confirms Tailwind v4's `@theme` directive is the correct approach for design tokens, converting CSS custom properties into utility classes automatically. The project's decision to use a single `tokens.css` file aligns with Tailwind v4's CSS-first philosophy, though the tokens can be defined directly in the existing `globals.css` `@theme` block for simplicity.

**Primary recommendation:** Extend the existing `@theme` block in `globals.css` with semantic color tokens using the `--color-` namespace and typography tokens using `--text-`, `--font-weight-`, and `--leading-` namespaces. Use Tailwind v4's built-in property association for font sizes (e.g., `--text-heading-1--line-height`, `--text-heading-1--font-weight`).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.x | CSS-first utility framework | Already installed, `@theme` directive for design tokens |
| @tailwindcss/postcss | v4.x | PostCSS integration | Already configured in `postcss.config.mjs` |
| Heebo | Variable | Hebrew typography | Already configured in `layout.tsx` with weights 400, 500, 700 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/font | 16.x | Font optimization | Already used for Heebo preloading |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Separate tokens.css | @theme in globals.css | Fewer files, all tokens in one place - recommended |
| CSS @layer tokens | @theme directive | @theme auto-generates utilities; @layer doesn't |

**No installation needed:** All tools are already in place.

## Architecture Patterns

### Recommended Project Structure
```
website/app/
  globals.css          # Extended @theme block with all tokens
```

The CONTEXT.md specified a `tokens.css` file, but since Tailwind v4 already uses `globals.css` with `@theme`, extending it is cleaner. The planner should decide whether to:
1. Keep all tokens in `globals.css` (simpler)
2. Create `tokens.css` and `@import` it before the `@theme` block

### Pattern 1: Semantic Color Tokens with Tailwind v4 @theme
**What:** Define semantic color tokens that generate utility classes automatically
**When to use:** All color definitions in this phase
**Example:**
```css
/* Source: https://tailwindcss.com/docs/theme */
@theme {
  /* Surface hierarchy */
  --color-bg-primary: #08090A;
  --color-bg-surface-1: #0F1011;
  --color-bg-surface-2: #151516;
  --color-bg-elevated: #1A1B1C;

  /* Text hierarchy */
  --color-text-primary: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #71717A;
  --color-text-muted: #52525B;
  --color-text-disabled: #3F3F46;

  /* Accent colors */
  --color-accent-primary: #F97316;
  --color-accent-hover: #FB923C;
  --color-accent-active: #EA580C;
}
```
This generates `bg-bg-primary`, `text-text-primary`, etc. automatically.

### Pattern 2: Typography Tokens with Associated Properties
**What:** Font sizes with bundled line-height, font-weight, letter-spacing
**When to use:** Defining the typography scale
**Example:**
```css
/* Source: https://tailwindcss.com/docs/font-size */
@theme {
  /* Display typography - 62px */
  --text-display: 3.875rem;
  --text-display--line-height: 1.1;
  --text-display--font-weight: 800;
  --text-display--letter-spacing: -0.02em;

  /* Heading 1 - 48px */
  --text-heading-1: 3rem;
  --text-heading-1--line-height: 1.16;
  --text-heading-1--font-weight: 700;
}
```
Using `text-display` class automatically applies all associated properties.

### Pattern 3: Glass Effect Tokens
**What:** Separate effect tokens + convenience combined token
**When to use:** Glassmorphism surfaces
**Example:**
```css
@theme {
  /* Individual effect tokens */
  --blur-glass: 20px;
}

/* In :root for non-utility values */
:root {
  --effect-glass-bg: rgba(255, 255, 255, 0.05);
  --effect-glass-border: rgba(255, 255, 255, 0.08);
}
```

### Anti-Patterns to Avoid
- **Mixing HSL and Hex:** The existing `globals.css` uses HSL for some colors and hex for others. Stick to one format (hex recommended for Linear consistency)
- **Duplicate token names:** The existing `--color-background` conflicts with potential `--color-bg-primary`. Use semantic naming consistently
- **Defining tokens in :root when @theme is available:** Use `@theme` for tokens that need utility classes, `:root` for pure variables

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive font scaling | Manual media queries for each size | `--text-*` with responsive overrides | Tailwind v4 handles responsive utilities |
| Color contrast checking | Manual WCAG calculations | Design tokens + verified values | Use pre-validated Linear-style values |
| Surface elevation | Individual background colors | Semantic surface tokens | Consistent hierarchy across app |
| Glass blur fallbacks | Manual `@supports` checks | Existing `.glass-strong`/`.glass-light` utilities | Already implemented in Phase 26 |

**Key insight:** The project already has glass utilities implemented. This phase extends the color/typography foundation, not rebuilding what exists.

## Common Pitfalls

### Pitfall 1: Tailwind v4 Namespace Conflicts
**What goes wrong:** Using token names that conflict with Tailwind's default namespaces causes unexpected behavior
**Why it happens:** Tailwind v4 reserves certain prefixes (`--color-*`, `--text-*`, etc.) for utility generation
**How to avoid:** Use the exact naming patterns documented:
- Colors: `--color-{semantic-name}`
- Text sizes: `--text-{semantic-name}`
- Font weights: `--font-weight-{name}`
- Line heights: `--leading-{name}`
**Warning signs:** Utility classes not generating, IDE autocomplete missing tokens

### Pitfall 2: HSL vs Hex Inconsistency
**What goes wrong:** Mixing color formats makes calculations and theme variations difficult
**Why it happens:** Existing code uses HSL, Linear design uses hex
**How to avoid:** For this phase, use hex values matching Linear spec (#08090A, #151516, etc.). The existing HSL values can coexist for backward compatibility
**Warning signs:** Colors not matching design spec, difficulty creating opacity variants

### Pitfall 3: Typography Token Line-Height Mismatch
**What goes wrong:** Font size applied but line-height not applied
**Why it happens:** Line-height token not using correct naming convention
**How to avoid:** Use `--text-{name}--line-height` pattern (note double hyphen)
**Warning signs:** Text cramped or too spaced, layout shifts between sizes

### Pitfall 4: Forgetting Heebo Weight Coverage
**What goes wrong:** Font weight tokens reference weights not loaded
**Why it happens:** Heebo only loads 400, 500, 700 in layout.tsx
**How to avoid:** Only define token weights that map to loaded weights:
- 400 = normal (body)
- 500 = medium (captions/labels)
- 700 = bold (headings)
Add 600/800 to Heebo import if needed
**Warning signs:** Font weight visually not changing, fallback font appearing

### Pitfall 5: Not Testing Dark Background Application
**What goes wrong:** #08090A background not applied, old background visible
**Why it happens:** Background applied in BackgroundDepth component, not body
**How to avoid:** Verify BackgroundDepth uses new token, or update body styles
**Warning signs:** Background color different from #08090A on load

## Code Examples

### Complete Color Token Definition
```css
/* Source: Tailwind v4 @theme documentation + Linear design spec */
@theme {
  /* ============================================
   * SEMANTIC COLOR TOKENS - Linear Design System
   * Phase 28: Design Foundation
   * ============================================ */

  /* Background hierarchy (darkest to lightest) */
  --color-bg-primary: #08090A;      /* Main background */
  --color-bg-surface-1: #0F1011;    /* Cards, sections */
  --color-bg-surface-2: #151516;    /* Elevated surfaces */
  --color-bg-elevated: #1A1B1C;     /* Modals, popovers */

  /* Text hierarchy (brightest to dimmest) */
  --color-text-primary: #FAFAFA;    /* Headings, important text */
  --color-text-secondary: #A1A1AA;  /* Body text */
  --color-text-tertiary: #71717A;   /* Captions, metadata */
  --color-text-muted: #52525B;      /* Placeholders */
  --color-text-disabled: #3F3F46;   /* Disabled states */

  /* Brand accent */
  --color-accent-primary: #F97316;  /* CTAs, links */
  --color-accent-hover: #FB923C;    /* Hover state */
  --color-accent-active: #EA580C;   /* Active/pressed */

  /* Status colors */
  --color-status-success: #22C55E;
  --color-status-warning: #EAB308;
  --color-status-error: #EF4444;
  --color-status-info: #3B82F6;

  /* Border colors */
  --color-border-default: rgba(255, 255, 255, 0.1);
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-strong: rgba(255, 255, 255, 0.15);

  /* Accent glow tokens */
  --color-glow-15: rgba(249, 115, 22, 0.15);
  --color-glow-20: rgba(249, 115, 22, 0.2);
  --color-glow-30: rgba(249, 115, 22, 0.3);
}
```

### Complete Typography Token Definition
```css
/* Source: Tailwind v4 font-size docs + 4px-based scale */
@theme {
  /* ============================================
   * TYPOGRAPHY TOKENS - 4px-based scale
   * Phase 28: Design Foundation
   * ============================================ */

  /* Primitive font sizes (4px-based) */
  --font-size-xs: 0.75rem;     /* 12px */
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-md: 1.125rem;    /* 18px */
  --font-size-lg: 1.25rem;     /* 20px */
  --font-size-xl: 1.5rem;      /* 24px */
  --font-size-2xl: 2rem;       /* 32px */
  --font-size-3xl: 3rem;       /* 48px */
  --font-size-4xl: 3.875rem;   /* 62px */

  /* Semantic text tokens with associated properties */

  /* Display - 62px (hero headlines) */
  --text-display: 3.875rem;
  --text-display--line-height: 1.1;
  --text-display--font-weight: 800;
  --text-display--letter-spacing: -0.02em;

  /* Heading 1 - 48px */
  --text-heading-1: 3rem;
  --text-heading-1--line-height: 1.16;
  --text-heading-1--font-weight: 700;

  /* Heading 2 - 32px */
  --text-heading-2: 2rem;
  --text-heading-2--line-height: 1.2;
  --text-heading-2--font-weight: 700;

  /* Heading 3 - 24px */
  --text-heading-3: 1.5rem;
  --text-heading-3--line-height: 1.3;
  --text-heading-3--font-weight: 700;

  /* Body large - 18px */
  --text-body-large: 1.125rem;
  --text-body-large--line-height: 1.6;
  --text-body-large--font-weight: 400;

  /* Body - 16px */
  --text-body: 1rem;
  --text-body--line-height: 1.5;
  --text-body--font-weight: 400;

  /* Body small - 14px */
  --text-body-small: 0.875rem;
  --text-body-small--line-height: 1.5;
  --text-body-small--font-weight: 400;

  /* Caption - 12px */
  --text-caption: 0.75rem;
  --text-caption--line-height: 1.4;
  --text-caption--font-weight: 500;

  /* Label - 12px uppercase */
  --text-label: 0.75rem;
  --text-label--line-height: 1.2;
  --text-label--font-weight: 600;
  --text-label--letter-spacing: 0.05em;

  /* Font weight tokens */
  --font-weight-normal: 400;   /* Body text */
  --font-weight-medium: 500;   /* Captions, labels */
  --font-weight-semibold: 600; /* Buttons, labels */
  --font-weight-bold: 700;     /* H2, H3 */
  --font-weight-extrabold: 800; /* Display headlines */

  /* Line height tokens (standalone) */
  --leading-none: 1;
  --leading-tight: 1.1;        /* Display */
  --leading-snug: 1.2;         /* Headings */
  --leading-normal: 1.5;       /* Body */
  --leading-relaxed: 1.6;      /* Hebrew body */
  --leading-loose: 1.8;        /* Extended prose */

  /* Letter spacing tokens */
  --tracking-tighter: -0.02em; /* Display headings */
  --tracking-tight: -0.01em;   /* Headings */
  --tracking-normal: 0;        /* Body */
  --tracking-wide: 0.05em;     /* Labels, uppercase */
}
```

### Glass Effect Tokens
```css
/* Source: Phase 26 implementation + requirements spec */
@theme {
  /* Glass blur values */
  --blur-glass: 20px;
  --blur-glass-light: 12px;
}

/* Non-utility tokens in :root */
:root {
  /* Glass surface formula per requirements */
  --effect-glass-bg: rgba(255, 255, 255, 0.05);
  --effect-glass-border: rgba(255, 255, 255, 0.08);
  --effect-glass-blur: 20px;

  /* Convenience combined value */
  --color-surface-glass: rgba(255, 255, 255, 0.05);
}
```

### Responsive Typography Pattern
```css
/* Responsive heading scale: 62px -> 48px -> 36px */
@theme {
  --text-display: 2.25rem; /* 36px mobile default */
}

@media (min-width: 768px) {
  @theme {
    --text-display: 3rem; /* 48px tablet */
  }
}

@media (min-width: 1024px) {
  @theme {
    --text-display: 3.875rem; /* 62px desktop */
  }
}
```

**Note:** Tailwind v4 @theme doesn't support nested media queries. Use responsive utility classes instead:
```html
<h1 class="text-4xl md:text-5xl lg:text-display">Headline</h1>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | @theme in CSS | Tailwind v4 (2024) | All config in CSS |
| extend: { colors: {} } | --color-* tokens | Tailwind v4 | Direct CSS custom properties |
| HSL color values | Hex + rgba() | Linear trend | Simpler, design-tool compatible |
| rem-only typography | 4px grid system | 2024-2025 | Consistent spacing alignment |

**Deprecated/outdated:**
- `tailwind.config.js` theme extension: Still works but CSS-first is preferred
- Separate CSS variable declarations: Use @theme for utility generation

## Open Questions

1. **Heebo weight 600 and 800**
   - What we know: Currently only 400, 500, 700 loaded
   - What's unclear: Whether 600 (semibold) and 800 (extrabold) are needed
   - Recommendation: Add 600, 800 to layout.tsx Heebo import to support full typography spec

2. **BackgroundDepth component integration**
   - What we know: Background is applied via BackgroundDepth component, not body
   - What's unclear: How to apply #08090A token to that component
   - Recommendation: Update BackgroundDepth to use `var(--color-bg-primary)` token

3. **Existing HSL color migration**
   - What we know: Current globals.css uses HSL format with `hsl(var(--name))` pattern
   - What's unclear: Whether to migrate existing colors or keep parallel systems
   - Recommendation: Keep existing for backward compatibility, add new semantic tokens alongside

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme) - @theme directive, namespaces, token patterns
- [Tailwind CSS Font Size](https://tailwindcss.com/docs/font-size) - Typography tokens with associated properties
- [Tailwind CSS Font Weight](https://tailwindcss.com/docs/font-weight) - Font weight utilities and customization
- Existing `globals.css` - Current Tailwind v4 setup and patterns

### Secondary (MEDIUM confidence)
- [Linear UI Redesign Blog](https://linear.app/now/how-we-redesigned-the-linear-ui) - Color system, typography, #08090A background
- [Smashing Magazine Naming Conventions](https://www.smashingmagazine.com/2024/05/naming-best-practices/) - Token naming patterns
- [Imperavi Semantic Colors](https://imperavi.com/blog/designing-semantic-colors-for-your-system/) - Surface/text hierarchy patterns
- [LogRocket Glassmorphism](https://blog.logrocket.com/implement-glassmorphism-css/) - Glass effect values (15-20px blur, 5-10% opacity)

### Tertiary (LOW confidence)
- [Heebo Google Fonts](https://fonts.google.com/specimen/Heebo) - Font characteristics (needs validation for line-height specifics)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Already installed and configured, verified with official docs
- Architecture: HIGH - Tailwind v4 @theme patterns verified with official documentation
- Color values: MEDIUM - Linear values approximated, exact #08090A confirmed
- Typography scale: HIGH - 4px-based values from requirements, Tailwind patterns from docs
- Pitfalls: MEDIUM - Based on Tailwind v4 experience and project analysis

**Research date:** 2026-02-05
**Valid until:** 60 days (Tailwind v4 is stable, design tokens are foundational)
