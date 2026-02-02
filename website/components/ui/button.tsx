import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { m, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { springBouncy } from "@/lib/animation";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-base", // 48px touch target
        sm: "h-12 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-12 w-12", // 48px square
      },
      loading: {
        true: "pointer-events-none animate-shimmer bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.8)] to-[hsl(var(--primary))] bg-[length:200%_100%]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
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
  ({ className, variant, size, loading = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
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
  ({ className, variant, size, loading = false, children, ...props }, ref) => {
    return (
      <m.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, loading, className }))}
        disabled={loading || props.disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={springBouncy}
        {...props}
      >
        {children}
      </m.button>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { Button, AnimatedButton, buttonVariants };
