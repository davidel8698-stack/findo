# Architecture Patterns

**Domain:** Multi-tenant SaaS for Israeli SMBs (Findo)
**Researched:** 2026-01-27
**Confidence:** HIGH (patterns verified with official documentation and multiple sources)

---

## Executive Summary

Findo requires a **modular monolith architecture** that can evolve toward microservices as scale demands. The system has three primary integration boundaries (webhook receivers, external API clients, job processors) that communicate through a Redis-backed message queue. PostgreSQL with Row-Level Security provides tenant isolation at the database level, while the application layer enforces tenant context on every request.

---

## System Architecture Overview

```
                                    +------------------+
                                    |   Hebrew RTL     |
                                    |   Web Frontend   |
                                    |   (Next.js)      |
                                    +--------+---------+
                                             |
                                             | HTTPS
                                             v
+------------------+              +---------------------+              +------------------+
|   External       |   Webhooks  |                     |   REST/WS    |   Real-time      |
|   Services       +------------>+    API Gateway      +<------------>+   Notifications  |
|                  |             |    (Express/Hono)   |              |   (SSE/Socket)   |
| - Voicenter      |             +----------+----------+              +------------------+
| - Meta WhatsApp  |                        |
| - Google Reviews |                        |
+------------------+                        v
                               +------------------------+
                               |    Application Core    |
                               |------------------------|
                               | - Tenant Context       |
                               | - Auth/AuthZ (JWT)     |
                               | - Business Logic       |
                               | - Domain Services      |
                               +------------+-----------+
                                            |
              +-----------------------------+-----------------------------+
              |                             |                             |
              v                             v                             v
   +------------------+          +------------------+          +------------------+
   |   PostgreSQL     |          |      Redis       |          |   External APIs  |
   |------------------|          |------------------|          |------------------|
   | - Tenant Data    |          | - Job Queues     |          | - WhatsApp Send  |
   | - OAuth Tokens   |          | - Cache          |          | - Email (SMTP)   |
   | - Job History    |          | - Sessions       |          | - Google APIs    |
   | - RLS Policies   |          | - Rate Limits    |          | - Israeli Invoice|
   +------------------+          +------------------+          +------------------+
                                            |
                                            v
                               +------------------------+
                               |    BullMQ Workers      |
                               |------------------------|
                               | - Webhook Processor    |
                               | - Real-time Jobs       |
                               | - Daily Optimizer      |
                               | - Weekly Optimizer     |
                               | - Monthly Optimizer    |
                               +------------------------+
```

---

## Component Responsibilities

| Component | Responsibility | Communicates With | Technology |
|-----------|---------------|-------------------|------------|
| **Web Frontend** | Hebrew RTL UI, tenant dashboard, user interactions | API Gateway via HTTPS | Next.js 14+, Tailwind CSS, RTL support |
| **API Gateway** | Request routing, auth, tenant context, rate limiting | Frontend, Webhook Receivers, App Core | Express.js or Hono |
| **Webhook Receivers** | Ingest external events (Voicenter, Meta, Google) | API Gateway, Redis Queues | Express routes with signature verification |
| **Application Core** | Business logic, domain services, data access | All components | TypeScript, Prisma ORM |
| **PostgreSQL** | Persistent storage with tenant isolation | App Core, Workers | PostgreSQL 15+ with RLS |
| **Redis** | Job queues, caching, sessions, rate limiting | App Core, Workers, API Gateway | Redis 7+ |
| **BullMQ Workers** | Background job processing across 4 time scales | Redis, PostgreSQL, External APIs | BullMQ with Node.js workers |
| **OAuth Token Manager** | Encrypted token storage, auto-refresh | PostgreSQL, External APIs | Custom service with AES-256 |
| **Notification Service** | Real-time updates to connected clients | Redis pub/sub, Frontend | Server-Sent Events (SSE) |

---

## Recommended Project Structure

