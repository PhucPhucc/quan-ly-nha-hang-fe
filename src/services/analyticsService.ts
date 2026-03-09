import { AnalyticsSummary } from "@/types/analytics.types";

import { apiFetch } from "./api";

export const analyticsService = {
  getSummary: async (startDate?: string, endDate?: string): Promise<AnalyticsSummary> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiFetch<AnalyticsSummary>(`/analytics/summary${query}`);
    return response.data;
  },
};
