import { useQuery } from "@tanstack/react-query";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryAlertsCount() {
  return useQuery({
    queryKey: ["inventory-alerts-badge"],
    queryFn: async () => {
      const res = await inventoryService.getInventoryAlerts();
      if (!res.isSuccess || !res.data) return 0;

      return (
        (res.data.outOfStockItems?.length ?? 0) +
        (res.data.lowStockItems?.length ?? 0) +
        (res.data.expiredLots?.length ?? 0) +
        (res.data.nearExpiryLots?.length ?? 0)
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
