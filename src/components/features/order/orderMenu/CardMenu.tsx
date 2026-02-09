import React from "react";

import { Tabs } from "@/components/ui/tabs";

import MenuCategorySelector from "./components/MenuCategorySelector";
import MenuGrid from "./components/MenuGrid";

const CardMenu = () => {
  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col bg-background overflow-hidden">
      <MenuCategorySelector />
      <MenuGrid />
    </Tabs>
  );
};

export default CardMenu;
