import { Employee } from "@/types/Employee";

import { apiFetch } from "./api";

export async function getEmployees() {
  return apiFetch("/employees", { cache: "no-store" });
}

export async function addEmployee(employee: Partial<Employee>) {
  return apiFetch("/employees", {
    method: "POST",
    body: JSON.stringify(employee),
    cache: "no-store",
  });
}
