import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse } from "@/types/Api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

export async function refreshToken() {
  const res = await fetch(BASE_URL + "/api/v1/auth/refresh-token", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error("Refresh token failed");
  }

  return res.json();
}

export async function apiFetch<T>(
  path: string,
  options: Omit<RequestInit, "body"> & {
    body?: object | string | number | boolean | null;
    responseType?: "json" | "blob";
  } = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (headers["Content-Type"] === "none") {
    delete headers["Content-Type"];
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: "include",
  } as RequestInit;

  if (options.body && !(options.body instanceof FormData) && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }
  let res: Response;

  try {
    res = await fetch(BASE_URL + "/api/v1" + path, fetchOptions);
  } catch {
    throw new Error(
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy."
    );
  }

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        await refreshToken();
        isRefreshing = false;
        refreshQueue.forEach((cb) => cb());
        refreshQueue = [];
      } catch (err) {
        isRefreshing = false;
        refreshQueue = [];
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        console.error("Token refresh failed:", err);
        throw new Error("Session expired");
      }
    } else {
      await new Promise<void>((resolve) => {
        refreshQueue.push(resolve);
      });
    }

    await new Promise((r) => setTimeout(r, 100));

    try {
      res = await fetch(BASE_URL + "/api/v1" + path, fetchOptions);
    } catch {
      throw new Error(
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy."
      );
    }
  }

  if (!res.ok) {
    let message = `Lỗi API (${res.status})`;
    try {
      const errorText = await res.text();
      if (errorText) {
        try {
          const data = JSON.parse(errorText);
          message = data.message || data.error || data.title || message;
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            message = data.errors.join(", ");
          }
        } catch {
          // Response is not JSON (e.g., HTML error page)
          message = `Lỗi API (${res.status} ${res.statusText})`;
        }
      }
    } catch {
      // Could not read response body
    }

    throw new Error(message);
  }

  if (options.responseType === "blob") {
    const blob = (await res.blob()) as unknown as T;
    return {
      isSuccess: true,
      data: blob,
    };
  }

  const text = await res.text();

  let json: Record<string, unknown>;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Phản hồi từ server không hợp lệ (không phải JSON): ${text.substring(0, 200)}`);
  }

  if (json && typeof json === "object" && "data" in json) {
    return {
      isSuccess: true,
      ...json,
    } as ApiResponse<T>;
  }

  return {
    isSuccess: true,
    data: json as T,
  };
}
