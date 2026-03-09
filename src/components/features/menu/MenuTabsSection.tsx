"use client";

import CombosTab from "@/components/features/menu/CombosTab";
import ItemsTab from "@/components/features/menu/ItemsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuItem, SetMenu } from "@/types/Menu";

interface MenuResults {
  filteredSingles: MenuItem[];
  filteredCombos: SetMenu[];
}

type DeleteableItem = MenuItem | SetMenu;

interface MenuHandlers {
  handleToggleStock: (id: string) => void;
  openUpdateItem: (item: MenuItem & { type: "item" }) => void;
  openEditSet: (item: SetMenu) => void;
  handleDelete: (item: DeleteableItem) => void;
}

interface MenuTabsSectionProps {
  loading: boolean;
  results: MenuResults;
  handlers: MenuHandlers;
  role: string;
}

export default function MenuTabsSection({
  loading,
  results,
  handlers,
  role,
}: MenuTabsSectionProps) {
  return (
    <Tabs defaultValue="items" className="w-full">
      <TabsList className="grid w-fit grid-cols-2 bg-muted/50 p-1">
        <TabsTrigger value="items" className="px-8 font-semibold">
          Món lẻ
        </TabsTrigger>
        <TabsTrigger value="sets" className="px-8 font-semibold">
          Combo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="items" className="mt-6">
        <ItemsTab
          items={results.filteredSingles}
          role={role}
          onToggleStock={handlers.handleToggleStock}
          onEdit={handlers.openUpdateItem}
          onDelete={handlers.handleDelete}
        />
      </TabsContent>

      <TabsContent value="sets" className="mt-6">
        <CombosTab
          items={results.filteredCombos}
          role={role}
          onToggleStock={handlers.handleToggleStock}
          onEdit={handlers.openEditSet}
          onDelete={handlers.handleDelete}
        />
      </TabsContent>

      {loading && (
        <div className="p-8 text-center text-muted-foreground animate-pulse">
          Đang tải dữ liệu thực đơn...
        </div>
      )}
    </Tabs>
  );
}
