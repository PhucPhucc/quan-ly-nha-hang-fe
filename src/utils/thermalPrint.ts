import { PreCheckBillResponse } from "@/types/Billing";

export const generateThermalHtml = (data: PreCheckBillResponse) => {
  const dateStr = new Date(data.printedAt).toLocaleString("vi-VN");

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
          <div class="bold shop-name">FOODHUB RESTAURANT</div>
          <div style="font-size: 12px;">123 Đường Ẩm Thực, Quận 1, HCM</div>
          <div style="font-size: 12px;">ĐT: 0123.456.789</div>
          <div class="divider"></div>
          <div class="bold" style="font-size: 16px; margin-top: 10px;">PHIẾU TẠM TÍNH</div>
          <div style="font-size: 13px;">Số: ${data.orderCode}</div>
        </div>
        
        <div style="font-size: 12px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>Ngày in: ${dateStr}</div>
          <div class="text-right">Bàn: <span class="bold">${data.tableNumber ? `Bàn ${data.tableNumber}` : "Mang về"}</span></div>
          <div>Thu ngân: ${data.employeeName}</div>
        </div>
        
        <table class="item-table">
          <thead>
            <tr>
              <th style="width: 55%">Tên món</th>
              <th style="width: 15%; text-align: center;">SL</th>
              <th style="width: 30%; text-align: right;">Thành tiền</th>
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
                <td class="text-right">${item.lineTotal.toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <div>Tiền hàng:</div>
            <div>${data.subTotal.toLocaleString()}đ</div>
          </div>
          ${
            data.discount > 0
              ? `
          <div class="total-row" style="color: #d00;">
            <div>Giảm giá ${data.voucherCode ? `(${data.voucherCode})` : ""}:</div>
            <div>-${data.discount.toLocaleString()}đ</div>
          </div>
          `
              : ""
          }
          <div class="total-row">
            <div>Thuế (${data.vatRate}%):</div>
            <div>${data.vat.toLocaleString()}đ</div>
          </div>
          <div class="divider" style="border-top-style: solid; border-top-width: 3px;"></div>
          <div class="total-row bold" style="font-size: 20px; margin-top: 10px;">
            <div>TỔNG CỘNG:</div>
            <div>${data.totalAmount.toLocaleString()}đ</div>
          </div>
        </div>
        
        <div class="footer text-center">
          <div class="bold" style="font-size: 14px;">CẢM ƠN QUÝ KHÁCH - HẸN GẶP LẠI</div>
          <div style="color: #555; font-size: 11px; margin-top: 10px;">
            Vui lòng kiểm tra kỹ hóa đơn trước khi rời quầy
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
