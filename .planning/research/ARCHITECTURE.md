# Architecture Patterns

**Domain:** SMB Automation SaaS (Lead Capture, Review Management, GBP Optimization)
**Researched:** 2026-01-27
**Confidence:** HIGH (verified with official documentation and multiple authoritative sources)

## Executive Summary

Findo requires an event-driven, multi-tenant architecture optimized for:
1. **Webhook ingestion** (Voicenter calls, accounting invoices) with queue-first processing
2. **Scheduled background jobs** (review checks, photo requests, posts)
3. **Conversational flows** (WhatsApp chatbot with state management)
4. **External API integration** (Google Business Profile, WhatsApp Business API)
5. **AI text generation** (Hebrew responses via OpenAI/Anthropic)
6. **Real-time dashboard** (activity feeds via Server-Sent Events)

The recommended architecture is a **monolithic backend with queue-based async processing**, hosted on a cost-efficient PaaS, using PostgreSQL with Row-Level Security for multi-tenancy.

---

## Recommended Architecture

```
                                    ┌─────────────────────────────────────┐
                                    │           EXTERNAL SERVICES          │
                                    │  ┌─────────┐ ┌────────┐ ┌─────────┐ │
                                    │  │Voicenter│ │Green-  │ │ iCount  │ │
                                    │  │(Calls)  │ │invoice │ │(Invoices│ │
                                    │  └────┬────┘ └───┬────┘ └────┬────┘ │
                                    └───────┼──────────┼───────────┼──────┘
                                            │          │           │
                                            ▼          ▼           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INGESTION LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Webhook Receiver (Express/Fastify)                 │  │
│  │  • Signature verification        • Idempotency check (event_id)      │  │
│  │  • Enqueue to Redis             • Return 200 in <500ms               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MESSAGE QUEUE                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         Redis + BullMQ                                │  │
│  │  Queues:                                                              │  │
│  │  • webhooks.voicenter    • webhooks.accounting   • conversations      │  │
│  │  • scheduled.reviews     • scheduled.photos      • scheduled.posts    │  │
│  │  • notifications         • ai.generation         • gbp.operations     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              WORKER LAYER                                    │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│  │  Webhook       │ │ Conversation   │ │  Scheduled     │ │ Notification │ │
│  │  Workers       │ │ Workers        │ │  Workers       │ │ Workers      │ │
│  │  • Process     │ │ • Chatbot      │ │ • Cron-based   │ │ • WhatsApp   │ │
│  │    events      │ │   state        │ │   triggers     │ │ • SMS        │ │
│  │  • Trigger     │ │ • AI prompts   │ │ • Review check │ │ • Push       │ │
│  │    flows       │ │ • Lead save    │ │ • Photo req    │ │              │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CORE SERVICES                                   │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│  │  Tenant        │ │  Lead          │ │  Review        │ │ GBP          │ │
│  │  Service       │ │  Service       │ │  Service       │ │ Service      │ │
│  │  • CRUD        │ │ • Create/Read  │ │ • Fetch new    │ │ • API calls  │ │
│  │  • Settings    │ │ • Status       │ │ • Auto-reply   │ │ • Photos     │ │
│  │  • Tokens      │ │ • Handoff      │ │ • Monitoring   │ │ • Posts      │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └──────────────┘ │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│  │  Conversation  │ │  AI            │ │  Token         │ │ Metrics      │ │
│  │  Service       │ │  Service       │ │  Vault         │ │ Service      │ │
│  │  • State mgmt  │ │ • Hebrew gen   │ │ • OAuth tokens │ │ • Stats      │ │
│  │  • Flow logic  │ │ • Templates    │ │ • API keys     │ │ • Trends     │ │
│  │  • History     │ │ • Prompts      │ │ • Encryption   │ │ • Alerts     │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL (Supabase)                              │  │
│  │  • Row-Level Security (tenant_id on every table)                      │  │
│  │  • Encrypted columns for tokens/secrets                               │  │
│  │  • Realtime subscriptions for dashboard                               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Redis (Upstash)                                    │  │
│  │  • Job queues (BullMQ)     • Conversation state cache                 │  │
│  │  • Idempotency keys        • Rate limiting                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API / UI LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    REST API (Express/Fastify)                         │  │
│  │  • Authentication (JWT + tenant context)                              │  │
│  │  • Dashboard endpoints      • Settings endpoints                      │  │
│  │  • Webhook endpoints        • Admin endpoints                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    SSE Endpoint (/events)                             │  │
│  │  • Activity feed updates    • Real-time notifications                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Frontend (Next.js / React)                         │  │
│  │  • Dashboard SPA            • Setup wizard                            │  │
│  │  • Hebrew RTL UI            • Mobile-responsive                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL APIs                                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐  │
│  │  WhatsApp   │ │  Google     │ │  OpenAI /   │ │  SMS Provider       │  │
│  │  Business   │ │  Business   │ │  Anthropic  │ │  (Nexmo/Twilio)     │  │
│  │  API        │ │  Profile    │ │  API        │ │                     │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Boundaries

| Component | Responsibility | Communicates With | Data Owned |
|-----------|---------------|-------------------|------------|
| **Webhook Receiver** | Validate signatures, enqueue events, return 200 fast | Redis queues, external webhooks | None (stateless) |
| **BullMQ Queues** | Job persistence, scheduling, retries, DLQ | All workers | Job state in Redis |
| **Webhook Workers** | Process call/invoice events, trigger flows | Queues, Core Services | None |
| **Conversation Workers** | Manage chatbot state, AI prompts, lead creation | Queues, AI Service, Lead Service | Conversation state |
| **Scheduled Workers** | Run cron jobs (review check, photo request, posts) | Queues, GBP Service, Notification Service | Scheduler state |
| **Notification Workers** | Send WhatsApp/SMS to business owners | Queues, WhatsApp API, SMS API | Message logs |
| **Tenant Service** | Business CRUD, settings, onboarding | Database, Token Vault | Business profiles |
| **Lead Service** | Create/read/update leads, handoff logic | Database, Notification Service | Leads |
| **Review Service** | Fetch reviews, generate replies, monitoring | GBP API, AI Service, Database | Review history |
| **GBP Service** | Google Business Profile API wrapper | GBP API, Token Vault | GBP operation logs |
| **Conversation Service** | Chatbot flow logic, state management | Database, Redis cache | Conversations |
| **AI Service** | Hebrew text generation, prompt management | OpenAI/Anthropic API | Prompts, templates |
| **Token Vault** | OAuth token storage, refresh, encryption | Database (encrypted) | OAuth tokens, API keys |
| **Metrics Service** | Stats aggregation, trend analysis, alerts | Database | Metrics snapshots |

---

## Data Flow Diagrams

### Flow 1: Missed Call to Lead Capture

```
1. Voicenter                    2. Webhook Receiver           3. Redis Queue
   ┌─────────┐                     ┌─────────────┐              ┌─────────┐
   │ Missed  │──webhook POST───▶│ Validate    │──enqueue───▶│webhooks │
   │ Call    │                     │ Return 200  │              │.voicenter│
   └─────────┘                     └─────────────┘              └────┬────┘
                                                                      │
                                      ┌───────────────────────────────┘
                                      ▼
