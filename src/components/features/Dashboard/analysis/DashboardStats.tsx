"use client";

import { Banknote, TrendingDown, TrendingUp, Users, UtensilsCrossed } from "lucide-react";
import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { DashboardStats as DashboardStatsType } from "@/types/salesAnalytics.types";

interface DashboardStatsProps {
  stats?: DashboardStatsType;
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
}

function StatCard({ title, value, trend, isUp, icon, chartColor }: StatCardProps) {
  return (
    <Card className="border border-muted/60 shadow-none rounded-xl overflow-hidden bg-white hover:border-primary/20 transition-all group">
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

        <div className="h-10 w-full opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSparklineData}>
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
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const t = UI_TEXT.DASHBOARD.STATS;

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  };

  const revenueValue = stats ? formatCurrency(stats.totalRevenue) : "12.5M";
  const revenueTrend = stats
    ? `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth}%`
    : "+12.5%";
  const ordersValue = stats ? stats.totalOrders.toString() : "48";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t.REVENUE}
        value={revenueValue}
        trend={t.REVENUE_TREND(revenueTrend)}
        isUp={stats ? stats.revenueGrowth >= 0 : true}
        icon={<Banknote className="size-5 text-primary" />}
        chartColor="var(--primary)"
      />
      <StatCard
        title={t.ORDERS}
        value={ordersValue}
        trend={t.ORDERS_TREND("+5.2%")}
        isUp={true}
        icon={<UtensilsCrossed className="size-5 text-sky-500" />}
        chartColor="var(--info)"
      />
      <StatCard
        title={t.TABLES}
        value="12/20"
        trend={t.TABLES_TREND("-2.4%")}
        isUp={false}
        icon={<Users className="size-5 text-emerald-500" />}
        chartColor="var(--success)"
      />
      <StatCard
        title={t.STAFF}
        value="6"
        trend={t.STAFF_TREND}
        isUp={true}
        icon={<Users className="size-5 text-amber-500" />}
        chartColor="var(--warning)"
      />
    </div>
  );
}
