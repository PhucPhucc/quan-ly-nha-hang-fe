"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import AccountDialog from "@/components/features/Admin/Accounts/AccountDialog";
import AccountTable from "@/components/features/Admin/Accounts/AccountTable";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { employeeService } from "@/services/employeeService";

export default function AccountsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => employeeService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => {
      toast.success("Account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{UI_TEXT.ADMIN.ACCOUNT_MANAGEMENT}</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {UI_TEXT.ADMIN.CREATE_ACCOUNT}
        </Button>
      </div>

      <AccountTable
        employees={employees?.data?.items ?? []}
        isLoading={isLoading}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <AccountDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
