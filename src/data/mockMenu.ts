import { CategoryType, OptionType, Station } from "../types/enums";
import { Category, MenuItem, OptionGroup, OptionItem } from "../types/Menu";

const NOW = new Date().toISOString();

// 1. Danh mục
export const MOCK_CATEGORIES: Category[] = [
  {
    categoryId: "CAT_01",
    name: "Cà Phê Việt Nam",
    type: CategoryType.NORMAL,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    categoryId: "CAT_02",
    name: "Trà Trái Cây",
    type: CategoryType.NORMAL,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

// 2. Món ăn
export const MOCK_MENU_ITEMS: MenuItem[] = [
  // Món 1: Cà phê muối (Có option đường đá)
  {
    menuItemId: "ITEM_CF_MUOI",
    code: "CF01",
    name: "Cà Phê Muối Huế",
    imageUrl: "https://placehold.co/200x200?text=Ca+Phe+Muoi",
    description: "Vị mặn béo của kem muối hòa quyện cà phê đậm đà",
    categoryId: "CAT_01",
    categoryName: "Cà Phê Việt Nam",
    priceDineIn: 29000,
    priceTakeAway: 29000,
    cost: 10000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },
  // Món 2: Trà Lài Vải (Có option Topping)
  {
    menuItemId: "ITEM_TRA_VAI",
    code: "TEA01",
    name: "Trà Lài Vải Tươi",
    imageUrl: "https://placehold.co/200x200?text=Tra+Vai",
    description: "Trà lài thơm ngát kết hợp vải ngâm giòn ngọt",
    categoryId: "CAT_02",
    categoryName: "Trà Trái Cây",
    priceDineIn: 35000,
    priceTakeAway: 35000,
    cost: 12000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },
  // Món 3: Bạc Xỉu
  {
    menuItemId: "ITEM_BAC_XIU",
    code: "CF02",
    name: "Bạc Xỉu",
    imageUrl: "https://placehold.co/200x200?text=Bac+Xiu",
    description: "Sữa đặc hòa quyện cà phê đậm vị",
    categoryId: "CAT_01",
    categoryName: "Cà Phê Việt Nam",
    priceDineIn: 25000,
    priceTakeAway: 25000,
    cost: 9000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // Món 4: Cà phê sữa đá
  {
    menuItemId: "ITEM_CF_SUA_DA",
    code: "CF03",
    name: "Cà Phê Sữa Đá",
    imageUrl: "https://placehold.co/200x200?text=Ca+Phe+Sua+Da",
    description: "Cà phê phin truyền thống với sữa đặc",
    categoryId: "CAT_01",
    categoryName: "Cà Phê Việt Nam",
    priceDineIn: 23000,
    priceTakeAway: 23000,
    cost: 8000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // Món 5: Trà đào cam sả
  {
    menuItemId: "ITEM_TRA_DAO",
    code: "TEA02",
    name: "Trà Đào Cam Sả",
    imageUrl: "https://placehold.co/200x200?text=Tra+Dao+Cam+Sa",
    description: "Trà đào kết hợp cam tươi và sả thơm",
    categoryId: "CAT_02",
    categoryName: "Trà Trái Cây",
    priceDineIn: 38000,
    priceTakeAway: 38000,
    cost: 14000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // Món 6: Trà sữa trân châu
  {
    menuItemId: "ITEM_TRA_SUA",
    code: "MILK01",
    name: "Trà Sữa Trân Châu",
    imageUrl: "https://placehold.co/200x200?text=Tra+Sua",
    description: "Trà sữa béo ngậy kèm trân châu đen",
    categoryId: "CAT_02",
    categoryName: "Trà Trái Cây",
    priceDineIn: 40000,
    priceTakeAway: 40000,
    cost: 15000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // Món 7: Matcha Latte
  {
    menuItemId: "ITEM_MATCHA",
    code: "MT01",
    name: "Matcha Latte",
    imageUrl: "https://placehold.co/200x200?text=Matcha+Latte",
    description: "Matcha Nhật Bản hòa sữa tươi",
    categoryId: "CAT_01",
    categoryName: "Cà Phê Việt Nam",
    priceDineIn: 42000,
    priceTakeAway: 42000,
    cost: 16000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },

  // Món 8: Chocolate đá xay
  {
    menuItemId: "ITEM_CHOCOLATE_FROZEN",
    code: "FR01",
    name: "Chocolate Đá Xay",
    imageUrl: "https://placehold.co/200x200?text=Chocolate",
    description: "Chocolate nguyên chất xay lạnh mát",
    categoryId: "CAT_01",
    categoryName: "Cà Phê Việt Nam",
    priceDineIn: 45000,
    priceTakeAway: 45000,
    cost: 18000,
    station: Station.BAR,
    isOutOfStock: false,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

// 3. Nhóm Option (Gắn vào món)
export const MOCK_OPTION_GROUPS: OptionGroup[] = [
  // Group Sugar cho Cà phê muối
  {
    optionGroupId: "GRP_SUGAR",
    menuItemId: "ITEM_CF_MUOI",
    name: "Mức đường",
    optionType: OptionType.SINGLE_SELECT,
    isRequired: true,
    minSelect: 1,
    maxSelect: 1,
    sortOrder: 1,
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
  // Group Topping cho Trà vải
  {
    optionGroupId: "GRP_TOPPING",
    menuItemId: "ITEM_TRA_VAI",
    name: "Topping thêm",
    optionType: OptionType.MULTI_SELECT,
    isRequired: false,
    minSelect: 0,
    maxSelect: 3,
    sortOrder: 1,
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
];

// 4. Chi tiết Option
export const MOCK_OPTION_ITEMS: OptionItem[] = [
  // Option cho group Sugar
  {
    optionItemId: "OPT_SUGAR_100",
    optionGroupId: "GRP_SUGAR",
    label: "100% Đường",
    value: "100",
    extraPrice: 0,
    sortOrder: 1,
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
  {
    optionItemId: "OPT_SUGAR_50",
    optionGroupId: "GRP_SUGAR",
    label: "50% Đường",
    value: "50",
    extraPrice: 0,
    sortOrder: 2,
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
  // Option cho group Topping
  {
    optionItemId: "OPT_TOPPING_TRAN_CHAU",
    optionGroupId: "GRP_TOPPING",
    label: "Trân châu trắng",
    value: "pearl_white",
    extraPrice: 5000,
    sortOrder: 1,
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
  {
    optionItemId: "OPT_TOPPING_THACH_VAI",
    optionGroupId: "GRP_TOPPING",
    label: "Thạch vải",
    value: "jelly_lychee",
    extraPrice: 7000,
    sortOrder: 2,
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
    deletedAt: null,
  },
];

// Dữ liệu bàn giả lập (Cho bước chọn bàn)
export const MOCK_TABLES = [
  { id: "TABLE_01", name: "Bàn 01", zone: "Tầng 1" },
  { id: "TABLE_02", name: "Bàn 02", zone: "Tầng 1" },
  { id: "TABLE_VIP", name: "Phòng VIP", zone: "Tầng 2" },
];
