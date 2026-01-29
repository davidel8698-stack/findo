/**
 * Post Approval Worker
 *
 * Handles:
 * 1. post-generate: Generate AI draft and send to owner (notifications queue)
 * 2. post-publish: Publish approved post to GBP (notifications queue)
 * 3. post-reminder: Send reminders, auto-publish if no response (scheduled queue)
 *
 * Per CONTEXT.md reminder sequence:
 * 1. Initial request (monthly-post.worker)
 * 2. Reminders (multiple)
 * 3. AI creates safe content, sends for approval
 * 4. If still no response: publish safe content only
 */

import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { tenants, googleConnections, postRequests } from '../../db/schema/index';
import { eq, and, isNull } from 'drizzle-orm';
import { createWhatsAppClient, sendTextMessage } from '../../services/whatsapp';
import { generatePostContent, generateSafeAutoContent } from '../../services/gbp-content';
import { createPost } from '../../services/google/posts';
import { notificationQueue, type ScheduledJobData } from '../queues';

type NotificationPostJobData =
  | { jobType: 'post-generate'; tenantId: string; postRequestId: string; ownerContent?: string }
  | { jobType: 'post-publish'; tenantId: string; postRequestId: string };

// Reminder intervals (days from initial request)
const REMINDER_1_DAYS = 3;
const REMINDER_2_DAYS = 7;
const AUTO_PUBLISH_DAYS = 10;

/**
 * Sleep helper for rate limiting.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate AI draft and send to owner for approval.
 */
async function handleGenerate(data: { tenantId: string; postRequestId: string; ownerContent?: string }) {
  const { tenantId, postRequestId, ownerContent } = data;
  console.log(`[post-approval] Generating draft for ${postRequestId}`);

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) throw new Error(`Tenant ${tenantId} not found`);

  const [request] = await db.select().from(postRequests).where(eq(postRequests.id, postRequestId)).limit(1);
  if (!request) throw new Error(`Post request ${postRequestId} not found`);

  // Generate content
  const generated = await generatePostContent({
    businessName: tenant.businessName,
    businessType: tenant.businessType || 'business',
    ownerContent,
  });

  // Update request with draft
  await db
    .update(postRequests)
    .set({
      status: 'pending_approval',
      aiDraft: generated.summary,
      postType: generated.topicType,
      callToActionType: generated.callToActionType,
      isSafeContent: generated.isSafe,
      draftSentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(postRequests.id, postRequestId));

  // Send draft to owner
  if (tenant.ownerPhone) {
    const client = await createWhatsAppClient(tenantId);
    if (client) {
      const message =
        `הנה הטיוטה לפוסט החודשי:\n\n` +
        `"${generated.summary}"\n\n` +
        `מה אומר?\n` +
        `1. שלח "אשר" לפרסום\n` +
        `2. שלח טקסט חדש לשינוי\n` +
        `3. שלח "דלג" לביטול`;

      await sendTextMessage(client, tenant.ownerPhone, message);
    }
  }

  console.log(`[post-approval] Draft sent for ${postRequestId}`);
}

/**
 * Publish approved post to GBP.
 */
