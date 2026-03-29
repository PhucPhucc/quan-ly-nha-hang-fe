import { Printer } from "lucide-react";
import React from "react";
import { UseFormRegister } from "react-hook-form";

import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type Props = {
  register: UseFormRegister<GeneralSettingsInput>;
};

export function PrintSection({ register }: Props) {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Printer className="h-4 w-4" />}
        title={SETTINGS.PRINT_SECTION}
        description={SETTINGS.PRINT_SECTION_DESC}
      />

      <div className="grid gap-6">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_BILL_TITLE}</FieldLabel>
          <FieldContent>
            <Input {...register("billTitle")} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_BILL_FOOTER}</FieldLabel>
          <FieldContent>
            <Textarea
              {...register("billFooter")}
              className="min-h-[100px] resize-none"
              placeholder="Cảm ơn quý khách, hẹn gặp lại!"
            />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
