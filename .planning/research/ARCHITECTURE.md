# Architecture Patterns: Findo Sales Website

**Domain:** High-conversion SaaS marketing website with "wow" animations
**Project:** Findo v1.1 - Sales Website for Israeli SMB automation SaaS
**Researched:** 2026-01-31
**Overall Confidence:** HIGH (verified with Next.js official docs, industry best practices)

---

## Executive Summary

The Findo sales website requires a **static-first, animation-rich Next.js application** optimized for conversion and Hebrew RTL. The architecture prioritizes:

1. **Performance-first animations** - Use Framer Motion for UI transitions, GSAP ScrollTrigger for hero/scroll effects
2. **Server-first rendering** - Static generation for SEO and speed, client islands for interactivity
3. **Hebrew-native design** - RTL as primary, not adapted from LTR
4. **Placeholder-ready content** - Centralized content layer enabling easy swap to real data
5. **90+ Lighthouse scores** - Achievable with proper image optimization, code splitting, and animation discipline

The website is **NOT** connected to the main Findo backend. It is a standalone marketing site with its own deployment, content, and analytics.

---

## Site Structure and Routing

### Recommended Page Structure

```
app/
├── (marketing)/                   # Route group (no URL prefix)
│   ├── layout.tsx                 # Shared marketing layout
│   ├── page.tsx                   # Homepage
│   ├── pricing/
│   │   └── page.tsx               # Pricing page
│   ├── features/
│   │   └── page.tsx               # Features overview
│   ├── how-it-works/
│   │   └── page.tsx               # Product walkthrough
│   ├── demo/
│   │   └── page.tsx               # Live demo embed
│   ├── about/
│   │   └── page.tsx               # About/company page
│   └── contact/
│       └── page.tsx               # Contact form
├── (legal)/                       # Legal pages group
│   ├── privacy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   └── accessibility/
│       └── page.tsx
├── blog/                          # Blog (if needed later)
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── api/                           # Minimal API routes
    ├── contact/
    │   └── route.ts               # Contact form handler
    └── analytics/
        └── route.ts               # Custom analytics endpoint
```

### Route Group Rationale

| Route Group | Purpose | Layout |
|-------------|---------|--------|
| `(marketing)` | Main conversion pages | Full marketing layout with nav/footer |
| `(legal)` | Legal pages | Minimal layout, no CTAs |
| `blog` | Content marketing (Phase 2+) | Blog-specific layout |

### URL Structure (Hebrew SEO)

```
/                      → Homepage
/pricing               → מחירים (Pricing)
/features              → יתרונות (Features/Benefits)
/how-it-works          → איך זה עובד (How it works)
/demo                  → הדגמה חיה (Live demo)
/about                 → אודות (About)
/contact               → צור קשר (Contact)
```

**Note:** Keep URLs in English for technical simplicity while using Hebrew content and meta tags for Hebrew SEO.

---

## Component Architecture

### Atomic Design Structure

```
components/
├── atoms/                         # Basic building blocks
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.variants.ts     # cva variant definitions
│   │   └── index.ts
│   ├── Text/
│   │   ├── Text.tsx
│   │   └── index.ts
│   ├── Icon/
│   │   ├── Icon.tsx
│   │   └── icons/                 # SVG icon components
│   ├── Badge/
│   ├── Input/
│   └── Logo/
│
├── molecules/                     # Combinations of atoms
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── PricingCard.tsx
│   ├── NavLink/
│   ├── FormField/
│   ├── StatItem/
│   └── CTAGroup/
│
├── organisms/                     # Complex components
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── MobileMenu.tsx
│   │   └── HeaderCTA.tsx
│   ├── Footer/
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   ├── HeroAnimation.tsx      # Client component
│   │   └── HeroBackground.tsx
│   ├── FeatureSection/
│   ├── PricingTable/
│   ├── TestimonialsCarousel/
│   ├── StatsBar/
│   ├── FAQAccordion/
│   ├── ContactForm/
│   └── DemoEmbed/
│
├── templates/                     # Page-level layouts
│   ├── MarketingLayout.tsx
│   ├── LegalLayout.tsx
│   └── BlogLayout.tsx
│
└── animations/                    # Animation-specific components
    ├── FadeIn.tsx
    ├── SlideUp.tsx
    ├── ScrollReveal.tsx
    ├── ParallaxSection.tsx
    ├── NumberCounter.tsx
    └── HeroScene.tsx              # GSAP-powered hero animation
```

