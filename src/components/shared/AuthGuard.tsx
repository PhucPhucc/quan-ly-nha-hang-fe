"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { refreshToken } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { accessToken, setAccessToken } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!accessToken) {
        try {
          const data = await refreshToken();
          setAccessToken(data.accessToken);
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        } catch {
          router.push("/login");
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [accessToken, router, setAccessToken]);

  if (isChecking) {
    // Optional: Render a loading spinner here
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Double check to prevent flash
  if (!accessToken) return null;

  return <>{children}</>;
}
