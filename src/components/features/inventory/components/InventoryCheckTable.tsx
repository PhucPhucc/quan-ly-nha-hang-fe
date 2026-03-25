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
} from "@/components/ui/table";
import { formatInventoryQuantity, normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryCheckItem } from "@/types/Inventory";

import { INVENTORY_TH_CLASS, INVENTORY_THEAD_ROW_CLASS } from "./inventoryStyles";

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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-[500px] flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 shadow-sm">
            <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
              <TableHead className={`${INVENTORY_TH_CLASS} pl-6`}>
                {UI_TEXT.INVENTORY.TABLE.COL_SKU}
              </TableHead>
              <TableHead className={INVENTORY_TH_CLASS}>
                {UI_TEXT.INVENTORY.TABLE.COL_NAME}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_STOCK}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} w-[140px] text-center`}>
                {UI_TEXT.INVENTORY.CHECK.CREATE.COL_PHYSICAL_QTY}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.CHECK.CREATE.COL_DIFF_QTY}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} pr-6`}>
                {UI_TEXT.INVENTORY.CHECK.CREATE.COL_REASON}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const diff = normalizeInventoryQuantity(item.differenceQuantity || 0);
              const diffColor =
                diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-600" : "text-slate-400";

              return (
                <TableRow
                  key={item.ingredientId}
                  className="h-[60px] border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="pl-6">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase">
                      {item.ingredientCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-slate-800">
                        {item.ingredientName}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        {item.unit || UI_TEXT.COMMON.DASH}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold font-mono text-slate-700">
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
                      className="h-9 text-center font-semibold bg-slate-50 border-slate-200 focus:bg-white focus:ring-primary/10 rounded-lg shadow-none"
                    />
                  </TableCell>
                  <TableCell className={`text-center font-semibold font-mono ${diffColor}`}>
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
                      className="h-10 bg-transparent border-none px-0 text-sm font-medium text-slate-600 focus-visible:ring-0 placeholder:text-slate-300 italic"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="h-12 bg-slate-50/50 border-t border-slate-100" />
    </div>
  );
}
