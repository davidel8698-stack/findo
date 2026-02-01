import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms";
import { Star, Camera, MessageSquare, Phone } from "lucide-react";

export type ActivityType = "review" | "post" | "lead" | "call";

interface ActivityCardProps {
  type: ActivityType;
  title: string;
  subtitle: string;
  className?: string;
}

// Icon mapping for each activity type
const iconMap = {
  review: Star,
  post: Camera,
  lead: MessageSquare,
  call: Phone,
} as const;

// Color classes for icon backgrounds and text
const colorMap = {
  review: "bg-amber-500/20 text-amber-500",
  post: "bg-emerald-500/20 text-emerald-500",
  lead: "bg-blue-500/20 text-blue-500",
  call: "bg-purple-500/20 text-purple-500",
} as const;

/**
 * Individual activity card showing an automated action Findo has taken.
 * Used in ActivityFeed to demonstrate the product's capabilities.
 * Has "activity-card" class for GSAP animation targeting.
 */
export function ActivityCard({
  type,
  title,
  subtitle,
  className,
}: ActivityCardProps) {
  const IconComponent = iconMap[type];
  const colorClasses = colorMap[type];

  return (
    <div
      className={cn(
        // Layout
        "activity-card flex items-center gap-3",
        // Spacing and shape
        "p-3 rounded-lg",
        // Background and border
        "bg-card border border-border shadow-sm",
        className
      )}
    >
      {/* Icon wrapper with colored background */}
      <div className={cn("p-2 rounded-lg", colorClasses)}>
        <Icon icon={IconComponent} size="sm" />
      </div>

      {/* Text container */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
    </div>
  );
}
