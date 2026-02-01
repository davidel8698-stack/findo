"use client";

import { useState, useRef, useEffect } from "react";
import { useInView, useSpring, useTransform, m } from "motion/react";
import { SliderInput } from "@/components/ui/slider";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

/**
 * ROI calculation constants
 * Based on conversion research and average business metrics
 */
const CONVERSION_RATE = 0.15; // 15% of missed calls become leads
const AVG_DEAL_VALUE_MULTIPLIER = 0.1; // 10% of monthly revenue per lead

interface ROICalculatorProps {
  /** Additional CSS classes for the section */
  className?: string;
}

/**
 * ROICalculator - Interactive calculator showing potential value
 *
 * Allows visitors to input their business metrics and see
 * how many leads and revenue they could recover with Findo.
 *
 * Features:
 * - Two slider inputs for missed calls and monthly revenue
 * - Spring-animated results display
 * - Hebrew-friendly labels and formatting
 * - Real-time updates as sliders change
 */
export function ROICalculator({ className }: ROICalculatorProps) {
  // Slider state
  const [missedCalls, setMissedCalls] = useState([5]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([50000]);

  // Animation ref and state
  const resultsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(resultsRef, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Calculate results
  const leadsRecovered = Math.round(missedCalls[0] * 4 * CONVERSION_RATE);
  const valueRecovered = Math.round(
    leadsRecovered * monthlyRevenue[0] * AVG_DEAL_VALUE_MULTIPLIER
  );

  // Spring animations for smooth counting
  const leadsSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const valueSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Format display values with Hebrew locale
  const displayLeads = useTransform(leadsSpring, (v) =>
    Math.round(v).toLocaleString("he-IL")
  );

  const displayValue = useTransform(valueSpring, (v) =>
    Math.round(v).toLocaleString("he-IL")
  );

  // Initial animation when in view
  useEffect(() => {
    if (isInView && !hasAnimated) {
      leadsSpring.set(leadsRecovered);
      valueSpring.set(valueRecovered);
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated, leadsRecovered, valueRecovered, leadsSpring, valueSpring]);

  // Update animation when slider values change (after initial animation)
  useEffect(() => {
    if (hasAnimated) {
      leadsSpring.set(leadsRecovered);
      valueSpring.set(valueRecovered);
    }
  }, [hasAnimated, leadsRecovered, valueRecovered, leadsSpring, valueSpring]);

  return (
    <section
      className={cn("py-16 md:py-24", className)}
      aria-labelledby="roi-calculator-heading"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2
            id="roi-calculator-heading"
            className="text-2xl md:text-3xl font-bold text-center mb-8"
          >
            כמה אתה מפסיד בגלל שיחות שלא נענו?
          </h2>
        </ScrollReveal>

        <div className="max-w-xl mx-auto">
          {/* Slider inputs */}
          <div className="space-y-6 mb-8">
            <SliderInput
              label="שיחות שלא נענו בשבוע"
              value={missedCalls}
              onValueChange={setMissedCalls}
              min={1}
              max={20}
              step={1}
              formatValue={(v) => `${v} שיחות`}
            />

            <SliderInput
              label="הכנסה חודשית ממוצעת"
              value={monthlyRevenue}
              onValueChange={setMonthlyRevenue}
              min={10000}
              max={200000}
              step={5000}
              formatValue={(v) => `₪${(v / 1000).toLocaleString("he-IL")}K`}
            />
          </div>

          {/* Results display */}
          <div
            ref={resultsRef}
            className="bg-primary/5 rounded-lg p-6 text-center"
          >
            <p className="text-lg text-muted-foreground mb-4">
              בכל חודש אתה יכול לקבל
            </p>

            <div className="flex justify-center gap-8 md:gap-12">
              <div>
                <m.span className="text-3xl md:text-4xl font-bold text-primary block">
                  {displayLeads}
                </m.span>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  לידים חדשים
                </p>
              </div>

              <div className="border-s border-border" aria-hidden="true" />

              <div>
                <div className="flex items-baseline justify-center gap-1">
                  <m.span className="text-3xl md:text-4xl font-bold text-primary">
                    {displayValue}
                  </m.span>
                  <span className="text-xl md:text-2xl font-bold text-primary">
                    ₪
                  </span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  ערך פוטנציאלי
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