```
findo/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/                      # App router
│   │   │   ├── [locale]/             # i18n with Hebrew default
│   │   │   ├── (dashboard)/          # Protected tenant routes
│   │   │   └── api/                  # BFF endpoints (if needed)
│   │   ├── components/
│   │   │   ├── ui/                   # RTL-aware base components
│   │   │   └── features/             # Domain-specific components
│   │   └── lib/
│   │       ├── i18n/                 # Hebrew translations
│   │       └── api-client/           # Type-safe API client
│   │
│   └── api/                          # Backend API server
│       ├── src/
│       │   ├── app.ts                # Express/Hono app setup
│       │   ├── config/               # Environment, constants
│       │   ├── middleware/
│       │   │   ├── auth.ts           # JWT verification
│       │   │   ├── tenant-context.ts # Tenant injection
│       │   │   ├── rate-limit.ts     # Per-tenant rate limiting
│       │   │   └── error-handler.ts
│       │   ├── routes/
│       │   │   ├── webhooks/         # Webhook receivers
│       │   │   │   ├── voicenter.ts
│       │   │   │   ├── whatsapp.ts
│       │   │   │   └── google.ts
│       │   │   ├── auth/             # Authentication routes
│       │   │   ├── tenants/          # Tenant management
│       │   │   └── api/              # Business API routes
│       │   ├── services/
│       │   │   ├── oauth/            # OAuth token management
│       │   │   ├── whatsapp/         # WhatsApp Business API
│       │   │   ├── google/           # Google Business Profile
│       │   │   └── notifications/    # SSE notification service
│       │   ├── domain/
│       │   │   ├── tenants/          # Tenant domain logic
│       │   │   ├── messages/         # Message handling
│       │   │   ├── calls/            # Call tracking
│       │   │   └── reviews/          # Review management
│       │   └── infrastructure/
│       │       ├── database/         # Prisma client, RLS setup
│       │       ├── queue/            # BullMQ setup
│       │       ├── cache/            # Redis caching
│       │       └── encryption/       # AES-256 token encryption
│       └── workers/
│           ├── webhook-processor.ts  # Real-time webhook handling
│           ├── daily-optimizer.ts    # Daily batch jobs
│           ├── weekly-optimizer.ts   # Weekly analytics
│           └── monthly-optimizer.ts  # Monthly reports
│
├── packages/
│   ├── shared/                       # Shared types, utils
│   │   ├── types/                    # TypeScript interfaces
│   │   ├── validators/               # Zod schemas
│   │   └── constants/                # Shared constants
│   └── database/                     # Prisma schema, migrations
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── seed/
│
├── docker/
│   ├── docker-compose.yml            # Local development
│   ├── Dockerfile.api
│   └── Dockerfile.worker
│
└── docs/
    └── architecture/                  # ADRs, diagrams
```

---

## Data Flow Diagrams

### 1. Webhook Ingestion Flow

```
External Service                    Findo System
     |                                   |
     |  POST /webhooks/{provider}        |
     +---------------------------------->|
     |                                   |
     |  1. Verify signature              |
     |  2. Parse raw body                |
     |  3. Extract tenant_id             |
     |  4. Enqueue to Redis              |
     |                                   |
     |  200 OK (within 3 seconds)        |
     |<----------------------------------+
     |                                   |
                                         |
                              +----------v-----------+
                              |   BullMQ Queue       |
                              |   webhooks:{type}    |
                              +----------+-----------+
                                         |
                              +----------v-----------+
                              |   Webhook Worker     |
                              |                      |
                              | 1. Process payload   |
                              | 2. Update database   |
                              | 3. Trigger actions   |
                              | 4. Send notifications|
                              +----------------------+
```

