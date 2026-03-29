import { useMemo } from "react";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";
import { BrandingSettingsDto } from "@/services/brandingService";

const FALLBACK = {
  language: "vi",
  timezone: "Asia/Ho_Chi_Minh",
  dateFormat: "dd/MM/yyyy",
  currency: "VND",
};

const DATE_FORMAT_OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
  "dd/MM/yyyy": { day: "2-digit", month: "2-digit", year: "numeric" },
  "MM/dd/yyyy": { month: "2-digit", day: "2-digit", year: "numeric" },
  "yyyy-MM-dd": { year: "numeric", month: "2-digit", day: "2-digit" },
};

function toDate(value?: string | number | Date | null): Date | null {
  if (!value) {
    return null;
  }

  const date = typeof value === "string" ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTimeWithBranding(
  value: string | number | Date | null,
  branding?: Partial<BrandingSettingsDto>,
  includeTime = true
): string {
  if (!value) {
    return UI_TEXT.COMMON.NOT_APPLICABLE;
  }

  const date = toDate(value);
  if (!date) {
    return UI_TEXT.COMMON.NOT_APPLICABLE;
  }

  const formatOptions =
    DATE_FORMAT_OPTIONS[branding?.dateFormat ?? FALLBACK.dateFormat] ??
    DATE_FORMAT_OPTIONS[FALLBACK.dateFormat];

  const baseOptions: Intl.DateTimeFormatOptions = {
    ...formatOptions,
    timeZone: branding?.timezone || FALLBACK.timezone,
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  };

  const locale = branding?.language || FALLBACK.language;
  return new Intl.DateTimeFormat(locale, baseOptions).format(date);
}

export function formatCurrencyWithBranding(
  value: number,
  branding?: Partial<BrandingSettingsDto>
): string {
  if (typeof value !== "number") {
    return UI_TEXT.COMMON.NOT_APPLICABLE;
  }

  const locale = branding?.language || FALLBACK.language;
  const currency = branding?.currency || FALLBACK.currency;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function useBrandingFormatter() {
  const { data: branding } = useBrandingSettings();

  return useMemo(() => {
    return {
      formatDate: (value?: string | number | Date | null) =>
        value ? formatDateTimeWithBranding(value, branding, false) : UI_TEXT.COMMON.NOT_APPLICABLE,
      formatDateTime: (value?: string | number | Date | null) =>
        value ? formatDateTimeWithBranding(value, branding, true) : UI_TEXT.COMMON.NOT_APPLICABLE,
      formatCurrency: (value?: number) =>
        typeof value === "number"
          ? formatCurrencyWithBranding(value, branding)
          : UI_TEXT.COMMON.NOT_APPLICABLE,
    };
  }, [branding]);
}
