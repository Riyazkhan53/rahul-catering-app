import PDFDocument from "pdfkit";
import path from "path";

export function generateListPDF(list) {
  const doc = new PDFDocument({ size: "LEGAL", margin: 40 });

  /* ---------- ASSETS ---------- */
  const fontTamil = path.join(process.cwd(), "public/fonts/NotoSansTamil-Regular.ttf");
  const headerLogo = path.join(process.cwd(), "assets/headerLogo.png");
  const watermark = path.join(process.cwd(), "assets/roundlogo3.png");

  doc.registerFont("Tamil", fontTamil);
  doc.font("Tamil");

  /* ---------- LAYOUT ---------- */
  const PAGE_WIDTH = doc.page.width;
  const PAGE_HEIGHT = doc.page.height;

  const HEADER_Y = 30;
  const HEADER_HEIGHT = 80;

  const FOOTER_HEIGHT = 70;
  const FOOTER_Y = PAGE_HEIGHT - FOOTER_HEIGHT;

  const START_Y = HEADER_Y + HEADER_HEIGHT + 20;

  const TABLE_WIDTH = 235;
  const LEFT_X = 40;
  const RIGHT_X = 320;

  const ROW_PADDING = 6;
  const COLUMN_GAP = 20;

  let index = 0;
  let pageNo = 1;

  while (index < list.items.length) {
    if (pageNo > 1) doc.addPage();

    drawHeader(doc, headerLogo);
    drawWatermark(doc, watermark);
    drawFooter(doc, FOOTER_Y, pageNo);

    let leftY = START_Y;
    let rightY = START_Y;

    const maxY = FOOTER_Y - 10;

    while (index < list.items.length) {
      const item = list.items[index];

      const column = leftY <= rightY ? "left" : "right";
      const x = column === "left" ? LEFT_X : RIGHT_X;
      const y = column === "left" ? leftY : rightY;

      const textHeight = doc.heightOfString(
        `${item.name} / ${item.tamilName || ""}`,
        { width: TABLE_WIDTH - 70 }
      );

      const rowHeight = Math.max(28, textHeight + ROW_PADDING * 2);

      // 🚫 STOP only when page is FULL
      if (y + rowHeight > maxY) break;

      drawRow(doc, x, y, TABLE_WIDTH, rowHeight, item);

      if (column === "left") leftY += rowHeight + COLUMN_GAP;
      else rightY += rowHeight + COLUMN_GAP;

      index++;
    }

    pageNo++;
  }

  return doc;
}

/* ================= HEADER ================= */

function drawHeader(doc, logo) {
  const width = 260;
  const x = (doc.page.width - width) / 2;

  doc.image(logo, x, 30, { width });

  doc
    .moveTo(40, 100)
    .lineTo(doc.page.width - 40, 100)
    .lineWidth(2)
    .strokeColor("#ADC455")
    .stroke();
}

/* ================= WATERMARK ================= */

function drawWatermark(doc, watermark) {
  doc.opacity(0.12);
  doc.image(watermark, (doc.page.width - 300) / 2, 320, { width: 300 });
  doc.opacity(1);
}

/* ================= FOOTER ================= */

function drawFooter(doc, y, pageNo) {
  doc
    .moveTo(40, y)
    .lineTo(doc.page.width - 40, y)
    .lineWidth(1)
    .strokeColor("#ccc")
    .stroke();

  doc
    .fontSize(10)
    .fillColor("#000")
    .text(
      "📍 Coonoor, The Nilgiris – 643105 | India",
      40,
      y + 12,
      { align: "center", width: doc.page.width - 80 }
    )
    .text(
      "Instagram: @rahul_catering_events",
      40,
      y + 26,
      { align: "center", width: doc.page.width - 80 }
    )
    .fontSize(9)
    .text(
      `Page ${pageNo}`,
      40,
      y + 42,
      { align: "center", width: doc.page.width - 80 }
    );
}

/* ================= ROW ================= */

function drawRow(doc, x, y, width, height, item) {
  doc
    .roundedRect(x, y, width, height, 8)
    .strokeColor("#ddd")
    .lineWidth(1)
    .stroke();

  doc
    .fontSize(11)
    .fillColor("#000")
    .text(
      `${item.name} / ${item.tamilName || ""}`,
      x + 10,
      y + 6,
      { width: width - 70 }
    );

  doc
    .fontSize(11)
    .text(
      `${item.quantity} ${item.unit}`,
      x + width - 55,
      y + height / 2 - 6,
      { width: 45, align: "right" }
    );
}