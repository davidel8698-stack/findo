import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { leads, leadConversations, missedCalls, tenants, whatsappConnections, whatsappConversations } from '../../db/schema/index';
import { eq, and } from 'drizzle-orm';
import { leadReminderQueue, type LeadOutreachJobData, type LeadReminderJobData } from '../queues';
import { formatInitialMessage } from '../../services/lead-capture/messages';
import { createWhatsAppClient, sendTextMessage } from '../../services/whatsapp';

/**
 * Process lead outreach job.
 *
 * Sends initial WhatsApp message to missed call caller after 2-minute delay.
 * Creates lead and lead conversation records for tracking.
 *
 * Per CONTEXT.md:
 * - Message feels like it comes from the owner (warm, personal)
 * - Include business name to remind caller who they called
 * - No mention of automation or assistant
 */
async function processLeadOutreach(job: Job<LeadOutreachJobData>): Promise<void> {
  const { tenantId, missedCallId, callerPhone } = job.data;

  console.log(`[lead-outreach] Processing outreach for ${callerPhone} (missed call: ${missedCallId})`);

  // Get tenant info for business name
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant) {
    console.error(`[lead-outreach] Tenant ${tenantId} not found`);
    return;
  }

  // Check if WhatsApp connection exists and is active
  const connection = await db.query.whatsappConnections.findFirst({
    where: and(
      eq(whatsappConnections.tenantId, tenantId),
      eq(whatsappConnections.status, 'active')
    ),
  });

  if (!connection) {
    console.error(`[lead-outreach] No active WhatsApp connection for tenant ${tenantId}`);
    return;
  }

  // Check if a lead already exists for this phone (maybe they called multiple times)
  const existingLead = await db.query.leads.findFirst({
    where: and(
      eq(leads.tenantId, tenantId),
      eq(leads.customerPhone, callerPhone)
    ),
  });

  if (existingLead) {
    console.log(`[lead-outreach] Lead already exists for ${callerPhone}, skipping initial message`);
    // Update missed call to link to existing lead
    await db.update(missedCalls)
      .set({ leadId: existingLead.id, processedAt: new Date() })
      .where(eq(missedCalls.id, missedCallId));
    return;
  }

  // Create WhatsApp client
  const client = await createWhatsAppClient(tenantId);
  if (!client) {
    console.error(`[lead-outreach] Failed to create WhatsApp client for tenant ${tenantId}`);
    return;
  }

  // Format initial message with business name
  const businessName = tenant.businessName || tenant.ownerName || 'העסק';
  const message = formatInitialMessage(businessName);

  // Send initial WhatsApp message
  try {
    const result = await sendTextMessage(client, callerPhone, message);
    console.log(`[lead-outreach] Sent initial message to ${callerPhone}: ${result.messageId}`);
  } catch (error) {
    console.error(`[lead-outreach] Failed to send message to ${callerPhone}:`, error);
    throw error; // Retry via BullMQ
  }

  // Create lead record with status 'qualifying' (chatbot collecting info)
  const [lead] = await db.insert(leads).values({
    tenantId,
    source: 'missed_call',
    sourceId: missedCallId,
    customerPhone: callerPhone,
    status: 'qualifying',
    capturedAt: new Date(),
  }).returning();

  console.log(`[lead-outreach] Created lead ${lead.id} for ${callerPhone}`);

  // Get or create WhatsApp conversation for tracking 24-hour window
  let conversation = await db.query.whatsappConversations.findFirst({
    where: and(
      eq(whatsappConversations.tenantId, tenantId),
      eq(whatsappConversations.customerPhone, callerPhone)
    ),
  });

  if (!conversation) {
    // Create conversation - for business-initiated messages, we don't have a window yet
    // The window will open when customer responds
    const [created] = await db.insert(whatsappConversations).values({
      tenantId,
      customerPhone: callerPhone,
      messageCount: 1,
      lastMessageAt: new Date(),
    }).returning();
    conversation = created;
  } else {
    // Increment message count for existing conversation
    await db.update(whatsappConversations)
      .set({
        messageCount: conversation.messageCount + 1,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(whatsappConversations.id, conversation.id));
  }

  // Create lead conversation tracking record
  const [leadConversation] = await db.insert(leadConversations).values({
    leadId: lead.id,
    state: 'awaiting_response',
    whatsappConversationId: conversation.id,
  }).returning();

  console.log(`[lead-outreach] Created lead conversation ${leadConversation.id}`);

  // Update missed call with lead reference
  await db.update(missedCalls)
    .set({ leadId: lead.id, processedAt: new Date() })
    .where(eq(missedCalls.id, missedCallId));

  // Schedule reminder 1 (2 hours from now)
  const reminder1Data: LeadReminderJobData = {
    leadId: lead.id,
    leadConversationId: leadConversation.id,
    reminderNumber: 1,
  };

  await leadReminderQueue.add(
    'send-reminder',
    reminder1Data,
    {
      delay: 2 * 60 * 60 * 1000, // 2 hours
      jobId: `lead-reminder-1-${lead.id}`,
    }
  );

  // Schedule reminder 2 (24 hours from now)
  const reminder2Data: LeadReminderJobData = {
    leadId: lead.id,
    leadConversationId: leadConversation.id,
    reminderNumber: 2,
  };

  await leadReminderQueue.add(
    'send-reminder',
    reminder2Data,
    {
      delay: 24 * 60 * 60 * 1000, // 24 hours
      jobId: `lead-reminder-2-${lead.id}`,
    }
  );

  console.log(`[lead-outreach] Scheduled reminders for lead ${lead.id}`);
}

/**
 * Start the lead outreach worker.
 *
 * Processes delayed lead outreach jobs (2 minutes after missed call).
 * Sends warm, personal WhatsApp message to initiate lead capture.
 *
 * @returns The worker instance (for cleanup on shutdown)
 */
export function startLeadOutreachWorker(): Worker<LeadOutreachJobData> {
  const worker = new Worker<LeadOutreachJobData>(
    'lead-outreach',
    async (job) => {
      await processLeadOutreach(job);
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`[lead-outreach] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[lead-outreach] Job ${job?.id} failed:`, err.message);
  });

  console.log('[lead-outreach] Worker started');
  return worker;
}
