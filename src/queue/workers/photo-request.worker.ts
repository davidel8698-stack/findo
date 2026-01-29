import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { tenants, whatsappConnections, googleConnections, photoRequests } from '../../db/schema/index';
import { eq, and, isNull, lt } from 'drizzle-orm';
import { createWhatsAppClient } from '../../services/whatsapp/client';
import { sendTextMessage } from '../../services/whatsapp/messages';
import { shouldNotify, NotificationType } from '../../services/notification-gate';
import { type ScheduledJobData } from '../queues';

/**
 * Sleep helper for rate limiting.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get ISO week number and year for a given date.
 * Used for weekly deduplication of photo requests.
 *
 * @param date - Date to get ISO week for
 * @returns Object with week number (1-53) and year
 */
function getISOWeek(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week, year: d.getUTCFullYear() };
}

/**
 * Process weekly photo-request job.
 *
 * For each active tenant with both WhatsApp AND Google connections:
 * - Check if request already sent this week (idempotency via week/year)
 * - Send friendly Hebrew WhatsApp message asking for 1-2 photos
 * - Create photoRequests record with status='sent'
 * - 100ms delay between tenants (rate limit protection)
 *
 * Per CONTEXT.md: Weekly requests on Thursday (end of Israeli work week),
 * casual/friendly tone in Hebrew.
 */
async function processPhotoRequest(): Promise<void> {
  console.log('[photo-request] Starting weekly photo request job');

  const now = new Date();
  const { week, year } = getISOWeek(now);
  console.log(`[photo-request] Current ISO week: ${week}, year: ${year}`);

  // Get all active tenants with their connections
  const activeTenants = await db.query.tenants.findMany({
    where: and(
      eq(tenants.status, 'active'),
      isNull(tenants.deletedAt)
    ),
  });

  console.log(`[photo-request] Found ${activeTenants.length} active tenants`);

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
        console.log(`[photo-request] Tenant ${tenant.id} has no active WhatsApp connection, skipping`);
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
        console.log(`[photo-request] Tenant ${tenant.id} has no active Google connection, skipping`);
        skippedCount++;
        continue;
      }

      // Check if we need owner phone for sending
      if (!tenant.ownerPhone) {
        console.log(`[photo-request] Tenant ${tenant.id} has no owner phone, skipping`);
        skippedCount++;
        continue;
      }

      // Check if request already sent this week (idempotency)
      const existingRequest = await db.query.photoRequests.findFirst({
        where: and(
          eq(photoRequests.tenantId, tenant.id),
          eq(photoRequests.week, week),
          eq(photoRequests.year, year),
          isNull(photoRequests.deletedAt)
        ),
      });

      if (existingRequest) {
        console.log(`[photo-request] Tenant ${tenant.id} already has request for week ${week}/${year}, skipping`);
        skippedCount++;
        continue;
      }

      // Check notification preferences
      const shouldSend = await shouldNotify(tenant.id, NotificationType.PHOTO_REQUEST);
      if (!shouldSend) {
        console.log(`[photo-request] Skipping notification for tenant ${tenant.id} (preference disabled)`);
        // Still create photo_request record so owner can see request in dashboard
        await db.insert(photoRequests).values({
          tenantId: tenant.id,
          status: 'sent',
          requestedAt: now,
          week,
          year,
        });
        skippedCount++;
        continue;
      }

      // Create WhatsApp client
      const client = await createWhatsAppClient(tenant.id);
      if (!client) {
        console.log(`[photo-request] Could not create WhatsApp client for tenant ${tenant.id}, skipping`);
        skippedCount++;
        continue;
      }

      // Send friendly Hebrew message asking for photos
      // Per CONTEXT.md: casual/friendly tone, request 1-2 photos
      const message = `היי! איך היה השבוע?
שלח 1-2 תמונות מהשבוע - זה עוזר ללקוחות חדשים לראות מה קורה אצלך ומשפר את הדירוג בגוגל.`;

      await sendTextMessage(client, tenant.ownerPhone, message);

      // Create photo request record
      await db.insert(photoRequests).values({
        tenantId: tenant.id,
        status: 'sent',
        requestedAt: now,
        week,
        year,
      });

      console.log(`[photo-request] Sent photo request to tenant ${tenant.id} (${tenant.businessName})`);
      sentCount++;

      // Rate limit protection - 100ms delay between tenants
      await sleep(100);
    } catch (error) {
      console.error(`[photo-request] Error for tenant ${tenant.id}:`, error);
      // Continue with other tenants - don't fail entire job
    }
  }

  console.log(`[photo-request] Completed weekly photo request: ${sentCount} sent, ${skippedCount} skipped`);
}

/**
 * Process photo-reminder job.
 *
 * Finds photo requests where:
 * - status = 'sent' (no photos received yet)
 * - reminderSentAt IS NULL (no reminder sent yet)
 * - requestedAt < 2 days ago (enough time passed)
 *
 * Per CONTEXT.md: "One reminder after 2 days if no response, then skip until next week"
 */
