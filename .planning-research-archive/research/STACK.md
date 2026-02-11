# Technology Stack

**Project:** Findo - Israeli SMB Automation SaaS
**Researched:** 2026-01-27
**Overall Confidence:** HIGH (verified with official docs and 2025-2026 sources)

## Executive Summary

This stack is optimized for a Hebrew-language multi-tenant SaaS serving Israeli SMBs with autopilot functionality. Key considerations:

1. **Multi-tenancy from day one** - Row Level Security in PostgreSQL prevents data leakage
2. **Background job processing** - BullMQ for scheduled tasks and automation loops
3. **Real-time notifications** - Server-Sent Events (lighter than Socket.io for unidirectional notifications)
4. **Hebrew RTL** - next-intl + Tailwind logical properties for proper bidirectional support
5. **Israeli integrations** - Direct REST API integration with Green Invoice/iCount (no SDKs available)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Next.js** | 15.x (App Router) | Full-stack framework | Creator Vercel provides optimal tooling; App Router enables RSC for performance; official multi-tenant guide available | HIGH |
| **TypeScript** | 5.6+ | Type safety | Catches tenant isolation bugs at compile time; required for Prisma/Drizzle type inference | HIGH |
| **React** | 19.x | UI library | Bundled with Next.js 15; Server Components reduce client bundle for autopilot dashboard | HIGH |

### Database

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **PostgreSQL** | 16+ | Primary database | Row Level Security for tenant isolation; JSONB for flexible Israeli invoice schemas; excellent Hebrew text support | HIGH |
| **Prisma ORM** | 6.6+ | Database access | Multi-file schema support (new in 6.6); Client Extensions enable RLS; best migration tooling | HIGH |
| **Neon** (managed) | - | PostgreSQL hosting | Scale-to-zero for cost efficiency; instant branching for dev/staging; acquired by Databricks (stable) | MEDIUM |

**Alternative:** Supabase if you need built-in auth/realtime. Choose Neon for pure database focus.

### Caching & Queues

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Redis** | 7.x | Job queues, caching | Required by BullMQ; session caching; rate limiting for API integrations | HIGH |
| **BullMQ** | 5.x | Background jobs | Exactly-once semantics; scheduled jobs for optimization loops; retry handling for webhook failures | HIGH |
| **Upstash** (managed) | - | Redis hosting | Pay-per-request for variable loads; HTTP API works with edge; 250ms latency acceptable for background jobs | MEDIUM |

**Note on Upstash:** For high-volume background jobs (>1M/month), self-hosted Redis is more cost-effective. Start with Upstash, migrate if costs justify.

### Authentication

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Auth.js (NextAuth v5)** | 5.x | Authentication | Tenant-aware sessions via callbacks; Google OAuth for quick SMB onboarding; edge-compatible | HIGH |

**Multi-tenant auth pattern:**
- Store tenantId in JWT via session callback
- Use lazy initialization for dynamic NEXTAUTH_URL (subdomain per tenant)
- Extend session type to include tenant list for multi-business owners

### Real-Time Notifications

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Server-Sent Events (SSE)** | Native | Push notifications | Simpler than Socket.io for unidirectional updates; automatic reconnection; works through corporate firewalls | HIGH |

**Why NOT Socket.io:** Findo notifications are server-to-client only (missed call alerts, review status). SSE uses standard HTTP, no special infrastructure needed. Socket.io adds complexity without benefit for this use case.

### Internationalization & RTL

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **next-intl** | 3.x | i18n framework | Adopted by nodejs.org; best App Router integration; RTL detection via built-in methods | HIGH |
| **Tailwind CSS** | 4.x | Styling | Logical properties (ms-*, me-*, ps-*, pe-*) auto-mirror for RTL; no Rust build (Tailwind v4) | HIGH |
| **rtl-detect** | 1.x | RTL detection | Detects Hebrew/Arabic locales; integrates with next-intl | HIGH |

