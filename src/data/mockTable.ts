import { Area, AreaStatus, Table, TableStatus } from "../types/Table-Layout";

export const mockAreas: Area[] = [
  { areaId: "1", name: "Tầng 1", codePrefix: "T1", status: AreaStatus.ACTIVE },
  { areaId: "2", name: "Tầng 2", codePrefix: "T2", status: AreaStatus.ACTIVE },
  { areaId: "3", name: "Khu VIP", codePrefix: "VIP", status: AreaStatus.ACTIVE },
];

export const mockTables: Table[] = [
  { tableId: "1", tableCode: "T1-01", capacity: 4, status: TableStatus.OCCUPIED, areaId: "1" },
  { tableId: "2", tableCode: "T1-02", capacity: 4, status: TableStatus.AVAILABLE, areaId: "1" },
  { tableId: "3", tableCode: "T1-03", capacity: 6, status: TableStatus.OCCUPIED, areaId: "1" },
  { tableId: "4", tableCode: "T1-04", capacity: 2, status: TableStatus.AVAILABLE, areaId: "1" },
  { tableId: "5", tableCode: "T1-05", capacity: 6, status: TableStatus.RESERVED, areaId: "1" },
  { tableId: "6", tableCode: "T1-06", capacity: 4, status: TableStatus.AVAILABLE, areaId: "1" },
  { tableId: "7", tableCode: "T1-07", capacity: 6, status: TableStatus.OCCUPIED, areaId: "1" },
  { tableId: "8", tableCode: "T1-08", capacity: 4, status: TableStatus.CLEANING, areaId: "1" },
  { tableId: "9", tableCode: "T1-09", capacity: 6, status: TableStatus.AVAILABLE, areaId: "1" },
  { tableId: "10", tableCode: "T1-10", capacity: 4, status: TableStatus.AVAILABLE, areaId: "1" },
  { tableId: "11", tableCode: "T1-11", capacity: 2, status: TableStatus.AVAILABLE, areaId: "1" },
  { tableId: "12", tableCode: "T1-12", capacity: 4, status: TableStatus.RESERVED, areaId: "1" },
  {
    tableId: "13",
    tableCode: "T1-13",
    capacity: 6,
    status: TableStatus.OUT_OF_SERVICE,
    areaId: "1",
  },
  // Tầng 2
  { tableId: "14", tableCode: "T2-01", capacity: 4, status: TableStatus.AVAILABLE, areaId: "2" },
  { tableId: "15", tableCode: "T2-02", capacity: 6, status: TableStatus.OCCUPIED, areaId: "2" },
  { tableId: "16", tableCode: "T2-03", capacity: 4, status: TableStatus.AVAILABLE, areaId: "2" },
  // VIP
  { tableId: "17", tableCode: "VIP-01", capacity: 8, status: TableStatus.AVAILABLE, areaId: "3" },
  { tableId: "18", tableCode: "VIP-02", capacity: 6, status: TableStatus.OCCUPIED, areaId: "3" },
];
