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
    console.log(res);
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
  console.log(path);
  let res = await fetch(BASE_URL + "/api" + path, fetchOptions);

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      console.log("[API] 401 Unauthorized - Attempting refresh...");

      try {
        await refreshToken();
        isRefreshing = false;
        console.log("[API] Refresh successful, retrying original request.");
        refreshQueue.forEach((cb) => cb());
        refreshQueue = [];
      } catch (err) {
        isRefreshing = false;
        console.error("[API] Refresh failed:", err);
        useAuthStore.getState().logout();
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }

    await new Promise<void>((resolve) => {
      refreshQueue.push(resolve);
    });

    // Short delay to ensure browser processed cookies
    await new Promise((r) => setTimeout(r, 100));

    res = await fetch(BASE_URL + "/api" + path, fetchOptions);
  }

  if (!res.ok) {
    let message = "API Error";
    try {
      const data = (await res.json()) as ApiResponse<T>;
      message = data.message || message;
    } catch {
      /* ignore */
    }

    throw new Error(message);
  }

  const json = (await res.json()) as unknown;

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
