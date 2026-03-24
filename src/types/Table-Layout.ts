export enum TableStatus {
  Available = 1,
  Occupied = 2,
  Reserved = 3,
  OutOfService = 4,
}

export enum AreaStatus {
  Inactive = "Inactive",
  Active = "Active",
}

export enum AreaType {
  Normal = "Normal",
  VIP = "VIP",
}

export interface Table {
  tableId: string;
  tableCode: string;
  tableNumber: number;
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
  description?: string;
  status: AreaStatus; // Active | Inactive
  type: AreaType;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  numberOfTables?: number;
}
