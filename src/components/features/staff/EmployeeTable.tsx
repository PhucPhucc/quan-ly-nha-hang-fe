"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// { employees }: { employees: Employee[] }
const EmployeeTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data.items);
      } catch (err) {
        console.error(err);
        setError(getErrorMessage(err));
      }
    };

    fetchData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className=''>{UI_TEXT.EMPLOYEE.EMPLOYEECODE}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.FULLNAME}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.PHONE}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.EMAIL}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.ADDRESS}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.DOB}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.ROLE}</TableHead>
          <TableHead>{UI_TEXT.EMPLOYEE.STATUS}</TableHead>
          <TableHead className='text-center'></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {error === "" &&
          employees.map((employee) => (
            <TableRow key={employee.employeeId}>
              <TableCell>{employee.employeeCode}</TableCell>
              <TableCell>{employee.fullName}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.address}</TableCell>
              <TableCell>{employee.dateOfBirth}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.status}</TableCell>
              <TableCell className='flex justify-center gap-2'>
                <Button
                  size='icon'
                  variant='secondary'
                  className='hover:bg-secondary-foreground/20'
                >
                  <PenBox />
                </Button>
                <Button
                  size='icon'
                  variant='secondary'
                  className='hover:bg-secondary-foreground/20'
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;

import { Employee } from "@/types/Employee";
import { Button } from "@/components/ui/button";
import { PenBox, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getEmployees } from "@/services/employeeService";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
