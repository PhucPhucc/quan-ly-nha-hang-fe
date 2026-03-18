import React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { CategoryType } from "@/types/enums";
import { MenuItem, SetMenu } from "@/types/Menu";

interface MenuBasicInfoFieldsProps {
  editingItem: MenuItem | SetMenu | null;
  categories: { id: string; name: string; type: number }[];
  selectedCategoryId: string;
  setSelectedCategoryId: (val: string) => void;
}

export const MenuBasicInfoFields: React.FC<MenuBasicInfoFieldsProps> = ({
  editingItem,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
}) => {
  return (
    <>
      <Field className="space-y-2 col-span-2">
        <Label htmlFor="name" className="text-right">
          {UI_TEXT.MENU.LABEL_NAME}{" "}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={editingItem?.name || ""}
          placeholder={UI_TEXT.MENU.PLACEHOLDER_NAME}
          required
        />
      </Field>

      <Field className="space-y-2 col-span-2">
        <Label htmlFor="description" className="text-right">
          {UI_TEXT.MENU.LABEL_DESC}
        </Label>
        <Textarea
          id="description"
          name="description"
          maxLength={50}
          defaultValue={editingItem?.description || ""}
          placeholder={UI_TEXT.MENU.PLACEHOLDER_DESC}
          className="min-h-25"
        />
      </Field>

      <Field className="space-y-2">
        <Label htmlFor="price" className="text-right">
          {UI_TEXT.MENU.LABEL_PRICE}{" "}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          defaultValue={editingItem?.price || ""}
          placeholder={UI_TEXT.MENU.PLACEHOLDER_PRICE}
          required
        />
      </Field>

      <Field className="space-y-2">
        <Label htmlFor="cost" className="text-right">
          {UI_TEXT.MENU.LABEL_COST}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          min="0"
          defaultValue={editingItem?.costPrice || ""}
          placeholder={UI_TEXT.MENU.PLACEHOLDER_COST}
          required
        />
      </Field>

      <Field className="space-y-2 col-span-2 md:col-span-1">
        <Label htmlFor="categoryId" className="text-right">
          {UI_TEXT.MENU.LABEL_CATEGORY}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </Label>
        <Select name="categoryId" value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
          <SelectTrigger id="categoryId">
            <SelectValue placeholder={UI_TEXT.MENU.PLACEHOLDER_CATEGORY} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name} {cat.type === CategoryType.SPECIAL_GROUP && "(Combo)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </>
  );
};
