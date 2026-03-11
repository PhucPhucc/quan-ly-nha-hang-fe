"use client";

import { ChevronDown, ChevronUp, History, LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { logout } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

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
  <Button
    variant="ghost"
    onClick={onToggle}
    className={cn(
      "rounded-b-0 transition-colors duration-200",
      isExpanded ? "w-full h-8 hover:bg-muted/50 rounded-lg" : "w-full h-full"
    )}
    aria-label={isExpanded ? UI_TEXT.KDS.NAV.COLLAPSE : UI_TEXT.KDS.NAV.EXPAND}
  >
    {isExpanded ? (
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    ) : (
      <ChevronUp className="h-4 w-4 text-muted-foreground" />
    )}
  </Button>
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
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const clearAuth = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("[KDSQuickNav] logout failed", err);
    } finally {
      clearAuth();
      router.replace("/login");
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
      <div
        className={cn(
          "flex flex-col items-center bg-secondary/95 backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-300",
          isExpanded
            ? "rounded-t-xl p-3 pb-6 gap-3 w-auto max-w-100  border border-b-0 border-muted-foreground/30"
            : "rounded-t-2xl p-0 w-32 h-6 justify-center border border-b-0 border-muted-foreground/20 hover:bg-secondary"
        )}
      >
        {/* Toggle Area / Notch */}
        <KDSQuickNavToggle isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />

        {/* Dynamic content */}
        <div
          className={cn(
            "flex items-center gap-1 transition-all duration-300",
            isExpanded
              ? "opacity-100 scale-100 h-auto"
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
          <Button
            variant="destructive"
            size="sm"
            className="rounded-2xl h-10 px-4 gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-semibold tracking-tight">{UI_TEXT.AUTH.LOGOUT}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
