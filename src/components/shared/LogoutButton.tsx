"use client";

import { useRouter } from "next/navigation";

import { UI_TEXT } from "@/lib/UI_Text";

import { Button } from "../ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/logout");
  };
  return <Button onClick={handleLogout}>{UI_TEXT.AUTH.LOGOUT}</Button>;
}