**RTL Pattern:**
```typescript
// Set dir="rtl" on <html> based on locale
const isRTL = rtlDetect.isRtlLang(locale);
```

### External Integrations

| Integration | Approach | Library | Why | Confidence |
|-------------|----------|---------|-----|------------|
| **WhatsApp Business API** | Direct REST | axios/fetch | Official SDK archived (2024); use Cloud API directly; Meta Embedded Signup for onboarding | HIGH |
| **Google Business Profile** | SDK | @googleapis/mybusinessaccountmanagement | Official Google SDK; handles OAuth complexity | HIGH |
| **Voicenter Telephony** | Webhooks | Custom webhook handler | Israeli telco; webhook triggers on missed calls; no official SDK | MEDIUM |
| **Green Invoice (Morning)** | REST API | axios/fetch | No official SDK; Apiary docs; acquired by TeamSystem (stable) | MEDIUM |
| **iCount** | REST API | axios/fetch | No official SDK; API on higher-tier plans only | MEDIUM |

**Critical Note on WhatsApp:**
- Official Meta SDK (`whatsapp` npm package) is **ARCHIVED** as of 2024
- Use community SDK `whatsapp-business-sdk` by MarcosNicolau (TypeScript, actively maintained) OR direct axios calls
- Embedded Signup requires Meta App Review approval

### Email

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Resend** | - | Transactional email | React Email integration; generous free tier (100/day); modern DX | HIGH |

**Why NOT SendGrid:** SendGrid discontinued free tier (July 2025). Resend's pricing is transparent and developer-focused.

### Infrastructure

| Technology | Purpose | Why | Confidence |
|------------|---------|-----|------------|
| **Vercel** | Next.js hosting | Optimal Next.js integration; automatic preview deployments; Israel edge presence | HIGH |
| **Railway** (alternative) | Full-stack hosting | Better for long-running jobs; native database support; more cost-effective at scale | MEDIUM |

**Recommendation:** Start with Vercel for simplicity. Move background workers to Railway if Vercel function limits become constraints.

---

## Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| **zod** | 3.x | Schema validation | Validate all external API responses (WhatsApp, invoicing); form validation | HIGH |
| **axios** | 1.x | HTTP client | Israeli API integrations lacking SDKs; interceptors for retry logic | HIGH |
| **date-fns** | 3.x | Date manipulation | Timezone handling for Israel (Asia/Jerusalem); scheduling job windows | HIGH |
| **react-hook-form** | 7.x | Form handling | 2-minute setup flow; controlled components for Hebrew input | HIGH |
| **@tanstack/react-query** | 5.x | Server state | Cache Google Business Profile data; optimistic updates for dashboard | HIGH |
| **nanoid** | 5.x | ID generation | Tenant IDs, correlation IDs for job tracking | HIGH |
| **pino** | 9.x | Logging | Structured logging; tenant context in all logs | HIGH |
| **ioredis** | 5.x | Redis client | Required by BullMQ; connection pooling | HIGH |

---

## Development Tools

| Tool | Purpose | Why |
|------|---------|-----|
| **pnpm** | Package manager | Faster than npm; strict hoisting prevents phantom dependencies |
| **Biome** | Linting/formatting | Faster than ESLint+Prettier; single config file |
| **Vitest** | Unit testing | Fast; native ESM support; compatible with React Testing Library |
| **Playwright** | E2E testing | Cross-browser; RTL layout testing |
| **Docker Compose** | Local dev | PostgreSQL + Redis containers; matches production |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| ORM | Prisma | Drizzle | Drizzle is faster but Prisma has better RLS patterns and migration tooling; Prisma 6.6+ fixed many performance issues |
| Database | Neon | Supabase | Supabase bundles auth/realtime we don't need; Neon's scale-to-zero better for SMB traffic patterns |
| Job Queue | BullMQ | Agenda.js | BullMQ is actively maintained; better TypeScript support; Redis-backed for reliability |
| Auth | Auth.js | Clerk | Auth.js is free/open-source; Clerk adds vendor dependency and cost at scale |
| Email | Resend | SendGrid | SendGrid discontinued free tier; Resend has better React integration |
| Real-time | SSE | Socket.io | Socket.io overkill for unidirectional notifications; SSE simpler and lighter |
| Hosting | Vercel | Netlify | Vercel has better Next.js optimization; Netlify Edge Functions less mature |

