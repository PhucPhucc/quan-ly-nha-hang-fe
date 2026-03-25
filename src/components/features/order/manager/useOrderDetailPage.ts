"use client";

import { useEffect, useState } from "react";

import { billingService } from "@/services/billingService";
import { orderService } from "@/services/orderService";
import { PreCheckBill } from "@/types/Billing";
import { OrderStatus } from "@/types/enums";
import { Order as OrderModel } from "@/types/Order";

export function useOrderDetailPage(orderId: string) {
  const [detail, setDetail] = useState<OrderModel | null>(null);
  const [preCheckBill, setPreCheckBill] = useState<PreCheckBill | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const detailRes = await orderService.getOrderById(orderId);
        if (!alive) return;
        if (detailRes.isSuccess && detailRes.data) {
          setDetail(detailRes.data);

          if (detailRes.data.status === OrderStatus.Serving) {
            const preRes = await billingService.getPreCheckBill(orderId);
            if (!alive) return;
            setPreCheckBill(preRes.isSuccess ? preRes.data : null);
          } else {
            setPreCheckBill(null);
          }
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [orderId]);

  return {
    detail,
    preCheckBill,
    loading,
  };
}
