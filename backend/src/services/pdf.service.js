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

  /* ---------- LAYOUT CONSTANTS ---------- */
  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 1008;

  const TABLE_WIDTH = 235;
  const ROW_HEIGHT = 28;
  const ROWS_PER_COLUMN = 10;
  const ITEMS_PER_PAGE = ROWS_PER_COLUMN * 2;

  const LEFT_X = 40;
  const RIGHT_X = 320;
  const START_Y = 120;

  /* ---------- PAGINATION ---------- */
  const pages = chunkArray(list.items, ITEMS_PER_PAGE);

  pages.forEach((pageItems, pageIndex) => {
    if (pageIndex > 0) doc.addPage();

    drawHeader(doc, headerLogo);
    drawWatermark(doc, watermark);

    const leftItems = pageItems.slice(0, ROWS_PER_COLUMN);
    const rightItems = pageItems.slice(ROWS_PER_COLUMN);

    drawTable(doc, LEFT_X, START_Y, TABLE_WIDTH, leftItems);
    if (rightItems.length) {
      drawTable(doc, RIGHT_X, START_Y, TABLE_WIDTH, rightItems);
    }

    drawFooter(doc);
  });

  return doc;
}

/* ================= HELPERS ================= */

function drawHeader(doc, headerLogo) {
  doc.image(headerLogo, 40, 30, { width: 220 });

  doc
    .fontSize(10)
    .text("9655264032", 430, 35)
    .text("8248403710", 430, 50);

  doc
    .moveTo(40, 90)
    .lineTo(555, 90)
    .lineWidth(2)
    .strokeColor("#ADC455")
    .stroke();
}

function drawWatermark(doc, watermark) {
  doc.opacity(0.15);
  doc.image(watermark, 170, 320, { width: 260 });
  doc.opacity(1);
}

function drawFooter(doc) {
  doc
    .moveTo(40, 700)
    .lineTo(555, 700)
    .lineWidth(1)
    .strokeColor("#ccc")
    .stroke();

  doc
    .fontSize(10)
    .text(
      "📍 Coonoor, The Nilgiris – 643105 | India",
      40,
      715,
      { align: "center", width: 515 }
    )
    .text(
      "Instagram: @rahul_catering_events",
      40,
      730,
      { align: "center", width: 515 }
    );
}

function drawTable(doc, x, y, width, items) {
  const tableHeight = items.length * 28 + 28;

  doc
    .roundedRect(x, y, width, tableHeight, 10)
    .strokeColor("#ccc")
    .lineWidth(1)
    .stroke();

  doc.rect(x, y, width, 28).fill("#f4f4f4");

  doc
    .fillColor("#000")
    .fontSize(12)
    .text("Items", x + 10, y + 8)
    .text("Qty", x + width - 45, y + 8);

  let currentY = y + 28;

  items.forEach((item) => {
    doc
      .moveTo(x, currentY)
      .lineTo(x + width, currentY)
      .strokeColor("#eee")
      .stroke();

    doc
      .fontSize(11)
      .text(
        `${item.name} / ${item.tamilName || ""}`,
        x + 10,
        currentY + 8,
        { width: width - 70 }
      );

    doc
      .text(
        `${item.quantity} ${item.unit}`,
        x + width - 55,
        currentY + 8,
        { width: 45, align: "right" }
      );

    currentY += 28;
  });
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}