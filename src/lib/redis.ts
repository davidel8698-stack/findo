import { Redis, RedisOptions } from 'ioredis';

/**
 * Parse Upstash Redis URL to connection options.
 * Upstash format: redis://default:token@endpoint:port
 */
function parseRedisUrl(url: string): RedisOptions {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: parseInt(parsed.port, 10) || 6379,
    password: parsed.password || undefined,
    username: parsed.username !== 'default' ? parsed.username : undefined,
    // Upstash requires TLS
    tls: parsed.protocol === 'rediss:' || parsed.hostname.includes('upstash.io')
      ? { rejectUnauthorized: false }
      : undefined,
    // Connection settings optimized for serverless
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
    lazyConnect: true,
  };
}

/**
 * Get Redis URL from environment.
 */
function getRedisUrl(): string {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL environment variable is required');
  }
  return url;
}

/**
 * Create a new Redis connection.
 * Use this for BullMQ queues and workers (they need separate connections).
 */
export function createRedisConnection(): Redis {
  const options = parseRedisUrl(getRedisUrl());
  return new Redis(options);
}

/**
 * Shared Redis connection for general use (caching, pub/sub).
 * Do NOT use this for BullMQ - use createRedisConnection() instead.
 */
let sharedConnection: Redis | null = null;

export function getRedis(): Redis {
  if (!sharedConnection) {
    sharedConnection = createRedisConnection();
  }
  return sharedConnection;
}

/**
 * Close all Redis connections (for graceful shutdown).
 */
export async function closeRedisConnections(): Promise<void> {
  if (sharedConnection) {
    await sharedConnection.quit();
    sharedConnection = null;
  }
}

/**
 * Warm up Redis connections by executing a PING command.
 * Call this during startup to avoid cold start latency on first request.
 *
 * This establishes TCP+TLS connections eagerly instead of on first command.
 */
export async function warmUpConnections(): Promise<void> {
  const redis = getRedis();

  // Force connection establishment with PING
  const startTime = Date.now();
  await redis.ping();
  const elapsed = Date.now() - startTime;

  console.log(`[redis] Connection warmed up in ${elapsed}ms`);
}

// Export for direct access (used by BullMQ)
export { Redis };
