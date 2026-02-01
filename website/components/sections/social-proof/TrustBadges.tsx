import Image from "next/image";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

/**
 * Badge configuration for trust/authority indicators.
 * Note: Real badge SVGs needed in production - these are placeholder paths.
 */
const badges = [
  {
    src: "/badges/google-partner.svg",
    alt: "Google Partner",
    fallbackText: "Google Partner",
  },
  {
    src: "/badges/meta-partner.svg",
    alt: "Meta Partner",
    fallbackText: "Meta Partner",
  },
  {
    src: "/badges/payplus.svg",
    alt: "PayPlus - תשלום מאובטח",
    fallbackText: "PayPlus",
  },
  {
    src: "/badges/ssl-secure.svg",
    alt: "SSL Secure - אתר מאובטח",
    fallbackText: "SSL",
    useIcon: true, // Use Shield icon as fallback
  },
] as const;

interface TrustBadgesProps {
  className?: string;
  /** Badge size - affects image dimensions */
  size?: "sm" | "md";
}

// Size configurations
const sizeConfig = {
  sm: { width: 80, height: 28, gap: "gap-4", text: "text-xs" },
  md: { width: 120, height: 40, gap: "gap-6", text: "text-sm" },
} as const;

/**
 * Trust badges showing authority and partner logos.
 * Displays partner/authority indicators with grayscale-to-color hover effect.
 *
 * Note: In production, replace placeholder SVGs in /public/badges/
 * with actual partner badge images.
 */
export function TrustBadges({ className, size = "md" }: TrustBadgesProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center items-center",
        config.gap,
        "py-6",
        className
      )}
    >
      {badges.map((badge) => (
        <div
          key={badge.alt}
          className="relative grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        >
          {badge.useIcon ? (
            // SSL badge with Shield icon as fallback
            <div
              className={cn(
                "flex items-center gap-1.5 text-muted-foreground",
                config.text
              )}
            >
              <Shield className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
              <span className="font-medium">{badge.fallbackText}</span>
            </div>
          ) : (
            // Image badge (will show alt text if image missing)
            <Image
              src={badge.src}
              alt={badge.alt}
              width={config.width}
              height={config.height}
              className="object-contain"
              // Show fallback on error (handled by Next.js Image)
              onError={(e) => {
                // Replace with text fallback on image load error
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling;
                if (fallback) {
                  (fallback as HTMLElement).style.display = "block";
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
