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

  useEffect(() => {
    const fetchData = async () => {
      const respone = await fetch("http://localhost:5133/api/employees");
      const data = await respone.json()
      console.log(data.items);
      setEmployees(data.items);
    };
    fetchData()
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Employee Code</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>DOB</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
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
