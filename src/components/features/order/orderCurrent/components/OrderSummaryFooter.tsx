import React, { useState } from "react";

import { CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";

import { CheckoutModal } from "./CheckoutModal";
import { OrderSummaryFooterProps } from "./order-summary-footer.types";
import { OrderSummaryActions } from "./OrderSummaryActions";
import { OrderSummaryTotals } from "./OrderSummaryTotals";
import { submitToKitchen } from "./useOrderSubmit";
import { VoucherApplyModal } from "./VoucherApplyModal";

const OrderSummaryFooter: React.FC<OrderSummaryFooterProps> = ({
  subtotal,
  tax,
  total,
  discount = 0,
  voucherCode,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  const { items: cartData, clearCart } = useCartStore();
  const { selectedOrderId, fetchOrders, fetchOrderDetails, orders } = useOrderBoardStore();
  const setActiveView = useOrderBoardStore((state) => state.setActiveView);

  const handleSendRequest = async () => {
    await submitToKitchen({
      selectedOrderId,
      orders,
      cartData,
      clearCart,
      fetchOrders,
      fetchOrderDetails,
      setActiveView,
      setIsSubmitting,
    });
  };

  return (
    <CardFooter className="flex flex-col p-2 border-t gap-2 shrink-0">
      <OrderSummaryTotals
        subtotal={subtotal}
        tax={tax}
        total={total}
        discount={discount}
        voucherCode={voucherCode}
      />

      <OrderSummaryActions
        subtotal={subtotal}
        tax={tax}
        total={total}
        discount={discount}
        voucherCode={voucherCode}
        isSubmitting={isSubmitting}
        selectedOrderId={selectedOrderId}
        cartData={cartData}
        onOpenVoucher={() => setIsVoucherOpen(true)}
        onSendRequest={handleSendRequest}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          totalAmount={total}
        />
      )}

      {isVoucherOpen && selectedOrderId && (
        <VoucherApplyModal
          isOpen={isVoucherOpen}
          onClose={() => setIsVoucherOpen(false)}
          orderId={selectedOrderId}
          currentVoucherCode={voucherCode}
        />
      )}
    </CardFooter>
  );
};

export default OrderSummaryFooter;
