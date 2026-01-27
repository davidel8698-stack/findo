import Anthropic from '@anthropic-ai/sdk';
import type { ConversationState } from './chatbot';

// Initialize Anthropic client (uses ANTHROPIC_API_KEY env var automatically)
const anthropic = new Anthropic();

/**
 * Extracted lead information from customer message.
 */
export interface LeadInfo {
  name: string | null;
  need: string | null;
  contactPreference: string | null;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Extract lead information from Hebrew WhatsApp message using Claude AI.
 *
 * Per CONTEXT.md: AI interprets intent from unclear messages, doesn't ask for clarification.
 *
 * @param message - The customer's message text
 * @param conversationHistory - Previous messages in the conversation
 * @param currentState - Current conversation state
 * @returns Extracted lead info with confidence level
 */
export async function extractLeadInfo(
  message: string,
  conversationHistory: string[],
  currentState: ConversationState
): Promise<LeadInfo> {
  const systemPrompt = `You are extracting lead information from Hebrew WhatsApp messages.
The conversation is with a potential customer who called a business and didn't get through.

Current conversation state: ${currentState}
Previous messages in conversation:
${conversationHistory.map((m, i) => `${i + 1}. ${m}`).join('\n') || '(no previous messages)'}

Extract the following from the customer's CURRENT message:
- name: Their name if they mentioned it (Hebrew or transliterated)
- need: What they need/want (their reason for calling, in Hebrew)
- contactPreference: When/how they want to be called back (morning, evening, ASAP, specific time, etc.)

Guidelines:
- Be generous in extraction - if they say "ani dani" or "ani dani", extract "dani" as name
- If they describe a problem or ask a question, that's their need
- If they mention timing like "tomorrow", "afternoon", "evening", that's a contact preference
- Return null for fields that cannot be determined from THIS message
- Even partial info is useful - extract what you can

Return a JSON object with exactly these fields:
{
  "name": string | null,
  "need": string | null,
  "contactPreference": string | null,
  "confidence": "high" | "medium" | "low"
}

Set confidence to:
- "high" if extracted fields are clearly stated
- "medium" if inference was needed
- "low" if very uncertain about extraction`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20250929',
      max_tokens: 256,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Customer message to analyze:\n"${message}"\n\nExtract lead info as JSON.`
        }
      ],
    });

    // Parse the response
    const content = response.content[0];
    if (content.type !== 'text') {
      console.warn('[intent] Unexpected response type:', content.type);
      return { name: null, need: null, contactPreference: null, confidence: 'low' };
    }

    // Extract JSON from response (may be wrapped in markdown code block)
    let jsonStr = content.text;
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const result = JSON.parse(jsonStr.trim());

    return {
      name: result.name || null,
      need: result.need || null,
      contactPreference: result.contactPreference || null,
      confidence: result.confidence || 'medium',
    };
  } catch (error) {
    console.error('[intent] Failed to extract lead info:', error);
    return { name: null, need: null, contactPreference: null, confidence: 'low' };
  }
}

/**
 * Merge newly extracted info with existing lead info.
 * Only updates fields that are currently null in the existing info.
 */
export function mergeLeadInfo(
  existing: LeadInfo,
  extracted: LeadInfo
): LeadInfo {
  return {
    name: existing.name || extracted.name,
    need: existing.need || extracted.need,
    contactPreference: existing.contactPreference || extracted.contactPreference,
    confidence: extracted.confidence, // Use latest confidence
  };
}
