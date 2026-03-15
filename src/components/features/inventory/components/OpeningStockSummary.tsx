import { UI_TEXT } from "@/lib/UI_Text";
import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  totalValue: number;
  className?: string;
  mobile?: boolean;
};

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

export function OpeningStockSummary({ totalValue, className, mobile = false }: Props) {
  if (mobile) {
    return (
      <div
        className={cn(
          "bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border p-4 sm:hidden",
          className
        )}
      >
        <div>
          <p className="text-xs text-muted-foreground">{OPENING_STOCK.TOTAL_VALUE}</p>
          <p className="font-bold text-primary">{formatCurrency(totalValue)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("hidden text-right sm:block", className)}>
      <p className="text-sm text-muted-foreground">{OPENING_STOCK.TOTAL_VALUE}</p>
      <p className="font-semibold text-primary">{formatCurrency(totalValue)}</p>
    </div>
  );
}
