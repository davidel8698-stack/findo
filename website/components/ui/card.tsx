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
        "rounded-2xl border bg-card text-card-foreground shadow-sm p-8",
        // Rim lighting - dark mode only, top edge (simulates overhead light)
        rimLight && "dark:border-t-2 dark:border-t-white/10",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// ===== GradientBorderCard - wrapper technique for gradient borders =====

interface GradientBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gradient intensity: subtle (default) or bold */
  gradient?: "subtle" | "bold";
}

const GradientBorderCard = React.forwardRef<
  HTMLDivElement,
  GradientBorderCardProps
>(({ className, gradient = "subtle", children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl p-px", // 16px radius, 1px padding for border
      gradient === "bold"
        ? "bg-gradient-to-b from-primary to-primary/20"
        : "bg-gradient-to-b from-white/20 to-transparent",
      className
    )}
    {...props}
  >
    <div className="bg-card rounded-[calc(1rem-1px)] p-8">{children}</div>
  </div>
));
GradientBorderCard.displayName = "GradientBorderCard";

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
        "rounded-2xl border bg-card text-card-foreground p-8",
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

// ===== HighlightedCard for pricing tier emphasis =====

interface HighlightedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Badge text (e.g., "המומלץ" for "Most popular") */
  badgeText?: string;
}

const HighlightedCard = React.forwardRef<HTMLDivElement, HighlightedCardProps>(
  ({ className, badgeText = "המומלץ", children, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {/* Badge positioned above card */}
      {badgeText && (
        <div className="absolute -top-3 inset-x-0 flex justify-center z-10">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {badgeText}
          </span>
        </div>
      )}

      {/* Gradient border wrapper with glow */}
      <div
        className={cn(
          "rounded-2xl p-px",
          "bg-gradient-to-b from-primary to-primary/20",
          "shadow-[0_0_30px_-5px_hsl(24.6_95%_53.1%_/_0.3)]" // Glow shadow
        )}
      >
        <div className="bg-card rounded-[calc(1rem-1px)] p-8 border-2 border-primary/30">
          {children}
        </div>
      </div>
    </div>
  )
);
HighlightedCard.displayName = "HighlightedCard";

// ===== GlassCard for glassmorphism surfaces =====

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Apply glass effect (default: true on desktop) */
  glass?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glass = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-8",
        // Mobile fallback (solid)
        "bg-[rgb(24_24_27/0.8)] border border-white/20",
        // Desktop glass enhancement (5% white bg, 16px blur, 8% border per CONTEXT.md)
        glass && [
          "md:supports-[backdrop-filter:blur(1px)]:bg-[rgb(255_255_255/0.05)]",
          "md:supports-[backdrop-filter:blur(1px)]:backdrop-blur-[16px]",
          "md:supports-[backdrop-filter:blur(1px)]:border-white/[0.08]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
GlassCard.displayName = "GlassCard";

// ===== ShimmerCard for hero/featured elements (MOTION-05) =====

interface ShimmerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Disable shimmer animation (useful for reduced motion override) */
  noShimmer?: boolean;
}

const ShimmerCard = React.forwardRef<HTMLDivElement, ShimmerCardProps>(
  ({ className, noShimmer = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-8",
        "bg-card text-card-foreground",
        // Shimmer border effect (hero cards only per CONTEXT.md)
        !noShimmer && "shimmer-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ShimmerCard.displayName = "ShimmerCard";

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

export {
  Card,
  AnimatedCard,
  GradientBorderCard,
  HighlightedCard,
  GlassCard,
  ShimmerCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
