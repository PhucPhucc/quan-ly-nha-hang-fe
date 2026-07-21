import { PhoneCall } from "lucide-react";
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

export function ContactInfoSection({ register, errors, watch }: Props) {
  const hotlineValue = watch("hotline") || "";
  const emailValue = watch("email") || "";
  const websiteValue = watch("website") || "";
  const facebookValue = watch("facebook") || "";
  const zaloOaValue = watch("zaloOa") || "";
  const instagramValue = watch("instagram") || "";

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<PhoneCall className="h-4 w-4" />}
        title={SETTINGS.CONTACT_INFO_SECTION}
        description={SETTINGS.CONTACT_INFO_SECTION_DESC}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_HOTLINE}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: 0987654321" {...register("hotline")} />
            <FieldError errors={[errors.hotline]} />
          </FieldContent>
          <ValidationRules
            value={hotlineValue}
            rules={[
              {
                text: "Äá»‹nh dáº¡ng sá»‘ Ä‘iá»‡n thoáº¡i Viá»‡t Nam (10 sá»‘, báº¯t Ä‘áº§u 0, 84, +84)",
                test: (v) => v.length > 0 && /^(0|84|\+84)(3|5|7|8|9)([0-9]{8})$/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_EMAIL}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: contact@foodhub.vn" {...register("email")} />
            <FieldError errors={[errors.email]} />
          </FieldContent>
          <ValidationRules
            value={emailValue}
            rules={[
              {
                text: "Äá»‹nh dáº¡ng Email há»£p lá»‡",
                test: (v) => v.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_WEBSITE}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: https://foodhub.vn" {...register("website")} />
            <FieldError errors={[errors.website]} />
          </FieldContent>
          <ValidationRules
            value={websiteValue}
            rules={[
              {
                text: "Link URL há»£p lá»‡",
                test: (v) => v.length > 0 && /^https?:\/\/.+/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_FACEBOOK}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: https://facebook.com/foodhub" {...register("facebook")} />
            <FieldError errors={[errors.facebook]} />
          </FieldContent>
          <ValidationRules
            value={facebookValue}
            rules={[
              {
                text: "Link URL há»£p lá»‡",
                test: (v) => v.length > 0 && /^https?:\/\/.+/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_ZALO_OA}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: https://zalo.me/123456789" {...register("zaloOa")} />
            <FieldError errors={[errors.zaloOa]} />
          </FieldContent>
          <ValidationRules
            value={zaloOaValue}
            rules={[
              {
                text: "Link URL há»£p lá»‡",
                test: (v) => v.length > 0 && /^https?:\/\/.+/.test(v),
              },
            ]}
          />
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_INSTAGRAM}</FieldLabel>
          <FieldContent>
            <Input placeholder="VD: https://instagram.com/foodhub" {...register("instagram")} />
            <FieldError errors={[errors.instagram]} />
          </FieldContent>
          <ValidationRules
            value={instagramValue}
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
