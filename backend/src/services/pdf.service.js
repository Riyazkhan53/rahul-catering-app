import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export async function generateListPDF(list) {
  console.log("🖨️ PDF generation started");

  const templatePath = path.join(
    process.cwd(),
    "src/templates/list.html"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const htmlTemplate = fs.readFileSync(templatePath, "utf8");

  const finalHTML = htmlTemplate.replace(
    "__DATA__",
    JSON.stringify(list)
  );

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1240,
      height: 1754, // A4
    });

    await page.setContent(finalHTML, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        bottom: "12mm",
        left: "10mm",
        right: "10mm",
      },
    });

    console.log("✅ PDF generated successfully");
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}