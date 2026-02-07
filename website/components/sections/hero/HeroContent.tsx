import { cn } from "@/lib/utils";
import { CTAGroup, SocialProofRow } from "@/components/molecules";
import { ArrowLeft } from "lucide-react";

interface HeroContentProps {
  className?: string;
}

// Placeholder logos - replace with actual customer logos when available
const socialProofLogos = [
  { src: "/logos/business-1.svg", alt: "לקוח 1" },
  { src: "/logos/business-2.svg", alt: "לקוח 2" },
  { src: "/logos/business-3.svg", alt: "לקוח 3" },
  { src: "/logos/business-4.svg", alt: "לקוח 4" },
];

/**
 * Hero content component following Linear hero pattern (COMP-11):
 * Badge -> H1 -> Subheadline -> CTAs -> Social Proof
 *
 * Renders problem-focused Hebrew messaging for the target audience.
 * Uses RTL-native layout with logical properties.
 */
export function HeroContent({ className }: HeroContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-4",
        "text-start", // Right-aligned in RTL
        className
      )}
    >
      {/* Headline - Outcome-focused, under 8 words */}
      <h1
        data-hero-headline
        data-hero-animate
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
        data-hero-subheadline
        data-hero-animate
        className={cn(
          "text-lg md:text-xl",
          "leading-[1.8]",
          "text-zinc-400",
          "max-w-lg"
        )}
      >
        Findo מנהל את הנוכחות הדיגיטלית של העסק שלך 24/7. תגובות לביקורות, פרסום
        תוכן, לכידת לידים - הכל אוטומטי.
      </p>

      {/* CTA Group - Primary + Ghost pairing per COMP-11 */}
      <div className="mt-4" data-hero-cta data-hero-animate>
        <CTAGroup
          primaryText="התחל בחינם"
          primaryIcon={ArrowLeft}
          primaryHref="#signup"
          secondaryText="איך זה עובד?"
          secondaryHref="#how-it-works"
          className="justify-start"
        />
      </div>

      {/* Social proof logos per COMP-12 - hidden until actual logos available */}
      {/*
      <SocialProofRow
        logos={socialProofLogos}
        className="mt-8 justify-center lg:justify-start"
      />
      */}
    </div>
  );
}
