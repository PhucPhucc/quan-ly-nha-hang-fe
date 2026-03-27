"use client";

import {
  CreditCard,
  History,
  LayoutDashboard,
  ShoppingCart,
  Table as TableIcon,
  Tag,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

import { UI_TEXT } from "@/lib/UI_Text";

import { EmployeeNavigation } from "../features/Employee/components/EmployeeNavigation";
import { InventoryNavigation } from "../features/inventory/components/InventoryNavigation";
import { MenuNavigation } from "../features/menu/components/MenuNavigation";
import { OrderNavigation } from "../features/order/components/OrderNavigation";
import { SettingsNavigation } from "../features/settings/SettingsNavigation";
import { TableNavigation } from "../features/table-layout/components/TableNavigation";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

const HeaderBar = () => {
  const t = UI_TEXT.NAVIGATION;
  const ROUTE_CONFIG = useMemo<Record<string, { label: string; icon: React.ReactNode }>>(
    () => ({
      dashboard: { label: t.DASHBOARD, icon: <LayoutDashboard className="size-3.5" /> },
      order: { label: t.SALES, icon: <ShoppingCart className="size-3.5" /> },
      "billing-history": { label: t.BILLING_HISTORY, icon: <CreditCard className="size-3.5" /> },
      "audit-log": { label: t.AUDIT_LOG, icon: <History className="size-3.5" /> },
      menu: { label: t.MENU, icon: <Utensils className="size-3.5" /> },
      employee: { label: t.EMPLOYEE, icon: <Users className="size-3.5" /> },
      profile: { label: t.PROFILE, icon: <User className="size-3.5" /> },
      table: { label: t.TABLE_MAP, icon: <TableIcon className="size-3.5" /> },
      inventory: { label: t.INVENTORY, icon: <Utensils className="size-3.5" /> },
      "stock-in": { label: t.STOCK_HISTORY, icon: <History className="size-3.5" /> },
      voucher: { label: t.VOUCHER, icon: <Tag className="size-3.5" /> },
    }),
    [t]
  );

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((seg) => seg);
  const segment = pathSegments[pathSegments.length - 1];
  const pageLabel = useMemo(() => {
    if (pathname === "/manager/order") return ROUTE_CONFIG.order.label;
    if (pathname === "/manager/order/list") return t.ORDER_LIST;
    if (pathname === "/manager/order/billing-history") return ROUTE_CONFIG["billing-history"].label;
    if (pathname === "/manager/order/audit-log") return ROUTE_CONFIG["audit-log"].label;
    if (pathname.startsWith("/manager/order/")) return t.ORDER_DETAIL;
    return ROUTE_CONFIG[segment]?.label || segment;
  }, [pathname, segment, t, ROUTE_CONFIG]);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex flex-1 items-center overflow-hidden">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9" />
          <Separator orientation="vertical" className="h-4" />
        </div>

        <div className="ml-2 hidden flex-1 items-center overflow-hidden md:flex">
          {pathname.startsWith("/manager/order") ? (
            <OrderNavigation />
          ) : pathname.startsWith("/manager/menu") ? (
            <MenuNavigation />
          ) : pathname.startsWith("/manager/inventory") ? (
            <InventoryNavigation />
          ) : pathname.startsWith("/manager/table") ? (
            <TableNavigation />
          ) : pathname.startsWith("/manager/settings") ? (
            <SettingsNavigation />
          ) : pathname.startsWith("/manager/employee") ? (
            <EmployeeNavigation />
          ) : (
            <div
              className="flex items-center gap-1.5 font-semibold text-secondary-foreground"
              aria-current="page"
            >
              <span>{pageLabel}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
