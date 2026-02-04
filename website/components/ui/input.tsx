import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  /** Error state - adds destructive border and glow */
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base text-start ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Focus glow with 4px spread (MICRO-05)
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "focus-visible:shadow-[0_0_0_4px_hsl(var(--ring)_/_0.15)]",
          // Transition for smooth glow animation (MICRO-07, MICRO-08)
          "transition-[box-shadow,border-color] duration-200 ease-out",
          // Error state styling
          error && [
            "border-destructive",
            "focus-visible:ring-destructive",
            "focus-visible:shadow-[0_0_0_4px_hsl(var(--destructive)_/_0.15)]",
          ],
          className
        )}
        aria-invalid={error || undefined}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, type InputProps };
