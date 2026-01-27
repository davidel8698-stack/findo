import * as crypto from 'crypto';

/**
 * WhatsApp webhook payload types.
 * Based on Meta Cloud API v21.0 webhook format.
 */
export interface WhatsAppWebhookPayload {
  object: 'whatsapp_business_account';
  entry: Array<{
    id: string; // WABA ID
    changes: Array<{
      field: 'messages';
      value: WhatsAppWebhookValue;
    }>;
  }>;
}

export interface WhatsAppWebhookValue {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: Array<{
    profile: { name: string };
    wa_id: string;
  }>;
  messages?: Array<WhatsAppIncomingMessage>;
  statuses?: Array<WhatsAppStatusUpdate>;
}

export interface WhatsAppIncomingMessage {
  from: string; // Sender phone number
  id: string; // Message ID
  timestamp: string; // Unix timestamp as string
  type:
    | 'text'
    | 'image'
    | 'audio'
    | 'video'
    | 'document'
    | 'sticker'
    | 'location'
    | 'contacts'
    | 'button'
    | 'interactive';
  text?: { body: string };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
    caption?: string;
  };
  // Other types omitted for Phase 2 (only text and image handled)
}

export interface WhatsAppStatusUpdate {
  id: string; // Message ID
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
    message?: string;
  }>;
}

/**
 * Verify webhook signature using HMAC-SHA256.
 *
 * IMPORTANT: Must be called with raw body BEFORE JSON parsing.
 * Parsing changes the byte representation and breaks signature verification.
 *
 * @param rawBody - Raw request body as string or Buffer
 * @param signature - X-Hub-Signature-256 header value
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string
): boolean {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    console.error('[whatsapp] META_APP_SECRET not configured');
    return false;
  }

  if (!signature || !signature.startsWith('sha256=')) {
    console.warn('[whatsapp] Invalid signature format');
    return false;
  }

  const expectedSignature =
    'sha256=' +
    crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');

  try {
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    // Length mismatch will throw in timingSafeEqual
    console.warn('[whatsapp] Signature comparison failed:', error);
    return false;
  }
}

/**
 * Parse webhook payload into structured data.
 *
 * Separates messages from status updates for different processing queues.
 */
export function parseWebhookPayload(payload: WhatsAppWebhookPayload): {
  wabaId: string | null;
  phoneNumberId: string | null;
  messages: ParsedMessage[];
  statuses: ParsedStatus[];
} {
  const messages: ParsedMessage[] = [];
  const statuses: ParsedStatus[] = [];
  let wabaId: string | null = null;
  let phoneNumberId: string | null = null;

  for (const entry of payload.entry || []) {
    wabaId = entry.id;

    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue;

      const value = change.value;
      phoneNumberId = value.metadata.phone_number_id;

      // Parse incoming messages
      for (const msg of value.messages || []) {
        const contactName = value.contacts?.[0]?.profile.name;

        messages.push({
          waMessageId: msg.id,
          from: msg.from,
          timestamp: new Date(parseInt(msg.timestamp) * 1000),
          type: mapMessageType(msg.type),
          text: msg.text?.body,
          mediaId: msg.image?.id,
          mediaCaption: msg.image?.caption,
          contactName,
          rawType: msg.type,
        });
      }

      // Parse status updates
      for (const status of value.statuses || []) {
        statuses.push({
          waMessageId: status.id,
          status: status.status,
          timestamp: new Date(parseInt(status.timestamp) * 1000),
          recipientId: status.recipient_id,
          errorCode: status.errors?.[0]?.code,
          errorMessage: status.errors?.[0]?.message || status.errors?.[0]?.title,
        });
      }
    }
  }

  return { wabaId, phoneNumberId, messages, statuses };
}

export interface ParsedMessage {
  waMessageId: string;
  from: string;
  timestamp: Date;
  type: 'text' | 'image' | 'unknown';
  text?: string;
  mediaId?: string;
  mediaCaption?: string;
  contactName?: string;
  rawType: string; // Original type for logging/debugging
}

export interface ParsedStatus {
  waMessageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  recipientId: string;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * Map WhatsApp message type to our simplified types.
 * Phase 2 only handles text and image; others marked as unknown.
 */
function mapMessageType(waType: string): 'text' | 'image' | 'unknown' {
  switch (waType) {
    case 'text':
      return 'text';
    case 'image':
      return 'image';
    default:
      return 'unknown';
  }
}

/**
 * Check if message type is supported in Phase 2.
 */
export function isSupportedMessageType(type: string): boolean {
  return type === 'text' || type === 'image';
}
