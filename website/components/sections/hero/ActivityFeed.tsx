"use client";

import { useRef, useCallback, useEffect } from "react";
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
 * Animation plays once on mount and holds final state (no loop).
 */
export function ActivityFeed({ className }: ActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
   * GSAP animation with requestIdleCallback wrapper (Phase 19)
   * - Defers animation start until browser is idle (non-blocking LCP)
   * - Removes will-change after completion (memory cleanup)
   * - Uses contain-layout to prevent CLS
   */
  useEffect(() => {
    const startAnimation = () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll(".activity-card");
      if (cards.length === 0) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "back.out(1.7)", // Bouncy spring per CONTEXT.md
          duration: 0.5,
        },
        onComplete: removeWillChange, // Clean up will-change after animation
      });

      tl.fromTo(
        cards,
        {
          // FROM values (start state)
          y: 40,
          opacity: 0,
          scale: 0.9,
        },
        {
          // TO values (end state)
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: {
            each: 0.3,
            from: "start",
          },
        }
      );
    };

    // Use requestIdleCallback to defer animation until browser idle
    // This ensures LCP (hero headline) is not blocked by animation setup
    if ("requestIdleCallback" in window) {
      const idleCallbackId = window.requestIdleCallback(startAnimation, {
        timeout: 1000, // Max wait 1 second
      });
      return () => window.cancelIdleCallback(idleCallbackId);
    } else {
      // Fallback for Safari (no requestIdleCallback support)
      const timeoutId = setTimeout(startAnimation, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [removeWillChange]);

  return (
    <div
      ref={containerRef}
      className={cn(
        // Layout
        "flex flex-col gap-3",
        // Padding within phone screen
        "p-2",
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
