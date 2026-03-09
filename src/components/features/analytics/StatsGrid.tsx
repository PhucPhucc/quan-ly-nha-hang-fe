"use client";

import { BarChart3, DollarSign, ShoppingCart, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/types/analytics.types";

interface StatsGridProps {
  stats: DashboardStats;
  loading?: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  const t = UI_TEXT.ANALYTICS;

  // Monthly revenue target (example: 200M VND)
  const SALES_TARGET = 200000000;
  const progressPercent = Math.min(Math.round((stats.totalRevenue / SALES_TARGET) * 100), 100);

  const items = [
    {
      title: t.TOTAL_REVENUE,
      value: `${stats.totalRevenue.toLocaleString()}${UI_TEXT.COMMON.CURRENCY}`,
      growth: stats.revenueGrowth,
      icon: DollarSign,
      color: "text-primary",
      extra: (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-medium">
            <span className="text-muted-foreground">
              {t.SALES_TARGET_LABEL} {SALES_TARGET.toLocaleString()}
              {UI_TEXT.COMMON.CURRENCY}
            </span>
            <span className="text-primary">
              {progressPercent}
              {UI_TEXT.COMMON.PERCENT}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full bg-primary shadow-glow transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}${UI_TEXT.COMMON.PERCENT}` }}
            />
          </div>
        </div>
      ),
    },
    {
      title: t.TOTAL_ORDERS,
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-500",
      extra: (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] text-muted-foreground">{t.STABLE_OPERATIONS}</span>
        </div>
      ),
    },
    {
      title: t.AVG_ORDER_VALUE,
      value: `${stats.avgOrderValue.toLocaleString()}${UI_TEXT.COMMON.CURRENCY}`,
      icon: BarChart3,
      color: "text-emerald-500",
      extra: (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {t.TOP_CATEGORY}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item, idx) => (
        <Card
          key={idx}
          className="glass-card group overflow-hidden transition-all hover:shadow-glow-sm"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "rounded-xl bg-primary/10 p-2.5 transition-transform group-hover:scale-110",
                  item.color
                    .replace("text-", "bg-")
                    .replace("500", "50")
                    .replace("primary", "primary/10")
                )}
              >
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              {item.growth !== undefined && (
                <Badge
                  variant={item.growth >= 0 ? "default" : "destructive"}
                  className="gap-1 font-bold shadow-sm"
                >
                  {item.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(item.growth)}
                  {UI_TEXT.COMMON.PERCENT}
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                {item.title}
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-foreground">
                {loading ? <div className="h-8 w-24 animate-pulse rounded bg-muted" /> : item.value}
              </h3>
            </div>
            {item.extra}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
