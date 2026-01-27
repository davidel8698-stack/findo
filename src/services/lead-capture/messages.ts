/**
 * Hebrew message templates for lead capture flow.
 *
 * Per CONTEXT.md:
 * - Tone: Warm and personal - feels like it comes from the owner
 * - Identity: Appears from owner, no mention of automation or assistant
 * - Content: Include business name to remind caller who they called
 */

import type { LeadConversation } from '../../db/schema/leads';

/**
 * Hebrew message templates for the lead capture conversation flow.
 * All messages are designed to feel personal and warm, as if written by the owner.
 */
export const LEAD_MESSAGES = {
  /**
   * Initial message sent to missed call caller (after 2-min delay).
   * Pattern: "Hey, I saw you tried to call [business] and I couldn't answer. How can I help?"
   */
  initial: (businessName: string): string =>
    `היי, ראיתי שניסית להתקשר ל${businessName} ולא הצלחתי לענות. איך אפשר לעזור?`,

  /**
   * Follow-up asking for name (after initial response).
   */
  askName: (): string =>
    `אשמח לעזור! איך קוראים לך?`,

  /**
   * Ask about their need (after getting name).
   * Uses name if available for personalization.
   */
  askNeed: (name?: string): string =>
    name
      ? `שלום ${name}! במה אפשר לעזור לך?`
      : `במה אפשר לעזור לך?`,

  /**
   * Ask for contact preference (when to call back).
   */
  askPreference: (): string =>
    `מתי נוח לך שנחזור אליך?`,

  /**
   * Completion message (all info collected).
   * Promise callback per CONTEXT.md decision.
   */
  complete: (): string =>
    `תודה! אנחנו נחזור אליך בהקדם.`,

  /**
   * First reminder (2 hours after initial message, no response).
   */
  reminder1: (businessName: string): string =>
    `היי, ראיתי שניסית להתקשר ל${businessName}. עדיין צריך עזרה?`,

  /**
   * Second/final reminder (24 hours after initial message).
   */
  reminder2: (): string =>
    `שלום, זו תזכורת אחרונה - אם עדיין צריך עזרה, אשמח לשמוע ממך.`,
};

/**
 * Format the initial message for a specific tenant.
 *
 * @param businessName - The business name to include in the message
 * @returns Formatted Hebrew initial message
 */
export function formatInitialMessage(businessName: string): string {
  return LEAD_MESSAGES.initial(businessName);
}

/**
 * Conversation state type for chatbot responses.
 */
type ConversationState =
  | 'awaiting_response'
  | 'awaiting_name'
  | 'awaiting_need'
  | 'awaiting_preference'
  | 'completed'
  | 'unresponsive';

/**
 * Get the appropriate chatbot response based on conversation state.
 *
 * @param state - Current conversation state
 * @param context - Context with business name and optional customer name
 * @returns The appropriate response message, or null if no response needed
 */
export function getChatbotResponse(
  state: ConversationState,
  context: { businessName: string; customerName?: string }
): string | null {
  switch (state) {
    case 'awaiting_name':
      return LEAD_MESSAGES.askName();
    case 'awaiting_need':
      return LEAD_MESSAGES.askNeed(context.customerName);
    case 'awaiting_preference':
      return LEAD_MESSAGES.askPreference();
    case 'completed':
      return LEAD_MESSAGES.complete();
    default:
      return null; // No response for awaiting_response, unresponsive states
  }
}

/**
 * Get reminder message based on reminder number.
 *
 * @param reminderNumber - 1 for first reminder, 2 for second/final reminder
 * @param businessName - Business name for personalization
 * @returns The reminder message
 */
export function getReminderMessage(
  reminderNumber: number,
  businessName: string
): string {
  return reminderNumber === 1
    ? LEAD_MESSAGES.reminder1(businessName)
    : LEAD_MESSAGES.reminder2();
}
