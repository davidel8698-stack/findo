import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { missedCalls, whatsappConnections } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { VoicenterCDR, isMissedCall } from '../../services/voicenter/types';
import { normalizeIsraeliPhone } from '../../lib/phone';
import { leadOutreachQueue } from '../queues';

/**
 * Voicenter CDR job data.
 * Uses the VoicenterCDR type for payload instead of generic Record.
 */
interface VoicenterCDRJobData {
  source: 'voicenter';
  eventId: string;
  eventType: string;
  payload: VoicenterCDR;
  receivedAt: string;
}

/**
 * Process Voicenter CDR webhook.
 *
 * Handles call detail records from Voicenter:
 * - Skips answered calls (no lead capture needed)
 * - Finds tenant by business phone number (DID)
 * - Stores missed call record (idempotent via callId)
 * - Schedules delayed lead outreach (2 minutes)
 */
async function processVoicenterCDR(job: Job<VoicenterCDRJobData>): Promise<void> {
  const cdr = job.data.payload;
  const callId = cdr.CallID;

  console.log(`[voicenter-cdr] Processing call ${callId} (${cdr.DialStatus})`);

  // Skip if not a missed call
  if (!isMissedCall(cdr.DialStatus)) {
    console.log(`[voicenter-cdr] Call ${callId} answered (${cdr.DialStatus}), skipping`);
    return;
  }

  // Find tenant by business phone (DID)
  // Business phone in WhatsApp connections matches Voicenter DID
  const normalizedDID = normalizeIsraeliPhone(cdr.DID);
  const connection = await db.query.whatsappConnections.findFirst({
    where: eq(whatsappConnections.displayPhoneNumber, normalizedDID),
  });

  if (!connection) {
    console.warn(`[voicenter-cdr] No WhatsApp connection for DID ${cdr.DID} (normalized: ${normalizedDID})`);
    return;
  }

  const tenantId = connection.tenantId;
  const callerPhone = normalizeIsraeliPhone(cdr.caller);

  // Idempotency check - skip if already processed
  const existing = await db.query.missedCalls.findFirst({
    where: eq(missedCalls.callId, callId),
  });

  if (existing) {
    console.log(`[voicenter-cdr] Call ${callId} already processed, skipping`);
    return;
  }

  // Store missed call record
  const [missedCall] = await db.insert(missedCalls).values({
    tenantId,
    callId,
    callerPhone,
    businessPhone: cdr.DID,
    status: cdr.DialStatus,
    calledAt: new Date(cdr.time * 1000),
  }).returning();

  console.log(`[voicenter-cdr] Recorded missed call ${callId} from ${callerPhone}`);

  // Schedule delayed outreach (2 minutes per CONTEXT.md)
  await leadOutreachQueue.add(
    'send-initial-message',
    {
      tenantId,
      missedCallId: missedCall.id,
      callerPhone,
    },
    {
      delay: 2 * 60 * 1000, // 2 minutes = 120,000 ms
      jobId: `lead-outreach-${missedCall.id}`, // For potential cancellation
    }
  );

  console.log(`[voicenter-cdr] Scheduled outreach for ${callerPhone} in 2 minutes`);
}

/**
 * Start the Voicenter CDR worker.
 *
 * Processes CDR webhook events from the 'webhooks' queue.
 * Only processes jobs with name 'voicenter-cdr'.
 *
 * @returns The worker instance (for cleanup on shutdown)
 */
export function startVoicenterCDRWorker(): Worker<VoicenterCDRJobData> {
  const worker = new Worker<VoicenterCDRJobData>(
    'webhooks',
    async (job) => {
      // Only process voicenter-cdr jobs
      if (job.name === 'voicenter-cdr') {
        await processVoicenterCDR(job);
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'voicenter-cdr') {
      console.log(`[voicenter-cdr] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'voicenter-cdr') {
      console.error(`[voicenter-cdr] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[voicenter-cdr] Worker started');
  return worker;
}
