"use client";

import React from "react";

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

const SLASH = "/";
const HYPHEN = "-";

interface KDSAuditLogData {
  logId: string;
  time: string;
  actorName: string;
  actorRole: "ChefBar" | "Barista";
  actionType: string;
  orderCode: string;
  orderItems: string;
  reason: string;
  oldValue?: string;
  newValue?: string;
}

interface KDSAuditLogTableProps {
  logs: KDSAuditLogData[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUndo?: (logId: string) => void;
}

const getActionBadgeVariant = (action: string) => {
  const a = action.toUpperCase();
  if (a === UI_TEXT.KDS.AUDIT.ACTION_START) return "default";
  if (a === UI_TEXT.KDS.AUDIT.ACTION_DONE) return "secondary";
  if (a === UI_TEXT.KDS.AUDIT.ACTION_REJECT) return "destructive";
  return "outline";
};

const getRoleInitialColor = (role: string) => {
  switch (role) {
    case "ChefBar":
      return "bg-teal-100 text-teal-600 border-teal-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const KDSAuditLogTableHeader = () => (
  <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
    <TableRow>
      <TableHead className="px-3 w-[15%]">{UI_TEXT.KDS.AUDIT.TIME}</TableHead>
      <TableHead className="px-3 w-[20%]">{UI_TEXT.KDS.AUDIT.ACTOR}</TableHead>
      <TableHead className="px-3 w-[15%]">{UI_TEXT.KDS.AUDIT.ACTION}</TableHead>
      <TableHead className="px-3 w-[25%]">{UI_TEXT.KDS.AUDIT.ORDER_DETAILS}</TableHead>
      <TableHead className="px-3 w-[15%]">{UI_TEXT.KDS.AUDIT.REASON}</TableHead>
      <TableHead className="px-3 w-[10%] text-right">{UI_TEXT.KDS.AUDIT.ACTIONS}</TableHead>
    </TableRow>
  </TableHeader>
);

const KDSAuditLogStatusRow = ({ message, className }: { message: string; className?: string }) => (
  <TableRow>
    <TableCell colSpan={6} className={`h-24 text-center ${className || ""}`}>
      {message}
    </TableCell>
  </TableRow>
);

interface KDSAuditLogRowProps {
  log: KDSAuditLogData;
  onUndo?: (logId: string) => void;
}

const KDSAuditLogRow = ({ log, onUndo }: KDSAuditLogRowProps) => {
  const [time, date] = log.time.split(" ");
  const actionUpped = log.actionType.toUpperCase();

  return (
    <TableRow className="group hover:bg-muted/30 transition-colors">
      <TableCell className="text-foreground text-sm font-medium">
        {time} <span className="text-muted-foreground text-xs ml-1">{date}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${getRoleInitialColor(log.actorRole)}`}
          >
            {log.actorName.charAt(0)}
          </div>
          <span className="text-foreground text-sm">{log.actorName}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={getActionBadgeVariant(log.actionType)}
          className="uppercase font-bold text-[10px]"
        >
          {actionUpped}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">{log.orderCode}</span>
          <span className="text-muted-foreground text-xs uppercase">{log.orderItems}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm italic uppercase">
        {log.reason || HYPHEN}
      </TableCell>
      <TableCell className="text-right">
        {actionUpped === UI_TEXT.KDS.AUDIT.ACTION_REJECT ? (
          <Button
            onClick={() => onUndo?.(log.logId)}
            className="text-primary hover:text-primary-hover text-xs font-bold hover:underline cursor-pointer uppercase"
          >
            {UI_TEXT.KDS.AUDIT.UNDO}
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs font-medium">{HYPHEN}</span>
        )}
      </TableCell>
    </TableRow>
  );
};

const KDSAuditLogTable = ({
  logs,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onUndo,
}: KDSAuditLogTableProps) => {
  return (
    // <Card className="flex flex-1 flex-col overflow-hidden gap-0">
    //   <CardContent className="p-0 border-none">
    //     <div className="overflow-y-auto flex-1 custom-scrollbar">
    <div>
      <TableShell>
        <Table className="rounded-xl">
          <KDSAuditLogTableHeader />
          <TableBody>
            {loading && <KDSAuditLogStatusRow message={UI_TEXT.COMMON.LOADING} />}
            {error && <KDSAuditLogStatusRow message={error} className="text-destructive" />}
            {!loading && logs.length === 0 && !error && (
              <KDSAuditLogStatusRow
                message={UI_TEXT.KDS.AUDIT.EMPTY}
                className="text-muted-foreground"
              />
            )}
            {!loading &&
              logs.map((log) => <KDSAuditLogRow key={log.logId} log={log} onUndo={onUndo} />)}
          </TableBody>
        </Table>
      </TableShell>

      {!loading && !error && totalPages > 1 && (
        <div className="px-6 pt-4 border-t border-border flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-2">{UI_TEXT.KDS.PAGE}</span>
            <div className="flex items-center justify-center min-w-12 px-2 py-1 rounded-md bg-card border border-slate-200 shadow-sm">
              <span className="text-sm font-bold text-slate-700">{currentPage}</span>
              <span className="text-slate-400 mx-1">{SLASH}</span>
              <span className="text-sm font-medium text-slate-500">{totalPages}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 shadow-sm transition-all hover:shadow-md"
            >
              {UI_TEXT.KDS.PREV}
            </Button>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 shadow-sm transition-all hover:shadow-md"
            >
              {UI_TEXT.KDS.NEXT}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KDSAuditLogTable;
