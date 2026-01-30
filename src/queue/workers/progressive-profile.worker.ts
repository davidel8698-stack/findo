/**
 * Progressive profile worker.
 *
 * Sends weekly profiling questions to business owners via WhatsApp.
 * Questions collect additional business details post-setup.
 *
 * Flow:
 * 1. Get all active tenants with completed setup
 * 2. For each tenant:
 *    - Check ignore count (skip if >= 2)
 *    - Get next question for their week number
 *    - Check if already answered
 *    - Send WhatsApp message if not answered
 * 3. Rate limit: 100ms between tenants
 */

import { Worker } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { tenants, setupProgress } from '../../db/schema/index';
import { eq, and, isNotNull, isNull } from 'drizzle-orm';
import { createWhatsAppClient, sendTextMessage, sendInteractiveButtons } from '../../services/whatsapp';
import {
  getIgnoreCount,
  getNextQuestion,
  recordQuestionSent,
  incrementIgnoreCount,
  getPendingProfileQuestion,
} from '../../services/progressive-profile';
import { PROGRESSIVE_PROFILE_JOB } from '../jobs/progressive-profile.job';

/**
 * Sleep utility for rate limiting.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process progressive profiling for all active tenants.
 */
async function processProgressiveProfiles(): Promise<void> {
  console.log('[progressive-profile] Starting weekly profile check');

  // Get all active tenants with completed setup
  const activeSetups = await db
    .select({
      tenantId: setupProgress.tenantId,
      completedAt: setupProgress.completedAt,
    })
    .from(setupProgress)
    .innerJoin(tenants, eq(tenants.id, setupProgress.tenantId))
    .where(
      and(
        eq(tenants.status, 'active'),
        isNotNull(setupProgress.completedAt),
        isNull(tenants.deletedAt)
      )
    );

  console.log(`[progressive-profile] Found ${activeSetups.length} active tenants`);

  let sent = 0;
  let skipped = 0;
  let ignored = 0;

  for (const setup of activeSetups) {
    const tenantId = setup.tenantId;

    try {
      // Check if previous question was ignored (increment count if so)
      const pendingQuestion = await getPendingProfileQuestion(tenantId);
      if (pendingQuestion) {
        // Previous question wasn't answered - increment ignore count
        await incrementIgnoreCount(tenantId);
        console.log(`[progressive-profile] Tenant ${tenantId} ignored previous question`);
      }

      // Check ignore count - stop asking after 2 consecutive ignores
      const ignoreCount = await getIgnoreCount(tenantId);
      if (ignoreCount >= 2) {
        console.log(`[progressive-profile] Tenant ${tenantId} skipped (ignore count: ${ignoreCount})`);
        ignored++;
        continue;
      }

      // Get next question for this tenant
      const question = await getNextQuestion(tenantId);
      if (!question) {
        console.log(`[progressive-profile] Tenant ${tenantId} has no pending questions`);
        skipped++;
        continue;
      }

      // Get tenant info for owner phone
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
      });

      if (!tenant?.ownerPhone) {
        console.log(`[progressive-profile] Tenant ${tenantId} has no owner phone`);
        skipped++;
        continue;
      }

      // Get WhatsApp client
      const client = await createWhatsAppClient(tenantId);
      if (!client) {
        console.log(`[progressive-profile] Tenant ${tenantId} has no WhatsApp connection`);
        skipped++;
        continue;
      }

      // Send question via WhatsApp
      if (question.type === 'quick_reply' && question.options) {
        // Send interactive message with buttons
        const buttons = question.options.slice(0, 3).map((option, index) => ({
          id: `profile_${question.field}_${index}`,
          title: option.substring(0, 20), // Max 20 chars per button
        }));

        await sendInteractiveButtons(
          client,
          tenant.ownerPhone,
          question.question,
          buttons,
          'Findo',
          'שאלת פרופיל'
        );
      } else {
        // Send text message
        await sendTextMessage(client, tenant.ownerPhone, question.question);
      }

      // Record that question was sent
      await recordQuestionSent(tenantId, question.field);

      console.log(`[progressive-profile] Sent question to tenant ${tenantId}: ${question.field}`);
      sent++;

      // Rate limit: 100ms between tenants
      await sleep(100);
    } catch (error) {
      console.error(`[progressive-profile] Error processing tenant ${tenantId}:`, error);
      // Continue with next tenant
    }
  }

  console.log(
    `[progressive-profile] Complete: ${sent} sent, ${skipped} skipped, ${ignored} ignored (2+ ignores)`
  );
}

/**
 * Progressive profile worker instance.
 *
 * Listens on 'scheduled' queue for progressive-profile-check jobs.
 * Uses single concurrency to avoid rate limit issues.
 */
export const progressiveProfileWorker = new Worker(
  'scheduled',
  async (job) => {
    if (job.name !== PROGRESSIVE_PROFILE_JOB) {
      return; // Not our job type
    }

    await processProgressiveProfiles();
  },
  {
    connection: createRedisConnection(),
    concurrency: 1, // Single concurrency for sequential tenant processing
  }
);

progressiveProfileWorker.on('completed', (job) => {
  if (job.name === PROGRESSIVE_PROFILE_JOB) {
    console.log(`[progressive-profile] Job ${job.id} completed`);
  }
});

progressiveProfileWorker.on('failed', (job, err) => {
  if (job?.name === PROGRESSIVE_PROFILE_JOB) {
    console.error(`[progressive-profile] Job ${job.id} failed:`, err.message);
  }
});

console.log('[progressive-profile] Worker started');
