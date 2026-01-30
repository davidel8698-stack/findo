/**
 * Setup Wizard Routes
 *
 * Handles the 5-step setup wizard flow:
 * 1. Business information (10-02)
 * 2. WhatsApp connection (10-02)
 * 3. Google connection (10-02)
 * 4. Telephony selection (10-03)
 * 5. Billing/payment (10-03)
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '../../db/index';
import { setupProgress, subscriptions } from '../../db/schema/billing';
import { tenants } from '../../db/schema/tenants';
import { eq } from 'drizzle-orm';
import { renderStep1Business } from '../../views/setup/step-1-business';
import { renderStep2WhatsApp } from '../../views/setup/step-2-whatsapp';
import { renderStep3Google } from '../../views/setup/step-3-google';
import { renderStep4Telephony, type TelephonyOption } from '../../views/setup/step-4-telephony';
import { renderStep5Billing } from '../../views/setup/step-5-billing';
import { renderSetupComplete } from '../../views/setup/complete';
import { getConnectionStatus as getWhatsAppStatus } from '../../services/whatsapp/embedded-signup';
import { getGoogleConnection } from '../../services/google/oauth';

/**
 * Setup Routes
 */
export const setupRoutes = new Hono();

// Validation schema for step 1 (business info)
const step1Schema = z.object({
  businessName: z.string().min(2, 'שם העסק קצר מדי').max(255),
  businessType: z.enum(['plumber', 'electrician', 'garage', 'general_contractor', 'other']),
  ownerName: z.string().min(2, 'שם בעל העסק קצר מדי').max(255),
  ownerEmail: z.string().email('כתובת אימייל לא תקינה').max(255),
  ownerPhone: z.string().optional(),
  address: z.string().max(500).optional(),
  tenantId: z.string().uuid().optional(),
});

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

/**
 * Helper: Parse business hours from form data
 */
function parseBusinessHours(formData: Record<string, string>): Record<string, { open: string; close: string; closed?: boolean }> {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const hours: Record<string, { open: string; close: string; closed?: boolean }> = {};

  for (const day of days) {
    const isActive = formData[`hours_${day}_active`] === 'on';
    const open = formData[`hours_${day}_open`] || '08:00';
    const close = formData[`hours_${day}_close`] || '18:00';

    hours[day] = {
      open,
      close,
      closed: !isActive,
    };
  }

  return hours;
}

// ============================================
// ENTRY POINT
// ============================================

/**
 * GET /setup
 *
 * Entry point - redirects to current step based on progress.
 */
setupRoutes.get('/', async (c) => {
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    // No tenant yet - start at step 1 without tenant ID
    return c.redirect('/setup/step/1');
  }

  // Check progress for existing tenant
  const progress = await db.query.setupProgress?.findFirst({
    where: eq(setupProgress.tenantId, tenantId),
  });

  if (!progress) {
    // Create progress record
    await db.insert(setupProgress).values({
      tenantId,
      currentStep: 1,
      stepData: {},
    });
    return c.redirect(`/setup/step/1?tenantId=${tenantId}`);
  }

  // Resume from current step
  return c.redirect(`/setup/step/${progress.currentStep}?tenantId=${tenantId}`);
});

// ============================================
// STEP 1: Business Information
// ============================================

/**
 * GET /setup/step/1
 *
 * Render business information form.
 */
setupRoutes.get('/step/1', async (c) => {
  const tenantId = c.req.query('tenantId');

  let prefillData: Record<string, unknown> = {};

  if (tenantId) {
    const progress = await db.query.setupProgress?.findFirst({
      where: eq(setupProgress.tenantId, tenantId),
    });

    if (progress?.stepData) {
      prefillData = progress.stepData as Record<string, unknown>;
    }

    // Also load tenant data for prefill
    const tenant = await db.query.tenants?.findFirst({
      where: eq(tenants.id, tenantId),
    });

    if (tenant) {
      prefillData = {
        ...prefillData,
        businessName: tenant.businessName,
        businessType: tenant.businessType,
        ownerName: tenant.ownerName,
        ownerEmail: tenant.ownerEmail,
        ownerPhone: tenant.ownerPhone,
        address: tenant.address,
      };
    }
  }

  return c.html(renderStep1Business({
    prefill: prefillData,
    tenantId: tenantId || undefined,
  }));
});

