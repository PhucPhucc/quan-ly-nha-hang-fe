"use client";

import {
  ChartColumn,
  LayoutDashboard,
  Package,
  SquareMenu,
  Table,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  team: {
    name: "FoodHub",
    logo: UtensilsCrossed,
    plan: "Retaurant",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Menu",
      url: "/menu",
      icon: SquareMenu,
    },
    {
      title: "Tables",
      url: "/table",
      icon: Table,
    },
    {
      title: "Orders",
      url: "/order",
      icon: UtensilsCrossed,
    },
    {
      title: "Employee",
      url: "/employee",
      icon: Users,
    },
    {
      title: "Audit Logs",
      url: "/audit-log",
      icon: ChartColumn,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Package,
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
      <SidebarRail />
    </Sidebar>
  );
}
