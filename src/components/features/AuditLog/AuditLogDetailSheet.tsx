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
import { SystemAuditLog } from "@/services/auditService";

import {
  formatDateTime,
  getActionLabel,
  getActionVariant,
  getActorLabel,
  getChangeItems,
  getEntityLabel,
  getSummary,
} from "./AuditUtils";
import { JsonDiffViewer } from "./JsonDiffViewer";

interface AuditLogDetailSheetProps {
  log: SystemAuditLog | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailSheet({ log, isOpen, onOpenChange }: AuditLogDetailSheetProps) {
  if (!log) return null;

  const selectedChanges = getChangeItems(log);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-screen bg-white sm:max-w-[720px]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Badge variant={getActionVariant(log.action)}>{getActionLabel(log.action)}</Badge>
              <Badge variant="outline">{getEntityLabel(log.entityName)}</Badge>
            </div>
            <SheetTitle>{getSummary(log)}</SheetTitle>
            <SheetDescription>
              {UI_TEXT.AUDIT_LOG.LOGGED_AT}
              {UI_TEXT.COMMON.SPACE}
              {formatDateTime(log.createdAt)}
              {UI_TEXT.COMMON.DOT}
              {UI_TEXT.COMMON.SPACE}
              {UI_TEXT.AUDIT_LOG.ACTOR_BY}
              {UI_TEXT.COMMON.COLON}
              {UI_TEXT.COMMON.SPACE}
              {getActorLabel(log.actorInfo)}
              {UI_TEXT.COMMON.DOT}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-6 py-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {UI_TEXT.AUDIT_LOG.CHANGE_DETAILS}
                </h3>
                {selectedChanges.length > 0 ? (
                  <div className="space-y-2">
                    {selectedChanges.map((item) => (
                      <div
                        key={`${log.logId}-${item.key}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
                      >
                        <div className="font-medium text-slate-900">{item.label}</div>
                        <div className="mt-1 text-slate-500">
                          <span>{item.oldValue}</span>
                          <span className="mx-2" aria-hidden="true">
                            {UI_TEXT.COMMON.HYPHEN}
                          </span>
                          <span className="font-medium text-slate-900">{item.newValue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    {UI_TEXT.AUDIT_LOG.NO_CHANGES}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {UI_TEXT.AUDIT_LOG.TECHNICAL_INFO}
                </h3>
                <JsonDiffViewer oldValue={log.oldValues} newValue={log.newValues} />
              </section>
            </div>
          </ScrollArea>

          <div className="border-t border-slate-100 pt-4">
            <Button className="w-full shadow-none" onClick={() => onOpenChange(false)}>
              {UI_TEXT.COMMON.CLOSE}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
