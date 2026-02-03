import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/atoms";
import { type LucideIcon } from "lucide-react";

interface CTAGroupProps {
  primaryText: string;
  primaryHref?: string;
  primaryIcon?: LucideIcon;
  primaryLoading?: boolean;
  /** Glow effect for primary button - defaults to "cta" (pulse) */
  primaryGlow?: "cta" | "cta-static" | "hover" | "none";
  secondaryText?: string;
  secondaryHref?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
  /** Stack vertically on mobile */
  stackOnMobile?: boolean;
}

export function CTAGroup({
  primaryText,
  primaryHref,
  primaryIcon,
  primaryLoading = false,
  primaryGlow = "cta",
  secondaryText,
  secondaryHref,
  onPrimaryClick,
  onSecondaryClick,
  className,
  stackOnMobile = true,
}: CTAGroupProps) {
  return (
    <div
      className={cn(
        "flex gap-4",
        stackOnMobile ? "flex-col sm:flex-row" : "flex-row",
        className
      )}
    >
      <Button
        asChild={!!primaryHref}
        onClick={onPrimaryClick}
        loading={primaryLoading}
        size="lg"
        glow={primaryGlow}
        className="w-full sm:w-auto"
      >
        {primaryHref ? (
          <a href={primaryHref}>
            {primaryText}
            {primaryIcon && <Icon icon={primaryIcon} rtlFlip className="ms-2" />}
          </a>
        ) : (
          <>
            {primaryText}
            {primaryIcon && <Icon icon={primaryIcon} rtlFlip className="ms-2" />}
          </>
        )}
      </Button>

      {secondaryText && (
        <Button
          asChild={!!secondaryHref}
          onClick={onSecondaryClick}
          variant="outline"
          size="lg"
          glow="hover"
          className="w-full sm:w-auto"
        >
          {secondaryHref ? (
            <a href={secondaryHref}>{secondaryText}</a>
          ) : (
            secondaryText
          )}
        </Button>
      )}
    </div>
  );
}
