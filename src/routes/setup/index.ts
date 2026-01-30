/**
 * Setup Wizard Routes
 *
 * Handles the 5-step setup wizard flow:
 * 1. Business information
 * 2. WhatsApp connection
 * 3. Google connection
 * 4. Telephony selection
 * 5. Billing/payment
 *
 * This file contains routes for steps 4-5 (from 10-03 plan).
 * Steps 1-3 routes are added by 10-02 plan.
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '../../db/index';
import { setupProgress, subscriptions } from '../../db/schema/billing';
import { tenants } from '../../db/schema/tenants';
import { eq } from 'drizzle-orm';
import { renderStep4Telephony, type TelephonyOption } from '../../views/setup/step-4-telephony';
import { renderStep5Billing } from '../../views/setup/step-5-billing';
import { renderSetupComplete } from '../../views/setup/complete';

/**
 * Setup Routes
 */
export const setupRoutes = new Hono();

// Validation schema for step 4 (telephony)
const step4Schema = z.object({
  telephonyOption: z.enum(['new', 'transfer', 'current']),
  existingNumber: z.string().optional(),
}).refine(
  (data) => data.telephonyOption === 'new' || (data.existingNumber && data.existingNumber.length >= 9),
  { message: 'יש להזין מספר טלפון', path: ['existingNumber'] }
);

/**
 * Helper: Get or create setup progress for tenant
 */
async function getOrCreateProgress(tenantId: string) {
  const existing = await db.query.setupProgress.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (existing) {
    return existing;
  }

  // Create new progress record
  const [created] = await db.insert(setupProgress)
    .values({
      tenantId,
      currentStep: 1,
      stepData: {},
    })
    .returning();

  return created;
}

/**
 * Helper: Get or create subscription for tenant
 */
async function getOrCreateSubscription(tenantId: string) {
  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.tenantId, tenantId),
  });

  if (existing) {
    return existing;
  }

  // Create new subscription with trial status
  const [created] = await db.insert(subscriptions)
    .values({
      tenantId,
      status: 'trial',
    })
    .returning();

  return created;
}

/**
 * Helper: Get simple layout wrapper
 * This wraps step content in a basic HTML page structure.
 * The full layout (with progress indicator) is provided by 10-02 plan.
 */
function wrapInLayout(stepContent: string, stepNumber: number): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - הגדרת חשבון</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="container mx-auto px-4 py-8 max-w-lg">
    <!-- Progress Indicator -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-500">שלב ${stepNumber} מתוך 5</span>
        <span class="text-sm font-medium text-blue-600">${Math.round((stepNumber / 5) * 100)}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-blue-600 h-2 rounded-full transition-all" style="width: ${(stepNumber / 5) * 100}%"></div>
      </div>
    </div>

    <!-- Step Content -->
    ${stepContent}
  </div>
</body>
</html>`;
}

// ============================================
// STEP 4: Telephony Selection
// ============================================

/**
 * GET /setup/step/4
 *
 * Render telephony selection step.
 */
setupRoutes.get('/step/4', async (c) => {
  // Get tenant ID from header or query (will use auth session in production)
  const tenantId = c.req.header('X-Tenant-ID') || c.req.query('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  // Load existing progress for prefill
  const progress = await getOrCreateProgress(tenantId);
  const stepData = (progress.stepData as Record<string, unknown>) || {};
  const telephonyData = (stepData.telephony as Record<string, unknown>) || {};

  const content = renderStep4Telephony({
    selected: telephonyData.option as TelephonyOption | undefined,
    existingNumber: telephonyData.existingNumber as string | undefined,
  });

  return c.html(wrapInLayout(content, 4));
});

/**
 * POST /setup/step/4
 *
 * Save telephony choice and proceed to step 5.
 */
setupRoutes.post('/step/4', zValidator('form', step4Schema), async (c) => {
  const tenantId = c.req.header('X-Tenant-ID') || c.req.query('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  const formData = c.req.valid('form');

  // Load current progress
  const progress = await getOrCreateProgress(tenantId);
  const currentStepData = (progress.stepData as Record<string, unknown>) || {};

  // Update step data with telephony choice
  const updatedStepData = {
    ...currentStepData,
    telephony: {
      option: formData.telephonyOption,
      existingNumber: formData.existingNumber || null,
    },
  };

  // Save progress and advance to step 5
  await db.update(setupProgress)
    .set({
      currentStep: 5,
      stepData: updatedStepData,
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));

  return c.redirect('/setup/step/5');
});

// ============================================
// STEP 5: Billing
// ============================================

/**
 * GET /setup/step/5
 *
 * Render billing step with pricing summary.
 */
setupRoutes.get('/step/5', async (c) => {
  const tenantId = c.req.header('X-Tenant-ID') || c.req.query('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  // Get or create subscription to get pricing
  const subscription = await getOrCreateSubscription(tenantId);

  const content = renderStep5Billing({
    tenantId,
    setupFeeAgorot: subscription.setupFeeAgorot,
    monthlyFeeAgorot: subscription.monthlyAmountAgorot,
  });

  return c.html(wrapInLayout(content, 5));
});

/**
 * POST /setup/step/5/pay
 *
 * Initiate payment process via PayPlus.
 * NOTE: Full PayPlus integration is in plan 10-04.
 * For now, redirects to complete page (payment simulation).
 */
setupRoutes.post('/step/5/pay', async (c) => {
  const tenantId = c.req.header('X-Tenant-ID') || (await c.req.formData()).get('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  // TODO (10-04): Implement PayPlus payment page generation
  // For now, mark as pending payment and redirect to complete
  await db.update(subscriptions)
    .set({
      status: 'pending_payment',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.tenantId, tenantId.toString()));

  // Mark setup as complete
  await db.update(setupProgress)
    .set({
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId.toString()));

  // Redirect to complete page (payment integration in 10-04)
  return c.redirect('/setup/complete');
});

/**
 * POST /setup/step/5/trial
 *
 * Start 14-day trial without payment.
 */
setupRoutes.post('/step/5/trial', async (c) => {
  const tenantId = c.req.header('X-Tenant-ID') || (await c.req.formData()).get('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  // Calculate trial end date (14 days from now)
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  // Update subscription to trial status
  await db.update(subscriptions)
    .set({
      status: 'trial',
      trialEndsAt,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.tenantId, tenantId.toString()));

  // Mark setup as complete
  await db.update(setupProgress)
    .set({
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId.toString()));

  // Redirect to success page
  return c.redirect('/setup/complete');
});

// ============================================
// COMPLETE PAGE
// ============================================

/**
 * GET /setup/complete
 *
 * Render setup complete success page.
 */
setupRoutes.get('/complete', async (c) => {
  const tenantId = c.req.header('X-Tenant-ID') || c.req.query('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  // Load tenant for business name
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
  });

  return c.html(renderSetupComplete({
    tenantId,
    businessName: tenant?.businessName,
  }));
});
