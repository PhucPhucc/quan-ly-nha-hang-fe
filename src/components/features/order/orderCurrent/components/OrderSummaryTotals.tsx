import { Ticket } from "lucide-react";
import React from "react";

import { Separator } from "@/components/ui/separator";
import { UI_TEXT } from "@/lib/UI_Text";

interface OrderSummaryTotalsProps {
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
  voucherCode?: string;
}

export const OrderSummaryTotals: React.FC<OrderSummaryTotalsProps> = ({
  subtotal,
  tax,
  total,
  discount,
  voucherCode,
}) => {
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-muted-foreground gap-2 px-1">
        <span className="text-[10px]">{UI_TEXT.ORDER.CURRENT.SUBTOTAL}</span>
        <span className="font-semibold text-xs text-foreground">
          {subtotal.toLocaleString()}
          {UI_TEXT.COMMON.CURRENCY}
        </span>
      </div>

      <div className="flex justify-between items-center text-muted-foreground gap-2 px-1">
        <span className="text-[10px]">{UI_TEXT.ORDER.CURRENT.TAX}</span>
        <span className="font-semibold text-xs text-foreground">
          {tax.toLocaleString()}
          {UI_TEXT.COMMON.CURRENCY}
        </span>
      </div>

      {voucherCode && (
        <div className="flex justify-between items-center text-primary gap-2 px-1">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-tight">
            <Ticket className="w-3.5 h-3.5" />
            <span>
              {UI_TEXT.VOUCHER.SIDEBAR_TITLE} {voucherCode}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-primary/80">
            {UI_TEXT.VOUCHER.APPLIED}
          </span>
        </div>
      )}

      {discount > 0 && (
        <div className="flex justify-between items-center text-red-500 gap-2 px-1">
          <span className="text-[10px] uppercase font-bold">{UI_TEXT.ORDER.CURRENT.DISCOUNT}</span>
          <span className="font-bold text-xs">
            {UI_TEXT.COMMON.MINUS}
            {discount.toLocaleString()}
            {UI_TEXT.COMMON.CURRENCY}
          </span>
        </div>
      )}

      <Separator />

      <div className="flex justify-between items-center mt-1 p-2 rounded-xl transition-all">
        <div className="flex justify-between w-full text-xl">
          <span className="font-black text-primary/80 leading-none mb-0.5">
            {UI_TEXT.ORDER.CURRENT.TOTAL_AMOUNT}
          </span>
          <span className="font-black text-primary leading-none tracking-tighter">
            {total.toLocaleString()}
            {UI_TEXT.COMMON.CURRENCY}
          </span>
        </div>
      </div>
    </div>
  );
};
