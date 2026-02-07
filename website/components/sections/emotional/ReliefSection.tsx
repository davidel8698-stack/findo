"use client";

import { m } from "motion/react";
import { TrendingUp, Clock, Wallet } from "lucide-react";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { fadeInUp } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/**
 * Success stat data structure
 */
interface SuccessStatData {
  /** Large value/stat */
  value: string;
  /** Description label */
  label: string;
  /** Lucide icon component */
  icon: typeof TrendingUp;
}

/**
 * Success visualization data - the AFTER state
 * Shows positive outcomes of using Findo
 */
const successStats: SuccessStatData[] = [
  {
    value: "+40%",
    label: "יותר לידים",
    icon: TrendingUp,
  },
  {
    value: "24/7",
    label: "זמינות מלאה",
    icon: Clock,
  },
  {
    value: "₪0 עלות",
    label: "על שיחות שנתפסו",
    icon: Wallet,
  },
];

interface SuccessCardProps {
  data: SuccessStatData;
}

/**
 * SuccessCard - Individual success stat display
 *
 * Uses primary color scheme for positive/hopeful feel.
 * Includes hover effect for playful interaction.
 */
function SuccessCard({ data }: SuccessCardProps) {
  const Icon = data.icon;

  return (
    <m.div
      variants={fadeInUp}
      whileHover={{ scale: 1.02, y: -4 }}
      className={cn(
        "relative p-6 rounded-xl",
        // Glass effect - strong intensity for feature cards
        // Per CONTEXT.md: "Feature cards: Primary focus - strongest glass treatment"
        "glass-strong",
        "text-center",
        // Maintain hover behavior from Phase 24
        "transition-shadow hover:shadow-md"
      )}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
      </div>

      {/* Value */}
      <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
        {data.value}
      </p>

      {/* Label */}
      <p className="text-sm md:text-base text-muted-foreground">{data.label}</p>
    </m.div>
  );
}

interface ReliefSectionProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * ReliefSection - Solution/Relief section in PAS framework
 *
 * Makes visitors FEEL the relief with:
 * - Forward-looking headline about missing nothing
 * - Autonomy emphasis (Findo works, you don't)
 * - Success visualization with positive stats
 *
 * Requirements:
 * - EMOTION-02: Relief promised with "From now on, you miss nothing"
 * - EMOTION-03: Autonomy emphasized with "You don't do anything"
 * - EMOTION-04: Success visualization with stats
 */
export function ReliefSection({ className }: ReliefSectionProps) {
  return (
    <section
      className={cn(
        "py-section-feature",
        "bg-gradient-to-b from-primary/5 to-primary/10",
        className
      )}
    >
      <div className="container">
        {/* Relief messaging */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-primary">מעכשיו,</span> אתם לא מפספסים כלום
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              כל שיחה שלא נענית הופכת ללקוח פוטנציאלי
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-base md:text-lg font-medium text-foreground/80">
              <span className="text-primary font-bold">אתם לא עושים כלום.</span>{" "}
              פינדו עובד בשבילכם 24/7.
            </p>
          </ScrollReveal>
        </div>

        {/* Success visualization - stat cards */}
        <StaggerContainer
          viewport={true}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {successStats.map((stat) => (
            <SuccessCard key={stat.label} data={stat} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
