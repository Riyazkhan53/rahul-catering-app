import PDFDocument from "pdfkit";
import path from "path";

export function generateListPDF(list) {
  const doc = new PDFDocument({
    size: "LEGAL",
    margin: 40,
  });

  /* ---------- ASSETS ---------- */
  const fontTamil = path.join(process.cwd(), "public/fonts/NotoSansTamil-Regular.ttf");
  const headerLogo = path.join(process.cwd(), "assets/headerLogo.png");
  const watermark = path.join(process.cwd(), "assets/roundlogo3.png");

  doc.registerFont("Tamil", fontTamil);
  doc.font("Tamil");

  /* ---------- PAGE CONSTANTS ---------- */
  const PAGE_WIDTH = doc.page.width;
  const PAGE_HEIGHT = doc.page.height;

  const HEADER_Y = 30;
  const HEADER_HEIGHT = 80;

  const FOOTER_HEIGHT = 60;
  const FOOTER_Y = PAGE_HEIGHT - FOOTER_HEIGHT - 20;

  const START_Y = HEADER_Y + HEADER_HEIGHT + 20;

  const TABLE_WIDTH = 235;
  const LEFT_X = 40;
  const RIGHT_X = 320;

  const ROW_PADDING = 6;

  /* ---------- PAGINATION ---------- */
  let index = 0;

  while (index < list.items.length) {
    if (index > 0) doc.addPage();

    drawHeader(doc, headerLogo);
    drawWatermark(doc, watermark);
    drawFooter(doc, FOOTER_Y);

    let leftY = START_Y;
    let rightY = START_Y;

   let renderedAnyRow = false;

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

  // 🔑 IMPORTANT FIX
  if (renderedAnyRow && y + rowHeight > FOOTER_Y - 10) {
    break;
  }

  drawRow(doc, x, y, TABLE_WIDTH, rowHeight, item);

  if (column === "left") leftY += rowHeight;
  else rightY += rowHeight;

  renderedAnyRow = true;
  index++;
}
  }

  return doc;
}

/* ================= HEADER ================= */

function drawHeader(doc, headerLogo) {
  const logoWidth = 260;
  const x = (doc.page.width - logoWidth) / 2;

  doc.image(headerLogo, x, 30, { width: logoWidth });

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

function drawFooter(doc, y) {
  doc
    .moveTo(40, y)
    .lineTo(doc.page.width - 40, y)
    .lineWidth(1)
    .strokeColor("#ccc")
    .stroke();

  doc
    .fontSize(10)
    .text(
      "📍 Coonoor, The Nilgiris – 643105 | India",
      40,
      y + 15,
      { align: "center", width: doc.page.width - 80 }
    )
    .text(
      "Instagram: @rahul_catering_events | 📞 9655264032, 8248403710",
      40,
      y + 30,
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