async function handlePublish(data: { tenantId: string; postRequestId: string }) {
  const { tenantId, postRequestId } = data;
  console.log(`[post-approval] Publishing post ${postRequestId}`);

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  if (!tenant) throw new Error(`Tenant ${tenantId} not found`);

  const [request] = await db.select().from(postRequests).where(eq(postRequests.id, postRequestId)).limit(1);
  if (!request) throw new Error(`Post request ${postRequestId} not found`);

  const [google] = await db
    .select()
    .from(googleConnections)
    .where(and(eq(googleConnections.tenantId, tenantId), eq(googleConnections.status, 'active')))
    .limit(1);

  if (!google) throw new Error(`No active Google connection for ${tenantId}`);
  if (!google.locationId) throw new Error(`No location ID configured for ${tenantId}`);

  const content = request.finalContent || request.aiDraft;
  if (!content) throw new Error('No content to publish');

  // Publish to GBP (locationId is validated above)
  const post = await createPost(tenantId, google.accountId, google.locationId!, {
    summary: content,
    topicType: (request.postType as 'STANDARD' | 'EVENT' | 'OFFER') || 'STANDARD',
    callToAction: request.callToActionType && request.callToActionUrl
      ? { actionType: request.callToActionType as any, url: request.callToActionUrl }
      : undefined,
  });

  // Update request
  await db
    .update(postRequests)
    .set({
      status: 'published',
      gbpPostId: post.postId,
      gbpPostState: post.state,
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(postRequests.id, postRequestId));

  // Notify owner
  if (tenant.ownerPhone) {
    const client = await createWhatsAppClient(tenantId);
    if (client) {
      await sendTextMessage(
        client,
        tenant.ownerPhone,
        `הפוסט פורסם בגוגל! יכול לקחת כמה שעות עד שיופיע בפרופיל.`
      );
    }
  }

  console.log(`[post-approval] Published ${post.postId} for ${tenantId}`);
}

/**
 * Send reminders for pending posts and auto-publish if no response.
 */
async function handleReminders() {
  console.log('[post-approval] Processing post reminders');
  const now = new Date();

  // Find pending requests that need reminders or auto-publish
  const pending = await db
    .select({
      request: postRequests,
      tenant: tenants,
    })
    .from(postRequests)
    .innerJoin(tenants, eq(tenants.id, postRequests.tenantId))
    .where(and(
      eq(postRequests.status, 'requested'),
      isNull(postRequests.deletedAt)
    ));

  for (const { request, tenant } of pending) {
    try {
      if (!request.requestedAt || !tenant.ownerPhone) continue;

      const daysSinceRequest = Math.floor(
        (now.getTime() - request.requestedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceRequest >= AUTO_PUBLISH_DAYS) {
        // Auto-publish safe content
        console.log(`[post-approval] Auto-publishing for ${tenant.id}`);

        const safeContent = await generateSafeAutoContent(
          tenant.businessName,
          tenant.businessType || 'business'
        );

        await db
          .update(postRequests)
          .set({
            status: 'auto_published',
            aiDraft: safeContent.summary,
            finalContent: safeContent.summary,
            isSafeContent: true,
            updatedAt: new Date(),
          })
          .where(eq(postRequests.id, request.id));

        // Queue for publish
        await notificationQueue.add('post-publish', {
          jobType: 'post-publish',
          tenantId: tenant.id,
          postRequestId: request.id,
        });

      } else if (daysSinceRequest >= REMINDER_2_DAYS && !request.reminder2SentAt) {
        // Send reminder 2 + generate AI draft
        console.log(`[post-approval] Reminder 2 + AI draft for ${tenant.id}`);

        const generated = await generateSafeAutoContent(
          tenant.businessName,
          tenant.businessType || 'business'
        );

        await db
          .update(postRequests)
          .set({
            status: 'pending_approval',
            aiDraft: generated.summary,
            isSafeContent: generated.isSafe,
            reminder2SentAt: new Date(),
            draftSentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(postRequests.id, request.id));

        const client = await createWhatsAppClient(tenant.id);
        if (client) {
          await sendTextMessage(
            client,
            tenant.ownerPhone,
            `היי, הכנתי לך טיוטה לפוסט החודשי:\n\n` +
            `"${generated.summary}"\n\n` +
            `שלח "אשר" לפרסום או טקסט אחר לשינוי.\n` +
            `אם לא תגיב, נפרסם את הטיוטה הזו בעוד כמה ימים.`
          );
        }

      } else if (daysSinceRequest >= REMINDER_1_DAYS && !request.reminder1SentAt) {
        // Send reminder 1
        console.log(`[post-approval] Reminder 1 for ${tenant.id}`);

        await db
          .update(postRequests)
          .set({
            reminder1SentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(postRequests.id, request.id));

        const client = await createWhatsAppClient(tenant.id);
        if (client) {
          await sendTextMessage(
            client,
            tenant.ownerPhone,
            `היי, תזכורת על הפוסט החודשי בגוגל.\n` +
            `שלח טקסט או "AI" ואכין משהו.\n` +
            `פוסטים פעילים משפרים את הדירוג שלך בחיפוש!`
          );
        }
      }

      // Rate limit
      await sleep(100);

    } catch (error) {
      console.error(`[post-approval] Error for ${tenant.id}:`, error);
    }
  }
}

/**
 * Start the post approval worker.
 *
 * Returns two workers:
 * 1. Notifications worker: Handles post-generate and post-publish jobs
 * 2. Scheduled worker: Handles post-reminder jobs
 */
export function startPostApprovalWorker(): { notificationWorker: Worker<NotificationPostJobData>; scheduledWorker: Worker<ScheduledJobData> } {
  // Worker for notifications queue (post-generate, post-publish)
  const notificationWorker = new Worker<NotificationPostJobData>(
    'notifications',
    async (job: Job<NotificationPostJobData>) => {
      // Filter to only post-related jobs
      if (!job.data.jobType?.startsWith('post-')) return;

      const { jobType } = job.data;

      switch (jobType) {
        case 'post-generate':
          await handleGenerate(job.data);
          break;
        case 'post-publish':
          await handlePublish(job.data);
          break;
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 3,
    }
  );

  notificationWorker.on('completed', (job) => {
    if (job.data.jobType?.startsWith('post-')) {
      console.log(`[post-approval] Notification job ${job.id} completed`);
    }
  });

  notificationWorker.on('failed', (job, err) => {
    if (job?.data.jobType?.startsWith('post-')) {
      console.error(`[post-approval] Notification job ${job?.id} failed:`, err.message);
    }
  });

  // Worker for scheduled queue (post-reminder)
  const scheduledWorker = new Worker<ScheduledJobData>(
    'scheduled',
    async (job: Job<ScheduledJobData>) => {
      // Only handle post-reminder jobs
      if (job.data.jobType !== 'post-reminder') return;

      await handleReminders();
    },
    {
      connection: createRedisConnection(),
      concurrency: 1, // Single concurrency for reminder processing
    }
  );

  scheduledWorker.on('completed', (job) => {
    if (job.data.jobType === 'post-reminder') {
      console.log(`[post-approval] Scheduled job ${job.id} completed`);
    }
  });

  scheduledWorker.on('failed', (job, err) => {
    if (job?.data.jobType === 'post-reminder') {
      console.error(`[post-approval] Scheduled job ${job?.id} failed:`, err.message);
    }
  });

  console.log('[post-approval] Worker started (notifications + scheduled)');
  return { notificationWorker, scheduledWorker };
}
