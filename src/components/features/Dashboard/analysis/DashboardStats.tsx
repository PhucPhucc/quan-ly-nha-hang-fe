"use client";

import { Banknote, TrendingDown, TrendingUp, Users, UtensilsCrossed } from "lucide-react";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import {
  DashboardStats as DashboardStatsType,
  OperationalStats,
  RevenuePoint,
} from "@/types/salesAnalytics.types";

interface DashboardStatsProps {
  stats?: DashboardStatsType;
  operational?: OperationalStats | null;
  revenueChart?: RevenuePoint[];
}

const mockSparklineData = [
  { value: 400 },
  { value: 300 },
  { value: 500 },
  { value: 450 },
  { value: 600 },
  { value: 550 },
  { value: 800 },
  { value: 750 },
];

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: React.ReactNode;
  chartColor: string;
  chartData?: { value: number }[];
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      setSize({
        width: Math.max(0, Math.floor(width)),
        height: Math.max(0, Math.floor(height)),
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

function StatCard({ title, value, trend, isUp, icon, chartColor, chartData }: StatCardProps) {
  const displayData = chartData || mockSparklineData;
  const { ref, size } = useElementSize<HTMLDivElement>();
  const canRenderChart = size.width > 0 && size.height > 0;

  return (
    <Card className="min-w-0 border border-muted/60 shadow-none rounded-xl overflow-hidden bg-card hover:border-primary/20 transition-all group">
      <CardContent className="p-0">
        <div className="p-5 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 transition-opacity">
              {title}
            </p>
            <h4 className="text-xl font-bold tracking-tight text-foreground">{value}</h4>
            <div
              className={`flex items-center gap-1.5 text-[10px] font-semibold ${isUp ? "text-emerald-500" : "text-rose-500"}`}
            >
              {isUp ? (
                <TrendingUp size={12} className="shrink-0" />
              ) : (
                <TrendingDown size={12} className="shrink-0" />
              )}
              {trend}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-muted/30 group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
        </div>

        <div
          ref={ref}
          className="h-10 w-full min-w-0 opacity-80 group-hover:opacity-100 transition-opacity"
        >
          {canRenderChart ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={displayData}>
                <defs>
                  <linearGradient
                    id={`gradient-${title.replace(/\s+/g, "-").toLowerCase()}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  strokeWidth={2.5}
                  fill={`url(#gradient-${title.replace(/\s+/g, "-").toLowerCase()})`}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full rounded-full bg-muted/20" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ stats, operational, revenueChart }: DashboardStatsProps) {
  const t = UI_TEXT.DASHBOARD.STATS;

  const compactRevenue = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const revenueValue = stats ? compactRevenue(stats.totalRevenue) : "0";
  const revenueTrend = stats
    ? `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%`
    : "0%";

  const ordersValue = stats ? stats.totalOrders.toString() : "0";
  const orderTrend = stats
    ? `${stats.orderGrowth >= 0 ? "+" : ""}${stats.orderGrowth.toFixed(1)}%`
    : "0%";

  const tablesValue = operational
    ? `${operational.occupiedTables}/${operational.totalTables}`
    : "0/0";
  const tablesTrend = operational ? `${operational.tableOccupancyRate.toFixed(1)}%` : "0%";

  const staffValue = operational ? `${operational.activeStaffCount}` : "0";
  const staffTrend = operational
    ? `${operational.staffTrend >= 0 ? "+" : ""}${operational.staffTrend}`
    : "0";

  // Prepare real sparkline for revenue
  const revenueSparkline = React.useMemo(() => {
    return revenueChart && revenueChart.length > 0
      ? revenueChart.map((p) => ({ value: p.revenue }))
      : null;
  }, [revenueChart]);

  const ordersTrendData = React.useMemo(() => {
    return revenueChart && revenueChart.length > 0
      ? revenueChart.map((p) => ({ value: p.orderCount }))
      : undefined;
  }, [revenueChart]);

  const tablesTrendData = React.useMemo(() => {
    return operational?.tableHistory && operational.tableHistory.length > 0
      ? operational.tableHistory.map((v) => ({ value: v }))
      : undefined;
  }, [operational?.tableHistory]);

  const staffTrendData = React.useMemo(() => {
    return operational?.staffHistory && operational.staffHistory.length > 0
      ? operational.staffHistory.map((v) => ({ value: v }))
      : undefined;
  }, [operational?.staffHistory]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t.REVENUE}
        value={revenueValue}
        trend={t.REVENUE_TREND(revenueTrend)}
        isUp={stats ? stats.revenueGrowth >= 0 : true}
        icon={<Banknote className="size-5 text-primary" />}
        chartColor="var(--primary)"
        chartData={revenueSparkline || undefined}
      />
      <StatCard
        title={t.ORDERS}
        value={ordersValue}
        trend={t.ORDERS_TREND(orderTrend)}
        isUp={stats ? stats.orderGrowth >= 0 : true}
        icon={<UtensilsCrossed className="size-5 text-sky-500" />}
        chartColor="var(--info)"
        chartData={ordersTrendData}
      />
      <StatCard
        title={t.TABLES}
        value={tablesValue}
        trend={t.TABLES_TREND(tablesTrend)}
        isUp={operational ? operational.tableTrend >= 0 : true}
        icon={<Users className="size-5 text-emerald-500" />}
        chartColor="var(--success)"
        chartData={tablesTrendData}
      />
      <StatCard
        title={t.STAFF}
        value={staffValue}
        trend={t.STAFF_TREND(staffTrend)}
        isUp={operational ? operational.staffTrend >= 0 : true}
        icon={<Users className="size-5 text-amber-500" />}
        chartColor="var(--warning)"
        chartData={staffTrendData}
      />
    </div>
  );
}
