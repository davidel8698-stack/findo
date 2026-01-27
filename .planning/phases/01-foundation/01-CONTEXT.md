# Phase 1: Foundation - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Multi-tenant infrastructure that isolates tenants, processes webhooks reliably, and secures credentials. This phase delivers: tenant data model, Row-Level Security, encrypted token storage, queue-based webhook processing, background job scheduling, and real-time activity feed.

</domain>

<decisions>
## Implementation Decisions

### Tenant Structure
- **One account = one business** — no multi-business management from single login
- **Owner only** — one login per business, no employee/team access
- **Magic link authentication** — click link in email to login, no password
- **Phone backup** — can also login via WhatsApp/SMS to verified personal phone (not business phone)
- **14-day trial** — free trial before payment required
- **Grace period on trial end** — 3 more days of reminders before pausing service
- **90-day data retention after pause/cancel** — then cleanup

### Activity Retention
- **90 days** for general activity history visible in dashboard
- **1 year** for lead data specifically (more valuable, longer retention)
- **Full export available** — owners can download all leads, activity, settings
- **CSV format** for exports

### Scheduled Job Timing
- **Israel timezone (IST)** for all scheduled jobs
- **Weekly photo requests: Sunday 10:00 AM** — start of Israeli work week
- **Outbound messages to owners: 10:00 AM** — after morning rush
- **No Shabbat pause** — Findo works 24/7, owners can mute if needed

### Error Notifications
- **Both WhatsApp + dashboard** when connection breaks (WhatsApp or Google)
- **Daily reminder** until reconnected
- **Try auto-fix first** — retry tokens, wait, then notify if still broken
- **Notify if affects service** — owner knows if their Findo isn't working, but not every internal hiccup

### Claude's Discretion
- Technical architecture choices (database, queues, hosting)
- Exact retry logic and timing for auto-fix
- Dashboard warning design
- Activity feed item format

</decisions>

<specifics>
## Specific Ideas

- Trial flows should feel zero-friction — user should be able to set up and see Findo working before ever entering payment info
- Israeli business week: Sunday-Thursday work days, Friday-Saturday weekend
- Personal phone for backup auth keeps business WhatsApp separate from personal access

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-01-27*
