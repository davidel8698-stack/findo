---
phase: 02-whatsapp-integration
plan: 01
subsystem: database, api
tags: [whatsapp, graph-api, meta, drizzle, postgres]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Token Vault for credential storage, queue infrastructure
provides:
  - WhatsApp database schema (connections, conversations, messages)
  - Graph API client wrapper
  - Message sending functions (template, text, image)
affects: [02-02, 02-03, 02-04, 02-05, 02-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "WhatsApp client factory from Token Vault"
    - "24-hour conversation window tracking"
    - "Hebrew default for Israeli market"

key-files:
  created:
    - src/db/schema/whatsapp.ts
    - src/services/whatsapp/client.ts
    - src/services/whatsapp/messages.ts
    - src/services/whatsapp/index.ts
    - drizzle/0003_bumpy_moondragon.sql
  modified:
    - src/db/schema/index.ts

key-decisions:
  - "One connection per tenant (unique constraint on tenant_id)"
  - "Graph API v21.0 (current stable version)"
  - "Hebrew (he) as default language code"
  - "Phone Number ID stored as api_key type in Token Vault"

patterns-established:
  - "WhatsApp client creation: createWhatsAppClient(tenantId) from Token Vault"
  - "Window check: isWindowOpen(conversation.windowExpiresAt)"
  - "Message tracking: wa_message_id index for status webhook lookups"

# Metrics
duration: 5min
completed: 2026-01-27
---

# Phase 2 Plan 1: WhatsApp Database Schema & Graph API Client Summary

**WhatsApp schema with connection/conversation/message tracking plus Graph API client with template and freeform message sending**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-27T17:29:37Z
- **Completed:** 2026-01-27T17:34:18Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Three WhatsApp database tables with proper foreign keys, enums, and indexes
- WhatsAppClient class for authenticated Graph API requests
- Factory function to create client from Token Vault credentials
- sendTemplateMessage, sendTextMessage, sendImageMessage functions
- 24-hour window tracking with isWindowOpen helper

## Task Commits

Each task was committed atomically:

1. **Task 1: Create WhatsApp database schema** - `ebc36a1` (feat)
2. **Task 2: Create WhatsApp Graph API client** - `747278a` (feat)
3. **Task 3: Create message sending functions** - `e8d12d1` (feat)

## Files Created/Modified

- `src/db/schema/whatsapp.ts` - WhatsApp tables: connections, conversations, messages
- `src/db/schema/index.ts` - Added whatsapp exports
- `src/services/whatsapp/client.ts` - WhatsAppClient class with Graph API wrapper
- `src/services/whatsapp/messages.ts` - sendTemplateMessage, sendTextMessage, sendImageMessage
- `src/services/whatsapp/index.ts` - Barrel exports
- `drizzle/0003_bumpy_moondragon.sql` - Migration for WhatsApp tables

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| One WhatsApp connection per tenant | Per CONTEXT.md: single WhatsApp number per business |
| Graph API v21.0 | Current stable version per RESEARCH.md |
| Hebrew (he) as default language | Israeli market focus |
| Phone Number ID as api_key type | Static identifier, not rotating token |
| Conversation window stored per customer | Enables 24-hour window enforcement |
| SET NULL on conversation_id delete | Preserve message history if conversation deleted |

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all TypeScript compilation and migration generation succeeded.

## User Setup Required

**External services require manual configuration before using WhatsApp features:**

Environment variables needed (from plan frontmatter):
- `META_APP_ID` - Meta Developer Console -> App Dashboard -> Settings -> Basic
- `META_APP_SECRET` - Meta Developer Console -> App Dashboard -> Settings -> Basic
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` - Generate random string for webhook verification
- `META_CONFIG_ID` - Meta Developer Console -> Facebook Login for Business -> Configuration ID

Meta dashboard configuration:
1. Create Meta App with WhatsApp Business API at developers.facebook.com
2. Enable Facebook Login for Business
3. Configure Embedded Signup

Note: This is foundation infrastructure. Actual WhatsApp connection requires completing Plans 02-02 through 02-06.

## Next Phase Readiness

**Ready for:**
- 02-02: Embedded Signup OAuth flow (uses whatsapp_connections table)
- 02-03: Webhook handlers (uses whatsapp_messages, whatsapp_conversations)
- 02-04: Message workers (uses sendTemplateMessage, sendTextMessage)

**No blockers.** Database schema and client service provide complete foundation for remaining WhatsApp plans.

---
*Phase: 02-whatsapp-integration*
*Plan: 01*
*Completed: 2026-01-27*