### Server vs Client Component Strategy

| Component Type | Rendering | When to Use |
|----------------|-----------|-------------|
| Layout, Header, Footer | Server | Static content, SEO |
| Text content, Images | Server | All static elements |
| Hero animation | Client | Requires motion/GSAP |
| Mobile menu | Client | Requires state |
| Forms | Client | User interaction |
| Scroll animations | Client | Requires viewport detection |
| Carousels | Client | Requires interaction |
| Analytics | Client | Browser-only APIs |

**Pattern:** Wrap client components minimally. Keep 90%+ as Server Components.

```tsx
// Hero.tsx (Server Component)
import { HeroAnimation } from './HeroAnimation'; // Client

export function Hero() {
  return (
    <section className="relative min-h-screen">
      <HeroAnimation />  {/* Client island */}
      <div className="relative z-10">
        <h1>...</h1>  {/* Server-rendered content */}
      </div>
    </section>
  );
}
```

---

## Design System Architecture

### Tailwind CSS v4 + shadcn/ui

```
styles/
├── globals.css                    # Tailwind imports, CSS variables
├── animations.css                 # Custom animation keyframes
└── rtl.css                        # RTL-specific overrides

lib/
├── utils.ts                       # cn() utility for class merging
└── fonts.ts                       # Font loading configuration
```

### CSS Variables for Theming

```css
/* globals.css */
@layer base {
  :root {
    /* Brand colors - Findo palette */
    --primary: 220 90% 56%;        /* Blue */
    --primary-foreground: 0 0% 100%;

    --secondary: 280 65% 60%;      /* Purple accent */
    --accent: 45 93% 58%;          /* Gold/orange */

    /* Semantic colors */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;

    /* Component tokens */
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --border: 214 32% 91%;
    --ring: 220 90% 56%;

    /* Animation tokens */
    --animation-slow: 600ms;
    --animation-normal: 300ms;
    --animation-fast: 150ms;

    /* Spacing for Hebrew */
    --content-padding: 1.5rem;
  }
}
```

### Typography Scale (Hebrew-Optimized)

```tsx
// lib/fonts.ts
import { Heebo } from 'next/font/google';

export const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-heebo',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Heebo is a Hebrew-first font with excellent RTL support
// Use for all body text and most headings
```

```css
/* Typography scale */
.text-display { @apply text-5xl md:text-6xl lg:text-7xl font-bold leading-tight; }
.text-h1      { @apply text-4xl md:text-5xl font-bold leading-tight; }
.text-h2      { @apply text-3xl md:text-4xl font-semibold leading-snug; }
.text-h3      { @apply text-2xl md:text-3xl font-semibold; }
.text-h4      { @apply text-xl md:text-2xl font-medium; }
.text-body    { @apply text-base leading-relaxed; }
.text-small   { @apply text-sm leading-relaxed; }
```

### Component Variants with CVA

```tsx
// components/atoms/Button/Button.variants.ts
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        ghost: 'hover:bg-muted',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',  // Hero CTA size
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

---

## Animation Architecture

### Two-Library Strategy

| Library | Use For | Bundle Cost |
|---------|---------|-------------|
| **Framer Motion** | UI transitions, hover states, page transitions, layout animations | ~32KB gzipped |
| **GSAP + ScrollTrigger** | Hero scene, scroll-triggered reveals, parallax, complex timelines | ~23KB + ~12KB |

### Animation Organization

```
lib/
├── animations/
│   ├── variants.ts                # Framer Motion variants
│   ├── transitions.ts             # Shared transition configs
│   └── gsap/
│       ├── scrollTriggers.ts      # ScrollTrigger registrations
│       └── heroScene.ts           # Hero animation logic
```

### Framer Motion Variants

```tsx
// lib/animations/variants.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};
```

### Scroll Animation Component Pattern

```tsx
// components/animations/ScrollReveal.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### GSAP Hero Scene Pattern

