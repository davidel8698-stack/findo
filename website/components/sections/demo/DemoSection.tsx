"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { LottieDemo } from "./LottieDemo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DemoSectionProps {
  className?: string;
  /** URL to fetch Lottie animation from (configured per environment) */
  animationUrl?: string;
}

// Default to placeholder - real URL configured in page or env
const DEFAULT_ANIMATION_URL = process.env.NEXT_PUBLIC_DEMO_ANIMATION_URL;

export function DemoSection({
  className,
  animationUrl = DEFAULT_ANIMATION_URL,
}: DemoSectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        {/* Section headline */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            איך זה עובד? 90 שניות וזהו.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            שיחה לא נענית → פינדו שולח ווטסאפ → לקוח מגיב → אתם מקבלים ליד חם
          </p>
        </ScrollReveal>

        {/* Demo player */}
        <div className="max-w-4xl mx-auto">
          <LottieDemo
            animationUrl={animationUrl}
            poster="/images/demo-poster.svg"
            className="shadow-2xl"
          />
        </div>

        {/* Below demo CTA (DEMO-03) */}
        <ScrollReveal className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            מרשים? התחל לאסוף לידים עוד היום
          </p>
          <Button size="lg" asChild>
            <a href="#hero-form">התחל ניסיון חינם</a>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
