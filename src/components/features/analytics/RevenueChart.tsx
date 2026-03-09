"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { RevenuePoint } from "@/types/analytics.types";

interface RevenueChartProps {
  data: RevenuePoint[];
  loading?: boolean;
}

function RevenueBar({ point, maxValue }: { point: RevenuePoint; maxValue: number }) {
  return (
    <div className="group relative flex flex-1 flex-col items-center">
      <div
        className="w-full rounded-t-sm bg-primary/80 transition-all duration-300 hover:bg-primary"
        style={{
          height: `${(point.revenue / maxValue) * 100}${UI_TEXT.COMMON.PERCENT}`,
        }}
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 rounded bg-foreground px-2 py-1 text-[10px] text-background transition-transform group-hover:scale-100 z-10 whitespace-nowrap">
          {point.revenue.toLocaleString()} {UI_TEXT.COMMON.CURRENCY}
          <br />
          <span className="text-[8px] opacity-70">{point.date}</span>
        </div>
      </div>
      <span className="mt-2 text-[10px] text-muted-foreground origin-left rotate-45 md:rotate-0">
        {point.date.split("-").pop()}
      </span>
    </div>
  );
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const t = UI_TEXT.ANALYTICS;
  const [view, setView] = useState<"daily" | "monthly">("daily");

  const maxValue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{t.REVENUE_OVER_TIME}</CardTitle>
          <p className="text-[10px] text-muted-foreground">{t.REAL_TIME_UPDATE}</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as "daily" | "monthly")}>
          <TabsList className="grid w-[180px] grid-cols-2 h-8">
            <TabsTrigger value="daily" className="text-xs">
              {t.DAILY}
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">
              {t.MONTHLY}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="relative h-[280px] w-full pt-10">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground animate-pulse text-sm">
                {UI_TEXT.COMMON.LOADING}
              </span>
            </div>
          ) : (
            <div className="flex h-full items-end justify-between gap-1.5 px-1.5">
              {data.map((point, idx) => (
                <RevenueBar key={idx} point={point} maxValue={maxValue} />
              ))}
            </div>
          )}

          {/* Grid lines and Peak zones */}
          <div className="absolute inset-0 -z-10 flex flex-col justify-between py-10 opacity-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full border-t border-foreground" />
            ))}
          </div>

          <div className="absolute inset-0 -z-20 pointer-events-none opacity-[0.03] flex justify-center">
            {/* Highlight middle zone as prime time example */}
            <div className="w-[30%] h-full bg-primary mx-auto rounded-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
