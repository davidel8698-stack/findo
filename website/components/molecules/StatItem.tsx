import { cn } from "@/lib/utils";
import { Icon } from "@/components/atoms";
import { type LucideIcon } from "lucide-react";
import { m } from "motion/react";
import { fadeInUp } from "@/components/motion/variants";

interface StatItemProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  className?: string;
  /** Highlight this stat */
  featured?: boolean;
}

export function StatItem({
  value,
  label,
  icon,
  className,
  featured = false,
}: StatItemProps) {
  return (
    <m.div
      variants={fadeInUp}
      className={cn(
        "flex flex-col items-center text-center gap-1",
        featured && "scale-110",
        className
      )}
    >
      {icon && (
        <Icon
          icon={icon}
          size="lg"
          className={cn(
            "text-muted-foreground mb-1",
            featured && "text-primary"
          )}
        />
      )}
      <span className={cn(
        "font-bold",
        featured ? "text-4xl text-primary" : "text-3xl text-foreground"
      )}>
        {value}
      </span>
      <span className="text-sm text-muted-foreground">
        {label}
      </span>
    </m.div>
  );
}