**Critical points:**
- Respond to webhook within 3-5 seconds (acknowledge, don't process inline)
- Verify signatures before any processing (HMAC for Meta, ED25519 for Voicenter)
- Use raw body for signature verification (not parsed JSON)
- Idempotency: store webhook IDs to prevent duplicate processing

### 2. Multi-Tenant Request Flow

```
                    +-------------------+
                    |   HTTP Request    |
                    | Authorization: JWT|
                    +--------+----------+
                             |
                             v
                    +-------------------+
                    |   Auth Middleware |
                    | - Verify JWT      |
                    | - Extract user_id |
                    | - Extract tenant_id|
                    +--------+----------+
                             |
                             v
                    +-------------------+
                    | Tenant Context MW |
                    | - Load tenant     |
                    | - Check status    |
                    | - Set DB context  |
                    +--------+----------+
                             |
                             v
                    +-------------------+
                    |   PostgreSQL      |
                    | SET app.tenant_id |
                    | = '{tenant_uuid}' |
                    +--------+----------+
                             |
                             v
                    +-------------------+
                    |   RLS Policies    |
                    | WHERE tenant_id = |
                    | current_setting   |
                    | ('app.tenant_id') |
                    +-------------------+
```

**Tenant context propagation:**
1. JWT contains `tenant_id` claim
2. Middleware extracts and validates tenant
3. Database session variable set before queries
4. RLS policies automatically filter all queries

### 3. OAuth Token Refresh Flow

```
+------------------+     +------------------+     +------------------+
|   Cron Job       |     |   Token Manager  |     |   External API   |
|   (every 30min)  |     |                  |     |   (Google/Meta)  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         | Check expiring tokens  |                        |
         +----------------------->|                        |
         |                        |                        |
         |  Tokens expiring in    |                        |
         |  < 1 hour              |                        |
         |<-----------------------+                        |
         |                        |                        |
         | For each token:        |                        |
         |                        |                        |
         |  1. Decrypt token      |                        |
         +----------------------->|                        |
         |                        |                        |
         |  2. Request refresh    |                        |
         |                        +----------------------->|
         |                        |                        |
         |                        |  New access_token      |
         |                        |  (maybe new refresh)   |
         |                        |<-----------------------+
         |                        |                        |
         |  3. Encrypt & store    |                        |
         |<-----------------------+                        |
         |                        |                        |
```

**Token security:**
- Tokens encrypted at rest with AES-256-GCM
- Encryption key from environment variable (not in code)
- Separate key per tenant optional for enterprise tier
- Audit log of all token operations

### 4. Background Job Scheduling (4-Level Optimization Loop)

```
+------------------+------------------+------------------+------------------+
|   REAL-TIME      |     DAILY        |     WEEKLY       |    MONTHLY       |
|   (immediate)    |   (3:00 AM IL)   |  (Sunday 4 AM)   | (1st of month)   |
+--------+---------+--------+---------+--------+---------+--------+---------+
         |                  |                  |                  |
    Webhook events     Aggregate         Trend analysis    Business reports
    Message routing    Daily metrics     Performance KPIs  Billing cycles
    Call handling      Token refresh     Usage patterns    Data retention
    Quick responses    Cache warming     Optimization      Archive old data
         |                  |                  |                  |
         v                  v                  v                  v
+------------------+------------------+------------------+------------------+
|   Queue:         |   Queue:         |   Queue:         |   Queue:         |
|   realtime       |   daily-batch    |   weekly-batch   |   monthly-batch  |
|   Concurrency: 10|   Concurrency: 5 |   Concurrency: 3 |   Concurrency: 2 |
|   Priority: HIGH |   Priority: MED  |   Priority: LOW  |   Priority: LOW  |
+------------------+------------------+------------------+------------------+
```

**BullMQ Job Scheduler Configuration:**

```typescript
// Real-time: event-driven, no schedule
await realTimeQueue.add('process-webhook', data);

// Daily: 3:00 AM Israel time (UTC+2/+3)
await queue.upsertJobScheduler('daily-optimizer', {
  pattern: '0 0 3 * * *',
  tz: 'Asia/Jerusalem'
});

// Weekly: Sunday 4:00 AM Israel time
await queue.upsertJobScheduler('weekly-optimizer', {
  pattern: '0 0 4 * * 0',
  tz: 'Asia/Jerusalem'
});

// Monthly: 1st of month, 5:00 AM Israel time
await queue.upsertJobScheduler('monthly-optimizer', {
  pattern: '0 0 5 1 * *',
  tz: 'Asia/Jerusalem'
});
```

---

## Database Schema (Key Tables)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    tenants      │     │     users       │     │  oauth_tokens   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │←───┐│ id (PK)         │     │ id (PK)         │
│ name            │    ││ tenant_id (FK)  │────→│ tenant_id (FK)  │
│ subdomain       │    ││ email           │     │ provider        │
│ plan            │    ││ role            │     │ access_token_enc│
│ status          │    ││ created_at      │     │ refresh_token_enc│
│ settings (JSON) │    │└─────────────────┘     │ expires_at      │
│ created_at      │    │                        │ scopes          │
└─────────────────┘    │                        └─────────────────┘
                       │
┌─────────────────┐    │┌─────────────────┐     ┌─────────────────┐
│   messages      │    ││     calls       │     │   reviews       │
├─────────────────┤    │├─────────────────┤     ├─────────────────┤
│ id (PK)         │    ││ id (PK)         │     │ id (PK)         │
│ tenant_id (FK)  │────┘│ tenant_id (FK)  │────→│ tenant_id (FK)  │
│ wa_message_id   │     │ voicenter_id    │     │ google_review_id│
│ direction       │     │ direction       │     │ rating          │
│ contact_phone   │     │ caller_phone    │     │ text            │
│ content         │     │ duration        │     │ response        │
│ status          │     │ recording_url   │     │ responded_at    │
│ created_at      │     │ created_at      │     │ created_at      │
└─────────────────┘     └─────────────────┘     └─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   job_history   │     │ webhook_events  │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ tenant_id (FK)  │     │ tenant_id (FK)  │
│ job_type        │     │ provider        │
│ status          │     │ event_id        │  ← Idempotency key
│ started_at      │     │ event_type      │
│ completed_at    │     │ payload (JSON)  │
│ error           │     │ processed       │
│ metadata (JSON) │     │ created_at      │
└─────────────────┘     └─────────────────┘
```

**Row-Level Security Policy (Example):**

```sql
-- Enable RLS on all tenant tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages FORCE ROW LEVEL SECURITY;

-- Policy: Tenants can only see their own data
CREATE POLICY tenant_isolation ON messages
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Application sets context before each request
SET app.tenant_id = 'tenant-uuid-here';
```

---

## Real-Time Notification Architecture

```
                              +-----------------------+
                              |   Event Producer      |
                              |   (Webhook Worker,    |
                              |    API Handler)       |
                              +-----------+-----------+
                                          |
                                          | PUBLISH
                                          v
                              +-----------------------+
                              |   Redis Pub/Sub       |
                              |   Channel:            |
                              |   notifications:{tid} |
                              +-----------+-----------+
                                          |
                                          | SUBSCRIBE
                                          v
                              +-----------------------+
                              |   SSE Server          |
                              |   Per-Tenant Streams  |
                              +-----------+-----------+
                                          |
                        +-----------------+------------------+
                        |                                    |
                        v                                    v
              +-------------------+              +-------------------+
              |   Browser Tab 1   |              |   Browser Tab 2   |
              |   EventSource     |              |   EventSource     |
              |   /events/{tid}   |              |   /events/{tid}   |
              +-------------------+              +-------------------+
```

**Why SSE over WebSockets:**
- Simpler architecture (no persistent connection management)
- Works with standard HTTP infrastructure (load balancers, proxies)
- Automatic reconnection built into EventSource API
- Sufficient for server-to-client notifications (Findo doesn't need bidirectional)
- 40-60% lower infrastructure cost at scale

---

## External Integration Boundaries

### Webhook Receivers (Inbound)

| Provider | Endpoint | Signature Method | Payload Format |
|----------|----------|------------------|----------------|
| Voicenter | `/webhooks/voicenter` | Custom header token | JSON call events |
| Meta WhatsApp | `/webhooks/whatsapp` | HMAC-SHA256 | JSON message/status |
| Google Reviews | `/webhooks/google` | HMAC (varies) | JSON review events |

### API Clients (Outbound)

| Service | SDK/Client | Auth Method | Rate Limits |
|---------|------------|-------------|-------------|
| WhatsApp Business | Official Meta SDK | Bearer token | 80 msg/sec business |
| Google Business Profile | googleapis | OAuth 2.0 | 600 req/min |
| Israeli Invoice APIs | Custom HTTP | API key | Varies by provider |
| Email (SendGrid/SES) | Official SDK | API key | Plan-dependent |

---

## Patterns to Follow

### Pattern 1: Tenant Context Middleware

**What:** Inject tenant context into every request before it reaches business logic.

**When:** Every authenticated API request.

```typescript
// middleware/tenant-context.ts
export async function tenantContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tenantId = req.user?.tenantId;
  if (!tenantId) {
    return res.status(401).json({ error: 'No tenant context' });
  }

  // Set for Prisma/RLS
  await prisma.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, false)`;

  // Attach to request for business logic
  req.tenant = await tenantService.getById(tenantId);

  next();
}
```

