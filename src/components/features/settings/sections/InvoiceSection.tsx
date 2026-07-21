import { FileText } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

import { ValidationRules } from "@/components/shared/ValidationRules";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type Props = {
  register: UseFormRegister<GeneralSettingsInput>;
  errors: FieldErrors<GeneralSettingsInput>;
  watch: UseFormWatch<GeneralSettingsInput>;
};

export function InvoiceSection({ register, errors, watch }: Props) {
  const vatPercentageValue = watch("vatPercentage") || 0;

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<FileText className="h-4 w-4" />}
        title={SETTINGS.INVOICE_SECTION}
        description={SETTINGS.INVOICE_SECTION_DESC}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_VAT_PERCENTAGE}</FieldLabel>
          <FieldContent>
            <Input type="number" step="0.01" {...register("vatPercentage")} />
            <FieldError errors={[errors.vatPercentage]} />
          </FieldContent>
          <ValidationRules
            value={vatPercentageValue}
            rules={[
              {
                text: "VAT pháº£i náº±m trong khoáº£ng tá»« 0 Ä‘áº¿n 100",
                test: (v) => {
                  const num = Number(v);
                  return !isNaN(num) && num >= 0 && num <= 100;
                },
              },
            ]}
          />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_BILL_TITLE}</FieldLabel>
          <FieldContent>
            <Input {...register("billTitle")} />
            <FieldError errors={[errors.billTitle]} />
          </FieldContent>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_BILL_FOOTER}</FieldLabel>
          <FieldContent>
            <Input {...register("billFooter")} />
            <FieldError errors={[errors.billFooter]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
