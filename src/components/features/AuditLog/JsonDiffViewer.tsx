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
      <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20">
        <div className="text-center space-y-1">
          <p className="text-xs font-black text-muted-foreground/40 uppercase tracking-widest">
            {UI_TEXT.AUDIT_LOG.NO_CHANGES}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/60 flex flex-col">
      {/* Header của bảng kỹ thuật */}
      <div className="grid grid-cols-12 bg-secondary/50 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <div className="col-span-4 lg:col-span-3">{UI_TEXT.AUDIT_LOG.METADATA_LABEL}</div>
        <div className="col-span-8 lg:col-span-9 grid grid-cols-2 gap-4 px-4">
          <div className="border-l border-border pl-4">{UI_TEXT.AUDIT_LOG.BEFORE_CHANGE}</div>
          <div className="border-l border-border pl-4">{UI_TEXT.AUDIT_LOG.AFTER_CHANGE}</div>
        </div>
      </div>

      <div className="divide-y divide-border/30 bg-card">
        {diff.map((item) => (
          <div
            key={item.key}
            className={cn(
              "grid grid-cols-12 px-4 py-4 transition-colors hover:bg-muted/30",
              item.isChanged ? "bg-primary/5" : ""
            )}
          >
            {/* Tên trường dữ liệu */}
            <div className="col-span-4 lg:col-span-3 pr-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] font-black text-muted-foreground uppercase tracking-tighter break-all">
                  {item.key}
                </span>
                {item.isChanged && (
                  <Badge
                    variant="outline"
                    className="h-4 border-none bg-warning/20 text-warning-foreground text-[8px] font-black uppercase tracking-tighter px-1.5 leading-none"
                  >
                    {UI_TEXT.AUDIT_LOG.MODIFIED_LABEL}
                  </Badge>
                )}
              </div>
            </div>

            {/* Nội dung thay đổi dạng Side-by-Side */}
            <div className="col-span-8 lg:col-span-9 grid grid-cols-2 gap-4 px-4 h-full">
              {/* Giá trị cũ */}
              <div
                className={cn(
                  "font-mono text-[11px] leading-relaxed break-all border-l border-border/50 pl-4",
                  item.isChanged
                    ? "text-destructive line-through decoration-destructive/30"
                    : "text-muted-foreground/60"
                )}
              >
                {item.oldValue === undefined || item.oldValue === null ? (
                  <span className="italic opacity-30 font-bold lowercase tracking-normal">
                    {UI_TEXT.COMMON.NULL}
                  </span>
                ) : typeof item.oldValue === "object" ? (
                  <pre className="whitespace-pre-wrap text-[10px] bg-muted/30 p-2 rounded-lg border border-border/50">
                    {JSON.stringify(item.oldValue, null, 1)}
                  </pre>
                ) : (
                  String(item.oldValue)
                )}
              </div>

              {/* Giá trị mới */}
              <div
                className={cn(
                  "font-mono text-[11px] leading-relaxed break-all border-l border-border/50 pl-4",
                  item.isChanged ? "text-success font-bold" : "text-muted-foreground"
                )}
              >
                {item.newValue === undefined || item.newValue === null ? (
                  <span className="italic opacity-30 font-bold lowercase tracking-normal">
                    {UI_TEXT.COMMON.NULL}
                  </span>
                ) : typeof item.newValue === "object" ? (
                  <pre className="whitespace-pre-wrap text-[10px] bg-muted/30 p-2 rounded-lg border border-border/50 text-success">
                    {JSON.stringify(item.newValue, null, 1)}
                  </pre>
                ) : (
                  String(item.newValue)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Raw JSON Views ở dưới cùng - Thiết kế dạng Terminal (Làm sáng hơn để dễ đọc) */}
      <div className="bg-slate-900 border-t border-slate-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 px-3">
              <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {UI_TEXT.AUDIT_LOG.RAW_STATE_BEFORE}
            </h4>
          </div>
          <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 font-mono text-[10px] text-rose-300 overflow-auto max-h-[400px] shadow-inner custom-scrollbar italic leading-relaxed">
            <pre className="whitespace-pre">
              {oldValue ? JSON.stringify(safeParse(oldValue), null, 2) : UI_TEXT.COMMON.NULL}
            </pre>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 px-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {UI_TEXT.AUDIT_LOG.RAW_STATE_AFTER}
            </h4>
          </div>
          <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 font-mono text-[10px] text-emerald-300 overflow-auto max-h-[400px] shadow-inner custom-scrollbar italic leading-relaxed">
            <pre className="whitespace-pre">
              {newValue ? JSON.stringify(safeParse(newValue), null, 2) : UI_TEXT.COMMON.NULL}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
