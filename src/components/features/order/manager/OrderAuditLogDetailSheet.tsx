"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderAuditLogResponse } from "@/services/orderService";

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

interface OrderAuditLogDetailSheetProps {
  log: OrderAuditLogResponse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderAuditLogDetailSheet({
  log,
  isOpen,
  onOpenChange,
}: OrderAuditLogDetailSheetProps) {
  if (!log) return null;

  const safeJson = (value?: string | null) => {
    if (!value) return null;
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-screen bg-white sm:max-w-[640px] overflow-hidden flex flex-col p-0">
        <SheetHeader className="p-6 border-b bg-slate-50/50">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={cn("border-0", ACTION_STYLES[log.action] || "table-pill-neutral")}
            >
              {log.actionName}
            </Badge>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-tighter">
              {log.action}
            </span>
          </div>
          <SheetTitle className="text-xl font-bold text-slate-900">
            {UI_TEXT.ORDER.BOARD.ORDER_CODE}
            {UI_TEXT.COMMON.COLON} {log.orderCode}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            {UI_TEXT.AUDIT_LOG.LOGGED_AT} {log.formattedTime} {UI_TEXT.COMMON.PAREN_LEFT}
            {log.createdAt}
            {UI_TEXT.COMMON.PAREN_RIGHT}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                {UI_TEXT.AUDIT_LOG.ACTOR}
              </h3>
              <div className="flex items-center gap-4 rounded-2xl border bg-slate-50/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border shadow-sm text-slate-400">
                  <span className="text-lg font-bold text-slate-900">
                    {log.actorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">{log.actorName}</div>
                  <div className="text-sm text-slate-500">{log.actorRole}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {UI_TEXT.AUDIT_LOG.ENTITY_ID}
                    {UI_TEXT.COMMON.COLON} {log.employeeId}
                  </div>
                </div>
              </div>
            </section>

            {log.changeReason && (
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  {UI_TEXT.AUDIT_LOG.REASON}
                </h3>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 text-orange-800 italic">
                  {UI_TEXT.COMMON.PAGINATION.QUOTE_LEFT}
                  {log.changeReason}
                  {UI_TEXT.COMMON.PAGINATION.QUOTE_RIGHT}
                </div>
              </section>
            )}

            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                {UI_TEXT.AUDIT_LOG.CHANGE_DETAILS}
              </h3>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                    {UI_TEXT.AUDIT_LOG.OLD_VALUE}
                  </div>
                  <pre className="p-4 rounded-2xl border bg-slate-50 text-[11px] font-mono overflow-auto max-h-[200px] leading-relaxed">
                    {safeJson(log.oldValue) || UI_TEXT.COMMON.NOT_APPLICABLE}
                  </pre>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-tight">
                    {UI_TEXT.AUDIT_LOG.NEW_VALUE}
                  </div>
                  <pre className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30 text-[11px] font-mono overflow-auto max-h-[200px] leading-relaxed">
                    {safeJson(log.newValue) || UI_TEXT.COMMON.NOT_APPLICABLE}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-slate-50/50 flex justify-end">
          <Button variant="outline" className="px-8 rounded-xl" onClick={() => onOpenChange(false)}>
            {UI_TEXT.COMMON.CLOSE}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
