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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportRange, setExportRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(),
  });
  const [exportMode, setExportMode] = useState<"range" | "month">("range");
  const [exportMonth, setExportMonth] = useState<number>(new Date().getMonth() + 1);
  const [exportYear, setExportYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      if (exportMode === "month") {
        await salesAnalyticsService.exportToExcel({
          year: exportYear,
          month: exportMonth,
        });
      } else {
        if (!exportRange.from) return;
        await salesAnalyticsService.exportToExcel({
          startDate: format(exportRange.from, "yyyy-MM-dd"),
          endDate: exportRange.to
            ? format(exportRange.to, "yyyy-MM-dd")
            : format(exportRange.from, "yyyy-MM-dd"),
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let result;
        if (viewMode === "monthly") {
          // If a date is selected, use its year/month. Otherwise use current.
          const targetDate = date || new Date();
          result = await salesAnalyticsService.getMonthlySummary(
            targetDate.getFullYear(),
            targetDate.getMonth() + 1
          );
        } else {
          // Daily view. Use selected date formatted as yyyy-MM-dd if available.
          const dateStr = date ? format(date, "yyyy-MM-dd") : undefined;
          result = await salesAnalyticsService.getSummary(dateStr);
        }
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setData(MOCK_SALES_ANALYTICS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode, date]);

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
                <span suppressHydrationWarning>
                  {currentTime.toLocaleTimeString("vi-VN", { hour12: false })}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-muted/50 p-1 rounded-lg border">
            <Button
              variant={viewMode === "daily" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-4 rounded-md transition-all",
                viewMode === "daily" && "shadow-sm"
              )}
              onClick={() => setViewMode("daily")}
            >
              {t.DAILY}
            </Button>
            <Button
              variant={viewMode === "monthly" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-4 rounded-md transition-all",
                viewMode === "monthly" && "shadow-sm"
              )}
              onClick={() => setViewMode("monthly")}
            >
              {t.MONTHLY}
            </Button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal glass",
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

          <Popover>
            <PopoverTrigger asChild>
              <Button className="gap-2 shadow-glow" disabled={exporting}>
                <Download className={cn("h-4 w-4", exporting && "animate-bounce")} />
                <span className="hidden sm:inline">
                  {exporting ? UI_TEXT.COMMON.LOADING : t.EXPORT_REPORT}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 flex flex-col gap-4" align="end">
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-sm leading-none">{t.EXPORT_REPORT}</h4>
              </div>

              <Tabs
                defaultValue="range"
                className="w-full"
                onValueChange={(v) => setExportMode(v as "range" | "month")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="range">{t.EXPORT_BY_RANGE}</TabsTrigger>
                  <TabsTrigger value="month">{t.EXPORT_BY_MONTH}</TabsTrigger>
                </TabsList>
                <TabsContent value="range" className="mt-4 flex flex-col gap-4">
                  <p className="text-xs text-muted-foreground">
                    {UI_TEXT.COMMON.SELECT_DATE_RANGE}
                  </p>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={exportRange.from}
                    selected={{ from: exportRange.from, to: exportRange.to }}
                    onSelect={(range) => setExportRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={1}
                  />
                </TabsContent>
                <TabsContent value="month" className="mt-4 flex flex-col gap-4 min-w-[280px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium">{t.SELECT_MONTH}</label>
                      <Select
                        value={exportMonth.toString()}
                        onValueChange={(v) => setExportMonth(parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <SelectItem key={m} value={m.toString()}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium">{t.SELECT_YEAR}</label>
                      <Select
                        value={exportYear.toString()}
                        onValueChange={(v) => setExportYear(parseInt(v))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: new Date().getFullYear() - 2024 + 1 },
                            (_, i) => new Date().getFullYear() - i
                          ).map((y) => (
                            <SelectItem key={y} value={y.toString()}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                size="sm"
                className="w-full"
                onClick={handleExport}
                disabled={(exportMode === "range" && !exportRange.from) || exporting}
              >
                {exporting ? UI_TEXT.COMMON.LOADING : UI_TEXT.COMMON.CONFIRM}
              </Button>
            </PopoverContent>
          </Popover>
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
              <RevenueChart data={data.revenueChart || []} loading={loading} view={viewMode} />
            </div>

            {/* Secondary Analysis - Tall Span */}
            <div className="lg:col-span-4 h-full">
              <CategoryDistributionCard data={data.categoryDistribution || []} loading={loading} />
            </div>

            {/* Bottom Row - Full Width for Managers */}
            <div className="lg:col-span-12">
              {isManager ? (
                <BestSellersTable data={data.bestSellers || []} loading={loading} />
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
                      data.bestSellers?.[0]?.name || "",
                      data.bestSellers?.[0]?.percentageOfTotal || 0
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
                    {t.CATEGORY_INSIGHT(data.categoryDistribution?.[0]?.category || "")}
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
