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
import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { formatDateTimeWithBranding } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import { SystemAuditLog } from "@/services/auditService";

import {
  formatScalarValue,
  getActionLabel,
  getActionVariant,
  getActorLabel,
  getChangeItems,
  getEntityLabel,
  getSummary,
  parseJson,
} from "./AuditUtils";
import { JsonDiffViewer } from "./JsonDiffViewer";

interface AuditLogDetailSheetProps {
  log: SystemAuditLog | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailSheet({ log, isOpen, onOpenChange }: AuditLogDetailSheetProps) {
  const { data: branding } = useBrandingSettings();

  if (!log) return null;

  const selectedChanges = getChangeItems(log);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-screen bg-background sm:max-w-[760px] p-0 flex flex-col border-l-0 shadow-2xl">
        <div className="flex h-full flex-col relative overflow-hidden">
          {/* Header với phong cách theme-aware */}
          <SheetHeader className="bg-card border-b border-border/50 p-6 space-y-4 shrink-0 shadow-sm relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={getActionVariant(log.action)}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
                >
                  {getActionLabel(log.action)}
                </Badge>
                <div className="h-4 w-px bg-border" />
                <Badge
                  variant="outline"
                  className="bg-muted/50 text-muted-foreground border-border px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
                >
                  {getEntityLabel(log.entityName)}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              <SheetTitle className="text-2xl font-black text-foreground leading-tight tracking-tight">
                {getSummary(log)}
              </SheetTitle>
              <SheetDescription className="flex items-center flex-wrap gap-x-2 gap-y-1 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  {formatDateTimeWithBranding(log.createdAt, branding, true)}
                </span>
                <span className="text-muted-foreground/20">{UI_TEXT.COMMON.PIPE}</span>
                <span className="inline-flex items-center gap-1">
                  {UI_TEXT.AUDIT_LOG.ACTOR_BY}
                  {UI_TEXT.COMMON.COLON} {getActorLabel(log.actorInfo)}
                </span>
              </SheetDescription>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 bg-background overflow-hidden">
            <div className="p-6 space-y-8 pb-32">
              {/* Phần Chi tiết Thay đổi */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-4 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
                  <h3 className="text-xs font-black text-foreground uppercase tracking-widest">
                    {UI_TEXT.AUDIT_LOG.CHANGE_DETAILS}
                  </h3>
                </div>

                {selectedChanges.length > 0 ? (
                  <div className="grid gap-3">
                    {selectedChanges.map((item) => (
                      <div
                        key={`${log.logId}-${item.key}`}
                        className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
                      >
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                          {item.label}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-muted-foreground/60 line-through truncate">
                              {item.oldValue}
                            </div>
                            <div className="text-base font-bold text-foreground truncate mt-0.5">
                              {item.newValue}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Hiển thị bảng chi tiết kỹ thuật nếu không có thay đổi nghiệp vụ quan trọng */
                  <div className="rounded-2xl border border-border bg-muted/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/10">
                          <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest w-[140px]">
                            {UI_TEXT.AUDIT_LOG.FIELDS.Field}
                          </th>
                          <th className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            {UI_TEXT.AUDIT_LOG.CHANGE_DETAILS}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {log.newValues &&
                          Object.entries(parseJson(log.newValues))
                            .filter(
                              ([key]) =>
                                !["UpdatedAt", "CreatedAt", "DeletedAt", "Id", "LogId"].includes(
                                  key
                                )
                            )
                            .map(([key, value]) => {
                              const oldState = parseJson(log.oldValues);
                              const oldValue = oldState[key];
                              if (JSON.stringify(oldValue) === JSON.stringify(value)) return null;

                              return (
                                <tr
                                  key={key}
                                  className="hover:bg-muted/20 transition-colors group/row"
                                >
                                  <td className="px-4 py-3 align-top">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover/row:text-primary transition-colors">
                                      {key}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[11px] text-muted-foreground/40 line-through font-mono">
                                        {formatScalarValue(oldValue, key)}
                                      </span>
                                      <span className="text-xs font-bold text-foreground font-mono break-all leading-relaxed">
                                        {formatScalarValue(value, key)}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Phần Thông tin Kỹ thuật */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-muted-foreground/40 rounded-full" />
                    <h3 className="text-xs font-black text-foreground uppercase tracking-widest">
                      {UI_TEXT.AUDIT_LOG.TECHNICAL_INFO}
                    </h3>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <JsonDiffViewer oldValue={log.oldValues} newValue={log.newValues} />
                </div>
              </section>
            </div>
          </ScrollArea>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-card border-t border-border flex gap-3 z-10 shadow-soft">
            <Button
              className="flex-1 h-12 rounded-xl font-bold bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg transition-all active:scale-[0.98]"
              onClick={() => onOpenChange(false)}
            >
              {UI_TEXT.COMMON.CLOSE}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
