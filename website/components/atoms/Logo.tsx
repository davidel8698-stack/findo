import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  /** Show text alongside icon */
  showText?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 text-lg",
  md: "h-8 text-xl",
  lg: "h-10 text-2xl",
};

export function Logo({
  className,
  showText = true,
  size = "md"
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo icon - placeholder until brand assets ready */}
      <div
        className={cn(
          "rounded-lg bg-primary flex items-center justify-center aspect-square",
          sizeClasses[size]
        )}
        aria-hidden="true"
      >
        <span className="text-primary-foreground font-bold">F</span>
      </div>
      {showText && (
        <span className={cn(
          "font-bold text-foreground",
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl",
        )}>
          {siteConfig.name}
        </span>
      )}
    </div>
  );
}
