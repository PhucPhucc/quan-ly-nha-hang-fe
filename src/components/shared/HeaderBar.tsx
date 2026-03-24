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

import { InventoryNavigation } from "../features/inventory/components/InventoryNavigation";
import { MenuNavigation } from "../features/menu/components/MenuNavigation";
import { OrderNavigation } from "../features/order/components/OrderNavigation";
import { TableNavigation } from "../features/table-layout/components/TableNavigation";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

const ROUTE_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  dashboard: { label: "Tổng quan", icon: <LayoutDashboard className="size-3.5" /> },
  order: { label: "Bán hàng", icon: <ShoppingCart className="size-3.5" /> },
  "billing-history": { label: "Lịch sử thanh toán", icon: <CreditCard className="size-3.5" /> },
  "audit-log": { label: "Nhật ký thao tác", icon: <History className="size-3.5" /> },
  menu: { label: "Thực đơn", icon: <Utensils className="size-3.5" /> },
  employee: { label: "Nhân viên", icon: <Users className="size-3.5" /> },
  profile: { label: "Cá nhân", icon: <User className="size-3.5" /> },
  table: { label: "Sơ đồ bàn", icon: <TableIcon className="size-3.5" /> },
  inventory: { label: "Kho hàng", icon: <Utensils className="size-3.5" /> },
  "stock-in": { label: "Xuất nhập kho", icon: <History className="size-3.5" /> },
  voucher: { label: "Voucher", icon: <Tag className="size-3.5" /> },
};

const HeaderBar = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((seg) => seg);
  const segment = pathSegments[pathSegments.length - 1];
  const pageLabel = useMemo(() => {
    if (pathname === "/manager/order") return ROUTE_CONFIG.order.label;
    if (pathname === "/manager/order/list") return "Danh sách đơn hàng";
    if (pathname === "/manager/order/billing-history") return ROUTE_CONFIG["billing-history"].label;
    if (pathname === "/manager/order/audit-log") return ROUTE_CONFIG["audit-log"].label;
    if (pathname.startsWith("/manager/order/")) return "Chi tiết đơn hàng";
    return ROUTE_CONFIG[segment]?.label || segment;
  }, [pathname, segment]);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md transition-all">
      <div className="flex flex-1 items-center overflow-hidden">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9" />
          <Separator orientation="vertical" className="h-4" />
        </div>

        <div className="ml-2 hidden flex-1 items-center overflow-hidden md:flex">
          {pathname.startsWith("/manager/order") || pathname.startsWith("/manager/voucher") ? (
            <OrderNavigation />
          ) : pathname.startsWith("/manager/menu") ? (
            <MenuNavigation />
          ) : pathname.startsWith("/manager/inventory") ? (
            <InventoryNavigation />
          ) : pathname.startsWith("/manager/table") ||
            pathname.startsWith("/manager/reservation") ? (
            <TableNavigation />
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

      {/* Right section: Actions */}
      {/* <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-muted"
        >
          <Bell className="size-5 text-secondary-foreground" />
          <Badge
            className="absolute right-1 top-1 h-4 w-4 border-2 border-background p-0 flex items-center justify-center text-[8px]"
            variant="destructive"
          >
            {NOTIF_COUNT}
          </Badge>
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
          <Settings className="size-5 text-slate-600" />
        </Button>
      </div> */}
    </header>
  );
};

export default HeaderBar;
