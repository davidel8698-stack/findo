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

// Export for direct access (used by BullMQ)
export { Redis };
