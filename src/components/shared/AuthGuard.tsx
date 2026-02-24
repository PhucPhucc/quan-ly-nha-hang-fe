"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Employee } from "@/types/Employee";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { employee, setEmployee } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Cleanup old tokens from localStorage if any (stale data from previous versions)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    const checkAuth = async () => {
      if (!employee) {
        try {
          // Attempt to get user info - this will auto-refresh tokens if needed via apiFetch interceptor
          const res = await apiFetch<Employee>("/v1/auth/me");
          if (res.isSuccess && res.data) {
            setEmployee({
              email: res.data.email || "",
              username: res.data.employeeCode,
              role: res.data.role,
            });
          } else {
            router.push("/login");
          }
        } catch {
          router.push("/login");
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [employee, router, setEmployee]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!employee) return null;

  return <>{children}</>;
}
