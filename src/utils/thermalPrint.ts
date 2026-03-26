import { PreCheckBillResponse } from "@/types/Billing";

export const generateThermalHtml = (data: PreCheckBillResponse) => {
  const dateStr = new Date(data.printedAt).toLocaleString("vi-VN");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 80mm;
          margin: 0;
          padding: 5mm;
          font-size: 12px;
          line-height: 1.2;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .header { margin-bottom: 5mm; }
        .divider { border-top: 1px dashed black; margin: 2mm 0; }
        .item-row { display: flex; justify-content: space-between; margin-bottom: 1mm; }
        .item-name { flex: 1; }
        .item-qty { width: 10mm; text-align: center; }
        .item-price { width: 20mm; text-align: right; }
        .footer { margin-top: 5mm; font-size: 10px; }
        @media print {
          @page { margin: 0; }
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header text-center">
        <div class="bold" style="font-size: 16px;">FOODHUB RESTAURANT</div>
        <div>HÓA ĐƠN THANH TOÁN</div>
        <div class="bold">Số: ${data.orderCode}</div>
      </div>
      
      <div>
        <div>Ngày: ${dateStr}</div>
        <div>Bàn: ${data.tableNumber ? `Bàn ${data.tableNumber}` : "Mang về"}</div>
        <div>Nhân viên: ${data.employeeName}</div>
        ${data.customerName ? `<div>Khách hàng: ${data.customerName}</div>` : ""}
      </div>
      
      <div class="divider"></div>
      
      <div class="item-row bold">
        <div class="item-name">Tên món</div>
        <div class="item-qty">SL</div>
        <div class="item-price">T.Tiền</div>
      </div>
      
      <div class="divider"></div>
      
      ${data.items
        .map(
          (item) => `
        <div class="item-row">
          <div class="item-name">
            ${item.itemName}
            ${item.optionsSummary ? `<br/><small><i>${item.optionsSummary}</i></small>` : ""}
          </div>
          <div class="item-qty">${item.quantity}</div>
          <div class="item-price">${item.lineTotal.toLocaleString()}</div>
        </div>
      `
        )
        .join("")}
      
      <div class="divider"></div>
      
      <div class="item-row">
        <div>Tiền hàng:</div>
        <div class="bold">${data.subTotal.toLocaleString()}đ</div>
      </div>
      ${
        data.discount > 0
          ? `
      <div class="item-row">
        <div>Giảm giá:</div>
        <div class="bold">-${data.discount.toLocaleString()}đ</div>
      </div>
      `
          : ""
      }
      <div class="item-row">
        <div>Thuế (${data.vatRate}%):</div>
        <div class="bold">${data.vat.toLocaleString()}đ</div>
      </div>
      
      <div class="divider"></div>
      
      <div class="item-row" style="font-size: 14px;">
        <div class="bold">TỔNG CỘNG:</div>
        <div class="bold">${data.totalAmount.toLocaleString()}đ</div>
      </div>
      
      <div class="footer text-center">
        <div>Cảm ơn quý khách và hẹn gặp lại!</div>
        <div>Powered by FoodHub System</div>
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
