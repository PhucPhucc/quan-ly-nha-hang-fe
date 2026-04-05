import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse } from "@/types/Api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const NETWORK_ERROR_MESSAGE =
  "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.";
const CSRF_HEADER_NAME = "X-XSRF-TOKEN";
const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];
let csrfToken: string | null = null;
let csrfTokenPromise: Promise<void> | null = null;

export function clearCsrfToken() {
  csrfToken = null;
  csrfTokenPromise = null;
}

export async function refreshCsrfToken(): Promise<void> {
  clearCsrfToken();
  await ensureCsrfToken();
}

async function isCsrfValidationError(res: Response): Promise<boolean> {
  if (res.status !== 400) {
    return false;
  }

  try {
    const payload = (await res.clone().json()) as { message?: string };
    return payload.message === "Invalid or missing CSRF token.";
  } catch {
    return false;
  }
}

function isMutationRequest(method?: string): boolean {
  return MUTATION_METHODS.has((method || "GET").toUpperCase());
}

function shouldSkipAuthRefresh(path: string): boolean {
  return [
    "/auth/login",
    "/auth/logout",
    "/auth/request-password-reset",
    "/auth/reset-password",
    "/auth/csrf-token",
    "/auth/refresh-token",
  ].includes(path);
}

async function ensureCsrfToken(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  if (csrfToken) {
    return;
  }

  if (csrfTokenPromise) {
    await csrfTokenPromise;
    return;
  }

  csrfTokenPromise = (async () => {
    const res = await fetch(BASE_URL + "/api/v1/auth/csrf-token", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Unable to initialize CSRF token");
    }

    const data = (await res.json()) as { csrfToken?: string };
    if (!data.csrfToken) {
      throw new Error("CSRF token was not returned");
    }

    csrfToken = data.csrfToken;
  })();

  try {
    await csrfTokenPromise;
  } finally {
    csrfTokenPromise = null;
  }
}

async function buildRequestOptions(options: RequestInit): Promise<RequestInit> {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers);

  if (isMutationRequest(method)) {
    await ensureCsrfToken();
    if (csrfToken) {
      headers.set(CSRF_HEADER_NAME, csrfToken);
    }
  }

  return {
    ...options,
    method,
    headers,
  };
}

export async function refreshToken() {
  clearCsrfToken();
  const res = await fetch(
    BASE_URL + "/api/v1/auth/refresh-token",
    await buildRequestOptions({
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
  );

  if (!res.ok) {
    throw new Error("Refresh token failed");
  }

  const data = await res.json();
  await refreshCsrfToken();
  return data;
}

async function performRequest(path: string, options: RequestInit): Promise<Response> {
  const prefix = path.startsWith("/v") ? "/api" : "/api/v1";
  try {
    return await fetch(BASE_URL + prefix + path, await buildRequestOptions(options));
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }
}

async function getErrorMessage(res: Response): Promise<string> {
  let message = `Lỗi API (${res.status})`;

  try {
    const errorText = await res.text();
    if (!errorText) {
      return message;
    }

    try {
      const data = JSON.parse(errorText);
      message = data.message || data.error || data.title || message;

      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        message = data.errors.join(", ");
      }
    } catch {
      message = `Lỗi API (${res.status} ${res.statusText})`;
    }
  } catch {
    return message;
  }

  return message;
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

  let res = await performRequest(path, fetchOptions);
  const method = (options.method || "GET").toUpperCase();
  const isMutation = isMutationRequest(method);
  const shouldAttemptRefresh = !shouldSkipAuthRefresh(path);

  if (isMutation && (await isCsrfValidationError(res))) {
    clearCsrfToken();
    res = await performRequest(path, fetchOptions);
  }

  if (res.status === 401 && shouldAttemptRefresh) {
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
        clearCsrfToken();
        useAuthStore.getState().logout();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        // console.error("Token refresh failed:", err);
        throw new Error("Session expired");
      }
    } else {
      await new Promise<void>((resolve) => {
        refreshQueue.push(resolve);
      });
    }

    res = await performRequest(path, fetchOptions);

    if (isMutation && (await isCsrfValidationError(res))) {
      clearCsrfToken();
      res = await performRequest(path, fetchOptions);
    }
  }

  if (!res.ok) {
    throw new Error(await getErrorMessage(res));
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
    const errorMessage = json.message || json.error || json.Error || json.title;

    return {
      isSuccess: true,
      data: json.data,
      message: errorMessage,
    } as ApiResponse<T>;
  }

  return {
    isSuccess: true,
    data: json as T,
  };
}
