import { OrderItemStatus, OrderStatus, OrderType } from "./enums";

export interface OrderItemOptionValue {
  orderItemOptionValueId: string;
  orderItemOptionGroupId: string;
  labelSnapshot: string;
  extraPriceSnapshot: number;
  quantity: number;
  note?: string;
}

export interface OrderItemOptionGroup {
  orderItemOptionGroupId: string;
  orderItemId: string;
  groupNameSnapshot: string;
  groupTypeSnapshot: string;
  isRequiredSnapshot: boolean;
  optionValues: OrderItemOptionValue[];
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  menuItemId: string;

  itemCodeSnapshot: string;
  itemNameSnapshot: string;
  stationSnapshot: string;

  status: OrderItemStatus;
  quantity: number;
  unitPriceSnapshot: number;
  itemNote?: string;
  itemOptions?: string;

  createdAt: string;
  updatedAt?: string;
  canceledAt?: string;
  cancelledAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  optionGroups?: OrderItemOptionGroup[];
}

export interface Order {
  orderId: string;
  orderCode: string;
  orderType: OrderType;
  status: OrderStatus;
  tableId?: string;
  reservationId?: string;

  note?: string;
  subTotal?: number;
  vatRate?: number;
  vatAmount?: number;
  totalAmount: number;
  discountAmount?: number;
  discount?: number;
  voucherCode?: string;
  appliedVoucherCode?: string;
  voucher?: {
    voucherCode?: string;
    discountAmount?: number;
  };
  isPriority: boolean;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  paymentMethod?: string;
  amountPaid?: number;
  paidAt?: string;
  orderItems: OrderItem[];
}

export interface OrderDashboardStatusBreakdownItem {
  status: string;
  count: number;
}

export interface OrderDashboardTopOrderItem {
  orderId: string;
  orderCode: string;
  orderType: string;
  status: string;
  tableId?: string;
  tableLabel?: string | null;
  totalAmount: number;
  isPriority: boolean;
  itemCount: number;
  finishedItemCount: number;
  createdAt: string;
}

export interface OrderDashboardOverview {
  generatedAtUtc: string;
  activeOrders: number;
  priorityOrders: number;
  dineInOrders: number;
  takeawayOrders: number;
  deliveryOrders: number;
  occupiedTables: number;
  availableTables: number;
  pendingKitchenItems: number;
  cookingItems: number;
  completedItems: number;
  waitingCheckoutOrders: number;
  todayPaidOrders: number;
  todayRevenue: number;
  statusBreakdown: OrderDashboardStatusBreakdownItem[];
  topActiveOrders: OrderDashboardTopOrderItem[];
}

export const DINE_IN_STATUSES = [
  { value: "ready", label: "Bàn trống", color: "bg-table-empty" },
  { value: "serving", label: "Đang sử dụng", color: "bg-table-serving" },
  { value: "reserved", label: "Đặt trước", color: "bg-table-reserved" },
  { value: "out_of_service", label: "Tạm ngưng", color: "bg-table-out-of-service" },
];

export const TAKEAWAY_STATUSES = [
  { value: "tk_serving", label: "Đang nấu", color: "bg-orange-500" },
  { value: "tk_ready", label: "Sẵn sàng", color: "bg-emerald-500" },
];
