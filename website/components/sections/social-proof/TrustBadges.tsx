import { cn } from "@/lib/utils";
import { Shield, BadgeCheck, CreditCard, Award } from "lucide-react";
import { GradientBorderCard } from "@/components/ui/card";

interface Badge {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  alt: string;
}

/**
 * Badge configuration for trust/authority indicators.
 * Uses Lucide icons for consistent display (no missing image issues).
 */
const badges: Badge[] = [
  {
    icon: Award,
    text: "Google Partner",
    alt: "Google Partner",
  },
  {
    icon: BadgeCheck,
    text: "Meta Partner",
    alt: "Meta Partner",
  },
  {
    icon: CreditCard,
    text: "PayPlus",
    alt: "PayPlus - תשלום מאובטח",
  },
  {
    icon: Shield,
    text: "SSL Secure",
    alt: "SSL Secure - אתר מאובטח",
  },
];

interface TrustBadgesProps {
  className?: string;
  /** Badge size - affects icon dimensions */
  size?: "sm" | "md";
  /** Wrap badges in a GradientBorderCard for premium appearance */
  withCard?: boolean;
}

// Size configurations
const sizeConfig = {
  sm: { gap: "gap-4", text: "text-xs", iconSize: "h-4 w-4" },
  md: { gap: "gap-6", text: "text-sm", iconSize: "h-5 w-5" },
} as const;

/**
 * Trust badges showing authority and partner indicators.
 * Displays icon-based badges with grayscale-to-color hover effect.
 *
 * Uses Lucide icons for all badges to ensure consistent display
 * without relying on external image files.
 *
 * @param withCard - When true, wraps badges in GradientBorderCard for premium appearance
 */
export function TrustBadges({
  className,
  size = "md",
  withCard = false,
}: TrustBadgesProps) {
  const config = sizeConfig[size];

  const content = (
    <div
      className={cn(
        "flex flex-wrap justify-center items-center",
        config.gap,
        !withCard && "py-6", // Only add py-6 when not wrapped (card has its own padding)
        className
      )}
    >
      {badges.map((badge) => (
        <div
          key={badge.alt}
          className="relative grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        >
          <div
            className={cn(
              "flex items-center gap-1.5 text-muted-foreground",
              config.text
            )}
          >
            <badge.icon className={config.iconSize} />
            <span className="font-medium">{badge.text}</span>
          </div>
        </div>
      ))}
    </div>
  );

  if (withCard) {
    return <GradientBorderCard gradient="subtle">{content}</GradientBorderCard>;
  }

  return content;
}
