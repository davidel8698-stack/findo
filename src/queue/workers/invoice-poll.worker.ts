import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { accountingConnections, reviewRequests } from '../../db/schema/index';
import { eq, and } from 'drizzle-orm';
import { reviewRequestQueue, type ScheduledJobData } from '../queues';
import { tokenVaultService } from '../../services/token-vault';
import {
  createGreeninvoiceClient,
  fetchInvoices as fetchGreeninvoiceInvoices,
} from '../../services/greeninvoice/index';
import {
  createIcountClient,
  fetchInvoices as fetchIcountInvoices,
} from '../../services/icount/index';
import type { DetectedInvoice } from '../../services/greeninvoice/types';

/**
 * Sleep helper for rate limiting between connections.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process invoice polling for a single accounting connection.
 * Fetches new invoices and schedules 24-hour delayed review requests.
 */
async function pollConnection(
  connection: typeof accountingConnections.$inferSelect
): Promise<number> {
  // Get credentials from token vault
  const vaultEntry = await tokenVaultService.getToken(
    connection.tenantId,
    connection.provider,
    'api_key',
    connection.credentialsVaultId
  );

  if (!vaultEntry) {
    throw new Error(`No credentials found for connection ${connection.id}`);
  }

  const credentials = JSON.parse(vaultEntry.value);

  // Calculate from date (last poll or 7 days back for first poll)
  const fromDate = connection.lastInvoiceDate
    ? new Date(connection.lastInvoiceDate)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  let invoices: DetectedInvoice[];

  if (connection.provider === 'greeninvoice') {
    const client = createGreeninvoiceClient(connection.tenantId, credentials);
    invoices = await fetchGreeninvoiceInvoices(client, fromDate);
  } else {
    // iCount - use single session per cycle
    const client = createIcountClient(credentials);
    try {
      await client.login();
      invoices = await fetchIcountInvoices(client, fromDate);
    } finally {
      await client.logout();
    }
  }

  let processedCount = 0;
  let latestInvoiceDate: Date | null = null;

  for (const invoice of invoices) {
    // Check if already processed (unique constraint will catch this too)
    const existing = await db.query.reviewRequests.findFirst({
      where: and(
        eq(reviewRequests.tenantId, connection.tenantId),
        eq(reviewRequests.source, connection.provider),
        eq(reviewRequests.invoiceId, invoice.invoiceId)
      ),
    });

    if (existing) {
      console.log(`[invoice-poll] Skipping duplicate: ${invoice.invoiceId}`);
      continue;
    }

    // Track latest invoice date
    const invoiceDate = new Date(invoice.createdAt);
    if (!latestInvoiceDate || invoiceDate > latestInvoiceDate) {
      latestInvoiceDate = invoiceDate;
    }

    // Check for customer phone (per research pitfall #3)
    if (!invoice.customerPhone) {
      console.log(`[invoice-poll] Skipping ${invoice.invoiceId} - no phone`);
      // Still record it to avoid re-processing
      await db.insert(reviewRequests).values({
        tenantId: connection.tenantId,
        source: connection.provider,
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        status: 'skipped',
      });
      continue;
    }

    // Calculate scheduled time (24 hours from now per REVW-04)
    const scheduledForAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create review request record
    const [request] = await db
      .insert(reviewRequests)
      .values({
        tenantId: connection.tenantId,
        source: connection.provider,
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        customerPhone: invoice.customerPhone,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail,
        status: 'pending',
        scheduledForAt,
      })
      .returning();

    // Schedule delayed job (24 hours)
    await reviewRequestQueue.add(
      'send-review-request',
      { reviewRequestId: request.id },
      {
        delay: 24 * 60 * 60 * 1000, // 24 hours
        jobId: `review-req-${request.id}`,
        removeOnComplete: true,
      }
    );

    console.log(
      `[invoice-poll] Scheduled review request for ${invoice.invoiceId} in 24h`
    );
    processedCount++;
  }

  // Update connection poll state
  await db
    .update(accountingConnections)
    .set({
      lastPollAt: new Date(),
      lastInvoiceDate: latestInvoiceDate || connection.lastInvoiceDate,
      lastError: null,
      updatedAt: new Date(),
    })
    .where(eq(accountingConnections.id, connection.id));

  return processedCount;
}

/**
 * Invoice poll worker - processes scheduled invoice-poll jobs.
 *
 * Runs hourly at minute :15 to poll Greeninvoice and iCount for new invoices.
 * For each new invoice with a customer phone, schedules a 24-hour delayed
 * review request job (per REVW-04: wait 24 hours after service).
 *
 * Features:
 * - Polls both Greeninvoice and iCount connections
 * - 24-hour delayed job scheduling (REVW-04 compliance)
 * - Skips invoices without customer phone (records as 'skipped')
 * - 100ms delay between connections (rate limiting)
 * - Single concurrency to respect API rate limits
 * - Error isolation per tenant (one failure doesn't stop others)
 */
export function startInvoicePollWorker(): Worker<ScheduledJobData> {
  const worker = new Worker<ScheduledJobData>(
    'scheduled',
    async (job: Job<ScheduledJobData>) => {
      if (job.name !== 'invoice-poll') return;

      console.log('[invoice-poll] Starting hourly invoice check');

      // Get all active accounting connections
      const connections = await db.query.accountingConnections.findMany({
        where: eq(accountingConnections.status, 'active'),
      });

      console.log(`[invoice-poll] Checking ${connections.length} connections`);

      let totalProcessed = 0;

      for (const connection of connections) {
        try {
          const count = await pollConnection(connection);
          totalProcessed += count;

          // Rate limit between connections (per research: 100ms delay)
          await sleep(100);
        } catch (error) {
          console.error(
            `[invoice-poll] Error for ${connection.tenantId}/${connection.provider}:`,
            error
          );
          // Update connection with error (don't throw - continue to next)
          await db
            .update(accountingConnections)
            .set({
              lastError: String(error),
              updatedAt: new Date(),
            })
            .where(eq(accountingConnections.id, connection.id));
        }
      }

      console.log(
        `[invoice-poll] Completed. Processed ${totalProcessed} new invoices.`
      );
    },
    {
      connection: createRedisConnection(),
      concurrency: 1, // Single concurrency per research recommendation
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'invoice-poll') {
      console.log(`[invoice-poll] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'invoice-poll') {
      console.error(`[invoice-poll] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[invoice-poll] Worker started');
  return worker;
}
