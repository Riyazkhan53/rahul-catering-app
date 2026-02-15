import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateMenuPlanPDF(data) {
  const {
    planNumber,
    eventName,
    eventDate,
    eventVenue,
    numberOfGuests,
    numberOfDays,
    days,
    generatedDate,
  } = data;

  // Load the letterhead template
  const letterheadUrl = '/RahulCateringletterpad.pdf';
  const existingPdfBytes = await fetch(letterheadUrl).then((res) => res.arrayBuffer());

  // Load the PDF
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
  // Get the first page (letterhead)
  const pages = pdfDoc.getPages();
  let currentPage = pages[0];
  let { width, height } = currentPage.getSize();

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Define colors
  const orangeColor = rgb(0.976, 0.451, 0.086); // #f97316
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const purpleColor = rgb(0.627, 0.125, 0.941); // Purple for starter
  const blueColor = rgb(0.239, 0.447, 0.933); // Blue for beverages
  const pinkColor = rgb(0.925, 0.286, 0.573); // Pink for sweets

  // Session labels
  const sessionLabels = {
    morning: 'Morning (Breakfast)',
    afternoon: 'Afternoon (Lunch)',
    evening: 'Evening (Snacks)',
    night: 'Night (Dinner)',
  };

  // Starting Y position (from top)
  let yPos = height - 120; // Start below letterhead

  // Menu Plan Number and Date
  currentPage.drawText(`Menu Plan No: ${planNumber}`, {
    x: 50,
    y: yPos,
    size: 10,
    font: boldFont,
    color: blackColor,
  });

  currentPage.drawText(`Date: ${generatedDate}`, {
    x: width - 150,
    y: yPos,
    size: 10,
    font: font,
    color: blackColor,
  });

  yPos -= 30;

  // Event Details Section
  currentPage.drawText('EVENT DETAILS', {
    x: 50,
    y: yPos,
    size: 11,
    font: boldFont,
    color: orangeColor,
  });

  yPos -= 18;

  currentPage.drawText(`Event Name: ${eventName}`, {
    x: 50,
    y: yPos,
    size: 9,
    font: font,
    color: blackColor,
  });

  yPos -= 14;

  currentPage.drawText(`Event Date: ${new Date(eventDate).toLocaleDateString()}`, {
    x: 50,
    y: yPos,
    size: 9,
    font: font,
    color: blackColor,
  });

  if (eventVenue) {
    currentPage.drawText(`Venue: ${eventVenue.substring(0, 40)}`, {
      x: 280,
      y: yPos,
      size: 9,
      font: font,
      color: blackColor,
    });
  }

  yPos -= 14;

  if (numberOfGuests) {
    currentPage.drawText(`Number of Guests: ${numberOfGuests}`, {
      x: 50,
      y: yPos,
      size: 9,
      font: font,
      color: blackColor,
    });
  }

  currentPage.drawText(`Duration: ${numberOfDays} Day${numberOfDays > 1 ? 's' : ''}`, {
    x: 280,
    y: yPos,
    size: 9,
    font: font,
    color: blackColor,
  });

  yPos -= 25;

  // Helper function to check if we need a new page
  const checkPageSpace = (requiredSpace) => {
    if (yPos < requiredSpace + 80) { // 80 for footer
      // Add new page
      currentPage = pdfDoc.addPage([width, height]);
      yPos = height - 60; // Start from top on new page
      return true;
    }
    return false;
  };

  // Helper to get category color
  const getCategoryColor = (categoryId) => {
    switch (categoryId.toLowerCase()) {
      case 'starter':
        return purpleColor;
      case 'main':
      case 'main course':
        return orangeColor;
      case 'sweet':
      case 'sweets':
        return pinkColor;
      case 'beverage':
      case 'beverages':
        return blueColor;
      default:
        return grayColor;
    }
  };

  // Iterate through each day
  days.forEach((day, dayIndex) => {
    // Check if day has any enabled sessions
    const hasEnabledSessions = Object.values(day.sessions).some(
      (session) => session.enabled && Object.keys(session.items).length > 0
    );

    if (!hasEnabledSessions) return;

    checkPageSpace(100);

    // Day Header
    currentPage.drawRectangle({
      x: 45,
      y: yPos - 5,
      width: width - 90,
      height: 25,
      color: rgb(0.976, 0.451, 0.086, 0.1), // Light orange
      borderColor: orangeColor,
      borderWidth: 1.5,
    });

    currentPage.drawText(`Day ${day.day}${day.date ? ` - ${new Date(day.date).toLocaleDateString()}` : ''}`, {
      x: 55,
      y: yPos,
      size: 12,
      font: boldFont,
      color: orangeColor,
    });

    yPos -= 30;

    // Iterate through sessions
    Object.keys(day.sessions).forEach((sessionId) => {
      const session = day.sessions[sessionId];
      
      if (!session.enabled || Object.keys(session.items).length === 0) return;

      checkPageSpace(80);

      // Session Header (without emoji - WinAnsi encoding limitation)
      const sessionLabel = sessionLabels[sessionId] || sessionId;

      currentPage.drawText(`${sessionLabel.toUpperCase()}`, {
        x: 60,
        y: yPos,
        size: 10,
        font: boldFont,
        color: blackColor,
      });

      yPos -= 18;

      // Draw session underline
      currentPage.drawLine({
        start: { x: 60, y: yPos + 5 },
        end: { x: width - 60, y: yPos + 5 },
        thickness: 0.5,
        color: grayColor,
      });

      yPos -= 8;

      // Iterate through categories in this session
      Object.keys(session.items).forEach((categoryId) => {
        const items = session.items[categoryId];
        
        if (!items || items.length === 0) return;

        checkPageSpace(60);

        // Category label
        const categoryLabel = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
        const categoryColor = getCategoryColor(categoryId);

        currentPage.drawText(`${categoryLabel}:`, {
          x: 70,
          y: yPos,
          size: 9,
          font: boldFont,
          color: categoryColor,
        });

        yPos -= 14;

        // List items
        items.forEach((item, itemIndex) => {
          checkPageSpace(40);

          // Truncate long item names
          const displayItem = item.length > 50 ? item.substring(0, 50) + '...' : item;

          currentPage.drawText(`• ${displayItem}`, {
            x: 80,
            y: yPos,
            size: 8,
            font: font,
            color: blackColor,
          });

          yPos -= 12;
        });

        yPos -= 4; // Space between categories
      });

      yPos -= 10; // Space between sessions
    });

    yPos -= 15; // Space between days
  });

  // Footer - Terms and conditions (on last page)
  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  const footerY = 80;
  
  lastPage.drawText('Menu Plan Terms:', {
    x: 50,
    y: footerY,
    size: 9,
    font: boldFont,
    color: blackColor,
  });

  lastPage.drawText('• Menu items subject to availability  • Final quantities to be confirmed 3 days before event', {
    x: 50,
    y: footerY - 12,
    size: 7,
    font: font,
    color: grayColor,
  });

  lastPage.drawText('• Special dietary requirements must be communicated in advance', {
    x: 50,
    y: footerY - 22,
    size: 7,
    font: font,
    color: grayColor,
  });

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
