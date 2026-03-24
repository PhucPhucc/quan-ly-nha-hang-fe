import { Plus, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { OptionType } from "@/types/enums";
import { OptionGroup, OptionItem } from "@/types/Menu";

interface MenuOptionGroupCardProps {
  group: Partial<OptionGroup>;
  groupIdx: number;
  handleUpdateGroup: (
    groupIndex: number,
    field: keyof OptionGroup,
    value: string | number | boolean
  ) => void;
  handleRemoveGroup: (groupIndex: number) => void;
  handleAddItem: (groupIndex: number) => void;
  handleUpdateItem: (
    groupIndex: number,
    itemIndex: number,
    field: keyof OptionItem,
    value: string | number | boolean
  ) => void;
  handleRemoveItem: (groupIndex: number, itemIndex: number) => void;
}

export const MenuOptionGroupCard: React.FC<MenuOptionGroupCardProps> = ({
  group,
  groupIdx,
  handleUpdateGroup,
  handleRemoveGroup,
  handleAddItem,
  handleUpdateItem,
  handleRemoveItem,
}) => {
  return (
    <div
      key={group.optionGroupId}
      className="p-4 border border-border rounded-xl space-y-4 bg-card"
    >
      <div className="flex gap-4 items-end">
        <div className="space-y-2 flex-1">
          <Label>{UI_TEXT.MENU.OPTIONS.NAME_GROUP}</Label>
          <Input
            value={group.name || ""}
            onChange={(e) => handleUpdateGroup(groupIdx, "name", e.target.value)}
            placeholder="Nhập tên nhóm..."
            required
          />
        </div>
        <div className="space-y-2 w-1/4">
          <Label>{UI_TEXT.MENU.OPTIONS.TYPE}</Label>
          <Select
            value={String(group.optionType) || String(OptionType.SINGLE_SELECT)}
            onValueChange={(val) => handleUpdateGroup(groupIdx, "optionType", Number(val))}
          >
            <SelectTrigger className="m-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={String(OptionType.SINGLE_SELECT)}>
                {UI_TEXT.MENU.OPTIONS.CHOOSE_ONE}
              </SelectItem>
              <SelectItem value={String(OptionType.MULTI_SELECT)}>
                {UI_TEXT.MENU.OPTIONS.MAXIMUM}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex items-center gap-2">
          <Label className="m-0">{UI_TEXT.MENU.OPTIONS.REQUIRED_LABEL}</Label>
          <Switch
            className="m-0"
            checked={group.isRequired}
            onCheckedChange={(checked) => handleUpdateGroup(groupIdx, "isRequired", checked)}
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => handleRemoveGroup(groupIdx)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Option Items */}
      <div className="pl-4 border-l-2 border-primary/20 space-y-2">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-sm text-muted-foreground">
            {UI_TEXT.MENU.OPTIONS.COMBO_ITEMS}
          </Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => handleAddItem(groupIdx)}>
            <Plus className="h-4 w-4 mr-1" /> {UI_TEXT.MENU.OPTIONS.ADD_TO_ORDER}
          </Button>
        </div>

        {group.optionItems?.map((item, itemIdx) => (
          <div key={item.optionItemId} className="flex gap-2 items-center">
            <Input
              placeholder={UI_TEXT.MENU.OPTIONS.PLACEHOLDER_OPTION_NAME}
              value={item.label || ""}
              onChange={(e) => handleUpdateItem(groupIdx, itemIdx, "label", e.target.value)}
              required
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={UI_TEXT.MENU.OPTIONS.PLACEHOLDER_EXTRA_PRICE}
                value={item.extraPrice ?? 0}
                onChange={(e) =>
                  handleUpdateItem(groupIdx, itemIdx, "extraPrice", Number(e.target.value))
                }
                className="w-32"
                min={0}
              />
              <span className="text-sm text-muted-foreground">{UI_TEXT.COMMON.CURRENCY}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(groupIdx, itemIdx)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {(!group.optionItems || group.optionItems.length === 0) && (
          <div className="text-xs text-muted-foreground italic">
            {UI_TEXT.MENU.OPTIONS.EMPTY_COMBO}
          </div>
        )}
      </div>
    </div>
  );
};
