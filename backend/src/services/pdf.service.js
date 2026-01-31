import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

export async function generateListPDF(list) {
  console.log("🖨️ PDF generation started");

  const templatePath = path.join(
    process.cwd(),
    "src/templates/list.html"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error("Template not found");
  }

  const html = fs.readFileSync(templatePath, "utf8");

  const finalHTML = html.replace(
    "__DATA__",
    JSON.stringify(list)
  );

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(finalHTML, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("✅ PDF generated");
    return pdf;
  } finally {
    await browser.close();
  }
}