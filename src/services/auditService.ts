import { EmployeeAuditLog } from "@/types/Employee";

import { apiFetch } from "./api";
import { ApiResponse, PaginationResult } from "./menuService";

export async function getAuditLogs(
  employeeId?: string
): Promise<ApiResponse<PaginationResult<EmployeeAuditLog>>> {
  if (!employeeId) {
    return {
      isSuccess: true,
      data: {
        items: [],
        totalCount: 0,
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
      },
    };
  }
  return apiFetch<PaginationResult<EmployeeAuditLog>>(`/v1/employees/${employeeId}/audit-logs`, {
    cache: "no-store",
  });
}
