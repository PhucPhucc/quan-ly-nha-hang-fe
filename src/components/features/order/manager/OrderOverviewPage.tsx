"use client";

import {
  ClipboardList,
  CreditCard,
  History,
  LayoutGrid,
  ShieldAlert,
  UtensilsCrossed,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { RecentOrders } from "@/components/features/Dashboard/RecentOrders";
import { InventoryStatCard } from "@/components/features/inventory/components/InventoryStatCard";
import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { billingService } from "@/services/billingService";
import { orderService } from "@/services/orderService";
import { BillingHistoryRecord } from "@/types/Billing";
import { OrderType } from "@/types/enums";
import { OrderDashboardOverview, OrderDashboardTopOrderItem } from "@/types/Order";

export default function OrderOverviewPage() {
  const [overview, setOverview] = useState<OrderDashboardOverview | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewRes, billingRes] = await Promise.all([
        orderService.getDashboardOverview(),
        billingService.getBillingHistory({ pageNumber: 1, pageSize: 10 }),
      ]);

      if (overviewRes.isSuccess && overviewRes.data) {
        setOverview(overviewRes.data);
      }

      if (billingRes.isSuccess && billingRes.data) {
        setBillingHistory(billingRes.data.items || []);
      }

      if (!overviewRes.isSuccess && !billingRes.isSuccess) {
        setError(overviewRes.message || billingRes.message || UI_TEXT.ORDER.OVERVIEW.FETCH_ERROR);
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
        key: "ready",
        label: UI_TEXT.ORDER.OVERVIEW.STATUS_LABELS.READY,
        value: overview?.readyItems ?? 0,
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

  return (
    <div className={cn(INVENTORY_PAGE_CLASS, "gap-5 pt-3")}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_680px] xl:items-start">
        <div className="space-y-5">
          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          <PageHeader
            icon={ClipboardList}
            title={UI_TEXT.ORDER.OVERVIEW.HERO_TITLE}
            description={UI_TEXT.ORDER.OVERVIEW.HERO_DESC}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <InventoryStatCard
              icon={ClipboardList}
              label={UI_TEXT.ORDER.OVERVIEW.STATS.ACTIVE}
              value={stats.total}
              isLoading={loading}
              className="shadow-sm"
              compact
            />
            <InventoryStatCard
              icon={UtensilsCrossed}
              label={UI_TEXT.ORDER.OVERVIEW.STATS.WAITING}
              value={stats.serving}
              isLoading={loading}
              variant={stats.serving > 0 ? "warning" : "default"}
              className="shadow-sm"
              compact
            />
            <InventoryStatCard
              icon={CreditCard}
              label={UI_TEXT.ORDER.OVERVIEW.STATS.PAID_TODAY}
              value={stats.paid}
              isLoading={loading}
              variant={stats.paid > 0 ? "success" : "default"}
              className="shadow-sm"
              compact
            />
          </div>
        </div>

        <AuditLogPreview rows={auditRows} loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DistributionCard
          icon={LayoutGrid}
          title={UI_TEXT.ORDER.OVERVIEW.DISTRIBUTION.ORDER_TYPE}
          description={UI_TEXT.ORDER.OVERVIEW.DISTRIBUTION.ORDER_TYPE_DESC}
          rows={orderTypeRows}
          total={overview?.activeOrders ?? 0}
          loading={loading}
          emptyText={UI_TEXT.ORDER.OVERVIEW.DISTRIBUTION.EMPTY_TYPE}
        />
        <DistributionCard
          icon={UtensilsCrossed}
          title={UI_TEXT.ORDER.OVERVIEW.DISTRIBUTION.ORDER_STATUS}
          description={UI_TEXT.ORDER.OVERVIEW.DISTRIBUTION.ORDER_STATUS_DESC}
          rows={serviceStateRows}
          total={serviceStateRows.reduce((sum, row) => sum + row.value, 0)}
          loading={loading}
          emptyText={UI_TEXT.ORDER.OVERVIEW.DISTRIBUTION.EMPTY_STATUS}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentOrders seedOrders={overview?.topActiveOrders ?? []} />
        <BillingHistoryPreview records={billingHistory} loading={loading} />
      </div>
    </div>
  );
}

