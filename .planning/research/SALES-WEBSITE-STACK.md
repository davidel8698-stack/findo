# Technology Stack: Findo Sales Website

**Project:** Findo Sales Website (High-Conversion Marketing Site)
**Researched:** 2026-01-31
**Overall Confidence:** HIGH

---

## Executive Summary

This stack is optimized for a **world-class, high-conversion marketing website** with stunning animations, Hebrew RTL support, and live product demo capabilities. Every choice prioritizes:
- **Visual impact** (smooth 60fps animations, "wow" factor)
- **Performance** (Core Web Vitals, fast load times)
- **Hebrew RTL** (native support, not an afterthought)
- **Conversion optimization** (analytics, A/B testing, lead capture)
- **Mobile-first** (responsive, touch-friendly interactions)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Next.js** | 15.5.x | Framework | App Router with React Server Components reduces client JS. Turbopack for fast builds. Built-in image optimization, SEO, and streaming. Industry standard for high-performance marketing sites. | HIGH |
| **React** | 19.x | UI Library | Concurrent rendering, Server Components, improved suspense. Required by Next.js 15. | HIGH |
| **TypeScript** | 5.5+ | Type Safety | End-to-end type safety, better DX, catches errors early. | HIGH |

**Why Next.js 15 over 16:**
Next.js 16 (October 2025) removes synchronous request API access entirely. Next.js 15.5.x is stable, has Turbopack, typed routes, and full production support. Upgrade to 16 after launch.

**Key Next.js 15 Features for Marketing Sites:**
- **Partial Pre-Rendering (experimental)** - Static shell with dynamic content
- **React Server Components** - Reduce client-side JavaScript
- **Streaming** - Progressive loading for better perceived performance
- **Built-in image optimization** - Automatic WebP/AVIF, lazy loading
- **Metadata API** - Type-safe SEO management

