import React from "react";
import { DateRange } from "react-day-picker";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";

import {
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./inventoryStyles";

export interface CogsResultItem {
  id: string;
  name: string;
  unit: string;
  openingQty: number;
  openingVal: number;
  inQty: number;
  inVal: number;
  avgPrice: number;
  outCount: number;
  totalVal: number;
}

interface InventoryCogsResultsTableProps {
  results: CogsResultItem[];
  dateRange: DateRange | undefined;
}

export function InventoryCogsResultsTable({ results, dateRange }: InventoryCogsResultsTableProps) {
  if (!results || results.length === 0) return null;

  return (
    <div className="p-6 bg-card border shadow-sm rounded-[12px]">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold text-base text-card-foreground">
          {UI_TEXT.INVENTORY.COGS.RESULTS_TITLE} {dateRange?.from?.toLocaleDateString()}{" "}
          {UI_TEXT.INVENTORY.TABLE.EM_DASH} {dateRange?.to?.toLocaleDateString()}
        </h3>
        <span className="table-pill table-pill-success text-[10px]!">
          {UI_TEXT.INVENTORY.COGS.BADGE_CALCULATED}
        </span>
      </div>

      <div className={INVENTORY_TABLE_CONTAINER_CLASS}>
        <Table>
          <TableHeader className={INVENTORY_THEAD_CLASS}>
            <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center w-12 pl-4`}>
                {UI_TEXT.INVENTORY.COGS.COL_NO}
              </TableHead>
              <TableHead className={INVENTORY_TH_CLASS}>
                {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_UNIT_SHORT}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                {UI_TEXT.INVENTORY.COGS.COL_OPENING_QTY}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                {UI_TEXT.INVENTORY.COGS.COL_OPENING_VAL}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                {UI_TEXT.INVENTORY.COGS.COL_IN_QTY}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                {UI_TEXT.INVENTORY.COGS.COL_IN_VAL}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right text-primary`}>
                {UI_TEXT.INVENTORY.COGS.COL_AVG_PRICE}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.COGS.COL_OUT_COUNT}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right pr-4`}>
                {UI_TEXT.INVENTORY.COGS.COL_TOTAL_VAL}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((item, index) => (
              <TableRow key={item.id} className={INVENTORY_TROW_CLASS}>
                <TableCell className="text-center pl-4 font-mono text-xs text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-semibold text-foreground">{item.name}</TableCell>
                <TableCell className="text-center text-muted-foreground">{item.unit}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatInventoryQuantity(item.openingQty)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatCurrency(item.openingVal)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatInventoryQuantity(item.inQty)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatCurrency(item.inVal)}
                </TableCell>
                <TableCell className="text-right tabular-nums font-bold text-primary">
                  {formatCurrency(item.avgPrice * 1000)}
                </TableCell>
                <TableCell className="text-center tabular-nums">{item.outCount}</TableCell>
                <TableCell className="text-right pr-4 tabular-nums font-bold">
                  {formatCurrency(item.totalVal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-muted/20">
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-right font-semibold text-muted-foreground uppercase text-xs tracking-wider border-t"
              >
                {UI_TEXT.INVENTORY.COGS.FOOTER_TOTAL}
              </TableCell>
              <TableCell className="text-right pr-4 text-lg font-black text-foreground border-t tabular-nums">
                {formatCurrency(results.reduce((sum, item) => sum + item.totalVal, 0))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
