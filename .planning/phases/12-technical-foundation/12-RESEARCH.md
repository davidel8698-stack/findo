# Phase 12: Technical Foundation - Research

**Researched:** 2026-01-31
**Domain:** Next.js 15.5 Hebrew RTL Setup with Animation Infrastructure
**Confidence:** HIGH

## Summary

Phase 12 establishes the technical foundation for the Findo sales website with Next.js 15.5, Tailwind CSS 4.0, Hebrew RTL architecture, and animation infrastructure. Comprehensive research already exists in `.planning/research/SUMMARY.md` covering the full stack. This focused research verifies current setup commands, configuration patterns, and integration gotchas for the specific library versions chosen.

Key findings confirm that Next.js 15.5 with App Router provides a stable production foundation through 2026, Tailwind CSS 4.0 (released January 2025) offers native logical properties eliminating RTL plugin dependencies, and the Motion + GSAP two-library strategy requires careful setup to enable tree-shaking and prevent bundle bloat. Hebrew font loading with Heebo faces a known Next.js 15 bug where `adjustFontFallback` doesn't work correctly, requiring workaround strategies. RTL implementation must set `dir="rtl"` on the HTML element in the root layout (with async params in Next.js 15) and wrap the app with Radix DirectionProvider for component-level support.

Critical gotchas include Next.js 15's breaking change to async params affecting dynamic `dir` attribute setting, Firefox incompatibility with `Intl.Locale().getTextInfo()` requiring polyfills, Motion/GSAP requiring `"use client"` directive with proper cleanup to prevent memory leaks, and Lenis smooth scroll needing specific GSAP ticker integration. The setup prioritizes performance from day one with explicit preloading, font-display: swap, tree-shakeable animation imports, and zero-config Vercel deployment.

**Primary recommendation:** Use `create-next-app@latest` with recommended defaults, configure Tailwind 4.0 with single `@import "tailwindcss"` statement, set up Hebrew fonts with explicit `display: 'swap'` and `preload: true` (ignoring broken `adjustFontFallback`), establish centralized GSAP configuration file to prevent redundant plugin registration, and verify RTL with `dir="rtl"` in root layout plus DirectionProvider wrapper.

## Standard Stack

The stack is locked per prior decisions in `.planning/research/SUMMARY.md`. This research verifies exact setup commands and configuration for each technology.

### Core
| Library | Version | Purpose | Setup Command |
|---------|---------|---------|---------------|
| Next.js | 15.5 | Server-first framework with App Router | `npx create-next-app@latest --yes` |
| React | 19.x | Concurrent rendering with Server Components | Auto-installed with Next.js |
| TypeScript | 5.5+ | End-to-end type safety | Enabled by default in create-next-app |
| Tailwind CSS | 4.0 | Logical properties for native RTL | `npm i tailwindcss @tailwindcss/postcss` |
| Motion | 12.27+ | Primary UI animations (React-native API) | `npm i motion` |
| GSAP | 3.14+ | Complex scroll animations with ScrollTrigger | `npm i gsap` |
| Lenis | Latest | Smooth scrolling integrated with ScrollTrigger | `npm i lenis` |

### Supporting
| Library | Version | Purpose | Setup Command |
|---------|---------|---------|---------------|
| @radix-ui/react-direction | Latest | DirectionProvider for component RTL support | `npm i @radix-ui/react-direction` |
| @gsap/react | Latest | useGSAP hook for React integration | `npm i @gsap/react` |
| PostHog | Latest | Analytics, session replay, feature flags | `npm i posthog-js` |
| next/font | Built-in | Font optimization without FOUT | No install needed |

### Installation Sequence

```bash
# 1. Create Next.js project with recommended defaults
npx create-next-app@latest findo-website --yes

# Defaults include: TypeScript, Tailwind (v3), ESLint, App Router, Turbopack, src/ dir

# 2. Upgrade to Tailwind 4.0 (replace v3)
npm uninstall tailwindcss
npm i tailwindcss @tailwindcss/postcss

# 3. Add animation libraries
npm i motion gsap @gsap/react lenis

# 4. Add RTL support
npm i @radix-ui/react-direction

# 5. Add analytics
npm i posthog-js

# 6. Add form libraries (deferred to later phase)
# npm i react-hook-form zod @hookform/resolvers
```

## Architecture Patterns

### Pattern 1: Next.js 15.5 Project Setup with Recommended Defaults

**What:** Use create-next-app with `--yes` flag to accept recommended defaults (TypeScript, Tailwind, ESLint, App Router, Turbopack, src/ directory)

**When to use:** Initial project creation (Phase 12 Task 1)

**Example:**
```bash
# Source: https://nextjs.org/docs/app/api-reference/cli/create-next-app
npx create-next-app@latest findo-website --yes

# Equivalent explicit flags:
# npx create-next-app@latest findo-website \
#   --typescript --tailwind --eslint --app --src-dir \
#   --import-alias "@/*" --turbopack
```

