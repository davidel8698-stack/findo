import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import {
  whatsappConnections,
  whatsappMessages,
  leads,
  leadConversations,
  tenants,
  type NewWhatsAppMessage,
} from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { openConversationWindow } from '../../services/whatsapp/conversations';
import { activityQueue, leadReminderQueue, type ActivityJobData } from '../queues';
import { createWhatsAppClient, sendTextMessage } from '../../services/whatsapp';
import type { ParsedMessage } from '../../services/whatsapp/webhooks';
import { extractLeadInfo } from '../../services/lead-capture/intent';
import { getNextState, isTerminalState, type ExtractedLeadInfo } from '../../services/lead-capture/chatbot';
import { getChatbotResponse } from '../../services/lead-capture/messages';
import { notifyOwnerOfLead, createLeadActivity } from '../../services/lead-capture/notifications';
import { handleOwnerReviewResponse } from '../../services/review-management';

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
 * Handle incoming message that's part of a lead conversation.
 *
 * Process flow:
 * 1. Check if conversation is in terminal state (skip if so)
 * 2. Extract info using AI
 * 3. Update lead with extracted info
 * 4. Determine next state based on what's collected
 * 5. Send chatbot response if appropriate
 * 6. Cancel pending reminders (customer responded)
 * 7. Notify owner of lead update
 */
async function handleLeadConversation(
  message: { text?: string; from: string },
  leadConvo: typeof leadConversations.$inferSelect,
  lead: typeof leads.$inferSelect,
  tenantId: string,
): Promise<void> {
  console.log(`[whatsapp-message] Processing lead conversation for ${message.from}`);

  // Skip if conversation is in terminal state
  if (isTerminalState(leadConvo.state as any)) {
    console.log(`[whatsapp-message] Lead conversation ${leadConvo.id} is in terminal state ${leadConvo.state}`);
    return;
  }

  // Extract info using AI
  const messageText = message.text || '';
  const existingInfo: ExtractedLeadInfo = {
    name: lead.customerName,
    need: lead.need,
    contactPreference: lead.contactPreference,
  };

  const extractedInfo = await extractLeadInfo(
    messageText,
    [], // Conversation history not tracked in DB yet
    leadConvo.state as any
  );

  console.log(`[whatsapp-message] Extracted info:`, extractedInfo);

  // Merge with existing info
  const mergedInfo: ExtractedLeadInfo = {
    name: existingInfo.name || extractedInfo.name,
    need: existingInfo.need || extractedInfo.need,
    contactPreference: existingInfo.contactPreference || extractedInfo.contactPreference,
  };

  // Update lead with new info
  const updates: Partial<typeof leads.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (extractedInfo.name && !lead.customerName) {
    updates.customerName = extractedInfo.name;
  }
  if (extractedInfo.need && !lead.need) {
    updates.need = extractedInfo.need;
  }
  if (extractedInfo.contactPreference && !lead.contactPreference) {
    updates.contactPreference = extractedInfo.contactPreference;
  }

  // Check if any meaningful updates beyond just updatedAt
  const hasNewInfo = Object.keys(updates).length > 1;

  if (hasNewInfo) {
    await db.update(leads)
      .set(updates)
      .where(eq(leads.id, lead.id));
    console.log(`[whatsapp-message] Updated lead ${lead.id} with new info`);
  }

  // Determine next state based on what's now collected
  const nextState = getNextState(leadConvo.state as any, mergedInfo);

  // Update conversation state
  if (nextState !== leadConvo.state) {
    await db.update(leadConversations)
      .set({ state: nextState, updatedAt: new Date() })
      .where(eq(leadConversations.id, leadConvo.id));
    console.log(`[whatsapp-message] Lead conversation ${leadConvo.id} transitioned to ${nextState}`);
  }

  // Cancel pending reminders if customer responded
  try {
    await leadReminderQueue.remove(`lead-reminder-1-${lead.id}`);
    await leadReminderQueue.remove(`lead-reminder-2-${lead.id}`);
    console.log(`[whatsapp-message] Cancelled pending reminders for lead ${lead.id}`);
  } catch {
    // Reminders may not exist or already processed
  }

  // Get tenant for business name
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  // Send chatbot response if appropriate
  const responseText = getChatbotResponse(nextState, {
    businessName: tenant?.businessName || 'העסק',
    customerName: mergedInfo.name || undefined,
  });

  if (responseText) {
    const client = await createWhatsAppClient(tenantId);
    if (client) {
      try {
        await sendTextMessage(client, lead.customerPhone, responseText);
        console.log(`[whatsapp-message] Sent chatbot response for state ${nextState}`);
      } catch (error) {
        console.error(`[whatsapp-message] Failed to send chatbot response:`, error);
      }
    }
  }

  // Update lead status if completed
  if (nextState === 'completed') {
    await db.update(leads)
      .set({ status: 'qualified', qualifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(leads.id, lead.id));

    await createLeadActivity(
      tenantId,
      lead.id,
      'lead.qualified',
      'ליד מוכן',
      `${mergedInfo.name || 'לקוח'} - ${mergedInfo.need || 'לא צוין'}`
    );
  }

  // Notify owner of new/updated lead info
  // Per CONTEXT.md: notify immediately, update as info comes in
  if (hasNewInfo || nextState === 'completed') {
    await notifyOwnerOfLead(lead.id);
  }
}

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

      // 1.5 Check if this is an owner review response
      // Load tenant to get owner phone
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
      });

      const isOwner = tenant?.ownerPhone && message.from === tenant.ownerPhone;
      let handledAsReviewResponse = false;

      if (isOwner && (message.buttonId || message.text)) {
        handledAsReviewResponse = await handleOwnerReviewResponse(
          tenantId,
          message.from,
          message.text || '',
          message.buttonId
        );
        if (handledAsReviewResponse) {
          console.log(`[whatsapp-message] Processed as owner review response`);
          // Continue to save message but skip lead processing
        }
      }

      // 1.6 Check if this is part of a lead conversation (skip if already handled as review response)
      if (!handledAsReviewResponse) {
        const leadConvo = await db.query.leadConversations.findFirst({
          where: eq(leadConversations.whatsappConversationId, conversation.id),
        });

        if (leadConvo) {
          // Get the associated lead
          const lead = await db.query.leads.findFirst({
            where: eq(leads.id, leadConvo.leadId),
          });

          if (lead) {
            await handleLeadConversation(
              { text: message.text, from: message.from },
              leadConvo,
              lead,
              tenantId
            );
          }
        }
      }

      // 2. Save message to database
      // Map 'interactive' to 'text' for database storage (button replies are text-like)
      const dbMessageType = message.type === 'interactive' ? 'text' : message.type;
      const newMessage: NewWhatsAppMessage = {
        tenantId,
        conversationId: conversation.id,
        waMessageId: message.waMessageId,
        direction: 'inbound',
        type: dbMessageType,
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
