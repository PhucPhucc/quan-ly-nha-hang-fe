export enum ShiftStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export interface Shift {
  shiftId: string;
  name: string;
  startTime: string; // ISO string or "HH:mm:ss"
  endTime: string;
  status: ShiftStatus | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftRequest {
  name: string;
  startTime: string;
  endTime: string;
}

export interface UpdateShiftRequest {
  shiftId: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface UpdateShiftStatusRequest {
  isActive: boolean;
}