**Note:** `--yes` uses recommended defaults as of Next.js 15: TypeScript, Tailwind (v3, will upgrade to v4), ESLint, App Router, Turbopack for dev, import alias `@/*`, and src/ directory.

### Pattern 2: Tailwind CSS 4.0 Configuration (CSS-First)

**What:** Tailwind v4.0 eliminates `tailwind.config.js` in favor of CSS-first configuration with single `@import` statement and `@theme` blocks for customization

**When to use:** After upgrading from Tailwind v3 (Phase 12 Task 2)

**Example:**
```javascript
// Source: https://tailwindcss.com/blog/tailwindcss-v4

// postcss.config.js
export default {
  plugins: ["@tailwindcss/postcss"],
};
```

```css
/* src/app/globals.css */
@import "tailwindcss";

/* Custom theme configuration */
@theme {
  /* Hebrew-optimized typography */
  --font-display: "Heebo", "Assistant", sans-serif;

  /* Custom breakpoints if needed */
  --breakpoint-3xl: 1920px;

  /* Custom colors */
  --color-findo-blue: oklch(0.53 0.12 240);

  /* Custom easing functions */
  --ease-smooth: cubic-bezier(0.3, 0, 0, 1);
}
```

**Key differences from v3:**
- No `tailwind.config.js` file (delete after upgrade)
- Single `@import "tailwindcss"` replaces `@tailwind base; @tailwind components; @tailwind utilities;`
- Automatic content detection (no `content: []` array needed)
- CSS variables for all design tokens
- Native logical properties (`ps-4`, `pe-4`, `start-0`, `end-4`)

### Pattern 3: Hebrew Font Loading with next/font/google

**What:** Use `next/font/google` to load Heebo font with Hebrew subset, explicit `display: 'swap'` to prevent FOUT, and `preload: true` for performance

**When to use:** Root layout font configuration (Phase 12 Task 3)

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font

// src/app/layout.tsx
import { Heebo } from 'next/font/google'

const heebo = Heebo({
  subsets: ['hebrew'],      // Only load Hebrew character set
  display: 'swap',          // Fallback font while loading (prevent FOUT)
  preload: true,            // Preload font (default: true)
  weight: ['400', '500', '700'], // Regular, Medium, Bold
  variable: '--font-heebo', // CSS variable for Tailwind
  fallback: ['Arial', 'sans-serif'], // System fallback fonts
  // adjustFontFallback: true, // BROKEN in Next.js 15 - ignore this option
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-heebo">{children}</body>
    </html>
  )
}
```

**Tailwind configuration for font variable:**
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --font-heebo: var(--font-heebo);
}
```

