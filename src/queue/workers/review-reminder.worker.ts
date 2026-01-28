/**
 * Review Reminder Worker
 *
 * Handles 48-hour reminder and auto-post system for pending review approvals.
 *
 * Per CONTEXT.md:
 * - If owner doesn't respond within 48h of approval request, send reminder
 * - If still no response 48h after reminder, auto-post the draft reply
 * - This ensures negative reviews always get a response
 */

import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import {
  processedReviews,
  tenants,
  googleConnections,
  whatsappConversations,
} from '../../db/schema/index';
import { eq, and, lt, isNull } from 'drizzle-orm';
import { createWhatsAppClient } from '../../services/whatsapp';
import {
  sendTextMessage,
  sendInteractiveButtons,
  isWindowOpen,
} from '../../services/whatsapp/messages';
import { postReviewReply } from '../../services/google/reviews';
import { activityService } from '../../services/activity';
import { type ScheduledJobData } from '../queues';

/**
 * Sleep helper for rate limiting between tenants.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate comment for preview (max 50 chars).
 */
function truncateComment(comment: string | null, maxLength: number = 50): string {
  if (!comment) return 'ללא טקסט';
  if (comment.length <= maxLength) return comment;
  return comment.slice(0, maxLength) + '...';
}

/**
 * Get owner's conversation window expiration.
 */
async function getOwnerWindowExpiration(
  tenantId: string,
  ownerPhone: string
): Promise<Date | null> {
  const conversation = await db.query.whatsappConversations.findFirst({
    where: and(
      eq(whatsappConversations.tenantId, tenantId),
      eq(whatsappConversations.customerPhone, ownerPhone)
    ),
  });
  return conversation?.windowExpiresAt ?? null;
}

/**
 * Send reminders to owners who haven't responded to approval requests.
 *
 * Finds reviews where:
 * - status = 'pending_approval'
 * - approvalSentAt < now - 48 hours
 * - reminderSentAt is NULL
 *
 * @returns Number of reminders sent
 */
async function sendReminders(): Promise<{ remindersCount: number }> {
  // Calculate 48-hour threshold
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  // Find reviews needing reminders
  const reviewsNeedingReminder = await db.query.processedReviews.findMany({
    where: and(
      eq(processedReviews.status, 'pending_approval'),
      lt(processedReviews.approvalSentAt, fortyEightHoursAgo),
      isNull(processedReviews.reminderSentAt)
    ),
  });

  console.log(
    `[review-reminder] Found ${reviewsNeedingReminder.length} reviews needing reminders`
  );

  let remindersCount = 0;

  for (const review of reviewsNeedingReminder) {
    try {
      // Load tenant for owner phone
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, review.tenantId),
      });

      if (!tenant) {
        console.warn(
          `[review-reminder] Tenant ${review.tenantId} not found for review ${review.id}`
        );
        continue;
      }

      const ownerPhone = tenant.ownerPhone;
      if (!ownerPhone) {
        console.log(
          `[review-reminder] No owner phone for tenant ${review.tenantId}, skipping reminder`
        );
        continue;
      }

      // Create WhatsApp client
      const client = await createWhatsAppClient(review.tenantId);
      if (!client) {
        console.warn(
          `[review-reminder] No WhatsApp client for tenant ${review.tenantId}`
        );
        continue;
      }

      // Build reminder message in Hebrew
      const commentPreview = truncateComment(review.comment);
      const reminderMessage = [
        `תזכורת: ממתינה תשובה לביקורת (${review.starRating} כוכבים)`,
        '',
        `"${commentPreview}"`,
        '',
        'תשובה מוצעת:',
        `"${review.draftReply || 'תודה על הביקורת. אנו לוקחים את המשוב שלך ברצינות.'}"`,
      ].join('\n');

      // Check if session window is open
      const windowExpiresAt = await getOwnerWindowExpiration(
        review.tenantId,
        ownerPhone
      );

      if (isWindowOpen(windowExpiresAt)) {
        // Window open - use interactive buttons
        await sendInteractiveButtons(client, ownerPhone, reminderMessage, [
          { id: `approve_${review.id}`, title: 'אשר ושלח' },
          { id: `edit_${review.id}`, title: 'רוצה לערוך' },
        ]);
      } else {
        // Window closed - use text with instructions
        const textWithInstructions = `${reminderMessage}\n\nהשב 'אשר' לאישור, או כתוב את התשובה שלך`;
        await sendTextMessage(client, ownerPhone, textWithInstructions);
      }

      // Update review: status = 'reminded', reminderSentAt = now
      await db
        .update(processedReviews)
        .set({
          status: 'reminded',
          reminderSentAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(processedReviews.id, review.id));

      // Create activity event for audit trail
      await activityService.createAndPublish(review.tenantId, {
        eventType: 'review.reminder_sent',
        title: 'תזכורת לביקורת נשלחה',
        description: `תזכורת לביקורת ${review.starRating} כוכבים - ${review.reviewerName}`,
        source: 'review-reminder-worker',
        sourceId: review.id,
      });

      remindersCount++;
      console.log(
        `[review-reminder] Sent reminder for review ${review.id} to owner`
      );

      // Rate limit: 100ms delay between tenants
      await sleep(100);
    } catch (error) {
      // Log error but continue with other reviews
      console.error(
        `[review-reminder] Error sending reminder for review ${review.id}:`,
        error
      );
    }
  }

  return { remindersCount };
}

