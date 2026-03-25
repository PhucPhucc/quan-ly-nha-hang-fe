import { Building2 } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type Props = {
  register: UseFormRegister<GeneralSettingsInput>;
  errors: FieldErrors<GeneralSettingsInput>;
};

export function BranchInfoSection({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Building2 className="h-4 w-4" />}
        title={SETTINGS.BRANCH_SECTION}
        description={SETTINGS.BRANCH_SECTION_DESC}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_RESTAURANT_NAME}</FieldLabel>
          <FieldContent>
            <Input
              placeholder={SETTINGS.FIELD_RESTAURANT_NAME_PLACEHOLDER}
              {...register("restaurantName")}
            />
            <FieldError errors={[errors.restaurantName]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_BRANCH_NAME}</FieldLabel>
          <FieldContent>
            <Input
              placeholder={SETTINGS.FIELD_BRANCH_NAME_PLACEHOLDER}
              {...register("branchName")}
            />
            <FieldError errors={[errors.branchName]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_BRANCH_ID}</FieldLabel>
          <FieldContent>
            <Input placeholder={SETTINGS.FIELD_BRANCH_ID_PLACEHOLDER} {...register("branchId")} />
            <FieldError errors={[errors.branchId]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_PHONE}</FieldLabel>
          <FieldContent>
            <Input placeholder={SETTINGS.FIELD_PHONE_PLACEHOLDER} {...register("phone")} />
          </FieldContent>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_ADDRESS}</FieldLabel>
          <FieldContent>
            <Input placeholder={SETTINGS.FIELD_ADDRESS_PLACEHOLDER} {...register("address")} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
