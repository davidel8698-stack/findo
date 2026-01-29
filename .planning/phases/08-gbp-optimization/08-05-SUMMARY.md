---
phase: 08-gbp-optimization
plan: 05
subsystem: optimization
tags: [alerts, whatsapp, hebrew, performance-monitoring]

dependency-graph:
  requires: ["08-03"]
  provides: ["alert-detection", "review-rate-alerts"]
  affects: ["08-07"]

tech-stack:
  added: []
  patterns: ["threshold-based-alerts", "hebrew-notifications", "batch-processing"]

key-files:
  created:
    - src/services/optimization/alert-detector.ts
  modified:
    - src/services/optimization/index.ts
    - src/queue/workers/metrics-collection.worker.ts

decisions:
  - id: alert-threshold-30
    choice: "30% drop threshold for alerts"
    rationale: "Significant enough to indicate real problem, not noise"
  - id: min-samples-4
    choice: "4+ weeks baseline data required"
    rationale: "Statistical validity before alerting"
  - id: text-message-alerts
    choice: "Text message over template for alerts"
    rationale: "Owner messages Findo regularly, likely in session window"
  - id: hebrew-with-suggestions
    choice: "Hebrew message with actionable suggestions"
    rationale: "Israeli market, owner needs clear next steps"

metrics:
  duration: ~4 min
  completed: 2026-01-29
---

# Phase 08 Plan 05: Alert Detection Summary

**One-liner:** Review rate drop alerts via WhatsApp with 30% threshold and actionable Hebrew suggestions.

## What Was Built

### Alert Detector Service (`alert-detector.ts`)

Core service that monitors review performance and sends WhatsApp alerts when drops detected:

**Key Functions:**
- `checkForAlerts(tenantId)` - Compares current snapshot to baseline, triggers alert if 30%+ drop
- `sendReviewRateAlert(tenantId, ownerPhone, ...)` - Sends Hebrew WhatsApp notification
- `checkAlertsForAllTenants()` - Batch processing for all eligible tenants
- `composeAlertMessage(...)` - Formats Hebrew message with stats and suggestions

**Alert Conditions:**
- Tenant has 4+ weeks of baseline data (samplesCount >= 4)
- Current review rate is 30%+ below baseline
- Tenant has ownerPhone set
- Tenant is active or trial status

**Hebrew Message Content:**
```
Key metrics (current vs baseline)
Three actionable suggestions:
1. Send more review requests to happy customers
2. Verify WhatsApp is active and sending
3. Increase closed transactions
```

### Worker Integration

Metrics collection worker now runs alert check after collecting metrics:

```typescript
// Step 1: Collect metrics
const metricsResult = await collectMetricsForAllTenants();

// Step 2: Check for alerts
const alertsResult = await checkAlertsForAllTenants();
```

Returns combined result with both metrics and alerts counts.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Alert threshold | 30% drop | Significant indicator without false positives |
| Minimum baseline | 4 weeks | Statistical validity |
| Message delivery | Text message | Owner likely in session window |
| Message language | Hebrew with suggestions | Israeli market, clear next steps |
| Rate limiting | 100ms between tenants | Consistent with other workers |

## Verification Results

1. Alert service exists: src/services/optimization/alert-detector.ts
2. Integrated with worker: checkAlertsForAllTenants imported and called
3. Exports available: alert-detector.ts exported from index.ts

## Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| `src/services/optimization/alert-detector.ts` | Created | Alert detection and WhatsApp notifications |
| `src/services/optimization/index.ts` | Modified | Export alert detector module |
| `src/queue/workers/metrics-collection.worker.ts` | Modified | Integrate alert check after metrics |

## Deviations from Plan

None - plan executed exactly as written.

## Links Established

| From | To | Via | Pattern |
|------|-----|-----|---------|
| alert-detector.ts | whatsapp/client.ts | WhatsApp message sending | sendTextMessage |
| metrics-collection.worker.ts | alert-detector.ts | alert check after collection | checkAlertsForAllTenants |

## Next Phase Readiness

**Ready for:**
- 08-06: Dashboard Enhancements (can display alert status)
- 08-07: Worker Registration (need to register metrics-collection job)

**No blockers identified.**
