"use client";

import { Eye, History, UserRound } from "lucide-react";

import {
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
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
  getStatusMessage,
  getSummary,
} from "./AuditUtils";

interface AuditLogTableProps {
  logs: SystemAuditLog[];
  loading: boolean;
  error: string | null;
  onOpenDetails: (log: SystemAuditLog) => void;
}

export function AuditLogTable({ logs, loading, error, onOpenDetails }: AuditLogTableProps) {
  return (
    <div
      className={cn(
        INVENTORY_TABLE_SURFACE_CLASS,
        "min-h-[320px] max-h-[520px] overflow-hidden flex flex-col"
      )}
    >
      {loading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <Table containerClassName={INVENTORY_TABLE_CONTAINER_CLASS}>
            <TableHeader className={INVENTORY_THEAD_CLASS}>
              <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                <TableHead className={INVENTORY_TH_CLASS}>{UI_TEXT.AUDIT_LOG.TIME}</TableHead>
                <TableHead className={INVENTORY_TH_CLASS}>{UI_TEXT.AUDIT_LOG.ENTITY}</TableHead>
                <TableHead className={INVENTORY_TH_CLASS}>{UI_TEXT.AUDIT_LOG.ACTION}</TableHead>
                <TableHead className={INVENTORY_TH_CLASS}>
                  {UI_TEXT.AUDIT_LOG.CHANGE_DETAILS}
                </TableHead>
                <TableHead className={INVENTORY_TH_CLASS}>{UI_TEXT.AUDIT_LOG.ACTOR}</TableHead>
                <TableHead className={cn(INVENTORY_TH_CLASS, "text-right")}>
                  {UI_TEXT.BUTTON.DETAIL}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!error && logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <EmptyState
                      icon={History}
                      title={UI_TEXT.AUDIT_LOG.EMPTY}
                      description={UI_TEXT.AUDIT_LOG.MESSAGES.EMPTY_HINT}
                    />
                  </TableCell>
                </TableRow>
              ) : null}

              {error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-sm text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : null}

              {!error &&
                logs.map((log) => (
                  <TableRow key={log.logId} className={INVENTORY_TROW_CLASS}>
                    <TableCell className="min-w-[180px] text-sm text-slate-600">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell className="min-w-[130px]">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-900">
                          {getEntityLabel(log.entityName)}
                        </span>
                        <span className="text-xs text-slate-500">{log.entityId.slice(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <Badge variant={getActionVariant(log.action)}>
                        {getActionLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[360px] max-w-[420px] whitespace-normal">
                      <div className="space-y-1">
                        <p className="line-clamp-2 font-medium leading-6 text-slate-900">
                          {getSummary(log)}
                        </p>
                        <p className="line-clamp-1 text-sm leading-6 text-slate-500">
                          {getStatusMessage(log)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[190px]">
                      <div className="flex items-start gap-2">
                        <UserRound className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-900">
                            {getActorLabel(log.actorInfo)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getActorSubLabel(log.actorInfo) ??
                              UI_TEXT.AUDIT_LOG.ACTOR_INFO.INTERNAL}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        onClick={() => onOpenDetails(log)}
                      >
                        <Eye className="h-4 w-4" />
                        {UI_TEXT.BUTTON.DETAIL}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
