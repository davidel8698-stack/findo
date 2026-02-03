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
      {/* Headline - Outcome-focused, under 8 words */}
      <h1
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl",
          "font-bold",
          "leading-tight",
          "text-gradient-brand",
          "text-shadow-[0_0_15px_rgba(249,115,22,0.35)]"
        )}
      >
        יותר לקוחות. פחות עבודה.
      </h1>

      {/* Subheadline - Explains the automation */}
      <p
        className={cn(
          "text-lg md:text-xl",
          "leading-[1.8]",
          "text-zinc-400",
          "max-w-lg",
          "mx-auto lg:mx-0"
        )}
      >
        Findo מנהל את הנוכחות הדיגיטלית של העסק שלך 24/7. תגובות לביקורות, פרסום
        תוכן, לכידת לידים - הכל אוטומטי.
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
        {/* OFFER-01: Trust reassurance near CTA */}
        <p className="text-sm text-zinc-400 mt-3 text-center lg:text-start">
          ללא כרטיס אשראי • ביטול בכל עת
        </p>
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
