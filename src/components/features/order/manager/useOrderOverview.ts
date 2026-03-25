"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { billingService } from "@/services/billingService";
import { orderService } from "@/services/orderService";
import { voucherService } from "@/services/voucherService";
import { BillingHistoryRecord } from "@/types/Billing";
import { OrderDashboardOverview, OrderDashboardTopOrderItem } from "@/types/Order";
import { Voucher } from "@/types/voucher";

export function useOrderOverview() {
  const [overview, setOverview] = useState<OrderDashboardOverview | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryRecord[]>([]);
  const [promotions, setPromotions] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [billingError, setBillingError] = useState("");
  const [promoError, setPromoError] = useState("");

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setBillingError("");
      setPromoError("");

      const [overviewRes, billingRes, promoRes] = await Promise.all([
        orderService.getDashboardOverview(),
        billingService.getBillingHistory({ pageNumber: 1, pageSize: 10 }),
        voucherService.getAll({ pageSize: 10, filters: ["isActive==true"] }),
      ]);

      if (overviewRes.isSuccess && overviewRes.data) {
        setOverview(overviewRes.data);
      } else if (!overviewRes.isSuccess) {
        setError(overviewRes.message || UI_TEXT.ORDER.OVERVIEW.FETCH_ERROR);
      }

      if (billingRes.isSuccess && billingRes.data) {
        setBillingHistory(billingRes.data.items || []);
      } else if (!billingRes.isSuccess) {
        setBillingError(billingRes.message || "Không thể tải lịch sử thanh toán");
      }

      if (promoRes.isSuccess && promoRes.data) {
        setPromotions(promoRes.data.items || []);
      } else if (!promoRes.isSuccess) {
        setPromoError(promoRes.message || "Không thể tải thông tin khuyến mãi");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const stats = useMemo(
    () => ({
      total: overview?.activeOrders ?? 0,
      serving: overview?.waitingCheckoutOrders ?? 0,
      paid: overview?.todayPaidOrders ?? 0,
    }),
    [overview]
  );

  const auditRows = useMemo(
    () => buildAuditPreviewRows(overview?.topActiveOrders ?? []),
    [overview]
  );

  const orderTypeRows = useMemo(
    () => [
      {
        key: "dine-in",
        label: UI_TEXT.ORDER.BILLING.DINE_IN,
        value: overview?.dineInOrders ?? 0,
        tone: "primary" as const,
      },
      {
        key: "takeaway",
        label: UI_TEXT.ORDER.BILLING.TAKEAWAY,
        value: overview?.takeawayOrders ?? 0,
        tone: "info" as const,
      },
      {
        key: "delivery",
        label: UI_TEXT.ORDER.BILLING.DELIVERY,
        value: overview?.deliveryOrders ?? 0,
        tone: "warning" as const,
      },
    ],
    [overview]
  );

  const serviceStateRows = useMemo(() => {
    const servingOrders =
      overview?.statusBreakdown.find((item) => item.status === "Serving")?.count ??
      overview?.activeOrders ??
      0;

    return [
      {
        key: "serving",
        label: UI_TEXT.ORDER.OVERVIEW.STATUS_LABELS.SERVING,
        value: servingOrders,
        tone: "primary" as const,
      },
      {
        key: "completed",
        label: UI_TEXT.ORDER.OVERVIEW.STATUS_LABELS.COMPLETED,
        value: overview?.completedItems ?? 0,
        tone: "info" as const,
      },
      {
        key: "waiting-checkout",
        label: UI_TEXT.ORDER.OVERVIEW.STATUS_LABELS.WAITING_CHECKOUT,
        value: overview?.waitingCheckoutOrders ?? 0,
        tone: "warning" as const,
      },
    ];
  }, [overview]);

  return {
    overview,
    billingHistory,
    promotions,
    loading,
    error,
    billingError,
    promoError,
    stats,
    auditRows,
    orderTypeRows,
    serviceStateRows,
  };
}

function buildAuditPreviewRows(orders: OrderDashboardTopOrderItem[]) {
  return orders
    .map((order) => ({
      orderCode: order.orderCode,
      action:
        order.status === "Serving"
          ? UI_TEXT.ORDER.OVERVIEW.AUDIT.SERVING_ACTION
          : UI_TEXT.ORDER.OVERVIEW.AUDIT.UPDATE_ACTION,
      actor: UI_TEXT.COMMON.SYSTEM,
      time: formatDate(order.createdAt),
      sortValue: new Date(order.createdAt).getTime(),
    }))
    .filter((row) => row.time !== "N/A")
    .sort((a, b) => b.sortValue - a.sortValue)
    .slice(0, 5);
}

function formatDate(value?: string | null) {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? UI_TEXT.COMMON.NOT_APPLICABLE
    : date.toLocaleString("vi-VN");
}
