"use client";

import { useRef, useState, useCallback } from "react";
import { useInView } from "motion/react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackDemoView, trackDemoComplete } from "@/lib/posthog/events";

type DemoState = "poster" | "loading" | "playing" | "completed";

interface LottieDemoProps {
  /** URL to fetch Lottie JSON from, or inline animation data */
  animationUrl?: string;
  animationData?: object;
  poster: string;
  className?: string;
  onComplete?: () => void;
}

export function LottieDemo({
  animationUrl,
  animationData: inlineData,
  poster,
  className,
  onComplete,
}: LottieDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [state, setState] = useState<DemoState>("poster");
  const [animationData, setAnimationData] = useState<object | null>(
    inlineData || null
  );

  // Lazy load when 20% visible
  const isInView = useInView(containerRef, { amount: 0.2, once: true });

  // Fetch animation from URL when play is clicked
  const handlePlay = useCallback(async () => {
    // Track lottie demo view on play
    trackDemoView("lottie");

    if (animationData) {
      setState("playing");
      lottieRef.current?.goToAndPlay(0);
      return;
    }

    if (!animationUrl) {
      console.warn("LottieDemo: No animation URL or data provided");
      return;
    }

    setState("loading");
    try {
      const res = await fetch(animationUrl);
      const data = await res.json();
      setAnimationData(data);
      setState("playing");
    } catch (err) {
      console.error("Failed to load animation:", err);
      setState("poster");
    }
  }, [animationData, animationUrl]);

  const handleComplete = useCallback(() => {
    setState("completed");
    trackDemoComplete("lottie");
    onComplete?.();
  }, [onComplete]);

  const handleReplay = useCallback(() => {
    lottieRef.current?.goToAndPlay(0);
    setState("playing");
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10",
        className
      )}
    >
      {/* Poster state - shown until user clicks play */}
      {(state === "poster" || state === "loading") && (
        <button
          onClick={handlePlay}
          disabled={state === "loading"}
          className="absolute inset-0 w-full h-full group cursor-pointer disabled:cursor-wait"
          aria-label="Play demo"
        >
          <img
            src={poster}
            alt="Demo preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
            <div
              className={cn(
                "w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-transform",
                state === "loading" ? "animate-pulse" : "group-hover:scale-110"
              )}
            >
              <Play className="w-10 h-10 ms-1" />
            </div>
          </div>
        </button>
      )}

      {/* Lottie animation - only mount when data loaded and playing/completed */}
      {isInView &&
        animationData &&
        (state === "playing" || state === "completed") && (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={false}
            autoplay={state === "playing"}
            onComplete={handleComplete}
            className="w-full h-full"
          />
        )}

      {/* Completed state with replay + CTA */}
      {state === "completed" && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
          <Button
            onClick={handleReplay}
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-5 h-5 me-2" />
            צפה שוב
          </Button>
          <Button size="lg" asChild>
            <a href="#hero-form">התחל ניסיון חינם</a>
          </Button>
        </div>
      )}
    </div>
  );
}
