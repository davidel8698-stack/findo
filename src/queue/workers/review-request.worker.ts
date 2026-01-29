import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { reviewRequests, tenants, googleConnections } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { reviewRequestQueue, type ReviewRequestJobData } from '../queues';
import { createWhatsAppClient } from '../../services/whatsapp/index';
import {
  sendReviewRequestMessage,
  sendReviewReminderMessage,
} from '../../services/review-request/index';

/**
 * Review request worker - sends WhatsApp review requests and reminders.
 *
 * Job types:
 * - 'send-review-request': Initial request (24h after invoice)
 * - 'send-review-reminder': Follow-up (3 days after initial request)
 *
 * Status transitions:
 * - pending -> requested (after initial message sent)
 * - requested -> stopped (after reminder sent, REVW-07: no spam)
 * - Any -> completed (if customer left review before reminder)
 */
export function startReviewRequestWorker(): Worker<ReviewRequestJobData> {
  const worker = new Worker<ReviewRequestJobData>(
    'review-requests',
    async (job: Job<ReviewRequestJobData>) => {
      const { reviewRequestId } = job.data;

      // Load review request
      const request = await db.query.reviewRequests.findFirst({
        where: eq(reviewRequests.id, reviewRequestId),
      });

      if (!request) {
        console.error(`[review-request] Request not found: ${reviewRequestId}`);
        return;
      }

      // Check if already completed (customer left review)
      if (request.status === 'completed') {
        console.log(`[review-request] ${reviewRequestId} already completed`);
        return;
      }

      // Check if stopped (already sent reminder)
      if (request.status === 'stopped') {
        console.log(`[review-request] ${reviewRequestId} already stopped`);
        return;
      }

      // Get tenant info
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, request.tenantId),
      });

      if (!tenant) {
        console.error(`[review-request] Tenant not found: ${request.tenantId}`);
        return;
      }

      // Get Google connection for Place ID
      const googleConnection = await db.query.googleConnections.findFirst({
        where: eq(googleConnections.tenantId, request.tenantId),
      });

      if (!googleConnection?.placeId) {
        console.error(`[review-request] No Google Place ID for tenant: ${request.tenantId}`);
        // Mark as skipped - can't send without review link
        await db.update(reviewRequests)
          .set({ status: 'skipped', updatedAt: new Date() })
          .where(eq(reviewRequests.id, reviewRequestId));
        return;
      }

      // Get WhatsApp client
      const client = await createWhatsAppClient(request.tenantId);
      if (!client) {
        console.error(`[review-request] No WhatsApp client for tenant: ${request.tenantId}`);
        return;
      }

      try {
        if (job.name === 'send-review-request') {
          // Send initial request
          const messageId = await sendReviewRequestMessage(
            client,
            request.tenantId,
            request.customerPhone!,
            request.customerName || '',
            tenant.businessName,
            googleConnection.placeId
          );

          // Update status and schedule reminder
          await db.update(reviewRequests)
            .set({
              status: 'requested',
              requestedAt: new Date(),
              requestMessageId: messageId,
              updatedAt: new Date(),
            })
            .where(eq(reviewRequests.id, reviewRequestId));

          // Schedule 3-day reminder (REVW-06: one reminder after 3 days)
          const reminderDelay = 3 * 24 * 60 * 60 * 1000; // 3 days

          await reviewRequestQueue.add(
            'send-review-reminder',
            { reviewRequestId },
            {
              delay: reminderDelay,
              jobId: `review-reminder-${reviewRequestId}`,
              removeOnComplete: true,
            }
          );

          console.log(
            `[review-request] Sent initial request to ${request.customerPhone}, reminder in 3 days`
          );

        } else if (job.name === 'send-review-reminder') {
          // Check again if completed (customer may have reviewed after initial request)
          const currentRequest = await db.query.reviewRequests.findFirst({
            where: eq(reviewRequests.id, reviewRequestId),
          });

          if (currentRequest?.status === 'completed') {
            console.log(`[review-request] ${reviewRequestId} completed before reminder`);
            return;
          }

          // Send reminder
          const messageId = await sendReviewReminderMessage(
            client,
            request.customerPhone!,
            tenant.businessName,
            googleConnection.placeId
          );

          // Mark as STOPPED (REVW-07: no spam after reminder)
          await db.update(reviewRequests)
            .set({
              status: 'stopped',
              reminderSentAt: new Date(),
              reminderMessageId: messageId,
              updatedAt: new Date(),
            })
            .where(eq(reviewRequests.id, reviewRequestId));

          console.log(
            `[review-request] Sent reminder to ${request.customerPhone}, marked as stopped`
          );
        }
      } catch (error) {
        console.error(`[review-request] Failed to send message:`, error);
        // Don't mark as failed - job will retry per BullMQ config
        throw error;
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 5, // Process multiple requests concurrently
    }
  );

  console.log('[review-request] Worker started');
  return worker;
}
