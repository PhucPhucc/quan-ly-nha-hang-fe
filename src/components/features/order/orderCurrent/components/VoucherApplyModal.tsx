import { Loader2, Ticket, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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
import { UI_TEXT } from "@/lib/UI_Text";
import { voucherService } from "@/services/voucherService";
import { useOrderBoardStore } from "@/store/useOrderStore";

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
  const { updateActiveOrderDiscount } = useOrderBoardStore();

  const handleApply = async () => {
    if (!voucherCode.trim()) {
      toast.error(V.VALIDATE_CODE_REQUIRED);
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Find voucher by code to get ID
      const listRes = await voucherService.getAll({ search: voucherCode.trim() });
      const targetVoucher = listRes.data?.items.find(
        (v) => v.voucherCode.toUpperCase() === voucherCode.trim().toUpperCase()
      );

      if (!targetVoucher) {
        toast.error(V.NOT_FOUND);
        return;
      }

      // 2. Apply using voucherId
      const res = await voucherService.apply({
        orderId,
        voucherId: targetVoucher.voucherId,
      });

      if (res.isSuccess && res.data) {
        toast.success(V.APPLY_SUCCESS);
        updateActiveOrderDiscount(res.data.discountAmount, res.data.newVoucherCode);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Ticket className="w-5 h-5 text-primary" />
            {V.APPLY_MODAL_TITLE}
          </DialogTitle>
          <DialogDescription>{V.APPLY_MODAL_DESC}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder={V.APPLY_MODAL_PLACEHOLDER}
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              className="font-bold uppercase"
              disabled={isSubmitting}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
            />
            {voucherCode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoucherCode("")}
                className="shrink-0"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {currentVoucherCode && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Ticket className="h-4 w-4" />
                <span>
                  {V.APPLY_MODAL_CURRENT} {currentVoucherCode}
                </span>
              </div>
              <Button
                variant="link"
                className="text-destructive h-auto p-0 font-semibold"
                onClick={handleRemove}
                disabled={isSubmitting}
              >
                {V.APPLY_MODAL_REMOVE}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {UI_TEXT.COMMON.CANCEL_EN}
          </Button>
          <Button onClick={handleApply} disabled={isSubmitting || !voucherCode.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {UI_TEXT.COMMON.PROCESSING}
              </>
            ) : (
              V.APPLY_MODAL_APPLY
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
