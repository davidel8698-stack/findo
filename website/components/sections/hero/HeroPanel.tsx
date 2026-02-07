"use client";

import { cn } from "@/lib/utils";

/**
 * Placeholder for Autopilot Hero Visualization (Phase 32)
 *
 * Will contain 3 overlapping glass panels showing:
 * - Panel 1 (Front-Right): Reviews Manager with 4.8★ rating
 * - Panel 2 (Middle): Leads CRM dashboard
 * - Panel 3 (Back-Left): Activity Dashboard
 *
 * See: .planning/phases/32-autopilot-hero-visualization/32-CONTEXT.md
 */
export function HeroPanel() {
  return (
    <div
      className={cn(
        "relative w-full",
        // Placeholder height - will be replaced with actual panels
        "h-[300px] md:h-[400px] lg:h-[500px]",
        // Visual placeholder styling
        "rounded-2xl",
        "bg-surface/50",
        "border border-white/5",
        // Center content
        "flex items-center justify-center"
      )}
    >
      <div className="text-center text-secondary/50">
        <p className="text-sm">Autopilot Dashboard Visualization</p>
        <p className="text-xs mt-1">(Phase 32 - Coming Soon)</p>
      </div>
    </div>
  );
}
