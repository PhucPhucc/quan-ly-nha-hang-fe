export interface TableResponse {
  tableId: string;
  tableNumber: number;
  capacity: number;
  areaId: string;
}

export interface ReservationRequest {
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  partyType: string;
  guestCount: number;
  note: string;
  areaId: string;
}

export interface AvailableTablesParams {
  reservationDate: string;
  reservationTime: string;
  areaId: string;
  guestCount: number;
}
