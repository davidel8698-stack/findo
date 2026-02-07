import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { m, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { springLinear, microInteraction, shadowLiftHover, shadowLiftTap } from "@/lib/animation";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-transparent border border-white/20 text-foreground hover:bg-white/5",
        ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-transparent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-3 text-base", // 40px height (M)
        sm: "h-8 px-4 py-2 text-sm", // 32px height (S)
        lg: "h-12 px-8 py-4 text-base", // 48px height (L)
        icon: "h-10 w-10", // 40px square (matches default)
      },
      loading: {
        true: "pointer-events-none animate-shimmer bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.8)] to-[hsl(var(--primary))] bg-[length:200%_100%]",
        false: "",
      },
      glow: {
        // No glow (default)
        none: "",
        // CTA glow with pulse (hero primary only)
        cta: "cta-pulse",
        // Static CTA glow (mobile sticky bar)
        "cta-static": "cta-glow-static",
        // Hover glow for secondary buttons - uses pseudo-element technique
        hover: [
          "relative",
          "after:absolute after:inset-0 after:rounded-lg after:-z-10",
          "after:opacity-0 after:transition-opacity after:duration-200",
          "after:shadow-[0_0_15px_5px_hsl(0_0%_100%_/_0.1)]",
          "hover:after:opacity-100",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
      glow: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, loading = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow, loading, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ===== AnimatedButton with Motion micro-interactions =====

export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, glow, loading = false, children, ...props }, ref) => {
    const isDisabled = loading || props.disabled;

    return (
      <m.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, glow, loading, className }),
          isDisabled && "cursor-not-allowed"
        )}
        disabled={isDisabled}
        // Linear-style -2px hover lift (COMP-01)
        whileHover={isDisabled ? {} : { y: -2 }}
        // Linear-style 0.95 active scale with bouncy spring (COMP-01)
        whileTap={isDisabled ? {} : { scale: 0.95 }}
        // Bouncy spring transition for playful feel
        transition={springLinear}
        {...props}
      >
        {children}
      </m.button>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

/**
 * Hero CTA Button - special variant with scale + glow intensification
 * Only for hero primary CTA where scale is acceptable
 */
export interface HeroCTAButtonProps extends AnimatedButtonProps {
  /** Intensify glow on hover (default: true) */
  intensifyGlow?: boolean;
}

const HeroCTAButton = React.forwardRef<HTMLButtonElement, HeroCTAButtonProps>(
  ({ className, intensifyGlow = true, children, ...props }, ref) => {
    const isDisabled = props.loading || props.disabled;

    return (
      <m.button
        ref={ref}
        className={cn(
          buttonVariants({ variant: "default", size: "lg", glow: "cta", className }),
          isDisabled && "cursor-not-allowed"
        )}
        disabled={isDisabled}
        whileHover={isDisabled ? {} : {
          scale: 1.02,
          y: -1,
          // Intensify glow: +8px spread, +0.1 opacity per CONTEXT.md
          boxShadow: intensifyGlow
            ? "0 0 25px 10px hsl(24.6 95% 53.1% / 0.3), var(--shadow-cta)"
            : shadowLiftHover.boxShadow,
        }}
        whileTap={isDisabled ? {} : shadowLiftTap}
        transition={microInteraction}
        {...props}
      >
        {children}
      </m.button>
    );
  }
);
HeroCTAButton.displayName = "HeroCTAButton";

export { Button, AnimatedButton, HeroCTAButton, buttonVariants };
