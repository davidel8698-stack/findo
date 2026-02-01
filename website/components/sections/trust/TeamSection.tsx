"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

// ============================================================================
// CONTENT - Easily replaceable founder information
// ============================================================================

const FOUNDER = {
  name: "דוד ישראלי",
  role: "מייסד",
  photo: "/team/founder.jpg",
  /** Founder story - personal pain point that led to building Findo */
  story: `ניהלתי עסק קטן במשך שנים. כל יום ראיתי את אותן בעיות חוזרות - שיחות שלא נענו הפכו ללידים אבודים, לקוחות מרוצים שאף פעם לא השאירו ביקורות, ופרופיל גוגל שלא עודכן חודשים.

ניסיתי להשתמש בכלים שונים, אבל כולם דרשו זמן שלא היה לי. בתור בעל עסק, אני עסוק בלתת שירות - לא בלנהל מערכות שיווק.

אז בניתי את Findo. מערכת שעובדת 24/7 בלי שאני צריך לעשות כלום. היא עונה ללידים, אוספת ביקורות, ומנהלת את הנוכחות הדיגיטלית שלי - והכל אוטומטי לחלוטין.`,
  mission: "להפוך כל עסק קטן לחכם כמו הגדולים",
};

const SECTION = {
  title: "הסיפור שלנו",
  subtitle: "למה בנינו את Findo",
};

// ============================================================================
// COMPONENT
// ============================================================================

interface TeamSectionProps {
  className?: string;
}

/**
 * Team/Founder section displaying the personal story behind Findo.
 * Builds trust by showing real people with authentic motivation.
 *
 * Layout:
 * - Desktop: Image on right (RTL order-2), story on left (RTL order-1)
 * - Mobile: Image first, story below
 */
export function TeamSection({ className }: TeamSectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24",
        // Subtle background to differentiate from other sections
        "bg-muted/30",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {SECTION.title}
          </h2>
          <p className="text-muted-foreground text-lg">{SECTION.subtitle}</p>
        </ScrollReveal>

        {/* Grid layout - RTL-native like Hero */}
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2",
            "gap-8 lg:gap-16",
            "items-center",
            "max-w-5xl mx-auto"
          )}
        >
          {/* Story content - order-2 on mobile, order-1 on desktop (right side in RTL) */}
          <ScrollReveal className="order-2 lg:order-1">
            <div className="relative">
              {/* Large quotation mark decoration */}
              <span
                className="absolute -top-8 -right-4 text-8xl text-primary/10 font-serif leading-none select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>

              {/* Story text */}
              <blockquote className="relative z-10">
                <p className="text-lg md:text-xl leading-relaxed text-foreground/90 whitespace-pre-line">
                  {FOUNDER.story}
                </p>

                {/* Mission statement */}
                <p className="mt-6 text-xl md:text-2xl font-semibold text-primary">
                  המשימה שלנו: {FOUNDER.mission}
                </p>

                {/* Signature-style attribution */}
                <footer className="mt-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <div className="text-end">
                    <p className="font-semibold text-lg">{FOUNDER.name}</p>
                    <p className="text-muted-foreground">{FOUNDER.role}</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </ScrollReveal>

          {/* Founder photo - order-1 on mobile (above), order-2 on desktop (left side in RTL) */}
          <ScrollReveal
            className="order-1 lg:order-2 flex justify-center"
            delay={0.1}
          >
            <div className="relative">
              {/* Photo with rounded styling and shadow */}
              <div
                className={cn(
                  "relative w-48 h-48 md:w-64 md:h-64",
                  "rounded-full overflow-hidden",
                  "shadow-xl",
                  "ring-4 ring-background",
                  // Subtle gradient ring effect
                  "before:absolute before:inset-0 before:rounded-full before:ring-2 before:ring-primary/20"
                )}
              >
                <Image
                  src={FOUNDER.photo}
                  alt={`${FOUNDER.name}, ${FOUNDER.role}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>

              {/* Decorative element behind photo */}
              <div
                className={cn(
                  "absolute -z-10",
                  "top-4 -right-4",
                  "w-48 h-48 md:w-64 md:h-64",
                  "rounded-full",
                  "bg-primary/10"
                )}
                aria-hidden="true"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
