# Design Bible Certification Checklist

**Version:** v1.1 Sales Website
**Target Score:** 95+ (EXEMPLARY)
**Production URL:** https://website-nine-theta-12.vercel.app

---

## Scoring System

Each category is scored: **0** (missing) | **5** (partial) | **10** (complete)
- Total categories: 8
- Maximum score: 80 points
- Certification score = (sum / 80) x 100
- Target: 95%+ (76/80 points minimum)

---

## Category 1: 5-Second Test (5SEC-01 to 5SEC-07)

| Requirement | Criteria | Status | Score |
|-------------|----------|--------|-------|
| 5SEC-01 | Headline under 8 words, states outcome | [ ] | |
| 5SEC-02 | Sub-headline under 15 words, adds specificity | [ ] | |
| 5SEC-03 | Primary CTA visible without scrolling | [ ] | |
| 5SEC-04 | Trust signal visible above fold | [ ] | |
| 5SEC-05 | Hero visual shows product in action | [ ] | |
| 5SEC-06 | Mobile-first layout | [ ] | |
| 5SEC-07 | Visitor can identify: what, for whom, what to do | [ ] | |

**Category Score:** ___/10

---

## Category 2: Performance (PERF-01 to PERF-06)

| Requirement | Target | Actual | Status | Score |
|-------------|--------|--------|--------|-------|
| PERF-01 | Lighthouse Performance 95+ mobile | 95+ | | [ ] | |
| PERF-02 | LCP | < 1.5s | | [ ] | |
| PERF-03 | CLS | = 0 | | [ ] | |
| PERF-04 | INP | < 100ms | | [ ] | |
| PERF-05 | 60fps animations | Smooth | | [ ] | |
| PERF-06 | Images optimized | WebP/AVIF | | [ ] | |

**Category Score:** ___/10

---

## Category 3: Mobile Experience (MOBILE-01 to MOBILE-08)

| Requirement | Criteria | Status | Score |
|-------------|----------|--------|-------|
| MOBILE-01 | Touch targets 48px minimum | [ ] | |
| MOBILE-02 | No horizontal scroll | [ ] | |
| MOBILE-03 | 3G load < 3 seconds | [ ] | |
| MOBILE-04 | Sticky CTA in thumb zone | [ ] | |
| MOBILE-05 | Text readable without zoom (16px+ base) | [ ] | |
| MOBILE-06 | Responsive images | [ ] | |
| MOBILE-07 | Touch-friendly sliders/accordions | [ ] | |
| MOBILE-08 | Phone-safe viewport (100dvh) | [ ] | |

**Category Score:** ___/10

---

## Category 4: SEO (SEO-01 to SEO-04)

| Requirement | Criteria | Status | Score |
|-------------|----------|--------|-------|
| SEO-01 | Hebrew meta tags (title, description) | [ ] | |
| SEO-02 | Structured data (4+ schemas) | [ ] | |
| SEO-03 | sitemap.xml generated | [ ] | |
| SEO-04 | robots.txt configured | [ ] | |
| SEO-05 | OG/Twitter cards (1200x630) | [ ] | |

**Category Score:** ___/10

---

## Category 5: Analytics (ANALYTICS-01 to ANALYTICS-06)

| Requirement | Criteria | Status | Score |
|-------------|----------|--------|-------|
| ANALYTICS-01 | PostHog initialized | [ ] | |
| ANALYTICS-02 | Pageviews tracked | [ ] | |
| ANALYTICS-03 | CTA clicks tracked | [ ] | |
| ANALYTICS-04 | Form submissions tracked | [ ] | |
| ANALYTICS-05 | Demo views tracked | [ ] | |
| ANALYTICS-06 | A/B testing infrastructure ready | [ ] | |

**Category Score:** ___/10

---

## Category 6: Accessibility (A11Y-01 to A11Y-03)

| Requirement | Criteria | Status | Score |
|-------------|----------|--------|-------|
| A11Y-01 | WCAG 2.1 AA contrast (4.5:1) | [ ] | |
| A11Y-02 | Keyboard navigable | [ ] | |
| A11Y-03 | Screen reader friendly | [ ] | |
| A11Y-04 | Reduced motion support | [ ] | |
| A11Y-05 | Focus visible indicators | [ ] | |

**Category Score:** ___/10

---

## Category 7: Trust & Proof (TRUST/PROOF)

| Requirement | Criteria | Status | Score |
|-------------|----------|--------|-------|
| TRUST-01 | Testimonials with attribution | [ ] | |
| TRUST-02 | Contact information visible | [ ] | |
| TRUST-03 | Guarantee near CTAs | [ ] | |
| TRUST-04 | Team section with real person | [ ] | |
| PROOF-01 | No dark patterns | [ ] | |
| PROOF-02 | Transparent pricing | [ ] | |

**Category Score:** ___/10

---

## Category 8: Hebrew Copy Quality

| Requirement | Criteria | Status | Score |
|-------------|----------|--------|-------|
| COPY-01 | Natural Hebrew flow (not translated) | [ ] | |
| COPY-02 | Conversational tone ("you" focused) | [ ] | |
| COPY-03 | No typos or grammatical errors | [ ] | |
| COPY-04 | Numbers formatted correctly (Israeli) | [ ] | |
| COPY-05 | Consistent terminology throughout | [ ] | |

**Category Score:** ___/10

---

## Certification Summary

| Category | Score | Max |
|----------|-------|-----|
| 5-Second Test | | 10 |
| Performance | | 10 |
| Mobile Experience | | 10 |
| SEO | | 10 |
| Analytics | | 10 |
| Accessibility | | 10 |
| Trust & Proof | | 10 |
| Hebrew Copy | | 10 |
| **TOTAL** | | **80** |

**Certification Score:** ____%

**Result:** [ ] PASSED (95%+) / [ ] NEEDS IMPROVEMENT

---

## Device Testing Checklist

Test each viewport in Chrome DevTools:

### iPhone SE (375x667)
- [ ] No horizontal scroll
- [ ] All CTAs tappable (48px+ touch targets)
- [ ] Text readable without zoom
- [ ] All images load
- [ ] Sticky CTA visible in thumb zone

### iPhone 12 Pro (390x844)
- [ ] No horizontal scroll
- [ ] All CTAs tappable
- [ ] Text readable without zoom
- [ ] All images load
- [ ] Sticky CTA visible

### Samsung Galaxy S20 (360x800)
- [ ] No horizontal scroll
- [ ] All CTAs tappable
- [ ] Text readable without zoom
- [ ] All images load
- [ ] Sticky CTA visible

### iPad (768x1024)
- [ ] No horizontal scroll
- [ ] All CTAs tappable
- [ ] Text readable without zoom
- [ ] All images load
- [ ] Layout adapts properly

---

## 5-Second Test Protocol

1. Show homepage to unfamiliar person for exactly 5 seconds
2. Hide screen immediately
3. Ask these questions:

| Question | Expected Answer | Actual Answer | Pass |
|----------|-----------------|---------------|------|
| What does this company do? | Automation for small businesses | | [ ] |
| Who is it for? | Small business owners | | [ ] |
| What should you do next? | Sign up / Try free / Contact | | [ ] |

**5-Second Test Result:** ___/3 correct

---

*Checklist created: 2026-02-03*
*Version: v1.1 Sales Website*
