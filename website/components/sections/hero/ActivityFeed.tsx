"use client";

import { useRef, useCallback } from "react";
import { gsap, useGSAP } from "@/lib/gsapConfig";
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

  // GSAP animation - plays once on mount, removes will-change after completion
  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: {
          ease: "back.out(1.7)", // Bouncy spring per CONTEXT.md
          duration: 0.5,
        },
        onComplete: removeWillChange, // Clean up will-change after animation
      });

      tl.from(".activity-card", {
        y: 40,
        opacity: 0,
        scale: 0.9,
        stagger: {
          each: 0.3,
          from: "start",
        },
      });

      // Animation plays once, holds final state (no repeat)
    },
    { scope: containerRef, dependencies: [removeWillChange] }
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        // Layout
        "flex flex-col gap-3",
        // Padding within phone screen
        "p-2",
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
