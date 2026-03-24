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
    <div className={cn(INVENTORY_TABLE_SURFACE_CLASS, "flex flex-col min-h-0")}>
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
              "[&_td]:align-top [&_td]:py-3 [&_td]:text-sm [&_td]:text-slate-800",
              "[&_th]:text-slate-600",
              "[&_p]:text-slate-700"
            )}
          >
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
            <TableBody className="divide-y divide-slate-200">
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
                  <TableRow
                    key={log.logId}
                    className={cn(
                      INVENTORY_TROW_CLASS,
                      "hover:bg-slate-50/80 transition-colors",
                      "align-top"
                    )}
                  >
                    <TableCell className="min-w-[160px] text-sm text-slate-600 align-top">
                      <div className="font-medium text-slate-900">
                        {formatDateTime(log.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[120px] align-top">
                      <div className="flex items-center gap-2">
                        <Badge variant={getActionVariant(log.action)} className="w-fit">
                          {getActionLabel(log.action)}
                        </Badge>
                        <span className="font-semibold text-slate-900">
                          {getEntityLabel(log.entityName)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[340px] max-w-[520px] whitespace-normal align-top">
                      <p className="font-medium text-slate-900 leading-6">{getSummary(log)}</p>
                    </TableCell>

                    <TableCell className="min-w-[180px] align-top">
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

                    <TableCell className="text-right align-top min-w-[120px]">
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
