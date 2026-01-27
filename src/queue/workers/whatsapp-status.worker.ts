import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { whatsappMessages } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import type { ParsedStatus } from '../../services/whatsapp/webhooks';

/**
 * Job data structure for whatsapp-statuses jobs.
 * Matches what's enqueued in webhooks.ts
 */
interface WhatsAppStatusJobData {
  source: 'whatsapp';
  eventId: string;
  eventType: 'statuses.received';
  payload: {
    wabaId: string | null;
    phoneNumberId: string | null;
    statuses: ParsedStatus[];
  };
  receivedAt: string;
}

/**
 * Process WhatsApp status updates in batches.
 *
 * For each status update:
 * 1. Find message by waMessageId
 * 2. Update status (sent/delivered/read/failed)
 * 3. Set appropriate timestamp
 * 4. Record error code for failures
 */
async function processWhatsAppStatuses(
  job: Job<WhatsAppStatusJobData>
): Promise<void> {
  const { payload, eventId } = job.data;
  const { statuses } = payload;

  console.log(
    `[whatsapp-status] Processing ${statuses.length} status update(s)`
  );

  let successCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  // Process each status update
  for (const status of statuses) {
    try {
      // Find message by WhatsApp message ID
      const message = await db.query.whatsappMessages.findFirst({
        where: eq(whatsappMessages.waMessageId, status.waMessageId),
      });

      if (!message) {
        // This can happen for messages sent before our integration
        // or messages that haven't been processed yet (rare race condition)
        console.log(
          `[whatsapp-status] Message not found: ${status.waMessageId}`
        );
        notFoundCount++;
        continue;
      }

      // Build update payload based on status
      const updateData: Record<string, unknown> = {
        status: status.status,
      };

      // Set appropriate timestamp based on status
      switch (status.status) {
        case 'sent':
          updateData.sentAt = status.timestamp;
          break;
        case 'delivered':
          updateData.deliveredAt = status.timestamp;
          // If we missed the 'sent' status, set it too
          if (!message.sentAt) {
            updateData.sentAt = status.timestamp;
          }
          break;
        case 'read':
          updateData.readAt = status.timestamp;
          // If we missed previous statuses, set them too
          if (!message.sentAt) {
            updateData.sentAt = status.timestamp;
          }
          if (!message.deliveredAt) {
            updateData.deliveredAt = status.timestamp;
          }
          break;
        case 'failed':
          // Record error code for failures
          if (status.errorCode) {
            updateData.errorCode = status.errorCode.toString();
          }
          console.warn(
            `[whatsapp-status] Message ${status.waMessageId} failed: ${status.errorMessage || 'Unknown error'} (code: ${status.errorCode})`
          );
          break;
      }

      // Update the message
      await db
        .update(whatsappMessages)
        .set(updateData)
        .where(eq(whatsappMessages.id, message.id));

      successCount++;
      console.log(
        `[whatsapp-status] Updated message ${status.waMessageId} to ${status.status}`
      );
    } catch (error) {
      console.error(
        `[whatsapp-status] Error processing status for ${status.waMessageId}:`,
        error
      );
      errorCount++;
      // Continue processing other statuses
    }
  }

  console.log(
    `[whatsapp-status] Completed: ${successCount} updated, ${notFoundCount} not found, ${errorCount} errors`
  );
}

/**
 * Start the WhatsApp status update worker.
 */
export function startWhatsAppStatusWorker(): Worker<WhatsAppStatusJobData> {
  const worker = new Worker<WhatsAppStatusJobData>(
    'webhooks', // Listen on webhooks queue
    async (job) => {
      // Only process whatsapp-statuses jobs
      if (job.name === 'whatsapp-statuses') {
        await processWhatsAppStatuses(job);
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 3, // Lower concurrency for batch status updates
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'whatsapp-statuses') {
      console.log(`[whatsapp-status] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'whatsapp-statuses') {
      console.error(`[whatsapp-status] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[whatsapp-status] Worker started');
  return worker;
}
