import { create } from "zustand";

import { getEmployees } from "@/services/employeeService";
import { Employee } from "@/types/Employee";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface FilterState {
  search: string;
  role: string;
}

const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
};

type EmployeeState = {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  pageSize: number;

  pagination: PaginationState;
  filters: FilterState;

  setEmployees: (employees: Employee[]) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  fetchEmployees: () => Promise<void>;
};

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  loading: false,
  error: null,
  pageSize: 8,
  pagination: { ...DEFAULT_PAGINATION },
  filters: { search: "", role: "all" },

  setEmployees: (employees) => set({ employees }),

  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
      pagination: { ...state.pagination, currentPage: 1 },
    }));
    get().fetchEmployees();
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, currentPage: page },
    }));
    get().fetchEmployees();
  },

  setPageSize: (size) => set({ pageSize: size }),

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const { pagination, filters, pageSize } = get();

      const queryFilters = filters.role !== "all" ? `role:${filters.role}` : undefined;
      const res = await getEmployees({
        pageNumber: pagination.currentPage,
        pageSize,
        search: filters.search || undefined,
        filters: queryFilters,
      });

      if (res.isSuccess && res.data) {
        set({
          employees: res.data.items || [],
          pagination: {
            currentPage: res.data.pageNumber || pagination.currentPage,
            totalPages: res.data.totalPages || 1,
            totalCount: res.data.totalCount || 0,
          },
        });
      }
    } catch (error) {
      set({ error: (error as Error).message || "Vui lòng thử lại" });
    } finally {
      set({ loading: false });
    }
  },
}));
