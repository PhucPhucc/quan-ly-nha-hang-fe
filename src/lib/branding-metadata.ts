import type { BrandingSettingsDto } from "@/services/brandingService";

type BrandingApiResponse = {
  data?: BrandingSettingsDto;
  isSuccess?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchBrandingSettingsServer(): Promise<BrandingSettingsDto | null> {
  if (!BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/v1/branding/settings`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as BrandingApiResponse;
    return payload.data ?? null;
  } catch {
    return null;
  }
}