4. Webhook Worker              5. Delay (2 min)             6. WhatsApp Worker
   ┌─────────────┐                ┌─────────────┐              ┌─────────────┐
   │ Parse call  │──schedule──▶│ BullMQ      │──trigger──▶│ Send intro  │
   │ Find tenant │   delay        │ delayed job │              │ message     │
   └─────────────┘                └─────────────┘              └──────┬──────┘
                                                                       │
7. Customer Reply              8. Conversation Worker        9. Lead Service
   ┌─────────────┐                ┌─────────────┐              ┌─────────────┐
   │ WhatsApp    │──webhook───▶│ Process     │──create───▶│ Save lead   │
   │ message     │                │ chatbot flow│              │ Notify owner│
   └─────────────┘                └─────────────┘              └─────────────┘
```

### Flow 2: Invoice to Review Request

```
1. Greeninvoice               2. Webhook Receiver           3. Webhook Worker
   ┌─────────────┐               ┌─────────────┐              ┌─────────────┐
   │ document.   │──webhook──▶│ Validate    │──process──▶│ Parse       │
   │ created     │               │ Enqueue     │              │ customer    │
   └─────────────┘               └─────────────┘              └──────┬──────┘
                                                                      │
4. BullMQ Scheduler            5. Review Request Worker      6. Reminder Worker
   ┌─────────────┐               ┌─────────────────┐           ┌─────────────┐
   │ Delay 24h   │──trigger──▶│ Send WhatsApp   │──if no ──▶│ Send 1      │
   │             │               │ with review link│  review   │ reminder    │
   └─────────────┘               └─────────────────┘   (3d)    └─────────────┘
