# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-27)

**Core value:** Business owner does nothing after 2-minute setup. Findo operates autonomously 24/7.
**Current focus:** Phase 9 (Dashboard & Notifications) IN PROGRESS

## Current Position

Phase: 9 of 10 (Dashboard & Notifications)
Plan: 4 of 8 in current phase (completed 09-01, 09-02, 09-03, 09-04)
Status: In progress
Last activity: 2026-01-29 - Completed 09-04-PLAN.md (Activity Feed)

Progress: [██████████████████████████████░] 45/50 plans complete, ~90% of total project

## Performance Metrics

**Velocity:**
- Total plans completed: 45
- Average duration: 5.2 min
- Total execution time: 3.95 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 8 | 39.5 min | 4.9 min |
| 02-whatsapp-integration | 6 | 52.5 min | 8.8 min |
| 03-lead-capture | 6 | 27.6 min | 4.6 min |
| 04-google-integration | 4 | 25 min | 6.3 min |
| 05-review-management | 6 | 27 min | 4.5 min |
| 06-review-requests | 7 | 25 min | 3.6 min |
| 07-gbp-content | 8 | 53 min | 6.6 min |
| 08-gbp-optimization | 7 | ~35 min | 5 min |
| 09-dashboard-notifications | 4 | ~21 min | 5.3 min |