---

## What NOT to Use

| Technology | Why Avoid | Use Instead |
|------------|-----------|-------------|
| **Official WhatsApp SDK** (`whatsapp` npm) | Archived by Meta; no longer maintained | Direct Cloud API calls or `whatsapp-business-sdk` |
| **Firebase** | Vendor lock-in; not optimized for multi-tenant; no PostgreSQL RLS | Next.js + PostgreSQL + Auth.js |
| **MongoDB** | No Row Level Security; schema flexibility causes tenant data leakage risks | PostgreSQL with RLS |
| **Serverless Framework** | Adds complexity when Vercel handles deployment | Vercel native deployment |
| **GraphQL** | Overkill for this use case; REST simpler for external API integrations | REST with tRPC for internal |
| **tRPC** | Consider for internal APIs but external integrations are REST; adds learning curve | Stick to REST for simplicity |
| **Moment.js** | Deprecated; huge bundle size | date-fns |
| **ESLint + Prettier** | Two configs to maintain; slower | Biome |
| **Jest** | Slow; complex config for ESM | Vitest |
| **Nodemailer** | Low-level; requires SMTP config; no deliverability guarantees | Resend |
| **Bull (v3)** | Legacy; replaced by BullMQ | BullMQ v5 |
| **TypeORM** | Complex; poor TypeScript inference; Active Record pattern problematic for multi-tenant | Prisma |

---

## Architecture Notes

### Multi-Tenant Data Isolation

PostgreSQL Row Level Security is **mandatory** for this project. Pattern:

```sql
-- Enable RLS on tenant tables
ALTER TABLE "Business" ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY "tenant_isolation" ON "Business"
  FOR ALL TO PUBLIC
  USING ("tenantId" = current_setting('app.current_tenant')::uuid);
```

Prisma extension sets tenant context per request:

```typescript
const prismaWithTenant = prisma.$extends({
  query: {
    $allOperations({ args, query }) {
      return prisma.$queryRaw`SELECT set_config('app.current_tenant', ${tenantId}, false)`
        .then(() => query(args));
    }
  }
});
```

### Background Job Architecture

```
                    +------------------+
                    |   Next.js API    |
                    |   (triggers)     |
                    +--------+---------+
                             |
                             v
+------------------+   +------------------+   +------------------+
|   Missed Call    |   |   Review Loop    |   |   GBP Optimizer  |
|   Recovery Queue |   |   Queue          |   |   Queue          |
+--------+---------+   +--------+---------+   +--------+---------+
         |                      |                      |
         v                      v                      v
+------------------+   +------------------+   +------------------+
|   BullMQ Worker  |   |   BullMQ Worker  |   |   BullMQ Worker  |
|   (WhatsApp)     |   |   (Invoice API)  |   |   (Google API)   |
+------------------+   +------------------+   +------------------+
```

Queue priorities:
1. **Missed Call Recovery** - Immediate (within 5 min)
2. **Review Requests** - Triggered by invoice webhook
3. **GBP Optimization** - Scheduled (real-time/daily/weekly/monthly)

---

## Installation

```bash
# Core framework
pnpm add next@15 react@19 react-dom@19

# Database
pnpm add prisma @prisma/client
pnpm add -D prisma

# Authentication
pnpm add next-auth@5

# Background jobs
pnpm add bullmq ioredis

# External integrations
pnpm add axios zod whatsapp-business-sdk @googleapis/mybusinessaccountmanagement

# i18n & RTL
pnpm add next-intl rtl-detect

# UI & Forms
pnpm add tailwindcss@4 react-hook-form @hookform/resolvers

# Utilities
pnpm add date-fns nanoid pino @tanstack/react-query

# Email
pnpm add resend

# Dev dependencies
pnpm add -D typescript @types/node @types/react @types/react-dom
pnpm add -D @biomejs/biome vitest @vitejs/plugin-react
pnpm add -D @playwright/test
```