/**
 * POST /setup/step/1
 *
 * Save business info, create or update tenant.
 */
setupRoutes.post('/step/1', zValidator('form', step1Schema), async (c) => {
  const data = c.req.valid('form');

  // Parse business hours from raw form
  const rawForm = await c.req.parseBody() as Record<string, string>;
  const businessHours = parseBusinessHours(rawForm);

  let tenantId = data.tenantId;

  if (tenantId) {
    // Update existing tenant
    await db
      .update(tenants)
      .set({
        businessName: data.businessName,
        businessType: data.businessType,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone || null,
        address: data.address || null,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenantId));

    // Update progress
    const existingProgress = await db.query.setupProgress?.findFirst({
      where: eq(setupProgress.tenantId, tenantId),
    });

    if (existingProgress) {
      await db
        .update(setupProgress)
        .set({
          currentStep: 2,
          stepData: {
            ...(existingProgress.stepData as object || {}),
            step1: { ...data, businessHours },
          },
          updatedAt: new Date(),
        })
        .where(eq(setupProgress.tenantId, tenantId));
    } else {
      await db.insert(setupProgress).values({
        tenantId,
        currentStep: 2,
        stepData: { step1: { ...data, businessHours } },
      });
    }
  } else {
    // Check if email already exists
    const existingTenant = await db.query.tenants?.findFirst({
      where: eq(tenants.ownerEmail, data.ownerEmail),
    });

    if (existingTenant) {
      // Resume with existing tenant
      tenantId = existingTenant.id;

      await db
        .update(tenants)
        .set({
          businessName: data.businessName,
          businessType: data.businessType,
          ownerName: data.ownerName,
          ownerPhone: data.ownerPhone || null,
          address: data.address || null,
          updatedAt: new Date(),
        })
        .where(eq(tenants.id, tenantId));
    } else {
      // Create new tenant
      const [newTenant] = await db
        .insert(tenants)
        .values({
          businessName: data.businessName,
          businessType: data.businessType,
          ownerName: data.ownerName,
          ownerEmail: data.ownerEmail,
          ownerPhone: data.ownerPhone || null,
          address: data.address || null,
          status: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        })
        .returning({ id: tenants.id });

      tenantId = newTenant.id;
    }

    // Create progress record
    await db.insert(setupProgress).values({
      tenantId,
      currentStep: 2,
      stepData: { step1: { ...data, businessHours } },
    }).onConflictDoUpdate({
      target: setupProgress.tenantId,
      set: {
        currentStep: 2,
        stepData: { step1: { ...data, businessHours } },
        updatedAt: new Date(),
      },
    });
  }

  // Redirect to step 2
  return c.redirect(`/setup/step/2?tenantId=${tenantId}`);
});

// ============================================
// STEP 2: WhatsApp Connection
// ============================================

/**
 * GET /setup/step/2
 *
 * Render WhatsApp connection step.
 */
setupRoutes.get('/step/2', async (c) => {
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  const appId = process.env.META_APP_ID || '';
  const configId = process.env.META_CONFIG_ID || '';
  const whatsappStatus = await getWhatsAppStatus(tenantId);

  return c.html(renderStep2WhatsApp({
    tenantId,
    appId,
    configId,
    connected: whatsappStatus.connected,
    phoneNumber: whatsappStatus.phoneNumber || undefined,
    businessName: whatsappStatus.businessName || undefined,
  }));
});

/**
 * GET /setup/step/2/callback
 *
 * Handle WhatsApp Embedded Signup callback success.
 */
setupRoutes.get('/step/2/callback', async (c) => {
  const tenantId = c.req.query('tenantId');
  const success = c.req.query('success');
  const error = c.req.query('error');

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  if (error) {
    // Render step 2 with error
    const appId = process.env.META_APP_ID || '';
    const configId = process.env.META_CONFIG_ID || '';

    return c.html(renderStep2WhatsApp({
      tenantId,
      appId,
      configId,
      connected: false,
      error: decodeURIComponent(error),
    }));
  }

  if (success === 'true') {
    // Update progress to step 3
    await db
      .update(setupProgress)
      .set({
        currentStep: 3,
        updatedAt: new Date(),
      })
      .where(eq(setupProgress.tenantId, tenantId));

    return c.redirect(`/setup/step/3?tenantId=${tenantId}`);
  }

  return c.redirect(`/setup/step/2?tenantId=${tenantId}`);
});

