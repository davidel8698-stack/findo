# Phase 13: Design System & Components - Research

**Researched:** 2026-01-31
**Domain:** React component library with RTL, accessibility, and animation
**Confidence:** HIGH

## Summary

This phase involves building a complete atomic component library for Findo with Hebrew typography, RTL-aware animations, and WCAG 2.1 AA accessibility. The research confirms that the existing technical foundation (Motion 12.x, GSAP 3.14, Tailwind 4.0, DirectionProvider) is well-suited for this task.

The standard approach combines shadcn/ui components (which now have first-class RTL support as of January 2026) with Motion variants for declarative animations and GSAP ScrollTrigger for scroll-based reveals. Components should use class-variance-authority (cva) for type-safe variants, CSS logical properties (ms-*, me-*, ps-*, pe-*) for RTL, and respect prefers-reduced-motion for accessibility.

**Primary recommendation:** Use shadcn/ui with `--rtl` flag installation, extend with cva for custom variants, and implement a unified animation system using Motion variants for component animations and GSAP for scroll-triggered effects.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Motion | 12.29.2 | Component animations, variants, gestures | Official successor to Framer Motion; physics-based spring animations |
| GSAP | 3.14.2 | Scroll-triggered animations, complex timelines | Industry standard; free since Webflow acquisition; powerful ScrollTrigger |
| @gsap/react | 2.1.2 | React integration with auto-cleanup | useGSAP hook handles context safety and cleanup |
| Tailwind CSS | 4.0 | Utility-first styling, design tokens | CSS-first @theme blocks; logical properties built-in |
| @radix-ui/react-direction | 1.1.2-rc | RTL context for Radix components | Required for shadcn/ui RTL support |
| clsx + tailwind-merge | 2.1.1 / 3.4.0 | Class name merging | Standard for conditional class handling |

### To Install
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.1 | Type-safe component variants | ALL components with variants |
| next-themes | latest | Dark mode toggle with SSR | Theme switching without flicker |
| lucide-react | latest | Icon library | All icons in components |
| @radix-ui/react-slot | latest | Component composition | asChild prop pattern |

### shadcn/ui Components to Add
| Component | CLI Command | Purpose |
|-----------|-------------|---------|
| button | `pnpm dlx shadcn@latest add button --rtl` | Primary interactive element |
| input | `pnpm dlx shadcn@latest add input --rtl` | Form text input |
| label | `pnpm dlx shadcn@latest add label --rtl` | Form field labels |
| badge | `pnpm dlx shadcn@latest add badge --rtl` | Status indicators |
| card | `pnpm dlx shadcn@latest add card --rtl` | Content containers |
| field | `pnpm dlx shadcn@latest add field --rtl` | Form field composition |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn/ui | Radix UI primitives directly | More control but more boilerplate; shadcn gives RTL-adapted defaults |
| Motion | React Spring | Motion has better variants API and staggerChildren orchestration |
| cva | Hand-rolled variants | cva provides TypeScript safety and compound variants |

**Installation:**
```bash
# New dependencies
pnpm add class-variance-authority next-themes lucide-react @radix-ui/react-slot

# shadcn/ui init with RTL (if not already done)
pnpm dlx shadcn@latest init --rtl

# Add components
pnpm dlx shadcn@latest add button input label badge card field --rtl
```

## Architecture Patterns

### Recommended Project Structure
```
website/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── atoms/           # Custom atomic components
│   │   ├── Logo.tsx
│   │   ├── Icon.tsx
│   │   └── ...
│   ├── molecules/       # Composed components
│   │   ├── CTAGroup.tsx
│   │   ├── StatItem.tsx
│   │   ├── NavLink.tsx
│   │   └── FormField.tsx
│   └── motion/          # Animation components
│       ├── ScrollReveal.tsx
│       ├── FadeIn.tsx
│       └── variants.ts   # Shared animation variants
├── lib/
│   ├── gsapConfig.ts    # GSAP setup (exists)
│   ├── utils.ts         # cn() helper
│   └── animation.ts     # Animation constants
├── providers/
│   ├── MotionProvider.tsx   # LazyMotion (exists)
│   └── ThemeProvider.tsx    # Dark mode (to add)
└── app/
    └── globals.css      # Tailwind @theme tokens
```

### Pattern 1: CVA Component Variants
**What:** Use class-variance-authority for type-safe variant props
**When to use:** Any component with multiple visual states
**Example:**
```typescript
// Source: https://cva.style/docs/getting-started/variants
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 px-6 py-3 text-base", // 48px touch target
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        icon: "h-12 w-12", // 48px touch target
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
```

