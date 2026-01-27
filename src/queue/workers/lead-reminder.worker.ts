import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { leads, leadConversations, tenants } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { LeadReminderJobData } from '../queues';
import { LEAD_MESSAGES } from '../../services/lead-capture/messages';
import { isTerminalState, transition } from '../../services/lead-capture/chatbot';
import { createWhatsAppClient, sendTextMessage } from '../../services/whatsapp';
import { activityService } from '../../services/activity';

/**
 * Process lead reminder job.
 *
 * Per CONTEXT.md:
 * - Two reminders over 24 hours (at 2h and 24h)
 * - After second reminder, wait and mark as unresponsive
 * - Reminders cancelled when customer responds (done in message worker)
 */
async function processLeadReminder(job: Job<LeadReminderJobData>): Promise<void> {
  const { leadId, leadConversationId, reminderNumber } = job.data;

  console.log(`[lead-reminder] Processing reminder ${reminderNumber} for lead ${leadId}`);

  // Get lead conversation
  const leadConvo = await db.query.leadConversations.findFirst({
    where: eq(leadConversations.id, leadConversationId),
  });

  if (!leadConvo) {
    console.log(`[lead-reminder] Lead conversation ${leadConversationId} not found, skipping`);
    return;
  }

  // Skip if already in terminal state (customer responded or already unresponsive)
  if (isTerminalState(leadConvo.state as any)) {
    console.log(`[lead-reminder] Lead ${leadId} is in terminal state ${leadConvo.state}, skipping reminder`);
    return;
  }

  // Skip if reminder already sent (idempotency)
  if (reminderNumber === 1 && leadConvo.reminder1SentAt) {
    console.log(`[lead-reminder] Reminder 1 already sent for lead ${leadId}, skipping`);
    return;
  }
  if (reminderNumber === 2 && leadConvo.reminder2SentAt) {
    console.log(`[lead-reminder] Reminder 2 already sent for lead ${leadId}, skipping`);
    return;
  }

  // Get lead and tenant info
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, leadId),
  });

  if (!lead) {
    console.log(`[lead-reminder] Lead ${leadId} not found, skipping`);
    return;
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, lead.tenantId),
  });

  if (!tenant) {
    console.log(`[lead-reminder] Tenant ${lead.tenantId} not found, skipping`);
    return;
  }

  // Create WhatsApp client
  const client = await createWhatsAppClient(lead.tenantId);
  if (!client) {
    console.error(`[lead-reminder] No WhatsApp client for tenant ${lead.tenantId}`);
    return;
  }

  // Get reminder message
  const businessName = tenant.businessName || tenant.ownerName || 'העסק';
  const message = reminderNumber === 1
    ? LEAD_MESSAGES.reminder1(businessName)
    : LEAD_MESSAGES.reminder2();

  // Send reminder
  try {
    await sendTextMessage(client, lead.customerPhone, message);
    console.log(`[lead-reminder] Sent reminder ${reminderNumber} to ${lead.customerPhone}`);
  } catch (error) {
    console.error(`[lead-reminder] Failed to send reminder ${reminderNumber}:`, error);
    throw error; // Retry via BullMQ
  }

  // Update reminder sent timestamp
  const reminderUpdate = reminderNumber === 1
    ? { reminder1SentAt: new Date(), updatedAt: new Date() }
    : { reminder2SentAt: new Date(), updatedAt: new Date() };

  await db.update(leadConversations)
    .set(reminderUpdate)
    .where(eq(leadConversations.id, leadConversationId));

  // Update conversation state with reminder event
  const newState = transition(
    leadConvo.state as any,
    reminderNumber === 1 ? 'REMINDER_1_SENT' : 'REMINDER_2_SENT'
  );

  console.log(`[lead-reminder] Updated lead conversation ${leadConversationId}, state: ${newState}`);

  // If this was the second reminder, schedule timeout to mark unresponsive
  if (reminderNumber === 2) {
    // Schedule timeout check for 24 hours after reminder 2
    // The timeout worker will mark as unresponsive if no response
    const { leadReminderQueue } = await import('../queues');

    await leadReminderQueue.add(
      'mark-unresponsive',
      {
        leadId,
        leadConversationId,
        reminderNumber: 2, // Use 2 to indicate this is the timeout job
      },
      {
        delay: 24 * 60 * 60 * 1000, // 24 hours after reminder 2
        jobId: `lead-timeout-${leadId}`,
      }
    );

    console.log(`[lead-reminder] Scheduled unresponsive timeout for lead ${leadId}`);
  }
}

/**
 * Mark lead as unresponsive after final timeout.
 */
async function markLeadUnresponsive(job: Job<LeadReminderJobData>): Promise<void> {
  const { leadId, leadConversationId } = job.data;

  console.log(`[lead-reminder] Checking if lead ${leadId} should be marked unresponsive`);

  // Get lead conversation
  const leadConvo = await db.query.leadConversations.findFirst({
    where: eq(leadConversations.id, leadConversationId),
  });

  if (!leadConvo) {
    console.log(`[lead-reminder] Lead conversation ${leadConversationId} not found`);
    return;
  }

  // Only mark unresponsive if still not in terminal state
  if (isTerminalState(leadConvo.state as any)) {
    console.log(`[lead-reminder] Lead ${leadId} already in terminal state ${leadConvo.state}`);
    return;
  }

  // Verify both reminders were sent
  if (!leadConvo.reminder1SentAt || !leadConvo.reminder2SentAt) {
    console.log(`[lead-reminder] Not all reminders sent for lead ${leadId}, skipping unresponsive mark`);
    return;
  }

  // Get lead for tenant ID
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, leadId),
  });

  if (!lead) {
    console.log(`[lead-reminder] Lead ${leadId} not found`);
    return;
  }

  // Mark conversation as unresponsive
  await db.update(leadConversations)
    .set({ state: 'unresponsive', updatedAt: new Date() })
    .where(eq(leadConversations.id, leadConversationId));

  // Update lead status
  await db.update(leads)
    .set({ status: 'unresponsive', updatedAt: new Date() })
    .where(eq(leads.id, leadId));

  console.log(`[lead-reminder] Marked lead ${leadId} as unresponsive`);

  // Create activity event using the activity service
  await activityService.createAndPublish(lead.tenantId, {
    eventType: 'lead.unresponsive',
    title: 'ליד לא מגיב',
    description: `${lead.customerPhone} - לא הגיב לאחר 2 תזכורות`,
    source: 'lead-reminder-worker',
    sourceId: leadId,
  });
}

export function startLeadReminderWorker(): Worker<LeadReminderJobData> {
  const worker = new Worker<LeadReminderJobData>(
    'lead-reminders',
    async (job) => {
      if (job.name === 'send-reminder') {
        await processLeadReminder(job);
      } else if (job.name === 'mark-unresponsive') {
        await markLeadUnresponsive(job);
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`[lead-reminder] Job ${job.id} (${job.name}) completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[lead-reminder] Job ${job?.id} (${job?.name}) failed:`, err.message);
  });

  console.log('[lead-reminder] Worker started');
  return worker;
}
