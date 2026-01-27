# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-27)

**Core value:** Business owner does nothing after 2-minute setup. Findo operates autonomously 24/7.
**Current focus:** Phase 2 - WhatsApp Integration

## Current Position

Phase: 2 of 10 (WhatsApp Integration)
Plan: 6 of 6 in current phase
Status: Phase complete
Last activity: 2026-01-27 - Completed 02-06-PLAN.md (WhatsApp Connection Frontend UI)

Progress: [██████████] 100% of Phase 2 (6/6 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 14
- Average duration: 6.6 min
- Total execution time: 1.53 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 8 | 39.5 min | 4.9 min |
| 02-whatsapp-integration | 6 | 52.5 min | 8.8 min |

**Recent Trend:**
- Last 5 plans: 02-02 (4 min), 02-03 (5 min), 02-04 (6.5 min), 02-05 (5 min), 02-06 (27 min)
- Trend: 02-06 longer due to human verification checkpoint

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Decision | Phase | Rationale |
|----------|-------|-----------|
| UUID primary keys for tenant_id | 01-01 | Prevents enumeration attacks |
| tenant_status enum (trial/active/grace/paused/cancelled) | 01-01 | Covers full lifecycle from CONTEXT.md |
| Default timezone Asia/Jerusalem | 01-01 | Israeli market focus |
| Soft delete with deleted_at | 01-01 | 90-day data retention requirement |
| Drizzle imports without .js extension | 01-01 | Compatibility with drizzle-kit CJS mode |
| RLS session variable (app.current_tenant) | 01-02 | Database-level tenant isolation |
| Context cleanup after request | 01-02 | Connection pool safety |
| FORCE ROW LEVEL SECURITY | 01-02 | Prevents superuser bypass |
| AES-256-GCM for token encryption | 01-03 | Authenticated encryption prevents tampering |
| Per-value salt and IV | 01-03 | Same plaintext encrypts differently each time |
| scrypt key derivation | 01-03 | Adds brute-force protection beyond master secret |
| isValid status field for tokens | 01-03 | Health tracking without decryption |
| maxRetriesPerRequest: null for BullMQ | 01-04 | Required for BullMQ blocking commands |
| Separate Redis connections per queue/worker | 01-04 | BullMQ requirement for isolation |
| Exponential backoff (1s base, 5 attempts) | 01-04 | Reasonable retry window for transient failures |
| Four queue types (webhooks, scheduled, notifications, activity) | 01-04 | Independent scaling and monitoring |
| Webhook idempotency via Redis with 24hr TTL | 01-05 | Prevents duplicate processing without DB overhead |
| Webhooks enqueue immediately, respond < 500ms | 01-05 | Fast response, async processing pattern |
| Two-tier health checks (basic and deep) | 01-05 | Basic for load balancer, deep for monitoring |
| Graceful shutdown: workers first, then Redis | 01-05 | Prevents data loss during shutdown |
| Activity worker concurrency: 10 | 01-06 | Lightweight pub/sub operations |
| Tenant-specific pub/sub channels | 01-06 | activity:tenant:{id} pattern for isolation |
| All jobs use Asia/Jerusalem timezone | 01-06 | Israeli business hours |
| Daily/weekly jobs at 10:00 AM | 01-06 | After morning rush per CONTEXT.md |
| Weekly jobs on Sunday | 01-06 | Start of Israeli work week |
| SSE headers via c.header() before stream() | 01-07 | Hono streaming API compatibility |
| 30-second SSE heartbeat | 01-07 | Standard interval to prevent timeout |
| Test domain @test.findo.local | 01-07 | Easy test tenant identification and cleanup |
| Warm up Redis via PING before accepting requests | 01-08 | Eliminates cold start latency on first webhook |
| findo_app role with explicit GRANT statements | 01-08 | Non-superuser role for RLS enforcement |
| Default privileges for future tables | 01-08 | findo_app auto-receives permissions on new tables |
| One WhatsApp connection per tenant | 02-01 | Per CONTEXT.md: single WhatsApp number per business |
| Graph API v21.0 | 02-01 | Current stable version per RESEARCH.md |
| Hebrew (he) as default language | 02-01 | Israeli market focus |
| Phone Number ID as api_key type | 02-01 | Static identifier, not rotating token |
| Token stored with wabaId identifier | 02-02 | Support future multi-WABA scenarios |
| displayPhoneNumber defaults to empty string | 02-02 | Schema requires non-null, Meta may not provide |
| Timing-safe signature comparison | 02-03 | Prevents timing attacks on HMAC verification |
| Raw body verification before parsing | 02-03 | Preserves byte representation for signature |
| Separate queues for messages vs statuses | 02-03 | Different processing patterns per CONTEXT.md |
| Daily validation at 3:00 AM Israel time | 02-05 | Off-peak hours, minimal business impact |
| Graph API /me endpoint for validation | 02-05 | Low cost, no quota impact |
| 100ms delay between tenant checks | 02-05 | Rate limit protection for bulk validation |
| Upsert pattern for conversations | 02-04 | Check existing first, then update or create |
| Status timestamp backfill | 02-04 | If read but no sent/delivered, set those too |
| Auto-reply best-effort | 02-04 | Failure logged but job continues |
| Server-side HTML rendering with Hono | 02-06 | Simple MVP stack, no frontend framework needed |
| Hebrew UI with RTL layout | 02-06 | Israeli market focus |
| Pre-flight credential check | 02-06 | Prevents confusing infinite loading when META env vars missing |

### Pending Todos

None yet.

### Blockers/Concerns

**From Research:**
- WhatsApp AI policy (Meta January 2026): AI must be supplementary, not primary functionality
- WhatsApp quality rating: Strict opt-in flows required to avoid death spiral
- Google OAuth tokens: Proactive refresh needed, ~1%/month unexplained revocations
- GBP API: No real-time webhooks for reviews (requires polling architecture)

**External Dependencies:**
- Meta Business Verification: 2-4 weeks for WhatsApp Business API approval
- Google API Access: 3-5 days for GBP API approval
- Voicenter: No official SDK, webhook reliability unknown

**User Setup Required:**
- ENCRYPTION_SECRET environment variable must be set before using token vault
- REDIS_URL environment variable must be set for queue infrastructure
- DATABASE_URL environment variable must be set for PostgreSQL connection
- findo_app database user must be created for RLS enforcement (see docs/rls-setup.md)
- META_APP_ID, META_APP_SECRET, WHATSAPP_WEBHOOK_VERIFY_TOKEN, META_CONFIG_ID for WhatsApp integration

## Session Continuity

Last session: 2026-01-27T18:18:08Z
Stopped at: Completed 02-06-PLAN.md - Phase 2 complete
Resume file: None - ready for Phase 3

**Phase 2 Progress:**
- 02-01: WhatsApp schema and Graph API client complete
- 02-02: Embedded Signup OAuth callback complete
- 02-03: Webhook handlers complete
- 02-04: Message workers complete
- 02-05: Token validation job complete
- 02-06: Frontend UI complete

**Phase 2 COMPLETE - Ready for Phase 3: Google Integration**
