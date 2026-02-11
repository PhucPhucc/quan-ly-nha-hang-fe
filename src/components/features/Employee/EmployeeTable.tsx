"use logout";

import { useEffect, useState } from "react";

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

        if (res.data) {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.FULLNAME}</TableHead>
          <TableHead className="hidden lg:table-cell">{UI_TEXT.EMPLOYEE.PHONE}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.EMAIL}</TableHead>
          <TableHead className="hidden xl:table-cell">{UI_TEXT.EMPLOYEE.ADDRESS}</TableHead>
          <TableHead className="hidden xl:table-cell">{UI_TEXT.EMPLOYEE.DOB}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.ROLE}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.STATUS}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading && (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              Đang tải...
            </TableCell>
          </TableRow>
        )}

        {error && (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-red-500">
              {error}
            </TableCell>
          </TableRow>
        )}

        {!loading &&
          !error &&
          employees.map((employee) => (
            <TableRow key={employee.employeeId}>
              <TableCell>{employee.employeeCode}</TableCell>
              <TableCell>{employee.fullName}</TableCell>
              <TableCell className="hidden lg:table-cell">{employee.phone}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell className="hidden xl:table-cell">{employee.address}</TableCell>
              <TableCell className="hidden xl:table-cell">
                {employee.dateOfBirth
                  ? new Date(employee.dateOfBirth).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </TableCell>

              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.status}</TableCell>

              <TableCell className="flex justify-center">
                <EmployeeAction employee={employee} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
