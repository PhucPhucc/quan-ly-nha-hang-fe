"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiFetch } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Employee } from "@/types/Employee";

import LoadingSpinner from "./LoadingSpinner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const employee = useAuthStore((s) => s.employee);
  const setEmployee = useAuthStore((s) => s.setEmployee);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (employee) {
      setChecking(false);
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const res = await apiFetch<Employee>("/auth/me");

        if (!res.isSuccess || !res.data) {
          router.replace("/login");
          return;
        }

        if (!cancelled) {
          setEmployee({
            email: res.data.email ?? "",
            username: res.data.employeeCode,
            role: res.data.role,
          });
        }
      } catch {
        router.replace("/login");
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [employee, router, setEmployee]);

  if (checking) {
    return <LoadingSpinner />;
  }

  return employee ? <>{children}</> : null;
}
