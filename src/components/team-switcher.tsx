"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string;
    logo: React.ElementType;
    plan: string;
    logoUrl?: string;
  };
}) {
  const Logo = team.logo;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=closed]:gap-0 data-[state=open]:text-sidebar-accent-foreground"
          >
            <Link
              href="/"
              className=" flex aspect-square size-8 items-center justify-center rounded-lg"
            >
              {team.logoUrl ? (
                <Image
                  src={team.logoUrl}
                  alt={team.name}
                  className="h-full w-full object-contain p-1"
                  width="32"
                  height="32"
                />
              ) : (
                <Logo className="size-4" />
              )}
            </Link>
            <div className="grid flex-1 text-left text-sm leading-tight bg-sidebar-primary text-sidebar-primary-foreground">
              <span className="truncate font-medium">{team.name}</span>
              <span className="truncate text-xs">{team.plan}</span>
            </div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
