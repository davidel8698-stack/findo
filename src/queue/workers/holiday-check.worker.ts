/**
 * Holiday Check Worker
 *
 * Weekly job that checks for upcoming Israeli holidays
 * and sends reminders to owners about special hours.
 *
 * Per CONTEXT.md: Remind 1 week before holidays.
 */

import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db';
import { tenants, googleConnections, whatsappConnections } from '../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { checkTenantHolidays, getHolidaysNeedingReminder } from '../../services/gbp-content/holiday-checker';

interface HolidayCheckJobData {
  jobType: 'holiday-check';
}

export const holidayCheckWorker = new Worker<HolidayCheckJobData>(
  'scheduled',
  async (job: Job<HolidayCheckJobData>) => {
    if (job.data.jobType !== 'holiday-check') return;

    console.log('[holiday-check] Starting weekly holiday check');

    // First check if there are any holidays to remind about
    const upcomingHolidays = getHolidaysNeedingReminder();
    if (upcomingHolidays.length === 0) {
      console.log('[holiday-check] No holidays needing reminder this week');
      return;
    }

    console.log(`[holiday-check] Found ${upcomingHolidays.length} holidays needing reminder`);

    // Get all active tenants with both Google and WhatsApp
    const activeTenants = await db
      .select({ tenant: tenants })
      .from(tenants)
      .innerJoin(googleConnections, and(
        eq(googleConnections.tenantId, tenants.id),
        eq(googleConnections.status, 'active')
      ))
      .innerJoin(whatsappConnections, and(
        eq(whatsappConnections.tenantId, tenants.id),
        eq(whatsappConnections.status, 'active')
      ))
      .where(and(
        eq(tenants.status, 'active'),
        isNull(tenants.deletedAt)
      ));

    console.log(`[holiday-check] Checking ${activeTenants.length} tenants`);

    let sent = 0;

    for (const { tenant } of activeTenants) {
      try {
        const reminded = await checkTenantHolidays(tenant.id);
        if (reminded) sent++;

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`[holiday-check] Error for ${tenant.id}:`, error);
      }
    }

    console.log(`[holiday-check] Completed: ${sent} reminders sent`);
  },
  {
    connection: createRedisConnection(),
    concurrency: 1,
  }
);

holidayCheckWorker.on('completed', (job) => {
  console.log(`[holiday-check] Job ${job.id} completed`);
});

holidayCheckWorker.on('failed', (job, err) => {
  console.error(`[holiday-check] Job ${job?.id} failed:`, err.message);
});
