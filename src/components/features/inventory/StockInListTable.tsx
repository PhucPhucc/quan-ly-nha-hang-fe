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

import {
  INVENTORY_AVATAR_CLASS,
  INVENTORY_EMPTY_CELL_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";

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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Table containerClassName="max-h-[500px] overflow-auto border-t border-border/40">
        <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm border-b">
          <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
            <TableHead className={`${INVENTORY_TH_CLASS} pl-6`}>
              {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
            </TableHead>
            <TableHead className={INVENTORY_TH_CLASS}>{UI_TEXT.INVENTORY.TABLE.COL_DATE}</TableHead>
            <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
              {RECEIPT_ITEM_COUNT_LABEL}
            </TableHead>
            <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
              {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
            </TableHead>
            <TableHead className={INVENTORY_TH_CLASS}>
              {UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}
            </TableHead>
            <TableHead className={INVENTORY_TH_CLASS}>
              {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
            </TableHead>
            <TableHead className={`${INVENTORY_TH_CLASS} text-right pr-6`}>
              {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className={INVENTORY_EMPTY_CELL_CLASS}>
                {UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}
              </TableCell>
            </TableRow>
          ) : (
            <>
              {data.map((item) => (
                <TableRow key={item.id} className={INVENTORY_TROW_CLASS}>
                  <TableCell className="pl-6 font-mono text-[11px] font-bold text-muted-foreground/60 uppercase">
                    {item.receiptCode}
                  </TableCell>
                  <TableCell className="font-bold text-foreground/80 tracking-tight text-xs uppercase">
                    {new Date(item.receivedDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center font-black">
                    <Badge
                      variant="secondary"
                      className="px-2 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-widest bg-muted/50 text-muted-foreground/80 border-none shadow-none tabular-nums"
                    >
                      {item.totalItems}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-black tabular-nums text-primary/80">
                    {item.totalAmount.toLocaleString("vi-VN")}
                    <span className="ml-1 text-[10px] font-bold opacity-50">
                      {UI_TEXT.COMMON.CURRENCY}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={INVENTORY_AVATAR_CLASS}>
                        {(item.createdBy || "-").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-foreground/70 uppercase tracking-tight">
                        {item.createdBy || UI_TEXT.COMMON.DASH}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.note && (
                      <div className="flex items-center gap-1.5 text-muted-foreground/50 italic text-[11px] font-medium">
                        <MessageSquare className="size-3" />
                        <span className="truncate max-w-[120px]">{item.note}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl hover:bg-muted/80 text-muted-foreground transition-all"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-2xl p-1.5 shadow-xl border-border/40 min-w-[160px]"
                      >
                        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                          {UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          className="rounded-xl px-2 py-2 text-xs font-bold gap-3 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
                          onClick={() => onViewDetail(item.id)}
                        >
                          <Eye className="size-4 opacity-50" /> {UI_TEXT.BUTTON.DETAIL}
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem
                            className="rounded-xl px-2 py-2 text-xs font-bold gap-3 focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer"
                            onClick={() => onEdit(item.id)}
                          >
                            <Edit className="size-4 opacity-50" /> {UI_TEXT.BUTTON.EDIT}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="my-1 opacity-50" />
                        {onDelete && (
                          <DropdownMenuItem
                            className="rounded-xl px-2 py-2 text-xs font-bold gap-3 text-destructive focus:bg-destructive/5 focus:text-destructive transition-colors cursor-pointer"
                            onClick={() => onDelete(item.id)}
                          >
                            <Trash2 className="size-4 opacity-50" /> {REVERSE_RECEIPT_LABEL}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {missingRows > 0 &&
                Array.from({ length: missingRows }).map((_, idx) => (
                  <TableRow
                    key={`placeholder-${idx}`}
                    className="h-[52px] border-none hover:bg-transparent"
                  >
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
