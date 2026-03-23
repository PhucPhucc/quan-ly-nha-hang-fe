"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { BillingHistoryRecord } from "@/types/Billing";
import { OrderType } from "@/types/enums";

interface BillingHistoryTableProps {
  records: BillingHistoryRecord[];
  loading: boolean;
  error: string;
  pageNumber: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onRowSelect?: (record: BillingHistoryRecord) => void;
}

const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatDate = (value?: string | null) => {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? UI_TEXT.COMMON.NOT_APPLICABLE : d.toLocaleString("vi-VN");
};

const statusClass = (status: string) => {
  if (status === "Paid") return "table-pill-info";
  if (status === "Completed") return "table-pill-success";
  if (status === "Cancelled") return "table-pill-danger";
  return "table-pill-neutral";
};

const paymentClass = (method?: string) => {
  if (method === "Cash") return "table-pill-success";
  if (method === "BankTransfer") return "table-pill-info";
  if (method === "CreditCard") return "table-pill-primary";
  return "table-pill-neutral";
};

const kindLabel = (type: string) => {
  if (type === OrderType.DineIn) return UI_TEXT.ORDER.BILLING.DINE_IN;
  if (type === OrderType.Takeaway) return UI_TEXT.ORDER.BILLING.TAKEAWAY;
  if (type === OrderType.Delivery) return UI_TEXT.ORDER.BILLING.DELIVERY;
  return type;
};

export default function BillingHistoryTable({
  records,
  loading,
  error,
  pageNumber,
  totalPages,
  onPageChange,
  onRetry,
  onRowSelect,
}: BillingHistoryTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
        {UI_TEXT.ORDER.BILLING.LOADING}
      </div>
    );
  }

  return (
    <TableShell className="flex min-h-0 flex-1 flex-col">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>{UI_TEXT.ORDER.BILLING.COLUMNS.ORDER_CODE}</TableHead>
              <TableHead>{UI_TEXT.ORDER.BILLING.COLUMNS.ORDER_TYPE}</TableHead>
              <TableHead>{UI_TEXT.ORDER.BILLING.COLUMNS.METHOD}</TableHead>
              <TableHead>{UI_TEXT.ORDER.BILLING.COLUMNS.PAID_AT}</TableHead>
              <TableHead>{UI_TEXT.ORDER.BILLING.COLUMNS.TOTAL}</TableHead>
              <TableHead>{UI_TEXT.ORDER.BILLING.COLUMNS.STATUS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="table-feedback text-danger">
                    <span className="table-feedback-icon table-feedback-icon-danger">
                      <AlertCircle className="h-5 w-5" />
                    </span>
                    <p className="font-medium">{error}</p>
                    <Button onClick={onRetry} variant="outline" size="sm" className="mt-1">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {UI_TEXT.COMMON.RETRY}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error && records.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="table-feedback">
                    <p className="text-sm font-medium text-table-text-muted">
                      {UI_TEXT.ORDER.BILLING.EMPTY}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error &&
              records.map((record) => (
                <TableRow
                  key={record.orderId}
                  className={onRowSelect ? "cursor-pointer" : undefined}
                  onClick={onRowSelect ? () => onRowSelect(record) : undefined}
                >
                  <TableCell className="table-cell-strong">{record.orderCode}</TableCell>
                  <TableCell>{kindLabel(record.orderType)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`table-pill border-0 ${paymentClass(record.paymentMethod)}`}
                    >
                      {record.paymentMethod || UI_TEXT.COMMON.NULL}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(record.paidAt)}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {money.format(record.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`table-pill border-0 ${statusClass(record.status)}`}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!loading && !error && totalPages > 1 && (
        <div className="table-pagination">
          <span className="text-sm font-medium text-table-text-muted">
            {UI_TEXT.COMMON.PAGINATION.PAGE} {pageNumber} {UI_TEXT.COMMON.PAGINATION.OF}{" "}
            {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
              disabled={pageNumber === 1}
            >
              {UI_TEXT.COMMON.PREVIOUS}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, pageNumber + 1))}
              disabled={pageNumber === totalPages}
            >
              {UI_TEXT.COMMON.NEXT}
            </Button>
          </div>
        </div>
      )}
    </TableShell>
  );
}
