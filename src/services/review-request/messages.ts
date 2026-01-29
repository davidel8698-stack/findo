import { WhatsAppClient } from '../whatsapp/client';
import { sendTemplateMessage, TemplateComponent } from '../whatsapp/messages';
import { getActiveVariant } from '../optimization/ab-testing';

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
 * Variant content structure for review request messages.
 * Variants can specify alternate templates or personalization approaches.
 */
interface ReviewRequestVariant {
  templateName?: string;       // Alternate pre-approved template name
  customerFallback?: string;   // Hebrew fallback for missing customer name
  addEmoji?: boolean;          // Whether to add emoji to customer name
}

/**
 * Send initial review request via WhatsApp template.
 * Template must be pre-approved in Meta Business Suite.
 *
 * Uses A/B testing to select variant (template, personalization).
 * Variant selection enables outcome tracking for optimization.
 *
 * Template name: 'review_request' (or variant-specified template)
 * Variables:
 * - Body {{1}}: Customer name
 * - Body {{2}}: Business name
 * - Button URL {{1}}: Place ID (appended to base URL)
 *
 * @param client - WhatsApp client for the tenant
 * @param tenantId - Tenant ID for A/B test variant selection
 * @param customerPhone - Customer phone in international format
 * @param customerName - Customer name for personalization
 * @param businessName - Business name for message
 * @param placeId - Google Place ID for review link
 * @returns WhatsApp message ID
 */
export async function sendReviewRequestMessage(
  client: WhatsAppClient,
  tenantId: string,
  customerPhone: string,
  customerName: string,
  businessName: string,
  placeId: string
): Promise<string> {
  // Check for A/B test variant
  const variant = await getActiveVariant(tenantId, 'review_request_message');

  // Parse variant content if exists
  let templateName = 'review_request';
  let customerDisplay = customerName || 'לקוח יקר'; // "Dear customer" fallback

  if (variant) {
    try {
      const content = JSON.parse(variant.variantContent) as ReviewRequestVariant;
      if (content.templateName) {
        templateName = content.templateName;
      }
      if (content.customerFallback && !customerName) {
        customerDisplay = content.customerFallback;
      }
      if (content.addEmoji && customerName) {
        customerDisplay = `${customerName} 🙏`;
      }
      console.log(`[review-request] Using variant ${variant.variantName} for tenant ${tenantId}`);
    } catch {
      // Invalid JSON, use defaults
      console.warn(`[review-request] Invalid variant content for ${variant.variantName}`);
    }
  }

  const components: TemplateComponent[] = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: customerDisplay },
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
    templateName,
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
