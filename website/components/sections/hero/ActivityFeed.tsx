"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { gsap } from "@/lib/gsapConfig";
import { ActivityCard, type ActivityType } from "./ActivityCard";
import { cn } from "@/lib/utils";

interface Activity {
  type: ActivityType;
  title: string;
  subtitle: string;
}

// Activity data demonstrating Findo's automated actions (Hebrew)
const activities: Activity[] = [
  {
    type: "review",
    title: "ביקורת חדשה נענתה",
    subtitle: "לקוח: יוסי כהן - 5 כוכבים",
  },
  {
    type: "post",
    title: "תמונה פורסמה",
    subtitle: "עודכן גלריית עסק",
  },
  {
    type: "lead",
    title: "ליד חדש נלכד",
    subtitle: "וואטסאפ: 054-XXX-XXXX",
  },
  {
    type: "call",
    title: "שיחה שלא נענתה",
    subtitle: "נשלח מסר אוטומטי",
  },
  {
    type: "review",
    title: "תגובה נשלחה",
    subtitle: "לקוח: מיכל לוי",
  },
];

interface ActivityFeedProps {
  className?: string;
}

/**
 * Animated activity feed showing Findo's automated actions.
 * Uses GSAP timeline with bouncy spring easing for playful personality.
 * Animation loops continuously every 8-12 seconds (Phase 23).
 *
 * Synchronization (Phase 25):
 * - Waits for 'hero-entrance-complete' event before starting animation
 * - Event dispatched by useHeroEntrance hook at 1000ms mark
 * - Fallback timeout (2000ms) ensures animation starts even if event missed
 */
export function ActivityFeed({ className }: ActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroEntranceComplete, setHeroEntranceComplete] = useState(false);

  // Listen for hero-entrance-complete event to synchronize animation
  useEffect(() => {
    const handleHeroComplete = () => {
      setHeroEntranceComplete(true);
    };

    window.addEventListener("hero-entrance-complete", handleHeroComplete);

    // Fallback: if event doesn't fire within 2000ms, start anyway
    // This handles edge cases like component mounting after hero is already complete
    const fallbackTimeout = setTimeout(() => {
      setHeroEntranceComplete(true);
    }, 2000);

    return () => {
      window.removeEventListener("hero-entrance-complete", handleHeroComplete);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // Remove will-change after animation completes (performance optimization)
  const removeWillChange = useCallback(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".activity-card");
      cards.forEach((card) => {
        (card as HTMLElement).style.willChange = "auto";
      });
    }
  }, []);

  /**
   * GSAP animation triggered by hero-entrance-complete event (Phase 25)
   * - Waits for hero entrance choreography to complete
   * - Starts animation within 50ms of event firing
   * - Removes will-change after completion (memory cleanup)
   * - Uses contain-layout to prevent CLS
   */
  useEffect(() => {
    if (!heroEntranceComplete) return;

    const startAnimation = () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll(".activity-card");
      if (cards.length === 0) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "back.out(1.7)", // Bouncy spring per CONTEXT.md
          duration: 0.5,
        },
        repeat: -1, // Infinite loop (Phase 23)
        repeatDelay: 1.5, // Pause between cycles
        onRepeat: removeWillChange, // Clean up will-change after first cycle
      });

      // Phase 1: Animate IN (staggered entrance) ~2s total for 5 cards
      tl.fromTo(
        cards,
        {
          y: 40,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.4,
        }
      );

      // Phase 2: HOLD for reading (4s pause)
      tl.to({}, { duration: 4 });

      // Phase 3: Animate OUT (faster exit) ~0.75s
      tl.to(cards, {
        y: -30,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.in",
      });
    };

    // Small delay to ensure DOM is ready after state change
    const timeoutId = setTimeout(startAnimation, 50);
    return () => clearTimeout(timeoutId);
  }, [heroEntranceComplete, removeWillChange]);

  return (
    <div
      ref={containerRef}
      className={cn(
        // Layout - fill available space and distribute cards
        "flex flex-col gap-2 h-full justify-center",
        // Minimal padding to maximize screen usage
        "p-1",
        // Contain layout to prevent CLS (Phase 19)
        "contain-layout",
        className
      )}
    >
      {activities.map((activity, index) => (
        <ActivityCard
          key={index}
          type={activity.type}
          title={activity.title}
          subtitle={activity.subtitle}
          // Initial state: invisible (GSAP animates in)
          // will-change-transform hints GPU acceleration, removed after animation
          className="opacity-0 will-change-transform"
        />
      ))}
    </div>
  );
}
