"use client";

import { QRCodeSVG } from "qrcode.react";
import React from "react";

const BANK_LABELS = {
  bank: "Ngân hàng:",
  accountName: "Chủ tài khoản:",
  accountNumber: "Số tài khoản:",
  amount: "Số tiền:",
  currency: "đ",
  desc: "Nội dung CT:",
};

interface BankTransferViewProps {
  payOSUrl: string;
  bankInfo: {
    accountName?: string;
    accountNumber?: string;
    bin?: string;
    amount?: number;
    description?: string;
  } | null;
  totalAmount: number;
}

export const BankTransferView = ({ payOSUrl, bankInfo, totalAmount }: BankTransferViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-2 animate-in fade-in slide-in-from-top-2">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-muted">
        <QRCodeSVG value={payOSUrl} size={100} level="M" />
      </div>

      {bankInfo && (
        <div className="w-full space-y-1 mt-1 text-[11px] bg-muted/40 p-2 rounded-md border border-muted">
          <div className="flex flex-col border-b border-muted/50 pb-1">
            <span className="text-muted-foreground uppercase text-[9px] font-medium">
              {BANK_LABELS.accountName}
            </span>
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase text-foreground">
                {bankInfo.accountName || "---"}
              </span>
              <span className="font-medium text-muted-foreground">{bankInfo.accountNumber}</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-muted/50 py-1">
            <span className="text-muted-foreground">{BANK_LABELS.amount}</span>
            <span className="font-black text-right text-red-600 text-xs">
              {(bankInfo.amount ?? totalAmount).toLocaleString()} {BANK_LABELS.currency}
            </span>
          </div>
          <div className="flex justify-between items-center pt-0.5">
            <span className="text-muted-foreground shrink-0 mr-2">{BANK_LABELS.desc}</span>
            <span className="font-bold text-right text-orange-600 truncate">
              {bankInfo.description || "---"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
