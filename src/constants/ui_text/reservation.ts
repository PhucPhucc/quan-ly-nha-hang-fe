export const RESERVATION = {
  // Title & Headers
  TITLE: "Đặt bàn",
  STATS_TOTAL: "Tổng đặt bàn",
  STATS_BOOKED: "Đã đặt",
  STATS_ARRIVED: "Đã đến",
  STATS_CANCELLED: "Đã hủy",

  // Table Columns
  COL_CODE: "Mã đặt bàn",
  COL_CUSTOMER: "Khách hàng",
  COL_DATETIME: "Ngày giờ",
  COL_AREA: "Khu vực",
  COL_PEOPLE: "Số người",
  COL_PARTY_TYPE: "Loại tiệc",
  COL_STATUS: "Trạng thái",
  COL_ACTIONS: "Thao tác",

  // Status Labels
  STATUS_BOOKED: "Đã Đặt",
  STATUS_CHECKED_IN: "Đã Đến",
  STATUS_CANCELLED: "Đã Hủy",
  STATUS_NO_SHOW: "Bỏ Lỡ",

  // Search & Filters
  SEARCH_PLACEHOLDER: "Tìm theo tên khách, SĐT...",
  AREA_FILTER: "Khu vực",
  STATUS_FILTER: "Trạng thái",
  CREATE_BTN: "Đặt bàn mới",
  ALL_AREAS: "Tất cả khu vực",
  ALL_STATUSES: "Tất cả trạng thái",
  STATUS_FILTER_BOOKED: "Đã đặt (Booked)",
  STATUS_FILTER_ARRIVED: "Đã đến (Arrived)",
  STATUS_FILTER_CANCELLED: "Đã hủy",

  // Dialogs: Create & Edit
  CREATE_DIALOG_TITLE: "Tạo đặt bàn mới",
  EDIT_DIALOG_TITLE: "Chỉnh sửa đặt bàn",
  FIELD_CUSTOMER_NAME: "Tên khách hàng",
  FIELD_CUSTOMER_NAME_PLACEHOLDER: "Nhập tên khách hàng",
  FIELD_PHONE: "Số điện thoại",
  FIELD_PHONE_PLACEHOLDER: "Nhập số điện thoại",
  FIELD_DATE: "Ngày đặt",
  FIELD_TIME: "Giờ đặt (24h)",
  FIELD_AREA: "Khu vực",
  FIELD_PEOPLE_COUNT: "Số người",
  FIELD_PARTY_TYPE: "Loại tiệc",
  FIELD_PARTY_TYPE_NONE: "Không",
  FIELD_NOTE: "Ghi chú",
  FIELD_NOTE_PLACEHOLDER: "Nhập ghi chú thêm...",
  BTN_CANCEL: "Hủy",
  BTN_SUBMIT_CREATE: "Tạo đặt bàn",
  BTN_SUBMIT_UPDATE: "Cập nhật",
  BTN_SAVING: "Đang lưu...",

  // Placeholders & Options
  CREATE_DIALOG_DESC: "Điền thông tin chi tiết để tạo đơn đặt bàn mới.",
  EDIT_DIALOG_DESC: "Chỉnh sửa thông tin chi tiết đơn đặt bàn hiện tại.",
  PLACEHOLDER_PARTY_TYPE: "Chọn loại tiệc",
  PLACEHOLDER_AREA: "Chọn khu vực",
  AREA_ANY: "Bất kỳ",

  PARTY_TYPE_NORMAL: "Ăn uống bình thường",
  PARTY_TYPE_BIRTHDAY: "Tiệc sinh nhật",
  PARTY_TYPE_ANNIVERSARY: "Kỷ niệm",
  PARTY_TYPE_CORPORATE: "Tiệc công ty",

  BTN_BACK: "Quay lại",
  BTN_CONFIRM_CANCEL: "Xác nhận hủy",
  BTN_CONFIRM_ARRIVAL: "Xác nhận",
  BTN_CLOSE_DIALOG: "Hủy bỏ",

  // Dialog: Confirm Arrival
  CONFIRM_ARRIVAL_TITLE: "Bắt đầu phục vụ",
  CONFIRM_ARRIVAL_DESC_1: "Xác nhận khách hàng",
  CONFIRM_ARRIVAL_DESC_2: "đã đến nhà hàng?",
  CONFIRM_ARRIVAL_TABLE: "Bàn",
  CONFIRM_ARRIVAL_PEOPLE: "Số người",

  // Dialog: Cancel Booking
  CANCEL_BOOKING_TITLE: "Hủy đơn đặt bàn",
  CANCEL_BOOKING_DESC_1: "Đơn đặt bàn của",
  CANCEL_BOOKING_DESC_2: "sẽ bị hủy. Hành động này không thể hoàn tác.",

  // Table Actions
  ACTION_EDIT: "Chỉnh sửa",
  ACTION_CANCEL: "Hủy đặt bàn",
  REQUIRED_MARK: "*",
  HELP_ICON: "ℹ️",
  EMPTY_DATA: "Không tìm thấy dữ liệu đặt bàn nào.",

  // Pagination
  PAGINATION_SHOWING: "Hiển thị",
  PAGINATION_OF: "trên tổng số",
  PAGINATION_UNIT: "đặt bàn",

  // Validations & Errors
  VALIDATION_MIN_LEAD_TIME: "Vui lòng đặt chỗ trước ít nhất theo quy định.",
  VALIDATION_MIN_LEAD_TIME_DYNAMIC: (min: number) => `Vui lòng đặt chỗ trước ít nhất ${min} phút.`,
  VALIDATION_WITHIN_OPERATING_HOURS: "Đặt bàn phải nằm trong giờ hoạt động của nhà hàng (24h).",
  VALIDATION_WITHIN_OPERATING_HOURS_DYNAMIC: (open: string, close: string) =>
    `Đặt bàn phải nằm trong giờ hoạt động ${open} - ${close}.`,
  VALIDATION_BREAK_TIME: "Nhà hàng đang nghỉ giữa ca. Vui lòng chọn giờ khác.",
  VALIDATION_BREAK_TIME_DYNAMIC: (start: string, end: string) =>
    `Nhà hàng nghỉ giữa ca từ ${start} đến ${end}. Vui lòng chọn giờ khác.`,
  VALIDATION_REQUIRED_NAME_PHONE: "Vui lòng nhập tên và số điện thoại khách hàng",
  VALIDATION_REQUIRED_DATE_TIME: "Vui lòng chọn ngày và giờ đặt bàn",
  VALIDATION_VIP_REQUIRED: "Đoàn khách trên 12 người vui lòng đặt phòng VIP.",
  ERROR_CREATE_FAILED: "Tạo đơn đặt bàn thất bại",
  ERROR_SAVE_FAILED: "Lưu thông tin thất bại",
  ERROR_CONNECTION: "Không thể kết nối đến máy chủ",
  ERROR_UNKNOWN: "Đã xảy ra lỗi không xác định",

  // Switch Area Dialog
  SWITCH_AREA_TITLE: "Chuyển khu vực",
  SWITCH_AREA_DESC:
    "Khu vực cũ đã hết bàn vì khách đang sử dụng. Vui lòng chọn bàn ở khu vực khác.",
  SWITCH_AREA_SELECT_LABEL: "Chọn khu vực",
  SWITCH_AREA_SELECT_PLACEHOLDER: "Chọn khu vực...",
  SWITCH_TABLE_SELECT_LABEL: "Chọn bàn trống",
  SWITCH_TABLE_PLACEHOLDER_SELECT_AREA: "Hãy chọn khu vực trước",
  SWITCH_TABLE_PLACEHOLDER_NO_TABLE: "Hết bàn trống phù hợp",
  SWITCH_TABLE_PLACEHOLDER_SELECT_TABLE: "Chọn bàn...",
  BTN_CONFIRM_SWITCH_CHECKIN: "Xác nhận đổi & Check-in",
  MSG_SWITCH_INFO: "Vui lòng chọn bàn khác ở khu vực còn trống.",
};
