import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

interface GuaranteeBadgeProps {
  /**
   * inline: Compact badge for placement near CTAs
   * full: Card-like section with detailed guarantee description
   */
  variant?: "inline" | "full";
  className?: string;
}

/**
 * Money-back guarantee badge in two variants.
 *
 * - "inline" (default): Compact, single-line for CTA proximity
 * - "full": Card-style with title and description for dedicated sections
 *
 * Per TRUST-05/TRUST-07: Guarantee reduces risk perception.
 */
export function GuaranteeBadge({
  variant = "inline",
  className,
}: GuaranteeBadgeProps) {
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-sm text-muted-foreground",
          className
        )}
      >
        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
        <span>אחריות 100% החזר כספי</span>
      </div>
    );
  }

  // Full variant - card-like with title and description
  return (
    <div
      className={cn(
        "bg-primary/5 border border-primary/20 rounded-lg p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
        <span className="font-semibold text-foreground">ההבטחה של Findo</span>
      </div>
      <p className="text-sm text-muted-foreground">
        לא מרוצה? קבל החזר מלא תוך 30 יום, ללא שאלות.
      </p>
    </div>
  );
}
