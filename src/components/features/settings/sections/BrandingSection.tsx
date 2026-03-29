import { ImagePlus, Monitor } from "lucide-react";
import React from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { cloudinaryService } from "@/services/cloudinaryService";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS, COMMON } = UI_TEXT;

type Props = {
  register: UseFormRegister<GeneralSettingsInput>;
  logoUrl?: string;
  setValue: UseFormSetValue<GeneralSettingsInput>;
};

export function BrandingSection({ register, logoUrl, setValue }: Props) {
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await cloudinaryService.uploadImage(file, "branding");
      if (response.isSuccess && response.data?.imageUrl) {
        setValue("logoUrl", response.data.imageUrl, { shouldDirty: true });
        toast.success(SETTINGS.LOGO_UPLOAD_SUCCESS);
      }
    } catch {
      toast.error(SETTINGS.LOGO_UPLOAD_ERROR);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Monitor className="h-4 w-4" />}
        title={SETTINGS.BRANDING_SECTION}
        description={SETTINGS.BRANDING_SECTION_DESC}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="logo-upload">{SETTINGS.FIELD_LOGO}</FieldLabel>
          <FieldContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative group/logo h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 transition-all hover:border-primary/50">
                {logoUrl ? (
                  <>
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="h-full w-full object-contain p-2"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/logo:opacity-100">
                      <ImagePlus className="h-6 w-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                    <ImagePlus className="h-6 w-6" />
                    <span className="mt-1 text-[10px] font-medium">{COMMON.UPLOAD}</span>
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

              <div className="flex-1 space-y-2">
                <FieldDescription>{SETTINGS.FIELD_LOGO_DESC}</FieldDescription>
                <Input
                  {...register("logoUrl")}
                  placeholder={SETTINGS.FIELD_LOGO_URL_PLACEHOLDER}
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_APP_TITLE}</FieldLabel>
          <FieldContent>
            <Input {...register("appTitle")} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_KDS_TITLE}</FieldLabel>
          <FieldContent>
            <Input {...register("kdsTitle")} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
