export interface VoucherApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentVoucherCode?: string;
}
