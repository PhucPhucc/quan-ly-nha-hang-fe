"use client";

import { format } from "date-fns";
import { ChevronRight, Clock, Rocket, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { DashboardStats } from "@/components/features/Dashboard/analysis/DashboardStats";
import { InventoryAlertWidget } from "@/components/features/Dashboard/analysis/InventoryAlertWidget";
import { KdsBacklogWidget } from "@/components/features/Dashboard/analysis/KdsBacklogWidget";
import { RealTimeAlertStrip } from "@/components/features/Dashboard/analysis/RealTimeAlertStrip";
import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/UI_Text";
import { dashboardService } from "@/services/dashboardService";
import { salesAnalyticsService } from "@/services/salesAnalyticsService";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";
import { OperationalStats, SalesAnalyticsSummary } from "@/types/salesAnalytics.types";

export default function DashboardPage() {
  const t = UI_TEXT.DASHBOARD;
  const { employee } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [analyticsData, setAnalyticsData] = useState<SalesAnalyticsSummary | null>(null);
  const [operationalStats, setOperationalStats] = useState<OperationalStats | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        const [analyticsResult, operationalResult] = await Promise.all([
          salesAnalyticsService.getSummary(today),
          dashboardService.getOperationalStats(),
        ]);

        setAnalyticsData(analyticsResult);
        if (operationalResult.isSuccess) {
          setOperationalStats(operationalResult.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    if (mounted) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [mounted]);

  const getRoleName = () => {
    const role = employee?.role;
    if (role === EmployeeRole.MANAGER) return UI_TEXT.ROLE.MANAGER;
    if (role === EmployeeRole.CHEFBAR) return UI_TEXT.ROLE.CHEF;
    if (role === EmployeeRole.CASHIER) return UI_TEXT.ROLE.CASHIER;
    return UI_TEXT.ROLE.WAITER;
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <RealTimeAlertStrip />

      <div className="flex-1 p-6 md:p-8 max-w-400 mx-auto w-full space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-primary/10 rounded-xl shadow-sm border border-primary/5">
                <Rocket className="size-6 text-primary" />
              </div>
              {t.OVERVIEW}
              <Badge
                variant="outline"
                className="hidden sm:flex border-primary/20 text-primary bg-primary/5 uppercase font-black tracking-tighter"
              >
                {t.ANALYTICS.LIVE_MONITORING}
              </Badge>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground text-sm font-medium">
                {t.USER_ROLE(getRoleName())}
              </p>
              {currentTime && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/40 rounded-full text-[10px] font-medium text-foreground">
                  <Clock className="size-3" />
                  <span suppressHydrationWarning>
                    {currentTime.toLocaleTimeString("vi-VN", { hour12: false })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 items-center gap-2 px-3 rounded-xl bg-card shadow-sm border text-[11px] font-bold text-foreground">
              <Zap className="size-3 text-warning fill-warning" />
              {t.SIGNALR_CONNECTED}
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text--foreground opacity-60">
            {t.ANALYTICS.KPI_TITLE} {t.KPI_LABEL}
          </h3>
          <DashboardStats
            stats={analyticsData?.stats}
            operational={operationalStats}
            revenueChart={analyticsData?.revenueChart}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground opacity-60">
            {t.OPERATIONS.TITLE}
          </h3>
          <div className="grid gap-6 lg:grid-cols-3 min-h-108">
            <div className="lg:col-span-1">
              <KdsBacklogWidget />
            </div>
            <div className="lg:col-span-1">
              <InventoryAlertWidget />
            </div>
            <div className="lg:col-span-1 h-full">
              <div className="h-full bg-card rounded-2xl shadow-sm p-6 border flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-70">
                    {t.ANALYTICS.BEST_SELLERS_ANALYSIS}
                  </h4>
                  <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                    <Trophy className="size-4 text-amber-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  {analyticsData?.bestSellers.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                      <div className="size-8 rounded-lg bg-muted/40 flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-muted/20">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-primary">{item.quantitySold}</p>
                        <p className="text-[8px] font-bold text-muted-foreground/50 uppercase">
                          {UI_TEXT.SALES_ANALYTICS.QUANTITY}
                        </p>
                      </div>
                    </div>
                  ))}

                  {!analyticsData && (
                    <div className="space-y-3 opacity-20">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 bg-muted rounded-xl animate-pulse" />
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/manager/sales-analytics"
                  className="mt-6 text-[10px] font-black text-primary uppercase tracking-widest text-center hover:underline bg-primary/5 py-2.5 rounded-xl border border-primary/10 flex items-center justify-center gap-2"
                >
                  {t.ANALYTICS.QUICK_INSIGHTS}
                  <ChevronRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
