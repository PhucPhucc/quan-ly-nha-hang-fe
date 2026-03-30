import { formatCurrencyWithBranding, formatDateTimeWithBranding } from "@/lib/branding-formatting";
import { UI_TEXT } from "@/lib/UI_Text";
import type { BrandingSettingsDto } from "@/services/brandingService";
import { PreCheckBillItem, PreCheckBillResponse } from "@/types/Billing";

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

  // Process items to group combo children
  const processedItems: Array<PreCheckBillItem & { isChild: boolean }> = [];
  const hasCombo = data.items.some((item) => item.itemName.includes("(Combo)"));

  if (hasCombo) {
    const usedIndices = new Set<number>();

    data.items.forEach((item, index) => {
      if (usedIndices.has(index)) return;

      const isComboParent = item.itemName.includes("(Combo)");
      const isZeroPrice = item.unitPrice === 0 || item.lineTotal === 0;

      if (isComboParent) {
        processedItems.push({ ...item, isChild: false });
        usedIndices.add(index);

        // Gather all zero-price items as children of this combo
        data.items.forEach((childItem, childIndex) => {
          if (
            !usedIndices.has(childIndex) &&
            (childItem.unitPrice === 0 || childItem.lineTotal === 0) &&
            !childItem.itemName.includes("(Combo)")
          ) {
            processedItems.push({ ...childItem, isChild: true });
            usedIndices.add(childIndex);
          }
        });
      } else if (!isZeroPrice) {
        processedItems.push({ ...item, isChild: false });
        usedIndices.add(index);
      }
    });

    // Add remaining orphan zero-price items
    data.items.forEach((item, index) => {
      if (!usedIndices.has(index)) {
        processedItems.push({ ...item, isChild: false });
      }
    });
  } else {
    data.items.forEach((item) => {
      processedItems.push({ ...item, isChild: false });
    });
  }

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
        .item-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10px; }
        .item-table th { border-bottom: 1px solid #000; text-align: left; padding: 5px 0; }
        .item-table td { padding: 6px 0; border-bottom: 1px dotted #ccc; }
        .total-section { margin-top: 15px; border-top: 2px double #000; padding-top: 10px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 11px; }
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
          <div class="text-right">${UI_TEXT.ORDER.PRINT_TEMP.TABLE_PREFIX} <span class="bold">${data.tableNumber ? `${data.tableNumber}` : UI_TEXT.ORDER.PRINT_TEMP.TAKEAWAY_LABEL}</span></div>
          <div>${UI_TEXT.ORDER.PRINT_TEMP.CASHIER_LABEL} ${data.employeeName}</div>
        </div>
        
        <table class="item-table">
          <thead>
            <tr>
              <th style="width: 40%">${UI_TEXT.ORDER.PRINT_TEMP.ITEM_NAME_HEADER}</th>
              <th style="width: 15%; text-align: center;">${UI_TEXT.ORDER.PRINT_TEMP.QUANTITY_HEADER}</th>
              <th style="width: 20%; text-align: right;">${UI_TEXT.ORDER.PRINT_TEMP.UNIT_PRICE}</th>
              <th style="width: 25%; text-align: right;">${UI_TEXT.ORDER.PRINT_TEMP.AMOUNT_HEADER}</th>
            </tr>
          </thead>
          <tbody>
            ${processedItems
              .map(
                (item) => `
              <tr>
                <td style="${item.isChild ? "padding-left: 15px;" : ""}">
                  <div class="${item.isChild ? "" : "bold"}">${item.isChild ? "- " + item.itemName : item.itemName}</div>
                  ${item.optionsSummary ? `<div style="font-size: 10px; color: #444;">+ ${item.optionsSummary}</div>` : ""}
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${item.isChild ? "" : formatCurrencyWithBranding(item.unitPrice, branding)}</td>
                <td class="text-right">${item.isChild ? "" : formatCurrencyWithBranding(item.lineTotal, branding)}</td>
              </tr>
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
