"use client";

import { useEffect } from "react";

import PaginationTable from "@/components/shared/PaginationTable";
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
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { EmployeeRole, EmployeeStatus } from "@/types/Employee";

import EmployeeAction from "./EmployeeAction";

const EmployeeTable = () => {
  const employees = useEmployeeStore((state) => state.employees);
  const loading = useEmployeeStore((state) => state.loading);
  const error = useEmployeeStore((state) => state.error);
  const pagination = useEmployeeStore((state) => state.pagination);
  const setPage = useEmployeeStore((state) => state.setPage);
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const setPageSize = useEmployeeStore((state) => state.setPageSize);

  useEffect(() => {
    setPageSize(8);
    fetchEmployees();
  }, [fetchEmployees, setPageSize]);

  const getRoleLabel = (role: EmployeeRole) => {
    if (role === EmployeeRole.MANAGER) return UI_TEXT.ROLE.MANAGER;
    if (role === EmployeeRole.CASHIER) return UI_TEXT.ROLE.CASHIER;
    if (role === EmployeeRole.CHEFBAR) return UI_TEXT.ROLE.CHEF;
    return role || UI_TEXT.COMMON.NULL;
  };

  const isRoleActive = (role: EmployeeRole) => {
    return role === EmployeeRole.MANAGER || role === EmployeeRole.CHEFBAR;
  };

  const getStatusLabel = (status: EmployeeStatus) => {
    const s = status.toLowerCase();
    return s === EmployeeStatus.ACTIVE ? UI_TEXT.EMPLOYEE.ACTIVE : UI_TEXT.EMPLOYEE.INACTIVE;
  };

  const isStatusActive = (status: EmployeeStatus) => {
    const s = status.toLowerCase();
    return s === EmployeeStatus.ACTIVE;
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <TableShell className="mt-4">
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead className="text-center">{UI_TEXT.EMPLOYEE.EMP_ID}</TableHead>
              <TableHead>{UI_TEXT.EMPLOYEE.EMPLOYEE_TITLE}</TableHead>
              <TableHead>{UI_TEXT.EMPLOYEE.CONTACT}</TableHead>
              <TableHead>{UI_TEXT.EMPLOYEE.ADDRESS}</TableHead>
              <TableHead>{UI_TEXT.EMPLOYEE.ROLE}</TableHead>
              <TableHead>{UI_TEXT.EMPLOYEE.STATUS}</TableHead>
              <TableHead className="text-right">{UI_TEXT.COMMON.ACTION}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {error && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="table-feedback text-danger">
                    <span className="text-base font-semibold">{error}</span>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="mt-1"
                    >
                      {UI_TEXT.EMPLOYEE.RETRY}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error && employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="table-feedback">
                    <span className="text-sm font-medium text-table-text-muted">
                      {UI_TEXT.EMPLOYEE.NOT_FOUND}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!error &&
              employees.map((employee) => (
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
                  <TableCell className="hidden max-w-55 truncate text-xs xl:table-cell">
                    {employee.address || UI_TEXT.COMMON.MINUS}
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
                    <div className="flex justify-end opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                      <EmployeeAction employee={employee} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableShell>
      {pagination.totalPages > 1 && (
        <PaginationTable
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
