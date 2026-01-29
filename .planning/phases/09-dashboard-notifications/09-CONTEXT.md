# Phase 9: Dashboard & Notifications - Context

**Gathered:** 2026-01-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Business owner confidence window showing Findo is working, with WhatsApp-first interactions. Dashboard displays daily stats, activity feed, and allows actions that mirror WhatsApp capabilities. Most interactions happen via WhatsApp; dashboard is for confidence and backup, not daily use.

</domain>

<decisions>
## Implementation Decisions

### Dashboard hierarchy
- **Health status on top** — Quick glance tells if everything is OK
- **Combined status display** — Traffic light (green/yellow/red) PLUS component breakdown (WhatsApp ✓, Google ✓, Reviews ⚠)
- Stats cards and activity timeline below health status
- **Switchable time periods** — Tabs or dropdown: Today / This Week / This Month

### WhatsApp-Web handoff
- **WhatsApp is primary, dashboard is secondary** — Everything doable via WhatsApp, everything also doable via dashboard
- Dashboard mirrors all WhatsApp capabilities (send review request, request photos, etc.)
- **Links in WhatsApp only for complex actions** — Simple approve/edit in WhatsApp, dashboard link only when detail needed
- **Real-time sync** — Dashboard reflects WhatsApp actions immediately via SSE

### Activity feed design
- **Summary only by default** — Click to expand for details
- **Chronological newest first** as default view
- **Type filters available** — Tabs: Reviews / Leads / Content / All
- **Smart grouping** — Group related events (e.g., "Lead journey: call → message → qualified")
- **Unlimited history** with pagination (load more as user scrolls)
- **Quick actions inline** — Each item has relevant action buttons (approve, view, respond)

### Settings scope
- **No template editing** — Claude handles all text, owner approves/edits individual responses
- **Timing settings adjustable** — Findo defaults are optimized, but owner can access settings to change individual timings (lead delay, review request, reminders)
- **Full chatbot customization** — Default questions work for all businesses, but owner can change everything: add questions, edit texts, reorder
- **Granular notification preferences** — Choose exactly which events trigger WhatsApp notifications

### Claude's Discretion
- Dashboard visual design and layout details
- Loading states and skeleton screens
- Error handling UI patterns
- Mobile responsiveness approach
- Reports visualization (graphs, charts)

</decisions>

<specifics>
## Specific Ideas

- Health status should combine traffic light simplicity with component breakdown visibility
- Activity feed grouping should connect related events into "journeys" (lead journey, review journey)
- Settings default to Findo's optimized values — advanced users can customize

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-dashboard-notifications*
*Context gathered: 2026-01-29*