```

### Flow 3: Hourly Review Check

```
1. BullMQ Cron                2. Review Service             3. Per-Tenant Loop
   ┌─────────────┐               ┌─────────────┐              ┌─────────────┐
   │ Every hour  │──trigger──▶│ Get all      │──foreach──▶│ Fetch GBP   │
   │ pattern     │               │ tenants      │              │ reviews     │
   └─────────────┘               └─────────────┘              └──────┬──────┘
                                                                      │
4. New Review Found            5. AI Service                 6. GBP Service
   ┌───────────────┐              ┌─────────────┐              ┌─────────────┐
   │ 4-5 stars:    │──generate─▶│ Hebrew      │──post────▶│ Reply API   │
   │ auto-reply    │   reply      │ response    │              │             │
   └───────────────┘              └─────────────┘              └─────────────┘
   │ 1-3 stars:    │
   │ notify owner  │──send────▶ WhatsApp with draft
   └───────────────┘
```

### Flow 4: Dashboard Real-time Feed

```
1. Any Event                  2. Event Emitter              3. SSE Endpoint
   ┌─────────────┐               ┌─────────────┐              ┌─────────────┐
   │ Lead saved  │──emit──────▶│ Publish to  │──stream───▶│ Push to     │
   │ Review recv │   event       │ tenant chan │              │ connected   │
   │ Call missed │               │             │              │ clients     │
   └─────────────┘               └─────────────┘              └──────┬──────┘
                                                                      │
4. Frontend                                                           ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │ EventSource('/api/events')                                          │
   │ • onmessage → update activity feed                                  │
   │ • Reconnect with last-event-id for catchup                          │
   └─────────────────────────────────────────────────────────────────────┘
```

---

## Patterns to Follow

### Pattern 1: Queue-First Webhook Processing

**What:** Never process webhooks synchronously. Validate, enqueue, return 200.

**When:** All external webhook endpoints (Voicenter, Greeninvoice, WhatsApp, iCount).

**Why:**
- External providers timeout (10-30 seconds typically)
- Prevents lost events during processing failures
- Enables retry logic with exponential backoff
- Decouples ingestion from processing (scale independently)

**Example:**
```typescript
// webhook-receiver.ts
app.post('/webhooks/voicenter', async (req, res) => {
  // 1. Verify signature
  if (!verifyVoicenterSignature(req)) {
    return res.status(401).send('Invalid signature');
  }

  // 2. Check idempotency
  const eventId = req.body.event_id;
  if (await redis.exists(`idempotency:voicenter:${eventId}`)) {
    return res.status(200).send('Already processed');
  }

  // 3. Enqueue (fast)
  await voicenterQueue.add('missed-call', req.body, {
    jobId: eventId,
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 }
  });

  // 4. Set idempotency key
  await redis.set(`idempotency:voicenter:${eventId}`, '1', 'EX', 86400);

  // 5. Return immediately
  res.status(200).send('OK');
});
```

### Pattern 2: Tenant Context Middleware

**What:** Extract and inject tenant context into every request/job.

**When:** All API requests, all background jobs.

**Why:**
- Enforces data isolation
- Simplifies service code (no tenant lookups)
- Works with PostgreSQL RLS

**Example:**
```typescript
// tenant-middleware.ts
const tenantMiddleware = async (req, res, next) => {
  const tenantId = extractTenantFromJWT(req);

  // Set RLS context for database queries
  await db.raw(`SET app.current_tenant = '${tenantId}'`);

  req.tenant = await tenantService.getById(tenantId);
  next();
};

