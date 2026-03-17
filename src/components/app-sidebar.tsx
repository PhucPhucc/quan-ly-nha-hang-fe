"use client";

import {
  Bell,
  Boxes,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  Flame,
  History,
  LayoutDashboard,
  Martini,
  Package,
  Settings,
  ShelvingUnit,
  SquareMenu,
  Table,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import * as React from "react";

import { NavMain, NavMainProps } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

const routes: Record<EmployeeRole, NavMainProps[]> = {
  [EmployeeRole.MANAGER]: [
    {
      title: UI_TEXT.SIDE_BAR.DASHBOARD,
      url: "/manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: UI_TEXT.SIDE_BAR.MENU,
      url: "/manager/menu",
      icon: SquareMenu,
    },
    {
      title: UI_TEXT.SIDE_BAR.TABLE,
      url: "/manager/table",
      icon: Table,
    },
    {
      title: UI_TEXT.SIDE_BAR.RESERVATION,
      url: "/manager/reservation",
      icon: CalendarDays,
    },
    {
      title: UI_TEXT.SIDE_BAR.ORDER,
      url: "/manager/order",
      icon: UtensilsCrossed,
    },
    {
      title: UI_TEXT.SIDE_BAR.EMPLOYEE,
      url: "/manager/employee",
      icon: Users,
    },
    {
      title: UI_TEXT.SIDE_BAR.AUDIT_LOG,
      url: "/manager/audit-log",
      icon: ChartColumn,
    },
    {
      title: UI_TEXT.SIDE_BAR.INVENTORY,
      url: "/manager/inventory",
      icon: Package,
      items: [
        {
          title: UI_TEXT.INVENTORY.ALERTS_BTN,
          url: "/manager/inventory/alerts",
          icon: Bell,
        },
        {
          title: UI_TEXT.INVENTORY.SETTINGS.TITLE,
          url: "/manager/inventory/settings",
          icon: Settings,
        },
        {
          title: UI_TEXT.INVENTORY.STOCK_IN_TITLE,
          url: "/manager/inventory/stock-in",
          icon: Boxes,
        },
        {
          title: "Lịch sử kho",
          url: "/manager/inventory/transactions",
          icon: History,
        },
        {
          title: UI_TEXT.INVENTORY.OPENING_STOCK.TITLE,
          url: "/manager/inventory/opening-stock",
          icon: Package,
        },
      ],
    },
  ],
  [EmployeeRole.CASHIER]: [
    {
      title: UI_TEXT.SIDE_BAR.ORDER,
      url: "/order",
      icon: ClipboardList,
    },
    {
      title: UI_TEXT.SIDE_BAR.RESERVATION,
      url: "/reservation",
      icon: CalendarDays,
    },
    {
      title: UI_TEXT.SIDE_BAR.INVENTORY,
      url: "/table-booking",
      icon: ShelvingUnit,
    },
  ],
  [EmployeeRole.CHEFBAR]: [
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
  ],
  [EmployeeRole.WAITER]: [
    {
      title: UI_TEXT.SIDE_BAR.ORDER,
      url: "/waiter/order",
      icon: UtensilsCrossed,
    },
    {
      title: UI_TEXT.SIDE_BAR.TABLE,
      url: "/waiter/table",
      icon: Table,
    },
  ],
};

const data = {
  team: {
    name: "FoodHub",
    logo: UtensilsCrossed,
    plan: "Restaurant",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userRole = useAuthStore((state) => state.employee?.role);

  if (!userRole) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes[userRole as EmployeeRole]} />
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
