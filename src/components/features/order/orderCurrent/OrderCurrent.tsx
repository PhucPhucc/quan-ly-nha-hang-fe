"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { OrderType } from "@/types/enums";

import CardContainer from "../CardContainer";
import OrderCurrentHeader from "./components/OrderCurrentHeader";
import OrderItemList from "./components/OrderItemList";
import OrderSummaryFooter from "./components/OrderSummaryFooter";

const OrderCurrent = () => {
  const { items: cartData, updateQuantity, removeItem } = useCartStore();
  const { orders, selectedOrderId, activeOrderDetails, orderDetailsLoading } = useOrderBoardStore();

  const fetchOrderDetails = useOrderBoardStore((s) => s.fetchOrderDetails);

  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
    }
  }, [selectedOrderId, fetchOrderDetails]);

  const activeOrder = orders.find((o) => o.orderId === selectedOrderId);
  const tableName = activeOrder
    ? activeOrder.orderType === OrderType.Takeaway
      ? "Mang đi"
      : `Bàn ${activeOrder.tableId?.slice(-2) || "--"}`
    : "Chưa chọn bàn";

  // Cart items for this specific order
  const cartItems = selectedOrderId ? cartData[selectedOrderId] || [] : [];

  // Map remote items to a format ItemList can display, or just pass them as a separate prop
  // For now, let's keep OrderItemList simple and pass everything as "items" or enhance it.
  const remoteItems = activeOrderDetails?.orderItems || [];

  const subtotalCart = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const subtotalRemote = remoteItems.reduce(
    (acc, item) => acc + item.unitPriceSnapshot * item.quantity,
    0
  );

  const subtotal = subtotalCart + subtotalRemote;
  // Try all possible backend naming conventions robustly
  const discount =
    activeOrderDetails?.discountAmount ??
    activeOrderDetails?.discount ??
    activeOrderDetails?.voucher?.discountAmount ??
    0;

  const voucherCode =
    activeOrderDetails?.voucherCode ??
    activeOrderDetails?.appliedVoucherCode ??
    activeOrderDetails?.voucher?.voucherCode ??
    undefined;

  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;

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
          status={activeOrder?.status}
        />
        <OrderItemList
          items={cartItems}
          remoteItems={remoteItems}
          onUpdateQuantity={(key, delta) =>
            selectedOrderId && updateQuantity(selectedOrderId, key, delta)
          }
          onRemoveItem={(key) => selectedOrderId && removeItem(selectedOrderId, key)}
        />
        <OrderSummaryFooter
          subtotal={subtotal}
          tax={tax}
          total={total}
          discount={discount}
          voucherCode={voucherCode}
        />
      </div>
    </CardContainer>
  );
};

export default OrderCurrent;
