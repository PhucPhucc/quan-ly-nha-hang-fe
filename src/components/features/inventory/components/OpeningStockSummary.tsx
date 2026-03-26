import { UI_TEXT } from "@/lib/UI_Text";
import { cn, formatCurrency } from "@/lib/utils";

type Props = {
  totalValue: number;
  className?: string;
  mobile?: boolean;
};

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

export function OpeningStockSummary({ totalValue, className, mobile = false }: Props) {
  return (
    <div
      className={cn(
        "inline-flex h-12 items-center justify-between rounded-xl border border-border bg-card px-4 shadow-sm",
        mobile ? "w-full sm:w-auto" : "min-w-[160px]",
        className
      )}
    >
      <div className="flex flex-col">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {OPENING_STOCK.TOTAL_VALUE}
        </p>
        <p className="text-sm font-semibold text-foreground">{formatCurrency(totalValue)}</p>
      </div>
    </div>
  );
}
