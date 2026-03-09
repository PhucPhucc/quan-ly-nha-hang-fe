"use client";

import { Package, Star, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

interface BestSellersSummaryProps {
  topCategory: string;
  topCategoryPercent: number;
  mostProfitable: string;
  totalSales: number;
  loading?: boolean;
}

export function BestSellersSummary({
  topCategory,
  topCategoryPercent,
  mostProfitable,
  totalSales,
  loading,
}: BestSellersSummaryProps) {
  const t = UI_TEXT.ANALYTICS;

  const summary = [
    {
      label: t.TOP_CATEGORY,
      value: `${topCategory}${UI_TEXT.COMMON.SPACE}${UI_TEXT.COMMON.PAREN_LEFT}${topCategoryPercent}${UI_TEXT.COMMON.PERCENT}${UI_TEXT.COMMON.PAREN_RIGHT}`,
      icon: Trophy,
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-amber-600",
    },
    {
      label: t.MOST_PROFITABLE,
      value: mostProfitable,
      icon: Star,
      bgColor: "bg-rose-100 dark:bg-rose-900/20",
      iconColor: "text-rose-600",
    },
    {
      label: t.TOTAL_ITEM_SALES,
      value: totalSales.toLocaleString(),
      icon: Package,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {summary.map((item, idx) => (
        <Card key={idx} className="glass border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-2 rounded-xl ${item.bgColor}`}>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                {item.label}
              </p>
              <p className="text-sm font-bold text-foreground truncate">
                {loading ? UI_TEXT.COMMON.ELLIPSIS : item.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
