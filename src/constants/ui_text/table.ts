export const TABLE = {
  TITLE: "Sơ đồ bàn",
  SERVING: "Đang sử dụng",
  READY: "Bàn trống",
  CLEANING: "Đang dọn dẹp",
  RESERVED: "Đã đặt trước",
  EMPTY: "Chưa có bàn nào",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn tất",
  FETCH_ERROR: "Không thể tải danh sách bàn",
  RESERVATION_BTN: "Đặt bàn",
  PEOPLE: "Khách",
  NO_TABLES_FOUND: "Không tìm thấy bàn nào phù hợp.",
  TABLE_NUMBER(num: number) {
    return `Bàn ${num}`;
  },
};
