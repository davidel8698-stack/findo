import { WhatsAppClient } from '../whatsapp/client';
import { sendTemplateMessage, TemplateComponent } from '../whatsapp/messages';

/**
 * Generate direct Google review link from Place ID.
 * This link opens Google Maps directly to the review form.
 *
 * @param placeId - Google Place ID for the business
 * @returns Direct review link URL
 */
export function generateGoogleReviewLink(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

/**
 * Send initial review request via WhatsApp template.
 * Template must be pre-approved in Meta Business Suite.
 *
 * Template name: 'review_request'
 * Variables:
 * - Body {{1}}: Customer name
 * - Body {{2}}: Business name
 * - Button URL {{1}}: Place ID (appended to base URL)
 *
 * @param client - WhatsApp client for the tenant
 * @param customerPhone - Customer phone in international format
 * @param customerName - Customer name for personalization
 * @param businessName - Business name for message
 * @param placeId - Google Place ID for review link
 * @returns WhatsApp message ID
 */
export async function sendReviewRequestMessage(
  client: WhatsAppClient,
  customerPhone: string,
  customerName: string,
  businessName: string,
  placeId: string
): Promise<string> {
  const components: TemplateComponent[] = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: customerName || 'לקוח יקר' }, // "Dear customer" fallback
        { type: 'text', text: businessName },
      ],
    },
    {
      type: 'button',
      sub_type: 'url',
      index: 0,
      parameters: [{ type: 'text', text: placeId }],
    },
  ];

  const result = await sendTemplateMessage(
    client,
    customerPhone,
    'review_request',
    'he',
    components
  );

  return result.messageId;
}

/**
 * Send review reminder via WhatsApp template.
 * Only one reminder is sent (REVW-06, REVW-07: no spam).
 *
 * Template name: 'review_reminder'
 * Variables:
 * - Body {{1}}: Business name
 * - Button URL {{1}}: Place ID
 *
 * @param client - WhatsApp client for the tenant
 * @param customerPhone - Customer phone in international format
 * @param businessName - Business name for message
 * @param placeId - Google Place ID for review link
 * @returns WhatsApp message ID
 */
export async function sendReviewReminderMessage(
  client: WhatsAppClient,
  customerPhone: string,
  businessName: string,
  placeId: string
): Promise<string> {
  const components: TemplateComponent[] = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: businessName },
      ],
    },
    {
      type: 'button',
      sub_type: 'url',
      index: 0,
      parameters: [{ type: 'text', text: placeId }],
    },
  ];

  const result = await sendTemplateMessage(
    client,
    customerPhone,
    'review_reminder',
    'he',
    components
  );

  return result.messageId;
}
