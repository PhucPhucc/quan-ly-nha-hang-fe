import { Globe } from "lucide-react";
import React from "react";
import { UseFormSetValue } from "react-hook-form";

import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type Props = {
  initialValues: GeneralSettingsInput;
  setValue: UseFormSetValue<GeneralSettingsInput>;
};

export function LocalizationSection({ initialValues, setValue }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Globe className="h-4 w-4" />}
        title={SETTINGS.LOCALIZE_SECTION}
        description={SETTINGS.LOCALIZE_SECTION_DESC}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_CURRENCY}</FieldLabel>
          <FieldContent>
            <Select
              defaultValue={initialValues.currency}
              onValueChange={(v) => setValue("currency", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VND">{SETTINGS.CURRENCY_VND}</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_DATE_FORMAT}</FieldLabel>
          <FieldContent>
            <Select
              defaultValue={initialValues.dateFormat}
              onValueChange={(v) => setValue("dateFormat", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SETTINGS.DATE_FORMAT_DMY}>{SETTINGS.DATE_FORMAT_DMY}</SelectItem>
                <SelectItem value={SETTINGS.DATE_FORMAT_MDY}>{SETTINGS.DATE_FORMAT_MDY}</SelectItem>
                <SelectItem value={SETTINGS.DATE_FORMAT_YMD}>{SETTINGS.DATE_FORMAT_YMD}</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_TIMEZONE}</FieldLabel>
          <FieldContent>
            <Select
              defaultValue={initialValues.timezone}
              onValueChange={(v) => setValue("timezone", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GMT+7">{SETTINGS.TIMEZONE_GMT7}</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
