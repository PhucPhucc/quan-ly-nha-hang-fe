import { Plus, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { MenuItem } from "@/types/Menu";

interface MenuComboItemsProps {
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

export const MenuComboItems: React.FC<MenuComboItemsProps> = ({
  comboItems,
  menuItems,
  isFetchingCombo,
  addComboItem,
  updateComboItem,
  removeComboItem,
}) => {
  return (
    <Field className="space-y-2 col-span-2">
      <div className="flex justify-between items-center mb-2">
        <Label>{UI_TEXT.MENU.LABEL_COMBO_ITEMS}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addComboItem}>
          <Plus className="h-4 w-4" /> {UI_TEXT.MENU.ADD_COMBO}
        </Button>
      </div>
      {isFetchingCombo && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.COMMON.LOADING}</div>
      )}
      {!isFetchingCombo && comboItems.length === 0 && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.MENU.EMPTY_COMBO}</div>
      )}
      <div className="space-y-2">
        {comboItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Select
              value={item.menuItemId}
              onValueChange={(val) => updateComboItem(index, "menuItemId", val)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={UI_TEXT.MENU.SELECT_ITEM_PLACEHOLDER} />
              </SelectTrigger>
              <SelectContent>
                {menuItems.map((m) => (
                  <SelectItem key={m.menuItemId} value={m.menuItemId}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              className="w-24"
              min="1"
              value={item.quantity}
              onChange={(e) => updateComboItem(index, "quantity", Number(e.target.value))}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeComboItem(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </Field>
  );
};
