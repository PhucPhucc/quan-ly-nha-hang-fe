import { ApiResponse } from "@/types/Api";

import { apiFetch } from "./api";

export interface CreateInvoiceResponse {
  invoiceId: string;
  invoiceNumber: string;
}

export const invoiceService = {
  createInvoice: (
    orderId: string,
    amountReceived: number
  ): Promise<ApiResponse<CreateInvoiceResponse>> =>
    apiFetch<CreateInvoiceResponse>(
      `/invoices?orderId=${orderId}&amountReceived=${amountReceived}`,
      {
        method: "POST",
      }
    ),

  getInvoicePdf: (invoiceId: string): Promise<ApiResponse<Blob>> =>
    apiFetch<Blob>(`/invoices/${invoiceId}/pdf`, {
      method: "GET",
      responseType: "blob",
    }),
};
