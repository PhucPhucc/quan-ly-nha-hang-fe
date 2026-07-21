import { Clock } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { ValidationRules } from "@/components/shared/ValidationRules";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
  register: UseFormRegister<GeneralSettingsInput>;
  errors: FieldErrors<GeneralSettingsInput>;
  watch: UseFormWatch<GeneralSettingsInput>;
  setValue: UseFormSetValue<GeneralSettingsInput>;
};

export function OperatingInfoSection({ register, errors, watch, setValue }: Props) {
  const openingTimeValue = watch("openingTime") || "";
  const closingTimeValue = watch("closingTime") || "";
  const timeFormatValue = watch("timeFormat") || "HH:mm";
  const workingDaysValue = watch("workingDays") || "";

  const DAYS = [
    { value: "Monday", label: "Thứ 2" },
    { value: "Tuesday", label: "Thứ 3" },
    { value: "Wednesday", label: "Thứ 4" },
    { value: "Thursday", label: "Thứ 5" },
    { value: "Friday", label: "Thứ 6" },
    { value: "Saturday", label: "Thứ 7" },
    { value: "Sunday", label: "Chủ Nhật" },
  ];

  const selectedDays = workingDaysValue.split(",").filter(Boolean);

  const toggleDay = (day: string) => {
    let newDays = [...selectedDays];
    if (newDays.includes(day)) {
      newDays = newDays.filter((d) => d !== day);
    } else {
      newDays.push(day);
    }
    // Sort based on original index to maintain Mon-Sun order
    newDays.sort(
      (a, b) => DAYS.findIndex((d) => d.value === a) - DAYS.findIndex((d) => d.value === b)
    );
    setValue("workingDays", newDays.join(","), { shouldDirty: true });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Clock className="h-4 w-4" />}
        title={SETTINGS.OPERATING_INFO_SECTION}
        description={SETTINGS.OPERATING_INFO_SECTION_DESC}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_TIME_FORMAT}</FieldLabel>
          <FieldContent>
            <Select
              value={timeFormatValue}
              onValueChange={(val) => setValue("timeFormat", val, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder={SETTINGS.FIELD_TIME_FORMAT} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HH:mm">{SETTINGS.FIELD_TIME_FORMAT_24H}</SelectItem>
                <SelectItem value="hh:mm A">{SETTINGS.FIELD_TIME_FORMAT_12H}</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.timeFormat]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_OPENING_TIME}</FieldLabel>
          <FieldContent>
            <Input type="time" {...register("openingTime")} />
            <FieldError errors={[errors.openingTime]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_CLOSING_TIME}</FieldLabel>
          <FieldContent>
            <Input type="time" {...register("closingTime")} />
            <FieldError errors={[errors.closingTime]} />
          </FieldContent>
          <ValidationRules
            value={closingTimeValue}
            rules={[
              {
                text: SETTINGS.ERR_CLOSING_TIME_MUST_BE_AFTER_OPENING,
                test: (v) => {
                  if (!openingTimeValue || !v) return true;
                  return v > openingTimeValue;
                },
              },
            ]}
          />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_WORKING_DAYS}</FieldLabel>
          <FieldContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {DAYS.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                  />
                  <label
                    htmlFor={`day-${day.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
            <FieldError errors={[errors.workingDays]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
