"use client";

import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { employee, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const name = employee?.fullName || "Admin User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-2xl transition-all"
            >
              <Avatar className="h-9 w-9 border-2 border-primary/10 shadow-sm">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                <AvatarFallback className="bg-primary/5 font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-semibold text-foreground">{name}</span>
                <span className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {employee?.role === EmployeeRole.MANAGER
                    ? UI_TEXT.ROLE.MANAGER
                    : UI_TEXT.ROLE.WAITER}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60 rounded-2xl p-2 shadow-2xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-2.5 text-left">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                  <AvatarFallback className="bg-primary/5 font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-foreground">{name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {employee?.email || employee?.employeeCode}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem className="rounded-xl p-2.5 gap-3 cursor-pointer">
                <Link href="/manager/profile" className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="size-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{UI_TEXT.PROFILE.PROFILE_TAB}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {UI_TEXT.PROFILE.PROFILE_DESC}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl p-2.5 gap-3 cursor-pointer">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Settings className="size-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{UI_TEXT.PROFILE.SETTINGS_TAB}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {UI_TEXT.PROFILE.SETTINGS_DESC}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              className="rounded-xl p-2.5 gap-3 text-primary focus:bg-rose-50 focus:text-primary-hover cursor-pointer"
              onClick={handleLogout}
            >
              <div className="bg-primary/10 p-2 rounded-lg">
                <LogOut className="size-4 text-primary" />
              </div>
              <span className="font-bold text-sm uppercase tracking-wider">
                {UI_TEXT.AUTH.LOGOUT}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
