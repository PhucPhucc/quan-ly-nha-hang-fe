import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL");
}

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

export async function refreshToken() {
  const res = await fetch(BASE_URL + "/api/auth/refresh-token", {
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

export async function apiFetch(path: string, options: RequestInit = {}) {
  const store = useAuthStore.getState();
  const token = store.accessToken ? store.accessToken : localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(BASE_URL + "/api" + path, {
    ...options,
    headers,
    credentials: "include",
  });

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
      headers.Authorization = `Bearer ${newToken}`;
    }

    res = await fetch(BASE_URL + "/api" + path, {
      ...options,
      headers,
      credentials: "include",
    });
  }

  if (!res.ok) {
    let message = "API Error";
    console.log(123);
    try {
      const data = await res.json();
      message = data.error || data.errors || data.message || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}
