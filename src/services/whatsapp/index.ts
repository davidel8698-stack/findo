// WhatsApp service exports

// Client
export { WhatsAppClient, WhatsAppAPIError, createWhatsAppClient } from './client';
export type { WhatsAppClientConfig } from './client';

// Message sending
export {
  sendTemplateMessage,
  sendTextMessage,
  sendImageMessage,
  isWindowOpen,
  calculateWindowExpiry,
} from './messages';
export type {
  SendMessageResponse,
  MessageSendResult,
  TemplateComponent,
  TemplateParameter,
} from './messages';
