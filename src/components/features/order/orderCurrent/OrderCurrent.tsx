"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { orderService } from "@/services/orderService";
import { voucherService } from "@/services/voucherService";
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { OrderType } from "@/types/enums";
import { Voucher, VoucherType } from "@/types/voucher";

import CardContainer from "../CardContainer";
import OrderCurrentHeader from "./components/OrderCurrentHeader";
import OrderItemList from "./components/OrderItemList";
import OrderSummaryFooter from "./components/OrderSummaryFooter";

const OrderCurrent = ({ tableCode }: { tableCode: string }) => {
  const { items: cartData, updateQuantity, removeItem } = useCartStore();
  const {
    selectedOrderId,
    activeOrderDetails,
    orderDetailsLoading,
    fetchOrderDetails,
    fetchOrders,
  } = useOrderBoardStore();
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // const activeOrder = orders.find((o) => o.orderId === selectedOrderId);
  // const activeOrder = useOrderBoardStore((state) => state.activeOrderDetails);
  const tableName = activeOrderDetails
    ? activeOrderDetails.orderType === OrderType.Takeaway
      ? UI_TEXT.ORDER.BOARD.TAKEAWAY
      : UI_TEXT.TABLE.TABLE_LABEL(tableCode)
    : UI_TEXT.ORDER.BOARD.NOT_SELECTED_TABLE;

  const cartItems = selectedOrderId ? cartData[selectedOrderId] || [] : [];
  // Filter out cancelled items from display
  const remoteItems =
    activeOrderDetails?.orderItems?.filter((item) => item.status !== "Cancelled") || [];

  const subtotalCart = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Rely on backend's subTotal for remote items if available
  const subtotalRemote = activeOrderDetails?.subTotal ?? 0;

  const subtotal = subtotalCart + subtotalRemote;

  const hasCartItems = cartItems.length > 0;

  const voucherCode =
    activeOrderDetails?.voucherCode ?? activeOrderDetails?.promotionCode ?? undefined;

  useEffect(() => {
    let isMounted = true;

    const fetchAppliedVoucher = async () => {
      if (!voucherCode) {
        setAppliedVoucher(null);
        return;
      }

      try {
        setIsVoucherLoading(true);
        const res = await voucherService.getAll({ search: voucherCode, pageSize: 20 });
        const matchedVoucher =
          res.data?.items.find(
            (voucher) => voucher.code.toUpperCase() === voucherCode.toUpperCase()
          ) ?? null;

        if (isMounted) {
          setAppliedVoucher(matchedVoucher);
        }
      } catch (error) {
        console.error("Failed to fetch applied voucher:", error);
        if (isMounted) {
          setAppliedVoucher(null);
        }
      } finally {
        if (isMounted) {
          setIsVoucherLoading(false);
        }
      }
    };

    void fetchAppliedVoucher();

    return () => {
      isMounted = false;
    };
  }, [voucherCode]);

  const remoteTax = activeOrderDetails?.vatAmount ?? 0;
  const vatRate = activeOrderDetails?.vatRate ?? 10;

  const baseDiscount = activeOrderDetails?.discountAmount ?? 0;

  const dynamicDiscount =
    appliedVoucher?.type === VoucherType.Percent
      ? Math.min(
          subtotal,
          appliedVoucher.maxDiscount ?? Number.POSITIVE_INFINITY,
          Math.round((subtotal * appliedVoucher.value) / 100)
        )
      : appliedVoucher?.type === VoucherType.Fixed
        ? Math.min(subtotal, appliedVoucher.value)
        : baseDiscount;

  const resolvedDiscount =
    hasCartItems && voucherCode && !isVoucherLoading ? dynamicDiscount : baseDiscount;

  const cartSubtotalAfterDiscount = hasCartItems ? Math.max(0, subtotalCart - resolvedDiscount) : 0;
  const cartTax = hasCartItems ? Math.round(cartSubtotalAfterDiscount * vatRate) : 0;
  const tax = remoteTax + cartTax;

  const total = hasCartItems
    ? Math.max(0, subtotal + tax - resolvedDiscount)
    : (activeOrderDetails?.totalAmount ?? Math.max(0, subtotal + tax - resolvedDiscount));

  const handleCancelItem = async (itemId: string) => {
    if (!selectedOrderId || !activeOrderDetails) return;

    try {
      setIsCancelling(true);
      const res = await orderService.cancelOrderItem(
        selectedOrderId,
        itemId,
        "Cancelled by cashier"
      );

      if (res.isSuccess) {
        toast.success("Đã hủy món thành công");
        // Fetch fresh data from server to ensure state is synchronized
        await Promise.all([
          fetchOrderDetails(selectedOrderId),
          fetchOrders(), // Also refresh orders list to update totals on table view
        ]);
      } else {
        toast.error(res.message || "Không thể hủy món");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error("Cancel item failed:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  if (orderDetailsLoading && !activeOrderDetails) {
    return (
      <CardContainer className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </CardContainer>
    );
  }

  return (
    <CardContainer className="h-full">
      <div className="flex flex-col h-full min-h-0">
        <OrderCurrentHeader
          tableName={tableName}
          itemCount={cartItems.length + remoteItems.length}
          status={activeOrderDetails?.status}
        />
        <OrderItemList
          items={cartItems}
          remoteItems={remoteItems}
          onUpdateQuantity={(key, delta) =>
            selectedOrderId && updateQuantity(selectedOrderId, key, delta)
          }
          onRemoveItem={(key) => selectedOrderId && removeItem(selectedOrderId, key)}
          onCancelItem={isCancelling ? undefined : handleCancelItem}
        />
        <OrderSummaryFooter
          subtotal={subtotal}
          tax={tax}
          total={total}
          discount={resolvedDiscount}
          voucherCode={voucherCode}
        />
      </div>
    </CardContainer>
  );
};

export default OrderCurrent;
