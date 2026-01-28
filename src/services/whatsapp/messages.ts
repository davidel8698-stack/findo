import { WhatsAppClient } from './client';

/**
 * Response type from WhatsApp messages API.
 * Returned after successfully sending a message.
 */
export interface SendMessageResponse {
  messaging_product: 'whatsapp';
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

/**
 * Result returned from message sending functions.
 */
export interface MessageSendResult {
  messageId: string; // WhatsApp message ID (for status tracking)
  waId: string;      // Recipient's WhatsApp ID
}

/**
 * Template component for dynamic content in template messages.
 * Used to fill placeholders in pre-approved templates.
 */
export interface TemplateComponent {
  type: 'header' | 'body' | 'button';
  sub_type?: 'quick_reply' | 'url'; // For button components
  index?: number; // Button index (0, 1, 2...)
  parameters: Array<TemplateParameter>;
}

/**
 * Parameter types for template components.
 */
export type TemplateParameter =
  | { type: 'text'; text: string }
  | { type: 'image'; image: { link: string } }
  | { type: 'document'; document: { link: string; filename?: string } }
  | { type: 'video'; video: { link: string } }
  | { type: 'payload'; payload: string }; // For quick reply buttons

/**
 * Send a template message to initiate a conversation.
 *
 * Template messages are required to start conversations with customers
 * who haven't messaged in the last 24 hours. Templates must be
 * pre-approved in Meta Business Suite.
 *
 * @param client - WhatsApp client instance
 * @param to - Phone number in international format (e.g., '972501234567')
 * @param templateName - Name of the approved template
 * @param languageCode - Template language code (default: 'he' for Hebrew)
 * @param components - Dynamic content for template placeholders
 * @returns Message ID and WhatsApp ID for tracking
 *
 * @example
 * ```typescript
 * // Simple template without variables
 * await sendTemplateMessage(client, '972501234567', 'appointment_reminder');
 *
 * // Template with body parameters
 * await sendTemplateMessage(client, '972501234567', 'order_update', 'he', [
 *   {
 *     type: 'body',
 *     parameters: [
 *       { type: 'text', text: 'Order #12345' },
 *       { type: 'text', text: 'shipped' },
 *     ],
 *   },
 * ]);
 * ```
 */
export async function sendTemplateMessage(
  client: WhatsAppClient,
  to: string,
  templateName: string,
  languageCode: string = 'he', // Hebrew default for Israeli market
  components?: TemplateComponent[]
): Promise<MessageSendResult> {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components && { components }),
    },
  };

  const response = await client.request<SendMessageResponse>(
    client.messagesEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return {
    messageId: response.messages[0].id,
    waId: response.contacts[0].wa_id,
  };
}

/**
 * Send a freeform text message within the 24-hour customer service window.
 *
 * Freeform messages can only be sent within 24 hours of the customer's
 * last message. After the window expires, use sendTemplateMessage instead.
 *
 * @param client - WhatsApp client instance
 * @param to - Phone number in international format
 * @param text - Message text content
 * @param previewUrl - Enable URL preview in message (default: false)
 * @returns Message ID and WhatsApp ID for tracking
 *
 * @example
 * ```typescript
 * await sendTextMessage(client, '972501234567', 'Thank you for your message!');
 *
 * // With URL preview enabled
 * await sendTextMessage(
 *   client,
 *   '972501234567',
 *   'Check out our website: https://example.com',
 *   true
 * );
 * ```
 */
export async function sendTextMessage(
  client: WhatsAppClient,
  to: string,
  text: string,
  previewUrl: boolean = false
): Promise<MessageSendResult> {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      body: text,
      preview_url: previewUrl,
    },
  };

  const response = await client.request<SendMessageResponse>(
    client.messagesEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return {
    messageId: response.messages[0].id,
    waId: response.contacts[0].wa_id,
  };
}

/**
 * Send an image message within the 24-hour customer service window.
 *
 * Images can be sent via URL or media ID (from previous upload).
 * Only works within the 24-hour window after customer's last message.
 *
 * @param client - WhatsApp client instance
 * @param to - Phone number in international format
 * @param imageUrl - Public URL of the image
 * @param caption - Optional caption text for the image
 * @returns Message ID and WhatsApp ID for tracking
 *
 * @example
 * ```typescript
 * await sendImageMessage(
 *   client,
 *   '972501234567',
 *   'https://example.com/receipt.jpg',
 *   'Your receipt'
 * );
 * ```
 */
