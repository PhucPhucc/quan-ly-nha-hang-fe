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
    if (r === "3" || r === "waiter") return UI_TEXT.ROLE.WAITER;
    if (r === "4" || r === "chef" || r === "chefbar") return UI_TEXT.ROLE.CHEF;
    return role || UI_TEXT.COMMON.NULL;
  };

  const isRoleActive = (role: string | number) => {
    const r = String(role).toLowerCase();
    return r === "1" || r === "manager" || r === "4" || r === "chef" || r === "chefbar";
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
    return <TableSkeleton columns={7} rows={6} className="mt-4" />;
  }

  return (
    <div className="fh-table-shell mt-4">
      <Table className="fh-table">
        <TableHeader>
          <TableRow className="fh-table-header-row hover:bg-table-header-bg">
            <TableHead className="fh-table-head">{UI_TEXT.EMPLOYEE.EMP_ID}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.EMPLOYEE.EMPLOYEE_TITLE}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.EMPLOYEE.CONTACT}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.EMPLOYEE.ADDRESS}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.EMPLOYEE.ROLE}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.EMPLOYEE.STATUS}</TableHead>
            <TableHead className="fh-table-head">{UI_TEXT.COMMON.ACTION}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {error && (
            <TableRow className="fh-table-row">
              <TableCell colSpan={7} className="fh-table-cell">
                <div className="fh-table-feedback text-danger">
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
            <TableRow className="fh-table-row">
              <TableCell colSpan={7} className="fh-table-cell">
                <div className="fh-table-feedback">
                  <span className="text-sm font-medium text-table-text-muted">
                    {UI_TEXT.EMPLOYEE.NOT_FOUND}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!error &&
            employees.map((employee) => (
              <TableRow key={employee.employeeId} className="group fh-table-row">
                <TableCell className="fh-table-cell text-xs font-semibold text-table-text-muted">
                  {employee.employeeCode}
                </TableCell>
                <TableCell className="fh-table-cell">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold leading-tight text-table-text-strong">
                      {employee.fullName}
                    </span>
                    <span className="text-xs text-table-text-muted">{employee.email}</span>
                  </div>
                </TableCell>
                <TableCell className="fh-table-cell hidden text-[13px] font-medium lg:table-cell">
                  {employee.phone || UI_TEXT.COMMON.MINUS}
                </TableCell>
                <TableCell className="fh-table-cell hidden max-w-55 truncate text-xs xl:table-cell">
                  {employee.address || UI_TEXT.COMMON.MINUS}
                </TableCell>

                <TableCell className="fh-table-cell">
                  <span
                    className={`fh-table-pill border-0 ${
                      isRoleActive(employee.role)
                        ? "fh-table-pill-primary"
                        : "fh-table-pill-neutral"
                    }`}
                  >
                    {getRoleLabel(employee.role)}
                  </span>
                </TableCell>
                <TableCell className="fh-table-cell">
                  <div className="flex items-center gap-2">
                    <div
                      className={`fh-table-status-dot ${
                        isStatusActive(employee.status)
                          ? "fh-table-status-dot-active"
                          : "fh-table-status-dot-muted"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isStatusActive(employee.status)
                          ? "fh-table-status-text-active"
                          : "fh-table-status-text-muted"
                      }`}
                    >
                      {getStatusLabel(employee.status)}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="fh-table-cell pr-6 text-right">
                  <div className="flex justify-end opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <EmployeeAction employee={employee} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