### Pattern 2: Webhook Acknowledge-Then-Process

**What:** Immediately acknowledge webhook, process asynchronously.

**When:** All webhook endpoints.

```typescript
// routes/webhooks/whatsapp.ts
router.post('/webhooks/whatsapp', async (req, res) => {
  // 1. Verify signature (must use raw body)
  if (!verifyWhatsAppSignature(req.rawBody, req.headers['x-hub-signature-256'])) {
    return res.status(401).send('Invalid signature');
  }

  // 2. Check idempotency
  const eventId = req.body.entry?.[0]?.id;
  if (await webhookStore.exists(eventId)) {
    return res.status(200).send('Already processed');
  }

  // 3. Enqueue for processing
  await webhookQueue.add('whatsapp', {
    eventId,
    payload: req.body,
    receivedAt: Date.now()
  });

  // 4. Acknowledge immediately (< 3 seconds)
  res.status(200).send('OK');
});
```

### Pattern 3: Encrypted Token Storage

**What:** Store OAuth tokens encrypted, decrypt only when needed.

**When:** Any external service token storage.

```typescript
// services/oauth/token-manager.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY!, 'hex');

export function encryptToken(token: string): { encrypted: string; iv: string; tag: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex')
  };
}

export function decryptToken(data: { encrypted: string; iv: string; tag: string }): string {
  const decipher = createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(data.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(data.tag, 'hex'));

  let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Processing Webhooks Inline

**What:** Doing heavy processing before responding to webhook.

**Why bad:** External services timeout, retry, create duplicates. Meta requires response in 20 seconds, will retry 3 times.

**Instead:** Acknowledge immediately, enqueue for background processing.

### Anti-Pattern 2: Tenant ID in WHERE Clauses

**What:** Manually adding `WHERE tenant_id = ?` to every query.

**Why bad:** Easy to forget, leads to data leakage. Single missed clause exposes all tenant data.

**Instead:** Use PostgreSQL RLS policies + session variables. Database enforces isolation automatically.

### Anti-Pattern 3: Storing Tokens in Plain Text

**What:** Saving OAuth access/refresh tokens unencrypted in database.

**Why bad:** Database breach exposes all external service credentials. Attackers can impersonate all tenants.

**Instead:** Encrypt with AES-256-GCM, store IV and auth tag separately, use environment-based keys.

### Anti-Pattern 4: Single Queue for All Job Types

**What:** Putting real-time and batch jobs in the same queue.

**Why bad:** Monthly reports block urgent webhook processing. Priority inversion causes customer-visible delays.

**Instead:** Separate queues per time-scale with dedicated workers and appropriate concurrency.

---

## Scalability Considerations

| Concern | <100 Tenants (MVP) | 1K Tenants | 10K+ Tenants |
|---------|-------------------|------------|--------------|
| **Database** | Single PostgreSQL instance | Read replicas for analytics | Horizontal sharding by tenant_id |
| **Redis** | Single instance | Redis Cluster (3 nodes) | Redis Cluster with separate instances per queue type |
| **Workers** | 1-2 worker processes | Worker per queue type | Auto-scaling worker pools |
| **API Servers** | Single instance | 2-3 behind load balancer | Kubernetes HPA based on CPU/requests |
| **Webhook Processing** | Inline processing acceptable | Dedicated webhook workers | Webhook gateway with rate limiting per tenant |
| **Token Refresh** | Cron job every 30min | Distributed cron (one leader) | Token refresh as scheduled BullMQ jobs |

---

## Build Order (Recommended Phase Dependencies)

Based on component dependencies, the recommended build order is:

```
Phase 1: Foundation
├── Database schema + RLS policies
├── Basic tenant CRUD
├── Auth (JWT) + tenant context middleware
└── Project scaffolding (monorepo)

