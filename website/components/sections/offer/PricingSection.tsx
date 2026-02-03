"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { PricingComparison } from "./PricingComparison";
import { cn } from "@/lib/utils";

export interface PricingSectionProps {
  className?: string;
}

/**
 * PricingSection - Complete pricing section with comparison and CTA
 *
 * Combines:
 * - Three-column comparison table (PricingComparison)
 * - Clear price display (350/month + 500 setup)
 * - CTA with trust reassurance
 *
 * Per CONTEXT.md: Full transparency on pricing, position Findo as sweet spot
 *
 * OFFER-01: "ללא כרטיס אשראי" must appear near CTA
 */
export function PricingSection({ className }: PricingSectionProps) {
  return (
    <section
      className={cn("py-16 md:py-24", className)}
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2
            id="pricing-heading"
            className={cn(
              "text-3xl md:text-4xl",
              "font-bold",
              "text-center mb-2",
              "text-gradient-brand",
              "text-shadow-[0_0_15px_rgba(249,115,22,0.35)]"
            )}
          >
            השוואה מהירה
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            ראו למה עסקים בוחרים ב-Findo
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <PricingComparison className="mb-12" />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="text-center">
            {/* Price display */}
            <div className="mb-4">
              <span className="text-4xl md:text-5xl font-bold">350</span>
              <span className="text-xl md:text-2xl"> ₪/חודש</span>
            </div>
            <p className="text-zinc-400 mb-6">+ 500 ₪ הקמה חד פעמית</p>

            {/* CTA Button */}
            <Button size="lg">
              <ArrowLeft className="me-2 h-4 w-4" />
              התחילו ניסיון חינם
            </Button>

            {/* Trust reassurance - CRITICAL OFFER-01 */}
            <p className="text-sm text-zinc-400 mt-4">
              ללא כרטיס אשראי • ביטול בכל עת
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
