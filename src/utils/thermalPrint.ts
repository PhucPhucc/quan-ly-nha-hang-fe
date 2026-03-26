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
        /* Thiết lập trang in Siêu rộng (150mm) để choán toàn bộ không gian A4 */
        @page { 
          size: 150mm auto;
          margin: 0; 
        }
        html, body {
          margin: 0;
          padding: 0;
          background: #000; /* Nền đen tuyền */
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          min-height: 100vh;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 180mm !important; 
          margin: 0 auto;
          background: #fff;
          color: #000;
          box-shadow: 0 0 80px rgba(0,0,0,1);
          position: relative;
          overflow-x: hidden;
          font-size: 22px; /* Chữ siêu to */
          line-height: 1.8; /* Khoảng cách dòng cực thoáng */
        }
        
        /* Hiệu ứng xé giấy khổng lồ */
        body::before, body::after {
          content: "";
          position: absolute;
          left: 0; width: 100%; height: 15px;
          background: linear-gradient(-45deg, #000 7px, transparent 0), 
                      linear-gradient(45deg, #000 7px, transparent 0);
          background-size: 15px 15px;
          z-index: 10;
        }
        body::before { top: 0; }
        body::after { bottom: 0; transform: rotate(180deg); }

        .receipt-content {
          padding: 60px 20mm 100px 20mm; /* Lề rộng 20mm để nội dung không bị sát mép */
          box-sizing: border-box;
          width: 100%;
        }

        @media print {
          html, body { background: #fff; display: block; }
          body {
            box-shadow: none;
            width: 180mm !important; 
            margin: 0 auto !important;
          }
          body::before, body::after { display: none; }
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .header { margin-bottom: 40px; border-bottom: 8px double #000; padding-bottom: 30px; }
        .shop-name { font-size: 45px; font-weight: 900; letter-spacing: 5px; }
        .divider { border-top: 4px dashed #000; margin: 35px 0; }
        .item-table { width: 100%; border-collapse: collapse; margin: 30px 0; font-size: 24px; }
        .item-table th { border-bottom: 4px solid #000; text-align: left; padding: 15px 0; font-size: 22px; }
        .item-table td { padding: 25px 0; border-bottom: 1px dotted #444; }
        .total-section { margin-top: 40px; border-top: 8px double #000; padding-top: 35px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 28px; }
        .footer { margin-top: 80px; border-top: 4px dashed #000; padding-top: 40px; font-size: 18px; padding-bottom: 120px; }
        .qr-placeholder { margin: 40px auto; width: 220px; height: 220px; border: 6px solid #000; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="receipt-content">
        <div class="header text-center">
          <div class="bold shop-name">FOODHUB RESTAURANT</div>
          <div>123 Đường Ẩm Thực, Quận 1, HCM</div>
          <div>ĐT: 0123.456.789</div>
          <div class="divider"></div>
          <div class="bold" style="font-size: 15px; margin-top: 5px;">PHIẾU TẠM TÍNH</div>
          <div>Số: ${data.orderCode}</div>
        </div>
        
        <div style="font-size: 12px; margin-bottom: 10px;">
          <div>Ngày in: ${dateStr}</div>
          <div>Bàn: <span class="bold">${data.tableNumber ? `Bàn ${data.tableNumber}` : "Mang về"}</span></div>
          <div>Thu ngân: ${data.employeeName}</div>
        </div>
        
        <table class="item-table">
          <thead>
            <tr>
              <th style="width: 50%">Món</th>
              <th style="width: 15%; text-align: center;">SL</th>
              <th style="width: 35%; text-align: right;">T.Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item) => `
              <tr>
                <td>
                  <div>${item.itemName}</div>
                  ${item.optionsSummary ? `<div style="font-size: 11px; font-style: italic;">+ ${item.optionsSummary}</div>` : ""}
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
            <div>${data.subTotal.toLocaleString()}</div>
          </div>
          ${
            data.discount > 0
              ? `
          <div class="total-row">
            <div>Giảm giá:</div>
            <div>-${data.discount.toLocaleString()}</div>
          </div>
          `
              : ""
          }
          <div class="total-row">
            <div>Thuế (${data.vatRate}%):</div>
            <div>${data.vat.toLocaleString()}</div>
          </div>
          <div class="divider"></div>
          <div class="total-row bold" style="font-size: 16px;">
            <div>TỔNG CỘNG:</div>
            <div>${data.totalAmount.toLocaleString()}đ</div>
          </div>
        </div>
        
        <div class="footer text-center">
          <div class="qr-placeholder">QR CODE<br/>Feedback</div>
          <div class="bold">CẢM ƠN QUÝ KHÁCH - HẸN GẶP LẠI</div>
          <div style="margin-top: 5px;">Mật khẩu Wifi: foodhub@2024</div>
          <div style="color: #666; font-size: 10px; margin-top: 2px;">Vui lòng kiểm tra kỹ hóa đơn trước khi rời quầy</div>
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
