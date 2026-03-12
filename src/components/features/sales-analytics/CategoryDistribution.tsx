"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { CategoryDistribution } from "@/types/salesAnalytics.types";

interface CategoryDistributionProps {
  data: CategoryDistribution[];
  loading?: boolean;
}

export function CategoryDistributionCard({ data, loading }: CategoryDistributionProps) {
  const t = UI_TEXT.SALES_ANALYTICS;

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">{t.REVENUE_BY_CATEGORY}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">{UI_TEXT.COMMON.LOADING}</div>
        ) : (
          <div className="space-y-6">
            <div className="flex h-4 w-full rounded-full overflow-hidden bg-muted">
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="h-full"
                  style={{
                    width: `${item.percentage}${UI_TEXT.COMMON.PERCENT}`,
                    backgroundColor: `oklch(${0.6 + idx * 0.05} ${0.15 + idx * 0.02} ${35 + idx * 30})`,
                  }}
                  title={`${item.category}${UI_TEXT.COMMON.COLON}${UI_TEXT.COMMON.SPACE}${item.percentage}${UI_TEXT.COMMON.PERCENT}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm shrink-0"
                    style={{
                      backgroundColor: `oklch(${0.6 + idx * 0.05} ${0.15 + idx * 0.02} ${35 + idx * 30})`,
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium truncate">{item.category}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.percentage}
                      {UI_TEXT.COMMON.PERCENT}
                      {UI_TEXT.COMMON.SPACE}
                      {UI_TEXT.COMMON.PAREN_LEFT}
                      {item.revenue.toLocaleString()}
                      {UI_TEXT.COMMON.CURRENCY}
                      {UI_TEXT.COMMON.PAREN_RIGHT}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
