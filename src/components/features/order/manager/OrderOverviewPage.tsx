"use client";

import { ClipboardList, CreditCard, LayoutGrid, UtensilsCrossed } from "lucide-react";

import { RecentOrders } from "@/components/features/Dashboard/RecentOrders";
import { InventoryStatCard } from "@/components/features/inventory/components/InventoryStatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { UI_TEXT } from "@/lib/UI_Text";

import {
  AuditLogPreview,
  BillingHistoryPreview,
  DistributionCard,
  PromotionOverviewCard,
} from "./components/OverviewComponents";
import { useOrderOverview } from "./useOrderOverview";

export default function OrderOverviewPage() {
  const {
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
  } = useOrderOverview();

  return (
    <div className="px-4 space-y-6 py-2 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_690px] xl:items-start gap-5">
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
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid grid-cols-2 gap-6">
        <RecentOrders seedOrders={overview?.topActiveOrders ?? []} />
        <BillingHistoryPreview records={billingHistory} loading={loading} error={billingError} />
      </div>

      <PromotionOverviewCard promotions={promotions} loading={loading} error={promoError} />
    </div>
  );
}
