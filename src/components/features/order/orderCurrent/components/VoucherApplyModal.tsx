"use client";

import { Loader2, Ticket, X } from "lucide-react";
import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

import { useVoucherApply } from "./useVoucherApply";
import { VoucherList } from "./VoucherList";

interface VoucherApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentVoucherCode?: string;
}

const TEXT = {
  APPLY_MODAL_TITLE: "Áp dụng mã giảm giá",
  APPLY_MODAL_DESC: "Nhập mã voucher để nhận ưu đãi cho đơn hàng.",
  APPLY_MODAL_PLACEHOLDER: "Nhập mã voucher...",
  APPLY_MODAL_APPLY: "Áp dụng",
  APPLY_MODAL_REMOVE: "Gỡ bỏ",
  APPLY_MODAL_CURRENT: "Mã đang áp dụng:",
  CONFIRM_SWITCH_TITLE: "Xác nhận đổi voucher",
  CONFIRM_SWITCH_DESC: (oldCode: string, newCode: string) =>
    `Đơn hàng đang áp dụng mã ${oldCode}. Nếu đổi sang ${newCode}, hệ thống sẽ gỡ mã cũ và áp dụng mã mới. Bạn có muốn tiếp tục không?`,
  CONFIRM_SWITCH_ACTION: "Đổi voucher",
  CANCEL: "Hủy",
};

export const VoucherApplyModal: React.FC<VoucherApplyModalProps> = ({
  isOpen,
  onClose,
  orderId,
  currentVoucherCode,
}) => {
  const {
    voucherCode,
    setVoucherCode,
    isSubmitting,
    availableVouchers,
    isLoadingList,
    isSwitchConfirmOpen,
    setIsSwitchConfirmOpen,
    pendingVoucher,
    setPendingVoucher,
    handleApply,
    handleRemove,
    applyVoucher,
  } = useVoucherApply(isOpen, onClose, orderId, currentVoucherCode);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden rounded-2xl border-none">
        <DialogHeader className="p-6 pb-4 bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-primary">
            <Ticket className="w-5 h-5" />
            {TEXT.APPLY_MODAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium">
            {TEXT.APPLY_MODAL_DESC}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <div className="flex gap-2 relative">
            <div className="relative flex-1 group">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={TEXT.APPLY_MODAL_PLACEHOLDER}
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
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : TEXT.APPLY_MODAL_APPLY}
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
                    {TEXT.APPLY_MODAL_CURRENT}
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
                {TEXT.APPLY_MODAL_REMOVE}
              </Button>
            </div>
          )}

          <VoucherList
            vouchers={availableVouchers}
            isLoading={isLoadingList}
            onSelect={(v) => setVoucherCode(v.code)}
            disabled={isSubmitting}
          />
        </div>

        <DialogFooter className="p-4 bg-muted/30 border-t flex sm:justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="font-bold text-muted-foreground hover:text-foreground"
          >
            {TEXT.CANCEL}
          </Button>
        </DialogFooter>
      </DialogContent>

      <AlertDialog
        open={isSwitchConfirmOpen}
        onOpenChange={(open) => {
          setIsSwitchConfirmOpen(open);
          if (!open) setPendingVoucher(null);
        }}
      >
        <AlertDialogContent className="sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Ticket className="h-5 w-5 text-primary" />
              {TEXT.CONFIRM_SWITCH_TITLE}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground mt-3">
              {pendingVoucher &&
                TEXT.CONFIRM_SWITCH_DESC(currentVoucherCode || "", pendingVoucher.code)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-2">
            <AlertDialogCancel
              disabled={isSubmitting}
              onClick={() => setPendingVoucher(null)}
              className="h-11 rounded-xl"
            >
              {TEXT.CANCEL}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting || !pendingVoucher}
              onClick={async () => {
                if (!pendingVoucher) return;
                setIsSwitchConfirmOpen(false);
                const voucher = pendingVoucher;
                setPendingVoucher(null);
                await applyVoucher(voucher, true);
              }}
              className="h-11 rounded-xl bg-primary text-primary-foreground"
            >
              {TEXT.CONFIRM_SWITCH_ACTION}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
