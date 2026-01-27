import { db } from '../../db/index';
import { whatsappConversations, type WhatsAppConversation, type NewWhatsAppConversation } from '../../db/schema/index';
import { eq, and } from 'drizzle-orm';

/**
 * Open or extend the 24-hour conversation window.
 *
 * When a customer sends a message, this opens a 24-hour window
 * during which the business can reply with freeform messages.
 * If the conversation already exists, extends the window.
 *
 * @param tenantId - Tenant UUID
 * @param customerPhone - Customer's phone number in international format
 * @param customerName - Customer's name from WhatsApp profile (optional)
 * @param messageTime - Time the customer sent the message
 * @returns The conversation record (created or updated)
 */
export async function openConversationWindow(
  tenantId: string,
  customerPhone: string,
  customerName: string | undefined,
  messageTime: Date
): Promise<WhatsAppConversation> {
  const windowExpiresAt = new Date(messageTime);
  windowExpiresAt.setHours(windowExpiresAt.getHours() + 24);

  // Check if conversation exists
  const existing = await db.query.whatsappConversations.findFirst({
    where: and(
      eq(whatsappConversations.tenantId, tenantId),
      eq(whatsappConversations.customerPhone, customerPhone)
    ),
  });

  if (existing) {
    // Update existing conversation - extend window
    const [updated] = await db
      .update(whatsappConversations)
      .set({
        windowOpenedAt: messageTime,
        windowExpiresAt,
        lastMessageAt: messageTime,
        messageCount: existing.messageCount + 1,
        customerName: customerName || existing.customerName, // Update name if provided
        updatedAt: new Date(),
      })
      .where(eq(whatsappConversations.id, existing.id))
      .returning();

    return updated;
  }

  // Create new conversation
  const [created] = await db
    .insert(whatsappConversations)
    .values({
      tenantId,
      customerPhone,
      customerName,
      windowOpenedAt: messageTime,
      windowExpiresAt,
      lastMessageAt: messageTime,
      messageCount: 1,
    })
    .returning();

  return created;
}

/**
 * Get conversation info with window status.
 *
 * @param tenantId - Tenant UUID
 * @param customerPhone - Customer's phone number in international format
 * @returns Conversation record or null if not found
 */
export async function getConversation(
  tenantId: string,
  customerPhone: string
): Promise<WhatsAppConversation | null> {
  const conversation = await db.query.whatsappConversations.findFirst({
    where: and(
      eq(whatsappConversations.tenantId, tenantId),
      eq(whatsappConversations.customerPhone, customerPhone)
    ),
  });

  return conversation || null;
}

/**
 * Check if the 24-hour conversation window is currently open.
 *
 * @param tenantId - Tenant UUID
 * @param customerPhone - Customer's phone number in international format
 * @returns true if window is open, false if expired or no conversation exists
 */
export async function isWindowOpen(
  tenantId: string,
  customerPhone: string
): Promise<boolean> {
  const conversation = await getConversation(tenantId, customerPhone);

  if (!conversation || !conversation.windowExpiresAt) {
    return false;
  }

  return new Date() < conversation.windowExpiresAt;
}

/**
 * Increment message count for outbound messages.
 *
 * Call this when sending a message to update the conversation stats.
 * Does NOT extend the window (only customer messages do that).
 *
 * @param tenantId - Tenant UUID
 * @param customerPhone - Customer's phone number
 */
export async function incrementMessageCount(
  tenantId: string,
  customerPhone: string
): Promise<void> {
  const conversation = await getConversation(tenantId, customerPhone);

  if (!conversation) {
    // No conversation exists - this shouldn't happen for outbound messages
    // as we should only send when there's an existing conversation
    console.warn(`[conversations] No conversation found for ${tenantId}/${customerPhone}`);
    return;
  }

  await db
    .update(whatsappConversations)
    .set({
      messageCount: conversation.messageCount + 1,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(whatsappConversations.id, conversation.id));
}

/**
 * Get conversation by ID.
 *
 * @param conversationId - Conversation UUID
 * @returns Conversation record or null if not found
 */
export async function getConversationById(
  conversationId: string
): Promise<WhatsAppConversation | null> {
  const conversation = await db.query.whatsappConversations.findFirst({
    where: eq(whatsappConversations.id, conversationId),
  });

  return conversation || null;
}
