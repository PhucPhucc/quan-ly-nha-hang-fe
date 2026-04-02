import { ApiResponse } from "@/types/Api";

import { apiFetch, clearCsrfToken, refreshCsrfToken } from "./api";

export interface AuthResponse {
  employeeId: string;
  employeeCode: string;
  fullName?: string;
  username?: string;
  role: string;
  email: string;
}

type LoginPayload = {
  employeeCode: string | null;
  password: string | null;
};

export async function login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
  clearCsrfToken();
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
  await refreshCsrfToken();
  return response;
}

export async function logout(): Promise<ApiResponse<void>> {
  clearCsrfToken();
  return apiFetch<void>("/auth/logout", {
    method: "POST",
  });
}

export async function requestPasswordReset(employeeCode: string): Promise<ApiResponse<string>> {
  return apiFetch<string>("/auth/request-password-reset", {
    method: "POST",
    body: { employeeCode },
  });
}

export async function resetPassword(data: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse<string>> {
  return apiFetch<string>("/auth/reset-password", {
    method: "POST",
    body: data,
  });
}

export async function getCurrentUserInfo(): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>("/auth/me", {
    method: "GET",
  });
}

export async function verify(): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>("/auth/me", {
    method: "GET",
  });
}
