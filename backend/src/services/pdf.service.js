// backend/src/services/pdf.service.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateListPDF(list) {
  const doc = new PDFDocument({
    size: "LEGAL",
    margin: 40,
  });

  const fontTamil = path.join(
    process.cwd(),
    "public/fonts/NotoSansTamil-Regular.ttf"
  );

  const headerLogo = path.join(
    process.cwd(),
    "/assets/headerLogo.png"
  );

  const watermark = path.join(
    process.cwd(),
    "/assets/roundlogo3.png"
  );

  doc.registerFont("Tamil", fontTamil);
  doc.font("Tamil");

  /* ================= HEADER ================= */

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

  /* ================= WATERMARK ================= */

  doc.opacity(0.15);
  doc.image(watermark, 170, 220, { width: 260 });
  doc.opacity(1);

  /* ================= TABLE LAYOUT ================= */

  const startY = 120;
  const tableWidth = 235;
  const rowHeight = 28;
  const rowsPerColumn = 10;

  const leftX = 40;
  const rightX = 320;

  const leftItems = list.items.slice(0, rowsPerColumn);
  const rightItems = list.items.slice(rowsPerColumn);

  drawTable(doc, leftX, startY, tableWidth, leftItems);
  if (rightItems.length > 0) {
    drawTable(doc, rightX, startY, tableWidth, rightItems);
  }

  /* ================= FOOTER ================= */

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

  return doc;
}

/* ================= TABLE FUNCTION ================= */

function drawTable(doc, x, y, width, items) {
  const rowHeight = 28;

  // Outer box
  doc
    .roundedRect(x, y, width, 330, 10)
    .strokeColor("#ccc")
    .lineWidth(1)
    .stroke();

  // Header
  doc
    .rect(x, y, width, rowHeight)
    .fill("#f4f4f4");

  doc
    .fillColor("#000")
    .fontSize(12)
    .text("Items", x + 10, y + 8)
    .text("Qty", x + width - 45, y + 8);

  let currentY = y + rowHeight;

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

    currentY += rowHeight;
  });
}