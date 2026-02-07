"use client";

import { cn } from "@/lib/utils";

interface Logo {
  src: string;
  alt: string;
}

interface SocialProofRowProps {
  logos: Logo[];
  className?: string;
}

/**
 * SocialProofRow - Grayscale customer logos per COMP-12
 *
 * Displays 4-6 business logos in grayscale with 60% opacity.
 * On hover, logos become full color and 100% opacity.
 * Gap between logos is 48px per Linear spec.
 */
export function SocialProofRow({ logos, className }: SocialProofRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center flex-wrap",
        "gap-12", // 48px gap per COMP-12
        className
      )}
    >
      {logos.map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          className={cn(
            "h-8 max-w-[100px] object-contain",
            "grayscale opacity-60",
            "hover:grayscale-0 hover:opacity-100",
            "transition-all duration-300"
          )}
        />
      ))}
    </div>
  );
}
