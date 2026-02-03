"use client";

import { useEffect } from "react";

import { logout } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutPage() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        clearAuth();
        // Force a hard navigation to login to ensure all states/cache are cleared
        window.location.href = "/login";
      }
    };

    handleLogout();
  }, [clearAuth]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging out...</p>
    </div>
  );
}
