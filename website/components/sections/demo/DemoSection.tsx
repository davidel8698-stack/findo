"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { LottieDemo } from "./LottieDemo";
import { InteractiveDemo } from "./InteractiveDemo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, MousePointer } from "lucide-react";

interface DemoSectionProps {
  className?: string;
  /** URL to fetch Lottie animation from (configured per environment) */
  animationUrl?: string;
  /** Storylane demo ID (from embed URL) */
  interactiveDemoId?: string;
}

// Default to env values - real URLs configured in page or env
const DEFAULT_ANIMATION_URL = process.env.NEXT_PUBLIC_DEMO_ANIMATION_URL;
const DEFAULT_STORYLANE_ID = process.env.NEXT_PUBLIC_STORYLANE_DEMO_ID || "PLACEHOLDER_DEMO_ID";

type DemoTab = "video" | "interactive";

export function DemoSection({
  className,
  animationUrl = DEFAULT_ANIMATION_URL,
  interactiveDemoId = DEFAULT_STORYLANE_ID,
}: DemoSectionProps) {
  const [activeTab, setActiveTab] = useState<DemoTab>("video");

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        {/* Section headline */}
        <ScrollReveal className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            איך זה עובד? 90 שניות וזהו.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            שיחה לא נענית → פינדו שולח ווטסאפ → לקוח מגיב → אתם מקבלים ליד חם
          </p>
        </ScrollReveal>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={activeTab === "video" ? "default" : "outline"}
            onClick={() => setActiveTab("video")}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            צפה בסרטון
          </Button>
          <Button
            variant={activeTab === "interactive" ? "default" : "outline"}
            onClick={() => setActiveTab("interactive")}
            className="gap-2"
          >
            <MousePointer className="w-4 h-4" />
            נסה בעצמך
          </Button>
        </div>

        {/* Demo players - conditionally render based on active tab */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "video" ? (
            <LottieDemo
              animationUrl={animationUrl}
              poster="/images/demo-poster.svg"
              className="shadow-2xl"
            />
          ) : (
            <InteractiveDemo
              demoId={interactiveDemoId}
              poster="/images/interactive-demo-poster.svg"
              className="shadow-2xl"
            />
          )}
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
