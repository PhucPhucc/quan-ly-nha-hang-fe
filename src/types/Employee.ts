// types/employee.ts

export interface Employee {
  employee_id: string;
  username: string;
  password_hash: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  date_of_birth: string; 
  role: string;
  status: string;
  created_at: string;  
  updated_at: string;
  deleted_at: string | null;
}
