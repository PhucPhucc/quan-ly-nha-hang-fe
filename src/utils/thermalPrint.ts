import { UI_TEXT } from "@/lib/UI_Text";
import { PreCheckBillResponse } from "@/types/Billing";

export const generateThermalHtml = (data: PreCheckBillResponse) => {
  const dateStr = new Date(data.printedAt).toLocaleString(UI_TEXT.COMMON.LOCALE_VI);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @page { 
          size: 165mm auto;
          margin: 0; 
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          width: 100%;
          background: #f0f0f0;
          display: flex;
          justify-content: center;
          padding: 20px 0;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 165mm !important; 
          background: #fff;
          color: #000;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
          font-size: 13px;
          line-height: 1.6;
        }
        
        .receipt-content {
          padding: 40px 15mm;
          width: 100%;
        }

        @media print {
          html, body { background: #fff; padding: 0; display: block; }
          body {
            box-shadow: none;
            width: 165mm !important; 
            margin: 0 !important;
          }
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .header { margin-bottom: 30px; border-bottom: 5px double #000; padding-bottom: 20px; }
        .shop-name { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
        .divider { border-top: 2px dashed #000; margin: 25px 0; }
        .item-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
        .item-table th { border-bottom: 3px solid #000; text-align: left; padding: 10px 0; }
        .item-table td { padding: 15px 0; border-bottom: 1px dotted #ccc; }
        .total-section { margin-top: 30px; border-top: 5px double #000; padding-top: 25px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 15px; }
        .footer { margin-top: 30px; border-top: 2px dashed #000; padding-top: 20px; font-size: 11px; padding-bottom: 40px; }

      </style>
    </head>
    <body>
      <div class="receipt-content">
        <div class="header text-center">
          <div class="bold shop-name">${UI_TEXT.COMMON.NAME_RESTAURANT}</div>
          <div style="font-size: 12px;">${UI_TEXT.ORDER.PRINT_TEMP.SHOP_ADDRESS}</div>
          <div style="font-size: 12px;">${UI_TEXT.ORDER.PRINT_TEMP.SHOP_PHONE_PREFIX} ${UI_TEXT.ORDER.PRINT_TEMP.SHOP_PHONE}</div>
          <div class="divider"></div>
          <div class="bold" style="font-size: 16px; margin-top: 10px;">${UI_TEXT.ORDER.PRINT_TEMP.TITLE}</div>
          <div style="font-size: 13px;">${UI_TEXT.ORDER.PRINT_TEMP.RECEIPT_ID_PREFIX} ${data.orderCode}</div>
        </div>
        
        <div style="font-size: 12px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>${UI_TEXT.ORDER.PRINT_TEMP.PRINT_DATE} ${dateStr}</div>
          <div class="text-right">${UI_TEXT.ORDER.PRINT_TEMP.TABLE_PREFIX} <span class="bold">${data.tableNumber ? `${data.tableNumber}` : UI_TEXT.ORDER.PRINT_TEMP.TAKEAWAY_LABEL}</span></div>
          <div>${UI_TEXT.ORDER.PRINT_TEMP.CASHIER_LABEL} ${data.employeeName}</div>
        </div>
        
        <table class="item-table">
          <thead>
            <tr>
              <th style="width: 55%">${UI_TEXT.ORDER.PRINT_TEMP.ITEM_NAME_HEADER}</th>
              <th style="width: 15%; text-align: center;">${UI_TEXT.ORDER.PRINT_TEMP.QUANTITY_HEADER}</th>
              <th style="width: 30%; text-align: right;">${UI_TEXT.ORDER.PRINT_TEMP.AMOUNT_HEADER}</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr>
                <td>
                  <div class="bold">${item.itemName}</div>
                  ${item.optionsSummary ? `<div style="font-size: 11px; color: #444;">+ ${item.optionsSummary}</div>` : ""}
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${item.lineTotal.toLocaleString()}${UI_TEXT.COMMON.CURRENCY}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.SUBTOTAL_LABEL}</div>
            <div>${data.subTotal.toLocaleString()}${UI_TEXT.COMMON.CURRENCY}</div>
          </div>
          ${
            data.discount > 0
              ? `
          <div class="total-row" style="color: #d00;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.DISCOUNT_LABEL} ${data.voucherCode ? `(${data.voucherCode})` : ""}:</div>
            <div>-${data.discount.toLocaleString()}${UI_TEXT.COMMON.CURRENCY}</div>
          </div>
          `
              : ""
          }
          <div class="total-row">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.TAX_LABEL_PREFIX} (${data.vatRate}%):</div>
            <div>${data.vat.toLocaleString()}${UI_TEXT.COMMON.CURRENCY}</div>
          </div>
          <div class="divider" style="border-top-style: solid; border-top-width: 3px;"></div>
          <div class="total-row bold" style="font-size: 20px; margin-top: 10px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.TOTAL_LABEL}</div>
            <div>${data.totalAmount.toLocaleString()}${UI_TEXT.COMMON.CURRENCY}</div>
          </div>
          ${
            data.paymentMethod
              ? `
          <div class="divider" style="margin: 15px 0 10px 0;"></div>
          <div class="total-row" style="font-size: 13px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.PAYMENT_METHOD_LABEL}</div>
            <div class="bold">${data.paymentMethod}</div>
          </div>
          <div class="total-row" style="font-size: 13px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.CUSTOMER_GAVE_LABEL}</div>
            <div class="bold">${(data.amountReceived ?? data.totalAmount).toLocaleString()}${UI_TEXT.COMMON.CURRENCY}</div>
          </div>
          <div class="total-row" style="font-size: 13px;">
            <div>${UI_TEXT.ORDER.PRINT_TEMP.CHANGE_LABEL}</div>
            <div class="bold">${(data.changeAmount ?? 0).toLocaleString()}${UI_TEXT.COMMON.CURRENCY}</div>
          </div>
          `
              : ""
          }
        </div>
        
        <div class="footer text-center">
          <div class="bold" style="font-size: 14px;">${UI_TEXT.ORDER.PRINT_TEMP.FOOTER_THANK_YOU}</div>
          <div style="color: #555; font-size: 11px; margin-top: 10px;">
            ${UI_TEXT.ORDER.PRINT_TEMP.FOOTER_CHECK_BEFORE_LEAVE}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const printThermalReceipt = (data: PreCheckBillResponse) => {
  const html = generateThermalHtml(data);
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
