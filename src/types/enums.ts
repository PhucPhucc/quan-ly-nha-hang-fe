export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

// Các Enum liên quan đến Order
export enum OrderType {
  DineIn = "DineIn",
  Takeaway = "Takeaway",
  Delivery = "Delivery",
}

export enum OrderStatus {
  Pending = "Pending",
  Serving = "Serving",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Paid = "Paid",
  Closed = "Closed",
  Merged = "Merged",
  Ready = "Ready",
  Reserved = "Reserved",
  OutOfService = "OutOfService",
}

export enum OrderItemStatus {
  Preparing = "Preparing",
  Cooking = "Cooking",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Rejected = "Rejected",
}

export enum ActionType {
  CREATE = "CREATE",
  ADD_ITEM = "ADD_ITEM",
  UPDATE_QTY = "UPDATE_QTY",
  SUBMIT = "SUBMIT",
  CANCEL = "CANCEL",
}

export enum Station {
  HOT_KITCHEN = 1,
  COLD_KITCHEN = 2,
  BAR = 3,
}

export enum CategoryType {
  NORMAL = 1,
  SPECIAL_GROUP = 2,
}

export enum OptionType {
  SINGLE_SELECT = 1,
  MULTI_SELECT = 2,
  SCALE = 3,
  FREE_TEXT = 4,
}

export enum TableCell {
  COMBO = 1,
  SET_MORNING = 2,
  SET_LUNCH = 3,
}

export { TableCell as SetMenuType };

export enum KDSStation {
  Kitchen = "Kitchen",
  Bar = "Bar",
  ColdKitchen = "ColdKitchen",
  HotKitchen = "HotKitchen",
}

export enum PaymentMethod {
  Cash = "Cash",
  CreditCard = "CreditCard",
  BankTransfer = "BankTransfer",
}
