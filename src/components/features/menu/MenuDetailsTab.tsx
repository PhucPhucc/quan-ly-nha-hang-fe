import React from "react";

import { Card } from "@/components/ui/card";
import { MenuFormType } from "@/hooks/useMenuForm";
import { Category } from "@/types/Menu";

import { MenuBasicInfoFields } from "./MenuBasicInfoFields";
import { MenuComboItems } from "./MenuComboItems";
import { MenuStationTimeFields } from "./MenuStationTimeFields";

interface MenuDetailsTabProps {
  form: MenuFormType;
  categories: Category[];
}

export const MenuDetailsTab: React.FC<MenuDetailsTabProps> = ({ form, categories }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-2 space-y-6">
        <Card className="border-none overflow-hidden bg-background shadow-none">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <MenuBasicInfoFields form={form} categories={categories} />

              {!form.isSetMenuCategory ? (
                <MenuStationTimeFields form={form} />
              ) : (
                <MenuComboItems form={form} />
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
