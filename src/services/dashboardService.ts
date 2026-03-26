import { ApiResponse } from "@/types/Api";
import { OperationalStats } from "@/types/salesAnalytics.types";

import { apiFetch } from "./api";

export const dashboardService = {
  getOperationalStats: async (): Promise<ApiResponse<OperationalStats>> => {
    return apiFetch<OperationalStats>("/dashboard/operational-stats");
  },
};
