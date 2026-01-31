"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";

export function LogoutButton() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  const handleLogout = async () => {
    clearAuth();
    router.replace("/login");
  };
  return <button onClick={handleLogout}>Đăng xuất</button>;
}
