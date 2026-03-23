export interface BillingHistoryRecord {
  orderId: string;
  orderCode: string;
  orderType: string;
  status: string;
  tableId?: string;
  subTotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  paymentMethod?: string;
  amountPaid?: number;
  paidAt?: string;
  createdAt: string;
}

export interface PreCheckBillItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  optionsSummary?: string | null;
  lineTotal: number;
}

export interface PreCheckBill {
  orderId: string;
  orderCode: string;
  tableNumber?: number | null;
  reservationId?: string | null;
  employeeName: string;
  customerName?: string | null;
  customerPhone?: string | null;
  printedAt: string;
  items: PreCheckBillItem[];
  subTotal: number;
  preTaxAmount: number;
  discount: number;
  vatRate: number;
  vat: number;
  totalAmount: number;
}
