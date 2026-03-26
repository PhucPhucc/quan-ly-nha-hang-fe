import { PaginationResult } from "./Api";

export interface ShiftAssignment {
  shiftAssignmentId: string;
  employeeId: string;
  shiftId: string;
  shift: {
    shiftId: string;
    name: string;
    startTime: string;
    endTime: string;
    status: string;
  };
  assignedDate: string; // ISO date "YYYY-MM-DD"
  note: string;
}

export interface ShiftAssignmentSummary {
  totalEmployees: number;
  estimatedHours: number;
  estimatedCost: number;
  coveragePercentage: number;
}

export interface CreateShiftAssignmentRequest {
  employeeId: string;
  shiftId: string;
  assignedDate: string;
  note?: string;
}

export interface UpdateShiftAssignmentRequest {
  shiftAssignmentId: string;
  shiftId: string;
  assignedDate: string;
  note?: string;
}

export interface AutoAssignShiftRequest {
  employeeId: string;
  shiftId: string;
  fromDate: string;
  toDate: string;
  note?: string;
}

export type ShiftAssignmentPaginationResult = PaginationResult<ShiftAssignment>;
