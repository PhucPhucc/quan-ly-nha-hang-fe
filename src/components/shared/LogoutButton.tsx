"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "../ui/button";

export function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.replace("/login");
  };
  return <Button onClick={handleLogout}>Đăng xuất</Button>;
}
