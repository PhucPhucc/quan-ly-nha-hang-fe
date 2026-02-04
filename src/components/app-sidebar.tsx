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
import { useAuthStore } from "@/store/useAuthStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: UtensilsCrossed,
    roles: [1, 2, 3, 4], // All roles
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: [1, 2], // Manager, Cashier
  },
  {
    title: "Menu",
    url: "/menu",
    icon: SquareMenu,
    roles: [1, 3, 4], // Manager, Waiter, Chef
  },
  {
    title: "Tables",
    url: "/table",
    icon: Table,
    roles: [1, 2, 3], // Manager, Cashier, Waiter
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartColumn,
    roles: [1], // Manager only
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
    roles: [1, 4], // Manager, Chef
  },
  {
    title: "Employee",
    url: "/employee",
    icon: Users,
    roles: [1], // Manager only
  },
];

const teamData = {
  name: "FoodHub",
  logo: UtensilsCrossed,
  plan: "Restaurant",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { employee } = useAuthStore();

  const filteredNavMain = React.useMemo(() => {
    if (!employee) return [];
    return navigationItems.filter((item) => item.roles.includes(employee.role || 0));
  }, [employee]);

  const userData = React.useMemo(
    () => ({
      name: employee?.fullName || "Guest User",
      email: employee?.email || "No email",
      avtHoder: (employee?.fullName || "G").charAt(0).toUpperCase(),
    }),
    [employee]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={teamData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
