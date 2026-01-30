/**
 * PayPlus Webhook Handler
 *
 * Receives Instant Payment Notifications (IPN) from PayPlus.
 * Updates payment and subscription status based on transaction results.
 *
 * Security:
 * - Verifies webhook signature before processing
 * - Uses timing-safe comparison to prevent timing attacks
 * - Idempotent handling prevents duplicate processing
 *
 * Error Handling Strategy:
 * - Signature verification failure: Return 401, do NOT update database
 * - Payment lookup failure: Return 200, log warning (prevents retries for orphan webhooks)
 * - Database update failure: Return 500 to trigger PayPlus retry
 *   PayPlus retries failed webhooks up to 5 times with exponential backoff
 */

import { Hono } from 'hono';
import { db } from '../../db/index';
import { payments, subscriptions, setupProgress } from '../../db/schema/billing';
import { eq } from 'drizzle-orm';
import {
  verifyWebhookSignature,
  type PayPlusWebhookPayload,
} from '../../services/billing/payplus';

export const billingWebhookRoutes = new Hono();

// ============================================
// WEBHOOK HANDLER
// ============================================

/**
 * POST /billing/webhook
 *
 * PayPlus IPN callback endpoint.
 * Called by PayPlus after payment completion (success or failure).
 */
billingWebhookRoutes.post('/webhook', async (c) => {
  // Get raw body for signature verification
  const rawBody = await c.req.text();

  // Get signature from header
  // PayPlus sends signature in custom header
  const signature =
    c.req.header('X-PayPlus-Signature') ||
    c.req.header('x-payplus-signature') ||
    '';

  const correlationId = `webhook-${Date.now()}`;
  console.log(`[billing:${correlationId}] Received webhook`);

  // Verify signature
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn(`[billing:${correlationId}] Invalid webhook signature`);
    return c.text('Unauthorized', 401);
  }

  console.log(`[billing:${correlationId}] Signature verified`);

  // Parse payload
  let payload: PayPlusWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as PayPlusWebhookPayload;
  } catch (error) {
    console.error(`[billing:${correlationId}] Failed to parse webhook body:`, error);
    return c.text('Bad Request', 400);
  }

  const {
    transaction_uid,
    status_code,
    token_uid,
    approval_num,
    card_information,
    status_description,
  } = payload;

  console.log(`[billing:${correlationId}] Processing transaction ${transaction_uid}, status: ${status_code}`);

  // Find payment by transaction ID
  const payment = await db.query.payments.findFirst({
    where: eq(payments.payplusTransactionId, transaction_uid),
  });

  if (!payment) {
    // Payment not found - this might be an orphan webhook or test
    // Return 200 to acknowledge and prevent retries
    console.warn(`[billing:${correlationId}] Payment not found for transaction ${transaction_uid}`);
    return c.text('OK', 200);
  }

  // Check for idempotency - already processed
  if (payment.status === 'completed') {
    console.log(`[billing:${correlationId}] Payment already completed, skipping`);
    return c.text('OK', 200);
  }

  // Determine if payment is approved
  // PayPlus status code '000' indicates approved
  const isApproved = status_code === '000';

  try {
    if (isApproved) {
      // =========================================
      // PAYMENT APPROVED
      // =========================================
      console.log(`[billing:${correlationId}] Payment approved for tenant ${payment.tenantId}`);

      // Update payment record
      await db
        .update(payments)
        .set({
          status: 'completed',
          paidAt: new Date(),
          cardLast4: card_information?.four_digits || null,
          cardBrand: card_information?.brand_name || null,
        })
        .where(eq(payments.id, payment.id));

      // Get subscription to update
      const subscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.tenantId, payment.tenantId),
      });

      if (subscription) {
        // Calculate billing cycle
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Update subscription with token and active status
        await db
          .update(subscriptions)
          .set({
            status: 'active',
            payplusTokenId: token_uid || subscription.payplusTokenId,
            payplusCustomerId: payload.customer?.customer_uid || subscription.payplusCustomerId,
            setupFeePaid: payment.type === 'setup_fee' ? true : subscription.setupFeePaid,
            currentPeriodStart: now,
            currentPeriodEnd: nextMonth,
            nextBillingDate: nextMonth,
            updatedAt: now,
          })
          .where(eq(subscriptions.id, subscription.id));

        console.log(`[billing:${correlationId}] Subscription activated with token ${token_uid}`);
      }

      // Mark setup as complete if this was setup payment
      if (payment.type === 'setup_fee') {
        await db
          .update(setupProgress)
          .set({
            completedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(setupProgress.tenantId, payment.tenantId));

        console.log(`[billing:${correlationId}] Setup marked as complete`);
      }

      return c.text('OK', 200);
    } else {
      // =========================================
      // PAYMENT FAILED
      // =========================================
      console.warn(`[billing:${correlationId}] Payment failed for tenant ${payment.tenantId}: ${status_description}`);

      // Update payment as failed
      await db
        .update(payments)
        .set({
          status: 'failed',
          failureReason: status_description || `Error code: ${status_code}`,
          retryCount: (payment.retryCount || 0) + 1,
        })
        .where(eq(payments.id, payment.id));

      return c.text('OK', 200);
    }
  } catch (error) {
    // Database error - return 500 to trigger PayPlus retry
    console.error(`[billing:${correlationId}] Database error:`, error);
    return c.text('DB error', 500);
  }
});

// ============================================
// WEBHOOK VERIFICATION ENDPOINT
// ============================================

/**
 * GET /billing/webhook
 *
 * Webhook verification endpoint for PayPlus setup.
 * Some gateways send a GET request to verify the endpoint is valid.
 */
billingWebhookRoutes.get('/webhook', (c) => {
  // Return simple OK for verification
  return c.text('OK', 200);
});

// ============================================
// DEBUG ENDPOINT (development only)
// ============================================

/**
 * GET /billing/webhook/status/:transactionId
 *
 * Check payment status by transaction ID.
 * Development/debugging endpoint only.
 */
billingWebhookRoutes.get('/webhook/status/:transactionId', async (c) => {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return c.text('Not Found', 404);
  }

  const transactionId = c.req.param('transactionId');

  const payment = await db.query.payments.findFirst({
    where: eq(payments.payplusTransactionId, transactionId),
  });

  if (!payment) {
    return c.json({ found: false }, 404);
  }

  return c.json({
    found: true,
    status: payment.status,
    amount: payment.amountAgorot,
    type: payment.type,
    paidAt: payment.paidAt,
    failureReason: payment.failureReason,
  });
});
