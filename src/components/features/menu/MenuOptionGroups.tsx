import { Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { UI_TEXT } from "@/lib/UI_Text";
import { OptionType } from "@/types/enums";
import { OptionGroup, OptionItem } from "@/types/Menu";

import { MenuOptionGroupCard } from "./components/MenuOptionGroupCard";

interface MenuOptionGroupsProps {
  optionGroups: Partial<OptionGroup>[];
  setOptionGroups: React.Dispatch<React.SetStateAction<Partial<OptionGroup>[]>>;
  isFetchingOptions: boolean;
  onDeleteGroup: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export const MenuOptionGroups: React.FC<MenuOptionGroupsProps> = ({
  optionGroups,
  setOptionGroups,
  isFetchingOptions,
  onDeleteGroup,
  onDeleteItem,
}) => {
  const handleAddGroup = () => {
    setOptionGroups([
      ...optionGroups,
      {
        optionGroupId: `temp-${Date.now()}`,
        name: "",
        optionType: OptionType.SINGLE_SELECT,
        isRequired: false,
        optionItems: [],
      },
    ]);
  };

  const handleUpdateGroup = (
    groupIndex: number,
    field: keyof OptionGroup,
    value: string | number | boolean
  ) => {
    const newGroups = [...optionGroups];
    newGroups[groupIndex] = { ...newGroups[groupIndex], [field]: value };
    setOptionGroups(newGroups);
  };

  const handleRemoveGroup = (groupIndex: number) => {
    const groupToRemove = optionGroups[groupIndex];
    if (groupToRemove.optionGroupId && !groupToRemove.optionGroupId.startsWith("temp-")) {
      onDeleteGroup(groupToRemove.optionGroupId);
    }
    setOptionGroups(optionGroups.filter((_, idx) => idx !== groupIndex));
  };

  const handleAddItem = (groupIndex: number) => {
    const newGroups = [...optionGroups];
    const items = newGroups[groupIndex].optionItems || [];
    newGroups[groupIndex].optionItems = [
      ...items,
      {
        optionItemId: `temp-item-${Date.now()}`,
        label: "",
        extraPrice: 0,
      } as Partial<OptionItem> as OptionItem,
    ];
    setOptionGroups(newGroups);
  };

  const handleUpdateItem = (
    groupIndex: number,
    itemIndex: number,
    field: keyof OptionItem,
    value: string | number | boolean
  ) => {
    const newGroups = [...optionGroups];
    const items = [...(newGroups[groupIndex].optionItems || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    newGroups[groupIndex].optionItems = items;
    setOptionGroups(newGroups);
  };

  const handleRemoveItem = (groupIndex: number, itemIndex: number) => {
    const newGroups = [...optionGroups];
    const items = [...(newGroups[groupIndex].optionItems || [])];
    const itemToRemove = items[itemIndex];
    if (itemToRemove.optionItemId && !itemToRemove.optionItemId.startsWith("temp-")) {
      onDeleteItem(itemToRemove.optionItemId);
    }
    items.splice(itemIndex, 1);
    newGroups[groupIndex].optionItems = items;
    setOptionGroups(newGroups);
  };

  return (
    <Field className="space-y-4 col-span-2">
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <Label className="text-lg font-semibold text-foreground">
          {UI_TEXT.MENU.OPTIONS.TITLE}
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={handleAddGroup}>
          <Plus className="h-4 w-4 mr-2" /> {UI_TEXT.BUTTON.ADD}
        </Button>
      </div>

      {isFetchingOptions && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.COMMON.LOADING}</div>
      )}

      {!isFetchingOptions && optionGroups.length === 0 && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.MENU.OPTIONS.MENU_FAILED}</div>
      )}

      <div className="space-y-4">
        {optionGroups.map((group, groupIdx) => (
          <MenuOptionGroupCard
            key={group.optionGroupId}
            group={group}
            groupIdx={groupIdx}
            handleUpdateGroup={handleUpdateGroup}
            handleRemoveGroup={handleRemoveGroup}
            handleAddItem={handleAddItem}
            handleUpdateItem={handleUpdateItem}
            handleRemoveItem={handleRemoveItem}
          />
        ))}
      </div>
    </Field>
  );
};
