import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryStockAlertItem } from "@/types/Inventory";

interface LowStockTabContentProps {
  items: InventoryStockAlertItem[];
}

export function LowStockTabContent({ items }: LowStockTabContentProps) {
  return (
    <TabsContent value="low-stock" className="m-0 border-none outline-none">
      <TableShell>
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>{UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}</TableHead>
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_ITEM}</TableHead>
              <TableHead className={`text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_CURRENT_STOCK}
              </TableHead>
              <TableHead className={`text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_THRESHOLD}
              </TableHead>
              <TableHead className={`text-center`}>{UI_TEXT.INVENTORY.TABLE.COL_STATUS}</TableHead>
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
                <TableRow key={item.ingredientId || index} className="text-card-foreground">
                  <TableCell className="font-mono text-xs font-bold uppercase tracking-tight">
                    {item.ingredientCode || UI_TEXT.COMMON.DASH}
                  </TableCell>
                  <TableCell className="">{item.ingredientName}</TableCell>
                  <TableCell className="text-center font-semibold text-danger tabular-nums">
                    {item.currentStock} {item.unit}
                  </TableCell>
                  <TableCell className="text-center font-semibold tabular-nums">
                    {item.threshold} {item.unit}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`table-pill ${
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
      </TableShell>
    </TabsContent>
  );
}
