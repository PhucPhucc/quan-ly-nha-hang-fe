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
            <Input placeholder={SETTINGS.FIELD_COUNTRY_PLACEHOLDER} {...register("country")} />
            <FieldError errors={[errors.country]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_PROVINCE_CITY}</FieldLabel>
          <FieldContent>
            <Input
              placeholder={SETTINGS.FIELD_PROVINCE_CITY_PLACEHOLDER}
              {...register("provinceCity")}
            />
            <FieldError errors={[errors.provinceCity]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_DISTRICT}</FieldLabel>
          <FieldContent>
            <Input placeholder={SETTINGS.FIELD_DISTRICT_PLACEHOLDER} {...register("district")} />
            <FieldError errors={[errors.district]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_WARD}</FieldLabel>
          <FieldContent>
            <Input placeholder={SETTINGS.FIELD_WARD_PLACEHOLDER} {...register("ward")} />
            <FieldError errors={[errors.ward]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_STREET_ADDRESS}</FieldLabel>
          <FieldContent>
            <Input
              placeholder={SETTINGS.FIELD_STREET_ADDRESS_PLACEHOLDER}
              {...register("streetAddress")}
            />
            <FieldError errors={[errors.streetAddress]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_POSTAL_CODE}</FieldLabel>
          <FieldContent>
            <Input
              placeholder={SETTINGS.FIELD_POSTAL_CODE_PLACEHOLDER}
              {...register("postalCode")}
            />
            <FieldError errors={[errors.postalCode]} />
          </FieldContent>
          <ValidationRules
            value={postalCodeValue}
            rules={[
              {
                text: SETTINGS.ERR_POSTAL_CODE_FORMAT,
                test: (v) => v.length > 0 && /^\d+$/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_GOOGLE_MAP_URL}</FieldLabel>
          <FieldContent>
            <Input
              placeholder={SETTINGS.FIELD_GOOGLE_MAP_URL_PLACEHOLDER}
              {...register("googleMapUrl")}
            />
            <FieldError errors={[errors.googleMapUrl]} />
          </FieldContent>
          <ValidationRules
            value={googleMapUrlValue}
            rules={[
              {
                text: SETTINGS.ERR_GOOGLE_MAP_URL_FORMAT,
                test: (v) => v.length > 0 && /^https?:\/\/.+/.test(v),
              },
            ]}
          />
        </Field>
      </div>
    </div>
  );
}
