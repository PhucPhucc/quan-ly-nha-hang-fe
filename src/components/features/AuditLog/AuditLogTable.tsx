"use client";

import { Eye, History } from "lucide-react";

import {
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
  INVENTORY_THEAD_CLASS,
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
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { SystemAuditLog } from "@/services/auditService";

import {
  formatDateTime,
  getActionLabel,
  getActionVariant,
  getActorLabel,
  getActorSubLabel,
  getEntityLabel,
  getSummary,
} from "./AuditUtils";

interface AuditLogTableProps {
  logs: SystemAuditLog[];
  loading: boolean;
  error: string | null;
  onOpenDetails: (log: SystemAuditLog) => void;
  noSurface?: boolean;
}

export function AuditLogTable({
  logs,
  loading,
  error,
  onOpenDetails,
  noSurface = false,
}: AuditLogTableProps) {
  return (
    <div className={cn(!noSurface && INVENTORY_TABLE_SURFACE_CLASS, "flex flex-col min-h-0")}>
      {loading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <Table
            containerClassName={cn(
              INVENTORY_TABLE_CONTAINER_CLASS,
              "max-h-[520px] overflow-auto",
              "[&_td]:align-top [&_td]:py-4 [&_td]:text-sm",
              "custom-scrollbar"
            )}
          >
            <TableHeader className={cn(INVENTORY_THEAD_CLASS, "bg-secondary/50 sticky top-0 z-20")}>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-[180px] text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {UI_TEXT.AUDIT_LOG.TIME}
                </TableHead>
                <TableHead className="w-[140px] text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {UI_TEXT.AUDIT_LOG.ACTION}
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {UI_TEXT.AUDIT_LOG.ENTITY} {UI_TEXT.COMMON.SLASH}{" "}
                  {UI_TEXT.AUDIT_LOG.METADATA_LABEL}
                </TableHead>
                <TableHead className="w-[200px] text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {UI_TEXT.AUDIT_LOG.ACTOR}
                </TableHead>
                <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right border-l border-border/10">
                  {UI_TEXT.BUTTON.DETAIL}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-destructive font-medium bg-destructive/5"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <EmptyState
                      icon={History}
                      title={UI_TEXT.AUDIT_LOG.EMPTY}
                      description={UI_TEXT.AUDIT_LOG.MESSAGES.EMPTY_HINT}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.logId}
                    className="group border-b border-border/20 hover:bg-muted/30 transition-all duration-300"
                  >
                    <TableCell>
                      <span className="font-bold text-foreground text-sm tracking-tight">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getActionVariant(log.action)}
                        className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm"
                      >
                        {getActionLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 max-w-[400px]">
                        <span className="font-bold text-foreground text-sm leading-tight tracking-tight">
                          {getSummary(log)}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                          {getEntityLabel(log.entityName)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground text-sm leading-none">
                          {getActorLabel(log.actorInfo)}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">
                          {getActorSubLabel(log.actorInfo) ?? UI_TEXT.AUDIT_LOG.ACTOR_INFO.INTERNAL}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right border-l border-border/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 text-primary hover:text-primary-hover hover:bg-primary/5 px-2 -mr-2 font-black text-[10px] uppercase tracking-widest rounded-full transition-all active:scale-[0.96]"
                        onClick={() => onOpenDetails(log)}
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
        </div>
      )}
    </div>
  );
}
