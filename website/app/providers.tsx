"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { MotionProvider } from "@/providers/MotionProvider";
import { SmoothScroll } from "@/components/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  // Provider nesting order (CRITICAL for RTL and theming):
  // 1. DirectionProvider - RTL context for Radix components (MUST be outermost)
  // 2. ThemeProvider - Dark/light mode theming with next-themes
  // 3. MotionProvider - LazyMotion for tree-shaking
  // 4. SmoothScroll - Lenis smooth scroll with GSAP sync (innermost)
  return (
    <DirectionProvider dir="rtl">
      <ThemeProvider>
        <MotionProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </MotionProvider>
      </ThemeProvider>
    </DirectionProvider>
  );
}