/**
 * POST /setup/step/2/skip
 *
 * Skip WhatsApp connection, advance to step 3.
 */
setupRoutes.post('/step/2/skip', async (c) => {
  const formData = await c.req.parseBody();
  const tenantId = formData['tenantId'] as string;

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  // Update progress
  await db
    .update(setupProgress)
    .set({
      currentStep: 3,
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));

  return c.redirect(`/setup/step/3?tenantId=${tenantId}`);
});

/**
 * POST /setup/step/2/continue
 *
 * Continue from connected WhatsApp to step 3.
 */
setupRoutes.post('/step/2/continue', async (c) => {
  const formData = await c.req.parseBody();
  const tenantId = formData['tenantId'] as string;

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  // Update progress
  await db
    .update(setupProgress)
    .set({
      currentStep: 3,
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));

  return c.redirect(`/setup/step/3?tenantId=${tenantId}`);
});

// ============================================
// STEP 3: Google Connection
// ============================================

/**
 * GET /setup/step/3
 *
 * Render Google connection step.
 */
setupRoutes.get('/step/3', async (c) => {
  const tenantId = c.req.query('tenantId');

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  const googleStatus = await getGoogleConnection(tenantId);

  return c.html(renderStep3Google({
    tenantId,
    connected: googleStatus.connected,
    accountName: googleStatus.accountName,
  }));
});

/**
 * GET /setup/step/3/callback
 *
 * Handle Google OAuth callback.
 * The existing Google OAuth callback (/api/google/callback) handles token exchange.
 * It redirects here on success.
 */
setupRoutes.get('/step/3/callback', async (c) => {
  const tenantId = c.req.query('tenantId') || c.req.query('state');
  const success = c.req.query('success');
  const error = c.req.query('error');

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  if (error) {
    // Render step 3 with error
    return c.html(renderStep3Google({
      tenantId,
      connected: false,
      error: decodeURIComponent(error),
    }));
  }

  if (success === 'true') {
    // Update progress to step 4
    await db
      .update(setupProgress)
      .set({
        currentStep: 4,
        updatedAt: new Date(),
      })
      .where(eq(setupProgress.tenantId, tenantId));

    return c.redirect(`/setup/step/4?tenantId=${tenantId}`);
  }

  return c.redirect(`/setup/step/3?tenantId=${tenantId}`);
});

/**
 * POST /setup/step/3/skip
 *
 * Skip Google connection, advance to step 4.
 */
setupRoutes.post('/step/3/skip', async (c) => {
  const formData = await c.req.parseBody();
  const tenantId = formData['tenantId'] as string;

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  // Update progress
  await db
    .update(setupProgress)
    .set({
      currentStep: 4,
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));

  return c.redirect(`/setup/step/4?tenantId=${tenantId}`);
});

/**
 * POST /setup/step/3/continue
 *
 * Continue from connected Google to step 4.
 */
setupRoutes.post('/step/3/continue', async (c) => {
  const formData = await c.req.parseBody();
  const tenantId = formData['tenantId'] as string;

  if (!tenantId) {
    return c.redirect('/setup/step/1');
  }

  // Update progress
  await db
    .update(setupProgress)
    .set({
      currentStep: 4,
      updatedAt: new Date(),
    })
    .where(eq(setupProgress.tenantId, tenantId));

  return c.redirect(`/setup/step/4?tenantId=${tenantId}`);
});

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
 * Redirects to billing routes which handle PayPlus integration.
 */
setupRoutes.post('/step/5/pay', async (c) => {
  const tenantId = c.req.header('X-Tenant-ID') || (await c.req.formData()).get('tenantId');

  if (!tenantId) {
    return c.text('Tenant ID required', 400);
  }

  // Update subscription to pending payment status
  await db.update(subscriptions)
    .set({
      status: 'pending_payment',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.tenantId, tenantId.toString()));

  // Redirect to billing route which handles PayPlus payment page
  // This route creates payment record and redirects to PayPlus hosted page
  return c.redirect(`/billing/initiate-payment?tenantId=${tenantId}`);
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
