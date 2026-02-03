"use client";

import { PenBox } from "lucide-react";
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
import { Employee } from "@/types/Employee";

const EmployeeTable = ({ onEdit }: { onEdit: (employee: Employee) => void }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshCount = useEmployeeStore((state) => state.refreshCount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getEmployees();

        const employeeList = data.items.map((emp: Employee) => ({
          ...emp,
          dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth) : null,
          createdAt: new Date(emp.createdAt),
          updatedAt: emp.updatedAt ? new Date(emp.updatedAt) : null,
        }));
        setEmployees(employeeList);
        console.log(employeeList);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCount]);

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
          <TableHead className="text-center">{UI_TEXT.COMMON.ACTION}</TableHead>
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
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    onEdit(employee);
                  }}
                >
                  <PenBox />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
