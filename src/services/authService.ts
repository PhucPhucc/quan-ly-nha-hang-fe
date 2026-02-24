import { ApiResponse } from "@/types/Api";

import { apiFetch } from "./api";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  employeeCode: string;
  fullName?: string;
  role: string;
  email: string;
}

type LoginPayload = {
  employeeCode: string | null;
  password: string | null;
};

export async function login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>("/v1/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function logout(): Promise<ApiResponse<void>> {
  return apiFetch<void>("/v1/auth/logout", {
    method: "POST",
    body: {
      refreshToken: localStorage.getItem("refreshToken"),
    },
  });
}

export async function requestPasswordReset(email: string): Promise<ApiResponse<string>> {
  return apiFetch<string>("/v1/auth/request-password-reset", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(data: {
  token: string;
  newPassword: string;
}): Promise<ApiResponse<string>> {
  return apiFetch<string>("/v1/auth/reset-password", {
    method: "POST",
    body: data,
  });
}

export async function getCurrentUserInfo(): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>("/v1/auth/me", {
    method: "GET",
  });
}
