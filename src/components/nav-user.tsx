"use client";

import { ChevronsUpDown, Globe, LogOut, Moon, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { useTheme } from "@/store/ThemeContext";
import { useAuthStore } from "@/store/useAuthStore";
import type { Locale } from "@/store/useLanguageStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { EmployeeRole } from "@/types/Employee";
import { ThemeMode } from "@/types/enums";

const LANGUAGE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

export function NavUser() {
  const { isMobile } = useSidebar();
  const { employee } = useAuthStore();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);

  const handleLogout = () => {
    router.push("/logout");
  };

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
    window.location.reload();
  };

  const name = employee?.fullName || UI_TEXT.PROFILE.ADMIN_USER;
  const currentLang = LANGUAGE_OPTIONS.find((l) => l.value === locale);
  const nextLang = LANGUAGE_OPTIONS.find((l) => l.value !== locale);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-2xl transition-all"
            >
              <Avatar className=" border-2 border-primary/10 shadow-sm overflow-hidden bg-muted flex items-center justify-center">
                <AvatarFallback className="bg-muted p-2">
                  <User className="size-5 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                <span className="truncate font-semibold text-foreground">{name}</span>
                <span className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {employee?.role === EmployeeRole.MANAGER
                    ? UI_TEXT.ROLE.MANAGER
                    : employee?.role === EmployeeRole.CASHIER
                      ? UI_TEXT.ROLE.CASHIER
                      : UI_TEXT.ROLE.CHEF}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-60 rounded-xl p-2 shadow-2xl bg-card text-card-foreground"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
            {/* Header: user info */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-2.5 text-left">
                <Avatar className="h-10 w-10 border-2 border-primary/10 overflow-hidden bg-muted flex items-center justify-center">
                  <AvatarFallback className="bg-muted p-2">
                    <User className="size-6 text-muted-foreground" />
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
              {/* Profile */}
              <DropdownMenuItem className="rounded-xl p-2.5 gap-3 cursor-pointer" asChild>
                <Link href="/profile" className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg shrink-0">
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

              {/* Language switcher */}
              <DropdownMenuItem
                className="rounded-xl p-2.5 gap-3 cursor-pointer"
                onClick={() => handleLocaleChange(nextLang?.value ?? "vi")}
              >
                <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                  <Globe className="size-4 text-primary" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-sm">{UI_TEXT.BUTTON.LANGUAGE}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {currentLang?.flag} {currentLang?.label}
                  </span>
                </div>
              </DropdownMenuItem>

              {/* Dark mode toggle */}
              <DropdownMenuItem
                className="rounded-xl p-2.5 gap-3 cursor-pointer"
                onSelect={(e) => e.preventDefault()}
                onClick={toggleTheme}
              >
                <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                  <Moon className="size-4 text-primary" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-semibold text-sm">{UI_TEXT.BUTTON.TOGGLE_THEME}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {UI_TEXT.BUTTON.TOGGLE_THEME_DESC}
                  </span>
                </div>
                <Switch
                  checked={theme === ThemeMode.DARK}
                  onCheckedChange={toggleTheme}
                  className="ml-auto pointer-events-none"
                  tabIndex={-1}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-2" />

            {/* Logout */}
            <DropdownMenuItem
              className="rounded-xl p-2.5 gap-3 text-primary focus:bg-primary/10 focus:text-primary cursor-pointer"
              onClick={handleLogout}
            >
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <LogOut className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{UI_TEXT.AUTH.LOGOUT}</span>
                <span className="text-[10px] text-muted-foreground">
                  {UI_TEXT.AUTH.LOGOUT_DESC}
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
