// src/constants/UI_Text.ts

export const UI_TEXT = {
  COMMON: {
    LOADING: "Đang tải...",
    ERROR: "Có lỗi xảy ra",
    RETRY: "Thử lại",
    SAVE: "Lưu",
    CANCEL: "Hủy",
    CONFIRM: "Xác nhận",
  },

  AUTH: {
    LOGIN: "Đăng nhập",
    LOGOUT: "Đăng xuất",
    REGISTER: "Đăng ký",
    EMAIL: "Email",
    PASSWORD: "Mật khẩu",
  },

  EMPLOYEE: {
    TITLE: "Danh sách nhân viên",
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
} as const;
