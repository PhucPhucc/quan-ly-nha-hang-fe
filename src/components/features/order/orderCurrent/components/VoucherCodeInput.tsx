import { Loader2, Ticket, X } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { VOUCHER_APPLY_MODAL_TEXT } from "./voucher-apply-modal.text";

interface VoucherCodeInputProps {
  voucherCode: string;
  setVoucherCode: (value: string) => void;
  isSubmitting: boolean;
  handleApply: () => Promise<void>;
}

export const VoucherCodeInput: React.FC<VoucherCodeInputProps> = ({
  voucherCode,
  setVoucherCode,
  isSubmitting,
  handleApply,
}) => {
  return (
    <div className="flex gap-2 relative">
      <div className="relative flex-1 group">
        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={VOUCHER_APPLY_MODAL_TEXT.APPLY_MODAL_PLACEHOLDER}
          value={voucherCode}
          onChange={(event) => setVoucherCode(event.target.value.toUpperCase())}
          className="pl-9 pr-9 font-black uppercase tracking-wider h-11 border-muted-foreground/20 focus-visible:ring-primary/30 text-foreground"
          disabled={isSubmitting}
          onKeyDown={(event) => event.key === "Enter" && handleApply()}
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
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          VOUCHER_APPLY_MODAL_TEXT.APPLY_MODAL_APPLY
        )}
      </Button>
    </div>
  );
};
