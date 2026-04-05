import { ApiResponse } from "@/types/Api";
import { PaymentMethod } from "@/types/enums";

import { apiFetch } from "./api";

export interface PaymentMethodConfigDto {
  paymentMethodConfigId: string;
  name: string;
  type: PaymentMethod;
  isActive: boolean;
  isDefault: boolean;
}

export const paymentMethodService = {
  getPaymentMethods: (): Promise<ApiResponse<PaymentMethodConfigDto[]>> =>
    apiFetch<PaymentMethodConfigDto[]>("/payment-methods"),
};
