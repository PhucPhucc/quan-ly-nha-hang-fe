"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CategoryDistributionCard } from "@/components/features/sales-analytics/CategoryDistribution";
import { RevenueChart } from "@/components/features/sales-analytics/RevenueChart";
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

interface SalesAnalyticsSectionProps {
  className?: string;
  id?: string;
}

type TimeRange = "day" | "month" | "quarter";

function getQuarterRange(selectedDate: Date) {
  const year = selectedDate.getFullYear();
  const quarter = Math.floor(selectedDate.getMonth() / 3) + 1;
  let startDate: Date;
  let endDate: Date;

  switch (quarter) {
    case 1:
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 2, 31);
      break;
    case 2:
      startDate = new Date(year, 3, 1);
      endDate = new Date(year, 5, 30);
      break;
    case 3:
      startDate = new Date(year, 6, 1);
      endDate = new Date(year, 8, 30);
      break;
    default:
      startDate = new Date(year, 9, 1);
      endDate = new Date(year, 11, 31);
      break;
  }

  return {
    quarter,
    year,
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
}

export function SalesAnalyticsSection({ className, id }: SalesAnalyticsSectionProps) {
  const [data, setData] = useState<SalesAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () => Array.from({ length: 7 }, (_, index) => currentYear - 3 + index),
    [currentYear]
  );
  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, monthIndex) => ({
        value: monthIndex,
        label: format(new Date(2026, monthIndex, 1), "MM"),
      })),
    []
  );

  const handleYearChange = (year: string) => {
    if (!date) return;
    const nextYear = Number(year);
    setDate(new Date(nextYear, date.getMonth(), 1));
  };

  const handleMonthChange = (month: string) => {
    if (!date) return;
    const nextMonth = Number(month);
    setDate(new Date(date.getFullYear(), nextMonth, 1));
  };

  const handleQuarterChange = (quarter: string) => {
    if (!date) return;
    const nextQuarter = Number(quarter);
    const quarterStartMonth = (nextQuarter - 1) * 3;
    setDate(new Date(date.getFullYear(), quarterStartMonth, 1));
  };

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
      } else if (timeRange === "quarter" && date) {
        const quarterRange = getQuarterRange(date);
        const result = await salesAnalyticsService.getSummary(
          quarterRange.startDate,
          quarterRange.endDate
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
      } else if (timeRange === "quarter" && date) {
        const quarterRange = getQuarterRange(date);
        await salesAnalyticsService.exportToExcel({
          startDate: quarterRange.startDate,
          endDate: quarterRange.endDate,
        });
      }
      toast.success(UI_TEXT.SALES_ANALYTICS.EXPORT_SUCCESS);
    } catch {
      toast.error(UI_TEXT.SALES_ANALYTICS.EXPORT_ERROR);
    }
  };

  const selectedQuarter = date ? getQuarterRange(date) : null;

  return (
    <section id={id} className={cn("space-y-6 scroll-mt-24", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {UI_TEXT.SALES_ANALYTICS.TITLE}
          </h2>
          <p className="mt-1 text-muted-foreground">{UI_TEXT.SALES_ANALYTICS.DESCRIPTION}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Select value={timeRange} onValueChange={(v: TimeRange) => setTimeRange(v)}>
            <SelectTrigger className="h-10 w-full bg-card text-[11px] font-bold border-muted/60 sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day" className="text-xs">
                {UI_TEXT.SALES_ANALYTICS.DAILY}
              </SelectItem>
              <SelectItem value="month" className="text-xs">
                {UI_TEXT.SALES_ANALYTICS.MONTHLY}
              </SelectItem>
              <SelectItem value="quarter" className="text-xs">
                {UI_TEXT.SALES_ANALYTICS.QUARTERLY}
              </SelectItem>
            </SelectContent>
          </Select>

          {timeRange === "day" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal glass sm:w-[240px]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{UI_TEXT.SALES_ANALYTICS.SELECT_DATE}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          )}

          {timeRange === "month" && date && (
            <>
              <Select value={String(date.getFullYear())} onValueChange={handleYearChange}>
                <SelectTrigger className="h-10 w-full bg-card text-[11px] font-bold border-muted/60 sm:w-[120px]">
                  <SelectValue placeholder={UI_TEXT.SALES_ANALYTICS.SELECT_YEAR} />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={String(year)} className="text-xs">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={String(date.getMonth())} onValueChange={handleMonthChange}>
                <SelectTrigger className="h-10 w-full bg-card text-[11px] font-bold border-muted/60 sm:w-[120px]">
                  <SelectValue placeholder={UI_TEXT.SALES_ANALYTICS.SELECT_MONTH} />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={String(month.value)} className="text-xs">
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {timeRange === "quarter" && date && (
            <>
              <Select value={String(date.getFullYear())} onValueChange={handleYearChange}>
                <SelectTrigger className="h-10 w-full bg-card text-[11px] font-bold border-muted/60 sm:w-[120px]">
                  <SelectValue placeholder={UI_TEXT.SALES_ANALYTICS.SELECT_YEAR} />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={String(year)} className="text-xs">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(selectedQuarter?.quarter ?? 1)}
                onValueChange={handleQuarterChange}
              >
                <SelectTrigger className="h-10 w-full bg-card text-[11px] font-bold border-muted/60 sm:w-[120px]">
                  <SelectValue placeholder={UI_TEXT.SALES_ANALYTICS.SELECT_QUARTER} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((quarter) => (
                    <SelectItem key={quarter} value={String(quarter)} className="text-xs">
                      {UI_TEXT.SALES_ANALYTICS.QUARTERLY} {quarter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <Button className="gap-2 shadow-glow sm:w-auto" onClick={handleExport}>
            <Download className="h-4 w-4" />
            <span>{UI_TEXT.SALES_ANALYTICS.EXPORT_REPORT}</span>
          </Button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart data={data.revenueChart} loading={loading} />
            </div>
            <div>
              <CategoryDistributionCard data={data.categoryDistribution} loading={loading} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
