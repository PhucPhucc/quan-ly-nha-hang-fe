import { Employee } from "@/types/Employee";

import { apiFetch } from "./api";

// GET profile
export async function getMyProfile(): Promise<Employee> {
  const res = await apiFetch("/profile", {
    method: "GET",
  });
  return res.data;
}

// UPDATE profile
export const updateMyProfile = async (data: Partial<Employee>): Promise<void> => {
  await apiFetch("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
  await apiFetch("/profile/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
