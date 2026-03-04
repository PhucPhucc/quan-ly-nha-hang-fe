"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";

interface KDSAuditLogData {
  logId: string;
  time: string;
  actorName: string;
  actorRole: "ChefBar" | "Barista";
  actionType: string;
  orderCode: string;
  orderItems: string;
  reason: string;
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

/* --- Internal Helpers --- */

const getActionBadgeVariant = (action: string) => {
  // Normalize comparison to uppercase to match UI_TEXT constants
  const a = action.toUpperCase();
  if (a === UI_TEXT.KDS.AUDIT.ACTION_START) return "default";
  if (a === UI_TEXT.KDS.AUDIT.ACTION_DONE) return "secondary"; // Fixed from "badge"
  if (a === UI_TEXT.KDS.AUDIT.ACTION_REJECT) return "destructive";
  return "outline";
};

const getRoleInitialColor = (role: string) => {
  switch (role) {
    case "ChefBar":
      return "bg-teal-100 text-teal-600 border-teal-200";
    case "Barista":
      return "bg-purple-100 text-purple-600 border-purple-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

/* --- Sub-components --- */

const KDSAuditLogTableHeader = () => (
  <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-sm">
    <TableRow>
      <TableHead className="w-[15%]">{UI_TEXT.KDS.AUDIT.TIME}</TableHead>
      <TableHead className="w-[20%]">{UI_TEXT.KDS.AUDIT.ACTOR}</TableHead>
      <TableHead className="w-[15%]">{UI_TEXT.KDS.AUDIT.ACTION}</TableHead>
      <TableHead className="w-[25%]">{UI_TEXT.KDS.AUDIT.ORDER_DETAILS}</TableHead>
      <TableHead className="w-[15%]">{UI_TEXT.KDS.AUDIT.REASON}</TableHead>
      <TableHead className="w-[10%] text-right">{UI_TEXT.KDS.AUDIT.ACTIONS}</TableHead>
    </TableRow>
  </TableHeader>
);

const KDSAuditLogStatusRow = ({ message, className }: { message: string; className?: string }) => (
  <TableRow>
    <TableCell
      colSpan={6}
      className={React.useMemo(() => `h-24 text-center ${className || ""}`, [className])}
    >
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
        {log.reason || "-"}
      </TableCell>
      <TableCell className="text-right">
        {actionUpped === UI_TEXT.KDS.AUDIT.ACTION_REJECT ? (
          <button
            onClick={() => onUndo?.(log.logId)}
            className="text-primary hover:text-primary-hover text-xs font-bold hover:underline cursor-pointer uppercase"
          >
            {UI_TEXT.KDS.AUDIT.UNDO}
          </button>
        ) : (
          <span className="text-muted-foreground text-xs font-medium">-</span>
        )}
      </TableCell>
    </TableRow>
  );
};

/* --- Main Component --- */

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
    <div className="rounded-xl border border-border bg-card flex flex-col flex-1 overflow-hidden shadow-sm">
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <Table>
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
      </div>

      {/* Pagination Footer */}
      {!loading && !error && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20 shrink-0">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            TRANG <span className="text-foreground">{currentPage}</span> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-tight hover:border-primary/50 disabled:opacity-30 disabled:hover:border-border transition-all shadow-sm"
            >
              TRƯỚC
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-tight hover:border-primary/50 disabled:opacity-30 disabled:hover:border-border transition-all shadow-sm"
            >
              TIẾP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KDSAuditLogTable;
