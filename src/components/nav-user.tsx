"use client";

import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
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
                <span className="truncate font-semibold text-slate-700">{name}</span>
                <span className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {employee?.role === 1 ? "Quản lý" : "Nhân viên"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[240px] rounded-2xl p-2 shadow-2xl"
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
                  <span className="truncate font-semibold text-slate-800">{name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {employee?.email || employee?.employeeCode}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem
                className="rounded-xl p-2.5 gap-3 cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <div className="bg-primary/10 p-2 rounded-lg">
                  <User className="size-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Hồ sơ cá nhân</span>
                  <span className="text-[10px] text-muted-foreground">Thông tin & Bảo mật</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl p-2.5 gap-3 cursor-pointer">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Settings className="size-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Cài đặt</span>
                  <span className="text-[10px] text-muted-foreground">Tùy chỉnh hệ thống</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem
              className="rounded-xl p-2.5 gap-3 text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer"
              onClick={handleLogout}
            >
              <div className="bg-rose-50 p-2 rounded-lg">
                <LogOut className="size-4 text-rose-500" />
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
