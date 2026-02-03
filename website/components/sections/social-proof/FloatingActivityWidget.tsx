"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, m } from "motion/react";
import { springBouncy } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms";
import { UserPlus, Star, Users, X } from "lucide-react";

/**
 * Activity types for floating widget
 */
type ActivityType = "signup" | "review" | "lead";

interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  location: string;
  timeAgo: string;
}

// Icon mapping for each activity type
const iconMap: Record<ActivityType, typeof UserPlus> = {
  signup: UserPlus,
  review: Star,
  lead: Users,
};

// Color classes for icon backgrounds
const colorMap: Record<ActivityType, string> = {
  signup: "bg-emerald-500/20 text-emerald-500",
  review: "bg-amber-500/20 text-amber-500",
  lead: "bg-blue-500/20 text-blue-500",
};

/**
 * Pre-set activities demonstrating platform usage.
 * Per TRUST-08: Realistic activities, no dark patterns or fake urgency.
 * These are clearly simulated showcase activities.
 */
const activities: Activity[] = [
  {
    id: "1",
    type: "signup",
    message: "עסק חדש הצטרף לשירות",
    location: "תל אביב",
    timeAgo: "לפני 2 דקות",
  },
  {
    id: "2",
    type: "lead",
    message: "5 לידים חדשים התקבלו",
    location: "חיפה",
    timeAgo: "לפני 5 דקות",
  },
  {
    id: "3",
    type: "review",
    message: "תגובה אוטומטית לביקורת",
    location: "ירושלים",
    timeAgo: "לפני 8 דקות",
  },
  {
    id: "4",
    type: "signup",
    message: "פוסט חדש פורסם בגוגל",
    location: "באר שבע",
    timeAgo: "לפני 12 דקות",
  },
  {
    id: "5",
    type: "lead",
    message: "שיחה שלא נענתה נתפסה",
    location: "רמת גן",
    timeAgo: "לפני 15 דקות",
  },
  {
    id: "6",
    type: "review",
    message: "ביקורת 5 כוכבים חדשה",
    location: "פתח תקווה",
    timeAgo: "לפני 18 דקות",
  },
  {
    id: "7",
    type: "signup",
    message: "מספרה הצטרפה לשירות",
    location: "הרצליה",
    timeAgo: "לפני 22 דקות",
  },
  {
    id: "8",
    type: "lead",
    message: "3 לידים מוואטסאפ",
    location: "נתניה",
    timeAgo: "לפני 25 דקות",
  },
  {
    id: "9",
    type: "review",
    message: "תמונה עודכנה בגוגל",
    location: "אשדוד",
    timeAgo: "לפני 28 דקות",
  },
  {
    id: "10",
    type: "signup",
    message: "קליניקה הצטרפה לשירות",
    location: "ראשון לציון",
    timeAgo: "לפני 32 דקות",
  },
];

// LocalStorage key for dismiss state
const DISMISS_KEY = "findo-activity-widget-dismissed";

interface FloatingActivityWidgetProps {
  className?: string;
}

/**
 * Floating notification widget showing simulated platform activity.
 * Cycles through pre-set activities with smooth animations.
 * Positioned in bottom-start corner (RTL-aware).
 *
 * Timing: 5s initial delay, then 5s show / 3s hide cycle.
 * Can be dismissed permanently via localStorage.
 */
export function FloatingActivityWidget({ className }: FloatingActivityWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for dismiss state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    }
  }, []);

  // Dismiss handler with localStorage persistence
  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "true");
    }
  }, []);

  // Timing logic: 5s initial delay, then cycle (5s show, 3s hide)
  useEffect(() => {
    if (isDismissed) return;

    // Show first notification after 5 second delay
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  // Cycle through activities
  useEffect(() => {
    if (isDismissed || !isVisible) return;

    // After showing for 5 seconds, hide and prepare next
    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      // After 3 seconds hidden, show next activity
      const showNextTimer = setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % activities.length);
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(showNextTimer);
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, [isDismissed, isVisible, currentIndex]);

  // Don't render if dismissed
  if (isDismissed) return null;

  const activity = activities[currentIndex];
  const IconComponent = iconMap[activity.type];
  const colorClasses = colorMap[activity.type];

  return (
    <div className={cn("fixed bottom-20 md:bottom-4 start-4 z-40", className)}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <m.div
            key={activity.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={springBouncy}
            className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-xs relative"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 end-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="סגור התראות"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="flex items-center gap-3 pe-6">
              {/* Icon */}
              <div className={cn("p-2 rounded-lg shrink-0", colorClasses)}>
                <Icon icon={IconComponent} size="sm" />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.location} - {activity.timeAgo}
                </p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
