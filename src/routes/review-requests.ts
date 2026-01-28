import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/index';
import { reviewRequests } from '../db/schema/index';
import { reviewRequestQueue } from '../queue/queues';
import type { TenantContext } from '../types/tenant-context';

const app = new Hono<{ Variables: { tenant: TenantContext } }>();

/**
 * Schema for manual review request creation.
 */
const createRequestSchema = z.object({
  customerPhone: z.string().min(9).max(20),
  customerName: z.string().min(1).max(255).optional(),
  customerEmail: z.string().email().max(255).optional(),
});

/**
 * Normalize phone number to +972 format.
 * Handles common Israeli phone formats:
 * - 0501234567 -> +972501234567
 * - 972501234567 -> +972501234567
 * - +972501234567 -> +972501234567
 */
function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  if (cleaned.startsWith('972')) {
    return `+${cleaned}`;
  }
  // Remove leading 0 and add +972
  return `+972${cleaned.replace(/^0/, '')}`;
}

/**
 * POST /api/review-requests/manual
 * Create a manual review request (for customers not detected via invoice).
 *
 * Body:
 * - customerPhone: string (required, any Israeli phone format)
 * - customerName: string (optional)
 * - customerEmail: string (optional)
 *
 * Response:
 * - 201: { id, scheduledFor } - Request created
 * - 400: Validation error
 * - 409: Duplicate (already requested for this phone recently)
 */
app.post(
  '/manual',
  zValidator('json', createRequestSchema),
  async (c) => {
    const tenant = c.get('tenant');
    const tenantId = tenant.tenantId;
    const { customerPhone, customerName, customerEmail } = c.req.valid('json');

    // Normalize phone to +972 format
    const normalizedPhone = normalizePhone(customerPhone);

    // Check for recent duplicate (same phone in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRequest = await db.query.reviewRequests.findFirst({
      where: (t, { and, eq, gt }) => and(
        eq(t.tenantId, tenantId),
        eq(t.customerPhone, normalizedPhone),
        gt(t.createdAt, sevenDaysAgo)
      ),
    });

    if (recentRequest) {
      return c.json(
        { error: 'Review request already sent to this customer recently' },
        409
      );
    }

    // Calculate scheduled time (24 hours per REVW-04)
    const scheduledForAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create review request record
    const [request] = await db.insert(reviewRequests).values({
      tenantId,
      source: 'manual',
      customerPhone: normalizedPhone,
      customerName: customerName || null,
      customerEmail: customerEmail || null,
      status: 'pending',
      scheduledForAt,
    }).returning();

    // Schedule delayed job (24 hours)
    await reviewRequestQueue.add(
      'send-review-request',
      { reviewRequestId: request.id },
      {
        delay: 24 * 60 * 60 * 1000,
        jobId: `review-req-${request.id}`,
        removeOnComplete: true,
      }
    );

    console.log(
      `[review-request] Manual request created for ${normalizedPhone}, scheduled in 24h`
    );

    return c.json({
      id: request.id,
      scheduledFor: scheduledForAt.toISOString(),
    }, 201);
  }
);

/**
 * GET /api/review-requests
 * List review requests for the tenant.
 *
 * Query params:
 * - status: Filter by status (optional)
 * - limit: Number of results (default 50, max 100)
 *
 * Response: Array of review request objects
 */
app.get('/', async (c) => {
  const tenant = c.get('tenant');
  const tenantId = tenant.tenantId;
  const status = c.req.query('status');
  const limitParam = c.req.query('limit');
  const limit = Math.min(parseInt(limitParam || '50', 10), 100);

  const requests = await db.query.reviewRequests.findMany({
    where: (t, { and, eq }) => {
      const conditions = [eq(t.tenantId, tenantId)];
      if (status) {
        conditions.push(eq(t.status, status as typeof t.status.enumValues[number]));
      }
      return and(...conditions);
    },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    limit,
  });

  return c.json(requests);
});

export const reviewRequestRoutes = app;
