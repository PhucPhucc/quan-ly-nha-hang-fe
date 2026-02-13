import { Employee, EmployeeRole, EmployeeStatus } from "../types/Employee";

const NOW = new Date().toISOString();

export const MOCK_EMPLOYEES: Employee[] = [
  {
    employeeId: "EMP_001",
    employeeCode: "MANAGER01",
    username: "admin",
    fullName: "Nguyễn Văn Quản Lý",
    email: "manager@foodhub.com",
    phone: "0901234567",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    role: EmployeeRole.MANAGER,
    status: EmployeeStatus.ACTIVE,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
  {
    employeeId: "EMP_002",
    employeeCode: "CASHIER01",
    username: "cashier1",
    fullName: "Lê Thị Thu Ngân",
    email: "cashier1@foodhub.com",
    phone: "0907654321",
    role: EmployeeRole.CASHIER,
    status: EmployeeStatus.ACTIVE,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
  {
    employeeId: "EMP_003",
    employeeCode: "WAITER01",
    username: "waiter1",
    fullName: "Trần Văn Phục Vụ",
    email: "waiter1@foodhub.com",
    phone: "0388888888",
    role: EmployeeRole.WAITER,
    status: EmployeeStatus.ACTIVE,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
];
