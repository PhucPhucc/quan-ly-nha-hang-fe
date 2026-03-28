export const VOUCHER_APPLY_MODAL_TEXT = {
  APPLY_MODAL_TITLE: "Áp dụng mã giảm giá",
  APPLY_MODAL_DESC: "Nhập mã voucher để nhận ưu đãi cho đơn hàng.",
  APPLY_MODAL_PLACEHOLDER: "Nhập mã voucher...",
  APPLY_MODAL_APPLY: "Áp dụng",
  APPLY_MODAL_REMOVE: "Gỡ bỏ",
  APPLY_MODAL_CURRENT: "Mã đang áp dụng:",
  CONFIRM_SWITCH_TITLE: "Xác nhận đổi voucher",
  CONFIRM_SWITCH_DESC: (oldCode: string, newCode: string) =>
    `Đơn hàng đang áp dụng mã ${oldCode}. Nếu đổi sang ${newCode}, hệ thống sẽ gỡ mã cũ và áp dụng mã mới. Bạn có muốn tiếp tục không?`,
  CONFIRM_SWITCH_ACTION: "Đổi voucher",
  CANCEL: "Hủy",
} as const;
