import { pgTable, uuid, varchar, text, timestamp, integer, index, pgEnum, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

// WhatsApp connection status
export const whatsappConnectionStatusEnum = pgEnum('whatsapp_connection_status', [
  'pending',      // Connection initiated but not verified
  'active',       // Connection verified and working
  'disconnected', // User disconnected
  'invalid',      // Token became invalid
]);

// Message direction
export const whatsappMessageDirectionEnum = pgEnum('whatsapp_message_direction', [
  'inbound',  // Customer -> Business
  'outbound', // Business -> Customer
]);

// Message types we support (per CONTEXT.md: text and images in this phase)
export const whatsappMessageTypeEnum = pgEnum('whatsapp_message_type', [
  'text',     // Text message
  'image',    // Image message
  'template', // Template message (outbound only)
  'unknown',  // Unsupported type received
]);

// Message delivery status
export const whatsappMessageStatusEnum = pgEnum('whatsapp_message_status', [
  'pending',   // Queued for sending
  'sent',      // Sent to WhatsApp servers
  'delivered', // Delivered to recipient device
  'read',      // Read by recipient
  'failed',    // Failed to send
]);

/**
 * WhatsApp Business Account connections per tenant.
 * One connection per tenant (single WhatsApp number per business per CONTEXT.md).
 */
export const whatsappConnections = pgTable('whatsapp_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // WhatsApp Business Account identifiers
  wabaId: varchar('waba_id', { length: 50 }).notNull(), // WhatsApp Business Account ID from Embedded Signup
  phoneNumberId: varchar('phone_number_id', { length: 50 }).notNull(), // Phone Number ID for API calls
  displayPhoneNumber: varchar('display_phone_number', { length: 20 }).notNull(), // Human-readable phone number
  businessName: varchar('business_name', { length: 255 }), // Business name from Meta

  // Connection health
  status: whatsappConnectionStatusEnum('status').default('pending').notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }), // When connection was verified working

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Index for status queries (find invalid connections for reconnection)
  statusIdx: index('whatsapp_connections_status_idx').on(table.status),
}));

/**
 * WhatsApp conversations track 24-hour customer service windows.
 * Window opens when customer sends message, expires 24 hours later.
 */
export const whatsappConversations = pgTable('whatsapp_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Customer identification
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(), // Customer's phone number (international format)
  customerName: varchar('customer_name', { length: 255 }), // Name from WhatsApp profile (nullable)

  // 24-hour service window tracking
  windowOpenedAt: timestamp('window_opened_at', { withTimezone: true }), // When customer last sent message
  windowExpiresAt: timestamp('window_expires_at', { withTimezone: true }), // 24 hours after windowOpenedAt

  // Activity tracking
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }), // Last message in conversation
  messageCount: integer('message_count').default(0).notNull(), // Total messages in conversation

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Unique conversation per tenant + customer phone
  uniqueConversation: unique('whatsapp_conversations_unique').on(table.tenantId, table.customerPhone),
  // Index for expiry queries (find open windows)
  windowExpiresIdx: index('whatsapp_conversations_window_expires_idx').on(table.windowExpiresAt),
  // Index for tenant + phone lookups
  tenantPhoneIdx: index('whatsapp_conversations_tenant_phone_idx').on(table.tenantId, table.customerPhone),
}));

/**
 * WhatsApp messages track all messages sent and received.
 * Used for delivery status tracking and message history.
 */
export const whatsappMessages = pgTable('whatsapp_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  conversationId: uuid('conversation_id').references(() => whatsappConversations.id, { onDelete: 'set null' }),

  // WhatsApp message identification
  waMessageId: varchar('wa_message_id', { length: 100 }), // WhatsApp's message ID (for status updates)

  // Message direction and type
  direction: whatsappMessageDirectionEnum('direction').notNull(),
  type: whatsappMessageTypeEnum('type').notNull(),

  // Message content
  content: text('content'), // Text content (NULL for media-only)
  mediaId: varchar('media_id', { length: 255 }), // WhatsApp media ID (for images)
  templateName: varchar('template_name', { length: 100 }), // Template name if template message

  // Phone numbers
  recipientPhone: varchar('recipient_phone', { length: 20 }).notNull(), // Recipient phone number
  senderPhone: varchar('sender_phone', { length: 20 }).notNull(), // Sender phone number

  // Delivery status
  status: whatsappMessageStatusEnum('status').default('pending').notNull(),
  errorCode: varchar('error_code', { length: 20 }), // Error code if failed

  // Delivery timestamps
  sentAt: timestamp('sent_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  readAt: timestamp('read_at', { withTimezone: true }),

  // Record timestamp
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Index for status update lookups (find message by WhatsApp ID)
  waMessageIdIdx: index('whatsapp_messages_wa_message_id_idx').on(table.waMessageId),
  // Index for conversation queries
  tenantRecipientIdx: index('whatsapp_messages_tenant_recipient_idx').on(table.tenantId, table.recipientPhone),
  // Index for conversation ID lookups
  conversationIdx: index('whatsapp_messages_conversation_idx').on(table.conversationId),
}));

// Type exports
export type WhatsAppConnection = typeof whatsappConnections.$inferSelect;
export type NewWhatsAppConnection = typeof whatsappConnections.$inferInsert;

export type WhatsAppConversation = typeof whatsappConversations.$inferSelect;
export type NewWhatsAppConversation = typeof whatsappConversations.$inferInsert;

export type WhatsAppMessage = typeof whatsappMessages.$inferSelect;
export type NewWhatsAppMessage = typeof whatsappMessages.$inferInsert;
