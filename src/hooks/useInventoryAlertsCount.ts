import { useQuery } from "@tanstack/react-query";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryAlertsCount() {
  return useQuery({
    queryKey: ["inventory-alerts-badge"],
    queryFn: async () => {
      const res = await inventoryService.getInventoryAlertBadge();
      return res.data?.badgeCount ?? 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
