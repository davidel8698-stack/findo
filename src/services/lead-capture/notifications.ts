/**
 * Owner notification service for lead updates.
 *
 * Per CONTEXT.md:
 * - Real-time updates: notify on first message, update as info comes in
 * - Structured summary with emoji headers
 * - Complete leads: "ליד חדש"
 * - Incomplete leads: "ליד חדש (חלקי)"
 * - Tap to call/message - clickable phone number
 */

import { db } from '../../db/index';
import { leads, tenants } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { createWhatsAppClient, sendTextMessage } from '../whatsapp';
import { formatPhoneDisplay } from '../../lib/phone';
import { shouldNotify, NotificationType } from '../notification-gate';

/**
 * Lead summary for owner notification.
 */
export interface LeadSummary {
  id: string;
  customerPhone: string;
  customerName: string | null;
  need: string | null;
  contactPreference: string | null;
  isComplete: boolean;
}

/**
 * Format lead summary for WhatsApp notification to owner.
 *
 * Per CONTEXT.md:
 * - Structured summary with emoji headers
 * - Complete leads: "ליד חדש"
 * - Incomplete leads: "ליד חדש (חלקי)"
 * - Tap to call/message - clickable phone number
 */
export function formatLeadSummary(lead: LeadSummary): string {
  const lines: string[] = [];

  // Header with emoji (per CONTEXT.md format)
  if (lead.isComplete) {
    lines.push('📞 ליד חדש');
  } else {
    lines.push('📞 ליד חדש (חלקי)');
  }

  lines.push(''); // Empty line after header

  // Customer name
  if (lead.customerName) {
    lines.push(`שם: ${lead.customerName}`);
  }

  // Need
  if (lead.need) {
    lines.push(`צורך: ${lead.need}`);
  }

  // Contact preference
  if (lead.contactPreference) {
    lines.push(`העדפה: ${lead.contactPreference}`);
  }

  // Phone number (formatted for tap-to-call)
  lines.push(`📱 ${formatPhoneDisplay(lead.customerPhone)}`);

  return lines.join('\n');
}

/**
 * Notify business owner of new/updated lead via WhatsApp.
 *
 * Per CONTEXT.md:
 * - Real-time updates: notify on first message, update as info comes in
 * - Incomplete leads: Yes, notify with "ליד חדש (חלקי)"
 *
 * Checks notification preferences before sending.
 * Determines notification type based on lead completeness:
 * - Complete leads: NotificationType.LEAD_QUALIFIED
 * - Incomplete leads: NotificationType.NEW_LEAD
 */
export async function notifyOwnerOfLead(leadId: string): Promise<void> {
  // Get lead with tenant info
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, leadId),
  });

  if (!lead) {
    console.warn(`[notifications] Lead ${leadId} not found`);
    return;
  }

  // Get tenant for owner phone and business context
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, lead.tenantId),
  });

  if (!tenant) {
    console.warn(`[notifications] Tenant ${lead.tenantId} not found`);
    return;
  }

  // Determine notification type based on lead status
  const isComplete = !!(lead.customerName && lead.need && lead.contactPreference);
  const notificationType = isComplete
    ? NotificationType.LEAD_QUALIFIED
    : NotificationType.NEW_LEAD;

  // Check notification preferences
  const shouldSend = await shouldNotify(lead.tenantId, notificationType);
  if (!shouldSend) {
    console.log(`[notifications] Skipping lead notification (preference disabled)`);
    return;
  }

  // Get owner phone from tenant record
  const ownerPhone = tenant.ownerPhone;

  if (!ownerPhone) {
    console.log(`[notifications] No owner phone configured for tenant ${lead.tenantId}, skipping notification`);
    return;
  }

  // Create WhatsApp client
  const client = await createWhatsAppClient(lead.tenantId);
  if (!client) {
    console.warn(`[notifications] No WhatsApp client for tenant ${lead.tenantId}`);
    return;
  }

  // Format lead summary
  const summary = formatLeadSummary({
    id: lead.id,
    customerPhone: lead.customerPhone,
    customerName: lead.customerName,
    need: lead.need,
    contactPreference: lead.contactPreference,
    isComplete,
  });

  // Send notification to owner
  try {
    await sendTextMessage(client, ownerPhone, summary);
    console.log(`[notifications] Sent lead notification to owner for lead ${leadId}`);
  } catch (error) {
    console.error(`[notifications] Failed to notify owner of lead ${leadId}:`, error);
    // Don't throw - notification failure shouldn't break lead flow
  }
}

/**
 * Create activity event for lead update.
 */
export async function createLeadActivity(
  tenantId: string,
  leadId: string,
  eventType: 'lead.created' | 'lead.updated' | 'lead.qualified' | 'lead.unresponsive',
  title: string,
  description?: string
): Promise<void> {
  const { activityQueue } = await import('../../queue/queues');

  await activityQueue.add('create-activity', {
    tenantId,
    eventType,
    title,
    description,
    metadata: { leadId },
    source: 'lead-capture',
    sourceId: leadId,
  });
}
