"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { TableOfContents, X } from "lucide-react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";

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

const NavEmployee = () => {
  // const [position, setPosition] = useState("bottom-left");
  const employee = useAuthStore((state) => state.employee);

  return (
    <div className="fixed bottom-6 left-6 z-50 ">
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
          {/* <div className="flex justify-between">
            <span className="font-semibold">{UI_TEXT.AUTH.EMPLOYEE_CODE} </span>
            <span className="text-muted-foreground">{employee?.username}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{UI_TEXT.EMPLOYEE.ROLE} </span>
            <span className="text-muted-foreground">{employee?.role}</span>
          </div> */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">{UI_TEXT.PREFERENCE.TITLE}</span>
            <PopoverClose className="hover:cursor-pointer">
              <X className="size-5 text-muted-foreground" />
            </PopoverClose>
          </div>
          <Separator className="my-2" />

          <FeatureItem title="Thông tin nhân viên" des="Xem thông tin cá nhân và vai trò">
            <div className="text-sm text-muted-foreground">
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
                    <ListLink
                      href="/reservation"
                      title={UI_TEXT.PREFERENCE.NAVIGATION_RESERVATION}
                      des={UI_TEXT.PREFERENCE.NAVIGATION_RESERVATION_DESC}
                    />
                    <ListLink
                      href="/revenue"
                      title={UI_TEXT.PREFERENCE.NAVIGATION_REVENUE}
                      des={UI_TEXT.PREFERENCE.NAVIGATION_REVENUE_DESC}
                    />
                    <ListLink
                      href="/log"
                      title={UI_TEXT.PREFERENCE.NAVIGATION_LOG}
                      des={UI_TEXT.PREFERENCE.NAVIGATION_LOG_DESC}
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </FeatureItem>

          <FeatureItem title={UI_TEXT.PREFERENCE.POSITION} des={UI_TEXT.PREFERENCE.POSITION_DESC}>
            <Select defaultValue="bottom-left">
              <SelectTrigger className="w-full max-w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectGroup>
                  <SelectItem value="bottom-left">
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
            <Select defaultValue="light">
              <SelectTrigger className="w-full max-w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectGroup>
                  <SelectItem value="light">{UI_TEXT.PREFERENCE.THEME_LIGHT}</SelectItem>
                  <SelectItem value="dark">{UI_TEXT.PREFERENCE.THEME_DARK}</SelectItem>
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

function ListLink({ href, title, des }: { href: string; title: string; des: string }) {
  return (
    <NavigationMenuLink href={href} className="block w-72">
      <div className="flex flex-col gap-1 text-sm">
        <div className="leading-none font-medium">{title}</div>
        <div className="line-clamp-2 text-muted-foreground">{des}</div>
      </div>
    </NavigationMenuLink>
  );
}
