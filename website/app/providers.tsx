"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { MotionProvider } from "@/providers/MotionProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [posthogClient, setPosthogClient] = useState<typeof posthog | null>(null);

  useEffect(() => {
    // Initialize PostHog only on client
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        capture_pageview: false, // Manual capture for App Router
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
        // Autocapture enabled for heatmaps (ANALYTICS-04)
        autocapture: true,
      });
      setPosthogClient(posthog);
    }
  }, []);

  // Provider nesting order (CRITICAL for RTL and theming):
  // 1. DirectionProvider - RTL context for Radix components (MUST be outermost)
  // 2. ThemeProvider - Dark/light mode theming with next-themes
  // 3. PostHogProvider - Analytics context (conditional on client init)
  // 4. MotionProvider - LazyMotion for tree-shaking
  // 5. SmoothScroll - Lenis smooth scroll with GSAP sync (innermost)

  const content = (
    <MotionProvider>
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </MotionProvider>
  );

  return (
    <DirectionProvider dir="rtl">
      <ThemeProvider>
        {posthogClient ? (
          <PostHogProvider client={posthogClient}>
            {content}
          </PostHogProvider>
        ) : (
          content
        )}
      </ThemeProvider>
    </DirectionProvider>
  );
}
