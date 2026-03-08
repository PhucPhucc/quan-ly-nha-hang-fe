"use client";

import { format } from "date-fns";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UI_TEXT } from "@/lib/UI_Text";
import { EmployeeAuditLog } from "@/types/Employee";

interface AuditLogTableProps {
  logs: EmployeeAuditLog[];
  loading: boolean;
  error: string | null;
}

const getActionBadgeVariant = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATE":
      return "default";
    case "UPDATE":
      return "secondary";
    case "DEACTIVATE":
      return "destructive";
    case "RESETPASSWORD":
      return "outline";
    case "CHANGEROLE":
      return "secondary";
    default:
      return "outline";
  }
};

const AuditLogTable = ({ logs, loading, error }: AuditLogTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{UI_TEXT.AUDIT_LOG.ACTION}</TableHead>
            <TableHead>{UI_TEXT.AUDIT_LOG.ACTOR_LABEL}</TableHead>
            <TableHead>{UI_TEXT.AUDIT_LOG.CREATED_AT}</TableHead>
            <TableHead className="hidden md:table-cell">{UI_TEXT.AUDIT_LOG.REASON}</TableHead>
            <TableHead className="text-right">{UI_TEXT.AUDIT_LOG.METADATA_LABEL}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {UI_TEXT.COMMON.LOADING}
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-destructive">
                {error}
              </TableCell>
            </TableRow>
          )}
          {!loading && logs.length === 0 && !error && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                {UI_TEXT.AUDIT_LOG.EMPTY}
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            logs.map((log: EmployeeAuditLog) => {
              // Defensive property mapping
              const action = log.action;
              const actor = log.actorName;
              const timestamp = log.time;
              const reason = log.reason;
              const metadata = log.metadata;
              return (
                <TableRow key={log.logId}>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(action)} className="capitalize">
                      {action.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{actor}</TableCell>
                  <TableCell className="text-sm">
                    {(() => {
                      if (!timestamp) return "-";
                      try {
                        const date = new Date(timestamp);
                        if (isNaN(date.getTime())) return "-";
                        return format(date, "dd/MM/yyyy HH:mm");
                      } catch {
                        return "-";
                      }
                    })()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{reason}</TableCell>
                  <TableCell className="text-right">
                    {metadata && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-auto cursor-help opacity-50 hover:opacity-100 transition-opacity" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md p-0 overflow-hidden rounded-lg border-none shadow-xl">
                            <div className="bg-card text-card-foreground">
                              <div className="px-4 py-2 bg-muted/50 border-b flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                                  {UI_TEXT.AUDIT_LOG.CHANGE_DETAILS}
                                </span>
                              </div>
                              <div className="p-4 space-y-4 max-h-md overflow-auto">
                                {(() => {
                                  try {
                                    // Handle stringified JSON if necessary
                                    const parsed =
                                      typeof metadata === "string"
                                        ? JSON.parse(metadata)
                                        : metadata;

                                    if (parsed.OldValue || parsed.NewValue) {
                                      return (
                                        <div className="grid grid-cols-1 gap-4">
                                          {parsed.OldValue && (
                                            <div className="space-y-1">
                                              <p className="text-[10px] font-bold text-destructive uppercase">
                                                {UI_TEXT.AUDIT_LOG.BEFORE_CHANGE}
                                              </p>
                                              <pre className="text-xs bg-destructive/5 p-3 rounded-md border border-destructive/10 whitespace-pre-wrap font-mono text-destructive-foreground">
                                                {typeof parsed.OldValue === "string"
                                                  ? parsed.OldValue
                                                  : JSON.stringify(parsed.OldValue, null, 2)}
                                              </pre>
                                            </div>
                                          )}
                                          {parsed.NewValue && (
                                            <div className="space-y-1">
                                              <p className="text-[10px] font-bold text-primary uppercase">
                                                {UI_TEXT.AUDIT_LOG.AFTER_CHANGE}
                                              </p>
                                              <pre className="text-xs bg-primary/5 p-3 rounded-md border border-primary/10 whitespace-pre-wrap font-mono text-primary-foreground">
                                                {typeof parsed.NewValue === "string"
                                                  ? parsed.NewValue
                                                  : JSON.stringify(parsed.NewValue, null, 2)}
                                              </pre>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }

                                    // Fallback for general metadata objects
                                    return (
                                      <pre className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap font-mono">
                                        {JSON.stringify(parsed, null, 2)}
                                      </pre>
                                    );
                                  } catch {
                                    return (
                                      <pre className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap font-mono">
                                        {String(metadata)}
                                      </pre>
                                    );
                                  }
                                })()}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