```tsx
// components/organisms/Hero/HeroScene.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background elements
      elementsRef.current.forEach((el, i) => {
        gsap.to(el, {
          y: (i + 1) * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Text reveal on scroll
      gsap.from('.hero-text', {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Parallax elements */}
      <div ref={(el) => el && (elementsRef.current[0] = el)} className="..." />
      {/* More elements... */}
    </div>
  );
}
```

### Animation Performance Guidelines

1. **GPU-accelerated properties only:** `transform`, `opacity`, `filter`
2. **Avoid:** `width`, `height`, `top`, `left`, `margin`, `padding`
3. **Use `will-change` sparingly** - only on elements about to animate
4. **Lazy load GSAP plugins** - only import ScrollTrigger where used
5. **Cleanup:** Always return `ctx.revert()` in useEffect cleanup
6. **Reduce motion:** Respect `prefers-reduced-motion` media query

```tsx
// Reduced motion support
const prefersReducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animationVariants = prefersReducedMotion
  ? { hidden: {}, visible: {} }  // No animation
  : fadeInUp;                     // Full animation
```

---

## Content/Data Architecture

### Centralized Content Layer

**Goal:** All content in one place, easily swappable from placeholder to real data.

```
content/
├── index.ts                       # Main export
├── homepage.ts                    # Homepage content
├── pricing.ts                     # Pricing page content
├── features.ts                    # Features content
├── testimonials.ts                # Testimonials
├── faq.ts                         # FAQ content
├── navigation.ts                  # Nav/footer links
└── metadata.ts                    # SEO metadata per page
```

### Content Structure Pattern

```tsx
// content/homepage.ts
export const homepageContent = {
  hero: {
    headline: 'המערכת שעובדת בשבילך 24/7',
    subheadline: 'Findo אוספת לידים מפספוסי שיחות, מבקשת ביקורות, ומנהלת את הפרופיל העסקי שלך - הכל אוטומטי.',
    cta: {
      primary: {
        text: 'התחל ניסיון חינם',
        href: '/signup',
      },
      secondary: {
        text: 'צפה בהדגמה',
        href: '/demo',
      },
    },
    stats: [
      { value: '2', unit: 'דקות', label: 'זמן התקנה' },
      { value: '100%', unit: '', label: 'אוטומטי' },
      { value: '350', unit: '₪', label: 'לחודש' },
    ],
  },

  features: [
    {
      id: 'lead-capture',
      icon: 'phone',
      title: 'לכידת לידים מפספוסי שיחות',
      description: 'פספסת שיחה? Findo שולחת וואטסאפ אוטומטית ואוספת את פרטי הלקוח.',
      image: '/images/features/lead-capture.webp',
    },
    // ...more features
  ],

  socialProof: {
    headline: 'עסקים ישראלים סומכים על Findo',
    metrics: [
      { value: '1,234', label: 'לידים נאספו' },
      { value: '456', label: 'ביקורות התבקשו' },
      { value: '89%', label: 'שביעות רצון' },
    ],
  },
};

// Type definition
export type HomepageContent = typeof homepageContent;
```

### Content Consumption Pattern

```tsx
// app/(marketing)/page.tsx
import { homepageContent } from '@/content/homepage';
import { Hero } from '@/components/organisms/Hero';
import { FeaturesSection } from '@/components/organisms/FeaturesSection';

export default function HomePage() {
  return (
    <>
      <Hero content={homepageContent.hero} />
      <FeaturesSection features={homepageContent.features} />
      {/* ... */}
    </>
  );
}
```

### Placeholder → Real Content Swap

When ready to swap content:

