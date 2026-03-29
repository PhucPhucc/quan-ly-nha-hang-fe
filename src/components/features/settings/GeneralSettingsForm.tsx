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
import { UI_TEXT } from "@/lib/UI_Text";
import { brandingService } from "@/services/brandingService";

import { BranchInfoSection } from "./sections/BranchInfoSection";
import { BrandingSection } from "./sections/BrandingSection";
import { LocalizationSection } from "./sections/LocalizationSection";
import { NotifySection } from "./sections/NotifySection";
import { PrintSection } from "./sections/PrintSection";

const { SETTINGS, FORM } = UI_TEXT;

// ── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  restaurantName: z.string().min(1, FORM.REQUIRED),
  branchName: z.string().min(1, FORM.REQUIRED),
  address: z.string().optional(),
  phone: z.string().optional(),
  currency: z.string().min(1),
  dateFormat: z.string().min(1),
  timezone: z.string().min(1),
  language: z.string().min(1),
  billTitle: z.string().min(1, FORM.REQUIRED),
  billFooter: z.string().min(1, FORM.REQUIRED),
  kdsTitle: z.string().min(1, FORM.REQUIRED),
  appTitle: z.string().min(1, FORM.REQUIRED),
  logoUrl: z.string().optional(),
  notifyEmail: z.boolean(),
  notifyPush: z.boolean(),
  notifySms: z.boolean(),
});

export type GeneralSettingsInput = z.infer<typeof schema>;

const DEFAULT_VALUES: GeneralSettingsInput = {
  restaurantName: SETTINGS.FIELD_RESTAURANT_NAME_PLACEHOLDER.replace("VD: ", ""),
  branchName: SETTINGS.FIELD_BRANCH_NAME_PLACEHOLDER.replace("VD: ", ""),
  address: "",
  phone: "",
  currency: "VND",
  dateFormat: SETTINGS.DATE_FORMAT_DMY,
  timezone: "GMT+7",
  language: "vi",
  billTitle: UI_TEXT.ORDER.PRINT_TEMP.TITLE,
  billFooter: UI_TEXT.ORDER.PRINT_TEMP.FOOTER_THANK_YOU,
  kdsTitle: UI_TEXT.KDS.TITLE,
  appTitle: "FoodHub | Premium Restaurant Management",
  logoUrl: "",
  notifyEmail: true,
  notifyPush: true,
  notifySms: false,
};

// ── Form ─────────────────────────────────────────────────────────────────────
type FormProps = {
  initialValues?: GeneralSettingsInput;
  saving?: boolean;
  onSubmit: (data: GeneralSettingsInput) => Promise<void> | void;
};

export function GeneralSettingsForm({
  initialValues = DEFAULT_VALUES,
  saving = false,
  onSubmit,
}: FormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<GeneralSettingsInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const formValues = useWatch({ control });
  const notifyEmail = useWatch({ control, name: "notifyEmail" });
  const notifyPush = useWatch({ control, name: "notifyPush" });
  const notifySms = useWatch({ control, name: "notifySms" });
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
            {/* 1. Branch Information */}
            <section>
              <BranchInfoSection register={register} errors={errors} />
            </section>

            <div className="h-px bg-border/60" />

            {/* 2. Branding & Display */}
            <section>
              <BrandingSection register={register} logoUrl={logoUrl} setValue={setValue} />
            </section>

            <div className="h-px bg-border/60" />

            {/* 3. Localization Settings */}
            <section>
              <LocalizationSection
                initialValues={formValues as GeneralSettingsInput}
                setValue={setValue}
              />
            </section>

            <div className="h-px bg-border/60" />

            {/* 4. Printing Configuration */}
            <section>
              <PrintSection register={register} />
            </section>

            <div className="h-px bg-border/60" />

            {/* 5. Notifications */}
            <section className="pb-4">
              <NotifySection
                notifyEmail={notifyEmail}
                notifyPush={notifyPush}
                notifySms={notifySms}
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
                disabled={saving}
                className="h-11 min-w-[200px] bg-primary text-base font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
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
  const [initialValues, setInitialValues] = React.useState<GeneralSettingsInput>(DEFAULT_VALUES);
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
            restaurantName: response.data.restaurantName ?? current.restaurantName,
            branchName: response.data.branchName ?? current.branchName,
            address: response.data.address ?? current.address,
            phone: response.data.phone ?? current.phone,
            currency: response.data.currency ?? current.currency,
            dateFormat: response.data.dateFormat ?? current.dateFormat,
            timezone: response.data.timezone ?? current.timezone,
            language: response.data.language ?? current.language,
            billTitle: response.data.billTitle ?? current.billTitle,
            billFooter: response.data.billFooter ?? current.billFooter,
            kdsTitle: response.data.kdsTitle ?? current.kdsTitle,
            appTitle: response.data.appTitle ?? current.appTitle,
            logoUrl: response.data.logoUrl ?? current.logoUrl,
          }));
        }
      } catch {
        toast.error(UI_TEXT.API.NETWORK_ERROR);
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
      const response = await brandingService.updateBrandingSettings({
        restaurantName: data.restaurantName,
        branchName: data.branchName,
        address: data.address ?? "",
        phone: data.phone ?? "",
        currency: data.currency,
        dateFormat: data.dateFormat,
        timezone: data.timezone,
        language: data.language,
        billTitle: data.billTitle,
        billFooter: data.billFooter,
        kdsTitle: data.kdsTitle,
        appTitle: data.appTitle,
        logoUrl: data.logoUrl ?? "",
      });

      if (response.isSuccess && response.data) {
        setInitialValues((current) => ({
          ...current,
          restaurantName: response.data.restaurantName,
          branchName: response.data.branchName,
          address: response.data.address,
          phone: response.data.phone,
          currency: response.data.currency,
          dateFormat: response.data.dateFormat,
          timezone: response.data.timezone,
          language: response.data.language,
          billTitle: response.data.billTitle,
          billFooter: response.data.billFooter,
          kdsTitle: response.data.kdsTitle,
          appTitle: response.data.appTitle,
          logoUrl: response.data.logoUrl,
        }));
        await queryClient.invalidateQueries({ queryKey: ["branding-settings"] });
      }

      toast.success(SETTINGS.SUCCESS_GENERAL);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <GeneralSettingsForm initialValues={initialValues} saving={saving} onSubmit={handleSubmit} />
  );
}
