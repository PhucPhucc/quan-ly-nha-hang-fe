import { OrderAuditLog } from "@/types/Order";
import { apiFetch } from "./api";

export interface AuditLogResponse {
  items: OrderAuditLog[];
  totalCount: number;
}

export async function getAuditLogs(employeeId?: string) {
  if (!employeeId) {
    return { items: [], totalCount: 0 };
  }
  return apiFetch(`/employees/${employeeId}/audit-logs`, { cache: "no-store" });
}