1. **Option A: Direct edit** - Modify `content/*.ts` files
2. **Option B: CMS integration** - Replace imports with CMS fetches

```tsx
// Future: CMS integration
import { getHomepageContent } from '@/lib/cms';

export default async function HomePage() {
  const content = await getHomepageContent(); // From Sanity/Contentful
  return <Hero content={content.hero} />;
}
```

### Image Placeholder System

```tsx
// content/images.ts
export const images = {
  hero: {
    background: '/images/placeholders/hero-bg.webp',
    // Later: 'https://cdn.findo.co.il/hero-bg.webp'
  },
  features: {
    leadCapture: '/images/placeholders/feature-1.webp',
    reviewRequest: '/images/placeholders/feature-2.webp',
    // ...
  },
  testimonials: {
    avatar1: '/images/placeholders/avatar-1.webp',
    // ...
  },
};
```

---

## Internationalization (RTL) Architecture

### next-intl Configuration

```tsx
// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  // other config
});
```

```tsx
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  return {
    locale: 'he',
    messages: (await import(`@/messages/he.json`)).default,
  };
});
```

### RTL Setup

```tsx
// app/layout.tsx
import { heebo } from '@/lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-heebo">{children}</body>
    </html>
  );
}
```

### RTL-Aware CSS

**Use Tailwind CSS logical properties:**

```tsx
// Good - RTL-aware
<div className="ps-4 pe-8">   {/* padding-inline-start, padding-inline-end */}
<div className="ms-auto">     {/* margin-inline-start */}
<div className="text-start">  {/* aligns correctly in RTL */}

// Avoid - breaks in RTL
<div className="pl-4 pr-8">   {/* Fixed left/right */}
<div className="ml-auto">     {/* Fixed left margin */}
<div className="text-left">   {/* Forces LTR alignment */}
```

### Direction-Aware Icons

```tsx
// components/atoms/Icon/DirectionalIcon.tsx
interface DirectionalIconProps {
  icon: 'arrow' | 'chevron';
  direction: 'forward' | 'back';
}

export function DirectionalIcon({ icon, direction }: DirectionalIconProps) {
  // In RTL, "forward" points left, "back" points right
  const rotation = direction === 'forward' ? 'rtl:-scale-x-100' : '';
  return <Icon name={icon} className={rotation} />;
}
```

---

## Performance Architecture

### Image Optimization Strategy

```tsx
// components/atoms/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  className
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
      quality={85}
      className={cn('object-cover', className)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZ..." // Generate with plaiceholder
    />
  );
}
```

### Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** | < 2.5s | Priority images, font preload, SSG |
| **INP** | < 200ms | Minimal client JS, debounced handlers |
| **CLS** | < 0.1 | Image dimensions, font-display: swap |

### Code Splitting Strategy

```tsx
// Dynamic imports for heavy components
const DemoEmbed = dynamic(
  () => import('@/components/organisms/DemoEmbed'),
  {
    loading: () => <DemoSkeleton />,
    ssr: false  // Client-only component
  }
);

const HeroScene = dynamic(
  () => import('@/components/organisms/Hero/HeroScene'),
  { ssr: false }
);

// GSAP only imported where needed
const TestimonialsCarousel = dynamic(
  () => import('@/components/organisms/TestimonialsCarousel'),
  { ssr: false }
);
```

### Font Loading Optimization

```tsx
// lib/fonts.ts
import { Heebo } from 'next/font/google';

export const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  display: 'swap',           // Prevents FOIT
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,  // Reduces CLS
});
```

### Performance Monitoring

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

---

## SEO Architecture

### Metadata Pattern

