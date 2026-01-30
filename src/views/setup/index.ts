/**
 * Setup wizard view exports
 *
 * Re-exports all setup wizard views for convenient importing.
 * Views render the 5-step setup wizard flow.
 */

// Layout and common components
export { renderSetupLayout } from './layout';

// Step views
export { renderStep1Business } from './step-1-business';
export { renderStep2WhatsApp } from './step-2-whatsapp';
export { renderStep3Google } from './step-3-google';
export { renderStep4Telephony, type TelephonyOption } from './step-4-telephony';
export { renderStep5Billing } from './step-5-billing';

// Completion page
export { renderSetupComplete } from './complete';
