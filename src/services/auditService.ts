import { ApiResponse, PaginationResult } from "@/types/Api";
import { EmployeeAuditLog } from "@/types/Employee";

import { apiFetch } from "./api";

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
  return apiFetch<PaginationResult<EmployeeAuditLog>>(`/employees/${employeeId}/audit-logs`, {
    cache: "no-store",
  });
}
