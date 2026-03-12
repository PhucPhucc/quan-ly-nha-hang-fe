import { AlertCircle } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

interface OrderBoardTableProps {
  orders: Order[];
  loading: boolean;
  error: string;
  pageNumber: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case OrderStatus.Serving:
      return "default";
    case OrderStatus.Completed:
      return "secondary";
    case OrderStatus.Cancelled:
      return "destructive";
    case OrderStatus.Paid:
      return "outline";
    default:
      return "outline";
  }
};

const getStatusTranslation = (status: string) => {
  switch (status) {
    case OrderStatus.Serving:
      return UI_TEXT.ORDER.CURRENT.STATUS_SERVING;
    case OrderStatus.Completed:
      return UI_TEXT.ORDER.CURRENT.STATUS_COMPLETED;
    case OrderStatus.Cancelled:
      return UI_TEXT.ORDER.CURRENT.STATUS_CANCELLED;
    case OrderStatus.Paid:
      return UI_TEXT.ORDER.CURRENT.STATUS_PAID;
    default:
      return status;
  }
};

export default function OrderBoardTable({
  orders,
  loading,
  error,
  pageNumber,
  totalPages,
  onPageChange,
  onRetry,
}: OrderBoardTableProps) {
  return (
    <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
              <TableHead className="w-[150px] py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider pl-6">
                {UI_TEXT.ORDER.BOARD.ORDER_CODE}
              </TableHead>
              <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
                {UI_TEXT.ORDER.BOARD.TYPE_TABLE}
              </TableHead>
              <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
                {UI_TEXT.ORDER.BOARD.TIME}
              </TableHead>
              <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
                {UI_TEXT.ORDER.BOARD.TOTAL_AMOUNT}
              </TableHead>
              <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
                {UI_TEXT.ORDER.BOARD.STATUS_LABEL}
              </TableHead>
              <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider text-right pr-6">
                {UI_TEXT.ORDER.BOARD.VIP}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-slate-500">
                  {UI_TEXT.ORDER.BOARD.LOADING_DATA}
                </TableCell>
              </TableRow>
            )}

            {error && !loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <AlertCircle className="h-8 w-8" />
                    <p>{error}</p>
                    <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
                      {UI_TEXT.COMMON.RETRY}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-slate-500">
                  {UI_TEXT.ORDER.BOARD.NOT_FOUND}
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              orders.map((order) => (
                <TableRow key={order.orderId} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="pl-6 font-medium text-slate-700">
                    {order.orderCode}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm">
                        {order.orderType === OrderType.DineIn
                          ? UI_TEXT.ORDER.CURRENT.DINE_IN
                          : UI_TEXT.ORDER.CURRENT.TAKEAWAY}
                      </span>
                      {order.tableId && (
                        <span className="text-xs text-slate-500">
                          {UI_TEXT.ORDER.BOARD.TABLE_PREFIX} {order.tableId}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusTranslation(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {order.isPriority ? (
                      <Badge variant="destructive">{UI_TEXT.ORDER.BOARD.VIP}</Badge>
                    ) : (
                      <span className="text-slate-300">{UI_TEXT.COMMON.MINUS}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
          <span className="text-sm text-slate-500 font-medium">
            {UI_TEXT.ORDER.BOARD.PAGE} {pageNumber} {UI_TEXT.COMMON.SLASH} {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
              disabled={pageNumber === 1}
            >
              {UI_TEXT.ORDER.BOARD.PAGE_PREV}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
              disabled={pageNumber === totalPages}
            >
              {UI_TEXT.ORDER.BOARD.PAGE_NEXT}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
