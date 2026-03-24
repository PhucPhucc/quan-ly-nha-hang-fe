"use client";

import { format } from "date-fns";
import { History, Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderAuditLogResponse, orderService } from "@/services/orderService";

interface OrderAuditLogPanelProps {
  orderId?: string | null;
  title?: string;
  description?: string;
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

function formatTime(value?: string | null) {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? UI_TEXT.COMMON.NOT_APPLICABLE
    : format(d, "dd/MM/yyyy HH:mm:ss");
}

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
  title = UI_TEXT.AUDIT_LOG.TIMELINE_TITLE,
  description = UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC,
}: OrderAuditLogPanelProps) {
  const [logs, setLogs] = useState<OrderAuditLogResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPageNumber(1);
  }, [orderId]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!orderId) {
        setLogs([]);
        setError(null);
        setLoading(false);
        setTotalPages(1);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await orderService.getOrderAuditLogs(orderId, {
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
  }, [orderId, pageNumber]);

  const renderEmpty = () => {
    if (!orderId) {
      return (
        <EmptyState
          title={UI_TEXT.AUDIT_LOG.EMPTY_TITLE}
          description={UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC}
          icon={History}
        />
      );
    }

    return (
      <EmptyState
        title={UI_TEXT.AUDIT_LOG.EMPTY_TITLE}
        description={UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC}
        icon={ShieldAlert}
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        {!orderId && renderEmpty()}

        {orderId && (
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{UI_TEXT.AUDIT_LOG.ORDER_ID}</span>
            <span>{orderId}</span>
          </div>
        )}

        {orderId && loading && (
          <div className="flex h-40 items-center justify-center rounded-2xl border bg-card">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">{UI_TEXT.COMMON.LOADING}</span>
          </div>
        )}

        {orderId && error && (
          <EmptyState title={error} description={description} icon={ShieldAlert} />
        )}

        {orderId && !loading && !error && logs.length === 0 && renderEmpty()}

        {orderId && !loading && !error && logs.length > 0 && (
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
