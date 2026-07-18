/* eslint-disable react/jsx-no-literals */
import { Building2, CheckCircle2, Circle, ImagePlus } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function BranchInfoSection({ register, logoUrl, setValue, watch }: Props) {
  const restaurantNameValue = watch("restaurantName") || "";
  const phoneValue = watch("phone") || "";
  const addressValue = watch("address") || "";
  const emailValue = watch("email") || "";
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

  const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
  const operatingDaysStr = watch("operatingDays") || "Thứ 2 - Chủ Nhật";
  const [startDay = "Thứ 2", endDay = "Chủ Nhật"] = operatingDaysStr.split(" - ");
  const handleStartDayChange = (val: string) =>
    setValue("operatingDays", `${val} - ${endDay}`, { shouldValidate: true, shouldDirty: true });
  const handleEndDayChange = (val: string) =>
    setValue("operatingDays", `${startDay} - ${val}`, { shouldValidate: true, shouldDirty: true });

  const operatingHoursStr = watch("operatingHours") || "08:00 - 22:00";
  const [startHour = "08:00", endHour = "22:00"] = operatingHoursStr.split(" - ");
  const handleStartHourChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue("operatingHours", `${e.target.value} - ${endHour}`, {
      shouldValidate: true,
      shouldDirty: true,
    });
  const handleEndHourChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue("operatingHours", `${startHour} - ${e.target.value}`, {
      shouldValidate: true,
      shouldDirty: true,
    });

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Building2 className="h-4 w-4" />}
        title={SETTINGS.BRANCH_SECTION}
        description={SETTINGS.BRANCH_SECTION_DESC}
      />

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Logo Section */}
        <div className="flex-1 flex-col items-center gap-4 sm:flex-row md:flex-col lg:flex-row">
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
          <Field className="mt-5 sm:col-span-2">
            <FieldLabel>Mô tả nhà hàng</FieldLabel>
            <FieldContent>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Câu chuyện hoặc mô tả ngắn gọn về nhà hàng của bạn..."
                maxLength={2000}
                {...register("description")}
              />
            </FieldContent>
          </Field>
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
              {/* <FieldError errors={[errors.restaurantName]} /> */}
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

          <Field className="sm:col-span-2">
            <FieldLabel>{SETTINGS.FIELD_PHONE}</FieldLabel>
            <FieldContent>
              <Input placeholder={SETTINGS.FIELD_PHONE_PLACEHOLDER} {...register("phone")} />
            </FieldContent>
            <ValidationRules
              value={phoneValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_PREFIX,
                  test: (v) => /^(0|\+84)/.test(v),
                },
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_PHONE_LENGTH,
                  test: (v) => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(v),
                },
              ]}
            />
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel>{SETTINGS.FIELD_ADDRESS}</FieldLabel>
            <FieldContent>
              <Input placeholder={SETTINGS.FIELD_ADDRESS_PLACEHOLDER} {...register("address")} />
            </FieldContent>
            <ValidationRules
              value={addressValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_NOT_EMPTY,
                  test: (v) => v.trim().length > 0,
                },
              ]}
            />
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input
                placeholder="contact@restaurant.com"
                type="email"
                maxLength={100}
                {...register("email")}
              />
            </FieldContent>
            <ValidationRules
              value={emailValue}
              rules={[
                {
                  text: UI_TEXT.PROFILE.VALIDATION.RULE_EMAIL_FORMAT,
                  test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                },
              ]}
            />
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel>Ngày hoạt động</FieldLabel>
            <FieldContent className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Select value={startDay} onValueChange={handleStartDayChange}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Từ" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">-</span>
                <Select value={endDay} onValueChange={handleEndDayChange}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Đến" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FieldContent>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel>Giờ hoạt động</FieldLabel>
            <FieldContent className="flex items-center gap-2">
              <div className="flex items-center gap-2 ">
                <Input
                  type="time"
                  value={startHour}
                  onChange={handleStartHourChange}
                  className="w-[130px]"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="time"
                  value={endHour}
                  onChange={handleEndHourChange}
                  className="w-[130px]"
                />
              </div>
            </FieldContent>
            {/* Hidden inputs to maintain form state */}
            <input type="hidden" {...register("operatingDays")} />
            <input type="hidden" {...register("operatingHours")} />
          </Field>
        </div>
      </div>
    </div>
  );
}
