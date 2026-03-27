"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Layout, RefreshCw, Users, Utensils } from "lucide-react";
import React, { useMemo } from "react";

import { InventoryStatCard } from "@/components/features/inventory/components/InventoryStatCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useTableSignalR } from "@/hooks/useTableSignalR";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { getSystemAuditLogs } from "@/services/auditService";
import { tableService } from "@/services/tableService";
import { TableStatus } from "@/types/Table-Layout";

import { AreaDistributionCard } from "./components/AreaDistributionCard";
import { AuditLogSection } from "./components/AuditLogSection";
import { StatusSummaryCard } from "./components/StatusSummaryCard";

export function TableOverviewDashboard() {
  const queryClient = useQueryClient();

  // Listen to realtime table changes and refetch all-tables query when a change happens
  useTableSignalR(() => {
    queryClient.invalidateQueries({ queryKey: ["all-tables"] });
  });

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
    <div className="px-4 space-y-6 py-2 animate-in fade-in duration-500">
      <PageHeader
        icon={Layout}
        title={UI_TEXT.TABLE.OVERVIEW.TITLE}
        description={UI_TEXT.TABLE.OVERVIEW.DESCRIPTION}
        actions={
          <div className="flex flex-wrap items-center gap-2">
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
        }
      />

      <div className="grid grid-cols-1 gap-2.5 px-4 md:grid-cols-2 xl:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <StatusSummaryCard stats={stats} isLoading={tablesLoading} />
        <AreaDistributionCard areas={areas} tables={tables} isLoading={areasLoading} />
      </div>
      <div className="gap-4 px-4">
        <AuditLogSection logs={logs} isLoading={auditLoading} />
      </div>
    </div>
  );
}
