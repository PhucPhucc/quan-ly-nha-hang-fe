"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";

import { BranchInfoSection } from "./sections/BranchInfoSection";
import { LocalizationSection } from "./sections/LocalizationSection";
import { NotifySection } from "./sections/NotifySection";

const { SETTINGS, FORM } = UI_TEXT;

// ── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  restaurantName: z.string().min(1, FORM.REQUIRED),
  branchName: z.string().min(1, FORM.REQUIRED),
  branchId: z.string().min(1, FORM.REQUIRED),
  address: z.string().optional(),
  phone: z.string().optional(),
  currency: z.string().min(1),
  dateFormat: z.string().min(1),
  timezone: z.string().min(1),
  notifyEmail: z.boolean(),
  notifyPush: z.boolean(),
  notifySms: z.boolean(),
});

export type GeneralSettingsInput = z.infer<typeof schema>;

const DEFAULT_VALUES: GeneralSettingsInput = {
  restaurantName: SETTINGS.FIELD_RESTAURANT_NAME_PLACEHOLDER.replace("VD: ", ""),
  branchName: SETTINGS.FIELD_BRANCH_NAME_PLACEHOLDER.replace("VD: ", ""),
  branchId: SETTINGS.FIELD_BRANCH_ID_PLACEHOLDER.replace("VD: ", ""),
  address: "",
  phone: "",
  currency: "VND",
  dateFormat: SETTINGS.DATE_FORMAT_DMY,
  timezone: "GMT+7",
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
    formState: { errors },
  } = useForm<GeneralSettingsInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const notifyEmail = useWatch({ control, name: "notifyEmail" });
  const notifyPush = useWatch({ control, name: "notifyPush" });
  const notifySms = useWatch({ control, name: "notifySms" });

  return (
    <div className="w-full p-4 pb-10 md:p-6 md:pb-12">
      <Card className="mx-auto w-full max-w-3xl border-border shadow-soft pt-5">
        <CardHeader className="gap-1 pb-4">
          <CardTitle className="text-lg">{SETTINGS.GENERAL_TITLE}</CardTitle>
          <CardDescription>{SETTINGS.GENERAL_DESC}</CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <BranchInfoSection register={register} errors={errors} />

            <div className="border-t border-border" />
            <LocalizationSection initialValues={initialValues} setValue={setValue} />

            <div className="border-t border-border" />
            <NotifySection
              notifyEmail={notifyEmail}
              notifyPush={notifyPush}
              notifySms={notifySms}
              setValue={setValue}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="min-w-36 bg-primary hover:bg-primary-hover"
              >
                {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
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
  const [saving, setSaving] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (_data: GeneralSettingsInput) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // TODO: settingsService.updateGeneral
      toast.success(SETTINGS.SUCCESS_GENERAL);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  return <GeneralSettingsForm saving={saving} onSubmit={handleSubmit} />;
}
