import { ApiResponse, PaginationResult } from "@/types/Api";

import { apiFetch } from "./api";

export interface SystemAuditLog {
  logId: string;
  entityName: string;
  entityId: string;
  action: string;
  oldValues?: string | null;
  newValues?: string | null;
  actorInfo?: string | null;
  createdAt: string;
}

export interface SystemAuditLogParams {
  pageNumber?: number;
  pageSize?: number;
  fromDate?: Date;
  toDate?: Date;
  actionFilter?: string;
  entityNameFilter?: string;
}

export async function getAuditLogs(
  employeeId?: string
): Promise<ApiResponse<PaginationResult<SystemAuditLog>>> {
  if (!employeeId) {
    return {
      isSuccess: true,
      data: {
        items: [],
        totalCount: 0,
        pageSize: 10,
        pageNumber: 1,
        totalPages: 0,
      },
    };
  }
  return apiFetch<PaginationResult<SystemAuditLog>>(`/employees/${employeeId}/audit-logs`, {
    cache: "no-store",
  });
}

export async function getSystemAuditLogs(
  params: SystemAuditLogParams = {}
): Promise<ApiResponse<PaginationResult<SystemAuditLog>>> {
  const query = new URLSearchParams();
  const toIsoString = (value: Date) => value.toISOString();

  if (params.pageNumber) query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.fromDate) query.set("fromDate", toIsoString(params.fromDate));
  if (params.toDate) query.set("toDate", toIsoString(params.toDate));
  if (params.actionFilter) query.set("actionFilter", params.actionFilter);
  if (params.entityNameFilter) query.set("entityNameFilter", params.entityNameFilter);

  return apiFetch<PaginationResult<SystemAuditLog>>(
    `/auditlogs${query.toString() ? `?${query.toString()}` : ""}`,
    {
      cache: "no-store",
    }
  );
}
