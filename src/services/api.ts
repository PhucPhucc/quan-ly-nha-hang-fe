import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse } from "@/types/Api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL");
}

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

export async function refreshToken() {
  const res = await fetch(BASE_URL + "/api/v1/auth/refresh-token", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
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
  const store = useAuthStore.getState();
  const token = store.accessToken ? store.accessToken : localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...((options.headers as Record<string, string>) || {}),
  };

  if (headers["Content-Type"] === "none") {
    delete headers["Content-Type"];
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: "include",
  } as RequestInit;

  if (options.body && !(options.body instanceof FormData) && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  let res = await fetch(BASE_URL + "/api" + path, fetchOptions);

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const data = await refreshToken();
        store.setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        isRefreshing = false;
        refreshQueue.forEach((cb) => cb());
        refreshQueue = [];
      } catch {
        isRefreshing = false;
        store.logout();
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }

    await new Promise<void>((resolve) => {
      refreshQueue.push(resolve);
    });

    const newToken = useAuthStore.getState().accessToken;

    if (newToken) {
      const authHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };
      fetchOptions.headers = authHeaders;
    }

    res = await fetch(BASE_URL + "/api" + path, fetchOptions);
  }

  if (!res.ok) {
    let message = "API Error";
    try {
      const data = (await res.json()) as ApiResponse<T>;
      message = data.error || data.message || message;
    } catch {
      /* ignore */
    }

    throw new Error(message);
  }

  const json = (await res.json()) as ApiResponse<T> | T;

  if (json && typeof json === "object" && "data" in (json as object)) {
    return json as ApiResponse<T>;
  }

  return {
    isSuccess: true,
    data: json as T,
  };
}
