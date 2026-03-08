"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

export function RevenueChart() {
  const t = UI_TEXT.DASHBOARD.REVENUE_CHART;
  const chartData = [
    { day: t.DAYS.MON, value: 65 },
    { day: t.DAYS.TUE, value: 45 },
    { day: t.DAYS.WED, value: 85 },
    { day: t.DAYS.THU, value: 70 },
    { day: t.DAYS.FRI, value: 95 },
    { day: t.DAYS.SAT, value: 110 },
    { day: t.DAYS.SUN, value: 105 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <Card className="flex flex-col border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t.TITLE}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex h-[200px] items-end justify-between gap-2 pt-4">
          {chartData.map((data) => (
            <div key={data.day} className="group relative flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-linear-to-t from-blue-600 to-indigo-400 transition-all duration-500 hover:from-blue-500 hover:to-indigo-300"
                style={{ height: `${(data.value / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {(data.value * 10000).toLocaleString()}
                  {UI_TEXT.COMMON.CURRENCY}
                </div>
              </div>
              <span className="text-muted-foreground text-xs">{data.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] uppercase">{t.AVG_DAILY}</span>
            <span className="text-lg font-bold">
              {(1240000).toLocaleString()}
              {UI_TEXT.COMMON.CURRENCY}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-muted-foreground text-[10px] uppercase">{t.PEAK_DAY}</span>
            <span className="text-blue-500 font-bold">{t.DAYS.SAT}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