**Known issue (Next.js 15):** `adjustFontFallback` option is broken in Next.js 15 (GitHub issues #74134, #73838). It always applies fallback font adjustments regardless of setting. Workaround: ignore the option and rely on `display: 'swap'` + `fallback` array for FOUT prevention.

### Pattern 4: RTL Layout with dir="rtl" and DirectionProvider

**What:** Set `dir="rtl"` on HTML element in root layout AND wrap app with Radix DirectionProvider for component-level RTL support

**When to use:** Root layout RTL configuration (Phase 12 Task 3)

**Example:**
```typescript
// Source: https://www.radix-ui.com/primitives/docs/utilities/direction-provider
// Source: https://github.com/shadcn-ui/ui/issues/2736

// src/app/layout.tsx
import { DirectionProvider } from '@radix-ui/react-direction'
import { Heebo } from 'next/font/google'

const heebo = Heebo({
  subsets: ['hebrew'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-heebo',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>
        <DirectionProvider dir="rtl">
          {children}
        </DirectionProvider>
      </body>
    </html>
  )
}
```

**Critical:** Both `dir="rtl"` on `<html>` AND `<DirectionProvider dir="rtl">` wrapper are required. The HTML attribute handles browser-level RTL (text direction, scroll position), while DirectionProvider ensures Radix UI components (used by shadcn/ui) respect RTL layout.

**Dynamic direction (if needed later):**
```typescript
// For apps that switch between LTR and RTL
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }> // Next.js 15: params are async
}) {
  const { locale } = await params
  const direction = locale === 'he' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={direction}>
      <body>
        <DirectionProvider dir={direction}>
          {children}
        </DirectionProvider>
      </body>
    </html>
  )
}
```

**Firefox polyfill (if using Intl.Locale):**
```bash
# If detecting direction with Intl.Locale().getTextInfo().direction
npm i intl-locale-textinfo-polyfill
```

### Pattern 5: Centralized GSAP Configuration with useGSAP Hook

**What:** Create single `lib/gsapConfig.ts` file that imports GSAP and registers plugins once, then export configured instance for use across all components

**When to use:** GSAP setup (Phase 12 Task 4)

**Example:**
```typescript
// Source: https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232
// Source: https://basement.studio/blog/gsap-next-js-setup-the-bsmnt-way

// src/lib/gsapConfig.ts
'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

// Export configured GSAP instance
export { gsap, ScrollTrigger, useGSAP }
```

**Usage in components:**
```typescript
// src/components/HeroAnimation.tsx
'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsapConfig'

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Animation code here
    gsap.from('.hero-element', {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
    })

    // Cleanup handled automatically by useGSAP
  }, { scope: containerRef }) // Scope animations to container

  return <div ref={containerRef}>...</div>
}
```

**Why centralized config:**
- Prevents redundant plugin registration across components
- Ensures consistent GSAP setup
- Enables tree-shaking (only import what you use)
- useGSAP hook handles cleanup automatically (prevents memory leaks)

### Pattern 6: Motion Tree-Shaking with LazyMotion

**What:** Use `m` component with `LazyMotion` instead of full `motion` component to reduce bundle size from 34KB to 4.6KB

**When to use:** Motion setup for animations (Phase 12 Task 4)

**Example:**
```typescript
// Source: https://motion.dev/docs/react-reduce-bundle-size

// Option 1: Import domAnimation features (most common)
import { LazyMotion, m, domAnimation } from 'motion/react'

export function AnimatedComponent() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Content
      </m.div>
    </LazyMotion>
  )
}

// Option 2: Lazy load features dynamically
const loadFeatures = () =>
  import('./features.js').then(res => res.default)

export function App() {
  return (
    <LazyMotion features={loadFeatures}>
      {/* Your app */}
    </LazyMotion>
  )
}

// features.js
import { domAnimation } from 'motion/react'
export default domAnimation
```

**Bundle size comparison:**
- `motion` component: 34KB (all features bundled)
- `m` + LazyMotion with domAnimation: 4.6KB (7.4x smaller)
- `m` + lazy-loaded features: 4.6KB initial, features loaded on demand

**Feature sets:**
- `domAnimation`: Basic animations, layout animations, gestures (most common)
- `domMax`: All features including drag, layout projections (larger bundle)

**When to use full `motion` component:**
- Prototyping (no optimization needed)
- Small projects where bundle size isn't critical

### Pattern 7: Lenis + GSAP ScrollTrigger Integration

**What:** Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger using ticker integration

**When to use:** Smooth scroll setup (Phase 12 Task 4)

**Example:**
```typescript
// Source: https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap
// Source: https://github.com/darkroomengineering/lenis

// src/components/SmoothScroll.tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsapConfig'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,        // Scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Disable GSAP lag smoothing (prevents delays)
    gsap.ticker.lagSmoothing(0)

    // Cleanup
    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return <>{children}</>
}

// src/app/layout.tsx
import { SmoothScroll } from '@/components/SmoothScroll'

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
```

**Performance note:** Some developers report performance issues with Lenis + ScrollTrigger on slower machines. Test thoroughly on mid-range devices (target: 2-3 year old Android phones).

### Pattern 8: PostHog Analytics Setup with App Router

**What:** Initialize PostHog in a provider component with `"use client"` directive and wrap app in root layout

**When to use:** Analytics setup (Phase 12 Task 5)

**Example:**
```typescript
// Source: https://posthog.com/tutorials/nextjs-app-directory-analytics
// Source: https://vercel.com/kb/guide/posthog-nextjs-vercel-feature-flags-analytics

// .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

// src/lib/posthog.ts
'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false, // We'll capture manually
        capture_pageleave: true,
      })
    }
  }, [])

  useEffect(() => {
    // Capture pageview on route change
    if (pathname) {
      posthog.capture('$pageview', {
        $current_url: `${pathname}${searchParams ? `?${searchParams}` : ''}`,
      })
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

// src/app/layout.tsx
import { PostHogProvider } from '@/lib/posthog'

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

**Alternative (Next.js 15.3+):** Use `instrumentation.ts` file in project root for lightweight setup:
```typescript
// instrumentation-client.ts (Next.js 15.3+)
export async function register() {
  if (typeof window !== 'undefined') {
    const posthog = (await import('posthog-js')).default
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    })
  }
}
```

### Pattern 9: Vercel Deployment (Zero-Config)

**What:** Vercel automatically detects Next.js projects and applies optimal build settings with zero configuration

**When to use:** Initial deployment (Phase 12 Task 6)

**Example:**
```bash
# Source: https://vercel.com/docs/frameworks/full-stack/nextjs

# Option 1: Deploy via Vercel CLI
npm i -g vercel
vercel

# Option 2: Connect GitHub repo via Vercel dashboard
# 1. Push code to GitHub
# 2. Import project in Vercel dashboard
# 3. Vercel auto-detects Next.js and deploys

# Option 3: Deploy button in README
# Add to README.md:
# [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)
```

**Environment variables:**
```bash
# Add in Vercel dashboard: Project Settings > Environment Variables
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Automatic features:**
- HTTPS enabled by default (including custom domains)
- Server-Side Rendering and API routes become Serverless Functions
- Preview deployments for all branches
- Production deployment on `main` branch push
- Edge Functions support
- Built-in Vercel Analytics for Core Web Vitals

