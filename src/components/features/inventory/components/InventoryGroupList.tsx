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
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { InventoryCostMethod, InventoryGroup } from "@/types/Inventory";

import {
  INVENTORY_SURFACE_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
} from "./inventoryStyles";

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
    <Card className={INVENTORY_SURFACE_CLASS}>
      <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-5">
        <CardTitle className="text-lg font-bold">{UI_TEXT.INVENTORY.GROUPS.LIST_TITLE}</CardTitle>
        <CardDescription className="text-xs">{UI_TEXT.INVENTORY.GROUPS.LIST_DESC}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            {UI_TEXT.INVENTORY.GROUPS.EMPTY_TITLE}
          </div>
        ) : (
          <div className="overflow-hidden">
            <Table>
              <TableHeader className={INVENTORY_THEAD_CLASS}>
                <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                  <TableHead className={cn(INVENTORY_TH_CLASS, "pl-6")}>
                    {UI_TEXT.INVENTORY.GROUPS.NAME}
                  </TableHead>
                  <TableHead className={INVENTORY_TH_CLASS}>
                    {UI_TEXT.INVENTORY.GROUPS.RULES}
                  </TableHead>
                  <TableHead className={cn(INVENTORY_TH_CLASS, "text-center")}>
                    {UI_TEXT.INVENTORY.GROUPS.INGREDIENTS}
                  </TableHead>
                  <TableHead className={cn(INVENTORY_TH_CLASS, "pr-6 text-right")}>
                    {UI_TEXT.INVENTORY.GROUPS.ACTIONS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow
                    key={group.inventoryGroupId}
                    className="group border-b border-slate-100/80 hover:bg-slate-50/50"
                  >
                    <TableCell className="py-5 pl-6 align-top">
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {group.name}
                        </div>
                        {group.description && (
                          <div className="max-w-xs text-[11px] leading-relaxed text-slate-500">
                            {group.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full bg-slate-50/50 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 border-slate-200"
                        >
                          {UI_TEXT.INVENTORY.GROUPS.LOW_STOCK_THRESHOLD}
                          {UI_TEXT.COMMON.COLON}{" "}
                          <span className="ml-1 text-slate-900">
                            {formatOptionalNumber(group.lowStockThreshold)}
                          </span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full bg-slate-50/50 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 border-slate-200"
                        >
                          {UI_TEXT.INVENTORY.GROUPS.EXPIRY_WARNING_DAYS}
                          {UI_TEXT.COMMON.COLON}{" "}
                          <span className="ml-1 text-slate-900">
                            {formatOptionalNumber(group.expiryWarningDays)}
                          </span>
                        </Badge>
                        <Badge
                          variant="outline"
                          className="rounded-full bg-slate-50/50 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 border-slate-200"
                        >
                          {getCostMethodLabel(group.defaultCostMethod)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 text-center align-top">
                      <div className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-slate-100 px-2 text-[11px] font-bold text-slate-700">
                        {group.ingredientCount}
                      </div>
                    </TableCell>
                    <TableCell className="py-5 pr-6 align-top">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-slate-400 hover:bg-primary/10 hover:text-primary"
                          onClick={() => setEditingGroup(group)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 rounded-lg text-slate-400 hover:bg-destructive/10 hover:text-destructive",
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
