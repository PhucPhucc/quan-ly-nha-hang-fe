import { ChefHat } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { EmptyState, OverviewSkeleton } from "./DashboardHelperComponents";
import { StationSummary } from "./MenuOverviewDashboardTypes";

interface StationReadinessCardProps {
  isLoading: boolean;
  stationSummaries: StationSummary[];
}

export const StationReadinessCard: React.FC<StationReadinessCardProps> = ({
  isLoading,
  stationSummaries,
}) => {
  return (
    <Card className="border-none shadow-md py-5">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <ChefHat className="h-4 w-4 text-primary" />
          <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.STATION_READINESS}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {UI_TEXT.MENU.OVERVIEW.SECTIONS.STATION_READINESS_DESC}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <OverviewSkeleton rows={3} />
        ) : stationSummaries.some((station) => station.count > 0) ? (
          stationSummaries.map((station) => (
            <div
              key={station.key}
              className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{station.label}</p>
                <p className="text-xs text-muted-foreground">
                  {station.averageTime > 0
                    ? `${station.averageTime} ${UI_TEXT.MENU.OVERVIEW.AVG_PREP_SUFFIX}`
                    : UI_TEXT.MENU.OVERVIEW.EMPTY.STATION_NO_DATA}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "border-0",
                  station.count > 0
                    ? "table-pill table-pill-primary"
                    : "table-pill table-pill-neutral"
                )}
              >
                {station.count} {UI_TEXT.MENU.OVERVIEW.ITEM_UNIT}
              </Badge>
            </div>
          ))
        ) : (
          <EmptyState copy={UI_TEXT.MENU.OVERVIEW.EMPTY.STATIONS} />
        )}
      </CardContent>
    </Card>
  );
};