// worker-tenant-context.ts
const processorWithTenant = (handler) => async (job) => {
  const tenantId = job.data.tenantId;
  await db.raw(`SET app.current_tenant = '${tenantId}'`);
  return handler(job);
};
```

### Pattern 3: Conversation State Machine

**What:** Model chatbot conversations as state machines with persistence.

**When:** WhatsApp lead capture flow, any multi-turn conversation.

**Why:**
- Handles dropped messages gracefully
- Easy to add/modify conversation steps
- Testable in isolation
- Survives worker restarts

**Example:**
```typescript
// conversation-state.ts
const leadCaptureStates = {
  INITIAL: {
    onEnter: async (ctx) => {
      await sendWhatsApp(ctx.phone, 'שלום! זה Findo. איך אוכל לעזור?');
    },
    transitions: {
      MESSAGE_RECEIVED: 'COLLECTING_NAME'
    }
  },
  COLLECTING_NAME: {
    onEnter: async (ctx) => {
      await sendWhatsApp(ctx.phone, 'מה שמך?');
    },
    onMessage: async (ctx, message) => {
      ctx.data.name = message;
    },
    transitions: {
      MESSAGE_RECEIVED: 'COLLECTING_NEED'
    }
  },
  COLLECTING_NEED: {
    onEnter: async (ctx) => {
      await sendWhatsApp(ctx.phone, 'מה אתה צריך?');
    },
    onMessage: async (ctx, message) => {
      ctx.data.need = message;
    },
    transitions: {
      MESSAGE_RECEIVED: 'COMPLETE'
    }
  },
  COMPLETE: {
    onEnter: async (ctx) => {
      await leadService.create(ctx.data);
      await notifyOwner(ctx.tenantId, ctx.data);
      await sendWhatsApp(ctx.phone, 'תודה! ניצור איתך קשר בהקדם.');
    }
  }
};
```

### Pattern 4: Token Refresh with Proactive Renewal

**What:** Refresh OAuth tokens before they expire, not when they fail.

**When:** Google Business Profile tokens (1-hour lifespan), any OAuth integration.

**Why:**
- Prevents failed API calls during token refresh race
- Handles clock skew gracefully
- Better UX (no sudden failures)

**Example:**
```typescript
// token-vault.ts
class TokenVault {
  async getAccessToken(tenantId: string, provider: 'google' | 'whatsapp') {
    const token = await this.getFromDb(tenantId, provider);

    // Refresh if expiring in next 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    if (token.expiresAt - Date.now() < fiveMinutes) {
      return this.refreshToken(tenantId, provider, token.refreshToken);
    }

    return token.accessToken;
  }

  private async refreshToken(tenantId, provider, refreshToken) {
    // Use mutex to prevent concurrent refreshes
    const lockKey = `token-refresh:${tenantId}:${provider}`;
    const lock = await redis.set(lockKey, '1', 'NX', 'EX', 30);

    if (!lock) {
      // Another process is refreshing, wait and retry
      await sleep(1000);
      return this.getAccessToken(tenantId, provider);
    }

    try {
      const newToken = await this.callRefreshEndpoint(provider, refreshToken);
      await this.saveToDb(tenantId, provider, newToken);
      return newToken.accessToken;
    } finally {
      await redis.del(lockKey);
    }
  }
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Synchronous Webhook Processing

**What:** Processing webhook logic before returning 200.

**Why bad:**
- Provider timeouts cause duplicate deliveries
- Failures lose events permanently
- Can't scale ingestion vs processing independently
- Single slow webhook blocks others

**Instead:** Queue-first pattern (see above).

### Anti-Pattern 2: Polling for GBP Reviews

**What:** Checking every tenant's reviews on every interval.

**Why bad:**
- GBP API has 10 edits/minute rate limit
- With 100 tenants, polling every minute = 100 API calls/minute
- Wastes API quota on unchanged data
- Expensive at scale

**Instead:**
- Batch tenant checks (spread across hour)
- Track last-check timestamps
- Use exponential backoff for inactive businesses
- Consider review webhooks if GBP ever supports them

### Anti-Pattern 3: JWT with Sensitive Data

**What:** Storing OAuth tokens or API keys in JWTs.

**Why bad:**
- JWTs are base64-encoded, not encrypted
- Tokens in localStorage are XSS-vulnerable
- Can't revoke individual tokens
- Token theft = account compromise

**Instead:**
- Store only tenant_id and user_id in JWT
- Keep OAuth tokens server-side in encrypted database columns
- Use short-lived JWTs (15 min) with refresh rotation

