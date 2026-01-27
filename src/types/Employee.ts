// types/employee.ts

export interface Employee {
  employeeId: string;
  employeeCode: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string; 
  role: string;
  status: string;
  created_at: string;  
  updated_at: string;
  deleted_at: string | null;
}
