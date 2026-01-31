"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { MotionProvider } from "@/providers/MotionProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider dir="rtl">
      <MotionProvider>
        {children}
      </MotionProvider>
    </DirectionProvider>
  );
}
