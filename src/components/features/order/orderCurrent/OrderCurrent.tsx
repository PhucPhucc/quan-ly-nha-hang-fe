"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useCartStore } from "@/store/useCartStore";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { OrderType } from "@/types/enums";

import CardContainer from "../CardContainer";
import OrderCurrentHeader from "./components/OrderCurrentHeader";
import OrderItemList from "./components/OrderItemList";
import OrderSummaryFooter from "./components/OrderSummaryFooter";

const OrderCurrent = ({ tableCode }: { tableCode: string }) => {
  const { items: cartData, updateQuantity, removeItem } = useCartStore();
  const { selectedOrderId, activeOrderDetails, orderDetailsLoading } = useOrderBoardStore();

  const fetchOrderDetails = useOrderBoardStore((s) => s.fetchOrderDetails);

  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
    }
  }, [selectedOrderId, fetchOrderDetails]);

  // const activeOrder = orders.find((o) => o.orderId === selectedOrderId);
  // const activeOrder = useOrderBoardStore((state) => state.activeOrderDetails);
  const tableName = activeOrderDetails
    ? activeOrderDetails.orderType === OrderType.Takeaway
      ? UI_TEXT.ORDER.BOARD.TAKEAWAY
      : UI_TEXT.TABLE.TABLE_LABEL(tableCode)
    : UI_TEXT.ORDER.BOARD.NOT_SELECTED_TABLE;

  const cartItems = selectedOrderId ? cartData[selectedOrderId] || [] : [];
  const remoteItems = activeOrderDetails?.orderItems || [];

  const subtotalCart = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const subtotalRemote = remoteItems.reduce((acc, item) => {
    if (item.isFreeItem) return acc;
    const base = item.unitPriceSnapshot * item.quantity;
    const options = (item.optionGroups || []).reduce((gAcc, g) => {
      return gAcc + g.optionValues.reduce((vAcc, v) => vAcc + v.extraPriceSnapshot * v.quantity, 0);
    }, 0);
    return acc + base + options;
  }, 0);

  const subtotal = subtotalCart + subtotalRemote;

  const serverTotal = activeOrderDetails?.totalAmount;
  const hasCartItems = cartItems.length > 0;

  const voucherCode =
    activeOrderDetails?.voucherCode ??
    activeOrderDetails?.appliedVoucherCode ??
    activeOrderDetails?.promotionCode ??
    activeOrderDetails?.voucher?.voucherCode ??
    undefined;

  const tax = activeOrderDetails?.vatAmount ?? Math.round(subtotal * 0.1);

  const baseDiscount =
    activeOrderDetails?.discountAmount ??
    activeOrderDetails?.discount ??
    activeOrderDetails?.voucher?.discountAmount ??
    0;

  // If we have a voucher but the discount amount didn't come through,
  // and we have a server total, we can infer the discount to keep the UI consistent.
  const discount =
    baseDiscount === 0 && voucherCode && serverTotal && !hasCartItems
      ? Math.max(0, subtotal + tax - serverTotal)
      : baseDiscount;

  const total = hasCartItems
    ? subtotal + tax - discount
    : (serverTotal ?? subtotal + tax - discount);

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
