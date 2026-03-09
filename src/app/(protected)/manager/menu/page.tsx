"use client";

import MenuDialogManager from "@/components/features/menu/MenuDialogManager";
import MenuFilters from "@/components/features/menu/MenuFilters";
import MenuTabsSection from "@/components/features/menu/MenuTabsSection";
import TopBar from "@/components/features/menu/TopBar";
import { useMenuActions } from "@/hooks/useMenuActions";
import { useMenuData } from "@/hooks/useMenuData";
import { type MenuDataItem, useMenuFilters } from "@/hooks/useMenuFilters";
import { EmployeeRole } from "@/types/Employee";
export default function MenuManagementPage() {
  const { loading, menuData, categories, refetch, singleItems } = useMenuData();

  const { filterProps, ...filteredResults } = useMenuFilters(menuData as MenuDataItem[]);
  const { dialogStates, editData, handlers } = useMenuActions(menuData as MenuDataItem[], refetch);

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <TopBar onNewItem={handlers.openCreateItem} onNewSet={handlers.openCreateSet} />
          <MenuFilters {...filterProps} categories={categories} />

          <MenuTabsSection
            loading={loading}
            results={filteredResults}
            handlers={handlers}
            role={EmployeeRole.MANAGER}
          />
        </div>
      </main>

      <MenuDialogManager
        dialogStates={dialogStates}
        editData={editData}
        handlers={handlers}
        categories={categories}
        allSingleItems={singleItems}
      />
    </div>
  );
}
