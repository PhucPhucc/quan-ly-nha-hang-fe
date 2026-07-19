"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import TableSkeleton from "@/components/shared/TableSkeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { Employee, EmployeeRole, EmployeeStatus, normalizeEmployeeRole } from "@/types/Employee";

interface AccountTableProps {
  employees: Employee[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const AccountTable = ({ employees, isLoading, onDelete }: AccountTableProps) => {
  const router = useRouter();

  const getRoleLabel = (role: EmployeeRole) => {
    const normalized = normalizeEmployeeRole(role);
    if (normalized === EmployeeRole.ADMIN) return "Admin";
    if (normalized === EmployeeRole.MANAGER) return UI_TEXT.ROLE.MANAGER;
    if (normalized === EmployeeRole.CASHIER) return UI_TEXT.ROLE.CASHIER;
    if (normalized === EmployeeRole.CHEFBAR) return UI_TEXT.ROLE.CHEF;
    return role || UI_TEXT.COMMON.NULL;
  };

  const isRoleActive = (role: EmployeeRole) => {
    const normalized = normalizeEmployeeRole(role);
    return (
      normalized === EmployeeRole.ADMIN ||
      normalized === EmployeeRole.MANAGER ||
      normalized === EmployeeRole.CHEFBAR
    );
  };

  const getStatusLabel = (status: EmployeeStatus) => {
    const s = status.toLowerCase();
    return s === EmployeeStatus.ACTIVE ? UI_TEXT.EMPLOYEE.ACTIVE : UI_TEXT.EMPLOYEE.INACTIVE;
  };

  const isStatusActive = (status: EmployeeStatus) => {
    const s = status.toLowerCase();
    return s === EmployeeStatus.ACTIVE;
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <TableShell className="mt-4">
      <Table>
        <TableHeader>
          <TableRow variant="header">
            <TableHead className="text-center">{UI_TEXT.EMPLOYEE.EMP_ID}</TableHead>
            <TableHead>{UI_TEXT.EMPLOYEE.EMPLOYEE_TITLE}</TableHead>
            <TableHead>{UI_TEXT.EMPLOYEE.CONTACT}</TableHead>
            <TableHead>{UI_TEXT.EMPLOYEE.ROLE}</TableHead>
            <TableHead>{UI_TEXT.EMPLOYEE.STATUS}</TableHead>
            <TableHead className="text-right">{UI_TEXT.COMMON.ACTION}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="table-feedback">
                  <span className="text-sm font-medium text-table-text-muted">
                    {UI_TEXT.EMPLOYEE.NOT_FOUND}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {employees.map((employee) => (
            <TableRow key={employee.employeeId} className="group">
              <TableCell className="table-cell-muted text-center text-xs font-medium">
                {employee.employeeCode}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold leading-tight text-table-text-strong">
                    {employee.fullName}
                  </span>
                  <span className="text-xs text-table-text-muted">{employee.email}</span>
                </div>
              </TableCell>
              <TableCell className="hidden text-sm font-medium lg:table-cell">
                {employee.phone || UI_TEXT.COMMON.MINUS}
              </TableCell>

              <TableCell>
                <span
                  className={`table-pill border-0 ${
                    isRoleActive(employee.role) ? "table-pill-primary" : "table-pill-neutral"
                  }`}
                >
                  {getRoleLabel(employee.role)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`table-status-dot ${
                      isStatusActive(employee.status)
                        ? "table-status-dot-active"
                        : "table-status-dot-muted"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isStatusActive(employee.status)
                        ? "table-status-text-active"
                        : "table-status-text-muted"
                    }`}
                  >
                    {getStatusLabel(employee.status)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/accounts/${employee.employeeId}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this account?")) {
                        onDelete(employee.employeeId);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableShell>
  );
};

export default AccountTable;