```tsx
// app/(marketing)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://findo.co.il'),
  title: {
    template: '%s | Findo',
    default: 'Findo - אוטומציה לעסקים קטנים',
  },
  description: 'Findo אוספת לידים, מבקשת ביקורות, ומנהלת את הפרופיל העסקי שלך - הכל אוטומטי.',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    siteName: 'Findo',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Page-Specific Metadata

```tsx
// app/(marketing)/pricing/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מחירים',
  description: 'מחיר אחד פשוט - 350 ש"ח לחודש. ללא עלויות נסתרות.',
  openGraph: {
    title: 'מחירים | Findo',
    description: 'מחיר אחד פשוט - 350 ש"ח לחודש.',
    images: ['/og/pricing.png'],
  },
};
```

### Structured Data (JSON-LD)

```tsx
// components/seo/StructuredData.tsx
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Findo',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '350',
      priceCurrency: 'ILS',
      priceValidUntil: '2027-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Sitemap Generation

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://findo.co.il';

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/features`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/demo`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5 },
  ];
}
```

---

## Analytics Architecture

### Multi-Provider Setup

```tsx
// components/analytics/AnalyticsProvider.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');

    // Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', { page_path: url });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
```

### GDPR-Compliant Analytics

```tsx
// components/analytics/ConsentAwareAnalytics.tsx
'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useConsent } from '@/hooks/useConsent';

export function ConsentAwareAnalytics() {
  const { analyticsConsent } = useConsent();

  if (!analyticsConsent) return null;

  return <GoogleAnalytics gaId="G-XXXXXXXXXX" />;
}
```

### Conversion Tracking

```tsx
// lib/analytics.ts
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Usage
trackEvent('click', 'CTA', 'hero_start_trial');
trackEvent('submit', 'Form', 'contact_form');
trackEvent('view', 'Demo', 'demo_started');
```

---

## Build and Deployment Architecture

### Project Structure

```
findo-website/
├── app/                           # Next.js App Router
├── components/                    # React components
├── content/                       # Content layer
├── lib/                           # Utilities and helpers
├── public/                        # Static assets
│   ├── images/
│   ├── fonts/
│   └── og/                        # OpenGraph images
├── styles/                        # Global styles
├── messages/                      # i18n messages (if using next-intl)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Deployment Strategy

| Environment | Platform | Purpose |
|-------------|----------|---------|
| Production | Vercel | Main site (findo.co.il) |
| Preview | Vercel | PR previews |
| Local | localhost:3000 | Development |

### next.config.mjs

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { hostname: 'cdn.findo.co.il' },
    ],
  },

  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## Suggested Phase Order

Based on architecture dependencies, here is the recommended build order:

### Phase 1: Foundation (Days 1-3)
**Goal:** Project scaffolding, design system, RTL setup

1. Next.js 15 project initialization with App Router
2. Tailwind CSS v4 + shadcn/ui setup
3. Hebrew font loading (Heebo)
4. RTL layout configuration
5. Basic atoms: Button, Text, Icon
6. Layout template with Header/Footer shells
7. Content layer structure

**Deliverable:** Empty shell that renders correctly in Hebrew RTL

### Phase 2: Design System (Days 4-6)
**Goal:** Complete component library for building pages

1. All atoms (Input, Badge, Logo, etc.)
2. Molecules (Card variants, FormField, CTAGroup)
3. Animation infrastructure (Framer Motion setup, variants)
4. Responsive utilities and breakpoints

**Deliverable:** Storybook/component gallery with all building blocks

### Phase 3: Homepage (Days 7-10)
**Goal:** Hero section with "wow" animation, main conversion page

1. Hero section with GSAP ScrollTrigger animation
2. Features section with scroll reveals
3. Social proof section (stats, logos)
4. Testimonials carousel
5. CTA sections
6. Homepage content population

**Deliverable:** Fully functional, animated homepage

### Phase 4: Secondary Pages (Days 11-14)
**Goal:** Complete page suite

1. Pricing page with comparison table
2. Features page with detailed breakdowns
3. How It Works page with step visualization
4. About page
5. Contact page with form

**Deliverable:** All marketing pages complete

### Phase 5: Live Demo Integration (Days 15-16)
**Goal:** Embed interactive product demo

1. Demo page structure
2. Demo embed component (iframe or custom)
3. Demo controls and navigation
4. Loading states

