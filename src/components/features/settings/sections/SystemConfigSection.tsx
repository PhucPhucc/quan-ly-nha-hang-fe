import { Settings } from "lucide-react";
import React from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import { Field, FieldContent } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type Props = {
  register: UseFormRegister<GeneralSettingsInput>;
  watch: UseFormWatch<GeneralSettingsInput>;
  setValue: UseFormSetValue<GeneralSettingsInput>;
};

export function SystemConfigSection({ watch, setValue }: Props) {
  const enableOrdering = watch("enableOrdering");
  const enableDelivery = watch("enableDelivery");
  const enableTakeAway = watch("enableTakeAway");
  const enableReservation = watch("enableReservation");

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Settings className="h-4 w-4" />}
        title={SETTINGS.SYSTEM_CONFIG_SECTION}
        description={SETTINGS.SYSTEM_CONFIG_SECTION_DESC}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field className="flex items-center justify-between sm:col-span-2">
          <div className="space-y-1">
            <span className="text-sm font-medium">{SETTINGS.FIELD_ENABLE_ORDERING}</span>
          </div>
          <FieldContent>
            <Switch
              checked={enableOrdering}
              onCheckedChange={(checked) =>
                setValue("enableOrdering", checked, { shouldDirty: true })
              }
            />
          </FieldContent>
        </Field>

        <Field className="flex items-center justify-between sm:col-span-2">
          <div className="space-y-1">
            <span className="text-sm font-medium">{SETTINGS.FIELD_ENABLE_DELIVERY}</span>
          </div>
          <FieldContent>
            <Switch
              checked={enableDelivery}
              onCheckedChange={(checked) =>
                setValue("enableDelivery", checked, { shouldDirty: true })
              }
            />
          </FieldContent>
        </Field>

        <Field className="flex items-center justify-between sm:col-span-2">
          <div className="space-y-1">
            <span className="text-sm font-medium">{SETTINGS.FIELD_ENABLE_TAKE_AWAY}</span>
          </div>
          <FieldContent>
            <Switch
              checked={enableTakeAway}
              onCheckedChange={(checked) =>
                setValue("enableTakeAway", checked, { shouldDirty: true })
              }
            />
          </FieldContent>
        </Field>

        <Field className="flex items-center justify-between sm:col-span-2">
          <div className="space-y-1">
            <span className="text-sm font-medium">{SETTINGS.FIELD_ENABLE_RESERVATION}</span>
          </div>
          <FieldContent>
            <Switch
              checked={enableReservation}
              onCheckedChange={(checked) =>
                setValue("enableReservation", checked, { shouldDirty: true })
              }
            />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
