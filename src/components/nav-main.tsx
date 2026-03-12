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

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const path = usePathname();

  const isUrlActive = (url: string) => path === url;

  const isParentActive = (item: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }) => {
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
                      "bg-sidebar-accent text-sidebar-accent-foreground": isParentActive(item),
                    })}
                    asChild
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]/collapsible:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">{UI_TEXT.COMMON.TOGGLE}</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isUrlActive(subItem.url)}>
                            <Link href={subItem.url}>
                              {subItem.icon && (
                                <subItem.icon className="size-4 text-muted-foreground" />
                              )}
                              <span>{subItem.title}</span>
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
                    <span>{item.title}</span>
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
