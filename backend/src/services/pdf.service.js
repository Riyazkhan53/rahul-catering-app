import PDFDocument from "pdfkit";
import path from "path";

export function generateListPDF(list) {
  const doc = new PDFDocument({
    size: "LEGAL", // 612 x 1008 points
    margin: 40,
  });

  /* ---------- ASSETS ---------- */
  const fontTamil = path.join(process.cwd(), "public/fonts/NotoSansTamil-Regular.ttf");
  const headerLogo = path.join(process.cwd(), "assets/headerLogo.png");
  const watermark = path.join(process.cwd(), "assets/roundlogo3.png");

  doc.registerFont("Tamil", fontTamil);
  doc.font("Tamil");

  /* ---------- LAYOUT CONSTANTS ---------- */
  const PAGE_WIDTH = doc.page.width;
  const PAGE_HEIGHT = doc.page.height;

  const START_Y = 120;
  const FOOTER_HEIGHT = 60; 
  const FOOTER_Y = PAGE_HEIGHT - FOOTER_HEIGHT - 40; // 40 is bottom margin

  const TABLE_WIDTH = 245; // Adjusted for Legal width
  const ROW_HEIGHT = 28;
  
  // DYNAMIC CALCULATION:
  // Available height = Footer start - Table start - Header row height
  const AVAILABLE_TABLE_HEIGHT = FOOTER_Y - START_Y - ROW_HEIGHT;
  const ROWS_PER_COLUMN = Math.floor(AVAILABLE_TABLE_HEIGHT / ROW_HEIGHT);
  const ITEMS_PER_PAGE = ROWS_PER_COLUMN * 2;

  const LEFT_X = 40;
  const RIGHT_X = PAGE_WIDTH - TABLE_WIDTH - 40;

  /* ---------- PAGINATION ---------- */
  const pages = chunkArray(list.items, ITEMS_PER_PAGE);

  pages.forEach((pageItems, pageIndex) => {
    if (pageIndex > 0) doc.addPage();

    drawHeader(doc, headerLogo);
    drawWatermark(doc, watermark, PAGE_WIDTH, PAGE_HEIGHT);

    const leftItems = pageItems.slice(0, ROWS_PER_COLUMN);
    const rightItems = pageItems.slice(ROWS_PER_COLUMN);

    // Pass the calculated ROWS_PER_COLUMN so tables stay equal height
    drawTable(doc, LEFT_X, START_Y, TABLE_WIDTH, leftItems, ROWS_PER_COLUMN);
    
    if (rightItems.length) {
      drawTable(doc, RIGHT_X, START_Y, TABLE_WIDTH, rightItems, ROWS_PER_COLUMN);
    }

    drawFooter(doc, FOOTER_Y, PAGE_WIDTH);
  });

  return doc;
}

/* ================= HELPERS ================= */

function drawHeader(doc, headerLogo) {
  // Use the cropped image you requested
  doc.image(headerLogo, 40, 30, { width: 530 }); 

  doc
    .moveTo(40, 100)
    .lineTo(572, 100)
    .lineWidth(2)
    .strokeColor("#ADC455")
    .stroke();
}

function drawWatermark(doc, watermark, pw, ph) {
  doc.save(); // Save state
  doc.opacity(0.1);
  doc.image(watermark, (pw/2) - 150, (ph/2) - 150, { width: 300 });
  doc.restore(); // Restore opacity for rest of content
}

function drawFooter(doc, y, pw) {
  doc
    .moveTo(40, y)
    .lineTo(pw - 40, y)
    .lineWidth(1)
    .strokeColor("#ccc")
    .stroke();

  doc
    .fillColor("#444")
    .fontSize(10)
    .text(
      "📍 Coonoor, The Nilgiris – 643105 | India",
      40,
      y + 15,
      { align: "center", width: pw - 80 }
    )
    .text(
      "Instagram: @rahul_catering_events",
      40,
      y + 30,
      { align: "center", width: pw - 80 }
    );
}

function drawTable(doc, x, y, width, items, maxRows) {
  const ROW_H = 28;
  const tableHeight = (maxRows + 1) * ROW_H;

  // Draw Table Border
  doc
    .roundedRect(x, y, width, tableHeight, 8)
    .strokeColor("#ccc")
    .lineWidth(1)
    .stroke();

  // Header Background
  doc.rect(x + 1, y + 1, width - 2, ROW_H - 1).fill("#f4f4f4");

  doc
    .fillColor("#000")
    .fontSize(11)
    .text("Items", x + 10, y + 8)
    .text("Qty", x + width - 50, y + 8, { width: 40, align: 'right' });

  let currentY = y + ROW_H;

  items.forEach((item) => {
    // 1. Draw the row separator line
    doc
      .moveTo(x, currentY)
      .lineTo(x + width, currentY)
      .strokeColor("#eee")
      .stroke();

    const mainText = `${item.name} / ${item.tamilName || ""}`;
    const commentText = item.comment ? ` (${item.comment})` : "";
    const fullText = mainText + commentText;

    // 2. Dynamic Font Sizing
    // If the text is very long, we shrink it slightly to prevent overflow
    const fontSize = fullText.length > 40 ? 8 : 9;

    // 3. Draw the Item Text (with Comment)
    doc
      .fillColor("#333")
      .font("Tamil")
      .fontSize(fontSize)
      .text(mainText, x + 10, currentY + 5, { // Adjusted Y offset for better centering
        width: width - 75,
        height: ROW_H - 5,
        ellipsis: true, // Adds "..." if it still doesn't fit
        continued: !!item.comment
      });

    if (item.comment) {
      doc
        .fillColor("#777") // Lighter color for comments
        .text(commentText, {
          width: width - 75,
        });
    }

    // 4. Draw the Quantity (Aligned to the right)
    // We use the same Y as the start of the row to keep it clean
    doc
      .fillColor("#000")
      .fontSize(10)
      .text(
        `${item.quantity} ${item.unit}`,
        x + width - 60,
        currentY + 8, 
        { width: 50, align: "right" }
      );

    currentY += ROW_H;
  });
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}