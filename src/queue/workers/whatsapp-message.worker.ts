import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import {
  whatsappConnections,
  whatsappMessages,
  type NewWhatsAppMessage,
} from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { openConversationWindow } from '../../services/whatsapp/conversations';
import { activityQueue, type ActivityJobData } from '../queues';
import { createWhatsAppClient, sendTextMessage } from '../../services/whatsapp';
import type { ParsedMessage } from '../../services/whatsapp/webhooks';

/**
 * Job data structure for whatsapp-messages jobs.
 * Matches what's enqueued in webhooks.ts
 */
interface WhatsAppMessageJobData {
  source: 'whatsapp';
  eventId: string;
  eventType: 'messages.received';
  payload: {
    wabaId: string | null;
    phoneNumberId: string | null;
    messages: ParsedMessage[];
  };
  receivedAt: string;
}

// Hebrew auto-reply for unsupported message types
const UNSUPPORTED_MESSAGE_REPLY = `שלום! קיבלנו את ההודעה שלך, אך אנו תומכים כרגע רק בהודעות טקסט ותמונות.
אנא שלח/י הודעת טקסט או תמונה ונשמח לעזור.`;

/**
 * Process incoming WhatsApp messages.
 *
 * For each message:
 * 1. Find tenant by WABA ID from whatsappConnections
 * 2. Open/extend conversation window
 * 3. Save to whatsapp_messages table
 * 4. Create activity event
 * 5. If unsupported type, send Hebrew auto-reply
 */
async function processWhatsAppMessages(
  job: Job<WhatsAppMessageJobData>
): Promise<void> {
  const { payload, eventId } = job.data;
  const { wabaId, phoneNumberId, messages } = payload;

  if (!wabaId || !phoneNumberId) {
    console.warn('[whatsapp-message] Missing wabaId or phoneNumberId');
    return;
  }

  console.log(
    `[whatsapp-message] Processing ${messages.length} message(s) for WABA ${wabaId}`
  );

  // Find tenant by WABA ID
  const connection = await db.query.whatsappConnections.findFirst({
    where: eq(whatsappConnections.wabaId, wabaId),
  });

  if (!connection) {
    console.warn(`[whatsapp-message] No connection found for WABA ${wabaId}`);
    return;
  }

  const tenantId = connection.tenantId;
  const businessPhone = connection.displayPhoneNumber;

  // Process each message
  for (const message of messages) {
    try {
      // 1. Open/extend conversation window
      const conversation = await openConversationWindow(
        tenantId,
        message.from,
        message.contactName,
        message.timestamp
      );

      // 2. Save message to database
      const newMessage: NewWhatsAppMessage = {
        tenantId,
        conversationId: conversation.id,
        waMessageId: message.waMessageId,
        direction: 'inbound',
        type: message.type,
        content: message.text || message.mediaCaption || null,
        mediaId: message.mediaId || null,
        recipientPhone: businessPhone, // Business receives the message
        senderPhone: message.from, // Customer sends the message
        status: 'delivered', // Inbound messages are already delivered
        deliveredAt: message.timestamp,
      };

      await db.insert(whatsappMessages).values(newMessage);

      console.log(
        `[whatsapp-message] Saved message ${message.waMessageId} from ${message.from}`
      );

      // 3. Create activity event
      await activityQueue.add('message-received', {
        tenantId,
        eventType: 'whatsapp.message.received',
        title: 'New WhatsApp message',
        description: message.type === 'text'
          ? `Message from ${message.contactName || message.from}: ${message.text?.substring(0, 100) || ''}`
          : `${message.type} message from ${message.contactName || message.from}`,
        metadata: {
          waMessageId: message.waMessageId,
          from: message.from,
          contactName: message.contactName,
          type: message.type,
          conversationId: conversation.id,
        },
        source: 'whatsapp',
        sourceId: message.waMessageId,
      } satisfies ActivityJobData);

      // 4. If unsupported type, send auto-reply
      if (message.type === 'unknown') {
        console.log(
          `[whatsapp-message] Unsupported type '${message.rawType}' from ${message.from}, sending auto-reply`
        );

        try {
          const client = await createWhatsAppClient(tenantId);
          if (client) {
            const reply = await sendTextMessage(
              client,
              message.from,
              UNSUPPORTED_MESSAGE_REPLY
            );

            // Save the auto-reply to database
            await db.insert(whatsappMessages).values({
              tenantId,
              conversationId: conversation.id,
              waMessageId: reply.messageId,
              direction: 'outbound',
              type: 'text',
              content: UNSUPPORTED_MESSAGE_REPLY,
              recipientPhone: message.from,
              senderPhone: businessPhone,
              status: 'sent',
              sentAt: new Date(),
            });

            console.log(
              `[whatsapp-message] Sent auto-reply for unsupported type`
            );
          }
        } catch (replyError) {
          // Log but don't fail the job - auto-reply is best effort
          console.error(
            '[whatsapp-message] Failed to send auto-reply:',
            replyError
          );
        }
      }
    } catch (error) {
      console.error(
        `[whatsapp-message] Error processing message ${message.waMessageId}:`,
        error
      );
      // Continue processing other messages
    }
  }

  console.log(
    `[whatsapp-message] Completed processing ${messages.length} message(s)`
  );
}

/**
 * Start the WhatsApp message processing worker.
 */
export function startWhatsAppMessageWorker(): Worker<WhatsAppMessageJobData> {
  const worker = new Worker<WhatsAppMessageJobData>(
    'webhooks', // Listen on webhooks queue
    async (job) => {
      // Only process whatsapp-messages jobs
      if (job.name === 'whatsapp-messages') {
        await processWhatsAppMessages(job);
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'whatsapp-messages') {
      console.log(`[whatsapp-message] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'whatsapp-messages') {
      console.error(`[whatsapp-message] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[whatsapp-message] Worker started');
  return worker;
}
