import { Loader2, Ticket } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { CartItem } from "@/types/Cart";

import PrintTempDialog from "./PrintTempDialog";

interface OrderSummaryActionsProps {
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
  voucherCode?: string;
  isSubmitting: boolean;
  selectedOrderId: string | null;
  cartData: Record<string, CartItem[]>;
  onOpenVoucher: () => void;
  onSendRequest: () => Promise<void>;
  onOpenCheckout: () => void;
}

export const OrderSummaryActions: React.FC<OrderSummaryActionsProps> = ({
  subtotal,
  tax,
  total,
  discount,
  voucherCode,
  isSubmitting,
  selectedOrderId,
  cartData,
  onOpenVoucher,
  onSendRequest,
  onOpenCheckout,
}) => {
  const hasCartItems = selectedOrderId ? (cartData[selectedOrderId] || []).length > 0 : false;

  return (
    <div className="w-full grid grid-cols-2 gap-2">
      <PrintTempDialog
        subtotal={subtotal}
        tax={tax}
        total={total}
        discount={discount}
        voucherCode={voucherCode}
      />

      <Button
        variant="outline"
        onClick={onOpenVoucher}
        disabled={!selectedOrderId || isSubmitting}
        className={voucherCode ? "text-primary border-primary bg-primary/5 font-bold" : ""}
      >
        <Ticket className="w-4 h-4 mr-2" />
        {UI_TEXT.VOUCHER.SIDEBAR_TITLE}
      </Button>

      <Button
        className="col-span-2"
        onClick={() => void onSendRequest()}
        disabled={isSubmitting || !selectedOrderId || !hasCartItems}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {UI_TEXT.ORDER.CURRENT.PROCESSING}
          </>
        ) : (
          UI_TEXT.ORDER.CURRENT.ADD_TO_ORDER
        )}
      </Button>

      <Button
        variant="outline"
        className="col-span-2 min-w-40 font-bold bg-success text-success-foreground hover:bg-success/80 border-success"
        onClick={onOpenCheckout}
        disabled={isSubmitting || !selectedOrderId}
      >
        {UI_TEXT.ORDER.CURRENT.PAY}
      </Button>
    </div>
  );
};
