import { Bell, BellOff, Mail, MessageSquare, Smartphone } from "lucide-react";
import React from "react";
import { UseFormSetValue } from "react-hook-form";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import type { GeneralSettingsInput } from "../GeneralSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type NotifyValues = {
  notifyEmail: boolean;
  notifyPush: boolean;
  notifySms: boolean;
};

type Props = NotifyValues & {
  setValue: UseFormSetValue<GeneralSettingsInput>;
};

const ITEMS = [
  {
    key: "notifyEmail" as const,
    icon: <Mail className="h-4 w-4 text-info" />,
    label: SETTINGS.FIELD_NOTIFY_EMAIL,
    desc: SETTINGS.FIELD_NOTIFY_EMAIL_DESC,
  },
  {
    key: "notifyPush" as const,
    icon: <Smartphone className="h-4 w-4 text-success" />,
    label: SETTINGS.FIELD_NOTIFY_PUSH,
    desc: SETTINGS.FIELD_NOTIFY_PUSH_DESC,
  },
  {
    key: "notifySms" as const,
    icon: <MessageSquare className="h-4 w-4 text-warning" />,
    label: SETTINGS.FIELD_NOTIFY_SMS,
    desc: SETTINGS.FIELD_NOTIFY_SMS_DESC,
  },
];

export function NotifySection({ notifyEmail, notifyPush, notifySms, setValue }: Props) {
  const values: NotifyValues = { notifyEmail, notifyPush, notifySms };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Bell className="h-4 w-4" />}
        title={SETTINGS.NOTIFY_SECTION}
        description={SETTINGS.NOTIFY_SECTION_DESC}
      />
      <div className="space-y-0 rounded-lg border border-border bg-muted/20 p-4">
        {ITEMS.map(({ key, icon, label, desc }) => (
          <Field
            key={key}
            orientation="horizontal"
            className="items-start justify-between gap-4 py-3
              [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/50"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card shadow-sm">
                {icon}
              </div>
              <div className="space-y-0.5">
                <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
                <FieldDescription>{desc}</FieldDescription>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {values[key] ? (
                  <span className="flex items-center gap-1 text-success">
                    <Bell className="h-3 w-3" /> {SETTINGS.LABEL_ENABLED}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <BellOff className="h-3 w-3" /> {SETTINGS.LABEL_DISABLED}
                  </span>
                )}
              </span>
              <Switch checked={values[key]} onCheckedChange={(v) => setValue(key, v)} />
            </div>
          </Field>
        ))}
      </div>
    </div>
  );
}
