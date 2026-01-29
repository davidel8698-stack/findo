# Phase 9: Dashboard & Notifications - Research

**Researched:** 2026-01-29
**Domain:** Real-time dashboard, SSE streaming, activity feeds, notification management
**Confidence:** HIGH

## Summary

This phase builds a business owner dashboard that displays system health, daily statistics, activity feed, and settings management. The architecture leverages existing patterns established in the codebase: Hono for backend with server-side HTML rendering, SSE via Redis pub/sub for real-time updates, and BullMQ for background jobs. The dashboard is secondary to WhatsApp - most owner interactions happen via WhatsApp, while the dashboard provides confidence and backup access.

The research confirms that the existing codebase has solid foundations: SSE streaming is already implemented in `src/routes/activity.ts` with Redis pub/sub subscription, the activity events schema exists with proper indexing, and the metrics dashboard view (`src/views/metrics-dashboard.ts`) demonstrates the established HTML rendering pattern with Tailwind CSS via CDN. The main work involves extending these patterns for new dashboard components.

**Primary recommendation:** Extend existing SSE/activity infrastructure with new event types and aggregation queries; use Chart.js via CDN for reports visualization; implement granular notification preferences as a new schema table.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already in Codebase)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Hono | ^4.11.7 | Web framework, SSE streaming | Already established, `streamSSE` helper for real-time |
| Drizzle ORM | ^0.45.1 | Database queries, aggregations | Already established, type-safe queries |
| ioredis | ^5.9.2 | Redis pub/sub for SSE | Already established for activity feed |
| BullMQ | ^5.67.1 | Background job processing | Already established for workers |
| Tailwind CSS | CDN | Styling | Already established pattern via CDN |

### Supporting (Add for This Phase)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Chart.js | 4.x (CDN) | Reports visualization | Weekly/monthly graphs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Chart.js | Apache ECharts | ECharts better for large datasets, but overkill for simple reports |
| Chart.js | Tremor | Tremor requires React, we use server-side HTML |
| Server-side charts | SVG generation | More complex, Chart.js client-side is simpler for dynamic data |

**Installation:**
No npm install needed - Chart.js via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── routes/
│   ├── dashboard.ts         # Dashboard page routes
│   └── api/
│       ├── dashboard-stats.ts   # Stats API endpoints
│       └── settings.ts          # Settings CRUD endpoints
├── views/
│   ├── dashboard/
│   │   ├── main.ts              # Main dashboard view
│   │   ├── activity-feed.ts     # Activity feed component
│   │   ├── stats-cards.ts       # Stats cards component
│   │   ├── health-status.ts     # Health indicator component
│   │   └── reports.ts           # Reports/graphs view
│   └── settings/
│       ├── notification-prefs.ts # Notification preferences
│       └── chatbot-config.ts     # Chatbot questions config
├── services/
│   └── dashboard/
│       ├── stats-aggregator.ts   # Stats query/aggregation
│       ├── health-checker.ts     # System health calculations
│       └── activity-grouper.ts   # Activity event grouping
└── db/schema/
    └── notification-preferences.ts  # New schema for preferences
```

### Pattern 1: Health Status Traffic Light
**What:** Combined traffic light indicator with component breakdown
**When to use:** Top of dashboard for at-a-glance system status
**Example:**
```typescript
// Per CONTEXT.md: Traffic light PLUS component breakdown
interface HealthStatus {
  overall: 'green' | 'yellow' | 'red';
  components: {
    whatsapp: { status: 'ok' | 'warning' | 'error'; message?: string };
    google: { status: 'ok' | 'warning' | 'error'; message?: string };
    reviews: { status: 'ok' | 'warning' | 'error'; message?: string };
  };
}

