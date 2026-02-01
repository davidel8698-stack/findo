"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle } from "lucide-react";
import { m } from "motion/react";
import { cn } from "@/lib/utils";

interface FormSuccessProps {
  className?: string;
  redirectUrl?: string;
}

/**
 * Celebration state with confetti animation
 *
 * Features:
 * - Confetti burst on mount (respects reduced motion)
 * - Animated scale-in with green checkmark
 * - Optional redirect after 3 seconds
 * - Hebrew celebration copy
 */
export function FormSuccess({ className, redirectUrl }: FormSuccessProps) {
  useEffect(() => {
    // Fire confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f97316", "#22c55e", "#3b82f6"],
      disableForReducedMotion: true,
    });

    // Redirect after 3 seconds if URL provided
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={cn(
        "flex flex-col items-center justify-center text-center gap-4",
        className
      )}
    >
      <CheckCircle className="h-16 w-16 text-green-500" aria-hidden="true" />
      <h3 className="text-2xl font-bold text-foreground">הצטרפת בהצלחה!</h3>
      <p className="text-muted-foreground">
        מוכן ליותר לקוחות ופחות עבודה
      </p>
    </m.div>
  );
}
