"use client";

import { useEffect, useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, AnimatedButton } from "@/components/ui/button";
import { PhoneInput } from "./PhoneInput";
import { submitLead } from "@/app/actions";
import { cn } from "@/lib/utils";
import { trackFormStart, trackFormSubmit } from "@/lib/posthog/events";
import { useShake } from "@/lib/hooks/useShake";

interface LeadCaptureFormProps {
  onSuccess: () => void;
  className?: string;
  /** Source attribution for analytics (e.g., "hero", "after_proof") */
  source?: string;
}

/**
 * 2-field lead capture form with server action submission
 *
 * Features:
 * - Name and phone fields only (minimal friction)
 * - Uses React 19 useActionState for form handling
 * - Loading state during submission (shimmer button)
 * - Warm Hebrew error messages
 * - Calls onSuccess when submission succeeds
 */
export function LeadCaptureForm({ onSuccess, className, source = "unknown" }: LeadCaptureFormProps) {
  const [state, formAction, isPending] = useActionState(submitLead, {
    success: false,
    error: null,
  });

  // Shake animation refs for error feedback
  const { ref: nameRef, triggerShake: shakeName, clearError: clearNameError } = useShake<HTMLInputElement>();
  const { ref: phoneRef, triggerShake: shakePhone, clearError: clearPhoneError } = useShake<HTMLDivElement>();

  // Field error state tracking
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; phone?: boolean }>({});

  // Track form start - only once when user first interacts
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const handleFocus = () => {
    if (!hasTrackedStart) {
      trackFormStart("lead_capture", source);
      setHasTrackedStart(true);
    }
  };

  // Call onSuccess when form successfully submits
  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  // Track form submission result
  useEffect(() => {
    if (state.success !== undefined && (state.success || state.error)) {
      trackFormSubmit("lead_capture", source, state.success);
    }
  }, [state.success, state.error, source]);

  // Handle error state and trigger shake animations
  useEffect(() => {
    if (state.error) {
      // Server returned error - shake both fields with gentle animation
      setFieldErrors({ name: true, phone: true });
      shakeName("gentle");
      shakePhone("gentle");
    }
  }, [state.error, shakeName, shakePhone]);

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-4 max-w-sm mx-auto", className)}
    >
      {/* Name field */}
      <div>
        <Input
          ref={nameRef}
          name="name"
          type="text"
          placeholder="השם שלך"
          required
          disabled={isPending}
          autoComplete="name"
          error={fieldErrors.name}
          onFocus={handleFocus}
          onChange={() => {
            setFieldErrors(prev => ({ ...prev, name: false }));
            clearNameError();
          }}
        />
      </div>

      {/* Phone field */}
      <div ref={phoneRef}>
        <PhoneInput
          name="phone"
          disabled={isPending}
          error={fieldErrors.phone ? " " : undefined}
          onFocus={() => {
            setFieldErrors(prev => ({ ...prev, phone: false }));
            clearPhoneError();
          }}
        />
      </div>

      {/* Error message (warm style, not harsh) */}
      {state.error && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {state.error}
        </p>
      )}

      {/* Submit button */}
      <AnimatedButton
        type="submit"
        loading={isPending}
        className="w-full"
      >
        {isPending ? "שולח..." : "התחל עכשיו"}
      </AnimatedButton>

      {/* Time expectation (ACTION-03 requirement) */}
      <p className="text-sm text-muted-foreground text-center">
        תוך 2 דקות תהיה מחובר
      </p>
    </form>
  );
}
