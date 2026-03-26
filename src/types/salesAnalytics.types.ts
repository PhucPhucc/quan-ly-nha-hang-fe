export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  orderGrowth: number;
  avgOrderValue: number;
  cancelledOrders: number;
  revenueAchievement: number;
}

export interface OperationalStats {
  occupiedTables: number;
  totalTables: number;
  tableOccupancyRate: number;
  tableTrend: number;
  activeStaffCount: number;
  totalStaffOnShift: number;
  staffTrend: number;
  tableHistory: number[];
  staffHistory: number[];
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface BestSeller {
  rank: number;
  id?: string;
  name: string;
  category: string;
  quantitySold: number;
  unitPrice?: number;
  revenue: number;
  percentageOfTotal: number;
  imageUrl?: string;
  grossProfit?: number;
}

export interface CategoryDistribution {
  category: string;
  revenue: number;
  percentage: number;
}

export interface SalesAnalyticsSummary {
  stats: DashboardStats;
  revenueChart: RevenuePoint[];
  bestSellers: BestSeller[];
  categoryDistribution: CategoryDistribution[];
}