### Pattern 2: Motion Variants with Orchestration
**What:** Define reusable animation variants with stagger/delay
**When to use:** Any animated component or container
**Example:**
```typescript
// Source: https://motion.dev/docs/stagger
// Source: https://framerbook.com/animation/example-animations/28-variants-staggered-animation/

// Shared variants for consistent animations
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};
```

### Pattern 3: ScrollReveal with Intersection Observer + Motion
**What:** Trigger animations when elements enter viewport
**When to use:** Sections, cards, content blocks that animate on scroll
**Example:**
```typescript
// Source: https://www.freecodecamp.org/news/reveal-on-scroll-in-react-using-the-intersection-observer-api/
"use client";

import { useRef } from "react";
import { m, useInView } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
```

### Pattern 4: RTL-Aware Styling with Logical Properties
**What:** Use CSS logical properties for automatic RTL adaptation
**When to use:** ALL margin, padding, positioning
**Example:**
```typescript
// Source: https://tailwindcss.com/docs/padding
// Source: https://github.com/shadcn-ui/ui/issues/2759

// GOOD: Logical properties (RTL-aware)
<div className="ps-4 pe-2 ms-auto">  {/* padding-inline-start, padding-inline-end */}
  <Icon className="me-2" />           {/* margin-inline-end */}
</div>

// BAD: Physical properties (breaks in RTL)
<div className="pl-4 pr-2 ml-auto">
  <Icon className="mr-2" />
</div>

// Logical property mappings:
// ms-* = margin-inline-start (ml in LTR, mr in RTL)
// me-* = margin-inline-end (mr in LTR, ml in RTL)
// ps-* = padding-inline-start
// pe-* = padding-inline-end
// text-start = text-align: start
// text-end = text-align: end
// start-* = inset-inline-start (left in LTR, right in RTL)
// end-* = inset-inline-end
```

### Pattern 5: Dark Mode with next-themes
**What:** SSR-safe theme switching without flicker
**When to use:** Theme toggle component
**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/dark-mode/next

// providers/ThemeProvider.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"  // Dark mode by default per CONTEXT.md
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

// app/layout.tsx - Add suppressHydrationWarning
<html lang="he" dir="rtl" suppressHydrationWarning>
```

### Anti-Patterns to Avoid
- **Using physical CSS properties (ml-*, pr-*, left-*, right-*):** Breaks RTL layout. Always use logical (ms-*, pe-*, start-*, end-*)
- **Forgetting focus-visible styles:** Never remove outline without providing alternative. Use :focus-visible for keyboard-only
- **Creating new Intersection Observers per element:** Reuse observers or use Motion's useInView hook
- **Hardcoding animation durations:** Define in variants for consistency and reduced-motion support
- **Using transform: translateZ(0) everywhere:** Only use will-change on elements that actually animate

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Component variants | Switch statements | class-variance-authority | Type safety, compound variants, cleaner API |
| Class name merging | String concatenation | clsx + tailwind-merge | Handles conflicts, conditional classes |
| Focus management | Manual focus handling | Radix UI primitives | Handles edge cases, accessibility |
| Theme switching | localStorage + class toggle | next-themes | SSR-safe, no flicker, system preference |
| Scroll animations | Manual scroll listeners | Motion useInView or GSAP ScrollTrigger | Performance, cleanup, browser optimization |
| Icon components | Custom SVG components | lucide-react | Consistent sizing, tree-shakeable |
| Form field composition | Manual label+input+error | shadcn/ui Field component | Accessible by default, consistent |

**Key insight:** Every "simple" UI pattern has edge cases (keyboard navigation, RTL, accessibility, SSR). shadcn/ui and Motion handle these; custom solutions miss them.

## Common Pitfalls

### Pitfall 1: Touch Targets Too Small
**What goes wrong:** Buttons/inputs smaller than 48px frustrate mobile users
**Why it happens:** Desktop-first design, focus on visual appearance
**How to avoid:** Default button height to h-12 (48px), use size="icon" at 48x48
**Warning signs:** User complaints, high tap error rates on analytics

### Pitfall 2: Ignoring prefers-reduced-motion
**What goes wrong:** Animations trigger vestibular disorders, legal liability
**Why it happens:** Animations look good, easy to forget edge cases
**How to avoid:** Use Motion's reducedMotion="user" on MotionConfig, or useReducedMotion hook
**Warning signs:** No motion media query in CSS, no accessibility testing
```typescript
// Source: https://motion.dev/docs/react-accessibility
<MotionConfig reducedMotion="user">
  {/* Automatically disables transform/layout animations */}
