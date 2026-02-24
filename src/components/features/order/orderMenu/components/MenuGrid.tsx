import { UtensilsCrossed } from "lucide-react";
import React from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { TabsContent } from "@/components/ui/tabs";

const MenuGrid = () => {
  return (
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
  );
};

export default MenuGrid;
