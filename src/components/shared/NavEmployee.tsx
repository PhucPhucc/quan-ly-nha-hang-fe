"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { ExternalLink, TableOfContents, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UI_TEXT } from "@/lib/UI_Text";
import { useTheme } from "@/store/ThemeContext";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";
import { ThemeMode } from "@/types/enums";

import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

const FeutureCashier = [
  {
    title: "Quản lý đặt bàn",
    des: "Xem và quản lý các đặt bàn của khách hàng",
    href: "/reservation",
  },
  {
    title: "Quản lý doanh thu",
    des: "Xem báo cáo doanh thu hàng ngày, hàng tuần, hàng tháng",
    href: "/revenue",
  },
  {
    title: "Xem nhật ký hoạt động",
    des: "Theo dõi các hoạt động của nhân viên và hệ thống",
    href: "/log",
  },
  {
    title: "Quản lý đặt bàn",
    des: "Xem và quản lý các đặt bàn của khách hàng",
    href: "/reservation1",
  },
  {
    title: "Quản lý doanh thu",
    des: "Xem báo cáo doanh thu hàng ngày, hàng tuần, hàng tháng",
    href: "/revenue1",
  },
  {
    title: "Xem nhật ký hoạt động",
    des: "Theo dõi các hoạt động của nhân viên và hệ thống",
    href: "/log1",
  },
];

const NavEmployee = () => {
  const [position, setPosition] = useState("bottom-left");
  const { theme, selectTheme } = useTheme();
  const employee = useAuthStore((state) => state.employee);

  const FeaturesRole = employee?.role === EmployeeRole.CASHIER ? FeutureCashier : [];

  let cssPosition = "";
  switch (position) {
    case "bottom-right":
      cssPosition = "bottom-6 right-6";
      break;
    case "top-right":
      cssPosition = "top-6 right-6";
      break;
    case "top-left":
      cssPosition = "top-6 left-6";
      break;
    default:
      cssPosition = "bottom-6 left-6";
      break;
  }

  return (
    <div className={`fixed ${cssPosition} z-50 `}>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="rounded-full p-5">
            <TableOfContents />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="bg-background py-3 px-4 text-sm w-100 mb-1 shadow-2xl gap-2 border-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">{UI_TEXT.PREFERENCE.TITLE}</span>
            <PopoverClose className="hover:cursor-pointer">
              <X className="size-5 text-muted-foreground" />
            </PopoverClose>
          </div>
          <Separator className="my-2" />

          <FeatureItem title="Thông tin nhân viên" des="Xem thông tin cá nhân và vai trò">
            <div className="text-sm text-muted-foreground text-right">
              <p className="">{employee?.username}</p>
              <p className="">{employee?.role}</p>
            </div>
          </FeatureItem>

          <FeatureItem
            title={UI_TEXT.PREFERENCE.NAVIGATION}
            des={UI_TEXT.PREFERENCE.NAVIGATION_DESC}
          >
            <NavigationMenu className="border rounded-md">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-normal">
                    {UI_TEXT.PREFERENCE.NAVIGATION_ACTION}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {FeaturesRole.map((feature) => (
                      <ListLink
                        key={feature.href}
                        href={feature.href}
                        title={feature.title}
                        des={feature.des}
                      />
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </FeatureItem>

          <FeatureItem title={UI_TEXT.PREFERENCE.POSITION} des={UI_TEXT.PREFERENCE.POSITION_DESC}>
            <Select defaultValue="bottom-left" onValueChange={(e) => setPosition(e)}>
              <SelectTrigger className="w-full max-w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs" position="popper">
                <SelectGroup>
                  <SelectItem value="bottom-left" onClick={() => console.log(123)}>
                    {UI_TEXT.PREFERENCE.POSITION_BOTTOM_LEFT}
                  </SelectItem>
                  <SelectItem value="bottom-right">
                    {UI_TEXT.PREFERENCE.POSITION_BOTTOM_RIGHT}
                  </SelectItem>
                  <SelectItem value="top-right">{UI_TEXT.PREFERENCE.POSITION_TOP_RIGHT}</SelectItem>
                  <SelectItem value="top-left">{UI_TEXT.PREFERENCE.POSITION_TOP_LEFT}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FeatureItem>

          <FeatureItem title={UI_TEXT.PREFERENCE.THEME} des={UI_TEXT.PREFERENCE.THEME_DESC}>
            <Select defaultValue={theme} onValueChange={(e) => selectTheme(e as ThemeMode)}>
              <SelectTrigger className="w-full max-w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectGroup>
                  <SelectItem value={ThemeMode.LIGHT}>{UI_TEXT.PREFERENCE.THEME_LIGHT}</SelectItem>
                  <SelectItem value={ThemeMode.DARK}>{UI_TEXT.PREFERENCE.THEME_DARK}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FeatureItem>

          <div className="w-full flex flex-row-reverse">
            <Link href="/logout" className="">
              <Button variant="outline" size="sm">
                {UI_TEXT.AUTH.LOGOUT}
              </Button>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NavEmployee;

function FeatureItem({
  title,
  des,
  children,
}: {
  title: string;
  des: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{des}</p>
        </div>
        {children}
      </div>
      <Separator className="my-3" />
    </>
  );
}

function ListLink({ href, title }: { href: string; title: string; des: string }) {
  return (
    <NavigationMenuLink href={href} className="block w-72">
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-start gap-2 leading-none font-medium">
          <span>{title}</span>
          <ExternalLink className="size-3 text-muted-foreground" />
        </div>
        {/* <div className="line-clamp-2 text-muted-foreground">{des}</div> */}
      </div>
    </NavigationMenuLink>
  );
}