/**
 * Auto-post draft replies for reviews that expired (48h after reminder).
 *
 * Finds reviews where:
 * - status = 'reminded'
 * - reminderSentAt < now - 48 hours
 *
 * @returns Number of auto-posts
 */
async function autoPostExpired(): Promise<{ autoPostCount: number }> {
  // Calculate 48-hour threshold from reminder
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  // Find reviews that expired (48h after reminder)
  const expiredReviews = await db.query.processedReviews.findMany({
    where: and(
      eq(processedReviews.status, 'reminded'),
      lt(processedReviews.reminderSentAt, fortyEightHoursAgo)
    ),
  });

  console.log(
    `[review-reminder] Found ${expiredReviews.length} reviews to auto-post`
  );

  let autoPostCount = 0;

  for (const review of expiredReviews) {
    try {
      // Load Google connection for posting
      const googleConnection = await db.query.googleConnections.findFirst({
        where: eq(googleConnections.id, review.googleConnectionId),
      });

      if (!googleConnection) {
        console.warn(
          `[review-reminder] Google connection ${review.googleConnectionId} not found for review ${review.id}`
        );
        continue;
      }

      if (!googleConnection.accountId || !googleConnection.locationId) {
        console.warn(
          `[review-reminder] Missing accountId or locationId for connection ${review.googleConnectionId}`
        );
        continue;
      }

      // Post the draft reply to Google
      const replyText =
        review.draftReply ||
        'תודה על הביקורת. אנו לוקחים את המשוב שלך ברצינות.';

      await postReviewReply(
        review.tenantId,
        googleConnection.accountId,
        googleConnection.locationId,
        review.reviewId,
        replyText
      );

      // Update review: status = 'expired', postedReply = draftReply, repliedAt = now
      await db
        .update(processedReviews)
        .set({
          status: 'expired',
          postedReply: replyText,
          repliedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(processedReviews.id, review.id));

      // Notify owner that reply was auto-posted
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, review.tenantId),
      });

      if (tenant?.ownerPhone) {
        try {
          const client = await createWhatsAppClient(review.tenantId);
          if (client) {
            await sendTextMessage(
              client,
              tenant.ownerPhone,
              'התשובה פורסמה אוטומטית לאחר 96 שעות'
            );
          }
        } catch (notifyError) {
          // Non-critical - log and continue
          console.warn(
            `[review-reminder] Failed to notify owner of auto-post for review ${review.id}:`,
            notifyError
          );
        }
      }

      // Create activity event for audit trail
      await activityService.createAndPublish(review.tenantId, {
        eventType: 'review.auto_posted',
        title: 'תשובה פורסמה אוטומטית',
        description: `תשובה לביקורת ${review.starRating} כוכבים פורסמה לאחר 96 שעות - ${review.reviewerName}`,
        source: 'review-reminder-worker',
        sourceId: review.id,
      });

      autoPostCount++;
      console.log(
        `[review-reminder] Auto-posted reply for review ${review.id}`
      );

      // Rate limit: 100ms delay between tenants
      await sleep(100);
    } catch (error) {
      // Log error but continue with other reviews
      console.error(
        `[review-reminder] Error auto-posting for review ${review.id}:`,
        error
      );
    }
  }

  return { autoPostCount };
}

/**
 * Start the review reminder worker.
 *
 * Listens on 'scheduled' queue and filters to 'review-reminder' jobs.
 * Runs hourly to check for pending approvals needing reminders or auto-post.
 *
 * @returns The worker instance (for cleanup on shutdown)
 */
export function startReviewReminderWorker(): Worker<ScheduledJobData> {
  const worker = new Worker<ScheduledJobData>(
    'scheduled',
    async (job: Job<ScheduledJobData>) => {
      // Only process review-reminder jobs
      if (job.name !== 'review-reminder') {
        return;
      }

      console.log('[review-reminder] Starting review reminder job');

      const { remindersCount } = await sendReminders();
      const { autoPostCount } = await autoPostExpired();

      console.log(
        `[review-reminder] Sent ${remindersCount} reminders, auto-posted ${autoPostCount}`
      );
    },
    {
      connection: createRedisConnection(),
      concurrency: 1, // Single concurrency for rate limit protection
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'review-reminder') {
      console.log(`[review-reminder] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'review-reminder') {
      console.error(`[review-reminder] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[review-reminder] Worker started');
  return worker;
}
