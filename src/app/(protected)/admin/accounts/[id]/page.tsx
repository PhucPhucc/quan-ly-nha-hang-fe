"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import AccountForm from "@/components/features/Admin/Accounts/AccountForm";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { employeeService } from "@/services/employeeService";
import { EmployeeRole } from "@/types/Employee";

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const employeeId = params.id as string;

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => employeeService.getById(employeeId),
    enabled: !!employeeId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { fullName: string; email: string; role: string }) =>
      employeeService.update(employeeId, {
        fullName: data.fullName,
        email: data.email,
        role: data.role as EmployeeRole,
      }),
    onSuccess: () => {
      toast.success("Account updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      router.push("/admin/accounts");
    },
    onError: () => {
      toast.error("Failed to update account");
    },
  });

  if (isLoading) {
    return <div className="container mx-auto p-6">{UI_TEXT.ADMIN.LOADING}</div>;
  }

  if (!employee?.data) {
    return <div className="container mx-auto p-6">{UI_TEXT.ADMIN.ACCOUNT_NOT_FOUND}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/accounts")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{UI_TEXT.ADMIN.EDIT_ACCOUNT}</h1>
      </div>

      <AccountForm
        employee={employee.data}
        onSuccess={() => router.push("/admin/accounts")}
        onSubmit={(data) => updateMutation.mutate(data)}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
