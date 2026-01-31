"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  /** Hide label visually but keep for screen readers */
  labelHidden?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, description, labelHidden, className, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const errorId = `${id}-error`;
    const descriptionId = `${id}-description`;

    return (
      <div className={cn("space-y-2", className)}>
        <Label
          htmlFor={id}
          className={cn(labelHidden && "sr-only")}
        >
          {label}
        </Label>

        <Input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={cn(
            error && errorId,
            description && descriptionId,
          )}
          className={cn(error && "border-destructive")}
          {...props}
        />

        {description && !error && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
