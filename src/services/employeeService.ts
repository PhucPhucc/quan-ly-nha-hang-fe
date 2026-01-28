import { apiFetch } from "./api";

export async function getEmployees() {
  const response = await apiFetch("/employees");

  if (!response.ok) {
    let message = "Khong the ket noi den backend";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {}

    throw new Error("Co loi: " + message);
  }

  return response.json();
}
