"use client";

import { Edit, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { InventoryCostMethod, InventoryGroup } from "@/types/Inventory";

interface InventoryGroupListProps {
  groups: InventoryGroup[];
  setEditingGroup: (group: InventoryGroup | null) => void;
  setDeletingGroup: (group: InventoryGroup | null) => void;
}

function formatOptionalNumber(value?: number | null) {
  return typeof value === "number" ? value.toString() : "—";
}

function getCostMethodLabel(value?: InventoryCostMethod | null) {
  if (value === InventoryCostMethod.WeightedAverage) {
    return UI_TEXT.INVENTORY.SETTINGS.COST_METHOD_W_AVG;
  }

  return UI_TEXT.INVENTORY.GROUPS.INHERIT_COST_METHOD;
}

export function InventoryGroupList({
  groups,
  setEditingGroup,
  setDeletingGroup,
}: InventoryGroupListProps) {
  return (
    <Card className="gap-0 border-none bg-transparent shadow-none">
      <CardHeader className="bg-transparent border-none pt-5 pb-2 px-0">
        <CardTitle className="text-lg font-bold">{UI_TEXT.INVENTORY.GROUPS.LIST_TITLE}</CardTitle>
        <CardDescription className="text-xs">{UI_TEXT.INVENTORY.GROUPS.LIST_DESC}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {groups.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {UI_TEXT.INVENTORY.GROUPS.EMPTY_TITLE}
          </div>
        ) : (
          <div className="overflow-hidden">
            <TableShell className="my-0">
              <Table>
                <TableHeader>
                  <TableRow variant="header">
                    <TableHead>{UI_TEXT.INVENTORY.GROUPS.NAME}</TableHead>
                    <TableHead>{UI_TEXT.INVENTORY.GROUPS.RULES}</TableHead>
                    <TableHead>{UI_TEXT.INVENTORY.GROUPS.INGREDIENTS}</TableHead>
                    <TableHead className="text-right">{UI_TEXT.INVENTORY.GROUPS.ACTIONS}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.inventoryGroupId}>
                      <TableCell>
                        <div className="">
                          <div className="font-bold text-card-foreground group-hover:text-primary transition-colors">
                            {group.name}
                          </div>
                          {group.description && (
                            <div className="max-w-xs text-xs leading-relaxed text-card-foreground/80">
                              {group.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="rounded-full bg-card px-2.5 py-0.5 text-[10px] font-medium text-card-foreground border"
                          >
                            {UI_TEXT.INVENTORY.GROUPS.LOW_STOCK_THRESHOLD}
                            {UI_TEXT.COMMON.COLON}{" "}
                            <span className="ml-1 text-slate-900">
                              {formatOptionalNumber(group.lowStockThreshold)}
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="rounded-full bg-card px-2.5 py-0.5 text-[10px] font-medium text-card-foreground border"
                          >
                            {UI_TEXT.INVENTORY.GROUPS.EXPIRY_WARNING_DAYS}
                            {UI_TEXT.COMMON.COLON}{" "}
                            <span className="ml-1 text-slate-900">
                              {formatOptionalNumber(group.expiryWarningDays)}
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="rounded-full bg-card px-2.5 py-0.5 text-[10px] font-medium text-card-foreground border"
                          >
                            {getCostMethodLabel(group.defaultCostMethod)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-card-foreground/5 p-1 text-[11px] font-bold text-card-foreground">
                          {group.ingredientCount}
                        </div>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-card-foreground hover:bg-primary/10 hover:text-primary"
                            onClick={() => setEditingGroup(group)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-lg text-card-foreground hover:bg-destructive/10 hover:text-destructive",
                              group.ingredientCount > 0 && "opacity-30 cursor-not-allowed"
                            )}
                            disabled={group.ingredientCount > 0}
                            onClick={() => setDeletingGroup(group)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableShell>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
