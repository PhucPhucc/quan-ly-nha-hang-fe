"use client";

import { History, Loader2, Search, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderAuditLogResponse, orderService } from "@/services/orderService";

interface OrderAuditLogPanelProps {
  orderId?: string | null;
  globalMode?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

const ACTION_STYLES: Record<string, string> = {
  CREATE_ORDER: "table-pill-success",
  SUBMIT_ORDER: "table-pill-info",
  ADD_ORDER_ITEM: "table-pill-primary",
  UPDATE_ORDER_ITEM: "table-pill-neutral",
  CANCEL_ORDER_ITEM: "table-pill-danger",
  CANCEL_ORDER: "table-pill-danger",
  COMPLETE_ORDER: "table-pill-success",
  MERGE_ORDER: "table-pill-info",
  SPLIT_ORDER: "table-pill-info",
  SPLIT_BILL: "table-pill-info",
  CHANGE_ORDER_TABLE: "table-pill-neutral",
  CHECKOUT_ORDER: "table-pill-primary",
  KDS_START_COOKING: "table-pill-primary",
  KDS_COMPLETE_COOKING: "table-pill-success",
  KDS_REJECT: "table-pill-danger",
  KDS_RETURN: "table-pill-neutral",
  CHECK_IN_RESERVATION: "table-pill-info",
  ADJUST_ORDER_ITEM_QUANTITY: "table-pill-neutral",
  ApplyPromotion: "table-pill-info",
};

const ACTION_OPTIONS = [
  { value: "all", label: UI_TEXT.AUDIT_LOG.ALL_ACTION },
  { value: "CREATE_ORDER", label: "Tạo đơn" },
  { value: "SUBMIT_ORDER", label: "Gửi bếp" },
  { value: "ADD_ORDER_ITEM", label: "Thêm món" },
  { value: "UPDATE_ORDER_ITEM", label: "Cập nhật món" },
  { value: "CANCEL_ORDER_ITEM", label: "Hủy món" },
  { value: "CANCEL_ORDER", label: "Hủy đơn" },
  { value: "COMPLETE_ORDER", label: "Hoàn tất đơn" },
  { value: "MERGE_ORDER", label: "Gộp đơn" },
  { value: "SPLIT_ORDER", label: "Tách đơn" },
  { value: "SPLIT_BILL", label: "Tách bill" },
  { value: "CHANGE_ORDER_TABLE", label: "Chuyển bàn" },
  { value: "CHECKOUT_ORDER", label: "Thanh toán" },
  { value: "KDS_START_COOKING", label: "Bắt đầu nấu" },
  { value: "KDS_COMPLETE_COOKING", label: "Hoàn thành nấu" },
  { value: "KDS_REJECT", label: "Từ chối món" },
  { value: "KDS_RETURN", label: "Trả món về hàng đợi" },
  { value: "CHECK_IN_RESERVATION", label: "Check-in đặt bàn" },
  { value: "ADJUST_ORDER_ITEM_QUANTITY", label: "Điều chỉnh số lượng" },
  { value: "ApplyPromotion", label: "Áp dụng khuyến mãi" },
] as const;

function safeJson(value?: string | null) {
  if (!value) return null;
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function AuditValueBlock({ label, value }: { label: string; value?: string | null }) {
  const pretty = safeJson(value);
  if (!pretty) return null;

  return (
    <div className="space-y-2 rounded-xl border bg-secondary/30 p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <pre className="overflow-x-auto text-xs leading-6 text-table-text">{pretty}</pre>
    </div>
  );
}

export default function OrderAuditLogPanel({
  orderId,
  globalMode = false,
  description = UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC,
  className,
}: OrderAuditLogPanelProps) {
  const { formatDateTime } = useBrandingFormatter();
  const [logs, setLogs] = useState<OrderAuditLogResponse[]>([]);

  function formatTime(value?: string | null) {
    if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
    return formatDateTime(value);
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    setPageNumber(1);
  }, [orderId]);

  useEffect(() => {
    if (globalMode) {
      setPageNumber(1);
    }
  }, [globalMode, search, actionFilter]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!globalMode && !orderId) {
        setLogs([]);
        setError(null);
        setLoading(false);
        setTotalPages(1);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = globalMode
          ? await orderService.getAllOrderAuditLogs({
              pageNumber,
              pageSize: 8,
              search,
              action: actionFilter,
            })
          : await orderService.getOrderAuditLogs(orderId!, {
              pageNumber,
              pageSize: 8,
            });

        if (!alive) return;

        if (result.isSuccess && result.data) {
          const data = result.data as unknown as Record<string, unknown>;
          const items = (data.items || data.Items || []) as OrderAuditLogResponse[];
          const pages = (data.totalPages || data.TotalPages || 1) as number;

          setLogs(items);
          setTotalPages(pages);
        } else {
          setError(result.error || result.message || UI_TEXT.AUDIT_LOG.FETCH_ERROR);
          setLogs([]);
        }
      } catch {
        if (alive) {
          setError(UI_TEXT.AUDIT_LOG.FETCH_ERROR);
          setLogs([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [actionFilter, globalMode, orderId, pageNumber, search]);

  const handleApplySearch = () => {
    setPageNumber(1);
    setSearch(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setActionFilter("all");
    setPageNumber(1);
  };

  const renderEmpty = () => {
    if (globalMode) {
      return (
        <div className="flex flex-1 items-center justify-center py-10">
          <EmptyState title={UI_TEXT.AUDIT_LOG.GLOBAL_EMPTY_TITLE} icon={History} />
        </div>
      );
    }

    if (!orderId) {
      return (
        <div className="flex flex-1 items-center justify-center py-10">
          <EmptyState title={UI_TEXT.AUDIT_LOG.EMPTY_TITLE} icon={History} />
        </div>
      );
    }

    return (
      <div className="flex flex-1 items-center justify-center py-10">
        <EmptyState title={UI_TEXT.AUDIT_LOG.EMPTY_TITLE} icon={ShieldAlert} />
      </div>
    );
  };

  return (
    <Card className={cn("flex min-h-0 flex-col", className)}>
      <CardContent
        className={cn(
          "flex flex-1 flex-col space-y-4 py-5",
          !loading && !error && logs.length === 0 && "justify-center"
        )}
      >
        <p className="text-sm text-muted-foreground">{description}</p>

        {globalMode && (
          <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4 lg:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleApplySearch();
                  }
                }}
                placeholder={UI_TEXT.AUDIT_LOG.FILTER.SEARCH_PLACEHOLDER}
                className="h-10 rounded-xl bg-background pl-9"
              />
            </div>

            <Select
              value={actionFilter}
              onValueChange={(value) => {
                setActionFilter(value);
                setPageNumber(1);
              }}
            >
              <SelectTrigger className="h-10 rounded-xl bg-background">
                <SelectValue placeholder={UI_TEXT.AUDIT_LOG.FILTER.ACTION_LABEL} />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleApplySearch}>{UI_TEXT.AUDIT_LOG.FILTER.APPLY}</Button>

            <Button variant="outline" onClick={handleResetFilters}>
              {UI_TEXT.AUDIT_LOG.FILTER.RESET}
            </Button>
          </div>
        )}

        {!globalMode && !orderId && renderEmpty()}

        {!globalMode && orderId && (
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{UI_TEXT.AUDIT_LOG.ORDER_ID}</span>
            <span>{orderId}</span>
          </div>
        )}

        {(globalMode || orderId) && loading && (
          <div className="flex h-40 items-center justify-center rounded-2xl border bg-card">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">{UI_TEXT.COMMON.LOADING}</span>
          </div>
        )}

        {(globalMode || orderId) && error && (
          <EmptyState title={error} description={description} icon={ShieldAlert} />
        )}

        {(globalMode || orderId) && !loading && !error && logs.length === 0 && renderEmpty()}

        {(globalMode || orderId) && !loading && !error && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.logId} className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-0",
                          ACTION_STYLES[log.action] || "table-pill-neutral"
                        )}
                      >
                        {log.actionName}
                      </Badge>
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {log.action}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-table-text-strong">
                      {log.orderCode}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">{log.actorName}</div>
                    <div>
                      {log.actorRole} {UI_TEXT.COMMON.BULLET} {log.formattedTime}
                    </div>
                  </div>
                </div>

                {log.changeReason && (
                  <div className="mt-3 rounded-xl border bg-warning/10 px-3 py-2 text-sm text-table-text">
                    {log.changeReason}
                  </div>
                )}

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <AuditValueBlock label={UI_TEXT.AUDIT_LOG.OLD_VALUE} value={log.oldValue} />
                  <AuditValueBlock label={UI_TEXT.AUDIT_LOG.NEW_VALUE} value={log.newValue} />
                </div>

                <div className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {formatTime(log.createdAt)}
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-2xl border bg-muted/20 px-4 py-3">
                <div className="text-sm text-muted-foreground">
                  {UI_TEXT.COMMON.PAGINATION.PAGE} {pageNumber} {UI_TEXT.COMMON.PAGINATION.OF}{" "}
                  {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
                  >
                    {UI_TEXT.COMMON.PAGINATION.PREV}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={pageNumber >= totalPages}
                    onClick={() => setPageNumber((current) => Math.min(totalPages, current + 1))}
                  >
                    {UI_TEXT.COMMON.PAGINATION.NEXT}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
