import { ApiResponse } from "@/types/Api"; // Assuming Shared Api Response

import { apiFetch } from "./api";

export async function uploadImage(
  file: File,
  folder: string = "menu-items"
): Promise<ApiResponse<string>> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<string>(`/v1/image/upload?folder=${folder}`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteImage(publicId: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/v1/image/delete?publicId=${publicId}`, {
    method: "DELETE",
  });
}