### Anti-Patterns to Avoid

- **Installing Tailwind v3 plugins for RTL:** Tailwind 4.0 has native logical properties (ps-, pe-, start-, end-), don't install tailwindcss-rtl or tailwindcss-logical plugins
- **Using left/right CSS properties:** Always use logical properties (`margin-inline-start` not `margin-left`, `padding-inline-end` not `padding-right`, `inset-inline-start` not `left`)
- **Importing full motion library:** Don't use `import { motion } from 'motion/react'` for production - use `m` + LazyMotion for 7.4x smaller bundle
- **Registering GSAP plugins in every component:** Create centralized `lib/gsapConfig.ts` to prevent redundant registration
- **Using useEffect for GSAP animations:** Use `useGSAP` hook from `@gsap/react` for automatic cleanup and better performance
- **Setting dir="rtl" only on HTML element:** Must also wrap app with DirectionProvider for Radix/shadcn components
- **Using window !== 'undefined' checks everywhere:** Use `"use client"` directive at top of file for client-only code
- **Relying on adjustFontFallback in Next.js 15:** Feature is broken, use explicit `display: 'swap'` and `fallback` array instead

## Don't Hand-Roll

Problems with existing optimal solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font optimization | Custom font loading with @font-face | next/font/google | Automatic self-hosting, zero layout shift, preloading, subset optimization, no network requests from client |
| RTL component support | Manual dir checks and CSS overrides for each component | Radix DirectionProvider | Handles all Radix primitives (shadcn/ui base), tested across components, single wrapper |
| GSAP cleanup in React | Manual cleanup with ScrollTrigger.getAll().forEach(t => t.kill()) | useGSAP hook from @gsap/react | Automatic cleanup on unmount, scoped animations, prevents memory leaks, official GSAP React integration |
| Smooth scroll library | Custom requestAnimationFrame scroll logic | Lenis | Lightweight (2.8KB), robust performance, GSAP ScrollTrigger integration, maintains native scroll behavior |
| Animation bundle optimization | Manual dynamic imports and code splitting | Motion's LazyMotion | 7.4x smaller bundle (4.6KB vs 34KB), lazy feature loading, no performance loss |
| Analytics + session replay + A/B testing | Multiple tools (Google Analytics + Hotjar + Optimizely) | PostHog | All-in-one platform, no data sampling, open source, self-hostable, better privacy compliance |
| CSS logical properties for RTL | Manual CSS with [dir="rtl"] selectors and overrides | Tailwind 4.0 logical properties | Native support (ps-, pe-, start-, end-), automatic bidirectional, no plugin needed, smaller CSS output |

**Key insight:** Modern tooling has solved these problems at scale. Custom solutions introduce bugs (memory leaks, font flashing, RTL edge cases), maintenance burden, and performance issues. Use battle-tested libraries.

## Common Pitfalls

### Pitfall 1: adjustFontFallback Broken in Next.js 15
**What goes wrong:** Setting `adjustFontFallback: false` in font configuration has no effect - fallback font adjustments are always applied, causing unexpected font metrics.

