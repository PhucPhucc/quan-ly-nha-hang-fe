export const TABLE = {
  TITLE: "Sơ đồ bàn",
  SERVING: "Đang sử dụng",
  READY: "Bàn trống",
  CLEANING: "Đang dọn dẹp",
  RESERVED: "Đã đặt trước",
  EMPTY: "Chưa có bàn nào",
  CANCELLED: "Đã hủy",
  OUT_OF_SERVICE: "Tạm ngưng",
  COMPLETED: "Hoàn tất",
  FETCH_ERROR: "Không thể tải danh sách bàn",
  RESERVATION_BTN: "Đặt bàn",
  PEOPLE: "Khách",
  SELECTED_AREA_PLEASE: "Vui lòng chọn khu vực",
  NO_TABLES_FOUND: "Không tìm thấy bàn nào phù hợp.",
  CAPACITY_LIMIT: "Số ghế không hợp lệ.",
  TABLE_NUMBER(num: number) {
    return `Bàn ${num}`;
  },

  // Summary bar
  TABLES: "bàn",
  SEATS: "ghế",
  AVAILABLE_COUNT: "đang hoạt động",
  INACTIVE_COUNT: "tạm ngưng",

  // Status labels (legend + card)
  STATUS_AVAILABLE: "Trống",
  STATUS_RESERVED: "Đặt trước",
  STATUS_OCCUPIED: "Đang dùng",
  STATUS_CLEANING: "Đang dọn",
  STATUS_OUT_OF_SERVICE: "Tạm ngưng",
  STATUS_ACTIVE: "Hoạt động",
  STATUS_INACTIVE: "Tạm ngưng",

  // Toolbar
  EDIT_MODE: "Chế độ chỉnh sửa",
  ADD_TABLE: "Thêm bàn",
  VIP_SINGLE_TABLE_NOTICE: "Phòng VIP chỉ có thể chứa 1 bàn.",
  SEAT_COUNT: "Số ghế",
  DEFAULT_SHAPE_NOTE: "* Bàn mặc định hình chữ nhật",
  SEARCH_PLACEHOLDER: "Tìm kiếm bàn...",

  // Actions
  ACTIVATE: "Kích hoạt",
  DEACTIVATE: "Ngưng hoạt động",
  SAVE_CHANGES: "Lưu thay đổi",
  CREATE_ORDER: "Tạo Order",

  // Edit panel
  TABLE_CODE: "Mã bàn",
  SEAT_COUNT_LABEL: "Số ghế",
  EDIT_TABLE(code: string) {
    return `Chỉnh sửa bàn ${code}`;
  },
  TABLE_LABEL(code: string) {
    return `Bàn ${code}`;
  },
  RECT_SHAPE: "Hình chữ nhật",
  SEAT_SUFFIX: "ghế",

  // Toast messages
  UPDATE_SUCCESS: "Cập nhật thành công",
  ACTIVATE_SUCCESS: "Đã kích hoạt bàn",
  DEACTIVATE_SUCCESS: "Đã ngưng hoạt động bàn",
  OPERATION_FAILED: "Thao tác thất bại",
  ADD_TABLE_SUCCESS: "Thêm bàn thành công",
  ADD_TABLE_ERROR: "Không thể thêm bàn",
  UPDATE_ERROR: "Không thể cập nhật",

  // Area management
  MANAGE_AREAS: "Quản lý khu vực",
  ADD_AREA: "Thêm khu vực mới",
  AREA_UPDATE: "Cập nhật khu vực",
  AREA_NAME: "Tên khu vực",
  AREA_CODE: "Mã khu vực (Prefix)",
  AREA_TYPE: "Loại khu vực",
  AREA_DESCRIPTION: "Mô tả",
  AREA_NAME_PLACEHOLDER: "VD: Sảnh chính",
  AREA_CODE_PLACEHOLDER: "VD: A",
  AREA_DESC_PLACEHOLDER: "Mô tả ngắn về khu vực...",
  AREA_DESCRIPTION_EMPTY: "Chưa có mô tả",
  AREA_CODE_UNIQUE: "Mã sẽ được dùng làm tiền tố cho mã bàn (phải là duy nhất)",
  SEARCH_AREA_PLACEHOLDER: "Tìm kiếm khu vực...",

  // Area table headers
  COL_CODE: "Mã khu vực",
  COL_NAME: "Tên khu vực",
  COL_TYPE: "Loại",
  COL_TABLE_COUNT: "Số bàn",
  COL_STATUS: "Trạng thái",
  COL_ACTION: "Thao tác",

  // Area types
  TYPE_NORMAL: "Thường",
  TYPE_VIP: "VIP",

  // Fetch errors on table page
  FETCH_AREA_ERROR: "Không thể tải danh sách khu vực",
  FETCH_TABLE_ERROR: "Không thể tải danh sách bàn",
};
