import { Boxes } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

import { EmptyState, OverviewSkeleton } from "./DashboardHelperComponents";
import { CategorySummary } from "./MenuOverviewDashboardTypes";

interface CategoryMixCardProps {
  isLoading: boolean;
  categoryMix: CategorySummary[];
}

export const CategoryMixCard: React.FC<CategoryMixCardProps> = ({ isLoading, categoryMix }) => {
  return (
    <Card className="border-none shadow-md py-5">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Boxes className="h-4 w-4 text-primary" />
          <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.CATEGORY_MIX}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {UI_TEXT.MENU.OVERVIEW.SECTIONS.CATEGORY_MIX_DESC}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <OverviewSkeleton rows={4} />
        ) : categoryMix.length > 0 ? (
          categoryMix.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{category.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.count} {UI_TEXT.MENU.OVERVIEW.ITEM_UNIT}
                  </p>
                </div>
                <Badge variant="outline" className="table-pill table-pill-info border-0">
                  {category.share}
                  {UI_TEXT.COMMON.PERCENT}
                </Badge>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${Math.max(category.share, 8)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <EmptyState copy={UI_TEXT.MENU.OVERVIEW.EMPTY.CATEGORIES} />
        )}
      </CardContent>
    </Card>
  );
};
