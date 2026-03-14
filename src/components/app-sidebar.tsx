"use client";

import {
  Bell,
  ChartColumn,
  History,
  LayoutDashboard,
  Package,
  Settings,
  SquareMenu,
  Table,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { UI_TEXT } from "@/lib/UI_Text";

const data = {
  team: {
    name: "FoodHub",
    logo: UtensilsCrossed,
    plan: "Restaurant",
  },
  navMain: [
    {
      title: UI_TEXT.SIDE_BAR.DASHBOARD,
      url: "/manager/dashboard",
      icon: LayoutDashboard,
      isActive: true,
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
