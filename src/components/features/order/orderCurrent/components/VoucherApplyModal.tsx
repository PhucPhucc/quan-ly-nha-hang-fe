"use client";

import { Ticket } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CurrentVoucherCard } from "./CurrentVoucherCard";
import { useVoucherApply } from "./useVoucherApply";
import { VOUCHER_APPLY_MODAL_TEXT } from "./voucher-apply-modal.text";
import { VoucherApplyModalProps } from "./voucher-apply-modal.types";
import { VoucherCodeInput } from "./VoucherCodeInput";
import { VoucherList } from "./VoucherList";
import { VoucherSwitchConfirmDialog } from "./VoucherSwitchConfirmDialog";

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
            {VOUCHER_APPLY_MODAL_TEXT.APPLY_MODAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium">
            {VOUCHER_APPLY_MODAL_TEXT.APPLY_MODAL_DESC}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <VoucherCodeInput
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            isSubmitting={isSubmitting}
            handleApply={handleApply}
          />

          <CurrentVoucherCard
            currentVoucherCode={currentVoucherCode}
            isSubmitting={isSubmitting}
            onRemove={handleRemove}
          />

          <VoucherList
            vouchers={availableVouchers}
            isLoading={isLoadingList}
            onSelect={(voucher) => setVoucherCode(voucher.code)}
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
            {VOUCHER_APPLY_MODAL_TEXT.CANCEL}
          </Button>
        </DialogFooter>
      </DialogContent>

      <VoucherSwitchConfirmDialog
        isOpen={isSwitchConfirmOpen}
        setIsOpen={setIsSwitchConfirmOpen}
        isSubmitting={isSubmitting}
        pendingVoucher={pendingVoucher}
        setPendingVoucher={setPendingVoucher}
        currentVoucherCode={currentVoucherCode}
        onConfirmSwitch={async (voucher) => applyVoucher(voucher, true)}
      />
    </Dialog>
  );
};
