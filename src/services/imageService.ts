import { ApiResponse } from "@/types/Api"; // Assuming Shared Api Response

import { apiFetch } from "./api";

// Định nghĩa interface mới cho khớp với API thực tế
interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message: string;
}
export async function uploadImage(
  file: File,
  folder: string = "menu-items"
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch<UploadImageResponse>(`/image/upload?folder=${folder}`, {
    method: "POST",
    body: formData,
  });
  return response.data;
}

export async function deleteImage(publicId: string): Promise<ApiResponse<void>> {
  return apiFetch<void>(`/image/delete?publicId=${publicId}`, {
    method: "DELETE",
  });
}
