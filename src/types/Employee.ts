// types/employee.ts

export enum EmployeeRole {
  MANAGER = "Manager",
  CASHIER = "Cashier",
  CHEFBAR = "ChefBar",
}

export enum EmployeeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const ROLEMAP: Record<string, string> = {
  manager: "manager",
  cashier: "cashier",
  chefbar: "chefbar",
};

export const normalizeEmployeeRole = (role: EmployeeRole | null): EmployeeRole | null => {
  const value = role?.toLowerCase();

  switch (value) {
    case "manager":
      return EmployeeRole.MANAGER;
    case "cashier":
      return EmployeeRole.CASHIER;
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
  role: EmployeeRole;
  status: EmployeeStatus;
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
