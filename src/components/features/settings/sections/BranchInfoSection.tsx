import { Building2, CheckCircle2, Circle, ImagePlus } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { cloudinaryService } from "@/services/cloudinaryService";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS, COMMON } = UI_TEXT;

type Props = {
  register: UseFormRegister<GeneralSettingsInput>;
  errors: FieldErrors<GeneralSettingsInput>;
  logoUrl?: string;
  setValue: UseFormSetValue<GeneralSettingsInput>;
  watch: UseFormWatch<GeneralSettingsInput>;
};

// ─── ValidationRules ───────────────────────────────────────────────────────────
const ValidationRules = ({
  value,
  rules,
}: {
  value: string;
  rules: { text: string; test: (v: string) => boolean }[];
}) => (
  <div className="mt-2 space-y-1">
    {rules.map((rule, idx) => {
      const isMet = rule.test(value || "");
      return (
        <div
          key={idx}
          className={`flex items-center gap-2 text-xs ${
            isMet ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          {isMet ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span>{rule.text}</span>
        </div>
      );
    })}
  </div>
);

export function BranchInfoSection({ register, errors, logoUrl, setValue, watch }: Props) {
  const restaurantNameValue = watch("restaurantName") || "";
  const phoneValue = watch("phone") || "";
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await cloudinaryService.uploadImage(file, "branding");
      if (response.isSuccess && response.data?.imageUrl) {
        setValue("logoUrl", response.data.imageUrl, { shouldDirty: true });
        toast.success(SETTINGS.LOGO_UPLOAD_SUCCESS);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || SETTINGS.LOGO_UPLOAD_ERROR);
    } finally {
      if (event.target) event.target.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Building2 className="h-4 w-4" />}
        title={SETTINGS.BRANCH_SECTION}
        description={SETTINGS.BRANCH_SECTION_DESC}
      />

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 sm:flex-row md:flex-col lg:flex-row">
          <div className="relative group/logo h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 transition-all hover:border-primary/50">
            {logoUrl ? (
              <>
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="h-full w-full object-contain p-2"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/logo:opacity-100">
                  <ImagePlus className="h-8 w-8 text-white" />
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                <ImagePlus className="h-8 w-8" />
                <span className="mt-1 text-xs font-medium">{COMMON.UPLOAD}</span>
              </div>
            )}
            <input
              id="logo-upload"
              type="file"
              aria-label={SETTINGS.FIELD_LOGO}
              className="absolute inset-0 cursor-pointer opacity-0"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleUpload}
            />
          </div>
          <div className="flex-1 space-y-3">
            <FieldLabel htmlFor="logo-upload" className="mb-1 block">
              {SETTINGS.FIELD_LOGO}
            </FieldLabel>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="https://example.com/logo.png"
                {...register("logoUrl")}
                className="text-xs"
              />
              <FieldDescription className="text-xs leading-relaxed max-w-[200px]">
                {SETTINGS.FIELD_LOGO_DESC}
              </FieldDescription>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex-1 grid gap-5 sm:grid-cols-2">
          <Field className="sm:col-span-2">
            <FieldLabel>{SETTINGS.FIELD_RESTAURANT_NAME}</FieldLabel>
            <FieldContent>
              <Input
                placeholder={SETTINGS.FIELD_RESTAURANT_NAME_PLACEHOLDER}
                {...register("restaurantName")}
              />
              <FieldError errors={[errors.restaurantName]} />
            </FieldContent>
            <ValidationRules
              value={restaurantNameValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                  test: (v) => v.trim().length > 0,
                },
              ]}
            />
          </Field>

          <Field>
            <FieldLabel>{SETTINGS.FIELD_PHONE}</FieldLabel>
            <FieldContent>
              <Input placeholder={SETTINGS.FIELD_PHONE_PLACEHOLDER} {...register("phone")} />
            </FieldContent>
            <ValidationRules
              value={phoneValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_PREFIX,
                  test: (v) => v === "" || /^(0|\+84)/.test(v),
                },
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_LENGTH,
                  test: (v) => v === "" || /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(v),
                },
              ]}
            />
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel>{SETTINGS.FIELD_ADDRESS}</FieldLabel>
            <FieldContent>
              <Input placeholder={SETTINGS.FIELD_ADDRESS_PLACEHOLDER} {...register("address")} />
            </FieldContent>
          </Field>
        </div>
      </div>
    </div>
  );
}