**Why it happens:** Bug in Next.js 15 font loader (GitHub issues #74134, #73838) - the option is ignored and fallback is always generated.

**How to avoid:**
- Don't rely on `adjustFontFallback` setting in Next.js 15
- Use explicit `display: 'swap'` (prevents FOUT by showing fallback immediately)
- Define `fallback: ['Arial', 'sans-serif']` array for Hebrew font stack
- Accept that fallback adjustments will be applied (not harmful, just unexpected)
- Wait for Next.js patch or upgrade to Next.js 16 when stable

**Warning signs:** Font metrics look slightly different than expected, extra CSS generated for fallback fonts

### Pitfall 2: Async Params in Next.js 15 Root Layout
**What goes wrong:** Trying to access `params.locale` directly in root layout causes error: "params is a Promise"

**Why it happens:** Next.js 15 breaking change - all params are now async and must be awaited

**How to avoid:**
```typescript
// WRONG (Next.js 14 pattern)
export default function Layout({ params }: { params: { locale: string } }) {
  return <html dir={params.locale === 'he' ? 'rtl' : 'ltr'}>

// RIGHT (Next.js 15 pattern)
export default async function Layout({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <html dir={locale === 'he' ? 'rtl' : 'ltr'}>
```

**Warning signs:** TypeScript error "Property 'locale' does not exist on type 'Promise<...>'"

**Note for Phase 12:** Not applicable (Hebrew-only site with static dir="rtl"), but important for future multi-locale support.

### Pitfall 3: Firefox Doesn't Support Intl.Locale().getTextInfo()
**What goes wrong:** Using `Intl.Locale().getTextInfo().direction` to detect RTL fails silently in Firefox, page renders in wrong direction.

**Why it happens:** `Intl.Locale.prototype.getTextInfo` is not yet implemented in Firefox (as of 2026-01-31)

**How to avoid:**
- For Hebrew-only site: Use static `dir="rtl"` (no dynamic detection needed)
- For multi-locale sites: Install polyfill `npm i intl-locale-textinfo-polyfill` and import at app root
- Alternative: Manual locale-to-direction mapping
  ```typescript
  const RTL_LOCALES = ['he', 'ar', 'fa', 'ur']
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'
  ```

**Warning signs:** Site works in Chrome/Edge/Safari but wrong direction in Firefox

### Pitfall 4: DirectionProvider Missing or Wrong Level
**What goes wrong:** Setting `dir="rtl"` on HTML works for text direction, but shadcn/ui components (dropdowns, dialogs, popovers) position elements on wrong side.

**Why it happens:** Radix UI primitives need DirectionProvider context to respect RTL, HTML attribute alone isn't enough.

**How to avoid:**
- MUST wrap app with DirectionProvider from `@radix-ui/react-direction`
- Provider must be INSIDE `<body>` tag (React context doesn't work on `<html>`)
- Pass `dir="rtl"` prop to DirectionProvider (matches HTML dir attribute)

```typescript
// WRONG
<html dir="rtl">
  <body>{children}</body>
</html>

// RIGHT
<html dir="rtl">
  <body>
    <DirectionProvider dir="rtl">
      {children}
    </DirectionProvider>
  </body>
</html>
```

**Warning signs:** Dropdowns open on wrong side, tooltips misaligned, dialog animations reversed

### Pitfall 5: Tailwind 4.0 Requires PostCSS Config Change
**What goes wrong:** After upgrading to Tailwind 4.0, build fails with "Cannot find module '@tailwindcss/postcss'" or CSS doesn't compile.

**Why it happens:** Tailwind 4.0 uses new PostCSS plugin (`@tailwindcss/postcss` not `tailwindcss`), requires different postcss.config.js syntax.

**How to avoid:**
```javascript
// WRONG (Tailwind v3 syntax)
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// RIGHT (Tailwind v4 syntax)
export default {
  plugins: ["@tailwindcss/postcss"],
}
```

Also update globals.css:
```css
/* WRONG (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* RIGHT (v4) */
@import "tailwindcss";
```

**Warning signs:** Build errors mentioning "tailwindcss" or "@tailwindcss/postcss", CSS not compiling, Tailwind classes not working

### Pitfall 6: GSAP/Motion in Server Components
**What goes wrong:** Importing GSAP or Motion in Server Component causes build error: "window is not defined" or "document is not defined"

**Why it happens:** Server Components run on server where DOM doesn't exist. GSAP and Motion are client-only libraries that access window/document.

**How to avoid:**
- Add `"use client"` directive at top of any file that uses GSAP or Motion
- Keep animation components as Client Components
- Wrap animation code in `typeof window !== 'undefined'` checks if needed
- Use centralized `lib/gsapConfig.ts` with `"use client"` to prevent re-declaring in every file

```typescript
// WRONG (no "use client" directive)
import { motion } from 'motion/react'
export function AnimatedComponent() {
  return <motion.div>...</motion.div>
}

// RIGHT
'use client'
import { motion } from 'motion/react'
export function AnimatedComponent() {
  return <motion.div>...</motion.div>
}
```

**Warning signs:** Build errors mentioning "window is not defined", "document is not defined", "ReferenceError"

### Pitfall 7: GSAP Animations Not Cleaned Up (Memory Leaks)
**What goes wrong:** GSAP animations continue running after component unmounts, causing memory leaks and performance degradation. ScrollTrigger instances accumulate.

**Why it happens:** GSAP animations and ScrollTrigger instances must be manually killed on component unmount in React.

**How to avoid:**
- Use `useGSAP` hook from `@gsap/react` instead of `useEffect`
- useGSAP handles cleanup automatically
- For manual cleanup, return function that kills animations and ScrollTrigger instances

```typescript
// WRONG (useEffect without cleanup)
useEffect(() => {
  gsap.to('.element', { x: 100 })
}, [])

// RIGHT (useGSAP with automatic cleanup)
import { useGSAP } from '@gsap/react'

useGSAP(() => {
  gsap.to('.element', { x: 100 })
}, { scope: containerRef }) // Scoped cleanup
```

**Warning signs:** Slow performance after navigating between pages, memory usage increasing, animations triggering on unmounted components

### Pitfall 8: Lenis + ScrollTrigger Synchronization Issues
**What goes wrong:** Scroll animations trigger at wrong positions, jump unexpectedly, or don't update when using Lenis smooth scroll with GSAP ScrollTrigger.

**Why it happens:** ScrollTrigger uses native scroll position, Lenis virtualizes scroll. Need explicit synchronization via ticker.

**How to avoid:**
- Call `ScrollTrigger.update` on Lenis scroll event
- Add Lenis to GSAP ticker with `gsap.ticker.add()`
- Disable GSAP lag smoothing with `gsap.ticker.lagSmoothing(0)`

```typescript
// WRONG (no synchronization)
const lenis = new Lenis()
gsap.to('.element', {
  scrollTrigger: { trigger: '.element' }
})

// RIGHT (synchronized)
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

**Warning signs:** Scroll animations trigger early/late, animations jump, ScrollTrigger pinning doesn't work correctly

### Pitfall 9: Motion LazyMotion Not Wrapping Components
**What goes wrong:** Using `m` component without `LazyMotion` wrapper causes error: "m component requires LazyMotion"

**Why it happens:** `m` is a minimal component that loads features from LazyMotion context, can't work standalone.

**How to avoid:**
- Wrap app or component tree with `<LazyMotion features={domAnimation}>`
- Place LazyMotion as high as possible in component tree (once per app)
- Import features: `import { domAnimation } from 'motion/react'`

```typescript
// WRONG (m without LazyMotion)
import { m } from 'motion/react'
<m.div animate={{ opacity: 1 }}>...</m.div>

// RIGHT
import { LazyMotion, m, domAnimation } from 'motion/react'
<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }}>...</m.div>
</LazyMotion>
```

**Warning signs:** Runtime error "m component requires LazyMotion", animations don't work

### Pitfall 10: PostHog Environment Variables Not Client-Accessible
**What goes wrong:** PostHog initialization fails silently, no events tracked, console error "API key is undefined"

**Why it happens:** Next.js only exposes environment variables prefixed with `NEXT_PUBLIC_` to client-side code. PostHog runs client-side.

**How to avoid:**
- Use `NEXT_PUBLIC_POSTHOG_KEY` not `POSTHOG_KEY`
- Use `NEXT_PUBLIC_POSTHOG_HOST` not `POSTHOG_HOST`
- Add to `.env.local` (never commit keys to Git)

```bash
# WRONG
POSTHOG_KEY=phc_...
POSTHOG_HOST=https://app.posthog.com

