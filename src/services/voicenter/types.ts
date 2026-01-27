/**
 * Voicenter CDR (Call Detail Record) webhook payload types.
 *
 * CDR webhooks are sent after each call completes with details about
 * the call including status, duration, and participants.
 */

/**
 * Voicenter call status values.
 *
 * Note: 'ABANDONE' is intentionally spelled this way - it's a typo in Voicenter's API.
 */
export type VoicenterCallStatus =
  | 'ANSWER'      // Call was answered
  | 'NOANSWER'    // No answer (missed call)
  | 'BUSY'        // Line busy
  | 'CANCEL'      // Caller hung up before answer
  | 'CONGESTION'  // Network congestion
  | 'ABANDONE'    // Abandoned in queue (note: Voicenter typo)
  | 'VOEND';      // Voicemail ended

/**
 * Voicenter CDR (Call Detail Record) webhook payload.
 *
 * This is the structure sent by Voicenter after each call completes.
 * Used to detect missed calls and trigger lead capture.
 */
export interface VoicenterCDR {
  /** Caller phone number (e.g., "0512345678") - the customer's number */
  caller: string;

  /** Target phone/extension - where the call was routed */
  target: string;

  /** Epoch timestamp in seconds when the call occurred */
  time: number;

  /** Call duration in seconds (0 = not answered) */
  Duration: number;

  /** Call completion status */
  DialStatus: VoicenterCallStatus;

  /** Called number (DID) - the business phone number that was dialed */
  DID: string;

  /** Unique call identifier - used as idempotency key */
  CallID: string;

  /** Queue name if the call went through a queue */
  QueueName?: string;

  /** Name of the representative who handled the call (if answered) */
  RepresentativeName?: string;

  /** URL to call recording (if recorded) */
  RecordURL?: string;

  /** Index signature for compatibility with Record<string, unknown> */
  [key: string]: unknown;
}

/**
 * Statuses that indicate a missed call requiring lead capture.
 *
 * These statuses mean the customer tried to reach the business but
 * didn't get through, making them potential leads.
 */
export const MISSED_CALL_STATUSES: VoicenterCallStatus[] = [
  'NOANSWER',  // No answer - most common missed call
  'CANCEL',    // Caller hung up while ringing
  'BUSY',      // Line was busy
  'ABANDONE',  // Abandoned while waiting in queue
];

/**
 * Type guard to check if a call status indicates a missed call.
 *
 * @param status - The call status string from Voicenter
 * @returns true if the status indicates a missed call
 *
 * @example
 * ```typescript
 * if (isMissedCall(cdr.DialStatus)) {
 *   // Process as missed call - create lead
 * }
 * ```
 */
export function isMissedCall(status: string): status is VoicenterCallStatus {
  return MISSED_CALL_STATUSES.includes(status as VoicenterCallStatus);
}
