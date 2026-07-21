export const SETTINGS = {
  // ── Page titles ────────────────────────────────────────────────
  PAGE_TITLE: "Cài đặt hệ thống",
  PAGE_DESC: "Quản lý và tùy chỉnh cấu hình hệ thống FoodHub",

  // ── Navigation ──────────────────────────────────────────────────
  NAV_GENERAL: "Cấu hình chung",
  NAV_WAREHOUSE: "Cấu hình kho",
  NAV_RESERVATION: "Cấu hình đặt bàn",
  NAV_SETTING: "Cấu hình KDS",
  // ────────────────────────────────────────────────────────────────
  // GENERAL SETTINGS
  // ────────────────────────────────────────────────────────────────
  GENERAL_TITLE: "Cấu hình chung",
  GENERAL_DESC: "Thông tin cơ bản về nhà hàng và hệ thống",

  // Store info
  BRANCH_SECTION: "Thông tin cửa hàng",
  BRANCH_SECTION_DESC: "Thông tin nhận dạng của cửa hàng trong hệ thống",
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
  GENERAL_FOOTER_NOTE:
    "Cập nhật các thiết lập chung của hệ thống sẽ ảnh hưởng đến hiển thị trên toàn bộ chi nhánh.",

  // Branding & Display
  BRANDING_SECTION: "Nhận diện & Giao diện",
  BRANDING_SECTION_DESC: "Tùy chỉnh logo, tiêu đề và giao diện hiển thị trên các ứng dụng",
  FIELD_APP_TITLE: "Tiêu đề ứng dụng",
  FIELD_KDS_TITLE: "Tiêu đề KDS",
  FIELD_LOGO: "Logo thương hiệu",
  FIELD_LOGO_DESC: "Kích thước khuyến nghị: 512x512px. Hỗ trợ PNG, JPG, WebP.",
  FIELD_LOGO_URL_PLACEHOLDER: "Hoặc nhập URL trực tiếp...",
  LOGO_UPLOAD_SUCCESS: "Đã tải logo lên thành công",
  LOGO_UPLOAD_ERROR: "Tải logo thất bại",

  // Business Info
  BUSINESS_INFO_SECTION: "Thông tin doanh nghiệp",
  BUSINESS_INFO_SECTION_DESC: "Thông tin pháp lý và kinh doanh của nhà hàng",
  FIELD_LEGAL_BUSINESS_NAME: "Tên pháp lý doanh nghiệp",
  FIELD_BRAND_NAME: "Tên thương hiệu",
  FIELD_TAX_CODE: "Mã số thuế (MST)",
  FIELD_BUSINESS_REG_NUMBER: "Số ĐKKD",
  FIELD_BRANCH_CODE: "Mã chi nhánh",
  FIELD_RESTAURANT_CODE: "Mã nhà hàng (Unique)",

  // Contact Info
  CONTACT_INFO_SECTION: "Thông tin liên hệ",
  CONTACT_INFO_SECTION_DESC: "Thông tin liên hệ chính thức của nhà hàng",
  FIELD_HOTLINE: "Hotline",
  FIELD_EMAIL: "Email",
  FIELD_WEBSITE: "Website",
  FIELD_FACEBOOK: "Facebook",
  FIELD_ZALO_OA: "Zalo OA",
  FIELD_INSTAGRAM: "Instagram",

  // Address
  ADDRESS_SECTION: "Địa chỉ chi tiết",
  ADDRESS_SECTION_DESC: "Địa chỉ cụ thể của nhà hàng",
  FIELD_COUNTRY: "Quốc gia",
  FIELD_PROVINCE_CITY: "Tỉnh / Thành phố",
  FIELD_DISTRICT: "Quận / Huyện",
  FIELD_WARD: "Phường / Xã",
  FIELD_STREET_ADDRESS: "Tên đường, số nhà",
  FIELD_POSTAL_CODE: "Mã bưu chính",
  FIELD_GOOGLE_MAP_URL: "Google Map URL",

  // Images
  IMAGES_SECTION: "Hình ảnh thương hiệu",
  IMAGES_SECTION_DESC: "Ảnh bìa, mã QR thanh toán, Favicon",
  FIELD_COVER_IMAGE: "Ảnh bìa",
  FIELD_QR_PAYMENT_IMAGE: "Mã QR thanh toán",
  FIELD_FAVICON: "Favicon",

  // Invoice Settings
  INVOICE_SECTION: "Cấu hình In ấn & Hóa đơn",
  INVOICE_SECTION_DESC: "Thiết lập hóa đơn và thuế",
  FIELD_VAT_PERCENTAGE: "Phần trăm VAT (%)",
  FIELD_BILL_TITLE: "Tiêu đề hóa đơn",
  FIELD_BILL_FOOTER: "Chân trang hóa đơn",

  // Operating Info
  OPERATING_INFO_SECTION: "Thông tin hoạt động",
  OPERATING_INFO_SECTION_DESC: "Khung giờ và ngày làm việc của nhà hàng",
  FIELD_TIME_FORMAT: "Định dạng thời gian",
  FIELD_TIME_FORMAT_24H: "24 Giờ (Ví dụ: 14:00)",
  FIELD_TIME_FORMAT_12H: "12 Giờ (Ví dụ: 02:00 PM)",
  FIELD_OPENING_TIME: "Giờ mở cửa",
  FIELD_CLOSING_TIME: "Giờ đóng cửa",
  ERR_CLOSING_TIME_MUST_BE_AFTER_OPENING: "Giờ đóng cửa phải sau giờ mở cửa",
  FIELD_WORKING_DAYS: "Các ngày làm việc",

  // System Config
  SYSTEM_CONFIG_SECTION: "Cấu hình chức năng hệ thống",
  SYSTEM_CONFIG_SECTION_DESC: "Bật/Tắt các chức năng chính trên hệ thống",
  FIELD_ENABLE_ORDERING: "Cho phép gọi món tại bàn",
  FIELD_ENABLE_DELIVERY: "Cho phép giao hàng",
  FIELD_ENABLE_TAKE_AWAY: "Cho phép mang đi",
  FIELD_ENABLE_RESERVATION: "Cho phép đặt bàn",
  FIELD_LANGUAGE: "Ngôn ngữ hệ thống",
  LANGUAGE_VI: "Tiếng Việt",
  LANGUAGE_EN: "English",

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
  BOOKING_HOURS_SECTION_DESC:
    "Thiết lập khung giờ hoạt động và thời gian phục vụ khách đặt chỗ hàng ngày.",
  FIELD_OPEN_TIME: "Giờ mở cửa (24h)",
  FIELD_OPEN_TIME_DESC: "Thời điểm sớm nhất nhà hàng bắt đầu đón khách đặt bàn.",
  FIELD_CLOSE_TIME: "Giờ đóng cửa (24h)",
  FIELD_CLOSE_TIME_DESC: "Hạn cuối cùng trong ngày nhà hàng còn nhận lượt đặt bàn mới.",
  FIELD_BREAK_START: "Bắt đầu nghỉ giữa ca (24h)",
  FIELD_BREAK_START_DESC: "Thời điểm tạm dừng nhận khách để chuyển giao giữa các ca.",
  FIELD_BREAK_END: "Kết thúc nghỉ giữa ca (24h)",
  FIELD_BREAK_END_DESC: "Thời điểm nhà hàng sẵn sàng nhận khách trở lại sau giờ nghỉ.",
  FIELD_BREAK_ENABLED: "Có giờ nghỉ giữa ca",
  FIELD_BREAK_ENABLED_DESC: "Không nhận đặt bàn trong khoảng thời gian nghỉ",

  BOOKING_RULES_SECTION: "Quy tắc đặt bàn",
  BOOKING_RULES_SECTION_DESC: "Giới hạn và ràng buộc cho mỗi lượt đặt",
  FIELD_OVERLAP_BUFFER: "Khoảng đệm chồng lịch (phút)",
  FIELD_OVERLAP_BUFFER_DESC: "Thời gian đệm để tránh trùng lịch giữa các booking",
  FIELD_MIN_LEAD_TIME: "Đặt trước tối thiểu (phút)",
  FIELD_MIN_LEAD_TIME_DESC: "Khách cần đặt trước ít nhất bao nhiêu phút",
  FIELD_GRACE_PERIOD: "Thời gian chờ khách đến (phút)",
  FIELD_GRACE_PERIOD_DESC: "Quá thời gian này mà khách chưa check-in thì có thể chuyển no-show",
  FIELD_UPCOMING_BUFFER: "Thời gian chuẩn bị giữ bàn (phút)",
  FIELD_UPCOMING_BUFFER_DESC:
    "Hệ thống tự động đổi trạng thái bàn sang 'Giữ bàn' trước bao nhiêu phút",

  ERR_UPCOMING_BUFFER_LIMIT: "Thời gian giữ bàn không được lớn hơn thời gian đặt trước tối thiểu",

  SUCCESS_RESERVATION: "Đã lưu cấu hình đặt bàn thành công",

  // ── Shared ──────────────────────────────────────────────────────
  BTN_SAVE: "Lưu cấu hình",
  BTN_SAVING: "Đang lưu...",
  LABEL_ENABLED: "Đang bật",
  LABEL_DISABLED: "Đang tắt",
};
