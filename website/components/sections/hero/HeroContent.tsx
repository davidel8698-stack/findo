import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeroContentProps {
  className?: string;
}

/**
 * Hero content component following Linear hero pattern.
 * Matches Linear.app styling exactly with RTL Hebrew layout.
 */
export function HeroContent({ className }: HeroContentProps) {
  return (
    <div className={cn("text-center lg:text-start", className)}>
      {/* Headline - Linear style, responsive - centered on mobile */}
      <h1
        data-hero-headline
        data-hero-animate
        className="text-[clamp(32px,7vw,64px)] md:text-[clamp(42px,6vw,64px)] font-bold text-white leading-[1.08] md:leading-[1.1] tracking-[-0.02em] max-w-[720px] mx-auto lg:mx-0 mb-4 md:mb-5"
      >
        יותר לקוחות. פחות עבודה.
      </h1>

      {/* Subheadline - Linear style, responsive - centered on mobile */}
      <p
        data-hero-subheadline
        data-hero-animate
        className="text-[16px] md:text-[18px] text-white/40 max-w-[520px] mx-auto lg:mx-0 mb-6 md:mb-9 leading-[1.5] md:leading-[1.6] tracking-[0]"
      >
        Findo מנהל את הנוכחות הדיגיטלית של העסק שלך 24/7. תגובות לביקורות, פרסום
        תוכן, לכידת לידים - הכל אוטומטי.
      </p>

      {/* CTA Row - Linear style, responsive - centered on mobile */}
      <div
        data-hero-cta
        data-hero-animate
        className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 sm:gap-7 mb-10 md:mb-16"
      >
        <Link
          href="#signup"
          className="px-6 py-[11px] rounded-[10px] bg-white text-black text-[15px] font-medium border border-white/90 hover:bg-white/90 transition-colors tracking-[-0.2px]"
        >
          התחילו עכשיו
        </Link>
        <Link
          href="#how-it-works"
          className="text-white/45 text-[15px] tracking-[-0.2px] hover:text-white/65 transition-colors before:content-['←_']"
        >
          איך זה עובד?
        </Link>
      </div>
    </div>
  );
}