function calculateOverallHealth(components: HealthStatus['components']): 'green' | 'yellow' | 'red' {
  const statuses = Object.values(components).map(c => c.status);
  if (statuses.includes('error')) return 'red';
  if (statuses.includes('warning')) return 'yellow';
  return 'green';
}
```

### Pattern 2: Activity Feed with Smart Grouping
**What:** Timeline of events grouped by related journeys
**When to use:** Activity feed section showing lead/review journeys
**Example:**
```typescript
// Per CONTEXT.md: Group related events (e.g., "Lead journey: call -> message -> qualified")
interface ActivityGroup {
  type: 'journey' | 'single';
  journeyType?: 'lead' | 'review' | 'content';
  sourceId: string;  // leadId, reviewId, etc.
  events: ActivityEvent[];
  summary: string;   // "ליד חדש: יוסי - עניין בשיפוץ"
  expandedByDefault: boolean;
}

// Group events by sourceId within a time window
function groupActivityEvents(events: ActivityEvent[]): ActivityGroup[] {
  const groups = new Map<string, ActivityEvent[]>();

  for (const event of events) {
    const key = event.sourceId || event.id;
    const existing = groups.get(key) || [];
    existing.push(event);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([sourceId, groupEvents]) => ({
    type: groupEvents.length > 1 ? 'journey' : 'single',
    sourceId,
    events: groupEvents.sort((a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    ),
    summary: generateSummary(groupEvents),
    expandedByDefault: false,
  }));
}
```

### Pattern 3: Stats Aggregation with Time Period Toggle
**What:** Switchable stats for Today/This Week/This Month
**When to use:** Stats cards section
**Example:**
```typescript
// Per CONTEXT.md: Switchable time periods
type TimePeriod = 'today' | 'week' | 'month';

async function getStatsForPeriod(tenantId: string, period: TimePeriod) {
  const { start, end } = getDateRange(period);

  // Parallel queries for performance
  const [calls, whatsappSent, reviews, rating] = await Promise.all([
    countMissedCalls(tenantId, start, end),
    countWhatsAppMessagesSent(tenantId, start, end),
    countNewReviews(tenantId, start, end),
    getCurrentRating(tenantId),
  ]);

  return { calls, whatsappSent, reviews, rating };
}
```

### Pattern 4: SSE Real-time Updates (Existing Pattern)
**What:** Server-Sent Events for live dashboard updates
**When to use:** Activity feed and stats updates
**Example:**
```typescript
// Source: Existing pattern from src/routes/activity.ts
import { streamSSE } from 'hono/streaming';

dashboardRoutes.get('/stream', async (c) => {
  const tenant = c.get('tenant');

  return streamSSE(c, async (stream) => {
    // Send initial state
    await stream.writeSSE({
      data: JSON.stringify({ type: 'connected' }),
      event: 'init',
    });

    // Subscribe to Redis channel
    const unsubscribe = await subscribeToActivityFeed(tenant.tenantId, async (event) => {
      await stream.writeSSE({
        data: JSON.stringify(event),
        event: event.eventType,
        id: event.id,
      });
    });

    stream.onAbort(() => {
      unsubscribe();
    });
  });
});
```

### Anti-Patterns to Avoid
- **Polling instead of SSE:** Dashboard should use existing SSE infrastructure, not polling
- **Aggregating stats on every request:** Cache period stats, invalidate on relevant events
- **Loading all activity at once:** Use pagination with "load more" pattern
- **Single monolithic dashboard view:** Split into composable components for maintainability

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Real-time updates | Custom WebSocket | Existing SSE + Redis pub/sub | Already implemented, battle-tested |
| Time period calculations | Manual date math | Date utilities with timezone | Israel timezone handling is tricky |
| Chart rendering | Canvas drawing | Chart.js | Handles responsiveness, tooltips, animations |
| Activity event storage | New event system | Existing activity_events table | Schema already exists with indexes |
| Notification delivery | Custom queue | Existing WhatsApp + BullMQ | Already handles retries, rate limits |

**Key insight:** Phase 1, 3, and 5 already built the real-time infrastructure (SSE, Redis pub/sub, activity events). This phase extends those patterns rather than creating new ones.

## Common Pitfalls

### Pitfall 1: SSE Connection Limits
**What goes wrong:** Browser limits concurrent SSE connections to same domain (typically 6)
**Why it happens:** Each dashboard tab opens new SSE connection
**How to avoid:** Single SSE endpoint for all dashboard updates; use event types to differentiate
**Warning signs:** Dashboard stops updating in some tabs

### Pitfall 2: Stats Query Performance
**What goes wrong:** Slow dashboard load due to complex aggregation queries
**Why it happens:** Counting across large tables for each request
**How to avoid:**
- Use existing metricSnapshots table for historical data
- Cache today's stats in Redis with 5-minute TTL
- Pre-aggregate in background worker
**Warning signs:** Dashboard takes >2s to load

### Pitfall 3: Activity Feed Memory
**What goes wrong:** Client memory grows unbounded as events stream in
**Why it happens:** Never removing old events from DOM
**How to avoid:** Virtual scrolling or hard limit (e.g., keep last 100 events in memory)
**Warning signs:** Browser tab becomes sluggish after hours

### Pitfall 4: Settings Save Race Conditions
**What goes wrong:** Concurrent settings updates overwrite each other
**Why it happens:** Multiple tabs or WhatsApp + dashboard simultaneous edits
**How to avoid:** Optimistic locking with updatedAt check, or last-write-wins with activity log
**Warning signs:** User reports settings "resetting"

### Pitfall 5: Notification Preference Complexity
**What goes wrong:** Preferences become impossible to manage
**Why it happens:** Too many options, no sensible defaults
**How to avoid:**
- Per CONTEXT.md: Granular but with smart defaults
- Group notifications by category (leads, reviews, content, system)
- Default to "notify all" with opt-out per type
**Warning signs:** Users complain about too many or too few notifications

### Pitfall 6: Hebrew RTL Layout Issues
**What goes wrong:** Charts, graphs, or activity feed display incorrectly
**Why it happens:** LTR assumptions in Chart.js or CSS
**How to avoid:**
- Set `dir="rtl"` on html element (already in codebase)
- Use Tailwind RTL utilities
- Test Chart.js with Hebrew labels
**Warning signs:** Numbers appear backwards, alignment issues

## Code Examples

Verified patterns from official sources and existing codebase:

### Dashboard Stats API Endpoint
```typescript
// Pattern: Period-based stats aggregation
dashboardRoutes.get('/stats', async (c) => {
  const tenant = c.get('tenant');
  const period = c.req.query('period') as TimePeriod || 'today';

  const { start, end } = getDateRange(period, tenant.timezone);

  // Parallel queries
  const [missedCalls, whatsappSent, newReviews, currentRating] = await Promise.all([
    db.select({ count: sql<number>`count(*)` })
      .from(missedCalls)
      .where(and(
        eq(missedCalls.tenantId, tenant.tenantId),
        gte(missedCalls.calledAt, start),
        lte(missedCalls.calledAt, end)
      )),
    // ... similar for other stats
  ]);

  return c.json({
    period,
    stats: {
      missedCalls: missedCalls[0].count,
      whatsappSent: whatsappSent[0].count,
      newReviews: newReviews[0].count,
      currentRating: currentRating,
    },
  });
});
```

### Health Status Component HTML
```typescript
// Source: Existing pattern from src/views/metrics-dashboard.ts
export function renderHealthStatus(health: HealthStatus): string {
  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const icons = {
    ok: '&#10003;',      // Checkmark
    warning: '&#9888;',  // Warning triangle
    error: '&#10007;',   // X mark
  };

  return `
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full ${colors[health.overall]} flex items-center justify-center">
          <span class="text-white text-2xl">${health.overall === 'green' ? icons.ok : health.overall === 'yellow' ? icons.warning : icons.error}</span>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800">
            ${health.overall === 'green' ? 'הכל תקין' : health.overall === 'yellow' ? 'יש להתייחס' : 'נדרשת פעולה'}
          </h2>
          <div class="flex gap-4 mt-2 text-sm">
            ${Object.entries(health.components).map(([name, comp]) => `
              <span class="${comp.status === 'ok' ? 'text-green-600' : comp.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}">
                ${name === 'whatsapp' ? 'WhatsApp' : name === 'google' ? 'Google' : 'ביקורות'}
                ${icons[comp.status]}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
```

### Chart.js Line Chart for Reports
```typescript
// Source: Chart.js documentation, adapted for Hebrew RTL
export function renderReportsPage(tenantId: string): string {
  return `
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4">מגמות ביצועים</h2>
      <div class="h-64">
        <canvas id="trendsChart"></canvas>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      async function loadTrends() {
        const res = await fetch('/api/dashboard/trends?tenantId=${tenantId}');
        const data = await res.json();

        new Chart(document.getElementById('trendsChart'), {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [{
              label: 'ביקורות',
              data: data.reviews,
              borderColor: '#3b82f6',
              tension: 0.3,
            }, {
              label: 'לידים',
              data: data.leads,
              borderColor: '#10b981',
              tension: 0.3,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                rtl: true,
                textDirection: 'rtl',
              }
            },
            scales: {
              y: {
                beginAtZero: true,
              }
            }
          }
        });
      }
      loadTrends();
    </script>
  `;
}
```

### Notification Preferences Schema
```typescript
// New schema for granular notification preferences
export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // Lead notifications
  notifyNewLead: boolean('notify_new_lead').notNull().default(true),
  notifyLeadQualified: boolean('notify_lead_qualified').notNull().default(true),
  notifyLeadUnresponsive: boolean('notify_lead_unresponsive').notNull().default(true),

  // Review notifications
  notifyNewReview: boolean('notify_new_review').notNull().default(true),
  notifyNegativeReview: boolean('notify_negative_review').notNull().default(true),  // Always on for approval
  notifyReviewPosted: boolean('notify_review_posted').notNull().default(false),

  // Content notifications
  notifyPhotoRequest: boolean('notify_photo_request').notNull().default(true),
  notifyPostApproval: boolean('notify_post_approval').notNull().default(true),

  // System notifications
  notifySystemAlert: boolean('notify_system_alert').notNull().default(true),
  notifyWeeklyReport: boolean('notify_weekly_report').notNull().default(true),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Polling for updates | SSE with Redis pub/sub | Already in codebase | Real-time without polling overhead |
| WebSockets for bidirectional | SSE for server-to-client | Industry trend 2024+ | Simpler, better HTTP/2 support |
| Complex charting libraries | Chart.js via CDN | Stable | Quick integration without build step |
| Template-based responses | Claude-generated text | Existing pattern | No template editing needed in settings |

**Deprecated/outdated:**
- Long polling: Replaced by SSE in this codebase
- Custom notification systems: WhatsApp Business API handles delivery

## Open Questions

Things that couldn't be fully resolved:

1. **Chatbot questions storage format**
   - What we know: Owner can customize chatbot questions per CONTEXT.md
   - What's unclear: JSON structure for questions, validation rules
   - Recommendation: Simple JSON array with question text and expected type (text, phone, etc.)

2. **Reports data granularity**
   - What we know: Weekly/monthly reports with graphs per CONTEXT.md
   - What's unclear: How many weeks to show, rolling vs calendar months
   - Recommendation: Last 8 weeks for weekly, last 6 months for monthly (matches existing metricSnapshots)

3. **Dashboard link from WhatsApp**
   - What we know: Per CONTEXT.md "Links in WhatsApp only for complex actions"
   - What's unclear: Authentication for direct links, session handling
   - Recommendation: Use existing tenant auth mechanism, short-lived tokens in links

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/routes/activity.ts` - SSE streaming pattern
- Existing codebase: `src/views/metrics-dashboard.ts` - Server-side HTML rendering
- Existing codebase: `src/db/schema/activity-events.ts` - Activity schema
- Existing codebase: `src/db/schema/optimization.ts` - Metrics schema
- [Hono Streaming Helper](https://hono.dev/docs/helpers/streaming) - SSE API

### Secondary (MEDIUM confidence)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/getting-started/) - Chart integration
- [Carbon Design System Status Indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/) - Traffic light pattern
- [SuprSend Activity Feed](https://www.suprsend.com/post/activity-feed) - Activity feed design patterns

### Tertiary (LOW confidence)
- WebSearch results on dashboard patterns - General guidance only

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing codebase patterns, no new dependencies
- Architecture: HIGH - Extending established patterns (SSE, views, services)
- Pitfalls: MEDIUM - Based on common patterns and existing code analysis

**Research date:** 2026-01-29
**Valid until:** 60 days (stable patterns, existing infrastructure)
