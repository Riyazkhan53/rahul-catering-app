import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

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

  const letterheadPath = path.join(
    process.cwd(),
    "assets",
    "RahulCateringletterpad.pdf"
  );
  const existingPdfBytes = fs.readFileSync(letterheadPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pages = pdfDoc.getPages();
  let currentPage = pages[0];
  let { width, height } = currentPage.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const orangeColor = rgb(0.976, 0.451, 0.086);
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.4, 0.4, 0.4);
  const purpleColor = rgb(0.627, 0.125, 0.941);
  const blueColor = rgb(0.239, 0.447, 0.933);
  const pinkColor = rgb(0.925, 0.286, 0.573);

  const sessionLabels = {
    morning: "Morning (Breakfast)",
    afternoon: "Afternoon (Lunch)",
    evening: "Evening (Snacks)",
    night: "Night (Dinner)",
  };

  let yPos = height - 120;

  currentPage.drawText(`Menu Plan No: ${planNumber || ""}`, {
    x: 50, y: yPos, size: 10, font: boldFont, color: blackColor,
  });
  currentPage.drawText(`Date: ${generatedDate || ""}`, {
    x: width - 150, y: yPos, size: 10, font, color: blackColor,
  });
  yPos -= 30;

  currentPage.drawText("EVENT DETAILS", {
    x: 50, y: yPos, size: 11, font: boldFont, color: orangeColor,
  });
  yPos -= 18;

  currentPage.drawText(`Event Name: ${eventName || ""}`, {
    x: 50, y: yPos, size: 9, font, color: blackColor,
  });
  yPos -= 14;

  try {
    currentPage.drawText(`Event Date: ${new Date(eventDate).toLocaleDateString()}`, {
      x: 50, y: yPos, size: 9, font, color: blackColor,
    });
  } catch {
    currentPage.drawText(`Event Date: ${eventDate || ""}`, {
      x: 50, y: yPos, size: 9, font, color: blackColor,
    });
  }

  if (eventVenue) {
    currentPage.drawText(`Venue: ${String(eventVenue).substring(0, 40)}`, {
      x: 280, y: yPos, size: 9, font, color: blackColor,
    });
  }
  yPos -= 14;

  if (numberOfGuests) {
    currentPage.drawText(`Number of Guests: ${numberOfGuests}`, {
      x: 50, y: yPos, size: 9, font, color: blackColor,
    });
  }
  currentPage.drawText(`Duration: ${numberOfDays || 1} Day${(numberOfDays || 1) > 1 ? "s" : ""}`, {
    x: 280, y: yPos, size: 9, font, color: blackColor,
  });
  yPos -= 25;

  const checkPageSpace = (requiredSpace) => {
    if (yPos < requiredSpace + 80) {
      currentPage = pdfDoc.addPage([width, height]);
      yPos = height - 60;
      return true;
    }
    return false;
  };

  const getCategoryColor = (categoryId) => {
    switch ((categoryId || "").toLowerCase()) {
      case "starter": return purpleColor;
      case "main": case "main course": return orangeColor;
      case "sweet": case "sweets": return pinkColor;
      case "beverage": case "beverages": return blueColor;
      default: return grayColor;
    }
  };

  (days || []).forEach((day) => {
    const hasEnabledSessions = Object.values(day.sessions || {}).some(
      (session) => session.enabled && Object.keys(session.items || {}).length > 0
    );
    if (!hasEnabledSessions) return;

    checkPageSpace(100);

    currentPage.drawRectangle({
      x: 45, y: yPos - 5, width: width - 90, height: 25,
      color: rgb(0.98, 0.95, 0.92),
      borderColor: orangeColor, borderWidth: 1.5,
    });

    let dateLabel = "";
    if (day.date) {
      try { dateLabel = ` - ${new Date(day.date).toLocaleDateString()}`; } catch { dateLabel = ` - ${day.date}`; }
    }
    currentPage.drawText(`Day ${day.day}${dateLabel}`, {
      x: 55, y: yPos, size: 12, font: boldFont, color: orangeColor,
    });
    yPos -= 30;

    Object.keys(day.sessions || {}).forEach((sessionId) => {
      const session = day.sessions[sessionId];
      if (!session.enabled || Object.keys(session.items || {}).length === 0) return;

      checkPageSpace(80);

      const sessionLabel = sessionLabels[sessionId] || sessionId;
      currentPage.drawText(`${sessionLabel.toUpperCase()}`, {
        x: 60, y: yPos, size: 10, font: boldFont, color: blackColor,
      });
      yPos -= 18;

      currentPage.drawLine({
        start: { x: 60, y: yPos + 5 }, end: { x: width - 60, y: yPos + 5 },
        thickness: 0.5, color: grayColor,
      });
      yPos -= 8;

      Object.keys(session.items || {}).forEach((categoryId) => {
        const items = session.items[categoryId];
        if (!items || items.length === 0) return;

        checkPageSpace(60);

        const categoryLabel = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
        const categoryColor = getCategoryColor(categoryId);

        currentPage.drawText(`${categoryLabel}:`, {
          x: 70, y: yPos, size: 9, font: boldFont, color: categoryColor,
        });
        yPos -= 14;

        items.forEach((item) => {
          checkPageSpace(40);
          const displayItem = String(item || "").length > 50 ? String(item).substring(0, 50) + "..." : String(item || "");
          currentPage.drawText(`- ${displayItem}`, {
            x: 80, y: yPos, size: 8, font, color: blackColor,
          });
          yPos -= 12;
        });
        yPos -= 4;
      });
      yPos -= 10;
    });
    yPos -= 15;
  });

  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  const footerY = 80;

  lastPage.drawText("Menu Plan Terms:", {
    x: 50, y: footerY, size: 9, font: boldFont, color: blackColor,
  });
  lastPage.drawText("* Menu items subject to availability  * Final quantities to be confirmed 3 days before event", {
    x: 50, y: footerY - 12, size: 7, font, color: grayColor,
  });
  lastPage.drawText("* Special dietary requirements must be communicated in advance", {
    x: 50, y: footerY - 22, size: 7, font, color: grayColor,
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
