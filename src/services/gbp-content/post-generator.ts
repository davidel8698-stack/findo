/**
 * AI Post Content Generator
 *
 * Generates promotional post content using Claude Haiku 4.5.
 * Follows the same pattern as reply-generator.ts.
 *
 * Per CONTEXT.md:
 * - Safe content = general updates, seasonal, behind-the-scenes (NOT promotions)
 * - Owner can provide content or request AI generation
 * - AI prompt must forbid phone numbers (Google rejects)
 */

import Anthropic from '@anthropic-ai/sdk';
import type { CallToActionType, PostTopicType } from '../google/posts';

const anthropic = new Anthropic();

export interface PostContent {
  summary: string;
  topicType: PostTopicType;
  callToActionType: CallToActionType | null;
  isSafe: boolean; // Safe = can auto-publish without owner approval
}

export interface GeneratePostOptions {
  businessName: string;
  businessType: string;
  ownerContent?: string; // If owner provided text
  recentActivity?: string; // Any recent activity to mention
  forceSafe?: boolean; // Force safe content (for auto-publish)
}

/**
 * Generate promotional post content.
 *
 * @param options - Generation options
 * @returns Generated post content
 */
export async function generatePostContent(
  options: GeneratePostOptions
): Promise<PostContent> {
  const { businessName, businessType, ownerContent, recentActivity, forceSafe } = options;

  const prompt = ownerContent
    ? buildOwnerContentPrompt(businessName, businessType, ownerContent)
    : buildAIGenerationPrompt(businessName, businessType, recentActivity, forceSafe);

  try {
    const response = await anthropic.beta.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      betas: ['structured-outputs-2025-11-13'],
      messages: [{ role: 'user', content: prompt }],
      output_format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            topicType: {
              type: 'string',
              enum: ['STANDARD', 'EVENT', 'OFFER'],
            },
            callToActionType: {
              type: ['string', 'null'],
              enum: ['LEARN_MORE', 'BOOK', 'ORDER', 'SHOP', 'SIGN_UP', 'CALL', null],
            },
            isSafe: { type: 'boolean' },
          },
          required: ['summary', 'topicType', 'callToActionType', 'isSafe'],
          additionalProperties: false,
        },
      },
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const result = JSON.parse(content.text) as PostContent;

    // Validate no phone numbers
    if (/\d{2,3}[-.\s]?\d{7}|\d{10}/.test(result.summary)) {
      console.warn('[post-generator] AI included phone number, regenerating...');
      // Try once more with explicit reminder
      return generatePostContent({ ...options, forceSafe: true });
    }

    return result;

  } catch (error) {
    console.error('[post-generator] AI generation failed:', error);
    // Return safe fallback
    return getSafeFallback(businessName);
  }
}

/**
 * Build prompt for AI-only generation.
 */
function buildAIGenerationPrompt(
  businessName: string,
  businessType: string,
  recentActivity?: string,
  forceSafe?: boolean
): string {
  const safeInstruction = forceSafe
    ? `IMPORTANT: Generate ONLY safe content - general updates, seasonal greetings, or customer appreciation. NO promotions, NO specific offers, NO discounts.`
    : `If appropriate, you may include a subtle promotion, but prefer safe content (updates, greetings) that doesn't commit the business to specific offers.`;

  return `Generate a Google Business Profile post for a business.

Business Name: ${businessName}
Business Type: ${businessType}
Recent Activity: ${recentActivity || 'none'}

Requirements:
- Write in Hebrew
- 100-200 characters (ideal length for GBP engagement)
- Engaging, friendly tone
- NO phone numbers anywhere (Google strictly rejects these - CRITICAL!)
- NO email addresses
${safeInstruction}

Content types by safety:
- SAFE (isSafe=true): seasonal greetings, customer appreciation, quality commitment, behind-the-scenes, general updates
- NOT SAFE (isSafe=false): specific discounts, limited-time offers, sales promotions

Return JSON with:
- summary: The post text in Hebrew
- topicType: "STANDARD" for updates, "EVENT" for events, "OFFER" for promotions
- callToActionType: "LEARN_MORE", "BOOK", "ORDER", "SHOP", "SIGN_UP", "CALL", or null
- isSafe: true if content is general/seasonal (can auto-publish), false if contains specific promotions`;
}

/**
 * Build prompt when owner provided content.
 */
function buildOwnerContentPrompt(
  businessName: string,
  businessType: string,
  ownerContent: string
): string {
  return `Convert the owner's content into a polished Google Business Profile post.

Business Name: ${businessName}
Business Type: ${businessType}
Owner's Input: "${ownerContent}"

Requirements:
- Write in Hebrew (keep owner's tone if in Hebrew, translate if in English)
- 100-200 characters (condense if needed)
- Keep the owner's message intent
- Professional but friendly tone
- NO phone numbers (remove if present - Google rejects)
- NO email addresses (remove if present)

Return JSON with:
- summary: The polished post text in Hebrew
- topicType: "STANDARD" for updates, "EVENT" for events, "OFFER" for promotions
- callToActionType: "LEARN_MORE", "BOOK", "ORDER", "SHOP", "SIGN_UP", "CALL", or null (based on content)
- isSafe: true if content is general (no specific promotions), false if contains specific offers`;
}

/**
 * Safe fallback content.
 */
function getSafeFallback(businessName: string): PostContent {
  const fallbacks = [
    `תודה שאתם איתנו! ${businessName} מזמין אתכם להמשיך ליהנות משירות מעולה.`,
    `שבוע טוב מ${businessName}! תודה על האמון והתמיכה.`,
    `אנחנו ב${businessName} כאן בשבילכם - מוזמנים לפנות בכל שאלה.`,
  ];

  return {
    summary: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    topicType: 'STANDARD',
    callToActionType: null,
    isSafe: true,
  };
}

/**
 * Generate safe content specifically for auto-publishing.
 * Used when owner doesn't respond after all reminders.
 */
export async function generateSafeAutoContent(
  businessName: string,
  businessType: string
): Promise<PostContent> {
  return generatePostContent({
    businessName,
    businessType,
    forceSafe: true, // Force safe content
  });
}
