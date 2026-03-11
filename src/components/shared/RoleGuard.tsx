"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { normalizeEmployeeRole } from "@/types/Employee";

import LoadingSpinner from "./LoadingSpinner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[]; // Mảng chứa các role được phép truy cập
  fallbackUrl?: string; // Đường dẫn trả về nếu không có quyền (mặc định: /dashboard)
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallbackUrl = "/unauthorized",
}: RoleGuardProps) {
  const router = useRouter();
  const { employee } = useAuthStore();
  const normalizedRole = normalizeEmployeeRole(employee?.role || undefined) || employee?.role;
  const isAuthorized = Boolean(normalizedRole && allowedRoles.includes(normalizedRole));

  useEffect(() => {
    if (employee?.role && !isAuthorized) {
      router.replace(fallbackUrl);
    }
  }, [employee?.role, isAuthorized, router, fallbackUrl]);

  if (!isAuthorized) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
