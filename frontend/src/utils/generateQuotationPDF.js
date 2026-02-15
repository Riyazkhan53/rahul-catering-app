import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateQuotationPDF(data) {
  const {
    quotationNumber,
    date,
    customerName,
    customerPhone,
    customerAddress,
    eventDate,
    eventType,
    numberOfGuests,
    dishes,
    services,
    total,
  } = data;

  // Helper function to replace Rupee symbol with Rs.
  const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;

  // Load the letterhead template
  const letterheadUrl = '/RahulCateringletterpad.pdf';
  const existingPdfBytes = await fetch(letterheadUrl).then((res) => res.arrayBuffer());

  // Load the PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
  // Get the first page (letterhead)
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Define colors
  const orangeColor = rgb(0.976, 0.451, 0.086); // #f97316
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.4, 0.4, 0.4);

  // Starting Y position (from top)
  let yPos = height - 120; // Start below letterhead

  // Quotation Number and Date
  firstPage.drawText(`Quotation No: ${quotationNumber}`, {
    x: 50,
    y: yPos,
    size: 10,
    font: boldFont,
    color: blackColor,
  });

  firstPage.drawText(`Date: ${date}`, {
    x: width - 150,
    y: yPos,
    size: 10,
    font: font,
    color: blackColor,
  });

  yPos -= 30;

  // Customer Details Section
  firstPage.drawText('CUSTOMER DETAILS', {
    x: 50,
    y: yPos,
    size: 11,
    font: boldFont,
    color: orangeColor,
  });

  yPos -= 18;

  firstPage.drawText(`Name: ${customerName}`, {
    x: 50,
    y: yPos,
    size: 9,
    font: font,
    color: blackColor,
  });

  yPos -= 14;

  if (customerPhone) {
    firstPage.drawText(`Phone: ${customerPhone}`, {
      x: 50,
      y: yPos,
      size: 9,
      font: font,
      color: blackColor,
    });
    yPos -= 14;
  }

  if (customerAddress) {
    // Truncate long addresses
    const displayAddress = customerAddress.length > 60 
      ? customerAddress.substring(0, 60) + '...' 
      : customerAddress;
    firstPage.drawText(`Address: ${displayAddress}`, {
      x: 50,
      y: yPos,
      size: 9,
      font: font,
      color: blackColor,
    });
    yPos -= 14;
  }

  yPos -= 10;

  // Event Details
  firstPage.drawText('EVENT DETAILS', {
    x: 50,
    y: yPos,
    size: 11,
    font: boldFont,
    color: orangeColor,
  });

  yPos -= 18;

  firstPage.drawText(`Event Type: ${eventType}`, {
    x: 50,
    y: yPos,
    size: 9,
    font: font,
    color: blackColor,
  });

  firstPage.drawText(`Event Date: ${new Date(eventDate).toLocaleDateString()}`, {
    x: 250,
    y: yPos,
    size: 9,
    font: font,
    color: blackColor,
  });

  yPos -= 14;

  if (numberOfGuests) {
    firstPage.drawText(`Number of Guests: ${numberOfGuests}`, {
      x: 50,
      y: yPos,
      size: 9,
      font: font,
      color: blackColor,
    });
    yPos -= 14;
  }

  yPos -= 10;

  // Menu Items Table
  if (dishes.length > 0) {
    firstPage.drawText('MENU ITEMS', {
      x: 50,
      y: yPos,
      size: 11,
      font: boldFont,
      color: orangeColor,
    });

    yPos -= 18;

    // Table header
    firstPage.drawText('#', { x: 50, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Item Name', { x: 70, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Qty', { x: 280, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Rate', { x: 330, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Amount', { x: 450, y: yPos, size: 8, font: boldFont, color: blackColor });

    yPos -= 15;

    // Draw line
    firstPage.drawLine({
      start: { x: 50, y: yPos + 5 },
      end: { x: width - 50, y: yPos + 5 },
      thickness: 0.5,
      color: grayColor,
    });

    // Table rows
    dishes.forEach((dish, index) => {
      if (yPos < 100) return; // Prevent overflow

      firstPage.drawText(`${index + 1}`, { x: 50, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(dish.name.substring(0, 28), { x: 70, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(`${dish.quantity}`, { x: 285, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(formatCurrency(dish.price), { x: 330, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(formatCurrency(dish.price * dish.quantity), {
        x: 450,
        y: yPos,
        size: 8,
        font: boldFont,
        color: blackColor,
      });

      yPos -= 12;
    });

    yPos -= 10;
  }

  // Additional Services
  if (services.length > 0 && yPos > 150) {
    firstPage.drawText('ADDITIONAL SERVICES', {
      x: 50,
      y: yPos,
      size: 11,
      font: boldFont,
      color: orangeColor,
    });

    yPos -= 18;

    // Table header
    firstPage.drawText('#', { x: 50, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Service Name', { x: 70, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Qty', { x: 280, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Rate', { x: 330, y: yPos, size: 8, font: boldFont, color: blackColor });
    firstPage.drawText('Amount', { x: 450, y: yPos, size: 8, font: boldFont, color: blackColor });

    yPos -= 15;

    // Draw line
    firstPage.drawLine({
      start: { x: 50, y: yPos + 5 },
      end: { x: width - 50, y: yPos + 5 },
      thickness: 0.5,
      color: grayColor,
    });

    // Service rows
    services.forEach((service, index) => {
      if (yPos < 100) return; // Prevent overflow

      firstPage.drawText(`${index + 1}`, { x: 50, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(service.name.substring(0, 28), { x: 70, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(`${service.quantity}`, { x: 285, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(formatCurrency(service.price), { x: 330, y: yPos, size: 8, font: font, color: blackColor });
      firstPage.drawText(formatCurrency(service.price * service.quantity), {
        x: 450,
        y: yPos,
        size: 8,
        font: boldFont,
        color: blackColor,
      });

      yPos -= 12;
    });

    yPos -= 10;
  }

  // Total Amount Box
  if (yPos > 80) {
    // Background box
    firstPage.drawRectangle({
      x: width - 220,
      y: yPos - 30,
      width: 170,
      height: 35,
      color: rgb(1, 0.97, 0.93), // Light orange background
      borderColor: orangeColor,
      borderWidth: 2,
    });

    firstPage.drawText('TOTAL AMOUNT:', {
      x: width - 210,
      y: yPos - 10,
      size: 11,
      font: boldFont,
      color: blackColor,
    });

    firstPage.drawText(formatCurrency(total), {
      x: width - 210,
      y: yPos - 25,
      size: 16,
      font: boldFont,
      color: orangeColor,
    });
  }

  // Footer terms (at bottom)
  const footerY = 80;
  firstPage.drawText('Terms & Conditions:', {
    x: 50,
    y: footerY,
    size: 9,
    font: boldFont,
    color: blackColor,
  });

  firstPage.drawText('• Quotation valid for 15 days  • 50% advance required  • Prices subject to change', {
    x: 50,
    y: footerY - 12,
    size: 7,
    font: font,
    color: grayColor,
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
