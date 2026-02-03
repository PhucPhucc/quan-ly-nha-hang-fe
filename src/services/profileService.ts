import { apiFetch } from "./api";

export type ProfileResponse = {
  fullName: string;
  phone: string;
  dob: string;
  address: string;
  email: string;
  role: string;
};

export type UpdateProfilePayload = {
  fullName: string;
  phone: string;
  dob: string;
  address: string;
};

// GET profile
export async function getMyProfile() {
  const res = await apiFetch("/profile", {
    method: "GET",
  });
  return res.data;
}

// UPDATE profile
export const updateMyProfile = async (data: UpdateProfilePayload): Promise<void> => {
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
