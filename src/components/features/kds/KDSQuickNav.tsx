"use client";

import { ChevronDown, ChevronUp, History, LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      "flex items-center gap-2 px-3 py-2 rounded-full transition-colors border",
      isActive
        ? "bg-primary/10 text-primary border-primary/20"
        : "hover:bg-muted text-muted-foreground border-transparent"
    )}
  >
    <Icon className="h-4 w-4 shrink-0" />
    <span className="text-sm font-semibold tracking-tight whitespace-nowrap">{label}</span>
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
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      {isExpanded ? (
        <Card className="inline-flex items-center gap-2 md:gap-3 px-3 py-2 shadow-lg">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {NAV_ITEMS.map((item) => (
              <KDSQuickNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={pathname === item.href}
              />
            ))}
            <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-semibold tracking-tight">{UI_TEXT.AUTH.LOGOUT}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-muted-foreground/20"
            onClick={() => setIsExpanded(false)}
            aria-label={UI_TEXT.KDS.NAV.COLLAPSE}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-full shadow-md border border-muted-foreground/20"
          onClick={() => setIsExpanded(true)}
          aria-label={UI_TEXT.KDS.NAV.EXPAND}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