function BillingHistoryPreview({
  records,
  loading,
}: {
  records: BillingHistoryRecord[];
  loading: boolean;
}) {
  const recentRecords = records.slice(0, 5);

  return (
    <Card className="h-[clamp(320px,45vh,400px)] min-h-0 overflow-hidden border-none shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <CreditCard className="h-4 w-4 text-primary" />
          <span>{UI_TEXT.ORDER.OVERVIEW.BILLING.TITLE}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto space-y-3">
        {loading ? (
          <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            <span>{UI_TEXT.ORDER.OVERVIEW.BILLING.LOADING}</span>
          </div>
        ) : recentRecords.length > 0 ? (
          recentRecords.map((record) => (
            <div
              key={record.orderId}
              className="flex items-center justify-between gap-3 rounded-xl border bg-card px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{record.orderCode}</p>
                <p className="text-xs text-muted-foreground">
                  <span>{getOrderTypeLabel(record.orderType)}</span>
                  <span aria-hidden> {UI_TEXT.COMMON.BULLET} </span>
                  <span>{formatDate(record.paidAt)}</span>
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className={cn("table-pill border-0", getPaymentMethodClass(record.paymentMethod))}
                >
                  {record.paymentMethod || UI_TEXT.ORDER.OVERVIEW.BILLING.UNKNOWN_METHOD}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            <span>{UI_TEXT.ORDER.OVERVIEW.BILLING.EMPTY}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AuditLogPreview({ rows, loading }: { rows: AuditPreviewRow[]; loading: boolean }) {
  const visibleRows = rows.slice(0, 10);

  return (
    <Card className="self-start border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <History className="h-4 w-4 text-primary" />
          <span>{UI_TEXT.ORDER.OVERVIEW.AUDIT.TITLE}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[132px] overflow-y-auto pr-2 space-y-0 scrollbar-thin scrollbar-thumb-muted-foreground/20">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            <span>{UI_TEXT.ORDER.OVERVIEW.AUDIT.LOADING}</span>
          </div>
        ) : visibleRows.length > 0 ? (
          visibleRows.map((row, index) => (
            <div
              key={`${row.orderCode}-${row.action}-${index}`}
              className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-b-0"
            >
              <p className="min-w-0 truncate text-sm font-medium text-foreground">
                <span className="opacity-90">{row.action}</span>
                <span aria-hidden className="mx-1 text-muted-foreground/40">
                  {UI_TEXT.COMMON.BULLET}
                </span>
                <span className="font-bold text-primary/80">{row.orderCode}</span>
              </p>
              <p className="shrink-0 text-[10px] font-medium text-muted-foreground/60">
                {row.time}
              </p>
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm text-muted-foreground">
            <ShieldAlert className="mb-2 h-5 w-5 text-primary/70" />
            <span>{UI_TEXT.ORDER.OVERVIEW.AUDIT.EMPTY}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type DistributionRow = {
  key: string;
  label: string;
  value: number;
  tone: "primary" | "info" | "warning";
  hint?: string;
  total?: number;
  share?: number;
};

function DistributionCard({
  icon: Icon,
  title,
  description,
  rows,
  total,
  loading,
  emptyText,
  showHint = false,
  valueFormatter,
}: {
  icon: typeof LayoutGrid;
  title: string;
  description: string;
  rows: DistributionRow[];
  total: number;
  loading: boolean;
  emptyText: string;
  showHint?: boolean;
  valueFormatter?: (row: DistributionRow) => string;
}) {
  const normalizedRows = rows.map((row) => ({
    ...row,
    share: row.share ?? (total > 0 ? Math.round((row.value / total) * 100) : 0),
  }));

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Icon className="h-4 w-4 text-primary" />
          <span>{title}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-muted/70" />
            ))}
          </div>
        ) : normalizedRows.length > 0 ? (
          normalizedRows.map((row) => (
            <div key={row.key} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{row.label}</p>
                  {showHint && row.hint ? (
                    <p className="text-xs text-muted-foreground">{row.hint}</p>
                  ) : null}
                </div>
                <Badge
                  variant="outline"
                  className={cn("border-0", distributionToneClass(row.tone))}
                >
                  {valueFormatter ? valueFormatter(row) : row.value}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>{UI_TEXT.COMMON.SHARE}</span>
                  <span>
                    {row.share}
                    {UI_TEXT.COMMON.PERCENT}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      distributionBarToneClass(row.tone)
                    )}
                    style={{ width: `${Math.max(row.share ?? 0, row.value > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function distributionToneClass(tone: DistributionRow["tone"]) {
  if (tone === "info") return "table-pill table-pill-info";
  if (tone === "warning") return "table-pill table-pill-warning";
  return "table-pill table-pill-primary";
}

function distributionBarToneClass(tone: DistributionRow["tone"]) {
  if (tone === "info") return "bg-info";
  if (tone === "warning") return "bg-warning";
  return "bg-primary";
}

type AuditPreviewRow = {
  orderCode: string;
  action: string;
  actor: string;
  time: string;
  sortValue: number;
};

function buildAuditPreviewRows(orders: OrderDashboardTopOrderItem[]): AuditPreviewRow[] {
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

function getOrderTypeLabel(orderType: string) {
  if (orderType === OrderType.DineIn) return UI_TEXT.ORDER.BILLING.DINE_IN;
  if (orderType === OrderType.Takeaway) return UI_TEXT.ORDER.BILLING.TAKEAWAY;
  if (orderType === OrderType.Delivery) return UI_TEXT.ORDER.BILLING.DELIVERY;
  return orderType;
}

function getPaymentMethodClass(method?: string) {
  if (method === "Cash") return "table-pill-success";
  if (method === "BankTransfer") return "table-pill-info";
  if (method === "CreditCard") return "table-pill-primary";
  return "table-pill-neutral";
}

function formatDate(value?: string | null) {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? UI_TEXT.COMMON.NOT_APPLICABLE
    : date.toLocaleString("vi-VN");
}
