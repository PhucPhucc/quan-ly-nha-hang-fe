import { UtensilsCrossed } from "lucide-react";
import React from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

const CardMenu = () => {
  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col bg-background overflow-hidden">
      <div className="px-3 py-2 border-b bg-muted/20">
        <TabsList className="flex w-full justify-start gap-2 bg-transparent p-0 h-auto">
          <TabsTrigger
            value="all"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            {UI_TEXT.COMMON.ALL}
          </TabsTrigger>
          <TabsTrigger
            value="cf"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            Caffee
          </TabsTrigger>
          <TabsTrigger
            value="soup"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            Soup
          </TabsTrigger>
          <TabsTrigger
            value="tea"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
          >
            Tea
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <TabsContent value="all" className="flex-1 m-0 h-full p-0">
          <EmptyState
            title="Chưa chọn bàn"
            description="Vui lòng chọn một bàn để bắt đầu gọi món"
            icon={UtensilsCrossed}
          />
        </TabsContent>
        <TabsContent value="cf" className="flex-1 m-0 h-full p-0">
          <EmptyState
            title="Không có món Caffee"
            description="Danh mục này hiện chưa có món nào"
            icon={UtensilsCrossed}
          />
        </TabsContent>
        <TabsContent value="soup" className="flex-1 m-0 h-full p-0">
          <EmptyState
            title="Không có món Soup"
            description="Danh mục này hiện chưa có món nào"
            icon={UtensilsCrossed}
          />
        </TabsContent>
        <TabsContent value="tea" className="flex-1 m-0 h-full p-0">
          <EmptyState
            title="Không có món Tea"
            description="Danh mục này hiện chưa có món nào"
            icon={UtensilsCrossed}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default CardMenu;

// const menuAll = MOCK_MENU_ITEMS.filter((item) => item);
// const menuCF = MOCK_MENU_ITEMS.filter((item) => item.category_id === "CAT_01");
