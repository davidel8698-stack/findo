import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

/**
 * Comparison row data structure
 * Boolean values render as Check/X icons
 * String values render as text
 */
interface ComparisonRow {
  feature: string;
  diy: string | boolean;
  agency: string | boolean;
  findo: string | boolean;
}

/**
 * Comparison data per CONTEXT.md:
 * - DIY: Free but costs your time
 * - Agency: Expensive with commitment
 * - Findo: Sweet spot - affordable, no commitment, 24/7
 */
const comparisonData: ComparisonRow[] = [
  { feature: "עלות חודשית", diy: "0 ₪ (הזמן שלך)", agency: "3,000-10,000 ₪", findo: "350 ₪" },
  { feature: "עלות הקמה", diy: "0 ₪ (הזמן שלך)", agency: "2,000-5,000 ₪", findo: "500 ₪" },
  { feature: "זמן הקמה", diy: "לא מוגבל", agency: "2-4 שבועות", findo: "2 דקות" },
  { feature: "מענה 24/7 לשיחות", diy: false, agency: false, findo: true },
  { feature: "איסוף ביקורות אוטומטי", diy: false, agency: true, findo: true },
  { feature: "לכידת לידים מפספוסים", diy: false, agency: true, findo: true },
  { feature: "ניהול Google Business", diy: false, agency: true, findo: true },
  { feature: "ללא התחייבות", diy: true, agency: false, findo: true },
];

/**
 * CellValue helper component
 * Renders boolean values as Check/X icons
 * Renders string values as text
 */
function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground mx-auto" />
    );
  }
  return <span>{value}</span>;
}

export interface PricingComparisonProps {
  className?: string;
}

/**
 * PricingComparison - Three-column comparison table
 *
 * Compares DIY | Marketing Agency | Findo
 * Findo column highlighted as recommended choice
 *
 * Per CONTEXT.md: Position Findo as the "sweet spot"
 * between painful DIY and expensive agency
 */
export function PricingComparison({ className }: PricingComparisonProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr>
            {/* Empty header for feature column */}
            <th className="text-start p-4" />
            {/* DIY column */}
            <th className="text-center p-4 font-medium text-muted-foreground">
              עושה בעצמך
            </th>
            {/* Agency column */}
            <th className="text-center p-4 font-medium text-muted-foreground">
              סוכנות שיווק
            </th>
            {/* Findo column - highlighted */}
            <th className="text-center p-4 bg-primary/5 rounded-t-lg">
              <span className="font-bold text-foreground">Findo</span>
              <span className="block text-xs text-primary mt-0.5">מומלץ</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {comparisonData.map((row, index) => (
            <tr key={index}>
              {/* Feature name */}
              <td className="text-start p-4 font-medium">{row.feature}</td>
              {/* DIY value */}
              <td className="text-center p-4">
                <CellValue value={row.diy} />
              </td>
              {/* Agency value */}
              <td className="text-center p-4">
                <CellValue value={row.agency} />
              </td>
              {/* Findo value - highlighted column */}
              <td
                className={cn(
                  "text-center p-4 bg-primary/5",
                  index === comparisonData.length - 1 && "rounded-b-lg"
                )}
              >
                <CellValue value={row.findo} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
