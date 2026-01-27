"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StaffTable = ({ employees }: { employees: Employee[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className=''>ID</TableHead>
          <TableHead>Name</TableHead>
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
          <TableRow key={employee.employee_id}>
            <TableCell>{employee.employee_id}</TableCell>
            <TableCell>{employee.username}</TableCell>
            <TableCell>{employee.full_name}</TableCell>
            <TableCell>{employee.phone}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{employee.address}</TableCell>
            <TableCell>{employee.date_of_birth}</TableCell>
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

export default StaffTable;

import { Employee } from "@/types/Employee";
import { Button } from "@/components/ui/button";
import { PenBox, Trash2 } from "lucide-react";
