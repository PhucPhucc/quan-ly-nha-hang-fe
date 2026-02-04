"use client";

import { PenBox, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { deleteEmployee, getEmployees } from "@/services/employeeService";
import { useEmployeeStore } from "@/store/useEmployeeStore";
import { Employee } from "@/types/Employee";

const EmployeeTable = ({ onEdit }: { onEdit: (employee: Employee) => void }) => {
  const setEmployees = useEmployeeStore((state) => state.setEmployees);
  const employees = useEmployeeStore((state) => state.employees);
  const increment = useEmployeeStore((state) => state.increment);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refreshCount = useEmployeeStore((state) => state.refreshCount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { employees } = await getEmployees();

        setEmployees(employees);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshCount, setEmployees]);

  const handleDelete = (employeeId: string, employeeName: string) => {
    console.log(employeeId);
    toast.info(UI_TEXT.EMPLOYEE.DELETE_CONFIRM_NAME(employeeName), {
      classNames: {
        actionButton: "!bg-primary !text-primary-foreground !hover:bg-primary-hover",
      },
      cancel: { label: UI_TEXT.COMMON.CANCEL, onClick: () => {} },

      action: {
        label: UI_TEXT.COMMON.CONFIRM,
        onClick: () => actionConfirmDelete(employeeId),
      },
    });
  };
  const actionConfirmDelete = async (employeeId: string) => {
    try {
      setLoading(true);
      await deleteEmployee(employeeId);
      increment();
      toast.success(UI_TEXT.EMPLOYEE.DELETE_SUSCESS);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
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
                <div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="hover:bg-secondary-foreground/20"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      onEdit(employee);
                    }}
                  >
                    <PenBox />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="ml-2 hover:bg-secondary-foreground/20"
                    onClick={() => handleDelete(employee.employeeId, employee.fullName)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
