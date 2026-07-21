import { BriefcaseBusiness } from "lucide-react";
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

export function BusinessInfoSection({ register, errors, watch }: Props) {
  const restaurantCodeValue = watch("restaurantCode") || "";
  const taxCodeValue = watch("taxCode") || "";

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<BriefcaseBusiness className="h-4 w-4" />}
        title={SETTINGS.BUSINESS_INFO_SECTION}
        description={SETTINGS.BUSINESS_INFO_SECTION_DESC}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_RESTAURANT_CODE}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: FOODHUB_01" {...register("restaurantCode")} />
            <FieldError errors={[errors.restaurantCode]} />
          </FieldContent>
          <ValidationRules
            value={restaurantCodeValue}
            rules={[
              {
                text: "MÃ£ nhÃ  hÃ ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng",
                test: (v) => v.trim().length > 0,
              },
              {
                text: "Chá»‰ chá»©a chá»¯, sá»‘, dáº¥u gáº¡ch dÆ°á»›i (tá»‘i Ä‘a 50 kÃ½ tá»±)",
                test: (v) => /^[a-zA-Z0-9_]{1,50}$/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_LEGAL_BUSINESS_NAME}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: CÃ”NG TY TNHH FOODHUB" {...register("legalBusinessName")} />
            <FieldError errors={[errors.legalBusinessName]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_BRAND_NAME}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: FoodHub Premium" {...register("brandName")} />
            <FieldError errors={[errors.brandName]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_TAX_CODE}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: 0123456789" {...register("taxCode")} />
            <FieldError errors={[errors.taxCode]} />
          </FieldContent>
          <ValidationRules
            value={taxCodeValue}
            rules={[
              {
                text: "MÃ£ sá»‘ thuáº¿ pháº£i bao gá»“m 10 hoáº·c 13 chá»¯ sá»‘",
                test: (v) => v.length > 0 && /^\d{10}(\d{3})?$/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_BUSINESS_REG_NUMBER}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: 0123456789" {...register("businessRegistrationNumber")} />
            <FieldError errors={[errors.businessRegistrationNumber]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_BRANCH_CODE}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: CN01" {...register("branchCode")} />
            <FieldError errors={[errors.branchCode]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
