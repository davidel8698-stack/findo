# Phase 29: Layout System - Research

**Researched:** 2026-02-05
**Domain:** CSS Grid, Tailwind CSS v4 Spacing & Layout, 4px Design System
**Confidence:** HIGH

## Summary

This phase implements a comprehensive 4px-grid spacing system with responsive breakpoints. The project uses Tailwind CSS v4.1.18 with the CSS-first `@theme` directive, which already has an extensive spacing scale. The phase requires extending this with Linear-specific spacing tokens (4, 8, 12, 16, 24, 32, 48, 64, 96, 128px), semantic section padding tokens, a 12-column grid with 24px gutters, and 1200px max-width content containers.

The existing `globals.css` already contains Tailwind v4 spacing tokens (`--spacing-*`) covering 0-96 rem-based values. Phase 29 will add numeric-named tokens matching the 4px scale (space-4, space-8, etc.) and semantic section tokens (py-section-hero, py-section-feature, py-section-cta) for consistent vertical rhythm. The audit will review all sections in `page.tsx` to ensure spacing values conform to the 4px grid.

**Primary recommendation:** Extend the existing `@theme` block with 4px-grid spacing tokens using numeric naming (`--spacing-4`, `--spacing-8`), add semantic section padding tokens, configure a 12-column grid with 24px gutters, and update container max-width to 1200px. Audit all existing sections for 4px alignment, snapping non-conforming values to nearest token.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.1.18 | CSS-first utility framework | Already installed, `@theme` directive for spacing tokens |
| PostCSS | 8.x | CSS processing | Already configured via `@tailwindcss/postcss` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None | - | - | Pure Tailwind approach, no additional libraries needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom grid classes | Tailwind grid utilities | Tailwind already has `grid-cols-12`, use built-in |
| CSS Grid for layout | Flexbox | Grid is better for 12-column layouts |
| px units for spacing | rem units | rem is more accessible, already used in project |

**No installation needed:** All tools are already in place.

## Architecture Patterns

### Recommended Token Structure
```css
@theme {
  /* ============================================
   * 4PX-GRID SPACING TOKENS - Phase 29
   * Linear-style jumps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
   * Numeric naming: space-4, space-8, etc.
   * ============================================ */

  /* Spacing scale (4px grid) */
  --spacing-4: 0.25rem;    /* 4px */
  --spacing-8: 0.5rem;     /* 8px */
  --spacing-12: 0.75rem;   /* 12px */
  --spacing-16: 1rem;      /* 16px */
  --spacing-24: 1.5rem;    /* 24px */
  --spacing-32: 2rem;      /* 32px */
  --spacing-48: 3rem;      /* 48px */
  --spacing-64: 4rem;      /* 64px */
  --spacing-96: 6rem;      /* 96px */
  --spacing-128: 8rem;     /* 128px */

  /* Section padding - semantic tokens */
  --spacing-section-hero: 7.5rem;      /* 120px desktop */
  --spacing-section-feature: 5rem;     /* 80px desktop */
  --spacing-section-cta: 4rem;         /* 64px desktop */
  --spacing-section-footer: 3rem;      /* 48px desktop */

  /* Mobile section padding (60% scale) */
  --spacing-section-hero-mobile: 4.5rem;    /* 72px */
  --spacing-section-feature-mobile: 3rem;   /* 48px */
  --spacing-section-cta-mobile: 2.5rem;     /* 40px */

  /* Grid gutters */
  --spacing-gutter: 1.5rem;            /* 24px */
  --spacing-edge: 1rem;                /* 16px mobile edge margins */

  /* Container max-width */
  --container-content: 75rem;          /* 1200px */
}
```

### Pattern 1: 12-Column Grid with 24px Gutters
**What:** CSS Grid layout with 12 equal columns and consistent gutter spacing
**When to use:** Full-width section layouts requiring column-based positioning
**Example:**
```html
<!-- Source: Tailwind v4 grid documentation -->
<div class="grid grid-cols-12 gap-6">
  <!-- gap-6 = 24px when using default spacing scale -->
  <div class="col-span-4">1/3 width</div>
  <div class="col-span-8">2/3 width</div>
</div>
```

### Pattern 2: Content Container with 1200px Max-Width
**What:** Centered container with maximum width for readability
**When to use:** All main content sections
**Example:**
```html
<!-- Container with 1200px max-width, centered, with edge padding -->
<div class="container mx-auto max-w-[1200px] px-4 md:px-6">
  <!-- Content -->
</div>
```

