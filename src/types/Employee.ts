// types/employee.ts

export interface Employee {
  employeeId: string;
  employeeCode: string;
  username?: string;
  fullName: string;
  phone?: string;
  email: string;
  address?: string;
  dateOfBirth?: string;
  role: string | number;
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
