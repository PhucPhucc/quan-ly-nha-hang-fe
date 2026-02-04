"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 85 },
  { day: "Thu", value: 70 },
  { day: "Fri", value: 95 },
  { day: "Sat", value: 110 },
  { day: "Sun", value: 105 },
];

export function RevenueChart() {
  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <Card className="flex flex-col border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Weekly Performance</CardTitle>
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
                  ${data.value * 10}
                </div>
              </div>
              <span className="text-muted-foreground text-xs">{data.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] uppercase">Average Daily</span>
            <span className="text-lg font-bold">$1,240.00</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-muted-foreground text-[10px] uppercase">Peak Day</span>
            <span className="text-blue-500 font-bold">Saturday</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
