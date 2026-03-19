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
        "inline-flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm",
        mobile ? "w-full sm:w-auto" : "min-w-[150px]",
        className
      )}
    >
      <div className="flex flex-col">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
          {OPENING_STOCK.TOTAL_VALUE}
        </p>
        <p className="text-sm font-semibold text-slate-900">{formatCurrency(totalValue)}</p>
      </div>
    </div>
  );
}
