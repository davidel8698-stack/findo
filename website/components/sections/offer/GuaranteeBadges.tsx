import { cn } from "@/lib/utils";
import { ShieldCheck, Clock, Star, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Three distinct guarantee types per CONTEXT.md:
 * - refund: 14-day full money-back guarantee
 * - response: 60-second call response or 250 NIS compensation
 * - reviews: 10 reviews in first month or refund + 250 NIS
 */
export type GuaranteeType = "refund" | "response" | "reviews";

interface GuaranteeConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
}

const guaranteeConfig: Record<GuaranteeType, GuaranteeConfig> = {
  refund: {
    icon: ShieldCheck,
    title: "החזר כספי מלא",
    description: "14 ימי עסקים להחזר מלא, ללא שאלות",
    badge: "14 יום החזר מלא",
  },
  response: {
    icon: Clock,
    title: "מענה תוך 60 שניות",
    description: "כל שיחה נענית תוך 60 שניות, או 250 ₪ פיצוי",
    badge: "60 שניות מענה",
  },
  reviews: {
    icon: Star,
    title: "10 ביקורות מובטחות",
    description: "לפחות 10 ביקורות בחודש הראשון, או החזר + 250 ₪",
    badge: "10+ ביקורות",
  },
};

export interface GuaranteeBadgeProps {
  /**
   * Which guarantee to display
   */
  type: GuaranteeType;
  /**
   * inline: Compact badge for placement near CTAs
   * full: Card-like section with detailed guarantee description
   */
  variant?: "inline" | "full";
  className?: string;
}

/**
 * Three-guarantee badge system per CONTEXT.md.
 *
 * - "inline" (default): Compact, single-line for CTA proximity
 * - "full": Card-style with title and description for dedicated sections
 *
 * Shows specific compensation amounts (250 NIS) for maximum persuasion.
 */
export function GuaranteeBadge({
  type,
  variant = "inline",
  className,
}: GuaranteeBadgeProps) {
  const config = guaranteeConfig[type];
  const Icon = config.icon;

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-sm text-muted-foreground",
          className
        )}
      >
        <Badge variant="success" className="text-[10px] px-1.5 py-0">
          <Icon className="h-3 w-3 me-0.5" />
        </Badge>
        <span>{config.badge}</span>
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
        <Badge variant="success" className="text-[10px] px-1.5 py-0">
          <Icon className="h-3 w-3" />
        </Badge>
        <span className="font-semibold text-foreground">{config.title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{config.description}</p>
    </div>
  );
}
