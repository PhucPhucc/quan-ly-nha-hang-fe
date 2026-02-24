"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";

export function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.replace("/login");
  };
  return <button onClick={handleLogout}>Đăng xuất</button>;
}
