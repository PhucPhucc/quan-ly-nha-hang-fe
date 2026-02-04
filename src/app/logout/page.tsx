"use client";

import { useEffect } from "react";

import { logout } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutPage() {
  const logoutStore = useAuthStore((state) => state.logout);

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
  }, [logoutStore]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging out...</p>
    </div>
  );
}
