import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { db } from '../db/index';
import { tenants } from '../db/schema/index';
import { eq, sql } from 'drizzle-orm';
import type { TenantContext } from '../types/tenant-context';

/**
 * Sets the tenant context for RLS at the database level.
 * Must be called before any database queries.
 */
export async function setTenantContext(tenantId: string): Promise<void> {
  await db.execute(sql`SELECT set_tenant_context(${tenantId}::uuid)`);
}

/**
 * Clears tenant context (useful for admin operations or between requests in pooled connections)
 */
export async function clearTenantContext(): Promise<void> {
  await db.execute(sql`RESET app.current_tenant`);
}

/**
 * Tenant context middleware for API requests.
 *
 * Extracts tenant ID from:
 * 1. X-Tenant-ID header (for internal/service calls)
 * 2. JWT claims (for authenticated user requests) - to be implemented with Clerk
 *
 * Sets RLS context and loads tenant info into request context.
 */
export const tenantContext = createMiddleware(async (c, next) => {
  // Extract tenant ID from header (temporary until Clerk auth is added)
  // In production, this will come from JWT claims
  const tenantId = c.req.header('X-Tenant-ID');

  if (!tenantId) {
    throw new HTTPException(401, {
      message: 'Tenant context required. Provide X-Tenant-ID header.',
    });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(tenantId)) {
    throw new HTTPException(400, {
      message: 'Invalid tenant ID format. Must be a valid UUID.',
    });
  }

  try {
    // Set RLS context BEFORE any queries
    await setTenantContext(tenantId);

    // Load tenant (will be filtered by RLS)
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (!tenant) {
      throw new HTTPException(404, {
        message: 'Tenant not found.',
      });
    }

    // Check tenant status
    if (tenant.status === 'cancelled') {
      throw new HTTPException(403, {
        message: 'Account has been cancelled.',
      });
    }

    // Set context for downstream handlers
    const context: TenantContext = {
      tenantId,
      tenant,
    };
    c.set('tenant', context);

    await next();
  } finally {
    // Clear context after request (important for connection pooling)
    await clearTenantContext();
  }
});

/**
 * Public routes middleware - allows requests without tenant context.
 * Useful for health checks, webhooks with own auth, etc.
 */
export const publicRoute = createMiddleware(async (c, next) => {
  // No tenant context required
  await next();
});

/**
 * Worker tenant context - for background jobs with tenant ID in job data.
 * Use this in BullMQ workers to set context from job payload.
 */
export async function withTenantContext<T>(
  tenantId: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    await setTenantContext(tenantId);
    return await fn();
  } finally {
    await clearTenantContext();
  }
}
