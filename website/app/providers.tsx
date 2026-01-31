"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { MotionProvider } from "@/providers/MotionProvider";
import { SmoothScroll } from "@/components/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  // Provider nesting order (CRITICAL for RTL):
  // 1. DirectionProvider - RTL context for Radix components (MUST be outermost)
  // 2. MotionProvider - LazyMotion for tree-shaking
  // 3. SmoothScroll - Lenis smooth scroll with GSAP sync (innermost)
  return (
    <DirectionProvider dir="rtl">
      <MotionProvider>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </MotionProvider>
    </DirectionProvider>
  );
}
