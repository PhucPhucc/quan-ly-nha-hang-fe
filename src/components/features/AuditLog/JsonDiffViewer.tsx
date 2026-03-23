"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface JsonDiffViewerProps {
  oldValue?: string | null;
  newValue?: string | null;
}

function safeParse(value?: string | null) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return { value };
  }
}

export function JsonDiffViewer({ oldValue, newValue }: JsonDiffViewerProps) {
  const diff = useMemo(() => {
    const oldObj = safeParse(oldValue);
    const newObj = safeParse(newValue);

    const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));

    return allKeys.map((key) => {
      const val1 = oldObj[key];
      const val2 = newObj[key];
      const isChanged = JSON.stringify(val1) !== JSON.stringify(val2);

      return {
        key,
        oldValue: val1,
        newValue: val2,
        isChanged,
      };
    });
  }, [oldValue, newValue]);

  if (!oldValue && !newValue) {
    return (
      <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-border/40 text-xs text-muted-foreground/40 font-bold uppercase tracking-widest bg-muted/5">
        {UI_TEXT.AUDIT_LOG.NO_CHANGES}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border bg-card/60 shadow-sm border-border/30 transition-all hover:shadow-md">
        <div className="grid grid-cols-12 border-b bg-muted/20 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 lg:grid-cols-10">
          <div className="col-span-4 lg:col-span-3">{UI_TEXT.AUDIT_LOG.METADATA_LABEL}</div>
          <div className="col-span-4 lg:col-span-3.5 px-3 border-l border-border/10">
            {UI_TEXT.AUDIT_LOG.BEFORE_CHANGE}
          </div>
          <div className="col-span-4 lg:col-span-3.5 px-3 border-l border-border/10">
            {UI_TEXT.AUDIT_LOG.AFTER_CHANGE}
          </div>
        </div>

        <div className="divide-y divide-border/10">
          {diff.length === 0 ? (
            <div className="p-8 text-center text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              {UI_TEXT.AUDIT_LOG.NO_CHANGES}
            </div>
          ) : (
            diff.map((item) => (
              <div
                key={item.key}
                className={cn(
                  "grid grid-cols-12 px-4 py-2.5 text-[11px] transition-colors hover:bg-muted/10 lg:grid-cols-10",
                  item.isChanged ? "bg-primary/5" : ""
                )}
              >
                <div className="col-span-4 flex items-start gap-1.5 lg:col-span-3">
                  <span className="truncate font-black text-foreground/70 uppercase tracking-tighter">
                    {item.key}
                  </span>
                  {item.isChanged && (
                    <Badge className="h-3.5 pointer-events-none scale-90 border-none bg-primary/20 text-primary px-1 text-[8px] font-black uppercase tracking-tighter leading-none">
                      {UI_TEXT.AUDIT_LOG.MODIFIED_LABEL}
                    </Badge>
                  )}
                </div>

                <div className="wrap-break-word col-span-4 px-3 font-mono text-[10px] text-muted-foreground/60 lg:col-span-3.5 border-l border-border/10">
                  {item.oldValue === undefined || item.oldValue === null ? (
                    <span className="opacity-20 font-black">{UI_TEXT.COMMON.NULL}</span>
                  ) : typeof item.oldValue === "object" ? (
                    <pre className="whitespace-pre-wrap leading-tight text-info/60">
                      {JSON.stringify(item.oldValue, null, 1)}
                    </pre>
                  ) : (
                    <span className="break-all">{String(item.oldValue)}</span>
                  )}
                </div>

                <div
                  className={cn(
                    "wrap-break-word col-span-4 px-3 font-mono text-[10px] lg:col-span-3.5 border-l border-border/10",
                    item.isChanged ? "font-black text-primary" : "text-muted-foreground/60"
                  )}
                >
                  {item.newValue === undefined || item.newValue === null ? (
                    <span className="opacity-20 font-black">{UI_TEXT.COMMON.NULL}</span>
                  ) : typeof item.newValue === "object" ? (
                    <pre className="whitespace-pre-wrap leading-tight shadow-none border-none">
                      {JSON.stringify(item.newValue, null, 1)}
                    </pre>
                  ) : (
                    <span
                      className={cn(
                        "break-all",
                        item.isChanged ? "decoration-primary/40 underline-offset-2" : ""
                      )}
                    >
                      {String(item.newValue)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1.5">
            <div className="h-1 w-1 rounded-full bg-slate-200" />
            {UI_TEXT.AUDIT_LOG.RAW_STATE_BEFORE}
          </h4>
          <pre className="max-h-[220px] overflow-auto rounded-xl border bg-muted/10 p-4 font-mono text-[9px] leading-tight shadow-inner border-border/10 text-muted-foreground/60">
            {oldValue ? JSON.stringify(safeParse(oldValue), null, 2) : UI_TEXT.COMMON.NULL}
          </pre>
        </div>
        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1.5">
            <div className="h-1 w-1 rounded-full bg-primary/30" />
            {UI_TEXT.AUDIT_LOG.RAW_STATE_AFTER}
          </h4>
          <pre className="max-h-[220px] overflow-auto rounded-xl border bg-muted/10 p-4 font-mono text-[9px] leading-tight shadow-inner border-border/10 text-muted-foreground/60">
            {newValue ? JSON.stringify(safeParse(newValue), null, 2) : UI_TEXT.COMMON.NULL}
          </pre>
        </div>
      </div>
    </div>
  );
}
