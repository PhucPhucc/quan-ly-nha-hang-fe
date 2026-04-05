"use client";

import { DollarSign, Loader2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethod } from "@/types/enums";

import { BankTransferView } from "./CheckoutComponents";
import { useCheckout } from "./useCheckout";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const {
    selectedMethod,
    setSelectedMethod,
    customerGiven,
    setCustomerGiven,
    isProcessing,
    payOSUrl,
    bankInfo,
    handleCheckout,
    calculateChange,
    handleQuickAmount,
    handleSyncPayment,
  } = useCheckout(isOpen, onClose, totalAmount);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <DollarSign className="w-5 h-5 text-primary" />
            {UI_TEXT.ORDER.CURRENT.CHECKOUT_TITLE}
          </DialogTitle>
          <DialogDescription>{UI_TEXT.ORDER.CURRENT.CHECKOUT_DESC}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
            <span className="font-semibold text-secondary-foreground">
              {UI_TEXT.ORDER.CURRENT.TOTAL_AMOUNT}
            </span>
            <span className="text-2xl font-black text-primary">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-sm">{UI_TEXT.ORDER.CURRENT.PAYMENT_METHOD}</span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedMethod === PaymentMethod.Cash ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.Cash)}
                className="w-full text-xs font-bold"
              >
                {UI_TEXT.ORDER.CURRENT.CASH}
              </Button>
              <Button
                variant={selectedMethod === PaymentMethod.BankTransfer ? "default" : "outline"}
                onClick={() => setSelectedMethod(PaymentMethod.BankTransfer)}
                className="w-full text-xs font-bold"
              >
                {UI_TEXT.ORDER.CURRENT.TRANSFER}
              </Button>
            </div>
          </div>

          {selectedMethod === PaymentMethod.Cash && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1">
                <span className="font-semibold text-sm">{UI_TEXT.ORDER.CURRENT.CUSTOMER_GAVE}</span>
                <Input
                  type="text"
                  placeholder="Nhập số tiền khách đưa..."
                  value={customerGiven}
                  onChange={(e) => setCustomerGiven(e.target.value)}
                  className="font-bold text-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[totalAmount, 500000, 1000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="secondary"
                    size="sm"
                    className="text-xs font-bold"
                    onClick={() => handleQuickAmount(amount)}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-muted border border-muted">
                <span className="font-semibold text-sm text-muted-foreground">
                  {UI_TEXT.ORDER.CURRENT.CHANGE}
                </span>
                <span className="font-black text-lg text-primary/90">
                  {formatCurrency(calculateChange())}
                </span>
              </div>
            </div>
          )}

          {selectedMethod === PaymentMethod.BankTransfer && payOSUrl && (
            <BankTransferView payOSUrl={payOSUrl} bankInfo={bankInfo} totalAmount={totalAmount} />
          )}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="min-w-28 font-semibold text-foreground"
          >
            {UI_TEXT.COMMON.CANCEL_EN}
          </Button>

          {selectedMethod !== PaymentMethod.BankTransfer ? (
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="min-w-40 font-bold text-primary-foreground"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {UI_TEXT.ORDER.CURRENT.PROCESSING}
                </>
              ) : (
                UI_TEXT.ORDER.CURRENT.CONFIRM_PAYMENT
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSyncPayment}
              disabled={isProcessing}
              className="min-w-40 font-bold text-primary-foreground"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {UI_TEXT.ORDER.CURRENT.SYNCING}
                </>
              ) : (
                UI_TEXT.ORDER.CURRENT.SYNC_PAYMENT
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
