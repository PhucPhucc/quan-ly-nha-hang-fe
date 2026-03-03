export enum TableStatus {
  AVAILABLE = 0,
  RESERVED = 1,
  OCCUPIED = 2,
  CLEANING = 3,
  OUT_OF_SERVICE = 4,
}

export enum AreaStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}

export interface Table {
  tableId: string;
  tableCode: string;
  capacity: number;
  status: TableStatus;
  areaId: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

/** Area entity */
export interface Area {
  areaId: string; // uuid — Area_Id
  name: string; // string — VD: "Tầng 1", "Khu VIP"
  codePrefix: string; // string — VD: "T1", "T2", "VIP"
  status: AreaStatus; // Active | Inactive (dùng chung enum)
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
