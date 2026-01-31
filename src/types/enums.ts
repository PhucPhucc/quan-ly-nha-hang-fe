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

// Các Enum liên quan đến Menu & Bếp
export enum Station {
  HOT_KITCHEN = "HOT_KITCHEN",
  COLD_KITCHEN = "COLD_KITCHEN",
  BAR = "BAR",
}

export enum CategoryType {
  NORMAL = "NORMAL",
  SPECIAL_GROUP = "SPECIAL_GROUP",
}

export enum OptionType {
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  SCALE = "SCALE",
  FREE_TEXT = "FREE_TEXT",
}

export enum SetMenuType {
  COMBO = "COMBO",
  SET_MORNING = "SET_MORNING",
  SET_LUNCH = "SET_LUNCH",
}
