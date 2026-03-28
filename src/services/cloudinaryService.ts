import { ApiResponse } from "@/types/Api";

import { apiFetch } from "./api";

export interface UploadImageResponse {
  imageUrl: string;
}

export const cloudinaryService = {
  uploadImage: async (
    file: File,
    folder = "branding"
  ): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<UploadImageResponse>(`/images/upload?folder=${encodeURIComponent(folder)}`, {
      method: "POST",
      body: formData,
    });
  },
};
