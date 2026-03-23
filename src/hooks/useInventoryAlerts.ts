import { useQuery } from "@tanstack/react-query";

import { inventoryService } from "@/services/inventory.service";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

export function useInventoryAlerts() {
  const userRole = useAuthStore((state) => state.employee?.role);
  const isManager = userRole === EmployeeRole.MANAGER;

  return useQuery({
    queryKey: ["inventory-alerts"],
    queryFn: async () => {
      const res = await inventoryService.getInventoryAlerts();
      if (!res.isSuccess || !res.data) {
        return {
          outOfStockItems: [],
          lowStockItems: [],
          expiredLots: [],
          nearExpiryLots: [],
          badgeCount: 0,
        };
      }
      return res.data;
    },
    enabled: !!isManager,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: { status?: number }) => {
      if (error?.status === 403) return false;
      return failureCount < 2;
    },
  });
}
