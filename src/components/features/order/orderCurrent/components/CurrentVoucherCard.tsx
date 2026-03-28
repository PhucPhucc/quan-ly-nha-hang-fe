import { Ticket } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

import { VOUCHER_APPLY_MODAL_TEXT } from "./voucher-apply-modal.text";

interface CurrentVoucherCardProps {
  currentVoucherCode?: string;
  isSubmitting: boolean;
  onRemove: () => Promise<void>;
}

export const CurrentVoucherCard: React.FC<CurrentVoucherCardProps> = ({
  currentVoucherCode,
  isSubmitting,
  onRemove,
}) => {
  if (!currentVoucherCode) {
    return null;
  }

  return (
    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex justify-between items-center animate-in zoom-in-95 duration-200">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Ticket className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
            {VOUCHER_APPLY_MODAL_TEXT.APPLY_MODAL_CURRENT}
          </p>
          <p className="text-sm font-black text-primary tracking-wider">{currentVoucherCode}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-bold h-8 px-3 rounded-lg"
        onClick={onRemove}
        disabled={isSubmitting}
      >
        {VOUCHER_APPLY_MODAL_TEXT.APPLY_MODAL_REMOVE}
      </Button>
    </div>
  );
};
