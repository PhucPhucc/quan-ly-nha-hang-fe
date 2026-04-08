import React from "react";
import { Controller } from "react-hook-form";

import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MenuFormType } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";
import { CategoryType } from "@/types/enums";
import { Category } from "@/types/Menu";

interface MenuBasicInfoFieldsProps {
  form: MenuFormType;
  categories: Category[];
}

export const MenuBasicInfoFields: React.FC<MenuBasicInfoFieldsProps> = ({ form, categories }) => {
  const { control, formState, register } = form.formMethods;

  return (
    <>
      <Field className="space-y-2 col-span-2">
        <FieldLabel htmlFor="name">
          {UI_TEXT.MENU.LABEL_NAME}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="name"
            data-field-path="name"
            aria-invalid={!!formState.errors.name}
            placeholder={UI_TEXT.MENU.PLACEHOLDER_NAME}
            {...register("name")}
          />
          <FieldError errors={[formState.errors.name]} />
        </FieldContent>
      </Field>

      <Field className="space-y-2 col-span-2">
        <FieldLabel htmlFor="description">{UI_TEXT.MENU.LABEL_DESC}</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            data-field-path="description"
            aria-invalid={!!formState.errors.description}
            placeholder={UI_TEXT.MENU.PLACEHOLDER_DESC}
            className="min-h-25"
            {...register("description")}
          />
          <FieldError errors={[formState.errors.description]} />
        </FieldContent>
      </Field>

      <Field className="space-y-2">
        <FieldLabel htmlFor="price">
          {UI_TEXT.MENU.LABEL_PRICE}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="price"
            type="number"
            min="0"
            data-field-path="price"
            aria-invalid={!!formState.errors.price}
            placeholder={UI_TEXT.MENU.PLACEHOLDER_PRICE}
            {...register("price")}
          />
          <FieldError errors={[formState.errors.price]} />
        </FieldContent>
      </Field>

      <Field className="space-y-2">
        <FieldLabel htmlFor="cost">
          {UI_TEXT.MENU.LABEL_COST}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="cost"
            type="number"
            min="0"
            data-field-path="cost"
            aria-invalid={!!formState.errors.cost}
            placeholder={UI_TEXT.MENU.PLACEHOLDER_COST}
            {...register("cost")}
          />
          <FieldError errors={[formState.errors.cost]} />
        </FieldContent>
      </Field>

      <Field className="space-y-2 col-span-2 md:col-span-1">
        <FieldLabel htmlFor="categoryId">
          {UI_TEXT.MENU.LABEL_CATEGORY}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="categoryId"
                  data-field-path="categoryId"
                  aria-invalid={!!formState.errors.categoryId}
                >
                  <SelectValue placeholder={UI_TEXT.MENU.PLACEHOLDER_CATEGORY} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.categoryId} value={category.categoryId}>
                      {category.name} {category.type === CategoryType.SPECIAL_GROUP && "(Combo)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[formState.errors.categoryId]} />
        </FieldContent>
      </Field>
    </>
  );
};
