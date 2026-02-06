import { CategoryType, OptionType, Station } from "../types/enums";
import { Category, MenuItem, OptionGroup, OptionItem } from "../types/Menu";

const NOW = new Date().toISOString();

// 1. Danh mục
export const MOCK_CATEGORIES: Category[] = [
  {
    category_id: "CAT_01",
    name: "Cà Phê Việt Nam",
    category_type: CategoryType.NORMAL,
    sort_order: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
  {
    category_id: "CAT_02",
    name: "Trà Trái Cây",
    category_type: CategoryType.NORMAL,
    sort_order: 2,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
];

// 2. Món ăn
export const MOCK_MENU_ITEMS: MenuItem[] = [
  // Món 1: Cà phê muối (Có option đường đá)
  {
    menu_item_id: "ITEM_CF_MUOI",
    code: "CF01",
    name: "Cà Phê Muối Huế",
    image_url: "https://placehold.co/200x200?text=Ca+Phe+Muoi",
    description: "Vị mặn béo của kem muối hòa quyện cà phê đậm đà",
    category_id: "CAT_01",
    dine_in_price: 29000,
    take_away_price: 29000,
    cost_price: 10000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
  // Món 2: Trà Lài Vải (Có option Topping)
  {
    menu_item_id: "ITEM_TRA_VAI",
    code: "TEA01",
    name: "Trà Lài Vải Tươi",
    image_url: "https://placehold.co/200x200?text=Tra+Vai",
    description: "Trà lài thơm ngát kết hợp vải ngâm giòn ngọt",
    category_id: "CAT_02",
    dine_in_price: 35000,
    take_away_price: 35000,
    cost_price: 12000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
  // Món 3: Bạc Xỉu
  {
    menu_item_id: "ITEM_BAC_XIU",
    code: "CF02",
    name: "Bạc Xỉu",
    image_url: "https://placehold.co/200x200?text=Bac+Xiu",
    description: "Sữa đặc hòa quyện cà phê đậm vị",
    category_id: "CAT_01",
    dine_in_price: 25000,
    take_away_price: 25000,
    cost_price: 9000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },

  // Món 4: Cà phê sữa đá
  {
    menu_item_id: "ITEM_CF_SUA_DA",
    code: "CF03",
    name: "Cà Phê Sữa Đá",
    image_url: "https://placehold.co/200x200?text=Ca+Phe+Sua+Da",
    description: "Cà phê phin truyền thống với sữa đặc",
    category_id: "CAT_01",
    dine_in_price: 23000,
    take_away_price: 23000,
    cost_price: 8000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },

  // Món 5: Trà đào cam sả
  {
    menu_item_id: "ITEM_TRA_DAO",
    code: "TEA02",
    name: "Trà Đào Cam Sả",
    image_url: "https://placehold.co/200x200?text=Tra+Dao+Cam+Sa",
    description: "Trà đào kết hợp cam tươi và sả thơm",
    category_id: "CAT_02",
    dine_in_price: 38000,
    take_away_price: 38000,
    cost_price: 14000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },

  // Món 6: Trà sữa trân châu
  {
    menu_item_id: "ITEM_TRA_SUA",
    code: "MILK01",
    name: "Trà Sữa Trân Châu",
    image_url: "https://placehold.co/200x200?text=Tra+Sua",
    description: "Trà sữa béo ngậy kèm trân châu đen",
    category_id: "CAT_02",
    dine_in_price: 40000,
    take_away_price: 40000,
    cost_price: 15000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },

  // Món 7: Matcha Latte
  {
    menu_item_id: "ITEM_MATCHA",
    code: "MT01",
    name: "Matcha Latte",
    image_url: "https://placehold.co/200x200?text=Matcha+Latte",
    description: "Matcha Nhật Bản hòa sữa tươi",
    category_id: "CAT_01",
    dine_in_price: 42000,
    take_away_price: 42000,
    cost_price: 16000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },

  // Món 8: Chocolate đá xay
  {
    menu_item_id: "ITEM_CHOCOLATE_FROZEN",
    code: "FR01",
    name: "Chocolate Đá Xay",
    image_url: "https://placehold.co/200x200?text=Chocolate",
    description: "Chocolate nguyên chất xay lạnh mát",
    category_id: "CAT_01",
    dine_in_price: 45000,
    take_away_price: 45000,
    cost_price: 18000,
    station: Station.BAR,
    is_out_of_stock: false,
    created_by_employee_id: "EMP_01",
    updated_by_employee_id: "EMP_01",
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
];

// 3. Nhóm Option (Gắn vào món)
export const MOCK_OPTION_GROUPS: OptionGroup[] = [
  // Group Sugar cho Cà phê muối
  {
    option_group_id: "GRP_SUGAR",
    menu_item_id: "ITEM_CF_MUOI",
    name: "Mức đường",
    option_type: OptionType.SINGLE_SELECT,
    is_required: true,
    min_select: 1,
    max_select: 1,
    sort_order: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
  // Group Topping cho Trà vải
  {
    option_group_id: "GRP_TOPPING",
    menu_item_id: "ITEM_TRA_VAI",
    name: "Topping thêm",
    option_type: OptionType.MULTI_SELECT,
    is_required: false,
    min_select: 0,
    max_select: 3,
    sort_order: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
];

// 4. Chi tiết Option
export const MOCK_OPTION_ITEMS: OptionItem[] = [
  // Option cho group Sugar
  {
    option_item_id: "OPT_SUGAR_100",
    option_group_id: "GRP_SUGAR",
    label: "100% Đường",
    value: "100",
    extra_price: 0,
    sort_order: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
  {
    option_item_id: "OPT_SUGAR_50",
    option_group_id: "GRP_SUGAR",
    label: "50% Đường",
    value: "50",
    extra_price: 0,
    sort_order: 2,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
  // Option cho group Topping
  {
    option_item_id: "OPT_TOPPING_TRAN_CHAU",
    option_group_id: "GRP_TOPPING",
    label: "Trân châu trắng",
    value: "pearl_white",
    extra_price: 5000,
    sort_order: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
  {
    option_item_id: "OPT_TOPPING_THACH_VAI",
    option_group_id: "GRP_TOPPING",
    label: "Thạch vải",
    value: "jelly_lychee",
    extra_price: 7000,
    sort_order: 2,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
  },
];

// Dữ liệu bàn giả lập (Cho bước chọn bàn)
export const MOCK_TABLES = [
  { id: "TABLE_01", name: "Bàn 01", zone: "Tầng 1" },
  { id: "TABLE_02", name: "Bàn 02", zone: "Tầng 1" },
  { id: "TABLE_VIP", name: "Phòng VIP", zone: "Tầng 2" },
];
