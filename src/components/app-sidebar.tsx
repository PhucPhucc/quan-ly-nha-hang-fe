"use client";

import {
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  ChartColumn,
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  Flame,
  History,
  Layers,
  LayoutDashboard,
  Library,
  Map,
  Martini,
  Package,
  PackagePlus,
  Settings2,
  SquareMenu,
  Table,
  Tag,
  Users,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import React, { ComponentProps, useMemo } from "react";

import { NavMain, NavMainProps } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { useInventoryAlertsCount } from "@/hooks/useInventoryAlertsCount";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

const data = {
  team: {
    name: "FoodHub",
    logo: UtensilsCrossed,
    plan: "Restaurant",
  },
};

const MANAGER_ROUTES = (alertsCount: number | undefined): NavMainProps[] => [
  {
    title: UI_TEXT.SIDE_BAR.DASHBOARD,
    url: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: UI_TEXT.SIDE_BAR.MENU,
    url: "/manager/menu",
    icon: SquareMenu,
    items: [
      {
        title: "Tổng quan",
        url: "/manager/menu",
        icon: LayoutDashboard,
      },
      {
        title: "Danh sách món",
        url: "/manager/menu/list",
        icon: ClipboardList,
      },
      {
        title: UI_TEXT.MENU.OPTIONS.REUSABLE_TITLE,
        url: "/manager/menu/options",
        icon: Library,
      },
    ],
  },
  {
    title: UI_TEXT.SIDE_BAR.TABLE_MANAGEMENT,
    url: "/manager/table",
    icon: Table,
    items: [
      {
        title: "Tổng quan",
        url: "/manager/table",
        icon: LayoutDashboard,
      },
      {
        title: "Sơ đồ bàn",
        url: "/manager/table/layout",
        icon: Map,
      },
      {
        title: UI_TEXT.SIDE_BAR.RESERVATION,
        url: "/manager/reservation",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: UI_TEXT.SIDE_BAR.ORDER,
    url: "/manager/order",
    icon: UtensilsCrossed,
    items: [
      {
        title: "Tổng quan",
        url: "/manager/order",
        icon: LayoutDashboard,
      },
      {
        title: "Danh sách đơn",
        url: "/manager/order/list",
        icon: ClipboardList,
      },
      {
        title: UI_TEXT.VOUCHER.TITLE,
        url: "/manager/voucher",
        icon: Tag,
      },
      {
        title: "Lịch sử thanh toán",
        url: "/manager/order/billing-history",
        icon: CreditCard,
      },
      {
        title: "Nhật ký thao tác",
        url: "/manager/order/audit-log",
        icon: History,
      },
    ],
  },
  {
    title: UI_TEXT.SIDE_BAR.HR_MANAGEMENT,
    url: "/manager/employee",
    icon: Users,
    items: [
      {
        title: "Tổng quan",
        url: "/manager/employee",
        icon: LayoutDashboard,
      },
      {
        title: UI_TEXT.SIDE_BAR.EMPLOYEE,
        url: "/manager/employee/list",
        icon: Users,
      },
      {
        title: UI_TEXT.SIDE_BAR.SHIFT,
        url: "/manager/shift",
        icon: Clock,
      },
      {
        title: UI_TEXT.SIDE_BAR.SCHEDULE,
        url: "/manager/schedule",
        icon: CalendarDays,
      },
      {
        title: UI_TEXT.SIDE_BAR.ATTENDANCE,
        url: "/manager/attendance",
        icon: CheckCircle2,
      },
    ],
  },
  {
    title: UI_TEXT.SIDE_BAR.INVENTORY,
    url: "/manager/inventory",
    icon: Package,
    badge: alertsCount && alertsCount > 0 ? alertsCount : undefined,
    items: [
      {
        title: "Tổng quan",
        url: "/manager/inventory",
        icon: LayoutDashboard,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.INGREDIENTS,
        url: "/manager/inventory/ingredients",
        icon: Package,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.GROUPS,
        url: "/manager/inventory/groups",
        icon: Layers,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.STOCK_IO,
        url: "/manager/inventory/stock-in",
        icon: PackagePlus,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.OPENING_STOCK,
        url: "/manager/inventory/opening-stock",
        icon: Warehouse,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.CHECK,
        url: "/manager/inventory/check",
        icon: ClipboardList,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.REPORT,
        url: "/manager/inventory/reports",
        icon: ChartColumn,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.LEDGER,
        url: "/manager/inventory/ledger",
        icon: Library,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.LOTS,
        url: "/manager/inventory/lots",
        icon: Boxes,
      },
      {
        title: UI_TEXT.INVENTORY.ALERTS_BTN,
        url: "/manager/inventory/alerts",
        icon: Bell,
        badge: alertsCount && alertsCount > 0 ? alertsCount : undefined,
      },
      {
        title: UI_TEXT.INVENTORY.NAV.TRANSACTIONS,
        url: "/manager/inventory/transactions",
        icon: History,
      },
    ],
  },
  {
    title: UI_TEXT.SIDE_BAR.SETTINGS,
    url: "/manager/settings",
    icon: Settings2,
    items: [
      {
        title: UI_TEXT.SETTINGS.NAV_GENERAL,
        url: "/manager/settings",
        icon: Building2,
      },
      {
        title: UI_TEXT.SETTINGS.NAV_WAREHOUSE,
        url: "/manager/settings/warehouse",
        icon: Warehouse,
      },
      {
        title: UI_TEXT.SETTINGS.NAV_RESERVATION,
        url: "/manager/settings/reservation",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: UI_TEXT.SIDE_BAR.AUDIT_LOG,
    url: "/manager/audit-log",
    icon: ChartColumn,
  },
];

const CASHIER_ROUTES: NavMainProps[] = [
  {
    title: UI_TEXT.SIDE_BAR.ORDER,
    url: "/order",
    icon: ClipboardList,
  },
  {
    title: UI_TEXT.SIDE_BAR.TABLE_MANAGEMENT,
    url: "/table-booking",
    icon: Table,
    items: [
      {
        title: UI_TEXT.SIDE_BAR.RESERVATION,
        url: "/reservation",
        icon: CalendarDays,
      },
    ],
  },
];

const CHEFBAR_ROUTES: NavMainProps[] = [
  {
    title: UI_TEXT.SIDE_BAR.STATION_KITCHEN,
    url: "/kds/kitchen",
    icon: Flame,
  },
  {
    title: UI_TEXT.SIDE_BAR.STATION_BAR,
    url: "/kds/bar",
    icon: Martini,
  },
  {
    title: UI_TEXT.SIDE_BAR.AUDIT_LOG,
    url: "/kds/audit-log",
    icon: History,
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const userRole = useAuthStore((state) => state.employee?.role);
  const { data: alertsCount } = useInventoryAlertsCount();

  const routes = useMemo(() => {
    if (!userRole) return [];
    switch (userRole) {
      case EmployeeRole.MANAGER:
        return MANAGER_ROUTES(alertsCount);
      case EmployeeRole.CASHIER:
        return CASHIER_ROUTES;
      case EmployeeRole.CHEFBAR:
        return CHEFBAR_ROUTES;
      default:
        return [];
    }
  }, [userRole, alertsCount]);

  if (!userRole) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes} />
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