**Deliverable:** Working demo experience

### Phase 6: Polish & Performance (Days 17-20)
**Goal:** 90+ Lighthouse, production-ready

1. Image optimization (WebP/AVIF, blur placeholders)
2. Font optimization audit
3. Animation performance audit
4. SEO implementation (meta, structured data, sitemap)
5. Analytics integration
6. Accessibility audit (WCAG 2.1 AA)
7. Cross-browser testing

**Deliverable:** Production-ready website with 90+ Lighthouse scores

---

## Technology Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | Latest |
| Animations | Framer Motion + GSAP | 11.x + 3.x |
| Font | Heebo (Google Fonts) | - |
| i18n | next-intl | 3.x |
| Deployment | Vercel | - |
| Analytics | Vercel Analytics + GA4 | - |

---

## Quality Gate Checklist

- [x] Site structure clearly defined (pages, routing)
- [x] Component architecture follows atomic design
- [x] Animation architecture separates concerns (Framer/GSAP)
- [x] Content layer enables placeholder→real swap
- [x] RTL setup is Hebrew-first
- [x] Performance architecture targets 90+ Lighthouse
- [x] SEO architecture covers meta, OG, structured data
- [x] Analytics architecture respects privacy
- [x] Build order considers dependencies
- [x] Phase ordering rationale documented

---

## Sources

### Next.js Architecture
- [Next.js Architecture in 2026 - Server-First, Client-Islands](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router)
- [Next.js Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/)
- [Scalable Next.js 15 App Router Project Structure](https://levelup.gitconnected.com/how-to-set-up-a-scalable-next-js-15-app-router-project-structure-pro-tips-3c42778cd737)
- [MakerKit Next.js App Router Structure](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)

### Animation Libraries
- [Motion (Framer Motion) Official](https://motion.dev/)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Framer Motion vs GSAP Comparison](https://blog.uavdevelopment.io/blogs/comparing-the-performance-of-framer-motion-and-gsap-animations-in-next-js)
- [React Animation Libraries 2026](https://blog.logrocket.com/best-react-animation-libraries/)

### Design System
- [shadcn/ui Official](https://ui.shadcn.com/)
- [Tailwind v4 with shadcn/ui](https://ui.shadcn.com/docs/tailwind-v4)
- [Building Scalable Component Libraries](https://medium.com/@sonilamohanty26/how-to-build-a-scalable-react-component-library-with-shadcn-ui-tailwind-css-57ce33a296f1)

### RTL/i18n
- [next-intl Official Docs](https://next-intl.dev/docs/getting-started)
- [i18n and RTL Implementation](https://dev.to/ash_dubai/i18n-and-rtl-implementation-for-global-e-commerce-mastering-i18n-3jb1)
- [Next.js i18n Support and RTL](https://medium.com/wtxhq/next-js-i18n-support-and-rtl-layouts-87144ad727c9)

### Performance
- [Next.js Performance Tuning for Lighthouse](https://www.qed42.com/insights/next-js-performance-tuning-practical-fixes-for-better-lighthouse-scores)
- [Optimizing Core Web Vitals with Next.js 15](https://trillionclues.medium.com/optimizing-core-web-vitals-with-next-js-15-61564cc51b13)
- [Next.js Lighthouse Optimization Case Study](https://dev.to/amansuryavanshi-ai/nextjs-lighthouse-optimization-42-to-97-case-study-4h6a)

### SEO
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [SEO with Next.js App Router Structured Data](https://blog.chaitanyaraj.dev/nextjs-app-router-structured-data)
- [Maximizing SEO with Meta Data in Next.js 15](https://dev.to/joodi/maximizing-seo-with-meta-data-in-nextjs-15-a-comprehensive-guide-4pa7)

### SaaS Landing Pages
- [SaaS Landing Page Trends 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [High-Converting Landing Page Examples](https://www.superside.com/blog/landing-page-design-examples)
- [SaaS Landing Page Best Practices 2026](https://fibr.ai/landing-page/saas-landing-pages)