**Sources:**
- [Next.js 15 Blog](https://nextjs.org/blog/next-15)
- [Next.js 15.5 Release](https://nextjs.org/blog/next-15-5)

---

### Animation Libraries

**Primary Recommendation: Motion (formerly Framer Motion) + GSAP for complex sequences**

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Motion** | 12.27.x | Primary animations | React-native, declarative API, 32KB gzipped, excellent layout animations, AnimatePresence for exit animations, gesture support. Tree-shakeable since v12. MIT licensed. | HIGH |
| **GSAP** | 3.14.x | Complex sequences | Timeline-based control, ScrollTrigger for scroll animations, SplitText for text effects. Now 100% FREE including all plugins. Best for "wow" marketing effects. | HIGH |
| **@gsap/react** | 2.1.x | GSAP React integration | Official React hooks (useGSAP), automatic cleanup, Next.js safe. | HIGH |
| **Lenis** | Latest | Smooth scrolling | Lightweight, performant smooth scroll. Integrates cleanly with GSAP ScrollTrigger. Standard for modern marketing sites. | HIGH |

**Animation Library Comparison:**

| Criterion | Motion | GSAP | React Spring |
|-----------|--------|------|--------------|
| Bundle size | ~32KB gzipped | ~23KB core | ~20KB |
| React integration | Native | Via hooks | Native |
| Learning curve | Low | Medium | Medium |
| Timeline control | Basic | Excellent | Limited |
| Scroll animations | useScroll | ScrollTrigger (best) | Limited |
| Text animations | Manual | SplitText plugin | Manual |
| Layout animations | Excellent | Manual | Limited |
| Exit animations | AnimatePresence | Manual | Limited |

**Recommended Approach:**
1. **Motion** for UI animations (hover, tap, layout changes, page transitions)
2. **GSAP + ScrollTrigger** for scroll-driven animations (reveal effects, parallax, pinned sections)
3. **GSAP SplitText** for text reveal effects (headlines, hero copy)
4. **Lenis** for smooth scrolling (synchronized with ScrollTrigger)

**Integration Pattern:**
```typescript
// Lenis + GSAP ScrollTrigger sync
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

**GSAP Licensing Note:**
As of 2025, GSAP is 100% free including ALL bonus plugins (SplitText, MorphSVG, etc.). Previously these required Club GSAP membership. Motion is MIT open source.

**Sources:**
- [Motion Changelog](https://motion.dev/changelog)
- [GSAP Documentation](https://gsap.com/resources/React/)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [GSAP vs Motion Comparison](https://motion.dev/docs/gsap-vs-motion)
- [LogRocket Animation Libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/)

---

### Styling & Design System

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Tailwind CSS** | 4.0.x | Utility CSS | 5x faster builds, CSS-first config, native CSS variables for theming, logical properties for RTL. Modern browser target (Safari 16.4+). | HIGH |
| **tailwindcss-rtl** | Latest | RTL utilities | Adds `ms-`, `me-`, `ps-`, `pe-` logical property shortcuts. Essential for Hebrew. | HIGH |

**Tailwind CSS 4.0 Key Features:**
- CSS-first configuration (no tailwind.config.js required)
- Native CSS variables for design tokens
- Built-in logical properties support (`ms-`, `me-`, `ps-`, `pe-`)
- Automatic content detection
- 40-60% faster builds

**RTL Implementation:**
```css
/* globals.css */
@import "tailwindcss";

/* Tailwind 4.0 CSS-first config */
@theme {
  --font-sans: "Heebo", "Assistant", system-ui, sans-serif;
  --font-display: "Rubik", "Heebo", sans-serif;
}
```

```html
<html lang="he" dir="rtl">
```

**Logical Properties for RTL:**
| LTR Class | Logical Class | RTL Behavior |
|-----------|---------------|--------------|
| `ml-4` | `ms-4` | margin-right in RTL |
| `mr-4` | `me-4` | margin-left in RTL |
| `pl-4` | `ps-4` | padding-right in RTL |
| `pr-4` | `pe-4` | padding-left in RTL |
| `text-left` | `text-start` | text-right in RTL |
| `border-l` | `border-s` | border-right in RTL |

**Sources:**
- [Tailwind CSS 4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Flowbite RTL Guide](https://flowbite.com/docs/customize/rtl/)
- [tailwindcss-rtl NPM](https://www.npmjs.com/package/tailwindcss-rtl)

---

### Component Libraries

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **shadcn/ui** | Latest | Component primitives | Copy-paste components, full customization, built on Radix UI. Not a dependency - you own the code. | HIGH |
| **@radix-ui/react-direction** | 1.1.x | RTL direction context | Wraps app to provide global RTL direction to all Radix primitives. | HIGH |
| **Radix UI Primitives** | Latest | Accessible primitives | Dialog, Dropdown, Tabs, etc. All support RTL via DirectionProvider. | HIGH |

**shadcn/ui RTL Status:**
- RTL support is in progress (PR #1638)
- Current workaround: Use logical properties (`ms-`, `me-`, `ps-`, `pe-`) instead of `ml-`, `mr-`, etc.
- Wrap app with `<DirectionProvider dir="rtl">`

**Implementation:**
```tsx
import { DirectionProvider } from '@radix-ui/react-direction';

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <DirectionProvider dir="rtl">
          {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
```

**Hebrew Font Stack:**
```css
@theme {
  /* Primary: Heebo - clean, modern, excellent Hebrew */
  /* Fallback: Assistant - good Hebrew support */
  /* Display: Rubik - bold headlines */
  --font-sans: "Heebo", "Assistant", system-ui, sans-serif;
  --font-display: "Rubik", "Heebo", sans-serif;
}
```

**Sources:**
- [shadcn/ui RTL Issue #2759](https://github.com/shadcn-ui/ui/issues/2759)
- [Radix Direction Provider](https://www.radix-ui.com/primitives/docs/utilities/direction-provider)

---

### Video & Demo Solutions

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **next-video** | Latest | Video embedding | Mux-powered, automatic optimization, HLS streaming, placeholder images, timeline thumbnails. Zero-config. | HIGH |
| **Mux** | Latest | Video hosting | CDN delivery, HLS streaming, automatic encoding, analytics. Vercel Marketplace integration. | HIGH |

**For Interactive Product Demos:**

| Platform | Use Case | Pricing | Confidence |
|----------|----------|---------|------------|
| **Navattic** | Embedded click-through tours | $6,000/year | MEDIUM |
| **Storylane** | Fast no-code demos, ABM | Contact sales | MEDIUM |
| **Arcade** | Short marketing demo clips | Free tier available | MEDIUM |

**Recommendation:**
For MVP, use **recorded video demos** with next-video/Mux. Interactive demo platforms (Navattic, Storylane) can be added post-launch if conversion data supports the investment.

**Video Implementation:**
```tsx
import Video from 'next-video';
import demoVideo from '/videos/findo-demo.mp4';

export function ProductDemo() {
  return (
    <Video
      src={demoVideo}
      autoPlay="muted"
      loop
      muted
      playsInline
    />
  );
}
```

**Background Video Hero:**
```tsx
import { MuxPlayer } from '@mux/mux-player-react';

export function HeroVideo() {
  return (
    <MuxPlayer
      playbackId="your-playback-id"
      autoPlay="muted"
      loop
      muted
      playsInline
      style={{ '--controls': 'none' }}
    />
  );
}
```

**Sources:**
- [next-video Documentation](https://next-video.dev/)
- [Mux for Next.js](https://www.mux.com/video-for/next-js)
- [Navattic Blog](https://www.navattic.com/blog/interactive-demos)
- [Storylane](https://www.storylane.io/blog/click-through-demo-software)

---

### Forms & Lead Capture

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **React Hook Form** | 7.60.x | Form state | Minimal re-renders, uncontrolled components, tiny bundle (~9KB). | HIGH |
| **Zod** | 3.25.x | Validation | TypeScript-first, runtime validation matches types, shared schemas client/server. | HIGH |
| **@hookform/resolvers** | 5.1.x | RHF + Zod bridge | Connects Zod schemas to React Hook Form. | HIGH |

**Why React Hook Form + Zod:**
- Type-safe validation that matches TypeScript types
- Minimal re-renders (uncontrolled components)
- Schema reusable on server (Server Actions)
- Excellent shadcn/ui integration

**Lead Capture Form Example:**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const leadSchema = z.object({
  businessName: z.string().min(2, 'Required'),
  phone: z.string().regex(/^05\d{8}$/, 'Israeli phone format'),
  email: z.string().email('Invalid email'),
});

type LeadForm = z.infer<typeof leadSchema>;

export function LeadCaptureForm() {
  const form = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadForm) => {
    // Submit to API or Server Action
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

**Server Action Integration (Next.js 15):**
```tsx
'use server';

import { leadSchema } from '@/schemas/lead';

export async function submitLead(formData: FormData) {
  const data = leadSchema.parse(Object.fromEntries(formData));
  // Save to database, send to CRM, trigger notifications
}
```

**Sources:**
- [React Hook Form + Zod Guide](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)
- [shadcn/ui Forms](https://ui.shadcn.com/docs/forms/react-hook-form)
- [Type-Safe Forms in Next.js 15](https://www.abstractapi.com/guides/email-validation/type-safe-form-validation-in-next-js-15-with-zod-and-react-hook-form)

---

### Analytics & Conversion Tracking

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **PostHog** | Latest | Product analytics | Open-source, self-hostable, feature flags, session replay, funnels, A/B testing. All-in-one. | HIGH |
| **Vercel Analytics** | Built-in | Web Vitals | Core Web Vitals monitoring, real user metrics. Free tier included. | HIGH |

**Why PostHog over alternatives:**

| Alternative | Why PostHog is Better |
|-------------|----------------------|
| Google Analytics | PostHog: session replay, feature flags, no data sampling |
| Mixpanel | PostHog: self-hostable, unlimited events on free tier |
| Amplitude | PostHog: simpler, open-source, better privacy |
| Hotjar | PostHog: includes heatmaps + analytics in one tool |

**PostHog Features for Marketing:**
- **Session Replay** - Watch user sessions, identify UX issues
- **Funnels** - Track visitor -> lead -> customer conversion
- **Feature Flags** - A/B test different CTAs, headlines, designs
- **Web Analytics** - Page views, bounce rate, referrers
- **Surveys** - In-product micro-surveys

**Implementation:**
```tsx
// app/providers.tsx
'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Manual capture for SPA
    });
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

**Key Events to Track:**
```typescript
// Lead form started
posthog.capture('lead_form_started');

// Lead form completed
posthog.capture('lead_form_completed', { source: 'hero_cta' });

// Demo video watched
posthog.capture('demo_video_watched', { duration_seconds: 45 });

// Pricing page viewed
posthog.capture('pricing_viewed');
```

**Reverse Proxy (Recommended):**
Set up PostHog through a reverse proxy to avoid ad blockers:
```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/ingest/:path*',
        destination: 'https://app.posthog.com/:path*',
      },
    ];
  },
};
```

**Sources:**
- [PostHog Next.js Docs](https://posthog.com/docs/libraries/next-js)
- [PostHog + Vercel Guide](https://vercel.com/kb/guide/posthog-nextjs-vercel-feature-flags-analytics)

---

### Performance Optimization

| Technology | Purpose | Impact | Confidence |
|------------|---------|--------|------------|
| **next/image** | Image optimization | Automatic WebP/AVIF, lazy loading, prevents CLS | HIGH |
| **next/font** | Font optimization | No layout shift, preloaded, self-hosted | HIGH |
| **React Server Components** | Reduce client JS | Less JavaScript shipped to browser | HIGH |
| **Dynamic imports** | Code splitting | Load heavy components on demand | HIGH |

**Core Web Vitals Targets:**
| Metric | Target | Impact |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Hero loads fast |
| **INP** (Interaction to Next Paint) | < 200ms | Buttons feel responsive |
| **CLS** (Cumulative Layout Shift) | < 0.1 | No jarring layout jumps |

**Image Optimization:**
```tsx
import Image from 'next/image';

export function HeroImage() {
  return (
    <Image
      src="/hero-dashboard.png"
      alt="Findo Dashboard"
      width={1200}
      height={800}
      priority // Preload for LCP
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

**Font Optimization (Hebrew):**
```tsx
// app/layout.tsx
import { Heebo, Rubik } from 'next/font/google';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-sans',
  display: 'swap',
});

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  variable: '--font-display',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${rubik.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Dynamic Import for Heavy Components:**
```tsx
import dynamic from 'next/dynamic';

const HeavyAnimation = dynamic(() => import('./HeavyAnimation'), {
  loading: () => <div className="animate-pulse h-96 bg-muted" />,
  ssr: false, // Skip SSR for client-only animations
});
```

**Sources:**
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Optimizing Core Web Vitals with Next.js 15](https://trillionclues.medium.com/optimizing-core-web-vitals-with-next-js-15-61564cc51b13)
- [Vercel Core Web Vitals Guide](https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024)

---

### Hosting & Deployment

| Technology | Purpose | Why | Monthly Cost |
|------------|---------|-----|--------------|
| **Vercel** | Hosting | Native Next.js platform, global CDN, automatic HTTPS, preview deployments, Edge Functions. | Free tier / $20 Pro |

**Why Vercel for Marketing Site:**
- **Zero-config Next.js deployment** - Just push to GitHub
- **Global CDN** - Fast everywhere, including Israel
- **Preview deployments** - Every PR gets a preview URL
- **Analytics built-in** - Core Web Vitals monitoring
- **Edge Functions** - Low-latency dynamic content
- **ISR support** - Update content without full rebuild

**Deployment:**
```bash
# Connect GitHub repo to Vercel
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod
```

**Environment Variables:**
```env
# .env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
```

**Sources:**
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Next.js on Vercel](https://vercel.com/frameworks/nextjs)

---

### Internationalization (Future-Proofing)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **next-intl** | 4.7.x | i18n | Next.js native, Server Components support, performance optimized. RTL detection built-in. | HIGH |

**Why next-intl:**
- App Router native
- Server Components support
- Automatic RTL detection via `Intl.Locale.getTextInfo()`
- Message formatting, pluralization
- Type-safe message keys

**RTL Detection:**
```tsx
// app/[locale]/layout.tsx
import { Locale } from 'intl-locale-textinfo-polyfill';

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { direction: dir } = new Locale(locale).textInfo;

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
```

**Note:** For MVP, single-language Hebrew is fine. next-intl provides a clean upgrade path when English version is needed.

**Sources:**
- [next-intl Documentation](https://next-intl.dev/)
- [Next.js 15 + next-intl Guide](https://www.buildwithmatija.com/blog/nextjs-internationalization-guide-next-intl-2025)

---

## Installation Commands

```bash
# Initialize Next.js 15 project
pnpm create next-app@latest findo-website --typescript --tailwind --eslint --app --src-dir

cd findo-website

# Animation libraries
pnpm add motion gsap @gsap/react lenis

# UI Components (shadcn/ui - run init then add components)
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog form input

# Radix RTL support
pnpm add @radix-ui/react-direction

# Forms
pnpm add react-hook-form zod @hookform/resolvers

# Video
pnpm add next-video @mux/mux-player-react

# Analytics
pnpm add posthog-js

# i18n (optional for MVP)
pnpm add next-intl intl-locale-textinfo-polyfill

# Dev dependencies
pnpm add -D @types/node
```

---

## Project Structure

```
findo-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with RTL, fonts
│   │   ├── page.tsx            # Homepage
│   │   ├── providers.tsx       # PostHog, Direction providers
│   │   ├── (marketing)/        # Marketing pages group
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── pricing/
│   │   │   ├── features/
│   │   │   └── demo/
│   │   └── globals.css         # Tailwind 4.0 CSS
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── animations/         # GSAP/Motion components
│   │   ├── sections/           # Page sections (Hero, Features, etc.)
│   │   └── forms/              # Lead capture forms
│   ├── lib/
│   │   ├── animations.ts       # GSAP/Lenis setup
│   │   └── utils.ts
│   └── schemas/
│       └── lead.ts             # Zod schemas
├── public/
│   ├── videos/
│   └── images/
├── tailwind.config.ts
└── next.config.js
```

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| **Pages Router** | App Router is standard for new projects, better performance |
| **CSS Modules** | Tailwind CSS is faster to develop, better for marketing sites |
| **Styled Components** | Runtime CSS-in-JS hurts performance |
| **react-spring** | Motion is more feature-complete for this use case |
| **Anime.js** | GSAP is more powerful, better scroll integration |
| **AOS (Animate On Scroll)** | GSAP ScrollTrigger is more flexible and performant |
| **Google Analytics** | PostHog is better for product analytics, session replay |
| **Formik** | React Hook Form is lighter, faster, better DX |
| **Yup** | Zod has better TypeScript integration |

---

## Confidence Assessment

| Component | Confidence | Reasoning |
|-----------|------------|-----------|
| Next.js 15.5 | HIGH | Verified stable, production ready |
| Tailwind CSS 4.0 | HIGH | Verified January 2025 release, RTL support |
| Motion 12.27 | HIGH | Verified latest version, active development |
| GSAP 3.14 | HIGH | Verified, now fully free including plugins |
| shadcn/ui | HIGH | Industry standard, customizable |
| React Hook Form + Zod | HIGH | Standard pattern, verified versions |
| PostHog | HIGH | Verified features, Next.js integration |
| Mux/next-video | HIGH | Official Vercel integration |
| Vercel hosting | HIGH | Native Next.js platform |
| Hebrew RTL support | MEDIUM-HIGH | Requires manual logical properties in shadcn |

---

## Open Questions

1. **Interactive demo platform** - Evaluate Navattic/Storylane after launch based on conversion data
2. **Hebrew font performance** - Test Heebo vs Assistant for page speed impact
3. **Animation performance on mobile** - Test GSAP ScrollTrigger on low-end devices
4. **shadcn/ui RTL PR** - Monitor PR #1638 for built-in RTL support

---

## Sources Summary

### Official Documentation
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS 4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Motion Documentation](https://motion.dev/docs)
- [GSAP React Documentation](https://gsap.com/resources/React/)
- [PostHog Next.js Docs](https://posthog.com/docs/libraries/next-js)
- [React Hook Form](https://react-hook-form.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### RTL & Hebrew
- [Flowbite RTL Guide](https://flowbite.com/docs/customize/rtl/)
- [Radix Direction Provider](https://www.radix-ui.com/primitives/docs/utilities/direction-provider)
- [next-intl RTL](https://next-intl.dev/)

### Performance
- [Vercel Core Web Vitals](https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### Animation
- [Motion Changelog](https://motion.dev/changelog)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
