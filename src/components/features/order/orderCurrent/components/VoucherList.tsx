"use client";

import { Loader2, Ticket } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Voucher, VoucherType } from "@/types/voucher";

const TEXT = {
  LIST_AVAILABLE: "Danh sách voucher khả dụng",
  LOADING_LIST: "Đang tải danh sách...",
  EMPTY_LIST: "Không có voucher nào khả dụng lúc này",
  MIN_ORDER_LABEL: "Đơn tối thiểu:",
  MAX_DISCOUNT_LABEL: "Giảm tối đa:",
  VALIDITY_LABEL: "Hiệu lực:",
};

interface VoucherListProps {
  isLoading: boolean;
  vouchers: Voucher[];
  onSelect: (voucher: Voucher) => void;
  disabled?: boolean;
}

const formatVoucherValue = (v: Voucher) => {
  if (v.type === VoucherType.Percent) return `-${v.value}%`;
  if (v.type === VoucherType.Fixed) return `-${v.value.toLocaleString()}đ`;
  return "Tặng món";
};

const formatCurrency = (value?: number) =>
  typeof value === "number" ? `${value.toLocaleString()}đ` : undefined;

const formatDateShort = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toLocaleDateString("vi-VN");
};

export const VoucherList = ({ isLoading, vouchers, onSelect, disabled }: VoucherListProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
        <span className="flex-1 h-px bg-muted" />
        {TEXT.LIST_AVAILABLE}
        <span className="flex-1 h-px bg-muted" />
      </h4>

      <ScrollArea className="h-56 rounded-xl border border-muted/50">
        <div className="p-1 space-y-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
              <span className="text-[10px] text-muted-foreground font-medium">
                {TEXT.LOADING_LIST}
              </span>
            </div>
          ) : vouchers.length > 0 ? (
            vouchers.map((p) => {
              const minOrder = formatCurrency(p.minOrderValue);
              const maxDiscount = formatCurrency(p.maxDiscount);
              const dateRange = `${formatDateShort(p.startDate) ?? ""} - ${formatDateShort(p.endDate) ?? ""}`;
              const usage =
                typeof p.usageLimit === "number"
                  ? `Còn ${Math.max((p.usageLimit ?? 0) - (p.usedCount ?? 0), 0)}/${p.usageLimit} lượt`
                  : undefined;

              return (
                <button
                  key={p.promotionId}
                  onClick={() => onSelect(p)}
                  disabled={disabled}
                  className="w-full group flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all text-left border border-transparent hover:border-primary/10"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="size-9 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                      <Ticket className="h-4 w-4 text-orange-600 group-hover:text-primary" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black tracking-wide group-hover:text-primary transition-colors text-foreground truncate">
                          {p.code}
                        </p>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2 shrink-0 ml-auto"
                        >
                          {formatVoucherValue(p)}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-muted-foreground/80 space-y-0.5">
                        {minOrder && (
                          <p>
                            {TEXT.MIN_ORDER_LABEL} {minOrder}
                          </p>
                        )}
                        {maxDiscount && p.type === VoucherType.Percent && (
                          <p>
                            {TEXT.MAX_DISCOUNT_LABEL} {maxDiscount}
                          </p>
                        )}
                        {usage && <p>{usage}</p>}
                        <p className="text-[9px] text-muted-foreground">
                          {TEXT.VALIDITY_LABEL} {dateRange}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-10 text-center text-[11px] text-muted-foreground font-medium italic">
              {TEXT.EMPTY_LIST}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
