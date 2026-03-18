"use client";

import { Edit, Eye, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
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
import { StockInReceipt } from "@/types/StockIn";

const REVERSE_RECEIPT_LABEL = UI_TEXT.INVENTORY.DELETE.BTN_CONFIRM;
const RECEIPT_ITEM_COUNT_LABEL = "Số dòng NVL";

interface StockInTableProps {
  data: StockInReceipt[];
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const StockInListTable = ({ data, onViewDetail, onEdit, onDelete }: StockInTableProps) => {
  const pageSize = 10;
  const missingRows = Math.max(0, pageSize - data.length);

  return (
    <div className="flex min-h-0 h-fit flex-col overflow-hidden">
      <Table containerClassName="max-h-[460px] overflow-auto bg-white border-t border-slate-100">
        <TableHeader className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
          <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
            <TableHead className="py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider bg-slate-50">
              {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
            </TableHead>
            <TableHead className="py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider bg-slate-50">
              {UI_TEXT.INVENTORY.TABLE.COL_DATE}
            </TableHead>
            <TableHead className="py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider text-center bg-slate-50">
              {RECEIPT_ITEM_COUNT_LABEL}
            </TableHead>
            <TableHead className="py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider text-right bg-slate-50">
              {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
            </TableHead>
            <TableHead className="py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider bg-slate-50">
              {UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}
            </TableHead>
            <TableHead className="py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider bg-slate-50">
              {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
            </TableHead>
            <TableHead className="py-3 font-semibold text-slate-800 uppercase text-[11px] tracking-wider text-right bg-slate-50">
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
                <TableRow key={item.id} className="h-[52px] hover:bg-slate-50/80">
                  <TableCell className="font-mono text-sm text-slate-600">
                    {item.receiptCode}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(item.receivedDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      {item.totalItems}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary/90">
                    {item.totalAmount.toLocaleString("vi-VN")}
                    {UI_TEXT.COMMON.CURRENCY}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200/50">
                        {(item.createdBy || "-").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-slate-700">
                        {item.createdBy || UI_TEXT.COMMON.DASH}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.note && (
                      <div className="flex items-center gap-1.5 text-slate-500 italic text-xs">
                        <MessageSquare className="size-3.5" />
                        <span className="truncate max-w-[150px]">{item.note}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-slate-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                          {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewDetail(item.id)}>
                          <Eye className="mr-2 size-4" /> {UI_TEXT.BUTTON.DETAIL}
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(item.id)}>
                            <Edit className="mr-2 size-4" /> {UI_TEXT.BUTTON.EDIT}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onClick={() => onDelete(item.id)}
                          >
                            <Trash2 className="mr-2 size-4" /> {REVERSE_RECEIPT_LABEL}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {missingRows > 0 &&
                Array.from({ length: missingRows }).map((_, idx) => (
                  <TableRow key={`placeholder-${idx}`} className="h-[52px]">
                    <TableCell colSpan={7} className="p-0" />
                  </TableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
