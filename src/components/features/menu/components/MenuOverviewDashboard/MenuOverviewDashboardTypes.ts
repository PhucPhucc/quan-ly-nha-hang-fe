import { Station } from "@/types/enums";
import { Category, MenuItem, OptionGroup, SetMenu } from "@/types/Menu";

export type MenuOverviewData = {
  menuItems: MenuItem[];
  setMenus: SetMenu[];
  categories: Category[];
  optionGroups: OptionGroup[];
};

export type CatalogEntry = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  isOutOfStock: boolean;
  imageUrl?: string;
  categoryName?: string;
  station?: Station;
  expectedTime?: number;
  type: "item" | "combo";
};

export type CategorySummary = {
  name: string;
  count: number;
  share: number;
};

export type StationSummary = {
  key: string;
  label: string;
  count: number;
  averageTime: number;
};

export type PriorityEntry = {
  id: string;
  name: string;
  type: "item" | "combo";
  reasons: string[];
};

export type ChecklistData = {
  entriesWithImage: number;
  entriesWithCost: number;
  groupsInUse: number;
  totalGroups: number;
};
export { OptionGroup };