export async function sendImageMessage(
  client: WhatsAppClient,
  to: string,
  imageUrl: string,
  caption?: string
): Promise<MessageSendResult> {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'image',
    image: {
      link: imageUrl,
      ...(caption && { caption }),
    },
  };

  const response = await client.request<SendMessageResponse>(
    client.messagesEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return {
    messageId: response.messages[0].id,
    waId: response.contacts[0].wa_id,
  };
}

/**
 * Check if a customer service window is currently open.
 *
 * The 24-hour window opens when a customer sends a message and
 * expires 24 hours later. Within this window, businesses can
 * send freeform messages without using templates.
 *
 * @param windowExpiresAt - Window expiration timestamp from database
 * @returns true if window is open, false otherwise
 *
 * @example
 * ```typescript
 * const conversation = await getConversation(tenantId, customerPhone);
 * if (isWindowOpen(conversation.windowExpiresAt)) {
 *   await sendTextMessage(client, customerPhone, 'Hello!');
 * } else {
 *   await sendTemplateMessage(client, customerPhone, 'greeting');
 * }
 * ```
 */
export function isWindowOpen(windowExpiresAt: Date | null): boolean {
  if (!windowExpiresAt) return false;
  return new Date() < windowExpiresAt;
}

/**
 * Calculate window expiration from customer message timestamp.
 *
 * WhatsApp's 24-hour customer service window starts when a customer
 * sends a message. Use this to set windowExpiresAt in the database.
 *
 * @param customerMessageTime - When customer sent their message
 * @returns Window expiration timestamp (24 hours later)
 */
export function calculateWindowExpiry(customerMessageTime: Date): Date {
  const expiresAt = new Date(customerMessageTime);
  expiresAt.setHours(expiresAt.getHours() + 24);
  return expiresAt;
}

/**
 * Interactive button for WhatsApp message.
 */
export interface InteractiveButton {
  /** Button callback ID (max 256 chars) */
  id: string;
  /** Button text (max 20 chars) */
  title: string;
}

/**
 * Send an interactive button message within the 24-hour customer service window.
 *
 * Interactive messages with reply buttons allow users to tap to respond.
 * Maximum 3 buttons per message. Only works within the 24-hour window.
 *
 * @param client - WhatsApp client instance
 * @param to - Phone number in international format
 * @param bodyText - Main message body text (max 1024 chars)
 * @param buttons - Array of buttons (max 3)
 * @param headerText - Optional header text
 * @param footerText - Optional footer text
 * @returns Message ID and WhatsApp ID for tracking
 *
 * @example
 * ```typescript
 * await sendInteractiveButtons(
 *   client,
 *   '972501234567',
 *   'Would you like to proceed?',
 *   [
 *     { id: 'approve', title: 'Yes' },
 *     { id: 'reject', title: 'No' },
 *   ],
 *   'Confirmation',
 *   'Reply to confirm'
 * );
 * ```
 */
export async function sendInteractiveButtons(
  client: WhatsAppClient,
  to: string,
  bodyText: string,
  buttons: InteractiveButton[],
  headerText?: string,
  footerText?: string
): Promise<MessageSendResult> {
  // Validate constraints
  if (buttons.length > 3) {
    throw new Error('Maximum 3 buttons allowed per interactive message');
  }
  if (bodyText.length > 1024) {
    throw new Error('Body text exceeds maximum 1024 characters');
  }

  // Build interactive payload per WhatsApp Cloud API spec
  const interactive: Record<string, unknown> = {
    type: 'button',
    body: { text: bodyText },
    action: {
      buttons: buttons.map((b) => ({
        type: 'reply',
        reply: { id: b.id, title: b.title },
      })),
    },
  };

  // Add optional header
  if (headerText) {
    interactive.header = { type: 'text', text: headerText };
  }

  // Add optional footer
  if (footerText) {
    interactive.footer = { text: footerText };
  }

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'interactive',
    interactive,
  };

  const response = await client.request<SendMessageResponse>(
    client.messagesEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  return {
    messageId: response.messages[0].id,
    waId: response.contacts[0].wa_id,
  };
}
