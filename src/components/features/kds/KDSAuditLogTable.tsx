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
  actionType: "Hoàn tác" | "Bắt đầu nấu" | "Hoàn thành" | "Từ chối món";
  orderCode: string;
  orderItems: string;
  reason: string;
}

interface KDSAuditLogTableProps {
  logs: KDSAuditLogData[];
  loading: boolean;
  error: string | null;
  onUndo?: (logId: string) => void;
}

/* --- Internal Helpers --- */

const getActionBadgeVariant = (action: string) => {
  switch (action) {
    case "Bắt đầu nấu":
      return "default";
    case "Hoàn thành":
      return "secondary";
    case "Từ chối món":
      return "destructive";
    default:
      return "outline";
  }
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
      <TableHead className="w-[15%]">Thời gian</TableHead>
      <TableHead className="w-[20%]">Người thực hiện</TableHead>
      <TableHead className="w-[15%]">Hành động</TableHead>
      <TableHead className="w-[25%]">Chi tiết đơn hàng</TableHead>
      <TableHead className="w-[15%]">Lý do / Ghi chú</TableHead>
      <TableHead className="w-[10%] text-right">Thao tác</TableHead>
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
        <Badge variant={getActionBadgeVariant(log.actionType)} className="capitalize font-medium">
          {log.actionType}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">{log.orderCode}</span>
          <span className="text-muted-foreground text-xs">{log.orderItems}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm italic">{log.reason || "-"}</TableCell>
      <TableCell className="text-right">
        {log.actionType === "Từ chối món" ? (
          <button
            onClick={() => onUndo?.(log.logId)}
            className="text-primary hover:text-primary-hover text-xs font-semibold hover:underline cursor-pointer"
          >
            Hoàn tác
          </button>
        ) : (
          <span className="text-muted-foreground text-xs font-medium">-</span>
        )}
      </TableCell>
    </TableRow>
  );
};

/* --- Main Component --- */

const KDSAuditLogTable = ({ logs, loading, error, onUndo }: KDSAuditLogTableProps) => {
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
                message={UI_TEXT.AUDIT_LOG.EMPTY}
                className="text-muted-foreground"
              />
            )}

            {!loading &&
              logs.map((log) => <KDSAuditLogRow key={log.logId} log={log} onUndo={onUndo} />)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default KDSAuditLogTable;
