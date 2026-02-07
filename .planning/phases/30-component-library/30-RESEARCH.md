# Phase 30: Component Library - Research

**Researched:** 2026-02-05
**Domain:** React component library with Motion animations, Tailwind CSS, Linear-style design
**Confidence:** HIGH

## Summary

This phase redesigns all interactive components (buttons, cards, navigation, hero, footer) to Linear specifications with proper variants, hover states, and animations. The existing codebase already uses a solid foundation with `motion/react` (v12.29.2), Tailwind CSS v4, `class-variance-authority` for variants, and Radix UI primitives.

The research confirms that the current stack is well-suited for implementing the Linear-style "bouncy spring" animations. The primary work involves:
1. **Updating button animations** to use bouncy spring transitions with slight overshoot (stiffness: 260, damping: 20)
2. **Implementing gradient border cards** with highlighted variants using CSS mask/mask-composite or border-image techniques
3. **Enhancing navigation scroll state** with 85% opacity and stronger blur when scrolled
4. **Creating glassmorphism card system** per Linear spec (5% white bg, 20px blur, 8% border)

**Primary recommendation:** Use the existing `motion/react` spring system with physics-based springs (stiffness/damping) rather than duration-based, as they incorporate velocity from gestures for more natural "bouncy" feedback.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `motion/react` | 12.29.2 | Spring animations, gestures | Already in codebase, native React 19 support |
| `tailwindcss` | 4.x | Styling, design tokens | Already configured with theme system |
| `class-variance-authority` | 0.7.1 | Component variants | Already powers button/badge variants |
| `@radix-ui/react-slot` | 1.2.4 | Polymorphic components | Already used for `asChild` pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` | 0.563.0 | Icons | Leading/trailing button icons |
| `clsx` + `tailwind-merge` | Already in lib/utils | Class merging | All component className composition |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion/react springs | CSS transitions | CSS lacks velocity-aware spring physics |
| CVA variants | Tailwind variants | CVA provides type-safe variant API |
| Custom gradient borders | border-image | border-image doesn't work with border-radius |

**Installation:**
No additional packages needed - all dependencies already in place.

## Architecture Patterns

### Recommended Project Structure
```
components/
  ui/               # Primitive components (button, card, badge)
    button.tsx      # Button with variants (primary, secondary, ghost)
    card.tsx        # Card with variants (base, highlighted, glass)
    badge.tsx       # Badge with semantic color variants
  sections/
    hero/           # Hero-specific components
      GlassNav.tsx  # Navigation with scroll state
      Hero.tsx      # Hero pattern container
    footer/         # Footer components (new)
  molecules/        # Composed components
    CTAGroup.tsx    # Primary + Ghost button pairing
```

### Pattern 1: Variant-based Component with Motion
**What:** Components use CVA for styling variants + motion props for animation
**When to use:** Any interactive component needing hover/tap feedback
**Example:**
```typescript
// Source: Existing button.tsx pattern extended
const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ variant, size, ...props }, ref) => {
    return (
      <m.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }))}
        // Bouncy spring per CONTEXT.md decisions
        whileHover={{ y: -2, boxShadow: "var(--shadow-hover)" }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 260,  // Bouncy feel
          damping: 20,     // Slight overshoot
        }}
        {...props}
      />
    );
  }
);
```

### Pattern 2: Gradient Border Card
**What:** Cards with gradient borders using wrapper + inner element technique
**When to use:** Highlighted/featured cards, pricing tiers
**Example:**
```typescript
// Source: Pattern from Tailwind CSS examples
<div className="rounded-2xl p-px bg-gradient-to-b from-orange-500/50 to-transparent">
  <div className="bg-card rounded-[calc(1rem-1px)] p-6">
    {/* Card content */}
  </div>
