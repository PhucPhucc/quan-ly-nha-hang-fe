import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "./axios";

export async function requirePermission(permission: string) {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = res.data;

    if (!user.permissions?.includes(permission)) {
      redirect("/403");
    }

    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) redirect("/login");
      if (status === 403) redirect("/403");
    }

    redirect("/login");
  }
}
