"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";

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
  const isAuthorized = Boolean(employee?.role && allowedRoles.includes(employee.role));

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
