"use client";

import {
  Bell,
  History,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Table as TableIcon,
  User,
  Users,
  Utensils,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

import { Badge } from "../ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

const ROUTE_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  dashboard: { label: "Tổng quan", icon: <LayoutDashboard className="size-3.5" /> },
  order: { label: "Bán hàng", icon: <ShoppingCart className="size-3.5" /> },
  menu: { label: "Thực đơn", icon: <Utensils className="size-3.5" /> },
  employee: { label: "Nhân viên", icon: <Users className="size-3.5" /> },
  "audit-log": { label: "Lịch sử", icon: <History className="size-3.5" /> },
  profile: { label: "Cá nhân", icon: <User className="size-3.5" /> },
  table: { label: "Sơ đồ bàn", icon: <TableIcon className="size-3.5" /> },
};

const HeaderBar = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((seg) => seg);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md transition-all">
      {/* Left section: Sidebar Trigger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9" />
          <Separator orientation="vertical" className="h-4" />
        </div>

        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                <LayoutDashboard className="size-3.5" />
                <span className="text-xs font-medium">FoodHub</span>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => {
              const config = ROUTE_CONFIG[segment];
              const isLast = index === pathSegments.length - 1;
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

              if (segment === "dashboard" && index === 0) return null;

              return (
                <React.Fragment key={segment}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="flex items-center gap-1.5 font-bold text-primary">
                        {config?.icon}
                        <span className="text-xs uppercase tracking-wider">
                          {config?.label || segment}
                        </span>
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="flex items-center gap-1.5">
                        {config?.icon}
                        <span className="text-xs">{config?.label || segment}</span>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-muted"
        >
          <Bell className="size-5 text-slate-600" />
          <Badge
            className="absolute right-2 top-2 h-4 w-4 border-2 border-background p-0 flex items-center justify-center text-[8px]"
            variant="destructive"
          >
            3
          </Badge>
        </Button>

        <Separator orientation="vertical" className="mx-2 h-6" />

        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
          <Settings className="size-5 text-slate-600" />
        </Button>
      </div>
    </header>
  );
};

export default HeaderBar;
