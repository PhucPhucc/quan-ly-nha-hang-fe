import AddStaff from "@/components/feutures/staff/AddStaff";
import StaffTable from "@/components/feutures/staff/StaffTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/types/Employee";

import React from "react";

const page = () => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Staff (3)</p>
        <div className='flex gap-2'>
          <AddStaff />
          <Select>
            <SelectTrigger className='w-28'>
              <SelectValue placeholder='Sort By' />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='light'>Name</SelectItem>
              <SelectItem value='dark'>Manager</SelectItem>
              <SelectItem value='cashier'>Cashier</SelectItem>
              <SelectItem value='waiter'>Waiter</SelectItem>
              <SelectItem value='chef'>Chef</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='mt-12'>
        <StaffTable employees={employees} />
      </div>
    </div>
  );
};

export default page;

export const employees: Employee[] = [
  {
    employee_id: "EMP001",
    username: "phucnguyen",
    password_hash: "$2b$10$abcd1234hashedpassword",
    full_name: "Nguyễn Văn Phúc",
    phone: "0987654321",
    email: "phuc.nguyen@example.com",
    address: "Quận 1, TP. Hồ Chí Minh",
    date_of_birth: "2003-05-12",
    role: "admin",
    status: "active",
    created_at: "2024-01-15T09:30:00",
    updated_at: "2025-01-20T14:10:00",
    deleted_at: null,
  },
  {
    employee_id: "EMP002",
    username: "minhtran",
    password_hash: "$2b$10$xyz5678hashedpassword",
    full_name: "Trần Minh",
    phone: "0912345678",
    email: "minh.tran@example.com",
    address: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    date_of_birth: "2001-09-25",
    role: "staff",
    status: "active",
    created_at: "2024-03-10T08:15:00",
    updated_at: "2025-01-18T11:45:00",
    deleted_at: null,
  },
  {
    employee_id: "EMP003",
    username: "lanpham",
    password_hash: "$2b$10$qwe9999hashedpassword",
    full_name: "Phạm Thị Lan",
    phone: "0909988776",
    email: "lan.pham@example.com",
    address: "Quận Hải Châu, Đà Nẵng",
    date_of_birth: "2000-12-02",
    role: "manager",
    status: "inactive",
    created_at: "2023-11-05T10:00:00",
    updated_at: "2024-12-30T16:20:00",
    deleted_at: null,
  },
];
