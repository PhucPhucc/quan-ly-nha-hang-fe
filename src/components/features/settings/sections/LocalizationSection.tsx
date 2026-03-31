"use client";

import { Globe } from "lucide-react";
import type { UseFormSetValue } from "react-hook-form";

import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
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

type Props = {
  initialValues: GeneralSettingsInput;
  setValue: UseFormSetValue<GeneralSettingsInput>;
};

export function LocalizationSection({ initialValues, setValue }: Props) {
  const { SETTINGS } = UI_TEXT;
  const dateOptions = [
    { value: "dd/MM/yyyy", label: SETTINGS.DATE_FORMAT_DMY },
    { value: "MM/dd/yyyy", label: SETTINGS.DATE_FORMAT_MDY },
    { value: "yyyy-MM-dd", label: SETTINGS.DATE_FORMAT_YMD },
  ];

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Globe className="h-4 w-4" />}
        title={SETTINGS.LOCALIZE_SECTION}
        description={SETTINGS.LOCALIZE_SECTION_DESC}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_LANGUAGE}</FieldLabel>
          <FieldContent className="max-w-32">
            <LanguageSwitcher
              align="start"
              buttonClassName="h-9 w-full justify-between border border-input bg-background px-3 font-normal shadow-xs hover:bg-accent hover:text-accent-foreground"
            />
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
      </div>
    </div>
  );
}
