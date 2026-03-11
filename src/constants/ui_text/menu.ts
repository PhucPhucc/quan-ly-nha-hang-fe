export const MENU = {
  TITLE: "Quản lý Thực đơn",
  SUBTITLE: "Hệ thống quản lý món ăn, giá bán và điều phối trạm tập trung.",
  ADD_NEW_ITEM: "Thêm món mới",
  TAB_ITEM: "Món lẻ",
  TAB_COMBO: "Combo / Set Menu",
  ADD_ITEM: "+ Thêm món lẻ",
  ADD_COMBO: "+ Thêm Combo",
  EMPTY_COMBO: "Chưa có dữ liệu Combo...",
  ID_NOT_FOUND: "Lỗi: Không tìm thấy ID món ăn!",
  DELETE_SUCCESS: "Xóa thành công!",
  DELETE_CONFIRM: (name: string) => `Bạn có chắc chắn muốn xóa món "${name}" không?`,
  UPDATE_STOCK_ERROR: "Không thể cập nhật trạng thái hàng hóa!",
  SAVE_SUCCESS: "Lưu dữ liệu thành công!",
  DELETE_DEFAULT_ERROR:
    "Món ăn này đã có trong hóa đơn, không thể xóa. Hãy tắt trạng thái bán thay vì xóa!",
  OPTIONS: {
    REQUIRED_MARK: "*",
    CHOOSE_ONE: "Chọn 1",
    MAXIMUM: "Tối đa",
    REQUIRED_LABEL: "Bắt buộc",
    SELECTED: "Đã chọn",
    NEED_SELECT: "Cần chọn",
    ADD_TO_ORDER: "Thêm vào đơn -",
    ITEM_NOTE: "Ghi chú món",
  },
  // Table Columns
  COL_ITEM_NAME: "Món ăn",
  COL_CATEGORY: "Danh mục",
  COL_PRICE: "Giá",
  COL_STATUS: "Trạng thái",
  COL_ACTION: "Hành động",

  // Status and Tooltips
  STATUS_OUT_OF_STOCK: "Hết hàng",
  STATUS_IN_STOCK: "Còn hàng",
  NO_CATEGORY: "Không có",
  TOOLTIP_CHANGE_STATUS: "Đổi trạng thái",
  TOOLTIP_EDIT: "Sửa",
  TOOLTIP_DELETE: "Xóa",

  // Not Found
  NOT_FOUND_TITLE: "Không tìm thấy món ăn nào!",
  NOT_FOUND_DESC: "Hãy kiểm tra lại bộ lọc hoặc thêm món ăn mới.",

  // Form Modal
  MODAL_EDIT_TITLE: "Chỉnh sửa món ăn",
  MODAL_ADD_TITLE: "Thêm món ăn mới",
  MODAL_EDIT_DESC: "Cập nhật thông tin chi tiết của món ăn.",
  MODAL_ADD_DESC: "Điền thông tin để tạo món ăn mới cho nhà hàng.",
  LABEL_NAME: "Tên món ăn",
  LABEL_DESC: "Mô tả",
  LABEL_STATION: "Khu vực chế biến",
  LABEL_PRICE: "Giá bán (VNĐ)",
  LABEL_COST: "Giá vốn (VNĐ)",
  LABEL_CATEGORY: "Danh mục",
  LABEL_IMAGE_URL: "Hoặc nhập URL hình ảnh trực tiếp ở dưới (nếu không tải file):",
  LABEL_MARK_OUT_OF_STOCK: "Đánh dấu là Hết Hàng (Không bán)",
  LABEL_EXPECTED_TIME: "Thời gian chuẩn bị (phút)",
  LABEL_IMAGE_VIEW: "Xem hình ảnh",
  PLACEHOLDER_NAME: "VD: Phở Bò Chín",
  PLACEHOLDER_DESC: "Mô tả chi tiết về món ăn...",
  PLACEHOLDER_STATION: "Chọn khu vực",
  PLACEHOLDER_PRICE: "VD: 50000",
  PLACEHOLDER_COST: "VD: 30000",
  PLACEHOLDER_CATEGORY: "Chọn danh mục",
  PLACEHOLDER_IMAGE_URL: "https://example.com/image.jpg",

  PLACEHOLDER_EXPECTED_TIME: "VD: 15",
  OPTION_SELECT_DEFAULT: "-- Chọn --",
  BUTTON_CANCEL: "Hủy",
  BUTTON_UPDATE: "Cập nhật",
  BUTTON_CREATE: "Tạo mới",

  STATION: {
    HOTKITCHEN: "Bếp nóng",
    COLDKITCHEN: "Bếp lạnh",
    DRINKS: "Pha chế",
  },

  LOADING_IMAGE: "Đang tải hình ảnh...",

  // Filter Bar
  PLACEHOLDER_SEARCH: "Tìm kiếm tên món ăn...",
  FILTER_ALL_CATEGORY: "Tất cả danh mục",
  FILTER_OUT_OF_STOCK: "Hết hàng",

  // Management Page
  MENU_PAGE_SUBTITLE: "Thêm, sửa, xóa và quản lý trạng thái món ăn trong nhà hàng.",
  LIST_TITLE: "Danh sách món ăn",
};
