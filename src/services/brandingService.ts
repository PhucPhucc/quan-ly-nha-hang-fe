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

  // 1. Business Info
  legalBusinessName: string;
  brandName: string;
  taxCode: string;
  businessRegistrationNumber: string;
  branchCode: string;
  restaurantCode: string;

  // 2. Contact Info
  hotline: string;
  email: string;
  website: string;
  facebook: string;
  zaloOa: string;
  instagram: string;

  // 3. Address
  country: string;
  provinceCity: string;
  district: string;
  ward: string;
  streetAddress: string;
  postalCode: string;
  googleMapUrl: string;

  // 4. Images
  coverImageUrl: string;
  qrPaymentImageUrl: string;
  faviconUrl: string;

  // 5. Invoice Settings
  vatPercentage: number;

  // 6. Time Settings
  timeFormat: string;

  // 7. Operating Info
  openingTime: string;
  closingTime: string;
  workingDays: string;

  // 8. System Config
  enableOrdering: boolean;
  enableDelivery: boolean;
  enableTakeAway: boolean;
  enableReservation: boolean;
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
