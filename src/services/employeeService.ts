import { Employee } from "@/types/Employee";

import { apiFetch } from "./api";
import { ApiResponse, PaginationResult } from "./menuService";

export async function getEmployees(): Promise<ApiResponse<PaginationResult<Employee>>> {
  const res = await apiFetch<PaginationResult<Employee>>("/v1/employees");
  return res;
}

export async function addEmployee(employee: Partial<Employee>): Promise<ApiResponse<Employee>> {
  return apiFetch<Employee>("/v1/employees", {
    method: "POST",
    body: employee,
    cache: "no-store",
  });
}

export async function updateEmployee(employee: Partial<Employee>): Promise<ApiResponse<Employee>> {
  return apiFetch<Employee>(`/v1/employees/${employee.employeeId}`, {
    method: "PUT",
    body: employee,
    cache: "no-store",
  });
}

export async function deleteEmployee(employeeId: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/v1/employees/${employeeId}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

export async function filterEmployee(
  role: number
): Promise<ApiResponse<PaginationResult<Employee>>> {
  return apiFetch<PaginationResult<Employee>>(`/v1/employees?filters=role:${role}`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function changeEmployeePassword(
  employeeId: string,
  reason: string,
  newPassword?: string
): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/v1/employees/reset-password`, {
    method: "POST",
    body: { employeeId, reason, newPassword },
    cache: "no-store",
  });
}

export async function changeEmployeeRole(
  employeeCode: string,
  currentRole: number,
  newRole: number
): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/v1/employees/change-role`, {
    method: "POST",
    body: { employeeCode, currentRole, newRole },
    cache: "no-store",
  });
}
