"use client";

import { AlertTriangle, Printer, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "danger" | "info";
  message: string;
  icon: React.ReactNode;
}

export function RealTimeAlertStrip() {
  const t = UI_TEXT.DASHBOARD.ALERT_STRIP;
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const alerts: Alert[] = useMemo(() => {
    if (!t) return [];
    return [
      {
        id: "1",
        type: "danger",
        message: t.PRINTER_ERROR("KDS 1 (Hot Kitchen)"),
        icon: <Printer className="size-3.5" />,
      },
      {
        id: "2",
        type: "warning",
        message: t.DELAYED_ORDER("104", 20),
        icon: <AlertTriangle className="size-3.5" />,
      },
    ];
  }, [t]);

  useEffect(() => {
    if (alerts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [alerts.length]);

  if (!visible || !t || alerts.length === 0) return null;

  return (
    <div className="bg-white/75 backdrop-blur-xl border-b border-muted/40 py-2.5 animate-in slide-in-from-top duration-500 sticky top-0 z-50 w-full left-0 right-0 shadow-[0_1px_10px_rgba(0,0,0,0.03)]">
      <div className="w-full px-4 md:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-muted/80">
            <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
          </div>

          <div className="flex-1 min-w-0 h-6 relative overflow-hidden">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={cn(
                  "absolute inset-0 flex items-center gap-4 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) transform",
                  index === currentIndex
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-6 opacity-0 scale-95"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-1.5 rounded-full text-[11px] font-bold border shadow-xs transition-all",
                    alert.type === "danger"
                      ? "bg-red-50/60 text-red-600 border-red-100/40"
                      : "bg-amber-50/60 text-amber-600 border-amber-100/40"
                  )}
                >
                  <span
                    className={cn(
                      "size-5 rounded-full flex items-center justify-center shrink-0 shadow-xs",
                      alert.type === "danger" ? "bg-red-100/80" : "bg-amber-100/80"
                    )}
                  >
                    {alert.icon}
                  </span>
                  <span className="truncate max-w-[400px] md:max-w-none tracking-tight">
                    {alert.message}
                  </span>
                </div>

                {alerts.length > 1 && (
                  <div className="flex gap-2 ml-2">
                    {alerts.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "size-1 rounded-full transition-all duration-500",
                          idx === currentIndex
                            ? "bg-primary w-3 opacity-100"
                            : "bg-muted-foreground/20 w-1 opacity-50"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => setVisible(false)} variant="ghost" title={UI_TEXT.COMMON.CLOSE}>
          <X className="size-3.5 group-hover:text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
