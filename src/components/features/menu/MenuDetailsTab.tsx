import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMenuForm } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";

import { MenuBasicInfoFields } from "./MenuBasicInfoFields";
import { MenuComboItems } from "./MenuComboItems";
import { MenuOptionGroups } from "./MenuOptionGroups";
import { MenuStationTimeFields } from "./MenuStationTimeFields";

interface MenuDetailsTabProps {
  form: ReturnType<typeof useMenuForm>;
  categories: { id: string; name: string; type: number }[];
}

export const MenuDetailsTab: React.FC<MenuDetailsTabProps> = ({ form, categories }) => {
  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col h-full ">
      <div className="flex-1 px-2 space-y-6">
        <Card className="border-none overflow-hidden bg-background shadow-none">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <MenuBasicInfoFields
                editingItem={form.editingItem}
                categories={categories}
                selectedCategoryId={form.selectedCategoryId}
                setSelectedCategoryId={form.setSelectedCategoryId}
              />

              {!form.isSetMenuCategory ? (
                <>
                  <MenuStationTimeFields editingItem={form.editingItem} />
                  <MenuOptionGroups
                    optionGroups={form.optionGroups}
                    setOptionGroups={form.setOptionGroups}
                    isFetchingOptions={form.isFetchingOptions}
                    onDeleteGroup={(id) => form.setDeletedGroupIds((prev) => [...prev, id])}
                    onDeleteItem={(id) => form.setDeletedItemIds((prev) => [...prev, id])}
                  />
                </>
              ) : (
                <MenuComboItems
                  comboItems={form.comboItems}
                  menuItems={form.menuItems}
                  isFetchingCombo={form.isFetchingCombo}
                  addComboItem={form.addComboItem}
                  updateComboItem={form.updateComboItem}
                  removeComboItem={form.removeComboItem}
                />
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 px-8 flex justify-end gap-3 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Button
          type="button"
          variant="ghost"
          onClick={form.handleClose}
          disabled={form.isUploading}
          className="h-11 px-8"
        >
          {UI_TEXT.MENU.BUTTON_CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={form.isUploading}
          className="h-11 px-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white transition-all active:scale-95"
        >
          {form.isUploading
            ? UI_TEXT.MENU.UPLOADING_IMAGE
            : form.isEditing
              ? UI_TEXT.MENU.BUTTON_UPDATE
              : UI_TEXT.MENU.BUTTON_CREATE}
        </Button>
      </div>
    </form>
  );
};
