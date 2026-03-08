"use client";

import { useRouter } from "next/navigation";

import { UI_TEXT } from "@/lib/UI_Text";
import { useAuthStore } from "@/store/useAuthStore";

import { Button } from "../ui/button";

export function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    router.replace("/login");
  };
  return <Button onClick={handleLogout}>{UI_TEXT.AUTH.LOGOUT}</Button>;
}
