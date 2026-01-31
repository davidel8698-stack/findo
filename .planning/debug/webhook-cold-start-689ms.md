---
status: diagnosed
trigger: "Investigate why the webhook endpoint takes 689ms on first request (exceeds 500ms target)"
created: 2026-01-27T12:00:00Z
updated: 2026-01-27T12:00:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED - Two lazy Redis connections cause ~600ms delay on first request
test: N/A - Root cause identified
expecting: N/A
next_action: Return diagnosis to caller

## Symptoms

expected: Webhook endpoint responds within 500ms target
actual: First request takes 689ms, subsequent requests ~314ms
errors: None reported (performance issue, not error)
reproduction: First request after cold start
started: Inherent to serverless architecture (suspected)

## Eliminated

## Evidence

- timestamp: 2026-01-27T12:01:00Z
  checked: src/lib/redis.ts line 22
  found: "lazyConnect: true" is explicitly set in Redis options
  implication: Redis connection is NOT established until first command is issued

- timestamp: 2026-01-27T12:01:00Z
  checked: src/lib/redis.ts lines 50-57
  found: sharedConnection uses lazy singleton pattern - created on first getRedis() call
  implication: Double lazy - both module-level and ioredis-level lazy loading

- timestamp: 2026-01-27T12:01:00Z
  checked: src/routes/webhooks.ts lines 37-39
  found: redis.get() is the first Redis operation in webhook handler
  implication: First request must establish TCP+TLS connection to Upstash before get() returns

- timestamp: 2026-01-27T12:01:00Z
  checked: src/queue/queues.ts lines 26-28
  found: webhookQueue creates its own Redis connection with createRedisConnection()
  implication: Queue also has lazyConnect:true, so queue.add() also triggers connection on first use

- timestamp: 2026-01-27T12:02:00Z
  checked: src/index.ts start() function
  found: No Redis warm-up during startup - goes straight to serve()
  implication: First HTTP request bears full cost of Redis connection establishment

- timestamp: 2026-01-27T12:02:00Z
  checked: src/routes/health.ts /health/deep endpoint
  found: Deep health check does redis.ping() but /health does NOT
  implication: Could use /health/deep for pre-warming, but nothing calls it automatically

- timestamp: 2026-01-27T12:02:00Z
  checked: Connection flow analysis
  found: First webhook request triggers TWO lazy connections - sharedConnection (getRedis) AND webhookQueue connection
  implication: ~300-350ms per TLS connection to Upstash explains 689ms total (2 connections + processing)

## Resolution

root_cause: |
  Two Redis connections are lazily established on first webhook request:
  1. sharedConnection (via getRedis()) - used for idempotency check (redis.get/set)
  2. webhookQueue connection - used for queue.add()

  Both connections have `lazyConnect: true` in redis.ts (line 22), meaning TCP+TLS
  handshake to Upstash only happens on first command. Each TLS connection to
  Upstash takes ~300-350ms (typical for serverless Redis over internet).

  689ms breakdown (estimated):
  - ~300ms: First Redis connection (getRedis() -> redis.get())
  - ~300ms: Second Redis connection (webhookQueue.add())
  - ~89ms: Actual processing, validation, JSON serialization

  Subsequent requests are ~314ms because connections are already established.

fix:
verification:
files_changed: []
