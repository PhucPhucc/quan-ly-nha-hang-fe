import { ApiResponse } from "@/types/Api";
import { Employee } from "@/types/Employee";

import { apiFetch } from "./api";

// GET profile
export async function getMyProfile(): Promise<ApiResponse<Employee>> {
  return apiFetch<Employee>("/profile", {
    method: "GET",
  });
}

// UPDATE profile
export const updateMyProfile = async (data: Partial<Employee>): Promise<ApiResponse<void>> => {
  return apiFetch<void>("/profile", {
    method: "PUT",
    body: data,
  });
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export const changePassword = async (data: ChangePasswordPayload): Promise<ApiResponse<void>> => {
  return apiFetch<void>("/auth/change-password", {
    method: "POST",
    body: data,
  });
};
