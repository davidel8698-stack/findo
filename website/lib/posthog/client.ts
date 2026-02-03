// PostHog client configuration for Findo website
// Uses reverse proxy (/ingest) to avoid ad blocker interference

import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      capture_pageview: false, // Manual capture for App Router
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      // Session replay settings
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
      },
      // Autocapture for heatmaps (ANALYTICS-04)
      autocapture: true,
      // Feature flags for A/B testing
      bootstrap: {
        featureFlags: {},
      },
    });
  }
  return posthog;
}
