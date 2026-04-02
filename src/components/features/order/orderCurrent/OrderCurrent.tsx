"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
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
  const { selectedOrderId, activeOrderDetails, orderDetailsLoading } = useOrderBoardStore();
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isVoucherLoading, setIsVoucherLoading] = useState(false);

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

  const tax =
    activeOrderDetails?.vatAmount && activeOrderDetails.vatAmount > 0
      ? activeOrderDetails.vatAmount
      : Math.round(subtotal * 0.1);

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

  const dynamicDiscount =
    appliedVoucher?.type === VoucherType.Percent
      ? Math.min(
          subtotal,
          appliedVoucher.maxDiscount ?? Number.POSITIVE_INFINITY,
          Math.round((subtotal * appliedVoucher.value) / 100)
        )
      : appliedVoucher?.type === VoucherType.Fixed
        ? Math.min(subtotal, appliedVoucher.value)
        : discount;

  const resolvedDiscount = voucherCode && !isVoucherLoading ? dynamicDiscount : discount;

  const total = Math.max(0, subtotal + tax - resolvedDiscount);

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
          discount={resolvedDiscount}
          voucherCode={voucherCode}
        />
      </div>
    </CardContainer>
  );
};

export default OrderCurrent;