Or define in globals.css (already has container auto-centering):
```css
@layer utilities {
  .container {
    margin-inline: auto;
    max-width: 75rem; /* 1200px */
    padding-inline: 1rem; /* 16px mobile edge */
  }

  @media (min-width: 768px) {
    .container {
      padding-inline: 1.5rem; /* 24px desktop edge */
    }
  }
}
```

### Pattern 3: Semantic Section Padding
**What:** Type-specific vertical padding for visual rhythm
**When to use:** Hero, features, CTA, footer sections
**Example:**
```html
<!-- Hero section: 120px desktop, 72px mobile -->
<section class="py-section-hero">

<!-- Feature/content sections: 80px desktop, 48px mobile -->
<section class="py-section-feature">

<!-- CTA sections: 64px desktop, 40px mobile -->
<section class="py-section-cta">
```

Implementation in CSS:
```css
@layer utilities {
  .py-section-hero {
    padding-block: var(--spacing-section-hero-mobile);
  }
  .py-section-feature {
    padding-block: var(--spacing-section-feature-mobile);
  }
  .py-section-cta {
    padding-block: var(--spacing-section-cta-mobile);
  }

  @media (min-width: 768px) {
    .py-section-hero {
      padding-block: var(--spacing-section-hero);
    }
    .py-section-feature {
      padding-block: var(--spacing-section-feature);
    }
    .py-section-cta {
      padding-block: var(--spacing-section-cta);
    }
  }
}
```

### Pattern 4: Responsive Spacing with Tailwind Breakpoints
**What:** Use existing Tailwind breakpoints for spacing adjustments
**When to use:** Any responsive spacing needs
**Example:**
```html
<!-- Mobile: 48px, Desktop: 80px -->
<section class="py-12 md:py-20">
```

### Anti-Patterns to Avoid
- **Arbitrary values for common spacing:** Use `py-12` not `py-[47px]` - snap to 4px grid
- **Mixing spacing scales:** Don't use both old `py-16` (64px) and new `py-64` (256px with Tailwind default scale)
- **Hardcoded pixel values:** Use rem-based tokens for accessibility
- **Forgetting mobile edge margins:** Content should never touch screen edges (16px minimum)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 12-column grid | Custom CSS Grid | `grid-cols-12` utility | Tailwind already has this |
| Responsive breakpoints | Custom media queries | Tailwind variants (`md:`, `lg:`) | Consistent with existing code |
| Container centering | Custom margin logic | `mx-auto` utility | Already working in project |
| Spacing calculations | Manual rem conversions | `@theme` tokens | Auto-generates utilities |
| Section padding variants | Custom classes per section | Semantic utility classes | Consistent, reusable |

**Key insight:** Tailwind v4's `@theme` generates utility classes from spacing tokens automatically. Define `--spacing-section-hero` and `py-section-hero` becomes available without manual utility definition.

**Note:** Tailwind v4 requires custom utilities for semantic spacing that isn't pure numeric. The `--spacing-section-hero` token won't auto-generate `py-section-hero` - we need explicit utility classes in `@layer utilities`.

## Common Pitfalls

### Pitfall 1: Tailwind Default Spacing Confusion
**What goes wrong:** Using `gap-6` expecting 24px but getting 1.5rem (which IS 24px) - confusion about which scale to use
**Why it happens:** Project has both numbered Tailwind defaults (`--spacing-6` = 1.5rem) and new 4px tokens (`--spacing-24` = 1.5rem)
**How to avoid:** Document that Tailwind defaults remain valid. `gap-6` equals `gap-24` in the 4px system. Use whichever is clearer.
**Warning signs:** Inconsistent gap values across components

### Pitfall 2: Container Not Respecting 1200px
**What goes wrong:** Container uses default breakpoint-based max-widths instead of fixed 1200px
**Why it happens:** Tailwind's default container behavior matches breakpoints
**How to avoid:** Override container in `@layer utilities` or use explicit `max-w-[1200px]` / `max-w-7xl` (which is 80rem = 1280px, close enough or use custom)
**Warning signs:** Container width jumping at different breakpoints

### Pitfall 3: Mobile Edge Touch
**What goes wrong:** Content touches screen edge on mobile, looks cramped
**Why it happens:** Missing horizontal padding on container
**How to avoid:** Always include `px-4` or `px-edge` (16px) on mobile containers
**Warning signs:** Text touching left/right screen edges on mobile