# RIGHT
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Warning signs:** PostHog dashboard shows no events, console error "API key is undefined" or "host is undefined"

## Code Examples

Verified patterns from official sources:

### Next.js 15.5 Project Creation
```bash
# Source: https://nextjs.org/docs/app/getting-started/installation

# Create with recommended defaults (TypeScript, Tailwind, ESLint, App Router)
npx create-next-app@latest findo-website --yes

# Alternative: Interactive prompts
npx create-next-app@latest findo-website
# Select: Yes, use recommended defaults

# Alternative: Explicit flags
npx create-next-app@latest findo-website \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack
```

### Tailwind 4.0 Installation and Configuration
```bash
# Source: https://tailwindcss.com/blog/tailwindcss-v4

# Remove Tailwind v3
npm uninstall tailwindcss autoprefixer

# Install Tailwind v4
npm i tailwindcss @tailwindcss/postcss
```

```javascript
// postcss.config.js
export default {
  plugins: ["@tailwindcss/postcss"],
}
```

```css
/* src/app/globals.css */
@import "tailwindcss";

/* Optional: Custom theme */
@theme {
  --font-display: "Heebo", "Assistant", sans-serif;
  --color-primary: oklch(0.53 0.12 240);
}
```

### Hebrew Font Loading (Heebo)
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font

// src/app/layout.tsx
import { Heebo } from 'next/font/google'
import { DirectionProvider } from '@radix-ui/react-direction'

const heebo = Heebo({
  subsets: ['hebrew'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-heebo',
  fallback: ['Arial', 'sans-serif'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans antialiased">
        <DirectionProvider dir="rtl">
          {children}
        </DirectionProvider>
      </body>
    </html>
  )
}
```

```css
/* src/app/globals.css - Tailwind font configuration */
@import "tailwindcss";

@theme {
  --font-sans: var(--font-heebo), system-ui, sans-serif;
}
```

### GSAP Configuration with useGSAP Hook
```typescript
// Source: https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232

// src/lib/gsapConfig.ts
'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export { gsap, ScrollTrigger, useGSAP }
```

```typescript
// Usage in component
'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsapConfig'

export function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.fade-in', {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <div className="fade-in">Item 1</div>
      <div className="fade-in">Item 2</div>
    </div>
  )
}
```

### Motion LazyMotion Setup
```typescript
// Source: https://motion.dev/docs/react-reduce-bundle-size

// src/app/layout.tsx
import { LazyMotion, domAnimation } from 'motion/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      </body>
    </html>
  )
}
```

```typescript
// Usage in component
'use client'

import { m } from 'motion/react'

export function FadeInComponent() {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content fades in
    </m.div>
  )
}
```

### Lenis Smooth Scroll with GSAP Integration
```typescript
// Source: https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap

// src/components/SmoothScroll.tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsapConfig'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return <>{children}</>
}
```

### PostHog Analytics Setup
```typescript
// Source: https://posthog.com/tutorials/nextjs-app-directory-analytics

// .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

```typescript
// src/lib/posthog.tsx
'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        capture_pageleave: true,
      })
    }
  }, [])

  useEffect(() => {
    if (pathname) {
      posthog.capture('$pageview', {
        $current_url: `${pathname}${searchParams ? `?${searchParams}` : ''}`,
      })
    }
  }, [pathname, searchParams])

  return <>{children}</>
}
```

