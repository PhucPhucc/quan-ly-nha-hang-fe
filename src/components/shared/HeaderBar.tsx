"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";

type ROUTE = {
  dashboard: string;
  orders: string;
  menu: string;
  staff: string;
  settings: string;
  inventory: string;
};

const ROUTE_NAMES: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders Management",
  menu: "Menu",
  staff: "Staff Management",
  settings: "Settings",
  inventory: "Inventory",
};

const HeaderBar = () => {
  const pathname = usePathname();

  const pathSegment = pathname.split("/").filter((seg) => seg);
  return (
    <header
      className='flex h-16 shrink-0 items-center gap-2
                          transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'
    >
      <div className='flex items-center gap-2 px-2'>
        <div className='hover:bg-sidebar-accent p-0.5 rounded-lg'>
          <SidebarTrigger />
        </div>
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4 bg-foreground w-px'
        />
        <p className='text-sm'>
          {pathSegment.map((segment) => {
            const displayName = !isNaN(Number(segment))
              ? `#${segment}`
              : ROUTE_NAMES[segment] || segment;

            return displayName;
          })}
        </p>
      </div>
    </header>
  );
};

export default HeaderBar;
