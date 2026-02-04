"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  isValidIsraeliPhone,
  formatIsraeliPhone,
} from "@/lib/validation";

interface PhoneInputProps {
  name: string;
  disabled?: boolean;
  error?: string;
  onFocus?: () => void;
}

/**
 * Auto-formatting Israeli phone input with validity indicator
 *
 * Features:
 * - Progressive formatting as user types (050 -> 050-123 -> 050-123-4567)
 * - Green checkmark when valid Israeli mobile number entered
 * - dir="ltr" to prevent RTL number reversal (critical for Hebrew pages)
 * - Mobile-friendly tel keyboard
 */
export function PhoneInput({ name, disabled, error, onFocus }: PhoneInputProps) {
  const [value, setValue] = useState("");

  // Derive validity from current value
  const isValid = isValidIsraeliPhone(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatIsraeliPhone(rawValue);
    setValue(formatted);
  };

  return (
    <div className="relative">
      <Input
        type="tel"
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        disabled={disabled}
        dir="ltr"
        placeholder="050-123-4567"
        className={cn(
          "text-start pe-10",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {/* Green checkmark when valid */}
      {isValid && (
        <div className="absolute end-3 top-1/2 -translate-y-1/2 text-green-500">
          <Check className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
