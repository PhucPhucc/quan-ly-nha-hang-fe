import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { MenuItem, SetMenu } from "@/types/Menu";

import { MenuBasicInfoFields } from "./MenuBasicInfoFields";
import { MenuComboItems } from "./MenuComboItems";
import { MenuStationTimeFields } from "./MenuStationTimeFields";

interface MenuDetailsTabProps {
  editingItem: MenuItem | SetMenu | null;
  categories: { id: string; name: string; type: number }[];
  isUploading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  isSetMenuCategory: boolean;
  comboItems: { menuItemId: string; quantity: number }[];
  menuItems: MenuItem[];
  isFetchingCombo: boolean;
  addComboItem: () => void;
  updateComboItem: (
    index: number,
    field: "menuItemId" | "quantity",
    value: string | number
  ) => void;
  removeComboItem: (index: number) => void;
}

export const MenuDetailsTab: React.FC<MenuDetailsTabProps> = ({
  editingItem,
  categories,
  isUploading,
  onSubmit,
  onCancel,
  selectedCategoryId,
  setSelectedCategoryId,
  isSetMenuCategory,
  comboItems,
  menuItems,
  isFetchingCombo,
  addComboItem,
  updateComboItem,
  removeComboItem,
}) => {
  const isEditing = !!editingItem;

  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full bg-neutral-50/50">
      <div className="flex-1 p-6 space-y-6">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <MenuBasicInfoFields
                editingItem={editingItem}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
              />

              {!isSetMenuCategory ? (
                <>
                  <MenuStationTimeFields editingItem={editingItem} />
                </>
              ) : (
                <MenuComboItems
                  comboItems={comboItems}
                  menuItems={menuItems}
                  isFetchingCombo={isFetchingCombo}
                  addComboItem={addComboItem}
                  updateComboItem={updateComboItem}
                  removeComboItem={removeComboItem}
                />
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 px-8 flex justify-end gap-3 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
          className="h-11 px-8"
        >
          {UI_TEXT.MENU.BUTTON_CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={isUploading}
          className="h-11 px-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95"
        >
          {isUploading
            ? UI_TEXT.MENU.UPLOADING_IMAGE
            : isEditing
              ? UI_TEXT.MENU.BUTTON_UPDATE
              : UI_TEXT.MENU.BUTTON_CREATE}
        </Button>
      </div>
    </form>
  );
};
