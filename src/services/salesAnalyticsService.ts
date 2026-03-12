import { BestSeller, SalesAnalyticsSummary } from "@/types/salesAnalytics.types";

import { apiFetch } from "./api";

interface BackendDailyReportResponse {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  cancelledOrders: number;
  dailyTarget: number | null;
  achievementRate: number | null;
}

export interface BackendBestSellerDto {
  itemName: string;
  categoryName: string;
  quantitySold: number;
  totalRevenue: number;
  revenuePercentage: number;
  grossProfit: number;
}

export interface BackendBestSellersResponse {
  items: BackendBestSellerDto[];
}

export interface BackendMonthlyReportResponse {
  year: number;
  month: number;
  totalRevenue: number;
  totalOrders: number;
  cancelledOrders: number;
  dailyTarget?: number | null;
  achievementRate?: number | null;
}

export interface BackendRevenuePointDto {
  label: string;
  revenue: number;
}

export interface BackendRevenueChartResponse {
  points: BackendRevenuePointDto[];
}

export interface BackendCategoryReportDto {
  categoryName: string;
  totalRevenue: number;
  revenuePercentage: number;
  itemCount: number;
}

export interface BackendCategoryReportResponse {
  items: BackendCategoryReportDto[];
}

export const salesAnalyticsService = {
  getSummary: async (startDate?: string, endDate?: string): Promise<SalesAnalyticsSummary> => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      // If we only have startDate, use it as endDate as well to satisfy backend requirements
      if (endDate) params.append("endDate", endDate);
      else if (startDate) params.append("endDate", startDate);

      const query = params.toString() ? `?${params.toString()}` : "";

      const isSingleDay = Boolean(startDate && !endDate);
      const revenueChartPromise = salesAnalyticsService.getRevenueChart(
        isSingleDay ? { date: startDate } : { startDate, endDate: endDate || startDate }
      );

      const [summaryResponse, bestSellersResponse, categoryReportResponse, revenueChartResponse] =
        await Promise.all([
          apiFetch<BackendDailyReportResponse>(`/salesanalytics/summary${query}`),
          salesAnalyticsService.getBestSellers(startDate, endDate),
          salesAnalyticsService.getCategoryReport(startDate, endDate || startDate),
          revenueChartPromise,
        ]);
      const data = summaryResponse.data;

      return {
        stats: {
          totalRevenue: data.totalRevenue || 0,
          revenueGrowth: data.achievementRate ? data.achievementRate - 100 : 0,
          totalOrders: data.totalOrders || 0,
          avgOrderValue: data.totalOrders > 0 ? data.totalRevenue / data.totalOrders : 0,
        },
        revenueChart: revenueChartResponse,
        bestSellers: bestSellersResponse,
        categoryDistribution: categoryReportResponse,
      };
    } catch (error) {
      throw new Error(`Failed to fetch sales analytics: ${error}`);
    }
  },

  getMonthlySummary: async (year?: number, month?: number): Promise<SalesAnalyticsSummary> => {
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year.toString());
      if (month) params.append("month", month.toString());

      const query = params.toString() ? `?${params.toString()}` : "";
      const [summaryResponse, bestSellersResponse, categoryReportResponse, revenueChartResponse] =
        await Promise.all([
          apiFetch<BackendMonthlyReportResponse>(`/salesanalytics/monthly-summary${query}`),
          salesAnalyticsService.getBestSellers(
            year && month ? `${year}-${String(month).padStart(2, "0")}-01` : undefined,
            year && month
              ? `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`
              : undefined
          ),
          salesAnalyticsService.getCategoryReport(
            year && month ? `${year}-${String(month).padStart(2, "0")}-01` : undefined,
            year && month
              ? `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`
              : undefined
          ),
          salesAnalyticsService.getRevenueChart({ year, month }),
        ]);
      const data = summaryResponse.data;

      return {
        stats: {
          totalRevenue: data.totalRevenue || 0,
          revenueGrowth: data.achievementRate ? data.achievementRate - 100 : 0,
          totalOrders: data.totalOrders || 0,
          avgOrderValue: data.totalOrders > 0 ? data.totalRevenue / data.totalOrders : 0,
        },
        revenueChart: revenueChartResponse,
        bestSellers: bestSellersResponse,
        categoryDistribution: categoryReportResponse,
      };
    } catch (error) {
      throw new Error(`Failed to fetch monthly sales analytics: ${error}`);
    }
  },

  getBestSellers: async (
    startDate?: string,
    endDate?: string,
    top: number = 10
  ): Promise<BestSeller[]> => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      else if (startDate) params.append("endDate", startDate);
      params.append("top", top.toString());

      const response = await apiFetch<BackendBestSellersResponse>(
        `/salesanalytics/best-sellers?${params.toString()}`
      );

      return response.data.items.map((item: BackendBestSellerDto, index: number) => ({
        id: `best-seller-${index}`,
        rank: index + 1,
        name: item.itemName,
        category: item.categoryName,
        quantitySold: item.quantitySold,
        revenue: item.totalRevenue,
        percentageOfTotal: item.revenuePercentage,
        grossProfit: item.grossProfit,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch best sellers: ${error}`);
    }
  },

  getCategoryReport: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      else if (startDate) params.append("endDate", startDate);

      const response = await apiFetch<BackendCategoryReportResponse>(
        `/salesanalytics/category-report?${params.toString()}`
      );

      return response.data.items.map((item: BackendCategoryReportDto) => ({
        category: item.categoryName,
        revenue: item.totalRevenue,
        percentage: item.revenuePercentage,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch category report: ${error}`);
    }
  },

  getRevenueChart: async (filters: {
    date?: string;
    startDate?: string;
    endDate?: string;
    year?: number;
    month?: number;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      else if (filters.startDate) params.append("endDate", filters.startDate);
      if (filters.year) params.append("year", filters.year.toString());
      if (filters.month) params.append("month", filters.month.toString());

      const response = await apiFetch<BackendRevenueChartResponse>(
        `/salesanalytics/revenue-chart?${params.toString()}`
      );

      return response.data.points.map((p: BackendRevenuePointDto) => ({
        date: p.label,
        revenue: p.revenue,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch revenue chart: ${error}`);
    }
  },

  exportToExcel: async (filters: {
    date?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append("date", filters.date);
      if (filters.year) params.append("year", filters.year.toString());
      if (filters.month) params.append("month", filters.month.toString());
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await apiFetch<Blob>(`/salesanalytics/export?${params.toString()}`, {
        responseType: "blob",
      });

      // Create a link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Sales_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(`Failed to export sales analytics: ${error}`);
    }
  },
};
