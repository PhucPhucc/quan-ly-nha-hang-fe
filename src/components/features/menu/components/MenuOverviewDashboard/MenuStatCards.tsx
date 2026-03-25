import { AlertTriangle, Boxes, Layers3, PackageCheck } from "lucide-react";
import React from "react";

import { InventoryStatCard } from "@/components/features/inventory/components/InventoryStatCard";
import { UI_TEXT } from "@/lib/UI_Text";

import { MenuOverviewData } from "./MenuOverviewDashboardTypes";

interface MenuStatCardsProps {
  isLoading: boolean;
  sellableCount: number;
  totalMenuItems: number;
  comboCount: number;
  unavailableCount: number;
  activeCategoryCount: number;
  totalNormalCategories: number;
  data: MenuOverviewData | undefined;
}

export const MenuStatCards: React.FC<MenuStatCardsProps> = ({
  isLoading,
  sellableCount,
  totalMenuItems,
  comboCount,
  unavailableCount,
  activeCategoryCount,
  totalNormalCategories,
}) => {
  return (
    <div className="grid grid-cols-1 gap-2.5 px-4 md:grid-cols-2 xl:grid-cols-4">
      <InventoryStatCard
        icon={PackageCheck}
        label={UI_TEXT.MENU.OVERVIEW.STATS.SELLABLE}
        value={sellableCount}
        subLabel={UI_TEXT.MENU.TAB_ITEM}
        subValue={totalMenuItems}
        isLoading={isLoading}
        href="/manager/menu/list"
        variant="success"
        compact
      />
      <InventoryStatCard
        icon={Layers3}
        label={UI_TEXT.MENU.OVERVIEW.STATS.COMBOS}
        value={comboCount}
        subLabel={UI_TEXT.MENU.TAB_COMBO}
        subValue={comboCount}
        isLoading={isLoading}
        href="/manager/menu/list"
        variant="info"
        compact
      />
      <InventoryStatCard
        icon={AlertTriangle}
        label={UI_TEXT.MENU.OVERVIEW.STATS.UNAVAILABLE}
        value={unavailableCount}
        subLabel={UI_TEXT.MENU.STATUS_OUT_OF_STOCK}
        subValue={unavailableCount}
        isLoading={isLoading}
        href="/manager/menu/list"
        variant={unavailableCount > 0 ? "warning" : "default"}
        compact
      />
      <InventoryStatCard
        icon={Boxes}
        label={UI_TEXT.MENU.OVERVIEW.STATS.CATEGORIES}
        value={activeCategoryCount}
        subLabel={UI_TEXT.MENU.FILTER_ALL_CATEGORY}
        subValue={totalNormalCategories}
        isLoading={isLoading}
        compact
      />
    </div>
  );
};
