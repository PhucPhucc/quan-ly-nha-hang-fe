"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { logout } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutPage() {
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        logoutStore();
        // Force a hard navigation to login to ensure all states/cache are cleared
        window.location.href = "/login";
      }
    };

    handleLogout();
  }, [logoutStore, router]);

  return <LoadingSpinner></LoadingSpinner>;
}
