"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal, SectionRevealItem } from "@/components/motion/SectionReveal";
import { cn } from "@/lib/utils";

interface FooterCTAProps {
  className?: string;
}

/**
 * FooterCTA - Final conversion section with tagline pattern
 *
 * Per COMP-10: Footer CTA section with clear tagline pattern
 * Structure: Tagline -> Subtext -> Primary + Ghost CTAs
 */
export function FooterCTA({ className }: FooterCTAProps) {
  return (
    <section
      className={cn(
        "py-section-cta",
        "text-center",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <SectionReveal>
          <SectionRevealItem>
            {/* Tagline - bold, memorable */}
            <h2
              className={cn(
                "text-3xl md:text-4xl lg:text-5xl",
                "font-bold",
                "mb-4",
                "text-gradient-brand",
                "text-shadow-[0_0_15px_rgba(249,115,22,0.35)]"
              )}
            >
              מוכן להפוך את העסק לאוטומטי?
            </h2>
          </SectionRevealItem>

          <SectionRevealItem>
            {/* Subtext */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              הצטרף ל-573+ עסקים שכבר חוסכים שעות כל יום עם Findo
            </p>
          </SectionRevealItem>

          <SectionRevealItem>
            {/* CTA buttons - Primary + Ghost pairing */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="default" asChild>
                <a href="#signup">
                  התחל בחינם
                  <ArrowLeft className="ms-2 h-4 w-4" />
                </a>
              </Button>

              <Button size="lg" variant="ghost" asChild>
                <a href="#contact">
                  דבר עם הצוות
                </a>
              </Button>
            </div>
          </SectionRevealItem>

          <SectionRevealItem>
            {/* Trust reassurance */}
            <p className="text-sm text-muted-foreground mt-6">
              ללא כרטיס אשראי • ביטול בכל עת
            </p>
          </SectionRevealItem>
        </SectionReveal>
      </div>
    </section>
  );
}
