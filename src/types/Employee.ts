// types/employee.ts

export enum EmployeeRole {
  MANAGER = "manager",
  CASHIER = "cashier",
  WAITER = "waiter",
}

export enum EmployeeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const ROLEMAP = {
  manager: 1,
  cashier: 2,
  waiter: 3,
  chefbar: 4,
};

export interface Employee {
  employeeId: string;
  employeeCode: string;
  username?: string;
  fullName: string;
  phone?: string;
  email: string;
  address?: string;
  dateOfBirth?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EmployeeAuditLog {
  logId: string;
  action: string;
  actorName: string;
  time: string;
  reason?: string;
  metadata?: Record<string, string>;
}
