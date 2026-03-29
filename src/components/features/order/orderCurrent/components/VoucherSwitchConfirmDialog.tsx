import { Ticket } from "lucide-react";
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
import { Voucher } from "@/types/voucher";

import { VOUCHER_APPLY_MODAL_TEXT } from "./voucher-apply-modal.text";

interface VoucherSwitchConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isSubmitting: boolean;
  pendingVoucher: Voucher | null;
  setPendingVoucher: (voucher: Voucher | null) => void;
  currentVoucherCode?: string;
  onConfirmSwitch: (voucher: Voucher) => Promise<void>;
}

export const VoucherSwitchConfirmDialog: React.FC<VoucherSwitchConfirmDialogProps> = ({
  isOpen,
  setIsOpen,
  isSubmitting,
  pendingVoucher,
  setPendingVoucher,
  currentVoucherCode,
  onConfirmSwitch,
}) => {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setPendingVoucher(null);
      }}
    >
      <AlertDialogContent className="sm:max-w-md rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Ticket className="h-5 w-5 text-primary" />
            {VOUCHER_APPLY_MODAL_TEXT.CONFIRM_SWITCH_TITLE}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground mt-3">
            {pendingVoucher &&
              VOUCHER_APPLY_MODAL_TEXT.CONFIRM_SWITCH_DESC(
                currentVoucherCode || "",
                pendingVoucher.code
              )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-2">
          <AlertDialogCancel
            disabled={isSubmitting}
            onClick={() => setPendingVoucher(null)}
            className="h-11 rounded-xl"
          >
            {VOUCHER_APPLY_MODAL_TEXT.CANCEL}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting || !pendingVoucher}
            onClick={async () => {
              if (!pendingVoucher) return;
              setIsOpen(false);
              const voucher = pendingVoucher;
              setPendingVoucher(null);
              await onConfirmSwitch(voucher);
            }}
            className="h-11 rounded-xl bg-primary text-primary-foreground"
          >
            {VOUCHER_APPLY_MODAL_TEXT.CONFIRM_SWITCH_ACTION}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