**Recent Trend:**
- Last 5 plans: 09-01 (~4 min), 09-02 (~5 min), 09-03 (~6 min), 09-04 (~6 min)
- Trend: Phase 9 progressing. Activity feed complete with grouping and real-time updates.

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
| Lead status 7-state lifecycle | 03-01 | Covers full funnel from capture to outcome |
| Missed call idempotency via callId | 03-01 | Voicenter CallID prevents duplicate leads |
| One conversation per lead (1:1) | 03-01 | Each lead has exactly one chatbot flow |
| Phone normalization to +972 format | 03-01 | Consistent format for lookups and deduplication |
| Simple object-based state machine | 03-04 | XState overkill for linear chatbot flow |
| Claude Haiku 4.5 for intent extraction | 03-04 | Cost-effective, good Hebrew support |
| CDR worker on webhooks queue | 03-02 | Reuses infrastructure, filters by job name |
| 2-minute delayed lead outreach | 03-02 | Per CONTEXT.md, gives owner time to call back |
| Warm personal message tone | 03-03 | Per CONTEXT.md, messages feel like owner wrote them |
| Qualifying status for new leads | 03-03 | Chatbot collecting info, not yet qualified |
| Reminder schedule at creation | 03-03 | 2h and 24h reminders queued when lead created |
| Use tenant.ownerPhone for notifications | 03-05 | Existing schema field, no migration needed |
| Don't throw on notification failure | 03-05 | Notification non-critical, lead flow must continue |
| Cancel reminders on customer response | 03-05 | Customer engaged, reminders not needed |
| Unresponsive timeout 24h after reminder 2 | 03-06 | Total 48h from initial message before marking unresponsive |
| activityService for lead events | 03-06 | Consistent activity pattern across all workers |
| Idempotent reminder checks via timestamps | 03-06 | Prevents duplicate reminders on retry |
| business.manage scope for Google OAuth | 04-01 | Covers reviews read/reply, business info, locations |
| TenantId in OAuth state parameter | 04-01 | Validates callback is for correct tenant, prevents CSRF |
| prompt: consent in OAuth URL | 04-01 | Forces consent screen to ensure refresh token |
| Fetch account info from accounts.list API | 04-01 | Get accountId/accountName programmatically |
| 10-minute expiry window for proactive refresh | 04-03 | Sufficient buffer for refresh before actual expiration |
| google-token-validation at 3:30 AM | 04-03 | 30-minute offset from WhatsApp validation (3:00 AM) |
| 100ms delay between token operations | 04-03 | Rate limit protection matching WhatsApp validation pattern |
| TenantId as token identifier | 04-03 | Consistent with oauth.ts token storage pattern |
| Direct HTTP for reviews API | 04-02 | googleapis mybusiness v4 types incomplete |
| 4096 byte reply limit validation | 04-02 | Hebrew 2-3 bytes per char, fail fast on oversized |
| Star rating enum to number | 04-02 | Cleaner for business logic comparisons |
| Follow WhatsApp UI pattern for Google | 04-04 | Consistent UX across integration flows |
| Client-side fetch then redirect for OAuth | 04-04 | Same pattern as WhatsApp, allows loading overlay |
| /connect/google as callback route | 04-04 | Consistent with /connect/whatsapp pattern |
| Claude Haiku 4.5 for review replies | 05-02 | Better Hebrew support, cost-effective for high volume |
| Structured outputs beta for JSON | 05-02 | Guarantees JSON format, eliminates parsing failures |
| 3-star reviews default to negative | 05-02 | Safer to alert owner than auto-reply to ambiguous reviews |
| Hebrew fallback replies | 05-02 | Ensure reviews always get responses even if AI is down |
| Interactive button IDs approve_{id}/edit_{id} | 05-04 | Enables webhook handler to extract review ID and action |
| Window-aware owner notifications | 05-04 | Interactive buttons for session, text fallback otherwise |
| Hebrew instructions in fallback | 05-04 | Owner can respond with 'אשר' or custom text |
| Single concurrency for review polling | 05-03 | Respect Google API rate limits |
| 100ms delay between tenants | 05-03 | Rate limit protection matching other workers |
| Per-tenant error isolation | 05-03 | One tenant's failure doesn't block others |
| 48h threshold from approvalSentAt for reminder | 05-06 | Per CONTEXT.md: 48h reminder if owner doesn't respond |
| 48h threshold from reminderSentAt for auto-post | 05-06 | Total 96h before auto-post |
| Hour :30 for review-reminder job | 05-06 | Offset from review-check at :00 to spread load |
| 6-state review request lifecycle | 06-01 | pending/requested/reminded/completed/stopped/skipped |
| 4-source invoice tracking | 06-01 | greeninvoice/icount/manual/forwarded |
| credentialsVaultId without FK | 06-01 | Conceptual reference to token_vault for flexibility |
| Unique constraint (tenantId, source, invoiceId) | 06-01 | Prevents duplicate review requests per invoice |
| 5-minute token expiration buffer | 06-02 | Proactive Greeninvoice JWT refresh prevents failures |
| 401 retry with cache clear | 06-02 | Handles expired token race conditions |
| Document types 305/320 for Greeninvoice | 06-02 | Tax Invoice and Invoice/Receipt cover invoice use cases |
| DetectedInvoice normalized format | 06-02 | Supports multi-provider (Greeninvoice, iCount) integration |
| iCount session per polling cycle | 06-03 | Session IDs may not support concurrency |
| Currency hardcoded to ILS for iCount | 06-03 | iCount is Israel-only platform |
| Search invoice+invrec document types | 06-03 | Both types represent invoices in iCount |
| Invoice-poll at minute :15 | 06-04 | Offset from review-check at :00 and review-reminder at :30 |
| 24-hour delayed review request jobs | 06-04 | Per REVW-04: wait 24h after service before requesting review |
| Error isolation per tenant in polling | 06-04 | One tenant's failure doesn't stop others |
| Phone normalization to +972 format | 06-06 | Consistent format for lookups and deduplication |
| 7-day duplicate detection window | 06-06 | Prevents review request spam while allowing re-requests |
| Manual requests follow same 24h delay | 06-06 | Consistent flow for all review request sources |
| placeId added to googleConnections | 06-05 | Required for Google review link generation |
| 3-day reminder then stop | 06-05 | Per REVW-06/07: exactly 1 reminder, no spam |
| Concurrency 5 for review requests | 06-05 | Multiple review requests can process in parallel |
| Three matching strategies for completion | 06-07 | Phone digits, 48h time window, name fuzzy match |
| Best-effort reminder cancellation | 06-07 | Warn on failure, don't throw (request already complete) |
| Thursday 10:00 AM for photo request | 07-01 | End of Israeli work week per CONTEXT.md |
| Saturday 10:00 AM for photo reminder | 07-01 | 2 days after request per CONTEXT.md |
| ISO week number for photo request idempotency | 07-01 | Unique constraint on (tenantId, week, year) |
| Require both WhatsApp AND Google connection | 07-01 | Photos need both channels to be useful |
| 7-day expiration for photo requests | 07-01 | Skip until next week if no response |
| Two-step WhatsApp media download | 07-02 | Graph API metadata first, then binary from lookaside URL |
| Laplacian variance for blur detection | 07-02 | Standard edge detection with sharp |
| Blur threshold 50 | 07-02 | Empirical starting point, adjustable |
| GBP sourceUrl upload | 07-02 | GBP API requires public URL, not binary upload |
| Phone number regex validation in posts | 07-04 | Google rejects posts with phone numbers |
| 1500 char limit for posts | 07-04 | Google policy, clear error message |
| Hebrew language code (he) for posts | 07-04 | Israeli market focus |
| Monthly post job on 1st at 10:00 AM | 07-04 | Per CONTEXT.md: monthly promotional posts |
| Compelling messaging (35% stats) | 07-04 | Owner needs motivation to participate |
| tokenVaultService for WhatsApp tokens | 07-03 | Access tokens in encrypted vault, not direct DB field |
| Lazy R2 client initialization | 07-03 | Prevents startup errors when R2 not configured |
| In-memory pending photo map | 07-03 | MVP solution; production needs Redis with TTL |
| Photo handling after review responses | 07-03 | Priority order in message processing flow |
| Claude Haiku 4.5 for posts | 07-05 | Same pattern as reply-generator.ts, cost-effective |
| isSafe boolean for auto-publish | 07-05 | Only safe content can auto-publish after timeout |
| Reminder sequence 3/7/10 days | 07-05 | Gradual escalation before auto-publish |
| Dual-queue worker pattern | 07-05 | notifications for generate/publish, scheduled for reminder |
| Post response after photos in priority | 07-05 | Owner flows take precedence over lead chatbot |
| @hebcal/core for Israeli holidays | 07-06 | Comprehensive Hebrew calendar library with Israeli holiday support |
| Business-affecting holiday list | 07-06 | Curated list: Rosh Hashana, Yom Kippur, Sukkot, Pesach, etc. |
| 5-8 day reminder window | 07-06 | Gives owner time to respond before holiday arrives |
| DD/MM: format for hours response | 07-06 | Simple pattern for Hebrew users - Israeli date format |
| Merge special hours with conflicts | 07-06 | Don't lose existing special hours, just update conflicting dates |
| Sunday 10:00 AM for holiday check | 07-06 | Weekly check same day as photo request (Israeli work week start) |
| holidayCheckWorker as import-time instantiation | 07-07 | Worker starts at import (not via start function) |
| postApprovalWorker dual-cleanup | 07-07 | Returns { notificationWorker, scheduledWorker } requiring separate cleanup |
| Dynamic Maps URL from businessName | 07-08 | No searchUrl DB column needed - generate on-demand |
| Maps search URL pattern for profile links | 07-08 | https://www.google.com/maps/search/?api=1&query={businessName} |
| Decimal precision 5,2 for percentages | 08-01 | Supports 0.00-100.00 range with 2 decimal places |
| Five A/B test types | 08-01 | review_request_message, timing, reminder, photo_request, post_request per GBPO-05 |
| Unique tenant constraint on baselines and config | 08-01 | Each tenant has exactly one baseline row and one config row |
| Nullable visibility metrics | 08-01 | GBP API may not provide impressions/searches/actions data for all accounts |
| Use Business Profile Performance API v1 for metrics | 08-02 | Separate from My Business v4, different endpoints |
| Aggregate desktop + mobile impressions | 08-02 | Combined for total visibility score |
| Return null on error for non-critical metrics | 08-02 | Metrics are nice-to-have, let caller handle gracefully |
| Monday 2:00 AM for metrics collection | 08-03 | Captures full Sun-Sat week before processing |
| 4+ weeks required for baseline | 08-03 | Statistical validity before setting dynamic baseline |
| 8 weeks max for baseline calculation | 08-03 | Moving average uses recent data, not entire history |
| 30% drop threshold for alerts | 08-05 | Significant indicator without false positives |
| 4+ weeks baseline for alerts | 08-05 | Statistical validity before alerting |
| Text message over template for alerts | 08-05 | Owner messages Findo regularly, likely in session window |
| Hebrew alerts with suggestions | 08-05 | Israeli market, owner needs clear next steps |
| 20% improvement with 10+ samples for A/B winner | 08-06 | Per CONTEXT.md, sufficient statistical confidence |
| Prefer global winners in variant assignment | 08-06 | New tenants get proven approaches while allowing experimentation |
| Track success on review completion | 08-06 | Measures actual outcome (review received) not just activity |
| migrateToWinner deactivates losing assignments | 08-07 | Avoid duplicates when migrating to winner variant |
| 4-hour timing adjustment increments | 08-07 | Gradual changes with 12h min and 48h max bounds |
| Monday 3:00 AM for auto-tuning | 08-07 | 1 hour after metrics collection to use fresh data |
| Weekly summaries via text message | 08-07 | Owner likely in session window from regular interaction |
| 10 boolean notification flags with sensible defaults | 09-01 | Per CONTEXT.md: granular notification preferences with opt-out per type |
| JSONB for chatbot questions with ChatbotQuestion interface | 09-01 | Flexible structure for add/edit/reorder while maintaining type safety |
| Default Hebrew questions for all business types | 09-01 | Per CONTEXT.md: defaults work for all businesses, owner customizes as needed |
| Tenant timezone for stats date ranges | 09-02 | Accurate day/week/month boundaries for Israeli businesses |
| metricSnapshot fallback for rating | 09-02 | Use existing snapshot if available, calculate from reviews otherwise |
| 24h threshold for review warnings in health | 09-02 | Reviews pending > 24h need attention per CONTEXT.md |
| Israeli week starts Sunday | 09-02 | Per CONTEXT.md - matches Israeli business week |
| Traffic light with checkmark/!/X icons | 09-03 | Visual clarity for health status indicator |
| Period toggle buttons for stats | 09-03 | Quick switching between today/week/month |
| JavaScript fetch with X-Tenant-ID header | 09-03 | API calls include tenant context for dashboard |
| Group events by sourceId into journeys | 09-04 | Events with same sourceId represent related actions |
| Detect journey type from eventType prefix | 09-04 | lead.*, review.*, content.* patterns already established |
| Hebrew summaries for activity groups | 09-04 | Israeli market, consistent with CONTEXT.md |
| 100-item DOM limit for activity feed | 09-04 | Prevent memory issues per RESEARCH.md pitfall |
| Two-column layout (stats:activity = 1:2) | 09-04 | Activity feed is primary, stats are supplementary |

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
- ANTHROPIC_API_KEY for AI intent extraction (Claude Haiku 4.5)
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI for Google OAuth
- R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL for Cloudflare R2 storage

## Session Continuity

Last session: 2026-01-29
Stopped at: Completed 09-04-PLAN.md (Activity Feed)
Resume file: None

**Phase 9 Progress:** IN PROGRESS (4/8 plans complete)
- 09-01: Database Schema (notificationPreferences, chatbotConfig) [DONE]
- 09-02: Dashboard Stats & Health APIs (stats-aggregator, health-checker, dashboard routes) [DONE]
- 09-03: Dashboard Main View (health status, stats cards, main page, routes) [DONE]
- 09-04: Activity Feed (grouper service, feed component, API integration) [DONE]
- 09-05: Settings API Endpoints [PENDING]
- 09-06: Settings Views [PENDING]
- 09-07: Reports Visualization [PENDING]
- 09-08: Main Dashboard Integration [PENDING]

**Next:** 09-05 (Settings API Endpoints)
