import { ApiResponse, PaginationResult } from "@/types/Api";
import { Employee } from "@/types/Employee";

import { apiFetch } from "./api";

export async function getEmployees(params?: {
  search?: string;
  filters?: string;
  pageSize?: number;
}): Promise<ApiResponse<PaginationResult<Employee>>> {
  let url = "/employees";
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.filters) queryParams.append("filters", params.filters);
  if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());

  const queryString = queryParams.toString();
  if (queryString) url += `?${queryString}`;

  const res = await apiFetch<PaginationResult<Employee>>(url);
  return res;
}

export async function addEmployee(employee: Partial<Employee>): Promise<ApiResponse<Employee>> {
  return apiFetch<Employee>("/employees", {
    method: "POST",
    body: employee,
    cache: "no-store",
  });
}

export async function updateEmployee(employee: Partial<Employee>): Promise<ApiResponse<Employee>> {
  return apiFetch<Employee>(`/employees/${employee.employeeId}`, {
    method: "PUT",
    body: employee,
    cache: "no-store",
  });
}

export async function deleteEmployee(employeeId: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/employees/${employeeId}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

export async function filterEmployee(
  role: string
): Promise<ApiResponse<PaginationResult<Employee>>> {
  return apiFetch<PaginationResult<Employee>>(`/employees?filters=role:${role}`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function changeEmployeePassword(
  employeeId: string,
  reason: string,
  newPassword?: string
): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/employees/reset-password`, {
    method: "POST",
    body: { employeeId, reason, newPassword },
    cache: "no-store",
  });
}

export async function changeEmployeeRole(
  employeeCode: string,
  currentRole: string,
  newRole: string
): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/employees/change-role`, {
    method: "POST",
    body: { employeeCode, currentRole, newRole },
    cache: "no-store",
  });
}

export async function getEmployeeById(employeeId: string): Promise<ApiResponse<Employee>> {
  return apiFetch<Employee>(`/employees/${employeeId}`, {
    method: "GET",
    cache: "no-store",
  });
}
