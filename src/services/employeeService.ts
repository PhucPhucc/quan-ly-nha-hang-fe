import { apiFetch } from "./api";

export async function getEmployees() {
  return apiFetch("/employees");
}
