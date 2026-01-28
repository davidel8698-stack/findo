// WhatsApp service exports

// Client
export { WhatsAppClient, WhatsAppAPIError, createWhatsAppClient } from './client';
export type { WhatsAppClientConfig } from './client';

// Message sending
export {
  sendTemplateMessage,
  sendTextMessage,
  sendImageMessage,
  sendInteractiveButtons,
  isWindowOpen,
  calculateWindowExpiry,
} from './messages';
export type {
  SendMessageResponse,
  MessageSendResult,
  TemplateComponent,
  TemplateParameter,
  InteractiveButton,
} from './messages';

// Embedded Signup (OAuth flow)
export {
  processEmbeddedSignup,
  getConnectionStatus,
  disconnectWhatsApp,
} from './embedded-signup';

// Webhooks
export {
  verifyWebhookSignature,
  parseWebhookPayload,
  isSupportedMessageType,
} from './webhooks';
export type {
  WhatsAppWebhookPayload,
  WhatsAppWebhookValue,
  WhatsAppIncomingMessage,
  WhatsAppStatusUpdate,
  ParsedMessage,
  ParsedStatus,
} from './webhooks';

// Token Validation
export {
  validateTenantToken,
  validateWhatsAppTokens,
  notifyTokenInvalid,
} from './validation';

// Conversations (24-hour window management)
export {
  openConversationWindow,
  getConversation,
  isWindowOpen as isConversationWindowOpen,
  incrementMessageCount,
  getConversationById,
} from './conversations';
