"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { salesAnalyticsService } from "@/services/salesAnalyticsService";
import { SalesAnalyticsSummary } from "@/types/salesAnalytics.types";

export default function AnalyticsPage() {
  const [data, setData] = useState<SalesAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeRange, setTimeRange] = useState<"day" | "month">("day");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (timeRange === "day" && date) {
        const formattedDate = format(date, "yyyy-MM-dd");
        const result = await salesAnalyticsService.getSummary(formattedDate);
        setData(result);
      } else if (timeRange === "month" && date) {
        const result = await salesAnalyticsService.getMonthlySummary(
          date.getFullYear(),
          date.getMonth() + 1
        );
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error(UI_TEXT.COMMON.ERROR);
    } finally {
      setLoading(false);
    }
  }, [date, timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async () => {
    try {
      if (timeRange === "day" && date) {
        await salesAnalyticsService.exportToExcel({ date: format(date, "yyyy-MM-dd") });
      } else if (timeRange === "month" && date) {
        await salesAnalyticsService.exportToExcel({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
        });
      }
      toast.success(UI_TEXT.SALES_ANALYTICS.EXPORT_SUCCESS);
    } catch {
      toast.error(UI_TEXT.SALES_ANALYTICS.EXPORT_ERROR);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {UI_TEXT.SALES_ANALYTICS.TITLE}
          </h1>
          <p className="text-muted-foreground mt-1">{UI_TEXT.SALES_ANALYTICS.DESCRIPTION}</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(v: "day" | "month") => setTimeRange(v)}>
            <SelectTrigger className="h-10 w-[120px] bg-card text-[11px] font-bold border-muted/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day" className="text-xs">
                {UI_TEXT.SALES_ANALYTICS.DAILY}
              </SelectItem>
              <SelectItem value="month" className="text-xs">
                {UI_TEXT.SALES_ANALYTICS.MONTHLY}
              </SelectItem>
            </SelectContent>
          </Select>

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
                {date ? (
                  timeRange === "day" ? (
                    format(date, "PPP")
                  ) : (
                    format(date, "MMMM yyyy")
                  )
                ) : (
                  <span>{UI_TEXT.SALES_ANALYTICS.SELECT_DATE}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Button className="gap-2 shadow-glow" onClick={handleExport}>
            <Download className="h-4 w-4" />
            <span>{UI_TEXT.SALES_ANALYTICS.EXPORT_REPORT}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      {data && (
        <>
          <StatsGrid stats={data.stats} loading={loading} />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart data={data.revenueChart} loading={loading} />
            </div>
            <div>
              <CategoryDistributionCard data={data.categoryDistribution} loading={loading} />
            </div>
          </div>

          <BestSellersTable data={data.bestSellers} loading={loading} />
        </>
      )}
    </div>
  );
}
