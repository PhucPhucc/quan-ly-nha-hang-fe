// Các Enum liên quan đến Order
export enum OrderType {
  DineIn = 1,
  Takeaway = 2,
}

export enum OrderStatus {
  Serving = "Serving",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Ready = "Ready",
  Reserved = "Reserved",
  Cleaning = "Cleaning",
}

export enum OrderItemStatus {
  Preparing = 1,
  Cooking = 2,
  Ready = 3,
  Completed = 4,
  Cancelled = 5,
  Rejected = 6,
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

export enum SetMenuType {
  COMBO = 1,
  SET_MORNING = 2,
  SET_LUNCH = 3,
}

export enum KDSStation {
  Kitchen = "Kitchen",
  Bar = "Bar",
  ColdKitchen = "ColdKitchen",
  HotKitchen = "HotKitchen",
}
