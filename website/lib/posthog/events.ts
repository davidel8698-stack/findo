// Typed event tracking for Findo conversion funnel
// Event names follow PostHog conventions (snake_case)

import posthog from 'posthog-js';

// Funnel step definitions
export const FUNNEL_STEPS = {
  PAGE_VIEW: '$pageview',
  CTA_CLICK: 'cta_clicked',
  FORM_START: 'form_started',
  FORM_SUBMIT: 'form_submitted',
  DEMO_VIEW: 'demo_viewed',
  DEMO_COMPLETE: 'demo_completed',
} as const;

// CTA locations for attribution
type CtaLocation = 'hero' | 'sticky_bar' | 'after_proof' | 'after_pricing' | 'after_faq' | 'section';

// Track CTA button clicks
export function trackCtaClick(location: CtaLocation, buttonText: string) {
  posthog.capture(FUNNEL_STEPS.CTA_CLICK, {
    button_location: location,
    button_text: buttonText,
    $set: { showed_interest: true },
  });
}

// Track form interactions
export function trackFormStart(formType: 'lead_capture' | 'contact', source: string) {
  posthog.capture(FUNNEL_STEPS.FORM_START, {
    form_type: formType,
    source,
  });
}

// Track form submissions
export function trackFormSubmit(formType: 'lead_capture' | 'contact', source: string, success: boolean) {
  posthog.capture(FUNNEL_STEPS.FORM_SUBMIT, {
    form_type: formType,
    source,
    success,
    $set: success ? { converted: true } : {},
  });
}

// Track demo views
export function trackDemoView(demoType: 'video' | 'interactive' | 'lottie') {
  posthog.capture(FUNNEL_STEPS.DEMO_VIEW, {
    demo_type: demoType,
  });
}

// Track demo completion
export function trackDemoComplete(demoType: 'video' | 'interactive' | 'lottie', watchTimeSeconds?: number) {
  posthog.capture(FUNNEL_STEPS.DEMO_COMPLETE, {
    demo_type: demoType,
    watch_time_seconds: watchTimeSeconds,
  });
}

// Track section visibility for scroll depth
export function trackSectionView(sectionName: string) {
  posthog.capture('section_viewed', {
    section_name: sectionName,
  });
}
