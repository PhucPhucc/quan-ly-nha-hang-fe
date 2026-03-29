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
        "inline-flex items-center justify-between ",
        mobile ? "w-full sm:w-auto" : "min-w-40",
        className
      )}
    >
      <div className="flex items-center gap-2 py-1 text-xs">
        <p className="tracking-wide text-muted-foreground">
          {OPENING_STOCK.TOTAL_VALUE}
          {UI_TEXT.COMMON.COLON}
        </p>
        <p className="font-semibold text-foreground">{formatCurrency(totalValue)}</p>
      </div>
    </div>
  );
}
