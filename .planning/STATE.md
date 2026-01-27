# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-27)

**Core value:** Business owner does nothing after 2-minute setup. Findo operates autonomously 24/7.
**Current focus:** Phase 1 - Foundation (Complete)

## Current Position

Phase: 1 of 10 (Foundation)
Plan: 6 of 6 in current phase
Status: Phase 1 Complete
Last activity: 2026-01-27 - Completed 01-05-PLAN.md (Webhook Endpoints and Activity Service)

Progress: [==========] 100% of Phase 1

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 5.0 min
- Total execution time: 0.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 6 | 31.5 min | 5.25 min |

**Recent Trend:**
- Last 5 plans: 01-02 (6 min), 01-03 (5 min), 01-04 (4.5 min), 01-06 (4 min), 01-05 (4 min)
- Trend: Consistent execution pace

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

## Session Continuity

Last session: 2026-01-27T15:46:00Z
Stopped at: Completed 01-05-PLAN.md (Phase 1 Foundation complete)
Resume file: None - ready for Phase 2
