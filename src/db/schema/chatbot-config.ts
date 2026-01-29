import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

/**
 * Chatbot Question Interface
 *
 * Structure for customizable lead qualification questions.
 * Per CONTEXT.md: "Full chatbot customization - Default questions work for all businesses,
 * but owner can change everything: add questions, edit texts, reorder"
 */
export interface ChatbotQuestion {
  id: string;                                    // Unique question identifier
  text: string;                                  // Hebrew question text
  expectedType: 'text' | 'phone' | 'choice';     // What kind of answer expected
  order: number;                                 // Display order
  isRequired: boolean;                           // Whether question is required
  isActive: boolean;                             // Whether question is shown
}

/**
 * Default chatbot questions for new tenants.
 * These work for all business types per CONTEXT.md.
 */
export const defaultChatbotQuestions: ChatbotQuestion[] = [
  {
    id: 'name',
    text: 'איך קוראים לך?',
    expectedType: 'text',
    order: 1,
    isRequired: true,
    isActive: true,
  },
  {
    id: 'need',
    text: 'במה אוכל לעזור לך?',
    expectedType: 'text',
    order: 2,
    isRequired: true,
    isActive: true,
  },
  {
    id: 'preference',
    text: 'מתי נוח לך שנחזור אליך?',
    expectedType: 'text',
    order: 3,
    isRequired: false,
    isActive: true,
  },
];

/**
 * Chatbot Config Table
 *
 * Stores customizable chatbot questions per tenant.
 * Enables business owners to personalize lead qualification flow.
 *
 * Per CONTEXT.md: Owner can change everything - add questions, edit texts, reorder.
 * Defaults are optimized for all business types.
 */
export const chatbotConfig = pgTable('chatbot_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // Questions array stored as JSONB
  // Type: ChatbotQuestion[]
  questions: jsonb('questions').notNull().$type<ChatbotQuestion[]>().default(defaultChatbotQuestions),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports for TypeScript inference
export type ChatbotConfig = typeof chatbotConfig.$inferSelect;
export type NewChatbotConfig = typeof chatbotConfig.$inferInsert;

// Re-export ChatbotQuestion for external use
export type { ChatbotQuestion as ChatbotQuestionType };
