"use client";

import {
  ClipboardList,
  CreditCard,
  Gift,
  History,
  LayoutGrid,
  ShieldAlert,
  Ticket,
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
import { voucherService } from "@/services/voucherService";
import { BillingHistoryRecord } from "@/types/Billing";
import { OrderType } from "@/types/enums";
import { OrderDashboardOverview, OrderDashboardTopOrderItem } from "@/types/Order";
import { Voucher } from "@/types/voucher";

export default function OrderOverviewPage() {
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

  return (
    <div className={cn(INVENTORY_PAGE_CLASS, "gap-5 pt-3")}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_680px] xl:items-start">
        <div className="space-y-5">
          <PageHeader
            icon={ClipboardList}
            title={UI_TEXT.ORDER.OVERVIEW.HERO_TITLE}
            description={UI_TEXT.ORDER.OVERVIEW.HERO_DESC}
          />
          {error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
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
        <div className="space-y-6">
          <BillingHistoryPreview records={billingHistory} loading={loading} error={billingError} />
          <PromotionOverviewCard promotions={promotions} loading={loading} error={promoError} />
        </div>
      </div>
    </div>
  );
}

function PromotionOverviewCard({
  promotions,
  loading,
  error,
}: {
  promotions: Voucher[];
  loading: boolean;
  error?: string;
}) {
  const activePromos = promotions.filter((p) => p.isActive);
  const topPromo = [...promotions].sort((a, b) => b.usedCount - a.usedCount)[0];

  return (
    <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-slate-900">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center justify-between gap-2 text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            <span>{UI_TEXT.VOUCHER.TITLE}</span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-bold py-0 h-5 px-2 bg-slate-50 border-slate-200"
          >
            {activePromos.length} {UI_TEXT.VOUCHER.STATUS_ACTIVE}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-10 animate-pulse rounded-lg bg-slate-50 dark:bg-slate-800/50" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-50 dark:bg-slate-800/50" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-danger/70 bg-danger/5 rounded-xl border border-danger/10">
            <ShieldAlert className="size-6 mb-2 opacity-40" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
        ) : promotions.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-1">
                  {UI_TEXT.VOUCHER.FILTER_ACTIVE}
                </p>
                <p className="text-xl font-black text-primary leading-tight">
                  {activePromos.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 transition-all hover:bg-orange-50">
                <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-1">
                  {UI_TEXT.VOUCHER.TABLE_USAGE}
                </p>
                <p className="text-xl font-black text-orange-600 leading-tight">
                  {promotions.reduce((acc, p) => acc + p.usedCount, 0)}
                </p>
              </div>
            </div>

            {topPromo && (
              <div className="group relative p-3 rounded-xl border border-slate-100 bg-slate-50/30 overflow-hidden transition-all hover:border-primary/20 hover:bg-primary/5">
                <div className="flex items-start justify-between relative z-10">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {UI_TEXT.VOUCHER.DETAIL_STATS}
                    </p>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200 truncate">
                      {topPromo.code}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {topPromo.usedCount} {UI_TEXT.VOUCHER.DETAIL_USED}
                    </span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-1 opacity-5 transition-opacity group-hover:opacity-10">
                  <Gift className="size-12 -mr-3 -mt-3 rotate-12" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
            <Ticket className="size-8 mb-2 opacity-20" />
            <span className="text-xs font-medium italic">{UI_TEXT.VOUCHER.EMPTY_LIST}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BillingHistoryPreview({
  records,
  loading,
  error,
}: {
  records: BillingHistoryRecord[];
  loading: boolean;
  error?: string;
}) {
  const recentRecords = records.slice(0, 5);

  return (
    <Card className="h-[clamp(320px,45vh,400px)] min-h-0 overflow-hidden border-none shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <CreditCard className="h-4 w-4 text-primary" />
          <span>{UI_TEXT.ORDER.OVERVIEW.BILLING_HISTORY.TITLE}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto space-y-3">
        {loading ? (
          <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            <span>{UI_TEXT.ORDER.OVERVIEW.BILLING_HISTORY.LOADING}</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-danger/70 bg-danger/5 rounded-xl border border-danger/10">
            <ShieldAlert className="size-6 mb-2 opacity-40" />
            <span className="text-xs font-semibold">{error}</span>
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
                  {record.paymentMethod || UI_TEXT.ORDER.OVERVIEW.BILLING_HISTORY.UNKNOWN_METHOD}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
            <span>{UI_TEXT.ORDER.OVERVIEW.BILLING_HISTORY.EMPTY}</span>
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
