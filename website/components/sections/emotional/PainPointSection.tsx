"use client";

import { m } from "motion/react";
import { Phone, Clock, TrendingDown } from "lucide-react";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { fadeInUp } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/**
 * Pain card data structure
 */
interface PainCardData {
  /** Large stat or number */
  stat: string;
  /** Description of the pain point */
  description: string;
  /** Lucide icon component */
  icon: typeof Phone;
}

/**
 * Pain point data following PAS framework
 * - Data-driven stats that shock
 * - Vivid scenarios they recognize
 * - Lost money focus
 */
const painPoints: PainCardData[] = [
  {
    stat: "23%",
    description: "מהשיחות הנכנסות לא נענות",
    icon: Phone,
  },
  {
    stat: "8 בערב",
    description: "הלקוח התקשר כשסגרתם - ופנה למתחרה",
    icon: Clock,
  },
  {
    stat: "₪0",
    description: "ההכנסה משיחות שפספסתם",
    icon: TrendingDown,
  },
];

interface PainCardProps {
  data: PainCardData;
}

/**
 * PainCard - Individual pain point display with icon
 *
 * Uses destructive color scheme to evoke urgency.
 * RTL-compatible with logical properties.
 */
function PainCard({ data }: PainCardProps) {
  const Icon = data.icon;

  return (
    <m.div
      variants={fadeInUp}
      className={cn(
        "relative p-6 rounded-xl",
        "bg-destructive/10 border border-destructive/20",
        "text-center"
      )}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-destructive/20">
          <Icon className="h-6 w-6 text-destructive" aria-hidden="true" />
        </div>
      </div>

      {/* Stat */}
      <p className="text-3xl md:text-4xl font-bold text-destructive mb-2">
        {data.stat}
      </p>

      {/* Description */}
      <p className="text-sm md:text-base text-muted-foreground">
        {data.description}
      </p>
    </m.div>
  );
}

interface PainPointSectionProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * PainPointSection - Problem section in PAS framework
 *
 * Makes visitors FEEL the problem with:
 * - Shocking headline about lost customers
 * - Three pain cards with staggered reveal
 * - Mix of data-driven stats and vivid scenarios
 *
 * Requirements:
 * - EMOTION-01: Pain point acknowledged with data + scenario + lost revenue
 */
export function PainPointSection({ className }: PainPointSectionProps) {
  return (
    <section className={cn("py-section-feature bg-muted/30", className)}>
      <div className="container">
        {/* Main headline */}
        <ScrollReveal className="mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-start">
            <span className="text-destructive">כל שיחה שלא נענית</span>
            <span className="block mt-2">= לקוח שהלך למתחרה</span>
          </h2>
        </ScrollReveal>

        {/* Pain cards grid with staggered animation */}
        <StaggerContainer
          viewport={true}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {painPoints.map((pain) => (
            <PainCard key={pain.stat} data={pain} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
