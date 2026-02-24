export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
  warning?: string;
  error?: string;
}

export interface PaginationResult<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export type QueryParams = Record<string, string | number | boolean | undefined>;
