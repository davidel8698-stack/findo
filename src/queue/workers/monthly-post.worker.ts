import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { tenants, googleConnections, whatsappConnections, postRequests } from '../../db/schema/index';
import { eq, and, isNull } from 'drizzle-orm';
import { createWhatsAppClient } from '../../services/whatsapp/client';
import { sendTextMessage } from '../../services/whatsapp/messages';
import { type ScheduledJobData } from '../queues';

/**
 * Sleep helper for rate limiting.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get current month/year for tracking.
 */
function getCurrentMonth(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // 1-12
    year: now.getFullYear(),
  };
}

/**
 * Process monthly-post job.
 *
 * For each active tenant with both WhatsApp AND Google connections:
 * - Check if request already sent this month (idempotency via month/year)
 * - Send compelling Hebrew WhatsApp message explaining benefits of fresh posts
 * - Create postRequests record with status='requested'
 * - 100ms delay between tenants (rate limit protection)
 *
 * Per CONTEXT.md:
 * - Include compelling explanation of why fresh posts matter
 * - Owner can provide content or request AI generation
 * - Reminder sequence if no response
 */
async function processMonthlyPost(): Promise<void> {
  console.log('[monthly-post] Starting monthly post request cycle');

  const { month, year } = getCurrentMonth();
  console.log(`[monthly-post] Current month: ${month}/${year}`);

  // Get all active tenants
  const activeTenants = await db.query.tenants.findMany({
    where: and(
      eq(tenants.status, 'active'),
      isNull(tenants.deletedAt)
    ),
  });

  console.log(`[monthly-post] Found ${activeTenants.length} active tenants`);

  let sentCount = 0;
  let skippedCount = 0;

  for (const tenant of activeTenants) {
    try {
      // Check for active WhatsApp connection
      const waConnection = await db.query.whatsappConnections.findFirst({
        where: and(
          eq(whatsappConnections.tenantId, tenant.id),
          eq(whatsappConnections.status, 'active')
        ),
      });

      if (!waConnection) {
        console.log(`[monthly-post] Tenant ${tenant.id} has no active WhatsApp connection, skipping`);
        skippedCount++;
        continue;
      }

      // Check for active Google connection
      const googleConnection = await db.query.googleConnections.findFirst({
        where: and(
          eq(googleConnections.tenantId, tenant.id),
          eq(googleConnections.status, 'active')
        ),
      });

      if (!googleConnection) {
        console.log(`[monthly-post] Tenant ${tenant.id} has no active Google connection, skipping`);
        skippedCount++;
        continue;
      }

      // Check if we need owner phone for sending
      if (!tenant.ownerPhone) {
        console.log(`[monthly-post] Tenant ${tenant.id} has no owner phone, skipping`);
        skippedCount++;
        continue;
      }

      // Check if request already exists for this month (idempotency)
      const existingRequest = await db.query.postRequests.findFirst({
        where: and(
          eq(postRequests.tenantId, tenant.id),
          eq(postRequests.month, month),
          eq(postRequests.year, year),
          isNull(postRequests.deletedAt)
        ),
      });

      if (existingRequest) {
        console.log(`[monthly-post] Tenant ${tenant.id} already has request for ${month}/${year}, skipping`);
        skippedCount++;
        continue;
      }

      // Create WhatsApp client
      const client = await createWhatsAppClient(tenant.id);
      if (!client) {
        console.log(`[monthly-post] Could not create WhatsApp client for tenant ${tenant.id}, skipping`);
        skippedCount++;
        continue;
      }

      // Send WhatsApp with compelling explanation
      // Per CONTEXT.md: Include why fresh posts matter, offer options
      const message =
        `היי! הגיע הזמן לפוסט חודשי בגוגל.\n\n` +
        `למה זה חשוב?\n` +
        `- עסקים עם פוסטים פעילים מקבלים 35% יותר צפיות בגוגל\n` +
        `- לקוחות רואים שהעסק פעיל ומעודכן\n` +
        `- זה עוזר לדירוג בחיפוש המקומי\n\n` +
        `מה תרצה לעשות?\n` +
        `1. שלח לי טקסט ואכין פוסט ממנו\n` +
        `2. שלח "AI" ואני אכין משהו מעולה בשבילך\n` +
        `3. שלח "דלג" אם לא הפעם`;

      await sendTextMessage(client, tenant.ownerPhone, message);

      // Create post request record
      await db.insert(postRequests).values({
        tenantId: tenant.id,
        status: 'requested',
        month,
        year,
        requestedAt: new Date(),
      });

      console.log(`[monthly-post] Sent request to tenant ${tenant.id} (${tenant.businessName})`);
      sentCount++;

      // Rate limit protection - 100ms delay between tenants
      await sleep(100);
    } catch (error) {
      console.error(`[monthly-post] Error for tenant ${tenant.id}:`, error);
      // Continue with other tenants - don't fail entire job
    }
  }

  console.log(`[monthly-post] Completed: ${sentCount} sent, ${skippedCount} skipped`);
}

/**
 * Start the monthly post request worker.
 *
 * Listens on 'scheduled' queue and handles:
 * - 'monthly-post' jobs: Monthly promotional post request (1st of month at 10:00 AM Israel)
 *
 * @returns The worker instance (for cleanup on shutdown)
 */
export function startMonthlyPostWorker(): Worker<ScheduledJobData> {
  const worker = new Worker<ScheduledJobData>(
    'scheduled',
    async (job: Job<ScheduledJobData>) => {
      // Handle monthly-post jobs only
      if (job.data.jobType === 'monthly-post') {
        await processMonthlyPost();
        return;
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 1, // Single worker for monthly job
    }
  );

  worker.on('completed', (job) => {
    if (job.data.jobType === 'monthly-post') {
      console.log(`[monthly-post] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.data.jobType === 'monthly-post') {
      console.error(`[monthly-post] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[monthly-post] Worker started');
  return worker;
}

// Export for worker registration
export { processMonthlyPost };
