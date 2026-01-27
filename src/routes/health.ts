import { Hono } from 'hono';
import { db } from '../db/index';
import { getRedis } from '../lib/redis';
import { sql } from 'drizzle-orm';

export const healthRoutes = new Hono();

/**
 * Basic health check - always returns 200.
 * GET /health
 */
healthRoutes.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Deep health check - verifies database and Redis connections.
 * GET /health/deep
 */
healthRoutes.get('/deep', async (c) => {
  const checks: Record<string, { status: string; latency_ms?: number; error?: string }> = {};

  // Check database
  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    checks.database = {
      status: 'ok',
      latency_ms: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Check Redis
  try {
    const redisStart = Date.now();
    const redis = getRedis();
    await redis.ping();
    checks.redis = {
      status: 'ok',
      latency_ms: Date.now() - redisStart,
    };
  } catch (error) {
    checks.redis = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Overall status
  const allOk = Object.values(checks).every((c) => c.status === 'ok');

  return c.json({
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  }, allOk ? 200 : 503);
});
