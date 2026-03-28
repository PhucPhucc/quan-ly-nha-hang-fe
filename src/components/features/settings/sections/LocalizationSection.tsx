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

const timezoneOptions = [
  { value: "Asia/Ho_Chi_Minh", label: "Asia/Ho_Chi_Minh" },
  { value: "GMT+7", label: SETTINGS.TIMEZONE_GMT7 },
];

const dateOptions = [
  { value: "dd/MM/yyyy", label: SETTINGS.DATE_FORMAT_DMY },
  { value: "MM/dd/yyyy", label: SETTINGS.DATE_FORMAT_MDY },
  { value: "yyyy-MM-dd", label: SETTINGS.DATE_FORMAT_YMD },
];

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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_CURRENCY}</FieldLabel>
          <FieldContent>
            <Select value={initialValues.currency} onValueChange={(v) => setValue("currency", v)}>
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
          <FieldLabel>{SETTINGS.FIELD_LANGUAGE}</FieldLabel>
          <FieldContent>
            <Select value={initialValues.language} onValueChange={(v) => setValue("language", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">{SETTINGS.LANGUAGE_VI}</SelectItem>
                <SelectItem value="en">{SETTINGS.LANGUAGE_EN}</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_DATE_FORMAT}</FieldLabel>
          <FieldContent>
            <Select
              value={initialValues.dateFormat}
              onValueChange={(v) => setValue("dateFormat", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_TIMEZONE}</FieldLabel>
          <FieldContent>
            <Select value={initialValues.timezone} onValueChange={(v) => setValue("timezone", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezoneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
