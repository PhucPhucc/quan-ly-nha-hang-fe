import { Loader2, Ticket, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { voucherService } from "@/services/voucherService";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { Voucher, VoucherType } from "@/types/voucher";

interface VoucherApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentVoucherCode?: string;
}

const V = UI_TEXT.VOUCHER;

export const VoucherApplyModal: React.FC<VoucherApplyModalProps> = ({
  isOpen,
  onClose,
  orderId,
  currentVoucherCode,
}) => {
  const [voucherCode, setVoucherCode] = useState(currentVoucherCode || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const { updateActiveOrderDiscount } = useOrderBoardStore();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableVouchers();
    }
  }, [isOpen]);

  const fetchAvailableVouchers = async () => {
    try {
      setIsLoadingList(true);
      const res = await voucherService.getAll({ pageSize: 50, filters: ["isActive==true"] });
      if (res.isSuccess && res.data) {
        // Filter out expired ones on client side as an extra safety
        const now = new Date();
        const active = res.data.items.filter((v) => new Date(v.endDate) >= now);
        setAvailableVouchers(active);
      }
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleApply = async (codeToApply?: string) => {
    const code = codeToApply || voucherCode;
    if (!code.trim()) {
      toast.error(V.VALIDATE_CODE_REQUIRED);
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Find voucher by code to get ID
      const listRes = await voucherService.getAll({ search: code.trim() });
      const targetVoucher = listRes.data?.items.find(
        (v) => v.code.toUpperCase() === code.trim().toUpperCase()
      );

      if (!targetVoucher) {
        toast.error(V.NOT_FOUND);
        return;
      }

      // 2. Apply using code
      const res = await voucherService.apply({
        orderId,
        code: targetVoucher.code,
      });

      if (res.isSuccess && res.data) {
        toast.success(V.APPLY_SUCCESS);
        updateActiveOrderDiscount(res.data.discountAmount, res.data.newPromotionCode);
        onClose();
      } else {
        toast.error(res.message || V.APPLY_ERROR);
      }
    } catch (error: unknown) {
      console.error("Apply voucher failed:", error);
      const message = error instanceof Error ? error.message : "";

      if (message.includes("Voucher.BelowMinAmount")) {
        toast.error(V.ERROR_MIN_AMOUNT);
      } else if (message.includes("Order.VoucherAlreadyApplied")) {
        toast.error(V.ERROR_ALREADY_APPLIED);
      } else if (message.includes("Voucher.Expired")) {
        toast.error(V.STATUS_EXPIRED);
      } else {
        toast.error(message || UI_TEXT.COMMON.ERROR_UNKNOWN);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsSubmitting(true);
      const res = await voucherService.unapply({
        orderId,
      });

      if (res.isSuccess) {
        toast.success(V.REMOVE_SUCCESS);
        updateActiveOrderDiscount(0, undefined);
        setVoucherCode("");
        onClose();
      } else {
        toast.error(res.message || V.REMOVE_ERROR);
      }
    } catch (error: unknown) {
      console.error("Remove voucher failed:", error);
      const message = error instanceof Error ? error.message : "";
      toast.error(message || UI_TEXT.COMMON.ERROR_UNKNOWN);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatVoucherValue = (v: Voucher) => {
    if (v.type === VoucherType.Percent) return `-${v.value}%`;
    if (v.type === VoucherType.Fixed) return `-${v.value.toLocaleString()}đ`;
    return "Tặng món";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden rounded-2xl border-none">
        <DialogHeader className="p-6 pb-4 bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-primary">
            <Ticket className="w-5 h-5" />
            {V.APPLY_MODAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium">
            {V.APPLY_MODAL_DESC}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <div className="flex gap-2 relative">
            <div className="relative flex-1 group">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={V.APPLY_MODAL_PLACEHOLDER}
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                className="pl-9 pr-9 font-black uppercase tracking-wider h-11 border-muted-foreground/20 focus-visible:ring-primary/30 text-foreground"
                disabled={isSubmitting}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
              />
              {voucherCode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoucherCode("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => handleApply()}
              disabled={isSubmitting || !voucherCode.trim()}
              className="px-6 h-11 font-bold shadow-lg shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : V.APPLY_MODAL_APPLY}
            </Button>
          </div>

          {currentVoucherCode && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex justify-between items-center animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ticket className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                    {V.APPLY_MODAL_CURRENT}
                  </p>
                  <p className="text-sm font-black text-primary tracking-wider">
                    {currentVoucherCode}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-bold h-8 px-3 rounded-lg"
                onClick={handleRemove}
                disabled={isSubmitting}
              >
                {V.APPLY_MODAL_REMOVE}
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
              <span className="flex-1 h-px bg-muted" />
              {V.LIST_AVAILABLE}
              <span className="flex-1 h-px bg-muted" />
            </h4>

            <ScrollArea className="h-48 rounded-xl border border-muted/50">
              <div className="p-1 space-y-1">
                {isLoadingList ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {V.LOADING_LIST}
                    </span>
                  </div>
                ) : availableVouchers.length > 0 ? (
                  availableVouchers.map(
                    (
                      p // Changed v to p
                    ) => (
                      <button
                        key={p.promotionId} // Changed v.voucherId to p.promotionId
                        onClick={() => {
                          setVoucherCode(p.code); // Changed v.voucherCode to p.code
                          handleApply(p.code); // Changed v.voucherCode to p.code
                        }}
                        disabled={isSubmitting}
                        className="w-full group flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-all text-left border border-transparent hover:border-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Ticket className="h-4 w-4 text-orange-600 group-hover:text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-black tracking-wide group-hover:text-primary transition-colors text-foreground">
                              {p.code} {/* Changed v.voucherCode to p.code */}
                            </p>
                            <p className="text-[9px] text-muted-foreground font-medium">
                              {V.EXPIRY_SHORT} {new Date(p.endDate).toLocaleDateString("vi-VN")}{" "}
                              {/* Changed v.endDate to p.endDate */}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-none text-[10px] font-bold px-2"
                        >
                          {formatVoucherValue(p)} {/* Changed v to p */}
                        </Badge>
                      </button>
                    )
                  )
                ) : (
                  <div className="py-10 text-center text-[11px] text-muted-foreground font-medium italic">
                    {V.EMPTY_LIST}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/30 border-t flex sm:justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-bold text-muted-foreground hover:text-foreground"
          >
            {UI_TEXT.COMMON.CANCEL_EN}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
