import { Employee } from "./Employee";

export interface AttendanceReportItem {
  attendanceId: string;
  date: string;
  employeeName: string;
  shiftName: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: string;
  assignedDate: string;
  isLate: boolean;
  isEarlyLeave: boolean;
}

export interface AttendanceCheckInResponse {
  attendanceId: string;
  employeeId: string;
  shiftAssignmentId: string;
  checkInTime: string;
  isLate: boolean;
  isEarlyLeave: boolean;
  isMissCheckOut: boolean;
  employee: Employee;
}

export interface AttendanceCheckOutResponse {
  attendanceId: string;
  employeeId: string;
  shiftAssignmentId: string;
  checkOutTime: string;
  isLate: boolean;
  isEarlyLeave: boolean;
  isMissCheckOut: boolean;
  employee: Employee;
}
