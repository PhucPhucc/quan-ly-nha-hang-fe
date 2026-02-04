import { Employee } from "@/types/Employee";

import { apiFetch } from "./api";

export async function getEmployees() {
  const res = await apiFetch("/employees");
  return {
    employees: res.items.map((emp: Employee) => ({
      ...emp,
      dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : null,
      createdAt: new Date(emp.createdAt),
      updatedAt: emp.updatedAt ? new Date(emp.updatedAt) : null,
    })),
  };
}

export async function addEmployee(employee: Partial<Employee>) {
  return apiFetch("/employees", {
    method: "POST",
    body: JSON.stringify(employee),
    cache: "no-store",
  });
}

export async function updateEmployee(employee: Partial<Employee>) {
  return apiFetch(`/employees/${employee.employeeId}`, {
    method: "PUT",
    body: JSON.stringify(employee),
    cache: "no-store",
  });
}

export async function deleteEmployee(employeeId: string) {
  return apiFetch(`/employees/${employeeId}`, {
    method: "DELETE",
    cache: "no-store",
  });
}

export async function filterEmployee(role: number) {
  return apiFetch(`/employees?filters=role:${role}`, {
    method: "GET",
    cache: "no-store",
  });
}
