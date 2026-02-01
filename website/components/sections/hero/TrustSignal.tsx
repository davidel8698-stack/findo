import { cn } from "@/lib/utils";

interface TrustSignalProps {
  value: string; // e.g., "573" - specific, not rounded
  label: string; // e.g., "עסקים סומכים על Findo"
  className?: string;
}

/**
 * Subtle trust signal for above-fold social proof.
 * Uses specific numbers (not rounded) per research.
 * Visually subdued to avoid competing with primary CTA.
 */
export function TrustSignal({ value, label, className }: TrustSignalProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        "text-sm text-muted-foreground",
        className
      )}
    >
      <span className="font-bold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}
