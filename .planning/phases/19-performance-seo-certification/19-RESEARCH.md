# Phase 19: Performance, SEO & Certification - Research

**Researched:** 2026-02-03
**Domain:** Web Performance, SEO, Analytics, Quality Certification
**Confidence:** HIGH

## Summary

This phase focuses on achieving technical excellence across four domains: (1) Performance optimization targeting Lighthouse 95+ with specific Core Web Vitals thresholds (LCP < 1.5s, CLS = 0, INP < 100ms), (2) Complete SEO setup including Hebrew meta tags, structured data (Organization, LocalBusiness, Product, FAQPage), sitemap, and robots.txt, (3) PostHog analytics integration with session replay, funnel tracking, and A/B testing infrastructure, and (4) Design Bible certification with automated and manual quality gates.

The standard approach leverages Next.js 16's built-in optimization features (next/image, next/font, App Router metadata API) combined with PostHog's unified analytics platform. Performance optimization prioritizes the Heebo font already configured with display:swap, image optimization with AVIF/WebP formats, and GPU-accelerated animations via the existing Motion + GSAP setup.

**Primary recommendation:** Use Next.js built-in APIs for sitemap/robots/metadata, PostHog for all analytics (no additional tools), and Lighthouse CI in GitHub Actions for automated performance gates.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/image | Next.js 16 | Image optimization | Auto AVIF/WebP, srcset, blur placeholder |
| next/font | Next.js 16 | Font optimization | Zero CLS with size-adjust fallbacks |
| Motion | 11.x | Animations | GPU-accelerated, hardware animations |
| GSAP | 3.x | Complex animations | 60fps optimized, compositor thread |

### To Add
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| posthog-js | Latest | Client analytics | Page views, events, session replay |
| posthog-node | Latest | Server analytics | Server events, feature flags SSR |
| schema-dts | Latest | Type-safe JSON-LD | Structured data validation |

### Not Needed
| Instead of | Could Use | Why Not Needed |
|------------|-----------|----------------|
| next-sitemap | App Router sitemap.ts | Built-in is simpler, maintained |
| next-seo | Metadata API | Built-in covers all use cases |
| Google Analytics | PostHog | PostHog covers analytics + session replay + A/B |
| Hotjar | PostHog | Session replay included in PostHog |
| Optimizely | PostHog | Feature flags + experiments included |

**Installation:**
```bash
npm install posthog-js posthog-node schema-dts
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── sitemap.ts           # Dynamic sitemap generation
├── robots.ts            # Robots.txt generation
├── opengraph-image.tsx  # OG image generation
├── layout.tsx           # Root metadata + PostHog provider
└── page.tsx             # Page-specific metadata
lib/
├── posthog/
│   ├── client.ts        # Client-side PostHog init
│   ├── server.ts        # Server-side PostHog client
│   └── events.ts        # Event type definitions
├── schema/
│   ├── organization.ts  # Organization JSON-LD
│   ├── local-business.ts # LocalBusiness JSON-LD
│   ├── faq-page.ts      # FAQPage JSON-LD
│   └── product.ts       # Product JSON-LD
└── analytics/
    ├── track.ts         # Unified tracking functions
    └── funnels.ts       # Funnel step definitions
```

### Pattern 1: PostHog Provider Setup (App Router)
**What:** Initialize PostHog client-side with App Router
**When to use:** Root layout, wrap entire app
**Example:**
```typescript
// Source: PostHog Next.js docs
// app/providers.tsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest', // Reverse proxy to avoid blockers
      capture_pageview: false, // Manual pageview capture
      capture_pageleave: true,
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

### Pattern 2: Pageview Tracking with App Router
**What:** Track pageviews on route changes
**When to use:** Layout component
**Example:**
```typescript
// Source: PostHog Next.js docs
'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthog.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, posthog])

  return null
}
```

### Pattern 3: JSON-LD Structured Data
**What:** Type-safe structured data with XSS protection
**When to use:** Page components for SEO
**Example:**
```typescript
// Source: Next.js JSON-LD docs
import { Organization, WithContext } from 'schema-dts'

