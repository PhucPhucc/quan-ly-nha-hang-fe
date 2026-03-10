"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Download, MapPin, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import { BestSellersTable } from "@/components/features/sales-analytics/BestSellersTable";
import { CategoryDistributionCard } from "@/components/features/sales-analytics/CategoryDistribution";
import { RevenueChart } from "@/components/features/sales-analytics/RevenueChart";
import { StatsGrid } from "@/components/features/sales-analytics/StatsGrid";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MOCK_SALES_ANALYTICS } from "@/data/mockSalesAnalytics";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { salesAnalyticsService } from "@/services/salesAnalyticsService";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";
import { SalesAnalyticsSummary } from "@/types/salesAnalytics.types";

export default function DashboardPage() {
  const t = UI_TEXT.SALES_ANALYTICS;
  const { employee } = useAuthStore();
  const [data, setData] = useState<SalesAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await salesAnalyticsService.getSummary();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setData(MOCK_SALES_ANALYTICS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => clearInterval(timer);
  }, []);

  const role = employee?.role;
  const isManager = role === EmployeeRole.MANAGER;

  const getRoleName = () => {
    if (role === EmployeeRole.MANAGER) return UI_TEXT.ROLE.MANAGER;
    if (role === EmployeeRole.CHEFBAR) return UI_TEXT.ROLE.CHEF;
    if (role === EmployeeRole.CASHIER) return UI_TEXT.ROLE.CASHIER;
    return UI_TEXT.ROLE.WAITER;
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {UI_TEXT.DASHBOARD.OVERVIEW}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground text-sm">
              {UI_TEXT.DASHBOARD.USER_ROLE(getRoleName())}
            </p>
            {mounted && currentTime && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/40 rounded-full text-[10px] font-medium text-muted-foreground">
                <Clock className="size-3" />
                <span>{currentTime.toLocaleTimeString("vi-VN", { hour12: false })}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal glass",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{t.SELECT_DATE}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Button className="gap-2 shadow-glow">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{t.EXPORT_REPORT}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Grid - Bento Box Layout */}
      {data && (
        <div className="grid gap-6">
          {/* Top Row: Fast Stats */}
          <StatsGrid stats={data.stats} loading={loading} />

          {/* Middle Row: Bento Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Primary Analysis - Large Span */}
            <div className="lg:col-span-8">
              <RevenueChart data={data.revenueChart} loading={loading} />
            </div>

            {/* Secondary Analysis - Tall Span */}
            <div className="lg:col-span-4 h-full">
              <CategoryDistributionCard data={data.categoryDistribution} loading={loading} />
            </div>

            {/* Bottom Row - Full Width for Managers */}
            <div className="lg:col-span-12">
              {isManager ? (
                <BestSellersTable data={data.bestSellers} loading={loading} />
              ) : (
                <div className="p-10 text-center rounded-2xl border-2 border-dashed border-muted bg-muted/20">
                  <p className="text-muted-foreground">{t.MANAGER_ONLY}</p>
                </div>
              )}
            </div>
          </div>

          {/* Manager Quick Insights (FE Logic Only) */}
          {isManager && !loading && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-primary">{t.QUICK_INSIGHTS}</h4>
                  <p className="text-sm text-foreground mt-1">
                    {t.BEST_ITEM_INSIGHT(
                      data.bestSellers[0]?.name || "",
                      data.bestSellers[0]?.percentageOfTotal || 0
                    )}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 flex items-start gap-3">
                <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-blue-600">
                    {t.OPERATIONAL_SUGGESTION}
                  </h4>
                  <p className="text-sm text-foreground mt-1">
                    {t.CATEGORY_INSIGHT(data.categoryDistribution[0]?.category || "")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
