/**
 * Billing Routes
 *
 * Handles payment initiation and result pages for Findo subscriptions.
 *
 * Flow:
 * 1. POST /billing/initiate-payment - Start setup fee + first month payment
 * 2. GET /billing/success - PayPlus redirects here on successful payment
 * 3. GET /billing/failure - PayPlus redirects here on failed payment
 * 4. POST /billing/charge-monthly - Charge recurring subscription (for worker)
 */

import { Hono } from 'hono';
import { db } from '../../db/index';
import { payments, subscriptions } from '../../db/schema/billing';
import { tenants } from '../../db/schema/tenants';
import { eq } from 'drizzle-orm';
import {
  createPaymentPage,
  chargeWithToken,
  isConfigured,
  ChargeMethod,
} from '../../services/billing/payplus';

export const billingRoutes = new Hono();

// ============================================
// CONSTANTS
// ============================================

/** Setup fee in agorot (3,500 NIS) */
const SETUP_FEE_AGOROT = 350000;

/** Monthly subscription in agorot (350 NIS) */
const MONTHLY_FEE_AGOROT = 35000;

/** Base URL for redirects (from environment or default) */
function getBaseUrl(): string {
  return process.env.BASE_URL || 'http://localhost:3000';
}

// ============================================
// PAYMENT INITIATION
// ============================================

/**
 * Helper function to handle payment initiation logic.
 * Used by both GET and POST endpoints.
 */
async function handlePaymentInitiation(c: any, tenantId: string) {
  // Check if PayPlus is configured
  if (!isConfigured()) {
    console.error('[billing] PayPlus not configured');
    return c.html(`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - שגיאת תשלום</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
    <div class="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
      <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-2">שירות התשלום לא זמין</h1>
    <p class="text-gray-600 mb-6">מערכת התשלום לא מוגדרת כראוי. אנא פנו לתמיכה.</p>
    <a href="/setup/step/5?tenantId=${tenantId}" class="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
      חזרה
    </a>
  </div>
</body>
</html>`);
  }

  // Get tenant and subscription info
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  if (!tenant) {
    return c.text('Tenant not found', 404);
  }

  // Get or create subscription
  let subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.tenantId, tenantId),
  });

  if (!subscription) {
    const [created] = await db
      .insert(subscriptions)
      .values({
        tenantId,
        status: 'pending_payment',
      })
      .returning();
    subscription = created;
  }

  // Calculate total amount (setup fee + first month)
  const totalAmount = SETUP_FEE_AGOROT + MONTHLY_FEE_AGOROT;

  // Create pending payment record
  const [payment] = await db
    .insert(payments)
    .values({
      tenantId,
      subscriptionId: subscription.id,
      amountAgorot: totalAmount,
      type: 'setup_fee',
      status: 'pending',
    })
    .returning();

  console.log(`[billing] Creating payment page for tenant ${tenantId}, amount: ${totalAmount} agorot`);

  try {
    // Create PayPlus payment page
    const result = await createPaymentPage({
      tenantId,
      amount: totalAmount,
      description: `Findo - דמי הקמה + מנוי ראשון`,
      successUrl: `${getBaseUrl()}/billing/success?tenantId=${tenantId}`,
      failureUrl: `${getBaseUrl()}/billing/failure?tenantId=${tenantId}`,
      callbackUrl: `${getBaseUrl()}/billing/webhook`,
      chargeMethod: ChargeMethod.TOKEN_AND_CHARGE,
      customerEmail: tenant.ownerEmail || undefined,
      customerName: tenant.ownerName || undefined,
    });

    // Update payment with transaction ID
    await db
      .update(payments)
      .set({
        payplusTransactionId: result.transactionUid,
      })
      .where(eq(payments.id, payment.id));

    console.log(`[billing] Redirecting to PayPlus: ${result.paymentPageUrl}`);

    // Redirect to PayPlus hosted payment page
    return c.redirect(result.paymentPageUrl);
  } catch (error) {
    console.error('[billing] Failed to create payment page:', error);

    // Update payment as failed
    await db
      .update(payments)
      .set({
        status: 'failed',
        failureReason: error instanceof Error ? error.message : 'Unknown error',
      })
      .where(eq(payments.id, payment.id));

    return c.html(`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - שגיאת תשלום</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
    <div class="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
      <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>
    <h1 class="text-xl font-bold text-gray-800 mb-2">שגיאה ביצירת עמוד תשלום</h1>
    <p class="text-gray-600 mb-6">לא הצלחנו להתחבר למערכת התשלום. אנא נסו שוב.</p>
    <a href="/setup/step/5?tenantId=${tenantId}" class="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
      נסו שנית
    </a>
  </div>
</body>
</html>`);
  }
}

