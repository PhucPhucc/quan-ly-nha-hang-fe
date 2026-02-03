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
  role: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
