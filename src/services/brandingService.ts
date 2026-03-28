import { ApiResponse } from "@/types/Api";

import { apiFetch } from "./api";

export interface BrandingSettingsDto {
  restaurantName: string;
  branchName: string;
  address: string;
  phone: string;
  currency: string;
  dateFormat: string;
  timezone: string;
  language: string;
  billTitle: string;
  billFooter: string;
  kdsTitle: string;
  appTitle: string;
  logoUrl: string;
}

export type UpdateBrandingSettingsRequest = BrandingSettingsDto;

export const brandingService = {
  getBrandingSettings: (): Promise<ApiResponse<BrandingSettingsDto>> => {
    return apiFetch<BrandingSettingsDto>("/branding/settings");
  },

  updateBrandingSettings: (
    payload: UpdateBrandingSettingsRequest
  ): Promise<ApiResponse<BrandingSettingsDto>> => {
    return apiFetch<BrandingSettingsDto>("/branding/settings", {
      method: "PUT",
      body: payload,
    });
  },
};
