/**
 * Conversation state machine for lead qualification chatbot.
 *
 * Flow: awaiting_response -> awaiting_name -> awaiting_need -> awaiting_preference -> completed
 * Can jump states if AI extracts multiple fields from one message.
 *
 * Per CONTEXT.md: AI interprets unclear messages, doesn't ask for clarification.
 */

// Conversation states
export type ConversationState =
  | 'awaiting_response'      // Initial message sent, waiting for any reply
  | 'awaiting_name'          // Asked for name
  | 'awaiting_need'          // Asked about their need
  | 'awaiting_preference'    // Asked for contact preference
  | 'completed'              // All info collected
  | 'unresponsive';          // No response after reminders

// Events that trigger state transitions
export type ConversationEvent =
  | 'MESSAGE_RECEIVED'       // Customer sent a message
  | 'NAME_EXTRACTED'         // AI extracted customer name
  | 'NEED_EXTRACTED'         // AI extracted customer need
  | 'PREFERENCE_EXTRACTED'   // AI extracted contact preference
  | 'REMINDER_1_SENT'        // First reminder sent
  | 'REMINDER_2_SENT'        // Second reminder sent
  | 'TIMEOUT';               // No response after all reminders

// Lead info structure
export interface ExtractedLeadInfo {
  name: string | null;
  need: string | null;
  contactPreference: string | null;
}

/**
 * Determine the next state based on what info is still missing.
 *
 * This is smarter than simple event-based transitions:
 * - If we extracted name+need in one message, skip to awaiting_preference
 * - If all info collected, go to completed
 */
export function getNextState(
  currentState: ConversationState,
  currentLead: ExtractedLeadInfo
): ConversationState {
  // Terminal states
  if (currentState === 'completed' || currentState === 'unresponsive') {
    return currentState;
  }

  // If all info collected, mark completed
  if (currentLead.name && currentLead.need && currentLead.contactPreference) {
    return 'completed';
  }

  // Determine what we need next based on what's missing
  if (!currentLead.name && currentState !== 'awaiting_response') {
    return 'awaiting_name';
  }

  if (!currentLead.need) {
    return 'awaiting_need';
  }

  if (!currentLead.contactPreference) {
    return 'awaiting_preference';
  }

  // Shouldn't reach here, but return completed as fallback
  return 'completed';
}

/**
 * Simple event-based transition for specific events (reminders, timeout).
 */
export function transition(
  currentState: ConversationState,
  event: ConversationEvent
): ConversationState {
  // Timeout after reminders
  if (event === 'TIMEOUT') {
    return 'unresponsive';
  }

  // Reminders don't change state
  if (event === 'REMINDER_1_SENT' || event === 'REMINDER_2_SENT') {
    return currentState;
  }

  // For MESSAGE_RECEIVED, caller should use getNextState instead
  // This is a fallback that maintains current state
  if (event === 'MESSAGE_RECEIVED') {
    return currentState;
  }

  return currentState;
}

/**
 * Check if conversation is in a terminal state.
 */
export function isTerminalState(state: ConversationState): boolean {
  return state === 'completed' || state === 'unresponsive';
}

/**
 * Check if conversation should receive chatbot response.
 */
export function shouldSendResponse(state: ConversationState): boolean {
  // Don't respond in awaiting_response (waiting for first reply)
  // Don't respond in terminal states
  return !['awaiting_response', 'completed', 'unresponsive'].includes(state);
}
