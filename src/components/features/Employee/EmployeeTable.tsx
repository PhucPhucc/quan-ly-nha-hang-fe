"use client";

import { useEffect, useState } from "react";

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
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { getEmployees } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";

import EmployeeAction from "./EmployeeAction";

const EmployeeTable = () => {
  const setEmployees = useEmployeeStore((state) => state.setEmployees);
  const employees = useEmployeeStore((state) => state.employees);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshCount = useEmployeeStore((state) => state.refreshCount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getEmployees();
        if (res.isSuccess && res.data) {
          setEmployees(res.data.items || []);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshCount, setEmployees]);

  const getRoleLabel = (role: string | number) => {
    const r = String(role).toLowerCase();
    if (r === "1" || r === "manager") return UI_TEXT.ROLE.MANAGER;
    if (r === "2" || r === "cashier") return UI_TEXT.ROLE.CASHIER;
    if (r === "3" || r === "chef" || r === "chefbar") return UI_TEXT.ROLE.CHEF;
    return role || UI_TEXT.COMMON.NULL;
  };

  const isRoleActive = (role: string | number) => {
    const r = String(role).toLowerCase();
    return r === "1" || r === "manager" || r === "3" || r === "chef" || r === "chefbar";
  };

  const getStatusLabel = (status: string | number) => {
    const s = String(status).toLowerCase();
    return s === "1" || s === "active" ? UI_TEXT.EMPLOYEE.ACTIVE : UI_TEXT.EMPLOYEE.INACTIVE;
  };

  const isStatusActive = (status: string | number) => {
    const s = String(status).toLowerCase();
    return s === "1" || s === "active";
  };

  if (loading) {
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
  );
};

export default EmployeeTable;
