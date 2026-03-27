import { Plus, Trash2 } from "lucide-react";
import React from "react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuFormType } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";

interface MenuComboItemsProps {
  form: MenuFormType;
}

export const MenuComboItems: React.FC<MenuComboItemsProps> = ({ form }) => {
  const { control, formState, register } = form.formMethods;

  return (
    <Field className="space-y-2 col-span-2">
      <div className="flex justify-between items-center mb-2">
        <FieldLabel>{UI_TEXT.MENU.LABEL_COMBO_ITEMS}</FieldLabel>
        <Button type="button" variant="outline" size="sm" onClick={form.appendComboItem}>
          <Plus className="h-4 w-4" /> {UI_TEXT.MENU.ADD_COMBO}
        </Button>
      </div>

      {form.isFetchingCombo && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.COMMON.LOADING}</div>
      )}

      {!form.isFetchingCombo && form.comboItemsFields.length === 0 && (
        <div className="text-sm text-muted-foreground">{UI_TEXT.MENU.EMPTY_COMBO}</div>
      )}

      <FieldContent className="space-y-2">
        {form.comboItemsFields.map((item, index) => (
          <div key={item.fieldId} className="flex gap-2 items-start">
            <div className="flex-1 space-y-1">
              <Controller
                control={control}
                name={`comboItems.${index}.menuItemId`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      data-field-path={`comboItems.${index}.menuItemId`}
                      aria-invalid={!!formState.errors.comboItems?.[index]?.menuItemId}
                    >
                      <SelectValue placeholder={UI_TEXT.MENU.SELECT_ITEM_PLACEHOLDER} />
                    </SelectTrigger>
                    <SelectContent>
                      {form.menuItems.map((menuItem) => (
                        <SelectItem key={menuItem.menuItemId} value={menuItem.menuItemId}>
                          {menuItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[formState.errors.comboItems?.[index]?.menuItemId]} />
            </div>

            <div className="w-24 space-y-1">
              <Input
                type="number"
                min="1"
                data-field-path={`comboItems.${index}.quantity`}
                aria-invalid={!!formState.errors.comboItems?.[index]?.quantity}
                {...register(`comboItems.${index}.quantity`)}
              />
              <FieldError errors={[formState.errors.comboItems?.[index]?.quantity]} />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => form.removeComboItem(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}

        <FieldError errors={[formState.errors.comboItems as { message?: string } | undefined]} />
      </FieldContent>
    </Field>
  );
};
