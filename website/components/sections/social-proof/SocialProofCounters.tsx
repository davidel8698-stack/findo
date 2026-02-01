"use client";

import { useRef, useEffect } from "react";
import { useInView, useSpring, useTransform, m } from "motion/react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  /** Target number to count to */
  target: number;
  /** Suffix like "+" to append after number */
  suffix?: string;
  /** Hebrew label below the number */
  label: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AnimatedCounter - Spring-animated number counting
 *
 * Counts from 0 to target with spring physics when scrolled into view.
 * Numbers are formatted with Hebrew locale (he-IL).
 * Animation triggers only once per page load.
 */
function AnimatedCounter({
  target,
  suffix = "",
  label,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const display = useTransform(springValue, (v) =>
    Math.round(v).toLocaleString("he-IL")
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(target);
    }
  }, [isInView, target, springValue]);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div className="flex items-baseline justify-center gap-1">
        <m.span className="text-4xl md:text-5xl font-bold text-primary">
          {display}
        </m.span>
        {suffix && (
          <span className="text-2xl md:text-3xl font-bold text-primary">
            {suffix}
          </span>
        )}
      </div>
      <p className="text-sm md:text-base text-muted-foreground mt-2">{label}</p>
    </div>
  );
}

/**
 * Metrics data for social proof counters
 * Values sourced from PROOF-06 requirements
 */
const metrics = [
  {
    target: 573,
    suffix: "+",
    label: "לקוחות פעילים",
  },
  {
    target: 12400,
    suffix: "+",
    label: "ביקורות שנאספו",
  },
  {
    target: 8500,
    suffix: "+",
    label: "לידים חדשים",
  },
];

interface SocialProofCountersProps {
  /** Additional CSS classes for the section */
  className?: string;
}

/**
 * SocialProofCounters - Section displaying key business metrics
 *
 * Shows animated counters for customers, reviews, and leads.
 * Requirements:
 * - PROOF-06: Display impressive metrics to build credibility
 */
export function SocialProofCounters({ className }: SocialProofCountersProps) {
  return (
    <section
      className={cn("py-16 md:py-24 bg-muted/30", className)}
      aria-labelledby="social-proof-heading"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2
            id="social-proof-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            המספרים מדברים בעד עצמם
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <ScrollReveal key={metric.label} delay={index * 0.1}>
              <AnimatedCounter
                target={metric.target}
                suffix={metric.suffix}
                label={metric.label}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
