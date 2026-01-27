# Technology Stack

**Project:** Findo - SMB Automation SaaS (Israeli Market)
**Researched:** 2026-01-27
**Overall Confidence:** HIGH

---

## Executive Summary

This stack is optimized for a **cost-sensitive, Hebrew-language SaaS** targeting Israeli SMBs at 350 NIS/month. Every choice balances:
- **Cost efficiency** (serverless where possible, pay-per-use)
- **Developer productivity** (TypeScript end-to-end, modern tooling)
- **Israeli market requirements** (Hebrew RTL, local integrations)
- **Multi-tenant architecture** (shared database with tenant isolation)

---

## Recommended Stack

### Runtime & Language

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Node.js** | 24.x LTS (Krypton) | Server runtime | Active LTS through April 2028. Event-driven, non-blocking I/O ideal for webhook processing and real-time operations. Massive ecosystem for all required integrations. | HIGH |
| **TypeScript** | 5.5+ | Type safety | End-to-end type safety reduces bugs. Required for Prisma/Drizzle type inference. | HIGH |
| **pnpm** | 10.x | Package manager | 80% disk savings vs npm, fastest installs, best monorepo support. Critical for CI/CD cost reduction. | HIGH |

**Why Node.js over alternatives:**
- Bun: Still maturing, ecosystem compatibility gaps
- Deno: Smaller ecosystem for required integrations (WhatsApp, GBP, Israeli services)
- Go/Rust: Overkill for this use case, higher hiring cost in Israel

### Backend Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Hono.js** | 4.x | API framework | 2-4x faster than Express, TypeScript-first, 14KB bundle, Zod integration built-in. Works on Node.js, Cloudflare Workers, Vercel. Future-proofs edge deployment. | HIGH |

**Why Hono over alternatives:**

| Alternative | Why Not |
|-------------|---------|
| Express.js | Slower (347 req/s vs 49 for similar workloads), no built-in TypeScript, middleware architecture dated |
| Fastify | Good option but Hono is lighter, faster, better edge compatibility |
| NestJS | Overkill complexity for this product. Enterprise patterns add overhead without value for a focused SaaS |
| Next.js API Routes | Locks you to Vercel, serverless limitations for background jobs, not ideal for webhook-heavy workloads |

### Database

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **PostgreSQL** | 16.x | Primary database | ACID compliance, JSONB for flexible schemas, Row Level Security for tenant isolation, mature ecosystem. Best for compliance (Israel e-invoicing 2026 requirements). | HIGH |
| **Neon** | Serverless | Hosting | Scale-to-zero cuts dev/staging costs. $7.66/month for entry-level vs $25+ Supabase. Database branching for testing. Post-Databricks acquisition: 15-25% price drops in 2025. | HIGH |

**Multi-Tenant Strategy:** Shared database with `tenant_id` column + Row Level Security (RLS)

**Why this approach:**
- Simplest to implement and maintain
- Cheapest (single database)
- RLS provides row-level isolation without schema complexity
- Easy to migrate specific tenants to dedicated DB if they grow to enterprise

**Why PostgreSQL over MongoDB:**
- Relational data model fits SaaS (customers, invoices, reviews - all relational)
- RLS built-in for multi-tenancy
- JSONB handles schema flexibility where needed
- Better tooling for Israeli e-invoicing compliance

### ORM

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Drizzle ORM** | 0.44+ | Database access | Faster runtime than Prisma, no code generation step, SQL-like API, excellent TypeScript inference, better serverless cold starts. | MEDIUM-HIGH |

**Why Drizzle over Prisma:**

| Factor | Drizzle | Prisma |
|--------|---------|--------|
| Runtime performance | Faster (no abstraction layer) | Slight overhead |
| Serverless cold starts | Better (lightweight) | Improved but heavier |
| Dev workflow | Instant changes | Requires `prisma generate` |
| Type checking speed | Slower (inference) | 72% faster (code gen) |
| Multi-tenant RLS | Manual setup | Client extensions |

**Note:** Prisma is also excellent. If team prefers Prisma's DX, use it - the performance difference is negligible for most operations.

