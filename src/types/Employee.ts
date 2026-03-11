// types/employee.ts

export enum EmployeeRole {
  MANAGER = "Manager",
  CASHIER = "Cashier",
  WAITER = "Waiter",
  CHEFBAR = "ChefBar",
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

export const normalizeEmployeeRole = (role?: string): EmployeeRole | null => {
  const value = role?.toLowerCase();

  switch (value) {
    case "manager":
      return EmployeeRole.MANAGER;
    case "cashier":
      return EmployeeRole.CASHIER;
    case "waiter":
      return EmployeeRole.WAITER;
    case "chefbar":
    case "chef":
      return EmployeeRole.CHEFBAR;
    default:
      return null;
  }
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
