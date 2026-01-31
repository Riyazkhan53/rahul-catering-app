import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

const DEFAULT_CHROME_PATH =
  "/opt/render/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome";

export async function generateListPDF(list) {
  const chromePath = process.env.CHROME_PATH || DEFAULT_CHROME_PATH;

  console.log("🖨️ PDF generation started");
  console.log("🌐 Using Chrome at:", chromePath);

  // 🔒 HARD CHECK: Chrome binary
  if (!fs.existsSync(chromePath)) {
    throw new Error(`❌ Chrome binary not found at: ${chromePath}`);
  }

  // 🔒 HARD CHECK: HTML template
  const templatePath = path.join(process.cwd(), "src/templates/list.html");
  console.log("📄 TEMPLATE PATH:", templatePath);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`❌ Template not found at: ${templatePath}`);
  }

  // Read template ONCE
  const htmlTemplate = fs.readFileSync(templatePath, "utf8");

  // Inject data safely
  const finalHTML = htmlTemplate.replace(
    "__DATA__",
    JSON.stringify(list)
  );

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1240, height: 1754 }); // A4 ratio

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
  } catch (err) {
    console.error("❌ PDF ERROR:", err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}