</MotionConfig>
```

### Pitfall 3: Contrast Failures in Dark Mode
**What goes wrong:** Text unreadable, fails WCAG 4.5:1 requirement
**Why it happens:** Colors look fine on developer's monitor, no testing
**How to avoid:** Use Tailwind's dark: variants with tested color pairs, automated testing
**Warning signs:** No contrast checker in development workflow

### Pitfall 4: Animation Cleanup in React
**What goes wrong:** Memory leaks, duplicate animations on re-render
**Why it happens:** React 18 strict mode runs effects twice, GSAP creates persistent timelines
**How to avoid:** Use useGSAP hook with scope, always return cleanup functions
**Warning signs:** Console warnings about cleanup, animations stacking on navigation
```typescript
// Source: https://gsap.com/resources/React/
const { contextSafe } = useGSAP({ scope: containerRef });
// contextSafe wraps event handlers to auto-cleanup
```

### Pitfall 5: RTL Icon Direction
**What goes wrong:** Arrows point wrong direction in RTL
**Why it happens:** Icons are visual, not semantic
**How to avoid:** shadcn/ui RTL mode adds rtl:rotate-180 to directional icons
**Warning signs:** Chevrons pointing left when they should point right

### Pitfall 6: Loading Spinner During SSR
**What goes wrong:** Hydration mismatch, console errors
**Why it happens:** Animation state differs between server and client
**How to avoid:** Loading states should use CSS animations or be client-only
**Warning signs:** React hydration warnings in console

## Code Examples

Verified patterns from official sources:

### Button with Loading Shimmer (per CONTEXT.md)
```typescript
// Per CONTEXT.md: "Loading state: button pulses/shimmers, no spinner"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border-2 border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12 min-w-[48px] px-6 py-3 text-base", // 48px touch target
        sm: "h-10 min-w-[40px] px-4 py-2 text-sm",
        lg: "h-14 min-w-[56px] px-8 py-4 text-lg",
        icon: "h-12 w-12",
      },
      loading: {
        true: "animate-shimmer bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:200%_100%]",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
);

// CSS for shimmer animation (add to globals.css)
// @keyframes shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }
// .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
```

### Accessible Input with Label
```typescript
// Source: https://ui.shadcn.com/docs/components/input
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function EmailField() {
  return (
    <Field>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        className="h-12" // 48px touch target
      />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  );
}
```

### Staggered Container Animation
```typescript
// Source: https://framerbook.com/animation/example-animations/28-variants-staggered-animation/
"use client";

import { m } from "motion/react";
import { staggerContainer, fadeInUp } from "@/lib/animation";

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {features.map((feature) => (
        <m.div key={feature.id} variants={fadeInUp}>
          <FeatureCard {...feature} />
        </m.div>
      ))}
    </m.div>
  );
}
```

### Focus Ring Styling
```typescript
// Source: https://web.dev/learn/accessibility/focus
// globals.css

/* Focus ring that only shows on keyboard navigation */
.focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background;
}

/* Double ring for extra visibility (HIGH contrast) */
.focus-ring-double {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-[0_0_0_4px_rgba(var(--ring),0.3)];
}
```

### Typography Scale (Tailwind 4 @theme)
```css
/* Source: https://tailwindcss.com/docs/theme */
/* app/globals.css */

@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Heebo Hebrew font */
  --font-sans: var(--font-heebo), Arial, sans-serif;

  /* Typography scale - WCAG 16px+ body, optimized for Hebrew */
  --font-size-xs: 0.75rem;     /* 12px - captions only */
  --font-size-sm: 0.875rem;    /* 14px - secondary text */
  --font-size-base: 1rem;      /* 16px - body minimum */
  --font-size-lg: 1.125rem;    /* 18px - lead text */
  --font-size-xl: 1.25rem;     /* 20px - h4 */
  --font-size-2xl: 1.5rem;     /* 24px - h3 */
  --font-size-3xl: 1.875rem;   /* 30px - h2 */
  --font-size-4xl: 2.25rem;    /* 36px - h1 mobile */
  --font-size-5xl: 3rem;       /* 48px - h1 desktop */

  /* Line heights - 1.5+ for body per WCAG */
  --line-height-tight: 1.25;   /* Headings */
  --line-height-normal: 1.5;   /* Body text minimum */
  --line-height-relaxed: 1.625;/* Hebrew-optimized body */

  /* Spacing scale */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */

  /* Border radius - moderately rounded per CONTEXT.md */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px - buttons, cards */
  --radius-xl: 1rem;       /* 16px */
  --radius-full: 9999px;   /* Pills */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion import | motion/react import | Motion 11+ | Smaller bundle, better tree-shaking |