### Pitfall 4: Inconsistent Section Rhythm
**What goes wrong:** Some sections have 80px padding, others have 96px, rhythm feels off
**Why it happens:** Using different padding values across sections
**How to avoid:** Use semantic section tokens consistently:
  - Hero: 120px/72px (desktop/mobile)
  - Features: 80px/48px
  - CTA: 64px/40px
**Warning signs:** Visual inconsistency in section breathing room

### Pitfall 5: Grid Gutter Misalignment
**What goes wrong:** 12-column grid gutters don't align with other spacing
**Why it happens:** Using different gap values
**How to avoid:** Standardize on `gap-6` (24px) for 12-column grids
**Warning signs:** Columns not aligning with other layout elements

### Pitfall 6: Not Using Logical Properties for RTL
**What goes wrong:** Padding/margin breaks in RTL layout
**Why it happens:** Using `pl-4` instead of `ps-4` (padding-inline-start)
**How to avoid:** For horizontal spacing that should flip in RTL, use logical properties:
  - `ps-*` (padding-inline-start) instead of `pl-*`
  - `pe-*` (padding-inline-end) instead of `pr-*`
  - `ms-*`, `me-*` for margins
**Warning signs:** Layout looking wrong when viewed in Hebrew RTL mode

## Code Examples

### Complete Spacing Token Definition
```css
/* Source: Tailwind v4 @theme documentation + 4px grid system */
@theme {
  /* ============================================
   * 4PX-GRID SPACING TOKENS - Phase 29
   * Linear Design System
   * ============================================ */

  /* Base spacing (4px grid multiples) */
  --spacing-4: 0.25rem;    /* 4px - xs */
  --spacing-8: 0.5rem;     /* 8px - sm */
  --spacing-12: 0.75rem;   /* 12px */
  --spacing-16: 1rem;      /* 16px - md */
  --spacing-24: 1.5rem;    /* 24px - lg, gutter */
  --spacing-32: 2rem;      /* 32px - xl */
  --spacing-48: 3rem;      /* 48px */
  --spacing-64: 4rem;      /* 64px */
  --spacing-96: 6rem;      /* 96px */
  --spacing-128: 8rem;     /* 128px */

  /* Section vertical rhythm */
  --spacing-section-hero: 7.5rem;      /* 120px */
  --spacing-section-feature: 5rem;     /* 80px */
  --spacing-section-cta: 4rem;         /* 64px */
  --spacing-section-footer: 3rem;      /* 48px */

  /* Mobile scale (60%) */
  --spacing-section-hero-mobile: 4.5rem;    /* 72px */
  --spacing-section-feature-mobile: 3rem;   /* 48px */
  --spacing-section-cta-mobile: 2.5rem;     /* 40px */

  /* Grid system */
  --spacing-gutter: 1.5rem;            /* 24px column gap */
  --spacing-edge: 1rem;                /* 16px mobile edge */
}
```

### Section Padding Utilities
```css
/* Source: Custom utilities for semantic section padding */
@layer utilities {
  /* Hero section: 120px desktop, 72px mobile */
  .py-section-hero {
    padding-block: var(--spacing-section-hero-mobile);
  }

  /* Feature sections: 80px desktop, 48px mobile */
  .py-section-feature {
    padding-block: var(--spacing-section-feature-mobile);
  }

  /* CTA sections: 64px desktop, 40px mobile */
  .py-section-cta {
    padding-block: var(--spacing-section-cta-mobile);
  }

  /* Footer: 48px both */
  .py-section-footer {
    padding-block: var(--spacing-section-footer);
  }

  @media (min-width: 768px) {
    .py-section-hero {
      padding-block: var(--spacing-section-hero);
    }
    .py-section-feature {
      padding-block: var(--spacing-section-feature);
    }
    .py-section-cta {
      padding-block: var(--spacing-section-cta);
    }
  }
}
```

### Container Configuration
```css
/* Source: Existing globals.css pattern, extended */
@layer utilities {
  .container {
    margin-inline: auto;
    width: 100%;
    max-width: 75rem; /* 1200px */
    padding-inline: var(--spacing-edge); /* 16px mobile */
  }

  @media (min-width: 768px) {
    .container {
      padding-inline: var(--spacing-gutter); /* 24px desktop */
    }
  }
}
```

