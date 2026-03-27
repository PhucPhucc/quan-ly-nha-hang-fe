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
import { MenuFormType } from "@/hooks/useMenuForm";
import { UI_TEXT } from "@/lib/UI_Text";
import { Station } from "@/types/enums";

interface MenuStationTimeFieldsProps {
  form: MenuFormType;
}

export const MenuStationTimeFields: React.FC<MenuStationTimeFieldsProps> = ({ form }) => {
  const { control, formState, register } = form.formMethods;

  return (
    <>
      <Field className="space-y-2 col-span-2 md:col-span-1">
        <FieldLabel htmlFor="station">
          {UI_TEXT.MENU.LABEL_STATION}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name="station"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="station"
                  data-field-path="station"
                  aria-invalid={!!formState.errors.station}
                >
                  <SelectValue placeholder={UI_TEXT.MENU.PLACEHOLDER_STATION} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Station.HOT_KITCHEN.toString()}>
                    {UI_TEXT.MENU.STATION.HOTKITCHEN}
                  </SelectItem>
                  <SelectItem value={Station.COLD_KITCHEN.toString()}>
                    {UI_TEXT.MENU.STATION.COLDKITCHEN}
                  </SelectItem>
                  <SelectItem value={Station.BAR.toString()}>
                    {UI_TEXT.MENU.STATION.DRINKS}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError errors={[formState.errors.station]} />
        </FieldContent>
      </Field>

      <Field className="space-y-2 col-span-2">
        <FieldLabel htmlFor="expectedTime">
          {UI_TEXT.MENU.LABEL_EXPECTED_TIME}
          <span className="text-primary">{UI_TEXT.MENU.OPTIONS.REQUIRED_MARK}</span>
        </FieldLabel>
        <FieldContent>
          <Input
            id="expectedTime"
            type="number"
            min="1"
            data-field-path="expectedTime"
            aria-invalid={!!formState.errors.expectedTime}
            placeholder={UI_TEXT.MENU.PLACEHOLDER_EXPECTED_TIME}
            {...register("expectedTime")}
          />
          <FieldError errors={[formState.errors.expectedTime]} />
        </FieldContent>
      </Field>
    </>
  );
};
