import { MapPin } from "lucide-react";
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

export function AddressSection({ register, errors, watch }: Props) {
  const postalCodeValue = watch("postalCode") || "";
  const googleMapUrlValue = watch("googleMapUrl") || "";

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<MapPin className="h-4 w-4" />}
        title={SETTINGS.ADDRESS_SECTION}
        description={SETTINGS.ADDRESS_SECTION_DESC}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel>{SETTINGS.FIELD_COUNTRY}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: Vietnam" {...register("country")} />
            <FieldError errors={[errors.country]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_PROVINCE_CITY}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: TP. Há»“ ChÃ­ Minh" {...register("provinceCity")} />
            <FieldError errors={[errors.provinceCity]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_DISTRICT}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: Quáº­n 1" {...register("district")} />
            <FieldError errors={[errors.district]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_WARD}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: PhÆ°á»ng Báº¿n NghÃ©" {...register("ward")} />
            <FieldError errors={[errors.ward]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_STREET_ADDRESS}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: 123 ÄÆ°á»ng LÃª Lá»£i" {...register("streetAddress")} />
            <FieldError errors={[errors.streetAddress]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_POSTAL_CODE}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: 700000" {...register("postalCode")} />
            <FieldError errors={[errors.postalCode]} />
          </FieldContent>
          <ValidationRules
            value={postalCodeValue}
            rules={[
              {
                text: "MÃ£ bÆ°u Ä‘iá»‡n chá»‰ Ä‘Æ°á»£c chá»©a cÃ¡c chá»¯ sá»‘",
                test: (v) => v.length > 0 && /^\d+$/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_GOOGLE_MAP_URL}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: https://goo.gl/maps/123" {...register("googleMapUrl")} />
            <FieldError errors={[errors.googleMapUrl]} />
          </FieldContent>
          <ValidationRules
            value={googleMapUrlValue}
            rules={[
              {
                text: "Link URL há»£p lá»‡",
                test: (v) => v.length > 0 && /^https?:\/\/.+/.test(v),
              },
            ]}
          />
        </Field>
      </div>
    </div>
  );
}
