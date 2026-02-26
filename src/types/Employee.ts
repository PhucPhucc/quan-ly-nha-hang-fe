// types/employee.ts

export enum EmployeeRole {
  MANAGER = "manager",
  CASHIER = "cashier",
  WAITER = "waiter",
  CHEFBAR = "chefbar",
}

export enum EmployeeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const ROLEMAP: Record<string, string> = {
  manager: "manager",
  cashier: "cashier",
  waiter: "waiter",
  chefbar: "chefbar",
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
