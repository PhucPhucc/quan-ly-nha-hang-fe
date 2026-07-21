"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { brandingService } from "@/services/brandingService";
import { useLanguageStore } from "@/store/useLanguageStore";

import { AddressSection } from "./sections/AddressSection";
import { BranchInfoSection } from "./sections/BranchInfoSection";
import { BusinessInfoSection } from "./sections/BusinessInfoSection";
import { ContactInfoSection } from "./sections/ContactInfoSection";
import { LocalizationSection } from "./sections/LocalizationSection";
import { OperatingInfoSection } from "./sections/OperatingInfoSection";

// ── Schema (lazy — avoids module-level UI_TEXT access during SSR) ────────────
type SchemaType = z.ZodObject<{
  restaurantName: z.ZodString;
  branchName: z.ZodOptional<z.ZodString>;
  address: z.ZodOptional<z.ZodString>;
  phone: z.ZodOptional<z.ZodString>;
  currency: z.ZodString;
  dateFormat: z.ZodString;
  timezone: z.ZodString;
  language: z.ZodString;
  billTitle: z.ZodString;
  billFooter: z.ZodString;
  kdsTitle: z.ZodOptional<z.ZodString>;
  appTitle: z.ZodOptional<z.ZodString>;
  logoUrl: z.ZodOptional<z.ZodString>;
  notifyEmail: z.ZodBoolean;
  notifyPush: z.ZodBoolean;
  notifySms: z.ZodBoolean;

  // 1. Business Info
  legalBusinessName: z.ZodString;
  brandName: z.ZodString;
  taxCode: z.ZodString;
  businessRegistrationNumber: z.ZodString;
  branchCode: z.ZodString;
  restaurantCode: z.ZodString;

  // 2. Contact Info
  hotline: z.ZodString;
  email: z.ZodString;
  website: z.ZodString;
  facebook: z.ZodString;
  zaloOa: z.ZodString;
  instagram: z.ZodString;

  // 3. Address
  country: z.ZodString;
  provinceCity: z.ZodString;
  district: z.ZodString;
  ward: z.ZodString;
  streetAddress: z.ZodString;
  postalCode: z.ZodString;
  googleMapUrl: z.ZodString;

  // 4. Images
  coverImageUrl: z.ZodString;
  qrPaymentImageUrl: z.ZodString;
  faviconUrl: z.ZodString;

  // 5. Invoice Settings
  vatPercentage: z.ZodNumber;

  // 6. Time Settings
  timeFormat: z.ZodString;

  // 7. Operating Info
  openingTime: z.ZodString;
  closingTime: z.ZodString;
  workingDays: z.ZodString;

  // 8. System Config
  enableOrdering: z.ZodBoolean;
  enableDelivery: z.ZodBoolean;
  enableTakeAway: z.ZodBoolean;
  enableReservation: z.ZodBoolean;
}>;

