import { ImagePlus, Images } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldLabel } from "@/components/ui/field";
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
  setValue: UseFormSetValue<GeneralSettingsInput>;
  coverImageUrl?: string;
  qrPaymentImageUrl?: string;
  faviconUrl?: string;
};

export function ImagesSection({
  register,
  setValue,
  coverImageUrl,
  qrPaymentImageUrl,
  faviconUrl,
}: Props) {
  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "coverImageUrl" | "qrPaymentImageUrl" | "faviconUrl"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await cloudinaryService.uploadImage(file, "branding");
      if (response.isSuccess && response.data?.imageUrl) {
        setValue(field, response.data.imageUrl, { shouldDirty: true });
        toast.success(SETTINGS.LOGO_UPLOAD_SUCCESS);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || SETTINGS.LOGO_UPLOAD_ERROR);
    } finally {
      if (event.target) event.target.value = "";
    }
  };

  const renderImageUpload = (
    field: "coverImageUrl" | "qrPaymentImageUrl" | "faviconUrl",
    label: string,
    url?: string
  ) => (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative group h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 transition-all hover:border-primary/50">
        {url ? (
          <>
            <img src={url} alt={label} className="h-full w-full object-contain p-2" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
          type="file"
          aria-label={label}
          className="absolute inset-0 cursor-pointer opacity-0"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => handleUpload(e, field)}
        />
      </div>
      <div className="flex-1 space-y-3">
        <FieldLabel className="mb-1 block">{label}</FieldLabel>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="https://example.com/image.png"
            {...register(field)}
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Images className="h-4 w-4" />}
        title={SETTINGS.IMAGES_SECTION}
        description={SETTINGS.IMAGES_SECTION_DESC}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          {renderImageUpload("coverImageUrl", SETTINGS.FIELD_COVER_IMAGE, coverImageUrl)}
        </Field>
        <Field className="sm:col-span-2">
          {renderImageUpload(
            "qrPaymentImageUrl",
            SETTINGS.FIELD_QR_PAYMENT_IMAGE,
            qrPaymentImageUrl
          )}
        </Field>
        <Field className="sm:col-span-2">
          {renderImageUpload("faviconUrl", SETTINGS.FIELD_FAVICON, faviconUrl)}
        </Field>
      </div>
    </div>
  );
}
