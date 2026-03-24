import { useQuery } from "@tanstack/react-query";

import { inventoryService } from "@/services/inventory.service";
import { useAuthStore } from "@/store/useAuthStore";
import { EmployeeRole } from "@/types/Employee";

export function useInventoryAlertsCount() {
  const userRole = useAuthStore((state) => state.employee?.role);
  const isManager = userRole === EmployeeRole.MANAGER;

  return useQuery({
    queryKey: ["inventory-alerts-badge"],
    queryFn: async () => {
      const res = await inventoryService.getInventoryAlertBadge();
      if (!res.isSuccess || !res.data) return 0;

      return res.data.badgeCount;
    },
    enabled: !!isManager,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000,
    retry: (failureCount, error: { status?: number }) => {
      if (error?.status === 403) return false;
      return failureCount < 2;
    },
  });
}