```typescript
// src/app/layout.tsx
import { PostHogProvider } from '@/lib/posthog'

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind config in tailwind.config.js | CSS-first @theme blocks in globals.css | January 2025 (v4.0) | Faster builds (5ms incremental), automatic content detection, CSS variables for all tokens |
| @tailwind directives | Single @import "tailwindcss" | January 2025 (v4.0) | Simpler setup, better CSS @import support, no build step confusion |
| RTL via tailwindcss-rtl plugin | Native logical properties (ps-, pe-, start-, end-) | January 2025 (v4.0) | No plugin needed, smaller CSS output, better browser support |
| motion from framer-motion | m from motion/react with LazyMotion | Late 2024 (v12 rebrand) | 7.4x smaller bundle (34KB → 4.6KB), lazy feature loading |
| GSAP paid plugins | All plugins free including ScrollTrigger | 2025 licensing change | Full features available, no license checks, better developer experience |
| useEffect for GSAP animations | useGSAP hook from @gsap/react | 2024 (GSAP 3.12+) | Automatic cleanup, scoped animations, prevents memory leaks, React 18 compatible |
| next/font adjustFontFallback: true/false | Ignore option, use display: 'swap' | December 2024 (Next.js 15 bug) | Option broken in Next.js 15, explicit display setting more reliable |
| params.locale direct access | await params then access | October 2024 (Next.js 15) | All params async, prevents errors, TypeScript enforced |
| Multiple analytics tools (GA + Hotjar + Optimizely) | PostHog all-in-one | 2023-2025 trend | Single platform, no data sampling, better privacy, lower cost |

**Deprecated/outdated:**
- **tailwindcss-rtl plugin:** Tailwind 4.0 has native logical properties, plugin causes conflicts
- **tailwindcss-logical plugin:** Same as above, built into v4.0
- **Framer Motion (framer-motion package):** Rebranded to Motion (motion package), use `motion/react` imports
- **GSAP ScrollSmoother:** Use Lenis instead for better performance and Next.js compatibility
- **next/font adjustFontFallback option:** Broken in Next.js 15, use explicit display and fallback settings
- **Synchronous params in Next.js 15:** Params must be awaited, direct access causes errors
- **@tailwind directives:** Use `@import "tailwindcss"` in Tailwind 4.0

## Open Questions

Things that couldn't be fully resolved:

1. **Lenis Performance on Low-End Android**
   - What we know: Some developers report performance issues with Lenis + ScrollTrigger on slower machines, commenting out Lenis restores performance
   - What's unclear: Specific device models affected, performance thresholds, whether issue is Lenis or GSAP interaction
   - Recommendation: Test on target devices (2-3 year old mid-range Android like Samsung Galaxy A54, Xiaomi Redmi Note) during Phase 12. If performance issues occur, make smooth scroll optional or disable on low-end devices (CPU/RAM detection)

2. **adjustFontFallback Fix Timeline**
   - What we know: `adjustFontFallback` is broken in Next.js 15 (GitHub issues #74134, #73838 from December 2024), no fix merged yet
   - What's unclear: Whether fix will land in Next.js 15.x patch or wait for Next.js 16
   - Recommendation: Ignore `adjustFontFallback` option entirely, use explicit `display: 'swap'` and `fallback` array. Monitor Next.js releases for fix announcement.

3. **Tailwind 4.0 Maturity for Production**
   - What we know: Tailwind 4.0 released January 2025 (very recent), new CSS-first architecture is breaking change
   - What's unclear: Production stability, edge cases, plugin ecosystem compatibility (shadcn/ui, etc.)
   - Recommendation: Proceed with Tailwind 4.0 as planned (benefits outweigh risks), but allocate buffer time in Phase 12 for unexpected issues. Have rollback plan to v3 if critical bugs found.

4. **shadcn/ui Official RTL Support**
   - What we know: RTL PR #1638 exists, January 2026 changelog mentions RTL support, current workaround is manual DirectionProvider + logical properties
   - What's unclear: Whether official RTL support is merged, what it includes, if it changes setup pattern
   - Recommendation: Use DirectionProvider workaround as documented. Monitor shadcn/ui releases for official RTL support announcement. Migration should be straightforward if official support lands.

5. **Next.js 15.5 vs 16 Decision Point**
   - What we know: Next.js 16 exists but chosen stack specifies 15.5 for API stability
   - What's unclear: When Next.js 16 becomes production-ready, whether to migrate mid-project
   - Recommendation: Stay on 15.5 through Phase 12 as planned. Revisit during later phases if 16 fixes critical issues (adjustFontFallback bug) or offers significant performance gains.

## Sources

### Primary (HIGH confidence)
- [Next.js create-next-app CLI Reference](https://nextjs.org/docs/app/api-reference/cli/create-next-app) - Official documentation for project setup flags
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) - next/font usage patterns
- [Next.js Font API Reference](https://nextjs.org/docs/app/api-reference/components/font) - Complete font configuration options
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) - Installation, CSS-first configuration, logical properties
- [Motion Reduce Bundle Size](https://motion.dev/docs/react-reduce-bundle-size) - LazyMotion and m component documentation
- [Radix UI DirectionProvider](https://www.radix-ui.com/primitives/docs/utilities/direction-provider) - RTL component support
- [GSAP React Integration](https://gsap.com/resources/React/) - Official React patterns
- [PostHog Next.js App Router Tutorial](https://posthog.com/tutorials/nextjs-app-directory-analytics) - Official setup guide
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/full-stack/nextjs) - Zero-config deployment documentation
- [Lenis GitHub Repository](https://github.com/darkroomengineering/lenis) - Official smooth scroll library

### Secondary (MEDIUM confidence)
- [Optimizing GSAP Animations in Next.js 15](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232) - useGSAP hook patterns, cleanup strategies (November 2025)
- [Next.js Smooth Scrolling with Lenis and GSAP](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) - Integration tutorial
- [GSAP & Next.js Setup: The BSMNT Way](https://basement.studio/blog/gsap-next-js-setup-the-bsmnt-way) - Centralized configuration pattern
- [Using PostHog with Next.js App Router and Vercel](https://vercel.com/kb/guide/posthog-nextjs-vercel-feature-flags-analytics) - Vercel-specific integration
- [Tailwind CSS 4.0 Logical Properties](https://tailwindcss.com/docs/padding) - Official utility documentation
- [Flowbite RTL Guide](https://flowbite.com/docs/customize/rtl/) - Logical properties in practice
- [shadcn/ui RTL Support Issue #2736](https://github.com/shadcn-ui/ui/issues/2736) - Community workarounds
- [shadcn/ui RTL Support PR #1638](https://github.com/shadcn-ui/ui/pull/1638) - Official RTL implementation progress
- [Next.js 15 Upgrade Guide](https://prateeksha.com/blog/nextjs-15-upgrade-guide-app-router-caching-migration) - Breaking changes documentation

### Tertiary (LOW confidence - issues/bugs)
- [adjustFontFallback Bug #74134](https://github.com/vercel/next.js/issues/74134) - Active bug report (December 2024)
- [adjustFontFallback Bug #73838](https://github.com/vercel/next.js/issues/73838) - Duplicate bug report
- [Lenis Performance Discussion](https://gsap.com/community/forums/topic/40426-patterns-for-synchronizing-scrolltrigger-and-lenis-in-reactnext/) - Community-reported performance issues
- [Next.js Async Params Discussion](https://github.com/vercel/next.js/discussions/19049) - Breaking change context
- [Firefox Intl.Locale Support](https://github.com/i18next/next-i18next/discussions/1738) - Browser compatibility issue

### Research Documents (Project Context)
- `.planning/research/SUMMARY.md` - Comprehensive project research (stack, features, architecture, pitfalls)
- `.planning/research/SALES-WEBSITE-STACK.md` - Technology stack rationale
- `.planning/research/FEATURES-SALES-WEBSITE.md` - Feature landscape with conversion data
- `.planning/research/ARCHITECTURE.md` - Implementation patterns (1,156 lines)
- `.planning/research/PITFALLS.md` - 26 sales website + 16 SaaS app pitfalls

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified with official documentation, installation commands tested, locked per prior decisions
- Architecture patterns: HIGH - Official Next.js/Tailwind/Motion/GSAP docs, recent community tutorials (Nov 2025), verified code examples
- RTL setup: MEDIUM-HIGH - DirectionProvider official docs, async params breaking change confirmed, Firefox polyfill need verified, shadcn/ui workaround tested by community
- Font loading: MEDIUM - next/font official docs, adjustFontFallback bug confirmed in GitHub issues (awaiting fix), workaround strategies identified
- Pitfalls: HIGH - Known bugs documented in GitHub issues, breaking changes in official release notes, community-confirmed integration issues

**Research date:** 2026-01-31
**Valid until:** 2026-03-15 (45 days - Next.js/Tailwind fast-moving, monitor for patches)

**What was validated:**
- Next.js 15.5 create-next-app flags and defaults
- Tailwind 4.0 installation process and CSS-first configuration
- Heebo font loading with next/font/google API options
- Motion LazyMotion tree-shaking setup
- GSAP useGSAP hook for React integration
- Lenis + GSAP ScrollTrigger synchronization pattern
- RTL implementation with dir="rtl" + DirectionProvider
- PostHog App Router setup
- Vercel zero-config deployment

**Known issues identified:**
- adjustFontFallback broken in Next.js 15 (workaround: explicit display/fallback)
- Firefox lacks Intl.Locale().getTextInfo() (workaround: manual mapping or polyfill)
- Lenis performance issues on low-end devices (needs testing)
- Tailwind 4.0 very recent (January 2025, watch for stability issues)
