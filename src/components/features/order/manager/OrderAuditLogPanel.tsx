"use client";

import { CalendarClock, FileText, ShieldAlert, UserCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { UI_TEXT } from "@/lib/UI_Text";
import { Order } from "@/types/Order";

interface OrderAuditLogPanelProps {
  selectedOrder?: Order | null;
}

const formatDate = (value?: string | null) => {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? UI_TEXT.COMMON.NOT_APPLICABLE : d.toLocaleString("vi-VN");
};

export default function OrderAuditLogPanel({ selectedOrder }: OrderAuditLogPanelProps) {
  const rows = selectedOrder
    ? [
        { label: "CREATE_ORDER", actor: "Chưa có API", time: formatDate(selectedOrder.createdAt) },
        { label: "SUBMIT_ORDER", actor: "Chưa có API", time: formatDate(selectedOrder.updatedAt) },
        { label: "CHECKOUT_ORDER", actor: "Chưa có API", time: formatDate(selectedOrder.paidAt) },
        {
          label: "COMPLETE_ORDER",
          actor: "Chưa có API",
          time: formatDate(selectedOrder.completedAt),
        },
        {
          label: "CANCEL_ORDER",
          actor: "Chưa có API",
          time: formatDate(selectedOrder.cancelledAt),
        },
      ].filter((row) => row.time !== "N/A")
    : [];

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            {UI_TEXT.AUDIT_LOG.PANEL_TITLE}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{UI_TEXT.AUDIT_LOG.PANEL_DESC}</p>
          <div className="flex flex-wrap gap-2">
            {[
              "CREATE_ORDER",
              "SUBMIT_ORDER",
              "ADD_ORDER_ITEM",
              "CANCEL_ORDER",
              "CHECKOUT_ORDER",
            ].map((action) => (
              <Badge
                key={action}
                variant="outline"
                className="table-pill table-pill-neutral border-0"
              >
                {action}
              </Badge>
            ))}
          </div>
          <Separator />
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              <span>{UI_TEXT.AUDIT_LOG.TIME}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserCircle2 className="h-4 w-4" />
              <span>{UI_TEXT.AUDIT_LOG.ACTOR}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{UI_TEXT.AUDIT_LOG.ACTIONS_METADATA}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{UI_TEXT.AUDIT_LOG.TIMELINE_TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedOrder ? (
            <div className="space-y-3">
              {rows.map((row, index) => (
                <div
                  key={`${row.label}-${index}`}
                  className="flex items-center justify-between rounded-2xl border px-4 py-3"
                >
                  <div className="font-medium text-table-text-strong">{row.label}</div>
                  <div className="text-sm text-muted-foreground">
                    <span>{row.actor}</span>
                    <span>{UI_TEXT.COMMON.BULLET}</span>
                    <span>{row.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={UI_TEXT.AUDIT_LOG.EMPTY_TITLE}
              description={UI_TEXT.AUDIT_LOG.EMPTY_DESC}
              icon={ShieldAlert}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
