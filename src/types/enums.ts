export {};
// Các Enum liên quan đến Order
export enum OrderType {
  DINE_IN = "DINE_IN",
  TAKEAWAY = "TAKEAWAY",
}

export enum OrderStatus {
  DRAFT = "DRAFT",
  PREPARING = "PREPARING",
  COOKING = "COOKING",
  READY = "READY",
  COMPLETED = "COMPLETED",
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
