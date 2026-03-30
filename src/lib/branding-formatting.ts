import { useMemo } from "react";

import { useBrandingSettings } from "@/hooks/useBrandingSettings";
import { UI_TEXT } from "@/lib/UI_Text";
import { BrandingSettingsDto } from "@/services/brandingService";

export const FALLBACK = {
  language: "vi",
  timezone: "Asia/Ho_Chi_Minh",
  dateFormat: "dd/MM/yyyy",
  currency: "VND",
};

function toDate(value?: string | number | Date | null): Date | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const TZ_MAP: Record<string, string> = {
  "GMT+7": "Asia/Ho_Chi_Minh",
  "GMT+8": "Asia/Singapore",
  "GMT+9": "Asia/Tokyo",
};

export function formatDateTimeWithBranding(
  value: string | number | Date | null,
  branding?: Partial<BrandingSettingsDto>,
  includeTime = true,
  onlyDayMonth = false
): string {
  if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;

  const date = toDate(value);
  if (!date) return UI_TEXT.COMMON.NOT_APPLICABLE;

  const rawFormat = branding?.dateFormat ?? FALLBACK.dateFormat;
  const normalizedKey = rawFormat.toLowerCase().replace(/[^a-z0-9]/g, "");

  const getTargetTz = (tz?: string) => {
    if (!tz) return FALLBACK.timezone;
    return TZ_MAP[tz] || tz;
  };

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: getTargetTz(branding?.timezone),
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = false;
  }

  const locale = branding?.language || FALLBACK.language;
  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(date);

  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "";

  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");
  const hour = getPart("hour");
  const minute = getPart("minute");

  let datePart = "";
  if (normalizedKey === "mmddyyyy") {
    datePart = `${month}/${day}/${year}`;
  } else if (normalizedKey === "yyyymmdd") {
    datePart = `${year}-${month}-${day}`;
  } else {
    // Default to DMY
    datePart = `${day}/${month}/${year}`;
  }

  if (onlyDayMonth) {
    if (normalizedKey === "mmddyyyy") {
      datePart = `${month}/${day}`;
    } else {
      datePart = `${day}/${month}`;
    }
  }

  return includeTime ? `${datePart} ${hour}:${minute}` : datePart;
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
    const getTargetTz = (tz?: string) => {
      if (!tz) return FALLBACK.timezone;
      return TZ_MAP[tz] || tz;
    };

    return {
      formatDate: (value?: string | number | Date | null) =>
        value ? formatDateTimeWithBranding(value, branding, false) : UI_TEXT.COMMON.NOT_APPLICABLE,
      formatDayMonth: (value?: string | number | Date | null) =>
        value
          ? formatDateTimeWithBranding(value, branding, false, true)
          : UI_TEXT.COMMON.NOT_APPLICABLE,
      formatTime: (value?: string | number | Date | null) => {
        if (!value) return UI_TEXT.COMMON.NOT_APPLICABLE;
        const date = toDate(value);
        if (!date) return UI_TEXT.COMMON.NOT_APPLICABLE;

        return new Intl.DateTimeFormat(branding?.language || FALLBACK.language, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: getTargetTz(branding?.timezone),
        }).format(date);
      },
      formatDateTime: (value?: string | number | Date | null) =>
        value ? formatDateTimeWithBranding(value, branding, true) : UI_TEXT.COMMON.NOT_APPLICABLE,
      formatCurrency: (value?: number) =>
        typeof value === "number"
          ? formatCurrencyWithBranding(value, branding)
          : UI_TEXT.COMMON.NOT_APPLICABLE,
    };
  }, [branding]);
}
