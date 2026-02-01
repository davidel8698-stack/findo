"use client";

import { cn } from "@/lib/utils";
import { CTAGroup } from "@/components/molecules";
import { TrustSignal } from "./TrustSignal";
import { ArrowLeft } from "lucide-react";

interface HeroContentProps {
  className?: string;
}

/**
 * Hero content component with headline, subheadline, and CTA.
 * Renders problem-focused Hebrew messaging for the target audience.
 * Uses RTL-native layout with logical properties.
 */
export function HeroContent({ className }: HeroContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-6",
        "text-center lg:text-start",
        className
      )}
    >
      {/* Headline - Problem-focused, under 8 words */}
      <h1
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl",
          "font-bold",
          "text-foreground",
          "leading-tight"
        )}
      >
        העסק שלך עובד. אתה לא צריך.
      </h1>

      {/* Subheadline - Explains the mechanism */}
      <p
        className={cn(
          "text-lg md:text-xl",
          "text-muted-foreground",
          "max-w-lg",
          "mx-auto lg:mx-0"
        )}
      >
        Findo מנהל את הגוגל ביזנס שלך באופן אוטומטי - משיב לביקורות, מפרסם תוכן,
        ולוכד לידים בוואטסאפ. אתה לא עושה כלום.
      </p>

      {/* CTA Group */}
      <div className="mt-8">
        <CTAGroup
          primaryText="התחל בחינם"
          primaryIcon={ArrowLeft}
          primaryHref="#signup"
          secondaryText="איך זה עובד?"
          secondaryHref="#how-it-works"
          className="justify-center lg:justify-start"
        />
      </div>

      {/* Trust Signal - subtle social proof below CTA */}
      <TrustSignal
        value="573"
        label="עסקים סומכים על Findo"
        className="mt-6 justify-center lg:justify-start"
      />
    </div>
  );
}
