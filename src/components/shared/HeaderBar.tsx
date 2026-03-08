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
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
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
  const segment = pathSegments[pathSegments.length - 1];
  const NOTIF_COUNT = "3";
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md transition-all">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-9 w-9" />
          <Separator orientation="vertical" className="h-4" />
        </div>

        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <div
                className="flex items-center gap-1.5 font-semibold text-secondary-foreground"
                aria-current="page"
              >
                <span>{ROUTE_CONFIG[segment]?.label || segment}</span>
              </div>
            </BreadcrumbItem>
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
      </div>
    </header>
  );
};

export default HeaderBar;
