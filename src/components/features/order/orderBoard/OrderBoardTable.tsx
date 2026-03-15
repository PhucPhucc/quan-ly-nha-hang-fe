import { AlertCircle } from "lucide-react";
import React from "react";

import TableSkeleton from "@/components/shared/TableSkeleton";
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

const getStatusBadgeClassName = (status: string) => {
  switch (status) {
    case OrderStatus.Serving:
      return "fh-table-pill-primary";
    case OrderStatus.Completed:
      return "fh-table-pill-success";
    case OrderStatus.Cancelled:
      return "fh-table-pill-danger";
    case OrderStatus.Paid:
      return "fh-table-pill-info";
    default:
      return "fh-table-pill-neutral";
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
  if (loading) {
    return <TableSkeleton columns={6} rows={6} className="mt-4" />;
  }

  return (
    <div className="fh-table-shell mt-4 flex min-h-0 flex-1 flex-col">
      <div className="overflow-auto flex-1">
        <Table className="fh-table">
          <TableHeader>
            <TableRow className="fh-table-header-row hover:bg-[var(--table-header-bg)]">
              <TableHead className="fh-table-head w-[150px]">
                {UI_TEXT.ORDER.BOARD.ORDER_CODE}
              </TableHead>
              <TableHead className="fh-table-head">{UI_TEXT.ORDER.BOARD.TYPE_TABLE}</TableHead>
              <TableHead className="fh-table-head">{UI_TEXT.ORDER.BOARD.TIME}</TableHead>
              <TableHead className="fh-table-head">{UI_TEXT.ORDER.BOARD.TOTAL_AMOUNT}</TableHead>
              <TableHead className="fh-table-head">{UI_TEXT.ORDER.BOARD.STATUS_LABEL}</TableHead>
              <TableHead className="fh-table-head text-right">{UI_TEXT.ORDER.BOARD.VIP}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow className="fh-table-row">
                <TableCell colSpan={6} className="fh-table-cell">
                  <div className="fh-table-feedback text-danger">
                    <span className="fh-table-feedback-icon fh-table-feedback-icon-danger">
                      <AlertCircle className="h-5 w-5" />
                    </span>
                    <p className="font-medium">{error}</p>
                    <Button onClick={onRetry} variant="outline" size="sm" className="mt-1">
                      {UI_TEXT.COMMON.RETRY}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error && orders.length === 0 && (
              <TableRow className="fh-table-row">
                <TableCell colSpan={6} className="fh-table-cell">
                  <div className="fh-table-feedback">
                    <p className="text-sm font-medium text-[var(--table-text-muted)]">
                      {UI_TEXT.ORDER.BOARD.NOT_FOUND}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error &&
              orders.map((order) => (
                <TableRow key={order.orderId} className="fh-table-row">
                  <TableCell className="fh-table-cell fh-table-cell-strong">
                    {order.orderCode}
                  </TableCell>
                  <TableCell className="fh-table-cell">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-[var(--table-text-strong)]">
                        {order.orderType === OrderType.DineIn
                          ? UI_TEXT.ORDER.CURRENT.DINE_IN
                          : UI_TEXT.ORDER.CURRENT.TAKEAWAY}
                      </span>
                      {order.tableId && (
                        <span className="text-xs text-[var(--table-text-muted)]">
                          {UI_TEXT.ORDER.BOARD.TABLE_PREFIX} {order.tableId}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="fh-table-cell text-sm">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="fh-table-cell text-sm font-semibold text-[var(--primary)]">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalAmount)}
                  </TableCell>
                  <TableCell className="fh-table-cell">
                    <Badge
                      variant="outline"
                      className={`fh-table-pill border-0 ${getStatusBadgeClassName(order.status)}`}
                    >
                      {getStatusTranslation(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="fh-table-cell text-right">
                    {order.isPriority ? (
                      <Badge
                        variant="outline"
                        className="fh-table-pill fh-table-pill-danger border-0"
                      >
                        {UI_TEXT.ORDER.BOARD.VIP}
                      </Badge>
                    ) : (
                      <span className="text-[var(--table-text-muted)]">{UI_TEXT.COMMON.MINUS}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="fh-table-pagination">
          <span className="text-sm font-medium text-[var(--table-text-muted)]">
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
