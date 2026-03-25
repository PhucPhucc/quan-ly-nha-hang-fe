import { Clock3 } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { EmptyState, OverviewSkeleton } from "./DashboardHelperComponents";
import { PriorityEntry } from "./MenuOverviewDashboardTypes";

interface PriorityCardProps {
  isLoading: boolean;
  priorityItems: PriorityEntry[];
}

export const PriorityCard: React.FC<PriorityCardProps> = ({ isLoading, priorityItems }) => {
  return (
    <Card className="border-none shadow-md py-5">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Clock3 className="h-4 w-4 text-primary" />
          <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.PRIORITY}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {UI_TEXT.MENU.OVERVIEW.SECTIONS.PRIORITY_DESC}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <OverviewSkeleton rows={4} />
        ) : priorityItems.length > 0 ? (
          priorityItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.type === "combo" ? UI_TEXT.MENU.TAB_COMBO : UI_TEXT.MENU.TAB_ITEM}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {item.reasons.map((reason) => (
                  <Badge
                    key={`${item.id}-${reason}`}
                    variant="outline"
                    className={cn(
                      "border-0",
                      reason === UI_TEXT.MENU.OVERVIEW.REASONS.OUT_OF_STOCK
                        ? "table-pill table-pill-warning"
                        : "table-pill table-pill-neutral"
                    )}
                  >
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState copy={UI_TEXT.MENU.OVERVIEW.EMPTY.PRIORITY} />
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild size="sm" className="rounded-xl text-xs">
            <Link href="/manager/menu/list">{UI_TEXT.MENU.OVERVIEW.ACTIONS.CATALOG}</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href="/manager/menu/options">{UI_TEXT.MENU.OVERVIEW.ACTIONS.OPTIONS}</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
            <Link href="/manager/menu/list">{UI_TEXT.MENU.OVERVIEW.ACTIONS.RECIPES}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
