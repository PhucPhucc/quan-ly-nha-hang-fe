"use client";

import { ChevronDown, ChevronUp, History, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: UI_TEXT.KDS.NAV.STATION,
    href: "/kds/station",
    icon: LayoutGrid,
  },
  {
    label: UI_TEXT.KDS.NAV.AUDIT_LOG,
    href: "/audit-log",
    icon: History,
  },
];

/* --- Sub-components --- */

interface KDSQuickNavToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const KDSQuickNavToggle = ({ isExpanded, onToggle }: KDSQuickNavToggleProps) => (
  <button
    onClick={onToggle}
    className={cn(
      "flex items-center justify-center transition-colors duration-200",
      isExpanded ? "w-full h-8 hover:bg-muted/50 rounded-xl" : "w-full h-full rounded-2xl"
    )}
    aria-label={isExpanded ? UI_TEXT.KDS.NAV.COLLAPSE : UI_TEXT.KDS.NAV.EXPAND}
  >
    {isExpanded ? (
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    ) : (
      <ChevronUp className="h-4 w-4 text-muted-foreground" />
    )}
  </button>
);

interface KDSQuickNavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
}

const KDSQuickNavItem = ({ href, label, icon: Icon, isActive }: KDSQuickNavItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-2 px-5 py-2.5 rounded-2xl group whitespace-nowrap transition-all duration-200",
      isActive
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
        : "hover:bg-muted text-muted-foreground hover:text-foreground"
    )}
  >
    <Icon className="h-4 w-4 shrink-0" />
    <span className="text-sm font-semibold tracking-tight">{label}</span>
  </Link>
);

/* --- Main Component --- */

export function KDSQuickNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={cn(
          "flex flex-col items-center bg-secondary/95 backdrop-blur-md border border-muted-foreground/30 shadow-2xl overflow-hidden",
          isExpanded
            ? "rounded-3xl p-2 gap-2 w-auto max-w-[400px]"
            : "rounded-xl p-0 w-28 h-8 justify-center"
        )}
      >
        {/* Toggle Area / Notch */}
        <KDSQuickNavToggle isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />

        {/* Dynamic content */}
        <div
          className={cn(
            "flex items-center gap-1",
            isExpanded
              ? "opacity-100 scale-100 h-auto pb-1"
              : "opacity-0 scale-95 pointer-events-none absolute h-0"
          )}
        >
          {NAV_ITEMS.map((item) => (
            <KDSQuickNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