### Cache & Queue

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Redis** | 7.x | Cache + Queue backend | Required for BullMQ. Industry standard. | HIGH |
| **Upstash** | Serverless | Redis hosting | Pay-per-request ($0.2/100k). Scale-to-zero. For low-traffic periods, costs ~$2-5/month vs $24+ for always-on Redis. | HIGH |
| **BullMQ** | 5.16+ | Job queue | Redis-based, supports delayed/repeatable jobs, job dependencies, horizontal scaling. Bull Board UI for monitoring. | HIGH |

**Why BullMQ over Agenda:**
- BullMQ: Redis-based, faster, better scaling, more features
- Agenda: MongoDB-based (we're using PostgreSQL), simpler but less performant

**Scheduled Job Architecture:**
```
Daily tasks:   BullMQ repeatable jobs (e.g., daily review requests)
Weekly tasks:  BullMQ repeatable jobs (e.g., GBP post scheduling)
Monthly tasks: BullMQ repeatable jobs (e.g., billing cycles)
Webhooks:      Immediate queue + async processing
```

### Authentication

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Clerk** | Latest | Auth + multi-tenant | Built-in organizations, RBAC, user management UI. B2B SaaS features out of box. Under 30 min to implement vs 150-300 hours custom. | MEDIUM-HIGH |

**Pricing:** Free up to 10,000 MAU, then $0.02/MAU. For 1,000 SMB customers = $0/month.

**Why Clerk over alternatives:**

| Alternative | Why Not |
|-------------|---------|
| NextAuth/Auth.js | No built-in org management, RBAC, user UI. 4-8 weeks to build what Clerk has. |
| Supabase Auth | Good but no org/multi-tenant features built-in |
| Auth0 | Expensive, complex, overkill |
| Better-auth | Too new, less battle-tested |

**Caveat:** If data residency in Israel becomes a requirement, consider self-hosted Auth.js with custom org layer.

### AI/LLM

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Anthropic Claude** | Haiku 4.5 | AI responses | Best balance of cost/quality for conversational AI. Haiku: $1/$5 per million tokens. Hebrew support adequate. | MEDIUM-HIGH |

**Cost Comparison (per 1M tokens):**

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| Claude Haiku 4.5 | $1 | $5 | High-volume, simple responses |
| Claude Sonnet 4.5 | $3 | $15 | Complex reasoning |
| GPT-4o mini | ~$0.15 | ~$0.60 | Cheapest, lower quality |

**Hebrew Language Consideration:**
Hebrew tokenizes at ~4x English cost (each letter = token vs word). For Hebrew-heavy operations:
- Use prompt caching (70-80% cost reduction on repeated context)
- Keep system prompts in English where possible
- Pre-generate common response templates

**Recommendation:** Start with Haiku for most operations, Sonnet for complex escalations.

### Email

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Resend** | Latest | Transactional email | Developer-first, clean API, $20/month for most usage vs $180 SendGrid for same volume. React Email integration for Hebrew templates. | HIGH |

**Why Resend over SendGrid:**
- 9x cheaper for typical SaaS volumes
- Better DX, cleaner API
- Idempotency keys (SendGrid lacks this)
- React Email for maintainable templates

**Limitation:** No marketing email - use separate service if needed later.

### Hosting & Infrastructure

| Component | Technology | Why | Monthly Cost Estimate |
|-----------|------------|-----|----------------------|
| **Backend API** | Railway | Simple deploys, $5 base + usage, predictable costs, good for long-running jobs | $20-50 |
| **Database** | Neon | Scale-to-zero, cheapest serverless PG | $10-30 |
| **Redis/Queue** | Upstash | Pay-per-request | $5-20 |
| **Frontend** (if needed) | Vercel | Free tier sufficient for admin dashboard | $0-20 |

**Why Railway over alternatives:**

| Alternative | Why Not |
|-------------|---------|
| Vercel | Serverless limits for background jobs, expensive at scale |
| Render | Good option, slightly more expensive than Railway |
| AWS/GCP | Overkill complexity, higher ops burden |
| Fly.io | Good but Railway simpler for this use case |

**Estimated Total Infrastructure:** $35-120/month (scales with customers)

---

## Integration Libraries

### WhatsApp Business API

| Library | Version | Why | Confidence |
|---------|---------|-----|------------|
| **@WhatsApp/WhatsApp-Nodejs-SDK** | Latest | Official Meta SDK. TypeScript support, maintained by Meta. | HIGH |

**Alternative:** `whatsapp-business-sdk` (community) - more features, but official SDK preferred for stability.

**Required Config:**
- `WA_PHONE_NUMBER_ID`
- `CLOUD_API_ACCESS_TOKEN`

### Google Business Profile API

| Library | Version | Why | Confidence |
|---------|---------|-----|------------|
| **googleapis** | Latest | Official Google client. Includes `@googleapis/mybusinessaccountmanagement`. | HIGH |

**Note:** GBP API requires approval from Google. Submit access request early - can take weeks.

### Voicenter (Israeli VoIP)

| Approach | Why | Confidence |
|----------|-----|------------|
| **REST API + Webhooks** | Voicenter provides REST API and webhook integration. No official npm package - use native fetch/axios. | MEDIUM |

**Resources:**
- API docs: https://www.voicenter.com/API
- GitHub: https://github.com/VoicenterTeam (41 repos, SDK examples)

**Integration Pattern:**
```typescript
// Webhook receiver for missed calls
app.post('/webhooks/voicenter', async (c) => {
  const { callerId, timestamp, status } = await c.req.json()
  if (status === 'missed') {
    await queue.add('send-whatsapp', { phone: callerId })
  }
  return c.json({ received: true })
})
```

### Israeli Accounting (Greeninvoice / iCount)

| Service | API | Notes | Confidence |
|---------|-----|-------|------------|
| **Greeninvoice** | REST API | Official docs: greeninvoice.co.il/api-docs. Open banking license. | MEDIUM |
| **iCount** | REST API v3 | Official docs: apiv3.icount.co.il/docs/iCount. Rate limit: 30 req/min. | MEDIUM |

**Israel E-Invoicing 2026 Compliance:**
- January 2026: Invoices > 10,000 NIS require Tax Authority allocation number
- June 2026: Threshold drops to > 5,000 NIS
- Both Greeninvoice and iCount support this via API

**npm package:** `n8n-nodes-icount` exists for iCount (330 tests, 90% coverage)

### Validation

| Library | Version | Why | Confidence |
|---------|---------|-----|------------|
| **Zod** | 4.3+ | TypeScript-first validation, Hono built-in support, JSON Schema generation, 52k+ npm dependents. | HIGH |

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **date-fns** | 3.x | Date manipulation | Timezone handling, Hebrew date formatting |
| **ioredis** | 5.x | Redis client | BullMQ dependency, direct Redis access |
| **axios** | 1.x | HTTP client | External API calls (Voicenter, accounting) |
| **winston** | 3.x | Logging | Structured production logs |
| **dotenv** | 16.x | Environment config | Local development |
| **helmet** | 7.x | Security headers | Production security |
| **nanoid** | 5.x | ID generation | Shorter than UUID, URL-safe |

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| **Express.js** | Slower, no TypeScript-first design, dated middleware architecture |
| **MongoDB** | Relational data model fits better, PostgreSQL has better multi-tenant tooling |
| **Prisma** | Acceptable but Drizzle is lighter/faster for serverless workloads |
| **Firebase** | Vendor lock-in, expensive at scale, not ideal for Israeli compliance |
| **Supabase (full platform)** | Good for MVPs but more expensive than Neon for DB-only needs |
| **AWS Amplify** | Complex, expensive, overkill |
| **NestJS** | Enterprise complexity without enterprise needs |
| **GraphQL** | REST is simpler for this use case, adds unnecessary complexity |
| **Microservices** | Premature. Start monolith, split later if needed |
| **Kubernetes** | Massive overkill. Railway/Render handles scaling. |

---

## Installation Commands

```bash
# Initialize project
pnpm init

# Core runtime
pnpm add hono @hono/node-server @hono/zod-validator zod

# Database
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit

# Queue & Cache
pnpm add bullmq ioredis

# Authentication
pnpm add @clerk/backend

# Integrations
pnpm add whatsapp googleapis axios

# AI
pnpm add @anthropic-ai/sdk

# Email
pnpm add resend

# Utilities
pnpm add date-fns nanoid winston dotenv helmet

# Dev dependencies
pnpm add -D typescript @types/node tsx vitest
```

---

## Cost Projection

### Infrastructure (Monthly)

| Component | Low Traffic | Medium Traffic | High Traffic |
|-----------|-------------|----------------|--------------|
| Railway (API) | $10 | $30 | $80 |
| Neon (PostgreSQL) | $10 | $25 | $50 |
| Upstash (Redis) | $3 | $10 | $30 |
| Resend (Email) | $0 | $20 | $50 |
| Clerk (Auth) | $0 | $0 | $20 |
| **Total** | **$23** | **$85** | **$230** |

### Per-Customer Cost Analysis

At 350 NIS/month (~$95 USD):
- 100 customers = ~$9,500 revenue, ~$85 infra = 99% margin
- 500 customers = ~$47,500 revenue, ~$150 infra = 99.7% margin
- 1000 customers = ~$95,000 revenue, ~$230 infra = 99.8% margin

**AI costs** (variable based on usage):
- Assume 1000 AI responses/customer/month
- Haiku: ~$0.006/response = $6/customer/month = $6000 at 1000 customers
- Still maintains 93%+ margin

---

## Confidence Assessment

| Component | Confidence | Reasoning |
|-----------|------------|-----------|
| Node.js 24 LTS | HIGH | Official LTS, verified release schedule |
| Hono.js | HIGH | Benchmarked, widely adopted, active development |
| PostgreSQL + Neon | HIGH | Industry standard, verified pricing |
| Drizzle ORM | MEDIUM-HIGH | Strong option, Prisma also valid |
| BullMQ + Upstash | HIGH | Standard pattern, verified |
| Clerk | MEDIUM-HIGH | Good for B2B SaaS, evaluate data residency |
| Claude Haiku | MEDIUM-HIGH | Pricing verified, Hebrew performance needs testing |
| WhatsApp SDK | HIGH | Official Meta SDK |
| GBP API | HIGH | Official Google client |
| Voicenter | MEDIUM | No official SDK, REST API well-documented |
| Greeninvoice/iCount | MEDIUM | Hebrew docs, limited public info on API stability |

---

## Open Questions for Phase-Specific Research

1. **Voicenter webhook reliability** - Test in sandbox before production
2. **Hebrew AI quality** - A/B test Claude vs GPT-4o mini for Hebrew responses
3. **Greeninvoice vs iCount** - Compare API reliability, choose one as primary
4. **GBP API approval timeline** - Submit early, track approval process
5. **Israel e-invoicing integration** - Verify Tax Authority API requirements

---

## Sources

### Official Documentation
- [Node.js Releases](https://nodejs.org/en/about/previous-releases)
- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [WhatsApp Node.js SDK](https://github.com/WhatsApp/WhatsApp-Nodejs-SDK)
- [Google Business Profile API](https://developers.google.com/my-business/content/basic-setup)
- [Neon Pricing](https://neon.tech/pricing)
- [Upstash Pricing](https://upstash.com/pricing)
- [Clerk Documentation](https://clerk.com/docs)
- [Anthropic API Pricing](https://www.anthropic.com/pricing)
- [Resend Documentation](https://resend.com/docs)

### Israeli Services
- [Voicenter API](https://www.voicenter.com/API)
- [Greeninvoice API Docs](https://www.greeninvoice.co.il/api-docs/)
- [iCount API v3](https://apiv3.icount.co.il/docs/iCount/)
- [Israel E-Invoicing Requirements](https://www.gov.il/en/departments/topics/israel-invoice/govil-landing-page)

### Comparisons & Benchmarks
- [BetterStack: Drizzle vs Prisma](https://betterstack.com/community/guides/scaling-nodejs/drizzle-vs-prisma/)
- [BetterStack: Node.js Schedulers](https://betterstack.com/community/guides/scaling-nodejs/best-nodejs-schedulers/)
- [Railway vs Render Comparison](https://northflank.com/blog/railway-vs-render)
- [pnpm Benchmarks](https://pnpm.io/benchmarks)