const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Findo',
  url: 'https://findo.co.il',
  logo: 'https://findo.co.il/logo.png',
  description: 'אוטומציה מלאה לעסקים קטנים',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+972-XX-XXX-XXXX',
    contactType: 'customer service',
    availableLanguage: 'Hebrew'
  }
}

// In component - XSS protected
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
  }}
/>
```

### Pattern 4: Sitemap Generation
**What:** App Router native sitemap
**When to use:** Static site, single page app
**Example:**
```typescript
// Source: Next.js sitemap.xml docs
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://findo.co.il',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]
}
```

### Pattern 5: Reverse Proxy for PostHog (Avoid Ad Blockers)
**What:** Route PostHog requests through your domain
**When to use:** Always, for reliable tracking
**Example:**
```typescript
// Source: PostHog docs
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
}
```

### Anti-Patterns to Avoid
- **Duplicate JSON-LD tags:** Don't render in both server and client hydration
- **Blocking scripts:** Never load PostHog synchronously
- **Multiple analytics tools:** PostHog covers everything, don't add GA4
- **Large blurDataURL:** Keep placeholder images under 10px, or performance suffers
- **Unoptimized hero images:** Always use `preload` (not deprecated `priority`) for LCP images

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom sharp pipeline | next/image | Automatic AVIF/WebP, CDN, srcset |
| Font loading | Manual preload links | next/font | Auto size-adjust for zero CLS |
| Sitemap generation | Manual XML file | app/sitemap.ts | Auto-updates, type-safe |
| Session recording | Custom event logger | PostHog | Compressed, privacy-safe, integrated |
| A/B testing | Custom flag system | PostHog feature flags | Statistical significance built-in |
| UTM tracking | Custom param parser | PostHog auto-capture | Automatic first/last touch |
| OG image generation | External service | opengraph-image.tsx | On-demand, edge-optimized |
| Performance monitoring | Custom metrics | Vercel Speed Insights | RUM data, INP attribution |

**Key insight:** Next.js 16 and PostHog together provide a complete performance + analytics stack. Adding more tools creates complexity and bundle size without benefit.

## Common Pitfalls

### Pitfall 1: LCP Regression from Hero Animations
**What goes wrong:** Complex entrance animations delay LCP element visibility
**Why it happens:** Animation libraries block rendering until JS executes
**How to avoid:** Hero text must be server-rendered, animations applied after paint
**Warning signs:** LCP > 2.5s in Lighthouse despite fast server response

### Pitfall 2: CLS from Web Fonts
**What goes wrong:** Font swap causes text reflow, triggering layout shift
**Why it happens:** Fallback font metrics don't match custom font
**How to avoid:** Use next/font with display:swap (already configured with Heebo)
**Warning signs:** CLS > 0 on first load, text "jumping" visually

### Pitfall 3: INP from React Re-renders
**What goes wrong:** Interactions feel slow despite fast network
**Why it happens:** Large component trees re-render on state changes
**How to avoid:** Use React.memo, useTransition, useDeferredValue for heavy updates
**Warning signs:** INP > 200ms, laggy button/input responses

### Pitfall 4: PostHog Blocked by Ad Blockers
**What goes wrong:** 30-40% of sessions missing from analytics
**Why it happens:** Ad blockers block requests to posthog.com domain
**How to avoid:** Use reverse proxy pattern (/ingest/* rewrite)
**Warning signs:** Session counts much lower than actual traffic

### Pitfall 5: Mobile Lighthouse Score Mismatch
**What goes wrong:** Desktop scores 95+, mobile scores 60-70
**Why it happens:** Lighthouse simulates slow 3G with CPU throttling
**How to avoid:** Test mobile first, optimize for 3G baseline
**Warning signs:** Big gap between desktop and mobile scores

### Pitfall 6: Third-Party Script Blocking
**What goes wrong:** Total Blocking Time spikes, hurting performance score
**Why it happens:** Scripts execute synchronously on main thread
**How to avoid:** Load all third-party scripts with async/defer or dynamic import
**Warning signs:** Long tasks > 50ms in Performance panel

### Pitfall 7: Structured Data Not Rendering
**What goes wrong:** Rich Results Test shows no structured data
**Why it happens:** JSON-LD rendered only client-side, not in initial HTML
**How to avoid:** Render JSON-LD in Server Components, not client components
**Warning signs:** "No structured data found" in testing tools

## Code Examples

Verified patterns from official sources:

### Hebrew Metadata Configuration
```typescript
// Source: Next.js Metadata API
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Findo - העסק שלך עובד. אתה לא.',
    template: '%s | Findo'
  },
  description: 'אוטומציה מלאה לעסקים קטנים בישראל. תפיסת לידים, ניהול ביקורות, ואופטימיזציית Google Business Profile.',
  keywords: ['אוטומציה לעסקים', 'שיווק אוטומטי', 'ביקורות גוגל', 'לידים'],
  authors: [{ name: 'Findo' }],
  creator: 'Findo',
  metadataBase: new URL('https://findo.co.il'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: 'https://findo.co.il',
    siteName: 'Findo',
    title: 'Findo - העסק שלך עובד. אתה לא.',
    description: 'אוטומציה מלאה לעסקים קטנים בישראל',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Findo - אוטומציה לעסקים',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Findo - העסק שלך עובד. אתה לא.',
    description: 'אוטומציה מלאה לעסקים קטנים בישראל',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Image Optimization for LCP
```typescript
// Source: Next.js Image docs
import Image from 'next/image'

// Hero image - LCP element
<Image
  src="/hero-image.webp"
  alt="תיאור התמונה בעברית"
  width={800}
  height={600}
  preload={true}  // Preload for LCP
  quality={75}
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJR..."
/>

// Below-fold image - lazy loaded
<Image
  src="/feature-image.webp"
  alt="תיאור"
  width={400}
  height={300}
  loading="lazy"
  quality={60}
/>
```

### PostHog Event Tracking
```typescript
// Source: PostHog docs
import { usePostHog } from 'posthog-js/react'

function CTAButton() {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog.capture('cta_clicked', {
      button_location: 'hero',
      button_text: 'התחל בחינם',
      $set: { interested_in_trial: true }
    })
  }

  return <button onClick={handleClick}>התחל בחינם</button>
}
```

### Funnel Tracking Setup
```typescript
// Source: PostHog docs
// lib/analytics/funnels.ts
export const FUNNEL_STEPS = {
  page_view: '$pageview',
  cta_click: 'cta_clicked',
  form_start: 'form_started',
  form_submit: 'form_submitted',
  trial_started: 'trial_started',
} as const

// Track form funnel
posthog.capture('form_started', {
  form_type: 'lead_capture',
  source: 'hero'
})
```

### LocalBusiness Schema for Israeli Business
```typescript
// Source: schema.org LocalBusiness
import { LocalBusiness, WithContext } from 'schema-dts'

const localBusinessSchema: WithContext<LocalBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://findo.co.il/#organization',
  name: 'Findo',
  description: 'אוטומציה מלאה לעסקים קטנים בישראל',
  url: 'https://findo.co.il',
  logo: 'https://findo.co.il/logo.png',
  image: 'https://findo.co.il/og-image.png',
  telephone: '+972-XX-XXX-XXXX',
  email: 'hello@findo.co.il',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tel Aviv',
    addressCountry: 'IL'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 32.0853,
    longitude: 34.7818
  },
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '09:00',
    closes: '18:00'
  },
  sameAs: [
    'https://facebook.com/findoil',
    'https://linkedin.com/company/findo'
  ]
}
```

### FAQPage Schema
```typescript
// Source: Google FAQ structured data docs
import { FAQPage, WithContext } from 'schema-dts'

const faqSchema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'כמה זמן לוקח להתחיל?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'התקנה תוך 2 דקות. הכל אוטומטי מהרגע הראשון.'
      }
    },
    {
      '@type': 'Question',
      name: 'מה המחיר?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'תשלום חד-פעמי להתקנה ומנוי חודשי קטן. בלי התחייבות.'
      }
    }
  ]
}
```

### Robots.txt Generation
```typescript
// Source: Next.js robots.txt docs
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://findo.co.il/sitemap.xml',
  }
}
```

### Prefers-Reduced-Motion Support
```typescript
// Source: CSS-Tricks, web.dev
// For CSS animations
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

// For Motion library
import { useReducedMotion } from 'motion/react'

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ opacity: 1, y: shouldReduceMotion ? 0 : 20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    />
  )
}
```

### 3G Fallback Strategy
```typescript
// Source: MDN Save-Data header
// Detect Save-Data preference
if ('connection' in navigator) {
  const { saveData, effectiveType } = navigator.connection as any

  if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
    // Disable non-essential animations
    document.documentElement.classList.add('reduce-data')
  }
}

// CSS fallback
.reduce-data .non-essential-animation {
  animation: none !important;
  transition: none !important;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| priority prop | preload prop | Next.js 16 | Use preload={true} for LCP images |
| next-sitemap package | app/sitemap.ts | Next.js 13.3+ | Built-in, no deps needed |
| FID metric | INP metric | March 2024 | Stricter responsiveness requirement |
| Google Analytics | PostHog | 2024+ | Unified analytics + session replay |
| Manual srcset | next/image auto | Next.js 10+ | Automatic responsive images |

**Deprecated/outdated:**
- `priority` prop on next/image: Use `preload={true}` in Next.js 16+
- `next-sitemap` package: Built-in sitemap.ts is preferred
- FID (First Input Delay): Replaced by INP (Interaction to Next Paint)
- Separate session replay tools: PostHog includes this

## Open Questions

Things that couldn't be fully resolved:

1. **Hebrew OG Image Generation**
   - What we know: Next.js supports opengraph-image.tsx for dynamic generation
   - What's unclear: RTL text rendering in @vercel/og edge function
   - Recommendation: Test with Heebo font, may need custom canvas approach

2. **Design Bible Certification Details**
   - What we know: Phase mentions "Design Bible certification" and 95+ target
   - What's unclear: No external "Design Bible" standard found - likely project-internal
   - Recommendation: Define certification criteria in this phase's planning

3. **PostHog Pricing at Scale**
   - What we know: Free tier includes 1M events, 5K recordings/month
   - What's unclear: Exact costs if traffic exceeds free tier significantly
   - Recommendation: Monitor usage, free tier likely sufficient for launch

## Sources

### Primary (HIGH confidence)
- Next.js 16 Image Component docs - formats, preload, sizes configuration
- Next.js App Router Metadata API - sitemap.ts, robots.ts, metadata export
- Next.js JSON-LD guide - structured data implementation with XSS protection
- PostHog Next.js integration docs - provider setup, event capture
- Google Core Web Vitals documentation - LCP, CLS, INP thresholds
- schema.org - LocalBusiness, Organization, FAQPage schema definitions

### Secondary (MEDIUM confidence)
- [Next.js Lighthouse optimization guides](https://www.wisp.blog/blog/mastering-mobile-performance-a-complete-guide-to-improving-nextjs-lighthouse-scores) - Multiple articles confirming patterns
- [Vercel INP optimization](https://vercel.com/blog/improving-interaction-to-next-paint-with-react-18-and-suspense) - React 18 patterns
- [PostHog UTM tracking](https://posthog.com/docs/data/utm-segmentation) - Auto-capture configuration

### Tertiary (LOW confidence)
- Hebrew SEO best practices - Based on Israeli agency articles, verify with actual testing
- 3G fallback strategies - Based on PWA documentation, test with real throttling

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs for all tools
- Architecture: HIGH - Verified Next.js 16 patterns
- Performance patterns: HIGH - Core Web Vitals well-documented
- SEO patterns: HIGH - Google structured data docs
- PostHog integration: HIGH - Official PostHog docs
- Hebrew-specific SEO: MEDIUM - Based on general SEO + Hebrew language knowledge
- Pitfalls: HIGH - Multiple sources confirm common issues

**Research date:** 2026-02-03
**Valid until:** 2026-03-03 (30 days - stable domain)
