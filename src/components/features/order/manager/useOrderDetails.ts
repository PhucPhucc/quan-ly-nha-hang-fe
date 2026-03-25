"use client";

import { useEffect, useState } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { billingService } from "@/services/billingService";
import { orderService } from "@/services/orderService";
import { PreCheckBill } from "@/types/Billing";
import { OrderStatus } from "@/types/enums";
import { Order as OrderModel } from "@/types/Order";

export function useOrderDetails(open: boolean, order: OrderModel | null) {
  const [detail, setDetail] = useState<OrderModel | null>(null);
  const [preCheckBill, setPreCheckBill] = useState<PreCheckBill | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!open || !order) return;
      setLoading(true);
      try {
        const detailRes = await orderService.getOrderById(order.orderId);
        if (!alive) return;
        setDetail(detailRes.isSuccess && detailRes.data ? detailRes.data : order);

        if (order.status === OrderStatus.Serving) {
          const preRes = await billingService.getPreCheckBill(order.orderId);
          if (!alive) return;
          setPreCheckBill(preRes.isSuccess ? preRes.data : null);
        } else {
          setPreCheckBill(null);
        }
      } catch {
        if (alive) {
          setDetail(order);
          setPreCheckBill(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [open, order]);

  const handleSplitBill = async (item: OrderModel["orderItems"][number]) => {
    if (!order) return;
    const raw = window.prompt(UI_TEXT.ORDER.DETAIL.SPLIT_BILL_PROMPT(item.itemNameSnapshot), "1");
    if (raw == null) return;

    const quantity = Number(raw);
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > item.quantity) {
      window.alert(UI_TEXT.ORDER.DETAIL.SPLIT_BILL_INVALID_QTY);
      return;
    }

    const response = await billingService.splitBill(order.orderId, {
      itemsToSplit: [{ orderItemId: item.orderItemId, quantityToSplit: quantity }],
    });

    if (!response.isSuccess) {
      window.alert(response.message || UI_TEXT.ORDER.DETAIL.SPLIT_BILL_FAILED);
      return;
    }

    window.alert(UI_TEXT.ORDER.DETAIL.SPLIT_BILL_SUCCESS);
  };

  const current = detail ?? order;

  return {
    current,
    preCheckBill,
    loading,
    handleSplitBill,
  };
}
