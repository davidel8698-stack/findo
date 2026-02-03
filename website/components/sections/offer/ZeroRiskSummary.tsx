import { cn } from "@/lib/utils";
import { ShieldCheck, Clock, Star, Zap, type LucideIcon } from "lucide-react";

interface RiskEliminator {
  icon: LucideIcon;
  text: string;
}

/**
 * Four risk eliminators per CONTEXT.md and RESEARCH.md:
 * 1. Full refund within 30 days
 * 2. 60-second response or 250 NIS
 * 3. 10 reviews guaranteed or refund
 * 4. 2-minute setup, no credit card
 */
const riskEliminators: RiskEliminator[] = [
  { icon: ShieldCheck, text: "החזר כספי מלא תוך 30 יום" },
  { icon: Clock, text: "מענה תוך 60 שניות או 250 ₪" },
  { icon: Star, text: "10 ביקורות מובטחות או החזר" },
  { icon: Zap, text: "התקנה ב-2 דקות, בלי כרטיס אשראי" },
];

export interface ZeroRiskSummaryProps {
  className?: string;
}

/**
 * Visual summary of all risk eliminators in a 2x2 grid.
 *
 * Displays the four key reasons why starting with Findo is zero risk:
 * - Money-back guarantee
 * - Response time compensation
 * - Review guarantee
 * - Frictionless setup
 *
 * Per CONTEXT.md: "Risk elimination so complete that saying no requires effort"
 */
export function ZeroRiskSummary({ className }: ZeroRiskSummaryProps) {
  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-6 md:p-8",
        "shadow-sm",
        "w-full max-w-lg mx-auto",
        className
      )}
    >
      <h3 className="text-center font-bold text-xl mb-6">
        אפס סיכון להתחיל
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {riskEliminators.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
