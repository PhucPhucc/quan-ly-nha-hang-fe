"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import React, { useEffect, useState } from "react";

import { BestSellersTable } from "@/components/features/analytics/BestSellersTable";
import { CategoryDistributionCard } from "@/components/features/analytics/CategoryDistribution";
import { RevenueChart } from "@/components/features/analytics/RevenueChart";
import { StatsGrid } from "@/components/features/analytics/StatsGrid";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MOCK_ANALYTICS } from "@/data/mockAnalytics";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { analyticsService } from "@/services/analyticsService";
import { AnalyticsSummary } from "@/types/analytics.types";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await analyticsService.getSummary();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        // Fallback to mock data for demonstration purposes as per user request
        setData(MOCK_ANALYTICS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {UI_TEXT.ANALYTICS.TITLE}
          </h1>
          <p className="text-muted-foreground mt-1">{UI_TEXT.ANALYTICS.DESCRIPTION}</p>
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
                {date ? format(date, "PPP") : <span>{UI_TEXT.ANALYTICS.SELECT_DATE}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Button className="gap-2 shadow-glow">
            <Download className="h-4 w-4" />
            <span>{UI_TEXT.ANALYTICS.EXPORT_REPORT}</span>
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