### Anti-Pattern 4: Shared Database Connections Per Request

**What:** Creating new database connections for each API request.

**Why bad:**
- Connection setup is expensive (SSL handshake, auth)
- Can exhaust database connection limits
- Slows down request latency

**Instead:**
- Use connection pooling (PgBouncer, Supabase built-in)
- Configure pool size based on worker count
- Set session-level RLS context, not per-query

---

## Multi-Tenancy Implementation

### Recommended: Shared Database with Row-Level Security

**Why this approach:**
- Findo targets hundreds of SMBs, not enterprise clients
- No regulatory requirements (HIPAA, PCI) for separate databases
- Simplest to maintain and cheapest to operate
- PostgreSQL RLS is battle-tested and performant

**Implementation:**

```sql
-- Enable RLS on all tenant tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY tenant_isolation ON leads
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Repeat for all tables
```

**Tenant Resolution:**
```typescript
// From JWT claim (dashboard API)
const tenantId = jwt.decode(req.headers.authorization).tenant_id;

// From webhook data (external integrations)
const tenantId = await findTenantByPhoneNumber(req.body.phone);
const tenantId = await findTenantByGreenvoiceAccountId(req.body.account_id);
```

---

## Scaling Considerations

| Concern | 10 Tenants | 100 Tenants | 1,000 Tenants | 10,000 Tenants |
|---------|------------|-------------|---------------|----------------|
| **Database** | Single Supabase instance | Single instance, add read replicas | Consider sharding or schema-per-tenant for high-value | Shard by tenant range |
| **Background Jobs** | Single worker | 2-3 workers | Dedicated worker per queue type | Kubernetes autoscaling |
| **Webhooks** | Single receiver | Single receiver | Multiple receivers behind load balancer | Serverless functions |
| **GBP API Calls** | Direct polling | Batched with delays | Distributed across time windows | Consider GBP partner API |
| **Redis** | Single Upstash instance | Upstash Pro | Redis Cluster | Regional Redis clusters |
| **AI Calls** | OpenAI API direct | OpenAI API with rate limiting | Batch and queue AI requests | Consider self-hosted models |

### Early Optimizations (Build Now)

1. **Queue-first webhook processing** - Essential from day one
2. **Connection pooling** - Prevent database exhaustion
3. **Idempotency keys** - Handle duplicate webhooks
4. **Tenant context middleware** - Enforce isolation

### Deferred Optimizations (Build When Needed)

1. **Read replicas** - When dashboard queries slow down
2. **Worker autoscaling** - When queue depth grows
3. **Caching layer** - When same data fetched repeatedly
4. **CDN for dashboard** - When user count grows significantly

---

## Build Order (Dependencies)

The architecture components have dependencies that determine build order:

```
Phase 1: Foundation
├── PostgreSQL schema + RLS policies
├── Redis setup (Upstash)
├── Authentication (JWT + tenant context)
└── Basic API structure

Phase 2: Core Infrastructure
├── BullMQ queue setup
├── Worker framework
├── Token Vault (encrypted storage)
└── Webhook receiver pattern

Phase 3: External Integrations (parallel)
├── WhatsApp Business API integration
├── Google Business Profile API integration
├── Voicenter webhook handler
└── Greeninvoice webhook handler

Phase 4: Business Logic
├── Conversation state machine
├── Lead capture flow
├── Review request flow
└── Review auto-reply flow

Phase 5: AI & Automation
├── AI service (Hebrew generation)
├── Scheduled jobs (review check, photo request, posts)
└── Optimization loop

Phase 6: Dashboard
├── SSE endpoint for real-time
├── Dashboard API endpoints
├── Frontend application
└── Setup wizard
```

**Rationale:**
- Foundation must come first (database, auth, basic API)
- Queue infrastructure enables async processing for everything else
- External integrations can be built in parallel once webhook pattern exists
- Business logic depends on integrations being connected
- Dashboard depends on business logic generating data to display

---

## Cost Analysis

### Infrastructure Costs (Monthly Estimates)