Phase 2: Core Infrastructure
├── Redis + BullMQ setup
├── OAuth token manager (encrypted storage)
├── Basic webhook receiver structure
└── Worker process scaffolding

Phase 3: Webhook Integrations
├── WhatsApp webhook receiver
├── Voicenter webhook receiver
├── Google Reviews webhook receiver
└── Idempotency + signature verification

Phase 4: Outbound Integrations
├── WhatsApp Business API client
├── Google Business Profile API client
├── Email sending service
└── Israeli invoice API integrations

Phase 5: Background Jobs
├── Real-time job queue (webhook processing)
├── Daily optimization jobs
├── Weekly analytics jobs
└── Monthly reporting jobs

Phase 6: Frontend
├── Next.js with Hebrew RTL setup
├── Tenant dashboard
├── Real-time notifications (SSE)
└── Configuration UI

Phase 7: Polish
├── Monitoring + alerting
├── Rate limiting per tenant
├── Audit logging
└── Documentation
```

**Key Dependencies:**
- Phase 2 requires Phase 1 (workers need database)
- Phase 3 requires Phase 2 (webhooks need queues)
- Phase 4 requires Phase 2 (API clients need token manager)
- Phase 5 requires Phase 3 + 4 (jobs use webhooks + APIs)
- Phase 6 can start after Phase 1 (frontend + backend parallel)

---

## Security Checklist

- [ ] PostgreSQL RLS enabled on all tenant tables
- [ ] `FORCE ROW LEVEL SECURITY` on all tables
- [ ] Application connects as non-owner role
- [ ] OAuth tokens encrypted with AES-256-GCM
- [ ] Encryption key in environment variable, not code
- [ ] Webhook signatures verified before processing
- [ ] Rate limiting per tenant to prevent abuse
- [ ] JWT tokens have short expiry (15min) with refresh
- [ ] HTTPS everywhere (frontend, API, webhooks)
- [ ] Audit logging for sensitive operations

---

## Sources

### HIGH Confidence (Official Documentation)
- [BullMQ Official Documentation - Job Schedulers](https://docs.bullmq.io/guide/job-schedulers)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [WhatsApp Business Platform Node.js SDK](https://whatsapp.github.io/WhatsApp-Nodejs-SDK/)
- [Google Business Profile API - OAuth Setup](https://developers.google.com/my-business/content/oauth-setup)

### MEDIUM Confidence (Verified with Multiple Sources)
- [AWS: Multi-tenant data isolation with PostgreSQL RLS](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)
- [Better Stack: Job Scheduling with BullMQ](https://betterstack.com/community/guides/scaling-nodejs/bullmq-scheduled-tasks/)
- [SSE vs WebSockets for SaaS](https://medium.com/codetodeploy/why-server-sent-events-beat-websockets-for-95-of-real-time-cloud-applications-830eff5a1d7c)

### LOW Confidence (Community Patterns - Verify During Implementation)
- Multi-tenant NestJS boilerplate patterns
- Hebrew RTL with Tailwind CSS setup
- Voicenter-specific webhook integration details (vendor documentation required)
