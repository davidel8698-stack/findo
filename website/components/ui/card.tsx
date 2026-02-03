import * as React from "react";
import { m, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { springGentle } from "@/lib/animation";

// ===== Card with optional rim lighting =====

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable dark mode rim lighting (top edge highlight) */
  rimLight?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, rimLight = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        // Rim lighting - dark mode only, top edge (simulates overhead light)
        rimLight && "dark:border-t-2 dark:border-t-white/10",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// ===== AnimatedCard with hover elevation and rim lighting =====

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  /** Enable dark mode rim lighting (default: true for AnimatedCard) */
  rimLight?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, rimLight = true, ...props }, ref) => (
    <m.div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground",
        // Dark mode rim lighting (on by default for AnimatedCard)
        rimLight && "dark:border-t-2 dark:border-t-white/10",
        className
      )}
      style={{
        boxShadow: "var(--shadow-elevation-medium)",
      }}
      whileHover={{
        y: -4,
        boxShadow: "var(--shadow-hover)",
      }}
      transition={springGentle}
      {...props}
    />
  )
);
AnimatedCard.displayName = "AnimatedCard";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 ps-6 pe-6 pt-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("ps-6 pe-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center ps-6 pe-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, AnimatedCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