/**
 * GET /billing/initiate-payment
 *
 * Start the payment process (accepts redirect from setup wizard).
 */
billingRoutes.get('/initiate-payment', async (c) => {
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  return handlePaymentInitiation(c, tenantId);
});

/**
 * POST /billing/initiate-payment
 *
 * Start the payment process for setup fee + first month.
 * Creates a pending payment record and redirects to PayPlus hosted page.
 */
billingRoutes.post('/initiate-payment', async (c) => {
  // Get tenant ID from header or form data
  const tenantId =
    c.req.header('X-Tenant-ID') ||
    ((await c.req.parseBody()) as Record<string, string>)['tenantId'];

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  return handlePaymentInitiation(c, tenantId);
});

// ============================================
// PAYMENT RESULT PAGES
// ============================================

/**
 * GET /billing/success
 *
 * PayPlus redirects here after successful payment.
 * Note: Actual payment confirmation comes via webhook.
 */
billingRoutes.get('/success', async (c) => {
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.redirect('/setup');
  }

  console.log(`[billing] Success redirect for tenant ${tenantId}`);

  // Show success message
  // Note: Webhook will update actual payment status
  return c.html(`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - התשלום הצליח</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
    <div class="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
      <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>

    <h1 class="text-2xl font-bold text-gray-800 mb-2">התשלום הצליח!</h1>

    <p class="text-gray-600 mb-6">
      תודה על הצטרפותכם ל-Findo.<br/>
      החשבון שלכם מוכן לשימוש.
    </p>

    <div class="bg-green-50 rounded-xl p-4 mb-6 text-right">
      <h3 class="font-medium text-green-800 mb-2">פרטי התשלום:</h3>
      <ul class="text-sm text-green-700 space-y-1">
        <li>דמי הקמה: 3,500 ש"ח</li>
        <li>מנוי חודשי ראשון: 350 ש"ח</li>
        <li>סה"כ: 3,850 ש"ח</li>
      </ul>
    </div>

    <a href="/setup/complete?tenantId=${tenantId}" class="block w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors">
      המשך להשלמת ההגדרה
    </a>

    <p class="text-xs text-gray-400 mt-4">
      קבלה תשלח לכתובת האימייל שלכם
    </p>
  </div>
</body>
</html>`);
});

/**
 * GET /billing/failure
 *
 * PayPlus redirects here when payment fails.
 */
