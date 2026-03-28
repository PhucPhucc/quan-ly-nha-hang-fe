import { OrderItem } from "@/types/Order";

export interface ComboDisplayMap {
  parentIdByChildId: Map<string, string>;
  childrenByParentId: Map<string, OrderItem[]>;
}
