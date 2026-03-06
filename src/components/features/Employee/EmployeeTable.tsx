"use client";

import { useEffect, useState } from "react";

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
    return role || "N/A";
  };

  const isRoleActive = (role: string | number) => {
    const r = String(role).toLowerCase();
    return r === "1" || r === "manager" || r === "4" || r === "chef" || r === "chefbar";
  };

  const getStatusLabel = (status: string | number) => {
    const s = String(status).toLowerCase();
    return s === "1" || s === "active" ? "Đang kích hoạt" : "Không kích hoạt";
  };

  const isStatusActive = (status: string | number) => {
    const s = String(status).toLowerCase();
    return s === "1" || s === "active";
  };

  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/50">
            <TableHead className="w-[100px] py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider pl-6">
              Mã NV
            </TableHead>
            <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
              Nhân viên
            </TableHead>
            <TableHead className="hidden lg:table-cell py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
              Liên hệ
            </TableHead>
            <TableHead className="hidden xl:table-cell py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
              Địa chỉ
            </TableHead>
            <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
              Vai trò
            </TableHead>
            <TableHead className="py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider">
              Trạng thái
            </TableHead>
            <TableHead className="text-right py-4 font-semibold text-slate-800 uppercase text-[11px] tracking-wider pr-6">
              {UI_TEXT.COMMON.ACTION}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="size-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                    {UI_TEXT.COMMON.LOADING}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}

          {error && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20">
                <div className="flex flex-col items-center gap-2 text-danger">
                  <span className="font-semibold">{error}</span>
                  <Button
                    onClick={() => window.location.reload()}
                    className="text-xs underline opacity-70 hover:opacity-100"
                  >
                    Thử lại
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!loading && !error && employees.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20">
                <span className="text-sm text-slate-400 font-medium tracking-wide">
                  Không tìm thấy nhân viên nào
                </span>
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            !error &&
            employees.map((employee) => (
              <TableRow
                key={employee.employeeId}
                className="group border-slate-50 transition-all duration-200 hover:bg-slate-50/80"
              >
                <TableCell className="pl-6 font-medium text-slate-500 text-xs">
                  {employee.employeeCode}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 text-sm leading-tight">
                      {employee.fullName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{employee.email}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell font-medium text-slate-600 text-[13px]">
                  {employee.phone || "-"}
                </TableCell>
                <TableCell className="hidden xl:table-cell text-slate-500 text-[12px] max-w-[220px] truncate font-medium">
                  {employee.address || "-"}
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      isRoleActive(employee.role)
                        ? "bg-primary/10 text-primary border border-primary/10"
                        : "bg-slate-100 text-slate-500 border border-slate-200/50"
                    }`}
                  >
                    {getRoleLabel(employee.role)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-1.5 rounded-full ${
                        isStatusActive(employee.status)
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          : "bg-slate-300"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-medium tracking-tight ${
                        isStatusActive(employee.status) ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {getStatusLabel(employee.status)}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right pr-6">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
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
