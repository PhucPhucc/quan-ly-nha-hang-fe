export const SETTINGS = {
  // ── Page titles ────────────────────────────────────────────────
  PAGE_TITLE: "Cài đặt hệ thống",
  PAGE_DESC: "Quản lý và tùy chỉnh cấu hình hệ thống FoodHub",

  // ── Navigation ──────────────────────────────────────────────────
  NAV_GENERAL: "Cấu hình chung",
  NAV_WAREHOUSE: "Cấu hình kho",
  NAV_RESERVATION: "Cấu hình đặt bàn",

  // ────────────────────────────────────────────────────────────────
  // GENERAL SETTINGS
  // ────────────────────────────────────────────────────────────────
  GENERAL_TITLE: "Cấu hình chung",
  GENERAL_DESC: "Thông tin cơ bản về nhà hàng và hệ thống",

  // Branch info
  BRANCH_SECTION: "Thông tin chi nhánh",
  BRANCH_SECTION_DESC: "Thông tin nhận dạng của chi nhánh trong hệ thống",
  FIELD_BRANCH_NAME: "Tên chi nhánh",
  FIELD_BRANCH_NAME_PLACEHOLDER: "VD: FoodHub - Quận 1",
  FIELD_BRANCH_ID: "Mã chi nhánh",
  FIELD_BRANCH_ID_PLACEHOLDER: "VD: BR-001",
  FIELD_RESTAURANT_NAME: "Tên nhà hàng",
  FIELD_RESTAURANT_NAME_PLACEHOLDER: "VD: FoodHub Restaurant",
  FIELD_ADDRESS: "Địa chỉ",
  FIELD_ADDRESS_PLACEHOLDER: "Nhập địa chỉ chi nhánh",
  FIELD_PHONE: "Số điện thoại",
  FIELD_PHONE_PLACEHOLDER: "VD: 0901 234 567",

  // Localization
  LOCALIZE_SECTION: "Định dạng & Ngôn ngữ",
  LOCALIZE_SECTION_DESC: "Cấu hình đơn vị tiền tệ, múi giờ và định dạng hiển thị",
  FIELD_CURRENCY: "Đơn vị tiền tệ",
  FIELD_DATE_FORMAT: "Định dạng ngày",
  FIELD_TIMEZONE: "Múi giờ",

  CURRENCY_VND: "VNĐ - Việt Nam Đồng",
  DATE_FORMAT_DMY: "DD/MM/YYYY",
  DATE_FORMAT_MDY: "MM/DD/YYYY",
  DATE_FORMAT_YMD: "YYYY/MM/DD",
  TIMEZONE_GMT7: "GMT+7 (Hà Nội, TP. HCM)",

  // Notifications
  NOTIFY_SECTION: "Thông báo hệ thống",
  NOTIFY_SECTION_DESC: "Tùy chỉnh kênh nhận thông báo từ hệ thống",
  FIELD_NOTIFY_EMAIL: "Thông báo qua Email",
  FIELD_NOTIFY_EMAIL_DESC: "Nhận cảnh báo và báo cáo qua email",
  FIELD_NOTIFY_PUSH: "Thông báo đẩy (Push)",
  FIELD_NOTIFY_PUSH_DESC: "Nhận thông báo ngay lập tức trên trình duyệt",
  FIELD_NOTIFY_SMS: "Thông báo SMS",
  FIELD_NOTIFY_SMS_DESC: "Nhận tin nhắn SMS cho các sự kiện quan trọng",

  SUCCESS_GENERAL: "Đã lưu cấu hình chung thành công",

  // ────────────────────────────────────────────────────────────────
  // WAREHOUSE SETTINGS
  // ────────────────────────────────────────────────────────────────
  WAREHOUSE_TITLE: "Cấu hình kho",
  WAREHOUSE_DESC: "Tùy chỉnh quy tắc vận hành và cảnh báo tồn kho",

  STOCK_SECTION: "Cài đặt tồn kho",
  STOCK_SECTION_DESC: "Quản lý ngưỡng cảnh báo và quy tắc xuất nhập kho",

  FIELD_LOW_STOCK_ENABLED: "Bật cảnh báo tồn kho thấp",
  FIELD_LOW_STOCK_ENABLED_DESC: "Gửi thông báo khi số lượng nguyên liệu dưới ngưỡng tối thiểu",
  FIELD_LOW_STOCK_THRESHOLD: "Ngưỡng tồn kho tối thiểu (mặc định)",
  FIELD_LOW_STOCK_THRESHOLD_DESC: "Áp dụng cho nguyên liệu chưa thiết lập ngưỡng riêng",
  FIELD_EXPIRY_WARNING: "Cảnh báo hạn sử dụng (ngày)",
  FIELD_EXPIRY_WARNING_DESC: "Cảnh báo trước bao nhiêu ngày khi nguyên liệu sắp hết hạn",

  DISPATCH_SECTION: "Quy tắc xuất kho",
  DISPATCH_SECTION_DESC: "Thiết lập phương pháp tính giá vốn và xuất kho",
  FIELD_COST_METHOD: "Phương pháp tính giá vốn",
  FIELD_COST_METHOD_FIFO: "FIFO – Nhập trước, xuất trước",
  FIELD_COST_METHOD_LIFO: "LIFO – Nhập sau, xuất trước",
  FIELD_COST_METHOD_AVG: "Bình quân gia quyền",
  FIELD_AUTO_DEDUCT: "Tự động trừ kho khi hoàn thành đơn",
  FIELD_AUTO_DEDUCT_DESC:
    "Tự động ghi nhận xuất kho khi đơn hàng chuyển sang trạng thái Hoàn thành",

  SUCCESS_WAREHOUSE: "Đã lưu cấu hình kho thành công",

  // ────────────────────────────────────────────────────────────────
  // RESERVATION SETTINGS
  // ────────────────────────────────────────────────────────────────
  RESERVATION_TITLE: "Cấu hình đặt bàn",
  RESERVATION_DESC: "Thiết lập quy tắc nhận đặt chỗ và quản lý bàn",

  BOOKING_HOURS_SECTION: "Giờ nhận đặt bàn",
  BOOKING_HOURS_SECTION_DESC: "Thời gian trong ngày mà khách hàng có thể đặt bàn",
  FIELD_OPEN_TIME: "Giờ mở cửa",
  FIELD_CLOSE_TIME: "Giờ đóng cửa",
  FIELD_BREAK_START: "Bắt đầu nghỉ giữa ca",
  FIELD_BREAK_END: "Kết thúc nghỉ giữa ca",
  FIELD_BREAK_ENABLED: "Có giờ nghỉ giữa ca",
  FIELD_BREAK_ENABLED_DESC: "Không nhận đặt bàn trong khoảng thời gian nghỉ",

  BOOKING_RULES_SECTION: "Quy tắc đặt bàn",
  BOOKING_RULES_SECTION_DESC: "Giới hạn và ràng buộc cho mỗi lượt đặt",
  FIELD_MIN_GUESTS: "Số khách tối thiểu",
  FIELD_MAX_GUESTS: "Số khách tối đa",
  FIELD_MIN_LEAD_TIME: "Đặt trước tối thiểu (phút)",
  FIELD_MIN_LEAD_TIME_DESC: "Khách cần đặt trước ít nhất bao nhiêu phút",
  FIELD_GRACE_PERIOD: "Thời gian giữ bàn (phút)",
  FIELD_GRACE_PERIOD_DESC: "Giữ bàn tối đa bao nhiêu phút nếu khách chưa đến",

  DEPOSIT_SECTION: "Tiền đặt cọc",
  DEPOSIT_SECTION_DESC: "Quy tắc thu cọc khi nhận đặt bàn",
  FIELD_DEPOSIT_ENABLED: "Yêu cầu tiền cọc",
  FIELD_DEPOSIT_ENABLED_DESC: "Thu tiền cọc khi khách đặt bàn để đảm bảo chỗ",
  FIELD_DEPOSIT_AMOUNT: "Số tiền cọc mỗi người (đ)",
  FIELD_DEPOSIT_AMOUNT_DESC: "Số tiền cọc tính theo từng người khách",

  NOTIFICATION_SECTION: "Thông báo đặt bàn",
  NOTIFICATION_SECTION_DESC: "Cách hệ thống thông báo khi có đặt bàn mới",
  FIELD_NOTIFY_NEW_BOOKING: "Thông báo khi có đặt bàn mới",
  FIELD_NOTIFY_NEW_BOOKING_DESC: "Gửi thông báo ngay khi có đặt bàn mới vào hệ thống",
  FIELD_NOTIFY_UPCOMING: "Nhắc nhở đặt bàn sắp đến",
  FIELD_NOTIFY_UPCOMING_DESC: "Tự động nhắc nhở 30 phút trước giờ đặt bàn",

  SUCCESS_RESERVATION: "Đã lưu cấu hình đặt bàn thành công",

  // ── Shared ──────────────────────────────────────────────────────
  BTN_SAVE: "Lưu cấu hình",
  BTN_SAVING: "Đang lưu...",
  LABEL_ENABLED: "Đang bật",
  LABEL_DISABLED: "Đang tắt",
};
