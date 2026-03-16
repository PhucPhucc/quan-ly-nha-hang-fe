"use client";

import { Eye, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { StockOutReceipt } from "@/types/StockOut";

const RECEIPT_ITEM_COUNT_LABEL = UI_TEXT.INVENTORY.STOCK_OUT.ITEM_COUNT_LABEL;

interface StockOutTableProps {
  data: StockOutReceipt[];
  onViewDetail: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const StockOutListTable = ({ data, onViewDetail, onDelete }: StockOutTableProps) => {
  const pageSize = 10;
  const missingRows = Math.max(0, pageSize - data.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="fh-table-shell border-none shadow-none">
        <Table className="fh-table">
          <TableHeader>
            <TableRow className="fh-table-header-row">
              <TableHead className="fh-table-head">
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
              </TableHead>
              <TableHead className="fh-table-head">{UI_TEXT.INVENTORY.STOCK_OUT.DATE}</TableHead>
              <TableHead className="fh-table-head">
                {UI_TEXT.INVENTORY.STOCK_OUT.REASON_LABEL}
              </TableHead>
              <TableHead className="fh-table-head text-center">
                {RECEIPT_ITEM_COUNT_LABEL}
              </TableHead>
              <TableHead className="fh-table-head text-right">
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
              </TableHead>
              <TableHead className="fh-table-head">
                {UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}
              </TableHead>
              <TableHead className="fh-table-head">{UI_TEXT.INVENTORY.FORM.DESCRIPTION}</TableHead>
              <TableHead className="fh-table-head text-right">
                {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  {UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {data.map((item) => (
                  <TableRow key={item.id} className="fh-table-row">
                    <TableCell className="fh-table-cell fh-table-cell-strong">
                      {item.receiptCode}
                    </TableCell>
                    <TableCell className="fh-table-cell">
                      {new Date(item.stockOutDate).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI)}
                    </TableCell>
                    <TableCell className="fh-table-cell">
                      {item.reason || UI_TEXT.COMMON.DASH}
                    </TableCell>
                    <TableCell className="fh-table-cell text-center">
                      <Badge variant="secondary" className="font-semibold">
                        {item.totalItems}
                      </Badge>
                    </TableCell>
                    <TableCell className="fh-table-cell text-right font-bold text-primary">
                      {item.totalAmount.toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
                      {UI_TEXT.COMMON.CURRENCY}
                    </TableCell>
                    <TableCell className="fh-table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {(item.createdBy || "-").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{item.createdBy || UI_TEXT.COMMON.DASH}</span>
                      </div>
                    </TableCell>
                    <TableCell className="fh-table-cell">
                      {item.note && (
                        <div className="flex items-center gap-1.5 text-muted-foreground italic">
                          <MessageSquare className="size-3.5" />
                          <span className="truncate max-w-[150px]">{item.note}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="fh-table-cell text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
                          </DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onViewDetail(item.id)}>
                            <Eye className="mr-2 size-4" /> {UI_TEXT.BUTTON.DETAIL}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(item.id)}
                            >
                              <Trash2 className="mr-2 size-4" /> {UI_TEXT.BUTTON.DELETE}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {missingRows > 0 &&
                  Array.from({ length: missingRows }).map((_, idx) => (
                    <TableRow key={`placeholder-${idx}`} className="h-11">
                      <TableCell colSpan={7} className="p-0" />
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
