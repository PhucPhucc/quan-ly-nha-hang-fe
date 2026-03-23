"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Layout, RefreshCw, Users, Utensils } from "lucide-react";
import React, { useMemo } from "react";

import { InventoryStatCard } from "@/components/features/inventory/components/InventoryStatCard";
import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { getSystemAuditLogs } from "@/services/auditService";
import { tableService } from "@/services/tableService";
import { TableStatus } from "@/types/Table-Layout";

import { AreaDistributionCard } from "./components/AreaDistributionCard";
import { AuditLogSection } from "./components/AuditLogSection";
import { StatusSummaryCard } from "./components/StatusSummaryCard";

export function TableOverviewDashboard() {
  const {
    data: areasData,
    isLoading: areasLoading,
    refetch: refetchAreas,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: () => tableService.getAreas(),
  });

  const {
    data: tablesData,
    isLoading: tablesLoading,
    refetch: refetchTables,
  } = useQuery({
    queryKey: ["all-tables"],
    queryFn: () => tableService.getTables(),
  });

  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: ["table-audit-logs"],
    queryFn: () => getSystemAuditLogs({ entityNameFilter: "Table", pageSize: 5 }),
  });

  const areas = useMemo(() => areasData?.data || [], [areasData]);
  const tables = useMemo(() => tablesData?.data || [], [tablesData]);
  const logs = useMemo(() => auditData?.data?.items || [], [auditData]);

  const stats = useMemo(() => {
    const totalTables = tables.length;
    const occupied = tables.filter((t) => t.status === TableStatus.Occupied).length;
    const reserved = tables.filter((t) => t.status === TableStatus.Reserved).length;
    const available = tables.filter((t) => t.status === TableStatus.Available).length;
    const outOfService = tables.filter((t) => t.status === TableStatus.OutOfService).length;
    const totalSeats = tables.reduce((acc, t) => acc + t.capacity, 0);

    const occupancyRate = totalTables > 0 ? Math.round((occupied / totalTables) * 100) : 0;

    return {
      totalTables,
      occupied,
      reserved,
      available,
      outOfService,
      totalSeats,
      occupancyRate,
      totalAreas: areas.length,
    };
  }, [tables, areas]);

  const handleRefresh = () => {
    refetchAreas();
    refetchTables();
  };

  const isRefreshing = areasLoading || tablesLoading;

  return (
    <div className={cn(INVENTORY_PAGE_CLASS, "gap-4 pb-8")}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{UI_TEXT.TABLE.OVERVIEW.TITLE}</h1>
            <p className="text-[11px] text-muted-foreground">
              {UI_TEXT.TABLE.OVERVIEW.DESCRIPTION}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2 rounded-xl text-xs"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            {UI_TEXT.TABLE.OVERVIEW.REFRESH}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InventoryStatCard
          icon={Layout}
          label={UI_TEXT.TABLE.OVERVIEW.TOTAL_TABLES}
          value={stats.totalTables}
          isLoading={tablesLoading}
          compact
        />
        <InventoryStatCard
          icon={Users}
          label={UI_TEXT.TABLE.OVERVIEW.TOTAL_SEATS}
          value={stats.totalSeats}
          isLoading={tablesLoading}
          variant="info"
          compact
        />
        <InventoryStatCard
          icon={Utensils}
          label={UI_TEXT.TABLE.OVERVIEW.OCCUPANCY_RATE}
          value={`${stats.occupancyRate}${UI_TEXT.COMMON.PERCENT}`}
          isLoading={tablesLoading}
          variant={
            stats.occupancyRate > 80 ? "danger" : stats.occupancyRate > 50 ? "warning" : "success"
          }
          compact
        />
        <InventoryStatCard
          icon={ArrowRight}
          label={UI_TEXT.TABLE.OVERVIEW.TOTAL_AREAS}
          value={stats.totalAreas}
          isLoading={areasLoading}
          compact
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <StatusSummaryCard stats={stats} isLoading={tablesLoading} className="h-full" />
        </div>

        <div className="lg:col-span-2">
          <AreaDistributionCard
            areas={areas}
            tables={tables}
            isLoading={areasLoading}
            className="h-full"
          />
        </div>
      </div>

      <AuditLogSection logs={logs} isLoading={auditLoading} />
    </div>
  );
}
