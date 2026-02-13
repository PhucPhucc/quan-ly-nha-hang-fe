"use client";

import { Loader2, UtensilsCrossed } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { categoryService } from "@/services/categoryService";
import { menuService } from "@/services/menuService";
import { Category, MenuItem } from "@/types/Menu";

import OrderList from "./OrderList";

const CardMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, menuRes] = await Promise.all([
          categoryService.getAll(),
          menuService.getAll({ pageSize: 1000 }),
        ]);

        if (catRes.isSuccess && catRes.data) {
          setCategories(catRes.data.items || []);
        }
        if (menuRes.isSuccess && menuRes.data) {
          setMenuItems(menuRes.data.items || []);
        }
      } catch (error) {
        toast.error("Không thể tải thực đơn: " + (error instanceof Error ? error.message : ""));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return menuItems;
    return menuItems.filter((item) => item.categoryId === activeTab);
  }, [menuItems, activeTab]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground font-medium">Đang tải thực đơn...</span>
      </div>
    );
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col bg-background overflow-hidden"
    >
      <div className="px-3 py-2 border-b bg-muted/20 overflow-x-auto no-scrollbar">
        <TabsList className="flex w-max justify-start gap-2 bg-transparent p-0 h-auto">
          <TabsTrigger
            value="all"
            className="rounded-full border border-transparent bg-transparent px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:border-primary/20 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all uppercase tracking-wider"
          >
            {UI_TEXT.COMMON.ALL}
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.categoryId}
              value={cat.categoryId}
              className="rounded-full border border-transparent bg-transparent px-4 py-1.5 text-xs font-bold text-muted-foreground data-[state=active]:border-primary/20 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all uppercase tracking-wider whitespace-nowrap"
            >
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
        <TabsContent value={activeTab} className="m-0 h-full p-0 outline-none">
          {filteredItems.length > 0 ? (
            <OrderList menuList={filteredItems} />
          ) : (
            <EmptyState
              title="Trống"
              description="Danh mục này hiện chưa có món nào"
              icon={UtensilsCrossed}
            />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default CardMenu;
