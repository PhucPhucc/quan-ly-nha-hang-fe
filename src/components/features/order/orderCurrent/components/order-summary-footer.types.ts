export interface OrderSummaryFooterProps {
  subtotal: number;
  tax: number;
  total: number;
  discount?: number;
  voucherCode?: string;
}