billingRoutes.get('/failure', async (c) => {
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.redirect('/setup');
  }

  console.log(`[billing] Failure redirect for tenant ${tenantId}`);

  return c.html(`<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - התשלום נכשל</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
    <div class="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
      <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>

    <h1 class="text-2xl font-bold text-gray-800 mb-2">התשלום נכשל</h1>

    <p class="text-gray-600 mb-6">
      לא הצלחנו לחייב את כרטיס האשראי שלכם.<br/>
      אנא נסו שנית או השתמשו בכרטיס אחר.
    </p>

    <div class="bg-yellow-50 rounded-xl p-4 mb-6 text-right">
      <h3 class="font-medium text-yellow-800 mb-2">סיבות אפשריות:</h3>
      <ul class="text-sm text-yellow-700 space-y-1">
        <li>- כרטיס אשראי פג תוקף</li>
        <li>- חריגה ממסגרת האשראי</li>
        <li>- פרטי כרטיס שגויים</li>
      </ul>
    </div>

    <div class="space-y-3">
      <form action="/billing/initiate-payment" method="POST">
        <input type="hidden" name="tenantId" value="${tenantId}" />
        <button type="submit" class="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors">
          נסו שנית
        </button>
      </form>

      <a href="/setup/step/5?tenantId=${tenantId}" class="block text-gray-500 hover:text-gray-700 text-sm">
        חזרה לעמוד התשלום
      </a>
    </div>

    <div class="mt-6 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-500">
        צריכים עזרה?
        <a href="mailto:support@findo.co.il" class="text-blue-600 hover:underline">
          צרו קשר עם התמיכה
        </a>
      </p>
    </div>
  </div>
</body>
</html>`);
});

// ============================================
// RECURRING BILLING
// ============================================

/**
 * POST /billing/charge-monthly
 *
 * Charge monthly subscription using saved token.
 * Called by subscription worker.
 *
 * Body: { tenantId: string }
 */
billingRoutes.post('/charge-monthly', async (c) => {
  const body = await c.req.json<{ tenantId: string }>();
  const { tenantId } = body;

  if (!tenantId) {
    return c.json({ success: false, error: 'Tenant ID required' }, 400);
  }

  // Get subscription with token
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.tenantId, tenantId),
  });

  if (!subscription) {
    return c.json({ success: false, error: 'Subscription not found' }, 404);
  }

  if (!subscription.payplusTokenId) {
    return c.json({ success: false, error: 'No payment token' }, 400);
  }

  console.log(`[billing] Charging monthly for tenant ${tenantId}`);

  // Create pending payment record
  const [payment] = await db
    .insert(payments)
    .values({
      tenantId,
      subscriptionId: subscription.id,
      amountAgorot: MONTHLY_FEE_AGOROT,
      type: 'subscription',
      status: 'pending',
    })
    .returning();

  try {
    // Charge using saved token
    const result = await chargeWithToken({
      tokenUid: subscription.payplusTokenId,
      amount: MONTHLY_FEE_AGOROT,
      description: 'Findo - מנוי חודשי',
    });

    if (result.success) {
      // Update payment as completed
      await db
        .update(payments)
        .set({
          status: 'completed',
          payplusTransactionId: result.transactionUid,
          paidAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      // Update subscription billing cycle
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await db
        .update(subscriptions)
        .set({
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: nextMonth,
          nextBillingDate: nextMonth,
          updatedAt: now,
        })
        .where(eq(subscriptions.id, subscription.id));

      console.log(`[billing] Monthly charge successful for tenant ${tenantId}`);

      return c.json({
        success: true,
        transactionUid: result.transactionUid,
        approvalNumber: result.approvalNumber,
      });
    } else {
      // Update payment as failed
      await db
        .update(payments)
        .set({
          status: 'failed',
          failureReason: result.errorMessage,
          retryCount: (payment.retryCount || 0) + 1,
        })
        .where(eq(payments.id, payment.id));

      // Update subscription status if repeated failures
      if ((payment.retryCount || 0) >= 2) {
        await db
          .update(subscriptions)
          .set({
            status: 'past_due',
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, subscription.id));
      }

      console.error(`[billing] Monthly charge failed for tenant ${tenantId}: ${result.errorMessage}`);

      return c.json({
        success: false,
        error: result.errorMessage,
        statusCode: result.statusCode,
      });
    }
  } catch (error) {
    console.error(`[billing] Monthly charge error for tenant ${tenantId}:`, error);

    await db
      .update(payments)
      .set({
        status: 'failed',
        failureReason: error instanceof Error ? error.message : 'Unknown error',
      })
      .where(eq(payments.id, payment.id));

    return c.json({
      success: false,
      error: 'Payment processing failed',
    }, 500);
  }
});
