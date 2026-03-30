"use client";

import { Edit, Eye, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { StockInReceipt } from "@/types/StockIn";

import { INVENTORY_AVATAR_CLASS, INVENTORY_EMPTY_CELL_CLASS } from "./components/inventoryStyles";

const REVERSE_RECEIPT_LABEL = UI_TEXT.INVENTORY.DELETE.BTN_CONFIRM;
const RECEIPT_ITEM_COUNT_LABEL = "Số dòng NVL";

interface StockInTableProps {
  data: StockInReceipt[];
  onViewDetail: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const StockInListTable = ({ data, onViewDetail, onEdit, onDelete }: StockInTableProps) => {
  const { formatDate, formatCurrency } = useBrandingFormatter();

  return (
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow variant="header">
            <TableHead>{UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_DATE}</TableHead>
            <TableHead>{RECEIPT_ITEM_COUNT_LABEL}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.FORM.DESCRIPTION}</TableHead>
            <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_ACTIONS}</TableHead>
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
                <TableRow key={item.id}>
                  <TableCell>{item.receiptCode}</TableCell>
                  <TableCell>{formatDate(item.receivedDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="px-2 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-widest bg-muted/50 text-muted-foreground/80 border-none shadow-none tabular-nums"
                    >
                      {item.totalItems}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(item.totalAmount)}</TableCell>
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
                      <div className="flex items-center gap-1.5 text-card-foreground/70 italic text-[11px] font-medium">
                        <MessageSquare className="size-3" />
                        <span className="truncate max-w-30">{item.note}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-muted/80 text-muted-foreground transition-all"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-2xl p-1.5 shadow-xl border-border/40 min-w-[160px]"
                      >
                        <DropdownMenuItem onClick={() => onViewDetail(item.id)}>
                          <Eye className="size-4" /> {UI_TEXT.BUTTON.DETAIL}
                        </DropdownMenuItem>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(item.id)}>
                            <Edit className="size-4" /> {UI_TEXT.BUTTON.EDIT}
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem onClick={() => onDelete(item.id)}>
                            <Trash2 className="size-4" /> {REVERSE_RECEIPT_LABEL}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableShell>
  );
};
