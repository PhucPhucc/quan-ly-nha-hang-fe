"use client";

import { Eye, History, ShieldAlert, UserRound } from "lucide-react";

import {
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
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
import { cn } from "@/lib/utils";
import { OrderAuditLogResponse } from "@/services/orderService";

import { getActionVariant } from "../../AuditLog/AuditUtils";

interface OrderAuditLogTableProps {
  logs: OrderAuditLogResponse[];
  loading: boolean;
  error: string | null;
  onOpenDetails?: (log: OrderAuditLogResponse) => void;
  orderIdSelected?: boolean;
  noSurface?: boolean;
}

export function OrderAuditLogTable({
  logs,
  loading,
  error,
  onOpenDetails,
  orderIdSelected = true,
  noSurface = false,
}: OrderAuditLogTableProps) {
  if (loading) {
    return (
      <div className={cn("space-y-3", !noSurface && "mt-4")}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <TableShell
      className={cn(
        "flex-1 min-h-0 flex flex-col border-none shadow-none bg-transparent",
        !noSurface && "mt-4"
      )}
    >
      <Table
        containerClassName={cn(
          "flex-1 overflow-auto max-h-[600px] border border-border/50 custom-scrollbar",
          !noSurface ? "rounded-2xl bg-card shadow-sm" : "border-none"
        )}
      >
        <TableHeader className={INVENTORY_THEAD_CLASS}>
          <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
            <TableHead className={cn(INVENTORY_TH_CLASS, "px-4 w-[180px]")}>
              {UI_TEXT.AUDIT_LOG.TIME}
            </TableHead>
            <TableHead className={cn(INVENTORY_TH_CLASS, "w-[120px]")}>
              {UI_TEXT.ORDER.BOARD.ORDER_CODE}
            </TableHead>
            <TableHead className={cn(INVENTORY_TH_CLASS, "flex-1")}>
              {UI_TEXT.AUDIT_LOG.ACTION}
            </TableHead>
            <TableHead className={cn(INVENTORY_TH_CLASS, "w-[200px]")}>
              {UI_TEXT.AUDIT_LOG.ACTOR}
            </TableHead>
            <TableHead className={cn(INVENTORY_TH_CLASS, "w-[100px] text-right pr-4")}>
              {UI_TEXT.BUTTON.DETAIL}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/30">
          {!orderIdSelected ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64 text-center">
                <EmptyState
                  title={UI_TEXT.AUDIT_LOG.EMPTY_TITLE}
                  description={UI_TEXT.AUDIT_LOG.EMPTY_DESC}
                  icon={History}
                />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-destructive font-medium bg-destructive/5"
              >
                {error}
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="h-[400px] text-center align-middle">
                <div className="flex flex-col items-center justify-center py-10">
                  <EmptyState
                    icon={ShieldAlert}
                    title={UI_TEXT.AUDIT_LOG.GLOBAL_EMPTY_TITLE}
                    description={
                      UI_TEXT.AUDIT_LOG.GLOBAL_EMPTY_DESC || UI_TEXT.ORDER.DETAIL.AUDIT_BE_DESC
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.logId} className={INVENTORY_TROW_CLASS}>
                <TableCell className="py-4 px-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-foreground text-sm tracking-tight">
                      {log.formattedTime}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      {log.createdAt}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="font-black text-primary text-xs tracking-tighter bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                    {log.orderCode}
                  </span>
                </TableCell>

                <TableCell className="flex-1">
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={getActionVariant(log.action)}
                      className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm w-fit"
                    >
                      {log.actionName}
                    </Badge>
                    <span className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-tighter truncate max-w-[100px]">
                      {log.action}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border/50 shadow-sm shrink-0">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-foreground text-sm leading-none truncate">
                        {log.actorName}
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">
                        {log.actorRole}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-right border-l border-border/10 pr-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-primary hover:text-primary-hover hover:bg-primary/5 px-2 -mr-2 font-black text-[10px] uppercase tracking-widest rounded-full transition-all active:scale-[0.96]"
                    onClick={() => onOpenDetails?.(log)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {UI_TEXT.BUTTON.DETAIL}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableShell>
  );
}