---

## Environment Variables Template

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."
# or for Upstash
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# Authentication
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# WhatsApp Cloud API
META_APP_ID="..."
META_APP_SECRET="..."
WHATSAPP_PHONE_NUMBER_ID="..."
WHATSAPP_BUSINESS_ACCOUNT_ID="..."
WHATSAPP_ACCESS_TOKEN="..."
WHATSAPP_WEBHOOK_VERIFY_TOKEN="..."

# Google Business Profile
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Israeli Invoicing
GREEN_INVOICE_API_KEY="..."
GREEN_INVOICE_SECRET="..."
ICOUNT_API_KEY="..."
ICOUNT_COMPANY_ID="..."

# Voicenter
VOICENTER_API_KEY="..."
VOICENTER_WEBHOOK_SECRET="..."

# Email
RESEND_API_KEY="..."

# App
NEXT_PUBLIC_APP_URL="https://app.findo.co.il"
```

---

## Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Core Framework (Next.js/React) | HIGH | Official docs, Vercel resources, widespread 2025-2026 adoption |
| Database (PostgreSQL + Prisma) | HIGH | Verified RLS patterns, Prisma 6.6 multi-file schema confirmed |
| Background Jobs (BullMQ) | HIGH | De facto standard for Node.js job processing, 1M+ jobs/day proven |
| WhatsApp Integration | MEDIUM | Official SDK archived; community SDK actively maintained but less battle-tested |
| Israeli Invoicing APIs | MEDIUM | Limited documentation; no official SDKs; may require API exploration |
| Voicenter Webhooks | LOW | Limited public documentation; need direct vendor contact |
| RTL Support | HIGH | Tailwind v4 logical properties, next-intl proven on nodejs.org |

---

## Sources

### Official Documentation
- [Next.js Multi-Tenant Guide](https://nextjs.org/docs/app/guides/multi-tenant)
- [Vercel Multi-Tenant Application Guide](https://vercel.com/guides/nextjs-multi-tenant-application)
- [Auth.js v5 Migration](https://authjs.dev/getting-started/migrating-to-v5)
- [BullMQ Documentation](https://docs.bullmq.io)
- [Prisma RLS Guide (Atlas)](https://atlasgo.io/guides/orms/prisma/row-level-security)

### GitHub Repositories
- [WhatsApp Business SDK (community)](https://github.com/MarcosNicolau/whatsapp-business-sdk)
- [Voicenter Web SDK](https://github.com/VoicenterTeam/VoicenterWebSDK)
- [Archived Official WhatsApp SDK](https://github.com/WhatsApp/WhatsApp-Nodejs-SDK)

### Platform Documentation
- [Green Invoice API (Apiary)](https://greeninvoice.docs.apiary.io/)
- [iCount API Features](https://www.icount.net/features/api/)
- [Voicenter API](https://www.voicenter.com/API)
- [Google Business Profile APIs](https://developers.google.com/my-business)

### Research Articles (2025-2026)
- [Drizzle vs Prisma 2026](https://medium.com/@thebelcoder/prisma-vs-drizzle-orm-in-2026-what-you-really-need-to-know)
- [Next.js 16 Architecture Blueprint](https://medium.com/@sureshdotariya/next-js-16-architecture-blueprint)
- [Email APIs in 2025](https://medium.com/@nermeennasim/email-apis-in-2025)
- [Neon vs Supabase Comparison](https://www.bytebase.com/blog/neon-vs-supabase/)
- [Railway vs Vercel Comparison](https://docs.railway.com/maturity/compare-to-vercel)
