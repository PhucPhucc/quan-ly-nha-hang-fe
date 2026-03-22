import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryStockAlertItem } from "@/types/Inventory";

import {
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./inventoryStyles";

interface LowStockTabContentProps {
  items: InventoryStockAlertItem[];
}

export function LowStockTabContent({ items }: LowStockTabContentProps) {
  return (
    <TabsContent value="low-stock" className="m-0 border-none outline-none">
      <div className={INVENTORY_TABLE_CONTAINER_CLASS}>
        <Table>
          <TableHeader className={INVENTORY_THEAD_CLASS}>
            <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
              <TableHead className={`${INVENTORY_TH_CLASS} pl-8`}>
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
              </TableHead>
              <TableHead className={INVENTORY_TH_CLASS}>
                {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_CURRENT_STOCK}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_THRESHOLD}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} pr-8 text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_STATUS}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground/30 font-medium italic"
                >
                  {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.ingredientId || index} className={INVENTORY_TROW_CLASS}>
                  <TableCell className="pl-8 font-mono text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tight">
                    {item.ingredientCode || UI_TEXT.COMMON.DASH}
                  </TableCell>
                  <TableCell className="font-bold text-foreground/80">
                    {item.ingredientName}
                  </TableCell>
                  <TableCell className="text-center font-black text-danger tabular-nums">
                    {item.currentStock} {item.unit}
                  </TableCell>
                  <TableCell className="text-center font-bold text-muted-foreground/40 tabular-nums">
                    {item.threshold} {item.unit}
                  </TableCell>
                  <TableCell className="pr-8 text-center">
                    <span
                      className={`table-pill text-[10px] ${
                        item.currentStock === 0 ? "table-pill-danger" : "table-pill-warning"
                      }`}
                    >
                      {item.currentStock === 0
                        ? UI_TEXT.INVENTORY.STOCK.STATUS_OUT
                        : UI_TEXT.INVENTORY.STOCK.STATUS_LOW}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
}
