import { SalesAnalyticsSummary } from "@/types/salesAnalytics.types";

import { apiFetch } from "./api";

export const salesAnalyticsService = {
  getSummary: async (startDate?: string, endDate?: string): Promise<SalesAnalyticsSummary> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiFetch<SalesAnalyticsSummary>(`/sales-analytics/summary${query}`);
    return response.data;
  },
};