</div>
```

### Pattern 3: Scroll-State Navigation
**What:** Navigation transitions from transparent to blurred glass on scroll
**When to use:** Sticky headers
**Example:**
```typescript
// Source: Existing GlassNav.tsx pattern
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50); // Per CONTEXT.md: 50-100px threshold
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Apply: transparent at top -> 85% opacity + stronger blur when scrolled
```

### Anti-Patterns to Avoid
- **Hard-coded animation values:** Store in `lib/animation.ts` for consistency
- **CSS transitions for interactive animations:** Use motion springs for velocity-aware physics
- **border-image for gradient borders:** Doesn't work with border-radius; use wrapper technique
- **Inline spring configs:** Define named presets (`springBouncy`, `springGentle`)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bouncy spring animation | Custom easing function | `motion/react` type: "spring" | Velocity-aware physics, natural feel |
| Button variants | Conditional className strings | `class-variance-authority` | Type-safe, composable, documented |
| Gradient borders on rounded cards | border-image CSS | Wrapper div technique | border-image ignores border-radius |
| Scroll position detection | Intersection Observer | window.scrollY + throttle | Simpler for header scroll state |
| Loading spinner in button | Custom SVG animation | lucide-react Loader2 + animate-spin | Consistent, accessible |

**Key insight:** The codebase already has well-designed patterns in `lib/animation.ts` and `ui/button.tsx`. Extend these rather than creating parallel systems.

## Common Pitfalls

### Pitfall 1: Duration-Based vs Physics-Based Springs
**What goes wrong:** Using duration-based springs (`duration: 0.3, bounce: 0.2`) instead of physics-based (`stiffness: 260, damping: 20`)
**Why it happens:** Duration-based is more intuitive for designers
**How to avoid:** Physics-based springs incorporate gesture velocity for natural feel. Always use `stiffness`/`damping` for interactive elements.
**Warning signs:** Animations feel "disconnected" from user input

### Pitfall 2: Glassmorphism Performance on Mobile
**What goes wrong:** backdrop-filter causes jank on low-end devices
**Why it happens:** GPU compositing cost + multiple blurred elements
**How to avoid:** Use solid fallback on mobile (already done in codebase), apply glass selectively
**Warning signs:** Dropped frames, janky scroll on mobile devices

### Pitfall 3: Gradient Border + Border-Radius Incompatibility
**What goes wrong:** border-image CSS property ignores border-radius
**Why it happens:** CSS spec limitation
**How to avoid:** Use wrapper div with gradient background + inner div with solid background
**Warning signs:** Gradient borders showing as square corners

### Pitfall 4: Button Width Change on Loading
**What goes wrong:** Button shrinks/grows when text replaced with spinner
**Why it happens:** Text removed, only spinner remains
**How to avoid:** Per CONTEXT.md decision: "spinner replaces text, button width stays constant" - use min-width or keep text but make transparent
**Warning signs:** CLS (Cumulative Layout Shift) during form submission

### Pitfall 5: Active State Scale Too Aggressive
**What goes wrong:** Button feels "mushy" or overshoots
**Why it happens:** Scale too far (0.8) or bounce too strong
**How to avoid:** Per CONTEXT.md: "0.95 active scale" - subtle, professional feel
**Warning signs:** Users complain about "weird" button feel

## Code Examples

Verified patterns from official sources and existing codebase:

### Bouncy Spring Button (COMP-01)
```typescript
// Source: motion.dev + CONTEXT.md decisions
// Physics-based spring with slight overshoot for "playful" feel
const springBouncy = {
  type: "spring" as const,
  stiffness: 260,  // Quick response
  damping: 20,     // Slight overshoot (Linear-style)
};

<m.button
  whileHover={{ y: -2 }}  // -2px hover lift per COMP-01
  whileTap={{ scale: 0.95 }}  // 0.95 active scale per COMP-01
  transition={springBouncy}
>
  Primary CTA
