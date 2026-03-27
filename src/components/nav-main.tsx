"use client";

import clsx from "clsx";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { UI_TEXT } from "@/lib/UI_Text";

export type NavMainProps = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  badge?: React.ReactNode | string;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: React.ReactNode | string;
  }[];
};

export function NavMain({ items }: { items: NavMainProps[] }) {
  const path = usePathname();

  const isUrlActive = (url: string) => path === url;
  const hasActivePrefix = (url: string) => path.startsWith(url);

  const isParentActive = (item: NavMainProps) => {
    if (isUrlActive(item.url)) return true;
    if (item.items) {
      return item.items.some((subItem) => isUrlActive(subItem.url));
    }
    return false;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={isParentActive(item)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items && item.items.length > 0 ? (
                <>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isParentActive(item)}
                    className={clsx({
                      "bg-sidebar-accent text-sidebar-accent-foreground ": isParentActive(item),
                    })}
                    asChild
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="group data-[state=open]:rotate-90 text-primary-foreground transition duration-300">
                      <ChevronRight
                        className={clsx(
                          "transition-colors",
                          isUrlActive(item.url)
                            ? "text-primary-foreground group-hover:text-primary-foreground hover:text-foreground"
                            : "text-foreground hover:text-foreground"
                        )}
                      />
                      <span className="sr-only">{UI_TEXT.COMMON.TOGGLE}</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isUrlActive(subItem.url) || hasActivePrefix(subItem.url)}
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && (
                                <subItem.icon className="size-4 text-muted-foreground" />
                              )}
                              <span className="flex-1">{subItem.title}</span>
                              {subItem.badge && (
                                <div className="ml-auto bg-rose-500 text-white hover:bg-rose-600 rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-[10px] py-0.5 px-1.5 font-bold shadow-sm">
                                  {subItem.badge}
                                </div>
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    aria-current={isUrlActive(item.url) ? "page" : undefined}
                    isActive={isUrlActive(item.url)}
                    className={clsx({
                      "hover:bg-sidebar-primary text-sidebar-accent-foreground": isUrlActive(
                        item.url
                      ),
                    })}
                  >
                    {item.icon && <item.icon />}
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <div className="ml-auto bg-rose-500 text-white hover:bg-rose-600 rounded-full min-w-[20px] h-[20px] flex items-center justify-center text-[10px] py-0.5 px-1.5 font-bold shadow-sm">
                        {item.badge}
                      </div>
                    )}
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
