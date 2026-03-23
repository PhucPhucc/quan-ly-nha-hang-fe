import { MenuItemOptionGroup, OptionItem } from "@/types/Menu";

export const ERROR_MESSAGES = {
  loadOptions: "Không thể tải tùy chọn món ăn",
  selectTable: "Vui lòng chọn bàn trước khi thêm món",
  invalidData: "Không thể thêm món - dữ liệu không hợp lệ",
  addItemError: "Lỗi khi thêm món: ",
  generalError: "Đã có lỗi xảy ra",
} as const;

export type MenuOptionState = {
  optionGroups: MenuItemOptionGroup[];
  loading: boolean;
  quantity: number;
  note: string;
  selectedOptions: Record<string, OptionItem[]>;
};

export type MenuOptionAction =
  | { type: "SET_GROUPS"; payload: MenuItemOptionGroup[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_QUANTITY"; payload: number | ((prev: number) => number) }
  | { type: "SET_NOTE"; payload: string }
  | { type: "SET_OPTIONS"; payload: Record<string, OptionItem[]> }
  | { type: "RESET" };

export const initialMenuOptionState: MenuOptionState = {
  optionGroups: [],
  loading: false,
  quantity: 1,
  note: "",
  selectedOptions: {},
};

export function menuOptionReducer(
  state: MenuOptionState,
  action: MenuOptionAction
): MenuOptionState {
  switch (action.type) {
    case "SET_GROUPS":
      return { ...state, optionGroups: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_QUANTITY":
      const newQuantity =
        typeof action.payload === "function" ? action.payload(state.quantity) : action.payload;
      return { ...state, quantity: newQuantity };
    case "SET_NOTE":
      return { ...state, note: action.payload };
    case "SET_OPTIONS":
      return { ...state, selectedOptions: action.payload };
    case "RESET":
      return initialMenuOptionState;
    default:
      return state;
  }
}
