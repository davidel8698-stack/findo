import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client (uses ANTHROPIC_API_KEY env var automatically)
const anthropic = new Anthropic();

// Valid Claude model - use claude-3-haiku for fast, cost-effective generation
const CLAUDE_MODEL = 'claude-3-haiku-20240307';

/**
 * Result of AI-generated review reply.
 */
export interface ReviewReplyResult {
  replyText: string;      // Hebrew reply text
  tone: 'warm' | 'apologetic' | 'neutral';
  referencedContent: string;  // What from review was referenced
}

/**
 * Review data for reply generation.
 */
export interface ReviewForReply {
  reviewerName: string;
  comment?: string;
  starRating: number;
}

// Fallback replies for AI failures
const FALLBACK_POSITIVE_REPLY = 'תודה רבה על הביקורת החיובית! נשמח לראותך שוב.';
const FALLBACK_NEGATIVE_REPLY = 'תודה על הביקורת. אנו לוקחים את המשוב שלך ברצינות ונשמח לדבר איתך.';

// Maximum reply byte length per Google API
const MAX_REPLY_BYTES = 4096;

/**
 * Generate a personalized Hebrew reply to a Google review using Claude AI.
 *
 * Per CONTEXT.md:
 * - Write in Hebrew
 * - 1-2 sentences maximum (short replies)
 * - Warm & personal tone, NOT corporate
 * - Reference something specific from the review (what they mentioned)
 * - No emojis
 * - Sign as the business (not "the team")
 *
 * @param review - The review to reply to
 * @param businessName - Name of the business
 * @param isPositive - Whether this is a positive review (4-5 stars or positive 3-star)
 * @returns Generated reply with tone and referenced content
 */
export async function generateReviewReply(
  review: ReviewForReply,
  businessName: string,
  isPositive: boolean
): Promise<ReviewReplyResult> {
  const toneDirection = isPositive
    ? 'warm thank-you with invitation to return'
    : 'appropriately apologetic or neutral based on the review content';

  const prompt = `Generate a ${toneDirection} reply to this Google review.

Business: ${businessName}
Reviewer: ${review.reviewerName}
Rating: ${review.starRating} stars
Review: ${review.comment || '(no text, rating only)'}

Requirements:
- Write in Hebrew
- 1-2 sentences maximum
- Warm, personal tone (not corporate)
- Reference something specific they mentioned (if available)
- No emojis
- Sign as the business (not "the team")

IMPORTANT: Return ONLY valid JSON (no markdown, no explanation) with these exact fields:
{
  "replyText": "The Hebrew reply text",
  "tone": "warm" or "apologetic" or "neutral",
  "referencedContent": "What from the review was referenced"
}`;

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: prompt
      }],
    });

    // Extract text content from response
    const content = response.content[0];
    if (content.type !== 'text') {
      console.warn('[reply-generator] Unexpected response type:', content.type);
      return getFallbackReply(isPositive);
    }

    // Parse JSON from response - handle potential markdown code blocks
    const text = content.text.trim();
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                      text.match(/```\s*([\s\S]*?)\s*```/) ||
                      [null, text];
    const jsonStr = jsonMatch[1] || text;

    const result = JSON.parse(jsonStr) as ReviewReplyResult;

    // Validate reply byte length
    const byteLength = Buffer.byteLength(result.replyText, 'utf8');
    if (byteLength > MAX_REPLY_BYTES) {
      console.warn(`[reply-generator] Reply exceeds byte limit (${byteLength} > ${MAX_REPLY_BYTES}), using fallback`);
      return getFallbackReply(isPositive);
    }

    return result;
  } catch (error) {
    console.error('[reply-generator] Failed to generate reply:', error);
    return getFallbackReply(isPositive);
  }
}

/**
 * Classify whether a 3-star review is positive or negative based on sentiment.
 *
 * Per CONTEXT.md:
 * - 4-5 stars: positive (auto-reply)
 * - 1-2 stars: negative (alert owner)
 * - 3 stars: analyze sentiment to determine
 * - 3 stars with no comment: treat as negative (safer to alert owner)
 *
 * @param comment - The review comment text (may be undefined)
 * @param starRating - The star rating (1-5)
 * @returns true if positive, false if negative
 */
export async function classifyReviewSentiment(
  comment: string | undefined,
  starRating: number
): Promise<boolean> {
  // Clear positive
  if (starRating >= 4) {
    return true;
  }

  // Clear negative
  if (starRating <= 2) {
    return false;
  }

  // 3-star edge case
  // No comment -> treat as negative (safer to alert owner)
  if (!comment || comment.trim() === '') {
    return false;
  }

  // Use Claude to analyze sentiment
  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: `This is a 3-star Google review. Is the overall sentiment POSITIVE or NEGATIVE?

Review: "${comment}"

Reply with only one word: POSITIVE or NEGATIVE`
      }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      console.warn('[reply-generator] Unexpected sentiment response type:', content.type);
      return false; // Default to negative if uncertain
    }

    const text = content.text.toUpperCase();
    return text.includes('POSITIVE');
  } catch (error) {
    console.error('[reply-generator] Failed to classify sentiment:', error);
    return false; // Default to negative if AI fails
  }
}

/**
 * Get a fallback reply when AI generation fails.
 */
function getFallbackReply(isPositive: boolean): ReviewReplyResult {
  return {
    replyText: isPositive ? FALLBACK_POSITIVE_REPLY : FALLBACK_NEGATIVE_REPLY,
    tone: isPositive ? 'warm' : 'neutral',
    referencedContent: 'none (fallback reply)'
  };
}