function getSchema(): SchemaType {
  const { FORM } = UI_TEXT;
  return z
    .object({
      restaurantName: z.string().min(1, FORM.REQUIRED),
      branchName: z.string().optional().default(""),
      address: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      currency: z.string().min(1),
      dateFormat: z.string().min(1),
      timezone: z.string().min(1),
      language: z.string().min(1),
      billTitle: z.string().min(1, FORM.REQUIRED),
      billFooter: z.string().min(1, FORM.REQUIRED),
      kdsTitle: z.string().optional().default(""),
      appTitle: z.string().optional().default(""),
      logoUrl: z.string().optional().default(""),
      notifyEmail: z.boolean().default(false),
      notifyPush: z.boolean().default(false),
      notifySms: z.boolean().default(false),

      legalBusinessName: z.string().optional().default(""),
      brandName: z.string().optional().default(""),
      taxCode: z
        .string()
        .optional()
        .default("")
        .refine((val) => val === "" || /^\d{10}(\d{3})?$/.test(val), {
          message: "Tax Code must be 10 or 13 digits",
        }),
      businessRegistrationNumber: z.string().optional().default(""),
      branchCode: z.string().optional().default(""),
      restaurantCode: z
        .string()
        .min(1, FORM.REQUIRED)
        .max(50, "Max length is 50")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Restaurant Code can only contain letters, numbers, and underscores"
        ),

      hotline: z
        .string()
        .optional()
        .default("")
        .refine((val) => val === "" || /^(0|84|\+84)(3|5|7|8|9)([0-9]{8})$/.test(val), {
          message: "Invalid phone number format",
        }),
      email: z.string().email("Invalid email format").optional().or(z.literal("")).default(""),
      website: z.string().url("Invalid website URL").optional().or(z.literal("")).default(""),
      facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")).default(""),
      zaloOa: z.string().url("Invalid Zalo OA URL").optional().or(z.literal("")).default(""),
      instagram: z.string().url("Invalid Instagram URL").optional().or(z.literal("")).default(""),

      country: z.string().min(1, FORM.REQUIRED),
      provinceCity: z.string().optional().default(""),
      district: z.string().optional().default(""),
      ward: z.string().optional().default(""),
      streetAddress: z.string().optional().default(""),
      postalCode: z
        .string()
        .optional()
        .default("")
        .refine((val) => val === "" || /^\d+$/.test(val), {
          message: "Postal Code must contain only numbers",
        }),
      googleMapUrl: z
        .string()
        .url("Invalid Google Map URL")
        .optional()
        .or(z.literal(""))
        .default(""),

      coverImageUrl: z.string().optional().default(""),
      qrPaymentImageUrl: z.string().optional().default(""),
      faviconUrl: z.string().optional().default(""),

      vatPercentage: z.coerce
        .number()
        .min(0, "VAT must be between 0 and 100")
        .max(100, "VAT must be between 0 and 100")
        .default(0),

      timeFormat: z.string().optional().default("HH:mm"),
      openingTime: z.string().optional().default("08:00"),
      closingTime: z.string().optional().default("22:00"),
      workingDays: z.string().optional().default(""),

      enableOrdering: z.boolean().default(true),
      enableDelivery: z.boolean().default(true),
      enableTakeAway: z.boolean().default(true),
      enableReservation: z.boolean().default(true),
    })
    .superRefine((data, ctx) => {
      if (data.openingTime && data.closingTime) {
        if (data.closingTime <= data.openingTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Closing Time must be after Opening Time",
            path: ["closingTime"],
          });
        }
      }
    }) as unknown as SchemaType;
}

export type GeneralSettingsInput = z.infer<ReturnType<typeof getSchema>>;

function getDefaultValues(): GeneralSettingsInput {
  const { SETTINGS, ORDER, KDS } = UI_TEXT;
  return {
    restaurantName: SETTINGS.FIELD_RESTAURANT_NAME_PLACEHOLDER.replace("VD: ", "").replace(
      "e.g. ",
      ""
    ),
    branchName: SETTINGS.FIELD_BRANCH_NAME_PLACEHOLDER.replace("VD: ", "").replace("e.g. ", ""),
    address: "",
    phone: "",
    currency: "VND",
    dateFormat: SETTINGS.DATE_FORMAT_DMY,
    timezone: "GMT+7",
    language: "vi",
    billTitle: ORDER.PRINT_TEMP.TITLE,
    billFooter: ORDER.PRINT_TEMP.FOOTER_THANK_YOU,
    kdsTitle: KDS.TITLE,
    appTitle: "FoodHub | Premium Restaurant Management",
    logoUrl: "",
    notifyEmail: true,
    notifyPush: true,
    notifySms: false,

    legalBusinessName: "",
    brandName: "",
    taxCode: "",
    businessRegistrationNumber: "",
    branchCode: "",
    restaurantCode: "",
    hotline: "",
    email: "",
    website: "",
    facebook: "",
    zaloOa: "",
    instagram: "",
    country: "Vietnam",
    provinceCity: "",
    district: "",
    ward: "",
    streetAddress: "",
    postalCode: "",
    googleMapUrl: "",
    coverImageUrl: "",
    qrPaymentImageUrl: "",
    faviconUrl: "",
    vatPercentage: 0,
    timeFormat: "HH:mm",
    openingTime: "08:00",
    closingTime: "22:00",
    workingDays: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday",
    enableOrdering: true,
    enableDelivery: false,
    enableTakeAway: false,
    enableReservation: false,
  };
}

// ── Form ─────────────────────────────────────────────────────────────────────
type FormProps = {
  initialValues?: GeneralSettingsInput;
  saving?: boolean;
  onSubmit: (data: GeneralSettingsInput) => Promise<void> | void;
};

