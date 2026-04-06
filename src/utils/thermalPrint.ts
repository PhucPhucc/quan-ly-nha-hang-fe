import { formatCurrencyWithBranding, formatDateTimeWithBranding } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import type { BrandingSettingsDto } from "@/services/brandingService";
import { PreCheckBillItem, PreCheckBillResponse } from "@/types/Billing";

const normalizeReceiptText = (value?: string): string =>
  (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

const normalizeOptionsSummary = (value?: string): string => {
  if (!value) {
    return "";
  }

  return value
    .split(/[;,]/)
    .map((part) => normalizeReceiptText(part))
    .filter(Boolean)
    .sort()
    .join("|");
};

export const aggregateReceiptItems = (items: PreCheckBillItem[]): PreCheckBillItem[] => {
  const groupedItems = new Map<string, PreCheckBillItem>();

  items.forEach((item) => {
    const key = [
      normalizeReceiptText(item.itemName),
      item.isFreeItem ? "free" : "paid",
      item.unitPrice,
      normalizeOptionsSummary(item.optionsSummary),
    ].join("||");
    const existing = groupedItems.get(key);

    if (!existing) {
      groupedItems.set(key, { ...item });
      return;
    }

    existing.quantity += item.quantity;
    existing.lineTotal += item.lineTotal;
  });

  return Array.from(groupedItems.values());
};

export interface ReceiptDisplayItem extends PreCheckBillItem {
  isChild: boolean;
}

export const buildReceiptDisplayItems = (items: PreCheckBillItem[]): ReceiptDisplayItem[] => {
  const aggregatedItems = aggregateReceiptItems(items);
  const processedItems: ReceiptDisplayItem[] = [];
  const hasCombo = aggregatedItems.some((item) => item.itemName.includes("(Combo)"));

  if (!hasCombo) {
    return aggregatedItems.map((item) => ({ ...item, isChild: false }));
  }

  const usedIndices = new Set<number>();

  aggregatedItems.forEach((item, index) => {
    if (usedIndices.has(index)) {
      return;
    }

    const isComboParent = item.itemName.includes("(Combo)");
    const isZeroPrice = !item.isFreeItem && (item.unitPrice === 0 || item.lineTotal === 0);

    if (isComboParent) {
      processedItems.push({ ...item, isChild: false });
      usedIndices.add(index);

      aggregatedItems.forEach((childItem, childIndex) => {
        if (
          !usedIndices.has(childIndex) &&
          !childItem.isFreeItem &&
          (childItem.unitPrice === 0 || childItem.lineTotal === 0) &&
          !childItem.itemName.includes("(Combo)")
        ) {
          processedItems.push({ ...childItem, isChild: true });
          usedIndices.add(childIndex);
        }
      });

      return;
    }

    if (!isZeroPrice) {
      processedItems.push({ ...item, isChild: false });
      usedIndices.add(index);
    }
  });

  aggregatedItems.forEach((item, index) => {
    if (!usedIndices.has(index)) {
      processedItems.push({ ...item, isChild: false });
    }
  });

  return processedItems;
};

export const generateThermalHtml = (
  data: PreCheckBillResponse,
  branding?: Partial<BrandingSettingsDto>
) => {
  const dateStr = formatDateTimeWithBranding(data.printedAt, branding);
  const restaurantName = branding?.restaurantName ?? UI_TEXT.COMMON.NAME_RESTAURANT;
  const billTitle = branding?.billTitle ?? UI_TEXT.ORDER.PRINT_TEMP.TITLE;
  const footer = branding?.billFooter ?? UI_TEXT.ORDER.PRINT_TEMP.FOOTER_THANK_YOU;
  const address = branding?.address ?? UI_TEXT.ORDER.PRINT_TEMP.SHOP_ADDRESS;
  const phone = branding?.phone ?? UI_TEXT.ORDER.PRINT_TEMP.SHOP_PHONE;
  const logoUrl = branding?.logoUrl;
  const processedItems = buildReceiptDisplayItems(data.items);
  const giftLabel = UI_TEXT.VOUCHER.GIFT_LABEL;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @page { 
          size: 55mm 85mm;
          margin: 0; 
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          width: 100%;
          background: #f0f0f0;
          display: flex;
          justify-content: center;
          padding: 8px 0;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 55mm !important; 
          max-width: 55mm;
          background: #fff;
          color: #000;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-size: 10px;
          line-height: 1.2;
        }
        
        .receipt-content {
          padding: 10px 3mm;
          width: 100%;
        }

        @media print {
          html, body { background: #fff; padding: 0; display: block; }
          body {
            box-shadow: none;
            width: 55mm !important; 
            margin: 0 auto !important;
          }
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .header { margin-bottom: 15px; border-bottom: 2px double #000; padding-bottom: 10px; }
        .shop-name { font-size: 11px; font-weight: bold; letter-spacing: 0.5px; }
        .logo { max-height: 50px; max-width: 100px; object-fit: contain; margin: 0 auto 8px auto; display: block; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .item-table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10px; table-layout: fixed; }
        .item-table th { border-bottom: 1px solid #000; text-align: left; padding: 3px 0 4px 0; }
        .item-table td { padding: 3px 0; border-bottom: 1px dotted #ccc; vertical-align: top; overflow: hidden; }
        .item-table td:nth-child(3), .item-table td:nth-child(4) { max-width: 0; word-break: break-all; }
        .item-line { display: flex; gap: 1px; align-items: flex-start; }
        .item-marker { flex: none; white-space: nowrap; }
        .item-name { flex: 1; min-width: 0; overflow-wrap: anywhere; word-break: break-word; }
        .option-row td { border-bottom: 1px dotted #eee; padding-top: 0; }
        .option-line { display: flex; gap: 1px; align-items: flex-start; padding-left: 3px; }
        .option-marker { flex: none; white-space: nowrap; }
        .option-name { flex: 1; min-width: 0; overflow-wrap: anywhere; word-break: break-word; color: #444; font-size: 9px; }
        .total-section { margin-top: 15px; border-top: 2px double #000; padding-top: 10px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px; }
        .total-row > div:last-child { max-width: 50%; word-break: break-all; text-align: right; }
        .footer { margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; font-size: 9px; padding-bottom: 15px; padding-left: 5px; padding-right: 5px; }

      </style>
    </head>
    <body>
      <div class="receipt-content">
        <div class="header text-center">
          ${logoUrl ? `<img class="logo" src="${logoUrl}" alt="${restaurantName}" />` : ""}
          <div class="bold shop-name">${restaurantName}</div>
          <div style="font-size: 10px;">${address}</div>
          ${phone ? `<div style="font-size: 10px;">${UI_TEXT.ORDER.PRINT_TEMP.SHOP_PHONE_PREFIX} ${phone}</div>` : ""}
          <div class="divider"></div>
          <div class="bold" style="font-size: 11px; margin-top: 6px;">${billTitle}</div>
          <div style="font-size: 11px;">${UI_TEXT.ORDER.PRINT_TEMP.RECEIPT_ID_PREFIX} ${data.orderCode}</div>
        </div>
        
        <div style="font-size: 11px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>${UI_TEXT.ORDER.PRINT_TEMP.PRINT_DATE} ${dateStr}</div>
          <div class="text-right">
            ${
              data.tableLabel
                ? `${UI_TEXT.ORDER.BOARD.TABLE_ZONE}: <span class="bold">${data.tableLabel}</span>`
                : `${UI_TEXT.ORDER.PRINT_TEMP.TABLE_PREFIX} <span class="bold">${
                    data.tableNumber
                      ? `Bàn ${data.tableNumber}`
                      : UI_TEXT.ORDER.PRINT_TEMP.TAKEAWAY_LABEL
                  }</span>`
            }
          </div>
          <div>${UI_TEXT.ORDER.PRINT_TEMP.CASHIER_LABEL} ${data.employeeName}</div>
        </div>
        
        <table class="item-table">
          <thead>
            <tr>
              <th style="width: 46%">${UI_TEXT.ORDER.PRINT_TEMP.ITEM_NAME_HEADER}</th>
              <th style="width: 12%; text-align: center;">${UI_TEXT.ORDER.PRINT_TEMP.QUANTITY_HEADER}</th>
              <th style="width: 20%; text-align: right;">${UI_TEXT.ORDER.PRINT_TEMP.UNIT_PRICE}</th>
              <th style="width: 22%; text-align: right;">${UI_TEXT.ORDER.PRINT_TEMP.AMOUNT_HEADER}</th>
            </tr>
          </thead>
          <tbody>
            ${processedItems
              .map(
                (item) => `
              <tr>
                <td style="${item.isChild ? "padding-left: 15px;" : ""}">
                  <div class="item-line ${item.isChild ? "" : "bold"}">
                    ${
                      item.isChild
                        ? `<span class="item-marker">-</span><span class="item-name">${item.itemName}</span>`
                        : `<span class="item-name">${item.itemName}${item.isFreeItem ? ` (${giftLabel})` : ""}</span>`
                    }
                  </div>
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${item.isChild ? "" : formatCurrencyWithBranding(item.unitPrice, branding)}</td>
                <td class="text-right">${item.isChild ? "" : formatCurrencyWithBranding(item.lineTotal, branding)}</td>
              </tr>
              ${
                item.optionItems?.length
                  ? item.optionItems
                      .map(
                        (opt) => `
              <tr class="option-row">
                <td style="${item.isChild ? "padding-left: 16px;" : "padding-left: 6px;"}">
                  <div class="option-line">
                    <span class="option-marker">+</span>
                    <span class="option-name">${opt.label}</span>
                  </div>
                </td>
                <td class="text-center">${opt.quantity}</td>
                <td class="text-right">${formatCurrencyWithBranding(opt.unitPrice, branding)}</td>
                <td class="text-right">${formatCurrencyWithBranding(opt.lineTotal, branding)}</td>
              </tr>
            `
                      )
                      .join("")
                  : ""
              }
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.SUBTOTAL_LABEL}</div>
            <div>${formatCurrencyWithBranding(data.subTotal, branding)}</div>
          </div>
          ${
            data.discount > 0
              ? `
          <div class="total-row" style="color: #d00;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.DISCOUNT_LABEL} ${data.voucherCode ? `(${data.voucherCode})` : ""}:</div>
            <div>${formatCurrencyWithBranding(-data.discount, branding)}</div>
          </div>
          `
              : ""
          }
          <div class="total-row">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.TAX_LABEL_PREFIX} (${data.vatRate}%):</div>
            <div>${formatCurrencyWithBranding(data.vat, branding)}</div>
          </div>
          <div class="divider" style="border-top-style: solid; border-top-width: 3px;"></div>
          <div class="total-row bold" style="font-size: 12px; margin-top: 10px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.TOTAL_LABEL}</div>
            <div>${formatCurrencyWithBranding(data.totalAmount, branding)}</div>
          </div>
          ${
            data.paymentMethod
              ? `
          <div class="divider" style="margin: 15px 0 10px 0;"></div>
          <div class="total-row" style="font-size: 11px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.PAYMENT_METHOD_LABEL}</div>
            <div class="bold">${data.paymentMethod}</div>
          </div>
          <div class="total-row" style="font-size: 11px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.CUSTOMER_GAVE_LABEL}</div>
            <div class="bold">${formatCurrencyWithBranding(data.amountReceived ?? data.totalAmount, branding)}</div>
          </div>
          <div class="total-row" style="font-size: 11px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.CHANGE_LABEL}</div>
            <div class="bold">${formatCurrencyWithBranding(data.changeAmount ?? 0, branding)}</div>
          </div>
          `
              : ""
          }
        </div>
        
        <div class="footer text-center">
          <div class="bold" style="font-size: 11px;">${footer}</div>
          <div style="color: #444; font-size: 9px; margin-top: 8px;">
            ${UI_TEXT.ORDER.PRINT_TEMP.FOOTER_CHECK_BEFORE_LEAVE}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const printThermalReceipt = (
  data: PreCheckBillResponse,
  branding?: Partial<BrandingSettingsDto>
) => {
  const html = generateThermalHtml(data, branding);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};

export const printPdfBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");

  // Thay vì display: none, sử dụng kỹ thuật đẩy ra khỏi màn hình để trình duyệt không chặn lệnh in
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.left = "-9999px";

  document.body.appendChild(iframe);

  iframe.src = url;

  // Đợi cho PDF load xong vào iframe
  iframe.onload = () => {
    // Thêm một chút delay để plugin PDF của trình duyệt kịp render
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error("Print dialog failed:", e);
      }

      // Dọn dẹp sau khi in
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        URL.revokeObjectURL(url);
      }, 5000); // Tăng thời gian dọn dẹp để không làm ngắt quãng hộp thoại in
    }, 1000);
  };
};
