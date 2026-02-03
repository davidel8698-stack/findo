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

interface StaticMetricProps {
  /** Static value like "24/7" */
  value: string;
  /** Hebrew label below the value */
  label: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * StaticMetric - Fade-in display for non-numeric metrics
 *
 * Used for values like "24/7" that cannot be animated with counting.
 * Uses ScrollReveal for fade-in animation when scrolled into view.
 */
function StaticMetric({ value, label, className }: StaticMetricProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-4xl md:text-5xl font-bold text-primary">
          {value}
        </span>
      </div>
      <p className="text-sm md:text-base text-muted-foreground mt-2">{label}</p>
    </div>
  );
}

/**
 * Metric type - either animated (numeric) or static (string)
 */
type Metric =
  | {
      type: "animated";
      target: number;
      suffix: string;
      label: string;
    }
  | {
      type: "static";
      value: string;
      label: string;
    };

/**
 * Metrics data for social proof counters
 * Values sourced from PROOF-06 requirements
 */
const metrics: Metric[] = [
  {
    type: "animated",
    target: 573,
    suffix: "+",
    label: "לקוחות פעילים",
  },
  {
    type: "animated",
    target: 12400,
    suffix: "+",
    label: "ביקורות שנאספו",
  },
  {
    type: "animated",
    target: 8500,
    suffix: "+",
    label: "לידים חדשים",
  },
  {
    type: "static",
    value: "24/7",
    label: "זמינות מלאה",
  },
];

interface SocialProofCountersProps {
  /** Additional CSS classes for the section */
  className?: string;
}

/**
 * SocialProofCounters - Section displaying key business metrics
 *
 * Shows animated counters for customers, reviews, and leads,
 * plus static 24/7 availability metric.
 * Requirements:
 * - PROOF-06: Display impressive metrics to build credibility
 *
 * Note: This component does NOT include section/container wrappers.
 * Parent page.tsx provides the section and container wrapper for proper centering.
 */
export function SocialProofCounters({ className }: SocialProofCountersProps) {
  return (
    <div className={cn("w-full", className)}>
      <ScrollReveal>
        <h2
          id="social-proof-heading"
          className="text-2xl md:text-3xl font-bold text-center mb-12"
        >
          המספרים מדברים בעד עצמם
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
        {metrics.map((metric, index) => (
          <ScrollReveal key={metric.label} delay={index * 0.1}>
            {metric.type === "animated" ? (
              <AnimatedCounter
                target={metric.target}
                suffix={metric.suffix}
                label={metric.label}
              />
            ) : (
              <StaticMetric value={metric.value} label={metric.label} />
            )}
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
