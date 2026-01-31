import { cn } from "@/lib/utils";
import { type LucideIcon, type LucideProps } from "lucide-react";

// Standard icon sizes - all at least 24px for touch accessibility
export const iconSizes = {
  sm: "h-4 w-4",   // 16px - inline with text only
  md: "h-5 w-5",   // 20px - default
  lg: "h-6 w-6",   // 24px - prominent
  xl: "h-8 w-8",   // 32px - hero/feature
};

interface IconProps extends Omit<LucideProps, "ref"> {
  icon: LucideIcon;
  size?: keyof typeof iconSizes;
  /** RTL-flip icons that indicate direction (arrows, chevrons) */
  rtlFlip?: boolean;
}

export function Icon({
  icon: LucideIcon,
  size = "md",
  rtlFlip = false,
  className,
  ...props
}: IconProps) {
  return (
    <LucideIcon
      className={cn(
        iconSizes[size],
        rtlFlip && "rtl:rotate-180",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