### 12-Column Grid Implementation
```html
<!-- Standard 12-column grid with 24px gutters -->
<div class="container">
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-8">Main content</div>
    <div class="col-span-12 lg:col-span-4">Sidebar</div>
  </div>
</div>
```

### Section Example with New Tokens
```tsx
// Before audit
<section className="py-16 md:py-24">

// After audit - using semantic tokens
<section className="py-section-feature">
```

### Mapping Existing Values to 4px Grid
| Current Value | 4px Grid Snap | Token |
|---------------|---------------|-------|
| `py-8` (32px) | 32px (on grid) | `py-32` or `py-8` |
| `py-12` (48px) | 48px (on grid) | `py-48` or `py-12` |
| `py-16` (64px) | 64px (on grid) | `py-64` or `py-16` |
| `py-20` (80px) | 80px (on grid) | `py-section-feature` |
| `py-24` (96px) | 96px (on grid) | `py-96` or `py-24` |
| `py-[47px]` | 48px (snap up) | `py-48` or `py-12` |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 8px grid system | 4px grid system | 2024-2025 | Finer control, better for tight layouts |
| tailwind.config.js spacing | @theme CSS tokens | Tailwind v4 (2024) | CSS-native configuration |
| Arbitrary values `py-[47px]` | Token-based `py-48` | Design system trend | Consistency, maintainability |
| Per-section custom padding | Semantic section tokens | 2025 | Consistent rhythm across pages |

**Deprecated/outdated:**
- `tailwind.config.js` theme extension: Still works but CSS-first is preferred
- Pixel-based spacing: Use rem for accessibility

## Open Questions

1. **Tailwind Default vs 4px Numeric Naming Overlap**
   - What we know: Tailwind defaults use `--spacing-1` through `--spacing-96` based on `0.25rem` multipliers
   - What's unclear: Whether to override defaults or add parallel tokens
   - Recommendation: Add parallel numeric tokens (`--spacing-4`, `--spacing-8`) that map to same values. `gap-6` = `gap-24` in the new system (both = 24px)

2. **Container Override vs max-w-7xl**
   - What we know: Tailwind's `max-w-7xl` is 80rem (1280px), requirement is 1200px
   - What's unclear: Whether to override container default or use custom max-width
   - Recommendation: Define `--container-content: 75rem` and use `max-w-content` utility, keeping default container behavior

3. **Audit Scope - Which Components**
   - What we know: `page.tsx` references ~20 sections
   - What's unclear: Whether to audit all or prioritize visible sections
   - Recommendation: Audit all sections in `page.tsx`, starting with Hero (most visible). Low-traffic sections can use silent exceptions.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme) - @theme directive, spacing namespaces
- [Tailwind CSS Spacing](https://tailwindcss.com/docs/customizing-spacing) - Spacing scale customization
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design) - Breakpoints and variants
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns) - 12-column grid patterns
- [Tailwind CSS Gap](https://tailwindcss.com/docs/gap) - Gutter utilities
- [Tailwind CSS Container](https://tailwindcss.com/docs/container) - Container configuration
- Existing `globals.css` - Current Tailwind v4 setup patterns

### Secondary (MEDIUM confidence)
- [4px Grid Design System](https://medium.com/@nishaznani/design-with-4px-grid-system-1676d1091f51) - 4px grid philosophy and values
- [UX Collective 4px Baseline](https://uxdesign.cc/the-4px-baseline-grid-89485012dea6) - Vertical rhythm patterns
- [Tailwind CSS v4 @theme Guide](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06) - Design tokens patterns
- [Designary Grid Systems](https://blog.designary.com/p/layout-basics-grid-systems-and-the-4px-grid) - 4px grid implementation

### Tertiary (LOW confidence)
- Project CONTEXT.md decisions - User-specified values (verified as source of truth)

## Metadata

**Confidence breakdown:**
- Spacing tokens: HIGH - Tailwind v4 documentation verified, existing project patterns established
- Grid implementation: HIGH - Tailwind grid utilities verified, standard approach
- Section padding values: MEDIUM - Based on CONTEXT.md decisions, needs visual validation
- Audit patterns: MEDIUM - Based on project analysis, may need adjustment during implementation

**Research date:** 2026-02-05
**Valid until:** 60 days (Tailwind v4 is stable, spacing/layout fundamentals don't change rapidly)
