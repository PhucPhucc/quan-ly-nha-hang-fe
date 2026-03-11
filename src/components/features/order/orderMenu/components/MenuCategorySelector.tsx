import React from "react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

const MenuCategorySelector = () => {
  return (
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
          {UI_TEXT.MENU.CATEGORY.COFFEE}
        </TabsTrigger>
        <TabsTrigger
          value="soup"
          className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          {UI_TEXT.MENU.CATEGORY.SOUP}
        </TabsTrigger>
        <TabsTrigger
          value="tea"
          className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          {UI_TEXT.MENU.CATEGORY.TEA}
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default MenuCategorySelector;
