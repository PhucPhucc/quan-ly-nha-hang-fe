import { apiFetch } from "./api";

type LoginPayload = {
  employeeCode: string | null;
  password: string | null;
};

export async function login(payload: LoginPayload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}
