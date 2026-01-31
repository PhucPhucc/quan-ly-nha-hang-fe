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
    INFO: "Thông tin nhân viên",
    EMPTY: "Chưa có nhân viên",
    ADD: "Thêm nhân viên",
    EDIT: "Sửa nhân viên",
    DELETE: "Xóa nhân viên",
    FETCH_ERROR: "Không thể tải danh sách nhân viên",
    EMPLOYEECODE: "Mã nhân viên",
    FULLNAME: "Họ và tên",
    EMAIL: "Email",
    ROLE: "Vai trò",
    PHONE: "Số điện thoại",
    ADDRESS: "Địa chỉ",
    DOB: "Ngày sinh",
    STATUS: "Trạng thái",
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
    TITLE: "Bàn",
    INPROCESS: "Đang sử dụng",
    READY: "Bàn trống",
    CLEANING: "Đang dọn dẹp",
    EMPTY: "Chưa có bàn nào",
    FETCH_ERROR: "Không thể tải danh sách bàn",
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
};