export function GeneralSettingsForm({ initialValues, saving = false, onSubmit }: FormProps) {
  const locale = useLanguageStore((state) => state.locale);
  const defaults = React.useMemo(() => initialValues ?? getDefaultValues(), [initialValues]);
  const schema = React.useMemo(() => getSchema(), []);
  const { SETTINGS } = UI_TEXT;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<GeneralSettingsInput>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  React.useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  React.useEffect(() => {
    setValue("language", locale, {
      shouldDirty: locale !== defaults.language,
    });
  }, [defaults.language, locale, setValue]);

  const formValues = useWatch({ control });
  const logoUrl = useWatch({ control, name: "logoUrl" });

  return (
    <div className="w-full pb-16 pt-2">
      <Card className="mx-auto max-w-4xl border-border bg-card shadow-soft overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 px-6 py-6 sm:px-10">
          <CardTitle className="text-xl font-bold text-foreground">
            {SETTINGS.GENERAL_TITLE}
          </CardTitle>
          <CardDescription className="text-sm">{SETTINGS.GENERAL_DESC}</CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* 1. Store Information (Legacy) */}
            <section>
              <BranchInfoSection
                register={register}
                errors={errors}
                logoUrl={logoUrl}
                setValue={setValue}
                watch={watch}
              />
            </section>
            <div className="h-px bg-border/60" />

            {/* 2. Business Info */}
            <section>
              <BusinessInfoSection register={register} errors={errors} watch={watch} />
            </section>
            <div className="h-px bg-border/60" />

            {/* 3. Contact Info */}
            <section>
              <ContactInfoSection register={register} errors={errors} watch={watch} />
            </section>
            <div className="h-px bg-border/60" />

            {/* 4. Address */}
            <section>
              <AddressSection register={register} errors={errors} watch={watch} />
            </section>
            <div className="h-px bg-border/60" />

            {/* 7. Operating Info */}
            <section>
              <OperatingInfoSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            </section>
            <div className="h-px bg-border/60" />

            {/* 3. Localization Settings */}
            <section>
              <LocalizationSection
                initialValues={formValues as GeneralSettingsInput}
                setValue={setValue}
              />
            </section>

            {/* Unified Action Bar */}
            <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-8 mt-10">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground max-w-xs">
                  {SETTINGS.GENERAL_FOOTER_NOTE}
                </p>
              </div>
              <Button
                type="submit"
                disabled={saving || !isValid}
                className="h-11 min-w-50 bg-primary text-base font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
              >
                {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                {saving ? SETTINGS.BTN_SAVING : SETTINGS.BTN_SAVE}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Container ─────────────────────────────────────────────────────────────────
export function GeneralSettingsContainer() {
  const queryClient = useQueryClient();
  const { SETTINGS } = UI_TEXT;
  const [initialValues, setInitialValues] = React.useState<GeneralSettingsInput>(getDefaultValues);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const response = await brandingService.getBrandingSettings();
        if (response.isSuccess && response.data && isMounted) {
          setInitialValues((current) => ({
            ...current,
            ...response.data,
          }));
        }
      } catch (error) {
        toast.error(getErrorMessage(error) || UI_TEXT.API.NETWORK_ERROR);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (data: GeneralSettingsInput) => {
    setSaving(true);
    try {
      const fullAddress = [data.streetAddress, data.ward, data.district, data.provinceCity]
        .filter((part) => part && part.trim() !== "")
        .join(", ");

      const response = await brandingService.updateBrandingSettings({
        ...data,
        branchName: data.branchName ?? "",
        address: fullAddress || (data.address ?? ""),
        phone: data.phone ?? "",
        kdsTitle: data.kdsTitle ?? "",
        appTitle: data.appTitle ?? "",
        logoUrl: data.logoUrl ?? "",
      });

      if (response.isSuccess && response.data) {
        setInitialValues((current) => ({
          ...current,
          ...response.data,
        }));
        await queryClient.invalidateQueries({ queryKey: ["branding-settings"] });
      }

      toast.success(SETTINGS.SUCCESS_GENERAL);
    } catch (error) {
      toast.error(getErrorMessage(error) || UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <GeneralSettingsForm initialValues={initialValues} saving={saving} onSubmit={handleSubmit} />
  );
}
