import { cn } from "@/lib/utils";
import { ShieldCheck, Clock, Star, Zap, type LucideIcon } from "lucide-react";

interface RiskEliminator {
  icon: LucideIcon;
  text: string;
}

/**
 * Four risk eliminators per CONTEXT.md and RESEARCH.md:
 * 1. Full refund within 14 days
 * 2. 60-second response or 250 NIS
 * 3. 10 reviews guaranteed or refund
 * 4. 2-minute setup, no credit card
 */
const riskEliminators: RiskEliminator[] = [
  { icon: ShieldCheck, text: "החזר כספי מלא תוך 14 יום" },
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
        "bg-card border rounded-xl p-6",
        className
      )}
    >
      <h3 className="text-center font-bold text-lg mb-4">
        אפס סיכון להתחיל
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {riskEliminators.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-2">
              <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
