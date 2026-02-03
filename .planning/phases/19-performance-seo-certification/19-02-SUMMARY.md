---
phase: 19-performance-seo-certification
plan: 02
subsystem: SEO
tags: [seo, metadata, json-ld, sitemap, robots, structured-data]

dependency-graph:
  requires: []
  provides:
    - Hebrew SEO metadata with Open Graph
    - sitemap.xml and robots.txt generation
    - Organization, LocalBusiness, FAQPage, Product JSON-LD schemas
  affects:
    - Google Search indexing and rich results
    - Social media preview cards
    - Knowledge panel display

tech-stack:
  added:
    - schema-dts: 1.1.5 (type-safe JSON-LD)
  patterns:
    - Next.js App Router metadata API
    - JSON-LD structured data injection via next/script

files:
  created:
    - website/app/sitemap.ts
    - website/app/robots.ts
    - website/lib/schema/organization.ts
    - website/lib/schema/local-business.ts
    - website/lib/schema/faq-page.ts
    - website/lib/schema/product.ts
    - website/lib/schema/index.ts
    - website/components/seo/StructuredData.tsx
  modified:
    - website/package.json
    - website/app/layout.tsx
    - website/app/page.tsx

decisions:
  19-02-01:
    context: "JSON-LD injection in client component page"
    decision: "Use next/script with strategy='afterInteractive' in StructuredData component"
    rationale: "page.tsx has 'use client' directive, cannot use metadata export; next/script works in client components"

metrics:
  duration: "8 minutes"
  completed: "2026-02-03"
---

# Phase 19 Plan 02: SEO Infrastructure Summary

Complete SEO infrastructure with Hebrew-optimized metadata, structured data, sitemap, and robots.txt for search engine visibility and rich results.

## One-Liner

Hebrew SEO metadata with he_IL Open Graph, XML sitemap, robots.txt, and 4 JSON-LD schemas (Organization, LocalBusiness, FAQPage, Product) for Google rich results.

## What Was Built

### Task 1: Hebrew Metadata Configuration

**Commits:** 0427044

Installed schema-dts@1.1.5 for type-safe JSON-LD and configured complete Hebrew metadata in layout.tsx:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://findo.co.il"),
  title: {
    default: "Findo - יותר לקוחות, פחות עבודה | צמיחה אוטומטית לעסקים",
    template: "%s | Findo",
  },
  description: "מערכת אוטומטית לניהול ביקורות...",
  openGraph: {
    locale: "he_IL",
    // ...
  },
};
```

**Files:** `website/app/layout.tsx`, `website/package.json`

### Task 2: Sitemap and Robots Configuration

**Commits:** 3c867ec

Created App Router API handlers for sitemap and robots.txt:

**sitemap.ts:**
- Homepage at priority 1.0
- Weekly change frequency
- Uses findo.co.il as base URL

**robots.ts:**
- Allows all crawlers
- Blocks /_next/, /api/, /*.json$ routes
- References sitemap.xml

**Files:** `website/app/sitemap.ts`, `website/app/robots.ts`

### Task 3: JSON-LD Structured Data

**Commits:** 416cd5f

Created 4 JSON-LD schemas for Google rich results:

1. **Organization** - Company info for Knowledge Panel
2. **LocalBusiness** - Israeli service area with ILS currency
3. **FAQPage** - Matches 5 FAQ questions from FAQSection
4. **Product** - 350 ILS/month pricing with aggregate rating

Integrated via StructuredData component using next/script.

**Files:** `website/lib/schema/*.ts`, `website/components/seo/StructuredData.tsx`, `website/app/page.tsx`

## Verification Results

| Check | Status |
|-------|--------|
| schema-dts installed | PASS - v1.1.5 |
| Hebrew meta tags in source | PASS - title, description, keywords in Hebrew |
| og:locale is he_IL | PASS - configured in openGraph |
| /sitemap.xml route generated | PASS - shows in build output |
| /robots.txt route generated | PASS - shows in build output |
| 4 JSON-LD script tags render | PASS - Organization, LocalBusiness, FAQPage, Product |
| Build passes | PASS - no errors |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 0427044 | feat | Install schema-dts and add Hebrew SEO metadata |
| 3c867ec | feat | Create sitemap.ts and robots.ts |
| 416cd5f | feat | Create JSON-LD structured data schemas |

## Deviations from Plan

None - plan executed exactly as written.

## Requirements Addressed

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| SEO-01 | SATISFIED | Hebrew meta title and description in layout.tsx |
| SEO-02 | SATISFIED | Open Graph with he_IL locale |
| SEO-03 | SATISFIED | sitemap.ts and robots.ts created |
| SEO-04 | SATISFIED | 4 JSON-LD schemas for rich results |

## Next Phase Readiness

All SEO infrastructure is in place:
- Metadata will appear in Google search results
- Open Graph will power social previews
- Sitemap enables proper crawling
- Structured data enables rich snippets

**Ready for:** Plan 19-03 (Web Vitals Optimization) or verification.
