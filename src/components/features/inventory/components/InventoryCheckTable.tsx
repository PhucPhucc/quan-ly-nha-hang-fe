"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { formatInventoryQuantity, normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryCheckItem } from "@/types/Inventory";

interface InventoryCheckTableProps {
  items: Partial<InventoryCheckItem>[];
  isProcessed: boolean;
  isSaving: boolean;
  updatePhysicalQty: (ingredientId: string, val: number) => void;
  updateReason: (ingredientId: string, reason: string) => void;
}

export function InventoryCheckTable({
  items,
  isProcessed,
  isSaving,
  updatePhysicalQty,
  updateReason,
}: InventoryCheckTableProps) {
  return (
    <div className="rounded-xl">
      <TableShell>
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_SKU}</TableHead>
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_NAME}</TableHead>
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_STOCK}</TableHead>
              <TableHead className="w-24">
                {UI_TEXT.INVENTORY.CHECK.CREATE.COL_PHYSICAL_QTY}
              </TableHead>
              <TableHead className="text-right">
                {UI_TEXT.INVENTORY.CHECK.CREATE.COL_DIFF_QTY}
              </TableHead>
              <TableHead>{UI_TEXT.INVENTORY.CHECK.CREATE.COL_REASON}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const diff = normalizeInventoryQuantity(item.differenceQuantity || 0);
              const diffColor =
                diff > 0
                  ? "text-emerald-600"
                  : diff < 0
                    ? "text-rose-600"
                    : "text-card-foreground/60";

              return (
                <TableRow
                  key={item.ingredientId}
                  className="text-card-foreground data-[state=selected]:bg-primary/10"
                >
                  <TableCell>
                    <span className="inline-flex rounded-md bg-card-foreground/10 px-2.5 py-1 text-[10px] font-bold text-card-foreground uppercase">
                      {item.ingredientCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold">{item.ingredientName}</span>
                      <span className="text-[10px] font-medium text-card-foreground/60 uppercase tracking-widest">
                        {item.unit || UI_TEXT.COMMON.DASH}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold font-mono">
                    {formatInventoryQuantity(item.bookQuantity || 0)}
                  </TableCell>
                  <TableCell className="px-3">
                    <Input
                      type="number"
                      step="0.001"
                      disabled={isProcessed || isSaving}
                      value={item.physicalQuantity}
                      onChange={(e) =>
                        updatePhysicalQty(item.ingredientId!, Number(e.target.value))
                      }
                    />
                  </TableCell>
                  <TableCell className={`text-right font-semibold font-mono ${diffColor}`}>
                    {diff > 0
                      ? `${UI_TEXT.INVENTORY.TABLE.PLUS_SIGN}${formatInventoryQuantity(diff)}`
                      : formatInventoryQuantity(diff)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <Input
                      disabled={isProcessed || isSaving}
                      value={item.reason || ""}
                      onChange={(e) => updateReason(item.ingredientId!, e.target.value)}
                      placeholder={
                        item.differenceQuantity !== 0
                          ? UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION
                          : ""
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableShell>
    </div>
  );
}