| tailwind.config.js | @theme in CSS | Tailwind 4.0 | No JS config file, CSS-first |
| darkMode: "class" in config | @custom-variant dark | Tailwind 4.0 | CSS-native dark mode |
| ml-*/mr-* for spacing | ms-*/me-* logical props | Tailwind 3.3+ | Automatic RTL adaptation |
| Manual RTL component fixes | shadcn --rtl flag | January 2026 | Auto-conversion at install time |
| GSAP Club membership | GSAP free for all | Webflow acquisition 2024 | No license needed |

**Deprecated/outdated:**
- `framer-motion` package: Now `motion` package with `/react` subpath
- `tailwind.config.js`: Replace with CSS @theme blocks in Tailwind 4
- Physical CSS properties (ml, pr, left, right): Use logical (ms, pe, start, end)

## Open Questions

Things that couldn't be fully resolved:

1. **Exact spring physics values for "playful" animations**
   - What we know: Spring uses stiffness, damping, mass; Motion provides presets
   - What's unclear: Exact values that feel "bouncy, expressive" per CONTEXT.md
   - Recommendation: Start with stiffness: 200, damping: 15 (bouncy) and tune by feel

2. **Primary brand color selection**
   - What we know: Marked as Claude's discretion in CONTEXT.md; conversion best practices suggest orange/green for CTAs
   - What's unclear: Specific hue that matches "bold with contrast" and works in dark mode
   - Recommendation: Research conversion-optimized colors in 13-04 typography/tokens plan

3. **GSAP vs Motion for specific animations**
   - What we know: Motion for component state, GSAP for scroll/complex timelines
   - What's unclear: Exact boundary - when does a component animation become "complex"?
   - Recommendation: Default to Motion; use GSAP only for ScrollTrigger pin/scrub effects

## Sources

### Primary (HIGH confidence)
- [shadcn/ui RTL Changelog](https://ui.shadcn.com/docs/changelog/2026-01-rtl) - RTL implementation details
- [shadcn/ui Button](https://ui.shadcn.com/docs/components/button) - Button variants and accessibility
- [shadcn/ui Input](https://ui.shadcn.com/docs/components/input) - Input component patterns
- [shadcn/ui Dark Mode](https://ui.shadcn.com/docs/dark-mode/next) - next-themes integration
- [GSAP React](https://gsap.com/resources/React/) - useGSAP hook, context safety
- [Tailwind CSS Theme](https://tailwindcss.com/docs/theme) - @theme tokens
- [Tailwind CSS Padding](https://tailwindcss.com/docs/padding) - Logical properties
- [cva Variants](https://cva.style/docs/getting-started/variants) - Component variant API
- [W3C WCAG Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) - 4.5:1 requirement
- [W3C Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) - 48px touch targets

### Secondary (MEDIUM confidence)
- [Motion Stagger](https://motion.dev/docs/stagger) - staggerChildren orchestration
- [Motion Accessibility](https://motion.dev/docs/react-accessibility) - reducedMotion handling
- [Framer Book Variants](https://framerbook.com/animation/example-animations/28-variants-staggered-animation/) - Animation patterns
- [FreeCodeCamp Intersection Observer](https://www.freecodecamp.org/news/reveal-on-scroll-in-react-using-the-intersection-observer-api/) - Scroll reveal pattern
- [web.dev Focus](https://web.dev/learn/accessibility/focus) - Focus management
- [MDN focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible) - Keyboard-only focus

### Tertiary (LOW confidence)
- Various Medium articles on spring physics values - need practical testing
- Community discussions on exact RTL edge cases - verify during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs and existing package.json
- Architecture: HIGH - Patterns from official shadcn/ui, GSAP, Motion documentation
- Pitfalls: HIGH - Based on WCAG specs and official React/GSAP cleanup guidance
- Animation values: MEDIUM - Spring physics need practical tuning
- Color palette: LOW - Marked as Claude's discretion, needs conversion research

**Research date:** 2026-01-31
**Valid until:** 2026-02-28 (30 days - stable libraries, but verify shadcn/ui RTL updates)
