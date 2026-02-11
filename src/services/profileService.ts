import { Employee } from "@/types/Employee";

import { apiFetch } from "./api";
import { ApiResponse } from "./menuService";

// GET profile
export async function getMyProfile(): Promise<ApiResponse<Employee>> {
  return apiFetch<Employee>("/v1/profile", {
    method: "GET",
  });
}

// UPDATE profile
export const updateMyProfile = async (data: Partial<Employee>): Promise<ApiResponse<void>> => {
  return apiFetch<void>("/v1/profile", {
    method: "PUT",
    body: data,
  });
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (data: ChangePasswordPayload): Promise<ApiResponse<void>> => {
  return apiFetch<void>("/v1/auth/change-password", {
    method: "POST",
    body: data,
  });
};