</m.button>
```

### Button Loading State with Constant Width
```typescript
// Source: CONTEXT.md decision + shadcn patterns
const Button = ({ loading, children, ...props }) => {
  return (
    <button className="relative min-w-[120px]" disabled={loading} {...props}>
      {/* Keep children but make transparent during loading */}
      <span className={cn(loading && "opacity-0")}>{children}</span>

      {/* Absolutely positioned spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      )}
    </button>
  );
};
```

### Gradient Border Card (COMP-05)
```typescript
// Source: Tailwind gradient border pattern
const GradientBorderCard = ({ highlighted, children }) => (
  <div
    className={cn(
      "rounded-2xl p-px",
      highlighted
        ? "bg-gradient-to-b from-orange-500 to-orange-500/20"  // Bold gradient
        : "bg-gradient-to-b from-white/20 to-transparent"      // Subtle gradient
    )}
  >
    <div className="bg-card rounded-[calc(1rem-1px)] p-8">
      {children}
    </div>
  </div>
);
```

### Highlighted Pricing Card (COMP-06)
```typescript
// Source: W3Schools pricing table + CONTEXT.md decisions
const PricingCard = ({ highlighted, label, children }) => (
  <div className="relative">
    {/* "Most popular" badge */}
    {highlighted && (
      <div className="absolute -top-3 inset-x-0 flex justify-center">
        <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          המומלץ
        </span>
      </div>
    )}

    {/* Card with gradient border and glow */}
    <div
      className={cn(
        "rounded-2xl p-px",
        highlighted && [
          "bg-gradient-to-b from-orange-500 to-orange-500/20",
          "shadow-[0_0_30px_-5px_hsl(24.6_95%_53.1%_/_0.3)]", // Glow shadow
        ]
      )}
    >
      <div className={cn(
        "bg-card rounded-[calc(1rem-1px)] p-8",
        highlighted && "border-2 border-orange-500/30"  // 2px accent border
      )}>
        {children}
      </div>
    </div>
  </div>
);
```

### Navigation Scroll State (COMP-08, COMP-09)
```typescript
// Source: Existing GlassNav.tsx + CONTEXT.md decisions
<nav
  className={cn(
    "fixed top-0 inset-x-0 z-50 h-16",  // 64px height per COMP-08
    "transition-all duration-300 ease-out",
    isScrolled
      ? cn(
          // 85% opacity + stronger blur per COMP-09
          "bg-[rgb(24_24_27/0.85)]",
          "md:supports-[backdrop-filter:blur(1px)]:bg-[rgb(24_24_27/0.15)]",
          "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[16px]",
          "border-b border-white/10"
        )
      : "bg-transparent border-b border-transparent"
  )}
>
  {/* Nav content - height stays consistent, no compacting */}
</nav>
```

### Glassmorphism Card (COMP-13)
```typescript
// Source: CONTEXT.md decisions (5% white bg, 20px blur, 8% border)
// Note: 12-16px blur range per decisions, using 16px for consistency
<div
  className={cn(
    // Fallback for mobile/no-support
    "bg-[rgb(24_24_27/0.8)] border border-white/20",
    // Glass on desktop with support
    "md:supports-[backdrop-filter:blur(1px)]:bg-[rgb(255_255_255/0.05)]",
    "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[16px]",
    "md:supports-[backdrop-filter:blur(1px)]:border-white/8",
    "rounded-2xl p-8"
  )}
>
  {/* Glass card content */}
</div>
```

### Social Proof Row (COMP-12)
```typescript
// Source: CONTEXT.md decisions
<div className="flex items-center justify-center gap-12">
  {logos.map((logo) => (
    <img
      key={logo.alt}
      src={logo.src}
      alt={logo.alt}
      className="h-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
    />
  ))}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion (separate package) | motion/react (rebranded) | 2024 | Same API, new import path |
| CSS backdrop-filter without fallback | Progressive enhancement with @supports | Standard | Required for mobile/older browser support |
| border-image for gradients | Wrapper div technique | Always | Works with border-radius |
| Tailwind v3 @apply | Tailwind v4 @theme variables | 2025 | Theme in CSS, not JS config |

**Deprecated/outdated:**
- `framer-motion` package: Rebranded to `motion/react`, codebase already updated
- `@tailwind/forms`: Replaced by Radix UI primitives
- `styled-components` for variants: CVA is more performant with Tailwind

## Open Questions

Things that couldn't be fully resolved:

1. **Exact spring tension values**
   - What we know: CONTEXT.md says "Linear-style slight overshoot, playful"
   - What's unclear: Exact stiffness/damping values Linear uses
   - Recommendation: Start with stiffness: 260, damping: 20, tune based on feel

2. **Mobile overlay animation preference**
   - What we know: CONTEXT.md marks as "Claude's Discretion" - fade vs slide
   - What's unclear: User preference not specified
   - Recommendation: Use fade (simpler, less jarring) for mobile menu overlay

## Sources

### Primary (HIGH confidence)
- Existing codebase: `website/components/ui/button.tsx`, `card.tsx`, `GlassNav.tsx`
- Existing codebase: `website/lib/animation.ts` (spring presets)
- Existing codebase: `website/app/globals.css` (design tokens, glass system)
- [Motion.dev transition documentation](https://motion.dev/motion/transition/) - Spring configuration
- Phase 30 CONTEXT.md - Locked user decisions

### Secondary (MEDIUM confidence)
- [Tailwind CSS gradient border patterns](https://dev.to/tailus/how-to-create-gradient-borders-with-tailwindcss-4gk2) - Wrapper technique
- [Josh Comeau backdrop-filter guide](https://www.joshwcomeau.com/css/backdrop-filter/) - Glass best practices
- [shadcn/ui button loading patterns](https://www.shadcn.io/patterns/button-standard-5) - Loading state

### Tertiary (LOW confidence)
- Web search for "Linear design system" - Limited official documentation available

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Already in codebase, verified working
- Architecture: HIGH - Patterns already established in existing components
- Animation values: MEDIUM - Based on community standards, needs fine-tuning
- Pitfalls: HIGH - Documented in existing codebase comments

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable libraries, no major releases expected)