async function processPhotoReminder(): Promise<void> {
  console.log('[photo-reminder] Starting photo reminder job');

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  // Find requests that need reminders
  const requestsNeedingReminder = await db.query.photoRequests.findMany({
    where: and(
      eq(photoRequests.status, 'sent'),
      isNull(photoRequests.reminderSentAt),
      lt(photoRequests.requestedAt, twoDaysAgo),
      isNull(photoRequests.deletedAt)
    ),
  });

  console.log(`[photo-reminder] Found ${requestsNeedingReminder.length} requests needing reminder`);

  let sentCount = 0;

  for (const request of requestsNeedingReminder) {
    try {
      // Get tenant info
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, request.tenantId),
      });

      if (!tenant || !tenant.ownerPhone) {
        console.log(`[photo-reminder] Tenant ${request.tenantId} not found or no phone, skipping`);
        continue;
      }

      // Check notification preferences
      const shouldSend = await shouldNotify(request.tenantId, NotificationType.PHOTO_REQUEST);
      if (!shouldSend) {
        console.log(`[photo-reminder] Skipping reminder for tenant ${request.tenantId} (preference disabled)`);
        // Update reminderSentAt to avoid re-checking this request
        await db
          .update(photoRequests)
          .set({ reminderSentAt: now, updatedAt: now })
          .where(eq(photoRequests.id, request.id));
        continue;
      }

      // Create WhatsApp client
      const client = await createWhatsAppClient(request.tenantId);
      if (!client) {
        console.log(`[photo-reminder] Could not create WhatsApp client for tenant ${request.tenantId}, skipping`);
        continue;
      }

      // Send gentle reminder in Hebrew
      // Per CONTEXT.md: friendly tone, low pressure
      const reminderMessage = `היי, רק תזכורת קטנה - יש לך תמונות מהשבוע? אפילו אחת או שתיים יעזרו.
אם לא הספקת, אין בעיה - נמשיך בשבוע הבא!`;

      await sendTextMessage(client, tenant.ownerPhone, reminderMessage);

      // Update reminderSentAt timestamp
      await db
        .update(photoRequests)
        .set({ reminderSentAt: now, updatedAt: now })
        .where(eq(photoRequests.id, request.id));

      console.log(`[photo-reminder] Sent reminder for request ${request.id} to tenant ${request.tenantId}`);
      sentCount++;

      // Rate limit protection - 100ms delay between tenants
      await sleep(100);
    } catch (error) {
      console.error(`[photo-reminder] Error for request ${request.id}:`, error);
      // Continue with other requests - don't fail entire job
    }
  }

  // Also handle expiration: mark old requests as expired
  // Requests are expired if 7 days have passed since the request
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const expiredCount = await db
    .update(photoRequests)
    .set({ status: 'expired', updatedAt: now })
    .where(and(
      eq(photoRequests.status, 'sent'),
      lt(photoRequests.requestedAt, sevenDaysAgo),
      isNull(photoRequests.deletedAt)
    ))
    .then(() => 0) // drizzle doesn't return count for update, return 0 for logging
    .catch((error) => {
      console.error('[photo-reminder] Error expiring old requests:', error);
      return 0;
    });

  console.log(`[photo-reminder] Completed: ${sentCount} reminders sent, expired old requests`);
}

/**
 * Start the photo request worker.
 *
 * Listens on 'scheduled' queue and handles:
 * - 'photo-request' jobs: Weekly photo request (Thursday 10:00 AM Israel)
 * - 'photo-reminder' jobs: Photo reminder (Saturday 10:00 AM Israel)
 *
 * @returns The worker instance (for cleanup on shutdown)
 */
export function startPhotoRequestWorker(): Worker<ScheduledJobData> {
  const worker = new Worker<ScheduledJobData>(
    'scheduled',
    async (job: Job<ScheduledJobData>) => {
      // Handle photo-request jobs
      if (job.data.jobType === 'photo-request') {
        await processPhotoRequest();
        return;
      }

      // Handle photo-reminder jobs
      if (job.data.jobType === 'photo-reminder') {
        await processPhotoReminder();
        return;
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 1, // Single worker to respect API rate limits
    }
  );

  worker.on('completed', (job) => {
    if (job.data.jobType === 'photo-request' || job.data.jobType === 'photo-reminder') {
      console.log(`[photo-request] Job ${job.id} (${job.data.jobType}) completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.data.jobType === 'photo-request' || job?.data.jobType === 'photo-reminder') {
      console.error(`[photo-request] Job ${job.id} (${job.data.jobType}) failed:`, err.message);
    }
  });

  console.log('[photo-request] Worker started');
  return worker;
}

// Export for worker registration
export { processPhotoRequest, processPhotoReminder };
