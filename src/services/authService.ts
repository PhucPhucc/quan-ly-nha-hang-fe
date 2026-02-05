import { apiFetch } from "./api";

type LoginPayload = {
  employeeCode: string | null;
  password: string | null;
};

export async function login(payload: LoginPayload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: "POST",
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
