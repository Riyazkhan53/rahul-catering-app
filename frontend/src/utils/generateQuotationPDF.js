import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Build a reverse lookup: dishId → category name
const CATEGORIZED_DISHES = {
  "Starters": ["s1","s2","s3","s4","s5"],
  "Main Course": ["m1","m2","m3","m4","m5","m6","m7"],
  "Breads": ["b1","b2","b3","b4"],
  "Rice": ["r1","r2","r3"],
  "Side Dishes": ["sd1","sd2","sd3","sd4"],
  "Desserts": ["d1","d2","d3","d4","d5"],
  "Beverages": ["bv1","bv2","bv3","bv4"],
};

function getDishCategory(dishId) {
  for (const [cat, ids] of Object.entries(CATEGORIZED_DISHES)) {
    if (ids.includes(dishId)) return cat;
  }
  return "Other";
}

function groupDishesByCategory(dishes) {
  const groups = {};
  dishes.forEach((dish) => {
    const cat = getDishCategory(dish.id);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(dish);
  });
  return groups;
}

export async function generateQuotationPDF(data) {
  const {
    quotationNumber,
    date,
    customerName,
    customerPhone,
    customerAddress,
    eventType,
    numberOfGuests,
    services,
    total,
  } = data;

  // Backward compatibility: convert old flat dishes + eventDate to new eventDates structure
  let eventDates = data.eventDates;
  if (!eventDates && data.dishes && data.dishes.length > 0) {
    eventDates = [{
      date: data.eventDate || '',
      shifts: { "Menu": { dishes: data.dishes } },
    }];
  }

  const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

  // Load the letterhead template
  const letterheadUrl = '/RahulCateringletterpad.pdf';
  const existingPdfBytes = await fetch(letterheadUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const orangeColor = rgb(0.976, 0.451, 0.086);
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const darkBlue = rgb(0.15, 0.22, 0.38);

  const pages = pdfDoc.getPages();
  let currentPage = pages[0];
  const { width, height } = currentPage.getSize();
  let yPos = height - 120;

  const MARGIN_BOTTOM = 90;

  // Helper: add a new blank page if needed
  const ensureSpace = (needed) => {
    if (yPos - needed < MARGIN_BOTTOM) {
      currentPage = pdfDoc.addPage([width, height]);
      yPos = height - 50;
    }
  };

  const drawText = (text, x, y, size, f, color) => {
    currentPage.drawText(text, { x, y, size, font: f, color });
  };

  const drawLine = (y) => {
    currentPage.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 0.5,
      color: grayColor,
    });
  };

  // --- Header ---
  drawText(`Quotation No: ${quotationNumber}`, 50, yPos, 10, boldFont, blackColor);
  drawText(`Date: ${date}`, width - 150, yPos, 10, font, blackColor);
  yPos -= 28;

  // --- Customer Details ---
  drawText('CUSTOMER DETAILS', 50, yPos, 11, boldFont, orangeColor);
  yPos -= 16;
  drawText(`Name: ${customerName}`, 50, yPos, 9, font, blackColor);
  yPos -= 13;
  if (customerPhone) {
    drawText(`Phone: ${customerPhone}`, 50, yPos, 9, font, blackColor);
    yPos -= 13;
  }
  if (customerAddress) {
    const addr = customerAddress.length > 60 ? customerAddress.substring(0, 60) + '...' : customerAddress;
    drawText(`Address: ${addr}`, 50, yPos, 9, font, blackColor);
    yPos -= 13;
  }
  yPos -= 6;

  // --- Event Details ---
  drawText('EVENT DETAILS', 50, yPos, 11, boldFont, orangeColor);
  yPos -= 16;
  drawText(`Event Type: ${eventType}`, 50, yPos, 9, font, blackColor);
  if (numberOfGuests) {
    drawText(`Guests: ${numberOfGuests}`, 250, yPos, 9, font, blackColor);
  }
  yPos -= 13;

  // List all event dates
  const dateStrings = (eventDates || []).filter((ed) => ed.date).map((ed) =>
    new Date(ed.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  if (dateStrings.length > 0) {
    drawText(`Event Date(s): ${dateStrings.join(', ')}`, 50, yPos, 9, font, blackColor);
    yPos -= 13;
  }
  yPos -= 10;

  // --- Menu Items by Date → Shift → Category ---
  let itemCounter = 0;

  (eventDates || []).forEach((ed) => {
    if (!ed.date) return;
    const shifts = ed.shifts || {};
    const shiftEntries = Object.entries(shifts).filter(([, sd]) => sd.dishes && sd.dishes.length > 0);
    if (shiftEntries.length === 0) return;

    const dateLabel = new Date(ed.date + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    });

    // Date heading
    ensureSpace(30);
    currentPage.drawRectangle({
      x: 50, y: yPos - 4, width: width - 100, height: 18,
      color: rgb(0.96, 0.96, 0.96),
    });
    drawText(dateLabel, 55, yPos, 10, boldFont, darkBlue);
    yPos -= 22;

    shiftEntries.forEach(([shift, shiftData]) => {
      // Shift heading
      ensureSpace(24);
      drawText(`${shift}`, 60, yPos, 9, boldFont, orangeColor);
      yPos -= 16;

      // Group dishes by category
      const catGroups = groupDishesByCategory(shiftData.dishes);

      Object.entries(catGroups).forEach(([category, catDishes]) => {
        // Category heading
        ensureSpace(20);
        drawText(`${category}`, 70, yPos, 8, boldFont, grayColor);
        yPos -= 14;

        // Table header
        ensureSpace(14);
        drawText('#', 80, yPos, 7, boldFont, blackColor);
        drawText('Item', 95, yPos, 7, boldFont, blackColor);
        drawText('Qty', 300, yPos, 7, boldFont, blackColor);
        drawText('Rate', 340, yPos, 7, boldFont, blackColor);
        drawText('Amount', 450, yPos, 7, boldFont, blackColor);
        yPos -= 10;
        drawLine(yPos + 4);

        // Rows
        catDishes.forEach((dish) => {
          ensureSpace(12);
          itemCounter++;
          drawText(`${itemCounter}`, 80, yPos, 7, font, blackColor);
          drawText(dish.name.substring(0, 30), 95, yPos, 7, font, blackColor);
          drawText(`${dish.quantity}`, 305, yPos, 7, font, blackColor);
          drawText(formatCurrency(dish.price), 340, yPos, 7, font, blackColor);
          drawText(formatCurrency(dish.price * dish.quantity), 450, yPos, 7, boldFont, blackColor);
          yPos -= 11;
        });

        yPos -= 4;
      });

      yPos -= 4;
    });

    yPos -= 6;
  });

  // --- Additional Services ---
  if (services && services.length > 0) {
    ensureSpace(40);
    drawText('ADDITIONAL SERVICES', 50, yPos, 11, boldFont, orangeColor);
    yPos -= 16;

    drawText('#', 50, yPos, 8, boldFont, blackColor);
    drawText('Service', 70, yPos, 8, boldFont, blackColor);
    drawText('Qty', 300, yPos, 8, boldFont, blackColor);
    drawText('Rate', 340, yPos, 8, boldFont, blackColor);
    drawText('Amount', 450, yPos, 8, boldFont, blackColor);
    yPos -= 12;
    drawLine(yPos + 4);

    services.forEach((service, index) => {
      ensureSpace(12);
      drawText(`${index + 1}`, 50, yPos, 7, font, blackColor);
      drawText(service.name.substring(0, 30), 70, yPos, 7, font, blackColor);
      drawText(`${service.quantity}`, 305, yPos, 7, font, blackColor);
      drawText(formatCurrency(service.price), 340, yPos, 7, font, blackColor);
      drawText(formatCurrency(service.price * service.quantity), 450, yPos, 7, boldFont, blackColor);
      yPos -= 11;
    });

    yPos -= 10;
  }

  // --- Total Amount Box ---
  ensureSpace(45);
  currentPage.drawRectangle({
    x: width - 220,
    y: yPos - 30,
    width: 170,
    height: 35,
    color: rgb(1, 0.97, 0.93),
    borderColor: orangeColor,
    borderWidth: 2,
  });
  drawText('TOTAL AMOUNT:', width - 210, yPos - 10, 11, boldFont, blackColor);
  drawText(formatCurrency(total), width - 210, yPos - 25, 16, boldFont, orangeColor);

  // --- Footer terms on last page ---
  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  lastPage.drawText('Terms & Conditions:', {
    x: 50, y: 80, size: 9, font: boldFont, color: blackColor,
  });
  lastPage.drawText('• Quotation valid for 15 days  • 50% advance required  • Prices subject to change', {
    x: 50, y: 68, size: 7, font, color: grayColor,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
