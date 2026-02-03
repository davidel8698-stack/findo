"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { FormSuccess } from "./FormSuccess";
import { cn } from "@/lib/utils";

interface ConversionSectionProps {
  id?: string;
  className?: string;
  showTrustText?: boolean;
  variant?: "hero" | "section" | "compact";
  /** Source attribution for analytics (e.g., "hero", "after_proof") */
  source?: string;
}

/**
 * ConversionSection wraps the lead capture form with AnimatePresence
 * for smooth transitions between form and success states.
 *
 * Variants:
 * - "hero": Full width, no background (for use in hero area)
 * - "section": Centered, card style with shadow (for standalone sections)
 * - "compact": Smaller padding, inline style
 *
 * Features:
 * - AnimatePresence mode="wait" for smooth form/success swap
 * - Social proof text near CTA (ACTION-08)
 * - Configurable via props
 */
export function ConversionSection({
  id,
  className,
  showTrustText,
  variant = "section",
  source,
}: ConversionSectionProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  // Determine default showTrustText based on variant
  const displayTrustText =
    showTrustText !== undefined
      ? showTrustText
      : variant !== "hero"; // Default true for section/compact, false for hero

  // Derive source from variant if not explicitly provided
  const analyticsSource = source || variant;

  // Variant-specific styles
  const variantStyles = {
    hero: "w-full",
    section: cn(
      "max-w-md mx-auto",
      "bg-card rounded-xl p-6 shadow-lg",
      "border border-border"
    ),
    compact: "max-w-sm mx-auto p-4",
  };

  const redirectUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://app.findo.co.il";

  return (
    <div id={id} className={cn(variantStyles[variant], className)}>
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <m.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LeadCaptureForm
              onSuccess={() => setIsSuccess(true)}
              className={variant === "section" ? "mx-auto" : undefined}
              source={analyticsSource}
            />
          </m.div>
        ) : (
          <m.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FormSuccess redirectUrl={redirectUrl} />
          </m.div>
        )}
      </AnimatePresence>

      {/* Social proof near CTA (ACTION-08) */}
      {displayTrustText && !isSuccess && (
        <p className="text-sm text-zinc-400 text-center mt-4">
          573+ עסקים כבר משתמשים ב-Findo
        </p>
      )}
    </div>
  );
}
