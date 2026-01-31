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

// This is sample data.
const data = {
  user: {
    name: "username",
    email: "m@example.com",
    avtHoder: "u",
  },
  team: {
    name: "FoodHub",
    logo: UtensilsCrossed,
    plan: "Retaurant",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
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
      title: "Analytics",
      url: "/analytics",
      icon: ChartColumn,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Package,
    },
    {
      title: "Employee",
      url: "/employee",
      icon: Users,
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