| Component | Provider | Free Tier | Growth (~100 tenants) | Scale (~1000 tenants) |
|-----------|----------|-----------|----------------------|----------------------|
| **Database** | Supabase | Free (500MB, 50K auth) | Pro $25/mo | Pro $25 + usage |
| **Redis** | Upstash | Free (10K commands/day) | Pay-as-you-go ~$10/mo | Pro ~$50/mo |
| **Backend Hosting** | Railway | $5/mo credit | ~$20/mo | ~$100/mo |
| **Frontend Hosting** | Vercel | Free | Free | Pro $20/mo |
| **AI (OpenAI)** | OpenAI | Pay-as-you-go | ~$30/mo (GPT-4o-mini) | ~$200/mo |
| **WhatsApp** | Meta | Pay-per-conversation | ~$50/mo | ~$300/mo |
| **SMS** | Twilio/Nexmo | Pay-per-message | ~$20/mo | ~$100/mo |
| **Total** | | ~$5/mo | ~$155/mo | ~$795/mo |

**Cost Efficiency Notes:**
- Use GPT-4o-mini for Hebrew generation (10x cheaper than GPT-4)
- WhatsApp conversations (24h window) cheaper than individual messages
- Batch AI requests where possible (daily summaries vs real-time)
- Supabase includes auth, storage, realtime - no separate services needed

### Cost per Tenant

| Scale | Monthly Cost | Cost/Tenant | Revenue/Tenant | Gross Margin |
|-------|--------------|-------------|----------------|--------------|
| 10 tenants | ~$50 | $5 | 350 NIS (~$95) | 95% |
| 100 tenants | ~$155 | $1.55 | 350 NIS (~$95) | 98% |
| 1000 tenants | ~$795 | $0.80 | 350 NIS (~$95) | 99% |

---

## Technology Recommendations

| Layer | Recommendation | Why |
|-------|---------------|-----|
| **Runtime** | Node.js 20+ with TypeScript | Event-driven, excellent for I/O-heavy workloads, typed safety |
| **Framework** | Fastify or NestJS | Fastify: faster, lighter. NestJS: more structured for larger teams |
| **Database** | Supabase (PostgreSQL) | Built-in RLS, auth, realtime, generous free tier |
| **Queue** | BullMQ + Redis (Upstash) | Best Node.js queue library, excellent scheduler support |
| **Frontend** | Next.js 14+ | Server components, App Router, excellent RTL support |
| **Hosting** | Railway (backend) + Vercel (frontend) | Simple, usage-based pricing, great DX |
| **AI** | OpenAI API (GPT-4o-mini) | Best Hebrew support, cost-effective for generation |
| **Monitoring** | Sentry + Upstash QStash dashboard | Error tracking + queue visibility |

---

## Sources

- [Multi-Tenant SaaS Architecture on AWS](https://www.clickittech.com/software-development/multi-tenant-architecture/) - MEDIUM confidence
- [BullMQ Documentation - Job Schedulers](https://docs.bullmq.io/guide/job-schedulers) - HIGH confidence (official docs)
- [Webhook Best Practices - Hookdeck](https://hookdeck.com/blog/webhooks-at-scale) - MEDIUM confidence
- [SSE vs WebSockets 2026](https://www.nimbleway.com/blog/server-sent-events-vs-websockets-what-is-the-difference-2026-guide) - MEDIUM confidence
- [Supabase Multi-Tenancy with RLS](https://www.antstack.com/blog/multi-tenant-applications-with-rls-on-supabase-postgress/) - HIGH confidence
- [Auth0 Token Storage](https://auth0.com/docs/secure/security-guidance/data-security/token-storage) - HIGH confidence (official docs)
- [OAuth 2.1 Features 2026](https://rgutierrez2004.medium.com/oauth-2-1-features-you-cant-ignore-in-2026-a15f852cb723) - MEDIUM confidence
- [Railway vs Render 2026](https://northflank.com/blog/railway-vs-render) - MEDIUM confidence
- [Google Business Profile APIs](https://developers.google.com/my-business) - HIGH confidence (official docs)
- [WhatsApp Business API Node.js SDK](https://whatsapp.github.io/WhatsApp-Nodejs-SDK/) - HIGH confidence (official docs)

---

## Quality Gate Checklist

- [x] Components clearly defined with boundaries
- [x] Data flow direction explicit (4 flow diagrams included)
- [x] Build order implications noted (6 phases with dependencies)
- [x] Cost implications for hosting/infrastructure (detailed breakdown by scale)
