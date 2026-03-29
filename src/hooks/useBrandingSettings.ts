import { useQuery } from "@tanstack/react-query";

import { brandingService } from "@/services/brandingService";

export function useBrandingSettings() {
  return useQuery({
    queryKey: ["branding-settings"],
    queryFn: async () => {
      const res = await brandingService.getBrandingSettings();
      if (!res.isSuccess || !res.data) {
        throw new Error("Failed to load branding settings");
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
