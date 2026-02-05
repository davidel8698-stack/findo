"use client";

import { useState, useEffect } from "react";

export type Direction = "ltr" | "rtl";

/**
 * useDirection - Detects document direction for RTL-aware animations
 *
 * Used by slide animations to calculate correct x-offset:
 * - In LTR: "from start" = from left (-x), "from end" = from right (+x)
 * - In RTL: "from start" = from right (+x), "from end" = from left (-x)
 */
export function useDirection(): Direction {
  const [direction, setDirection] = useState<Direction>("rtl"); // Default RTL for Hebrew

  useEffect(() => {
    const dir = document.documentElement.dir as Direction;
    setDirection(dir === "ltr" ? "ltr" : "rtl");

    // Optional: observe direction changes (rare but possible)
    const observer = new MutationObserver(() => {
      const newDir = document.documentElement.dir as Direction;
      setDirection(newDir === "ltr" ? "ltr" : "rtl");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  return direction;
}

/**
 * Helper to calculate slide X offset based on direction
 * @param direction - 'start' (natural start) or 'end' (natural end)
 * @param magnitude - pixel offset (default 50)
 * @param isRTL - whether document is RTL
 */
export function getSlideX(
  direction: "start" | "end",
  magnitude: number = 50,
  isRTL: boolean = true
): number {
  if (direction === "end") {
    // "from end" = from right in LTR, from left in RTL
    return isRTL ? -magnitude : magnitude;
  } else {
    // "from start" = from left in LTR, from right in RTL
    return isRTL ? magnitude : -magnitude;
  }
}
