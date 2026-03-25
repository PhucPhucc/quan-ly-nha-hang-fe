import { ImageIcon } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

import { ChecklistRow } from "./DashboardHelperComponents";
import { ChecklistData, OptionGroup } from "./MenuOverviewDashboardTypes";

interface ChecklistCardProps {
  isLoading: boolean;
  totalCatalogEntries: number;
  checklist: ChecklistData;
  optionHighlights: OptionGroup[];
  unavailableCount: number;
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  isLoading,
  totalCatalogEntries,
  checklist,
  optionHighlights,
  unavailableCount,
}) => {
  return (
    <Card className="border-none shadow-md py-">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <ImageIcon className="h-4 w-4 text-primary" />
          <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.CHECKLIST}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {UI_TEXT.MENU.OVERVIEW.SECTIONS.CHECKLIST_DESC}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <ChecklistRow
          label={UI_TEXT.MENU.OVERVIEW.CHECKLIST.IMAGE_COVERAGE}
          value={`${checklist.entriesWithImage}/${totalCatalogEntries}`}
          hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.IMAGE_HINT}
          isLoading={isLoading}
        />
        <ChecklistRow
          label={UI_TEXT.MENU.OVERVIEW.CHECKLIST.COST_COVERAGE}
          value={`${checklist.entriesWithCost}/${totalCatalogEntries}`}
          hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.COST_HINT}
          isLoading={isLoading}
        />
        <ChecklistRow
          label={UI_TEXT.MENU.OVERVIEW.CHECKLIST.OPTION_COVERAGE}
          value={`${checklist.groupsInUse}/${checklist.totalGroups}`}
          hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.OPTION_HINT}
          isLoading={isLoading}
        />
        <ChecklistRow
          label={UI_TEXT.MENU.OVERVIEW.STATS.UNAVAILABLE}
          value={String(unavailableCount)}
          hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.UNAVAILABLE_HINT}
          isLoading={isLoading}
          tone={unavailableCount > 0 ? "warning" : "default"}
        />

        {!isLoading && optionHighlights.length > 0 ? (
          <div className="rounded-xl border border-dashed px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {UI_TEXT.MENU.OVERVIEW.SECTIONS.OPTION_HIGHLIGHTS}
            </p>
            <div className="flex flex-wrap gap-2">
              {optionHighlights.map((group) => (
                <Badge
                  key={group.optionGroupId}
                  variant="outline"
                  className="table-pill table-pill-info border-0"
                >
                  {group.name} {UI_TEXT.COMMON.DOT_SEP} {group.usageCount ?? 0}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
