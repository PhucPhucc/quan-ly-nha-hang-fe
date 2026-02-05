// src/constants/UI_Text.ts

export const UI_TEXT = {
  COMMON: {
    LOADING: "Đang tải...",
    ERROR: "Có lỗi xảy ra",
    RETRY: "Thử lại",
    SAVE: "Lưu",
    CANCEL: "Hủy",
    CONFIRM: "Xác nhận",
    ACTION: "Thao tác",
    CREATE_AT: "Ngày tạo",
    UPDATE_AT: "Ngày cập nhật",
    NULL: "Null",
    EMPTY: "Trống",
    UPDATE: "Đã cập nhật",
    ALL: "Tất cả",
    FILTER: "Bộ lọc",
    SEARCH: "Tìm kiếm",
    NAME_PROJECT: "FoodHub",
    RESET: "Đặt lại",
  },

  AUTH: {
    LOGIN: "Đăng nhập",
    LOGOUT: "Đăng xuất",
    REGISTER: "Đăng ký",
    EMAIL: "Email",
    PASSWORD: "Mật khẩu",
    LOGIN_TITLE: "Chào mừng quay lại",
    EMPLOYEE_CODE: "Mã nhân viên",
    EMPLOYEE_CODE_PLACEHOLDER: "VD: M000001",
    REMEMBER_ME: "Ghi nhớ đăng nhập",
    FORGOT_PASSWORD: "Quên mật khẩu?",
    ERROR_INVALID_CREDENTIALS: "Sai mã nhân viên hoặc mật khẩu",
  },

  EMPLOYEE: {
    TITLE: "Danh sách nhân viên",
    DESCRIPTION: "Quản lý thông tin nhân viên",
    INFO: "Thông tin nhân viên",
    EMPTY: "Chưa có nhân viên",
    ADD: "Thêm nhân viên",
    ADD_DESCRIPTION: "Thêm nhân viên mới vào hệ thống",
    ADD_SUSCESS: "Thêm nhân viên thành công",
    ADD_FAILED: "Thêm nhân viên thất bại",
    EDIT: "Sửa nhân viên",
    DELETE: "Xóa nhân viên",
    DELETE_CONFIRM: "Bạn có chắc chắn muốn xóa nhân viên này không?",
    DELETE_SUSCESS: "Xóa nhân viên thành công",
    DELETE_FAILED: "Xóa nhân viên thất bại",
    UPDATE_SUSCESS: "Cập nhật nhân viên thành công",
    UPDATE_FAILED: "Cập nhật nhân viên thất bại",
    FETCH_ERROR: "Không thể tải danh sách nhân viên",
    EMPLOYEECODE: "Mã nhân viên",
    FULLNAME: "Họ và tên",
    EMAIL: "Email",
    ROLE: "Vai trò",
    PHONE: "Số điện thoại",
    ADDRESS: "Địa chỉ",
    DOB: "Ngày sinh",
    STATUS: "Trạng thái",
    DELETE_CONFIRM_NAME: (name: string) => `Bạn có chắc chắn muốn xóa "${name}" không?`,
  },

  FORM: {
    REQUIRED: "Trường này là bắt buộc",
    INVALID_EMAIL: "Email không hợp lệ",
    MIN_LENGTH: (min: number) => `Tối thiểu ${min} ký tự`,
  },

  ROLE: {
    TITLE: "Vai trò nhân viên",
    MANAGER: "Quản lý",
    CASHIER: "Thu ngân",
    WAITER: "Phục vụ",
    CHEF: "Đầu bếp",
  },

  BUTTON: {
    SUBMIT: "Gửi",
    RESET: "Đặt lại",
    CLOSE: "Đóng",
  },

  API: {
    NETWORK_ERROR: "Không thể kết nối server",
    TIMEOUT: "Hết thời gian phản hồi",
    UNAUTHORIZED: "Bạn chưa đăng nhập",
  },

  ORDER: {
    TITLE: "Đơn hàng",
    EMPTY: "Chưa có đơn hàng nào",
    FETCH_ERROR: "Không thể tải danh sách đơn hàng",
  },

  TABLE: {
    TITLE: "Sơ đồ bàn",
    INPROCESS: "Đang sử dụng",
    READY: "Bàn trống",
    CLEANING: "Đang dọn dẹp",
    RESERVED: "Đã đặt trước",
    EMPTY: "Chưa có bàn nào",
    FETCH_ERROR: "Không thể tải danh sách bàn",
    RESERVATION_BTN: "Đặt bàn",
    PEOPLE: "Khách",
    TABLE_NUMBER(num: number) {
      return `Bàn ${num}`;
    },
  },

  CHANGE_PASSWORD: {
    TITLE: "Đổi mật khẩu",
    BUTTON: "Đổi mật khẩu",

    CURRENT_PASSWORD: "Mật khẩu hiện tại",
    NEW_PASSWORD: "Mật khẩu mới",
    CONFIRM_PASSWORD: "Xác nhận mật khẩu",

    CONFIRM_NOT_MATCH: "Mật khẩu xác nhận không khớp",
  },
  PROFILE: {
    TITLE: "Thông tin cá nhân",
    DESCRIPTION: "Cập nhật thông tin cá nhân của bạn",
    CHANGE_PASSWORD: "Đổi mật khẩu",
    CURRENT_PASSWORD: "Mật khẩu hiện tại",
    NEW_PASSWORD: "Mật khẩu mới",
    CONFIRM_PASSWORD: "Xác nhận mật khẩu",
    CONFIRM_PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  } as const,
  AUDIT_LOG: {
    TITLE: "Lịch sử hệ thống",
    EMPTY: "Chưa có lịch sử nào",
    FETCH_ERROR: "Không thể tải lịch sử hệ thống",
    LOG_ID: "Mã Log",
    ORDER_ID: "Mã Đơn hàng",
    EMPLOYEE_ID: "Mã Nhân viên",
    ACTION: "Hành động",
    REASON: "Lý do thay đổi",
    OLD_VALUE: "Giá trị cũ",
    NEW_VALUE: "Giá trị mới",
    CREATED_AT: "Thời gian",
  },

  LANDING: {
    HERO_TITLE: "Tối ưu hóa quy trình",
    HERO_SUBTITLE: "Vận hành ẩm thực",
    HERO_DESC:
      "Từ gọi món tại bàn đến sức nóng của bếp. FoodHub cung cấp nền tảng số cho các hoạt động nhà hàng hiện đại và quản lý bếp thông minh.",
    ENTER_SYSTEM: "Vào hệ thống",
    DASHBOARD: "Tổng quan",
    STAFF_LOGIN: "Đăng nhập nhân viên",
    KITCHEN_TERMINAL: "Thiết bị Bếp",
    MISSION_CRITICAL: "Giải pháp cốt lõi cho BOH",
    MISSION_DESC: "Phần mềm được thiết kế chuyên biệt cho nhịp độ và áp lực của khu vực hậu sảnh.",
    KITCHEN_INTEL: "Trí tuệ nhà bếp",
    KDS_PREVIEW: "Giao diện KDS Terminal 01",
    TECH_REDUCING: "Giảm trung bình 24% thời gian lên món",

    ABOUT_TITLE: "Về FoodHub",
    ABOUT_DESC:
      "FoodHub là đối tác tin cậy của hơn 500 nhà hàng lớn nhỏ, cung cấp hệ sinh thái quản lý toàn diện giúp nâng tầm trải nghiệm thực khách.",
    ESTABLISHED: "Thành lập từ 2018",
    TEAM_SIZE: "Hơn 100 chuyên gia kỹ thuật và ẩm thực",

    BLOG_TITLE: "Tin tức & Sự nghiệp",
    BLOG_DESC: "Cập nhật những xu hướng công nghệ nhà hàng và tin tức nội bộ mới nhất từ FoodHub.",
    READ_MORE: "Đọc thêm",

    REVIEWS_TITLE: "Đánh giá từ đối tác",
    REVIEWS_DESC: "Những gì các bếp trưởng và quản lý nói về chúng tôi.",
    REVIEWS_LIST: [
      {
        author: "Bếp trưởng Toàn Nguyễn",
        role: "Ocean Grill",
        content:
          "Kể từ khi dùng FoodHub, tình trạng sai sót ticket gần như bằng không. Đội ngũ bếp phối hợp nhịp nhàng hơn hẳn.",
      },
      {
        author: "Chị Lan Anh",
        role: "Manager tại Red Coral",
        content:
          "Hệ thống báo cáo chi tiết giúp tôi nắm bắt tình hình kinh doanh ngay cả khi không có mặt tại quán.",
      },
      {
        author: "Anh Minh Quân",
        role: "Chủ chuỗi Tasty Hub",
        content: "Phần mềm ổn định, giao diện hiện đại và rất dễ để đào tạo nhân viên mới.",
      },
    ],
  },

  DASHBOARD: {
    PORTAL_TITLE: "Cổng thông tin vận hành",
    PORTAL_SUBTITLE: "Hệ thống quản lý FoodHub | Trung tâm điều hành",
    OVERVIEW: "Tổng quan Dashboard",
    USER_ROLE: (role: string) => `Bạn đang đăng nhập với vai trò: ${role}`,
    STALE_DATA: "Dữ liệu cũ (5p)",
    SYSTEM_HEALTH: "Sức khỏe hệ thống",
    OPERATIONAL_DATA_LOCKED: "Dữ liệu vận hành bị khóa",
    LOCKED_DESC:
      "Dữ liệu tài chính và lịch sử đơn hàng bị hạn chế theo bộ phận của bạn. Vui lòng sử dụng Terminal Bếp hoặc POS để quản lý trực tiếp.",
    POS_STATUS: "Trạng thái POS",
    PRINTER_STATUS: "Máy in Bếp",
    INVENTORY_SYNC: "Đồng bộ kho",
    ONLINE: "TRỰC TUYẾN",
    READY: "SẴN SÀNG",
    STALE: "TRỄ",
    BULLETIN_TITLE: "Thông báo nội bộ",
    BULLETIN_TAG: "Thông báo chính thức",
    RESOURCES_TITLE: "Tài nguyên chung",
    VIEW_ALL: "Xem tất cả thông báo",
    PULSE: "Nhịp đập nhà hàng",
    WEATHER_CLOUDY: "28°C / Có mây",
    MAIN_LOBBY: "Sảnh chính",
    STALE_DURATION: (mins: number) => `(${mins} phút)`,

    STATS: {
      REVENUE: "Tổng doanh thu",
      ORDERS: "Đơn hàng mới",
      TABLES: "Bàn hoạt động",
      STAFF: "Nhân viên trực ca",
      REVENUE_DESC: (percent: string) => `${percent} so với tháng trước`,
      ORDERS_DESC: (percent: string) => `${percent} so với hôm qua`,
      TABLES_DESC: (percent: string) => `${percent} tỉ lệ sử dụng`,
      STAFF_DESC: (chefs: number, waiters: number) => `${chefs} đầu bếp, ${waiters} phục vụ`,
    },

    TABLE_OCCUPANCY: {
      TITLE: "Tình trạng sử dụng bàn",
      FREE: "Bàn trống",
      OCCUPIED: "Đang sử dụng",
      RESERVED: "Đã đặt trước",
    },

    RECENT_ORDERS: {
      TITLE: "Đơn hàng gần đây",
      ORDER_ID: "Mã đơn",
      CUSTOMER: "Khách hàng",
      TABLE: "Bàn",
      AMOUNT: "Số tiền",
      STATUS: "Trạng thái",
      TIME: "Thời gian",
      MINS_AGO: (mins: number) => `${mins} phút trước`,
      HOUR_AGO: (hours: number) => `${hours} giờ trước`,
      STATUS_COMPLETED: "Hoàn tất",
      STATUS_PREPARING: "Đang chế biến",
      STATUS_PENDING: "Chờ xử lý",
      STATUS_CANCELLED: "Đã hủy",
    },

    REVENUE_CHART: {
      TITLE: "Hiệu suất hàng tuần",
      AVG_DAILY: "Trung bình ngày",
      PEAK_DAY: "Ngày cao điểm",
      DAYS: {
        MON: "Thứ 2",
        TUE: "Thứ 3",
        WED: "Thứ 4",
        THU: "Thứ 5",
        FRI: "Thứ 6",
        SAT: "Thứ 7",
        SUN: "Chủ nhật",
      },
    },

    RESOURCES: {
      TITLE: "Tài nguyên chung",
      RECIPES: "Công thức chuẩn",
      SCHEDULE: "Lịch phân ca",
      TRAINING: "Cổng đào tạo",
      HACCP: "Nhật ký HACCP",
      SUPPORT: "Hỗ trợ IT Bếp",
      PUNCH_CLOCK: "Máy chấm công",
    },

    TOP_DISHES: {
      TITLE: "Món ăn bán chạy",
      ORDERS_COUNT: (count: number) => `${count} đơn trong tuần`,
    },
  },
};
