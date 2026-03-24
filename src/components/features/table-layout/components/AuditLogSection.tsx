"use client";

import { History } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/lib/UI_Text";
import { SystemAuditLog } from "@/services/auditService";

import { SectionHeader } from "./SectionHeader";

interface AuditLogSectionProps {
  logs: SystemAuditLog[];
  isLoading: boolean;
}

function getActorLabel(actorInfo: string) {
  try {
    const parsed = JSON.parse(actorInfo);
    if (parsed.type === "Employee")
      return parsed.code || UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTOR_EMPLOYEE;
    if (parsed.type === "Guest") return parsed.name || UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTOR_GUEST;
    return UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTOR_SYSTEM;
  } catch {
    return UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTOR_SYSTEM;
  }
}

function getActionLabel(action: string) {
  switch (action.toLowerCase()) {
    case "create":
      return UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTION_CREATE;
    case "update":
      return UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTION_UPDATE;
    case "delete":
      return UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTION_DELETE;
    case "statuschange":
      return UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTION_STATUSCHANGE;
    default:
      return action;
  }
}

function getLogSummary(log: SystemAuditLog) {
  try {
    const actor = log.actorInfo
      ? getActorLabel(log.actorInfo)
      : UI_TEXT.TABLE.OVERVIEW.AUDIT.ACTOR_SYSTEM;
    return UI_TEXT.TABLE.OVERVIEW.AUDIT.LOG_SUMMARY(
      actor,
      getActionLabel(log.action).toLowerCase(),
      log.entityId.slice(0, 8)
    );
  } catch {
    return UI_TEXT.TABLE.OVERVIEW.AUDIT.LOG_SUMMARY_GENERIC(log.action, log.entityId.slice(0, 8));
  }
}

export function AuditLogSection({ logs, isLoading }: AuditLogSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <SectionHeader title={UI_TEXT.TABLE.OVERVIEW.AUDIT.TITLE} icon={History} />
      <Card className="border-none bg-card shadow-md">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : logs.length > 0 ? (
            <div className="divide-y divide-slate-100 font-sans">
              {logs.map((log) => (
                <div
                  key={log.logId}
                  className="flex items-center justify-between gap-4 p-3.5 transition-all hover:bg-slate-50/80 active:bg-slate-100/50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100/80 text-slate-500 shadow-sm ring-1 ring-slate-200/20">
                      <History className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="line-clamp-1 text-[12px] font-bold tracking-tight text-slate-800">
                        {getLogSummary(log)}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-lg border-slate-100 bg-slate-50/50 px-2 py-0.5 text-[9px] font-bold text-slate-500 shadow-sm"
                  >
                    {log.action.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
              <History className="mb-2 h-8 w-8 text-slate-300" />
              <p className="text-xs font-medium text-slate-500">
                {UI_TEXT.TABLE.OVERVIEW.AUDIT.EMPTY}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
