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
  options: Omit<RequestInit, "body"> & { body?: object | string | number | boolean | null } = {}
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
  let res = await fetch(BASE_URL + "/api/v1" + path, fetchOptions);

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

    res = await fetch(BASE_URL + "/api/v1" + path, fetchOptions);
  }

  if (!res.ok) {
    let message = "API Error";
    try {
      const data = (await res.json()) as ApiResponse<T>;
      message = data.message || data.error || message;
    } catch {
      /* ignore */
    }

    throw new Error(message);
  }

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};

  if (json && typeof json === "object" && "data" in (json as Record<string, unknown>)) {
    return {
      isSuccess: true,
      ...(json as Record<string, unknown>),
    } as ApiResponse<T>;
  }

  return {
    isSuccess: true,
    data: json as T,
  };
}
